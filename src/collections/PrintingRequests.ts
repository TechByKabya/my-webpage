import type { CollectionConfig } from 'payload'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const PrintingRequests: CollectionConfig = {
  slug: 'printing-requests',
  labels: {
    singular: '3D Printing Request',
    plural: '3D Printing Requests',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation }) => {
        if (operation === 'create') {
          // Send email to admin about new order
          try {
            await resend.emails.send({
              from: 'Kabya 3D Printing <noreply@orders.kabyac.tech>',
              to: 'kabyaghosh4@gmail.com',
              subject: 'New 3D Printing Order Received!',
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2>New Order from ${doc.name}</h2>
                  <p><strong>Email:</strong> ${doc.email}</p>
                  <p><strong>Material:</strong> ${doc.material}</p>
                  <p><strong>Color:</strong> ${doc.color}</p>
                  <p>Please check the admin panel to review the model and approve with a price.</p>
                </div>
              `
            })
            console.log(`Successfully sent new order email to admin for order ${doc.id}`)
          } catch (error) {
            console.error('Failed to send email:', error)
          }
        }

        if (operation === 'update') {
          // If status changes to Approved and price is set
          if (
            doc.status === 'Approved' &&
            previousDoc.status !== 'Approved' &&
            doc.price > 0
          ) {
            try {
              await resend.emails.send({
                from: 'Kabya 3D Printing <noreply@orders.kabyac.tech>',
                to: doc.email, // Send to applicant
                subject: 'Your 3D Printing Order is Approved!',
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Great news, ${doc.name}!</h2>
                    <p>Your 3D printing request has been reviewed and approved.</p>
                    <p><strong>Total Price:</strong> ${doc.price} BDT</p>
                    <p><strong>Next Steps:</strong></p>
                    <ol>
                      <li>Send the total amount to this bKash number: <strong>01950440296</strong></li>
                      <li>Take a screenshot of the successful transaction.</li>
                      <li>Contact our support agent on WhatsApp with the screenshot to confirm your order.</li>
                    </ol>
                    <p>We are ready to start printing your model using <strong>${doc.material}</strong> in <strong>${doc.color}</strong>.</p>
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                    <p style="color: #666; font-size: 14px;">Thank you for choosing Kabya Ghosh 3D Printing Service!</p>
                  </div>
                `
              })
              console.log(`Successfully sent approval email to ${doc.email} for order ${doc.id}`)
            } catch (error) {
              console.error('Failed to send email:', error)
            }
          }

          // If status changes to Rejected
          if (
            doc.status === 'Rejected' &&
            previousDoc.status !== 'Rejected'
          ) {
            try {
              await resend.emails.send({
                from: 'Kabya 3D Printing <noreply@orders.kabyac.tech>',
                to: doc.email, // Send to applicant
                subject: 'Update on your 3D Printing Order',
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Hello ${doc.name},</h2>
                    <p>We have reviewed your 3D printing request, but unfortunately, we are unable to fulfill it at this time.</p>
                    ${doc.adminNotes ? `<p><strong>Reason:</strong> ${doc.adminNotes}</p>` : ''}
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                    <p style="color: #666; font-size: 14px;">If you have any questions, feel free to reach out to us.</p>
                  </div>
                `
              })
              console.log(`Successfully sent rejection email to ${doc.email} for order ${doc.id}`)
            } catch (error) {
              console.error('Failed to send email:', error)
            }
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'address',
      type: 'textarea',
      required: true,
    },
    {
      name: 'fileLink',
      type: 'text',
      required: true,
      admin: {
        description: 'Link to the 3D model (Google Drive, WeTransfer, Dropbox)',
      },
    },
    {
      name: 'material',
      type: 'text',
      required: true,
    },
    {
      name: 'color',
      type: 'text',
      required: true,
    },
    {
      name: 'infill',
      type: 'select',
      options: ['10%', '20%', '50%', '100% (Solid)'],
      required: true,
    },
    {
      name: 'layerHeight',
      type: 'select',
      options: ['0.12mm (High Detail)', '0.20mm (Standard)', '0.28mm (Draft/Fast)'],
      required: true,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    // Admin Side Fields
    {
      name: 'status',
      type: 'select',
      options: ['Pending', 'Approved', 'Rejected', 'Completed'],
      defaultValue: 'Pending',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'price',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Set a price to notify the user upon approval.',
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
