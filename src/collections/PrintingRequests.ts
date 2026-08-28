import type { CollectionConfig } from 'payload'
import { Resend } from 'resend'


export const PrintingRequests: CollectionConfig = {
  slug: 'printing-requests',
  labels: {
    singular: '3D Printing Request',
    plural: '3D Printing Requests',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'createdAt', 'quickActions'],
    pagination: {
      defaultLimit: 10,
    },
  },
  defaultSort: '-createdAt',
  access: {
    create: () => true,
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation }) => {
        const apiKey = process.env.RESEND_API_KEY
        if (!apiKey) {
          console.warn('RESEND_API_KEY is missing. Skipping email notifications.')
          return
        }
        const resend = new Resend(apiKey)

        if (operation === 'create') {
          // Send email to admin about new order
          try {
            const { data, error } = await resend.emails.send({
              from: 'Kabya 3D Printing <noreply@orders.kabyac.tech>',
              to: 'kabyaghosh4@gmail.com',
              subject: 'New 3D Printing Order Received!',
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2>New Order from ${doc.name}</h2>
                  <p><strong>Email:</strong> ${doc.email}</p>
                  <p><strong>Material:</strong> ${doc.material}</p>
                  <p><strong>Color:</strong> ${doc.color}</p>
                  <p><strong>Expected Price:</strong> ${doc.price} BDT</p>
                  <p>Log in to the admin panel to review the model and approve the price.</p>
                </div>
              `
            })
            if (error) {
              console.error('Failed to send new order email to admin:', error)
            } else {
              console.log(`Successfully sent new order email to admin for order ${doc.id}`, data)
            }
          } catch (catchError) {
            console.error('Failed to execute email send:', catchError)
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
              const { data, error } = await resend.emails.send({
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
              if (error) {
                console.error('Failed to send approval email:', error)
              } else {
                console.log(`Successfully sent approval email to ${doc.email} for order ${doc.id}`, data)
              }
            } catch (catchError) {
              console.error('Failed to execute email send:', catchError)
            }
          }

          // If status changes to Rejected
          if (
            doc.status === 'Rejected' &&
            previousDoc.status !== 'Rejected'
          ) {
            try {
              const { data, error } = await resend.emails.send({
                from: 'Kabya 3D Printing <noreply@orders.kabyac.tech>',
                to: doc.email, // Send to applicant
                subject: 'Update on Your 3D Printing Order',
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Hello, ${doc.name}</h2>
                    <p>Unfortunately, we cannot process your 3D printing request at this time.</p>
                    <p>This may be due to a non-printable geometry, an extremely large file, or material constraints. Please contact our support team on WhatsApp if you would like to discuss modifications to your model to make it printable.</p>
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                    <p style="color: #666; font-size: 14px;">Thank you for choosing Kabya Ghosh 3D Printing Service!</p>
                  </div>
                `
              })
              if (error) {
                console.error('Failed to send rejection email:', error)
              } else {
                console.log(`Successfully sent rejection email to ${doc.email} for order ${doc.id}`, data)
              }
            } catch (catchError) {
              console.error('Failed to execute email send:', catchError)
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
      options: ['Pending', 'Approved', 'Rejected', 'Completed', 'Delivered'],
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
    {
      name: 'quickActions',
      type: 'ui',
      admin: {
        components: {
          Cell: '@/components/Admin/QuickActionsCell#QuickActionsCell',
        },
      },
    },
  ],
}
