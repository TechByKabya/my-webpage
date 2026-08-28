import type { CollectionConfig } from 'payload'
import { Resend } from 'resend'
import { sendSMS } from '../utilities/sendSMS'


export const PrintingRequests: CollectionConfig = {
  slug: 'printing-requests',
  labels: {
    singular: '3D Printing Request',
    plural: '3D Printing Requests',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'createdAt', 'status'],
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
                  <p><strong>Phone:</strong> ${doc.phone}</p>
                  <p><strong>Order Type:</strong> ${doc.orderType}</p>
                  <p><strong>Material:</strong> ${doc.material}</p>
                  <p><strong>Color:</strong> ${doc.color}</p>
                  <p>Log in to the admin panel to review.</p>
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

          // Send confirmation to User (Email & SMS)
          if (doc.phone) {
            await sendSMS(doc.phone, `Hi ${doc.name}, we received your 3D printing request. We will review it and get back to you shortly. - Kabya 3D Printing`)
          }

          // Send SMS to Admin
          const adminPhone = process.env.ADMIN_PHONE_NUMBER
          if (adminPhone) {
            await sendSMS(adminPhone, `New 3D Print Order from ${doc.name}! Type: ${doc.orderType}, Material: ${doc.material}`)
          }
        }

        if (operation === 'update') {
          // If status changes to Payment Requested and price is set
          if (
            doc.status === 'Payment Requested' &&
            previousDoc.status !== 'Payment Requested' &&
            doc.price > 0
          ) {
            try {
              const { data, error } = await resend.emails.send({
                from: 'Kabya 3D Printing <noreply@orders.kabyac.tech>',
                to: doc.email, // Send to applicant
                subject: 'Payment Requested for your 3D Printing Order!',
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Great news, ${doc.name}!</h2>
                    <p>Your 3D printing request has been reviewed and approved.</p>
                    <p><strong>Total Price:</strong> ${doc.price} BDT</p>
                    <p><strong>Next Steps:</strong></p>
                    <ol>
                      <li>Send the total amount to this bKash/Nagad number: <strong>01950440296</strong> (Send Money)</li>
                      <li>Take a screenshot of the successful transaction.</li>
                      <li>Contact our support agent on WhatsApp with the screenshot to confirm your order using this link: <a href="https://wa.me/qr/7RBXRALWHAPNA1">https://wa.me/qr/7RBXRALWHAPNA1</a></li>
                    </ol>
                    <p>We are ready to start working on your project using <strong>${doc.material}</strong> in <strong>${doc.color}</strong>.</p>
                    <p style="color: red; font-size: 13px;"><em>Note: Payments are non-refundable once printing begins. Please ensure you send money to the correct number, as we are not responsible for wrong transactions.</em></p>
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                    <p style="color: #666; font-size: 14px;">Thank you for choosing Kabya Ghosh 3D Printing Service!</p>
                  </div>
                `
              })
            } catch (catchError) {
              console.error('Failed to execute email send:', catchError)
            }

            if (doc.phone) {
              await sendSMS(doc.phone, `Your 3D print order is approved! Price: ${doc.price} BDT. Send money to 01950440296 and share screenshot on WhatsApp: https://wa.me/qr/7RBXRALWHAPNA1`)
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
                    <p>This may be due to a non-printable geometry, an extremely large file, or material constraints. Please contact our support team on WhatsApp if you would like to discuss modifications.</p>
                    ${doc.adminNotes ? `<p><strong>Admin Note:</strong> ${doc.adminNotes}</p>` : ''}
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                    <p style="color: #666; font-size: 14px;">Thank you for choosing Kabya Ghosh 3D Printing Service!</p>
                  </div>
                `
              })
            } catch (catchError) {
              console.error('Failed to execute email send:', catchError)
            }

            if (doc.phone) {
              await sendSMS(doc.phone, `Hi ${doc.name}, unfortunately your 3D print order was rejected. Please check your email for details or contact us on WhatsApp.`)
            }
          }

          // If status changes to Suggestion Given
          if (
            doc.status === 'Suggestion Given' &&
            previousDoc.status !== 'Suggestion Given'
          ) {
            try {
              const { data, error } = await resend.emails.send({
                from: 'Kabya 3D Printing <noreply@orders.kabyac.tech>',
                to: doc.email, // Send to applicant
                subject: 'Suggestion regarding your 3D Printing Order',
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Hello, ${doc.name}</h2>
                    <p>We have reviewed your 3D printing request and have a suggestion for you:</p>
                    <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
                      ${doc.adminNotes}
                    </blockquote>
                    <p>Please contact our support team on WhatsApp using this link: <a href="https://wa.me/qr/7RBXRALWHAPNA1">https://wa.me/qr/7RBXRALWHAPNA1</a></p>
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                    <p style="color: #666; font-size: 14px;">Thank you!</p>
                  </div>
                `
              })
            } catch (catchError) {
              console.error('Failed to execute email send:', catchError)
            }

            if (doc.phone) {
              await sendSMS(doc.phone, `Hi ${doc.name}, we left a suggestion for your order. Please check your email and reply on WhatsApp: https://wa.me/qr/7RBXRALWHAPNA1`)
            }
          }

          // If status changes to Delivered
          if (
            doc.status === 'Delivered' &&
            previousDoc.status !== 'Delivered'
          ) {
            try {
              const { data, error } = await resend.emails.send({
                from: 'Kabya 3D Printing <noreply@orders.kabyac.tech>',
                to: doc.email, // Send to applicant
                subject: 'Your 3D Printing Order is Delivered!',
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Great news, ${doc.name}!</h2>
                    <p>Your 3D printing order has been successfully delivered.</p>
                    <p>We hope you are satisfied with the result. If you have any feedback or need further assistance, please contact our support team on WhatsApp.</p>
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                    <p style="color: #666; font-size: 14px;">Thank you for choosing Kabya Ghosh 3D Printing Service!</p>
                  </div>
                `
              })
            } catch (catchError) {
              console.error('Failed to execute email send:', catchError)
            }

            if (doc.phone) {
              await sendSMS(doc.phone, `Hi ${doc.name}, your 3D print order has been delivered! Thank you for choosing us.`)
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
      name: 'orderType',
      type: 'select',
      options: ['CAD Model Provided', 'Idea / Need CAD Design'],
      required: true,
      defaultValue: 'CAD Model Provided',
    },
    {
      name: 'fileLink',
      type: 'text',
      required: false,
      admin: {
        description: 'Link to the 3D model (if CAD Model Provided)',
      },
    },
    {
      name: 'ideaDescription',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Idea and dimensions (if Need CAD Design)',
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
      options: ['Pending', 'Approved', 'Payment Requested', 'Rejected', 'Suggestion Given', 'Completed', 'Delivered'],
      defaultValue: 'Pending',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/Admin/HiddenField#HiddenField',
          Cell: '@/components/Admin/StatusCell#StatusCell',
        }
      },
    },
    {
      name: 'price',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Set a price to notify the user upon approval.',
        components: {
          Field: '@/components/Admin/HiddenField#HiddenField',
        }
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/Admin/HiddenField#HiddenField',
        }
      },
    },
    {
      name: 'quickActions',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/Admin/QuickActionsField#QuickActionsField',
        },
      },
    },
  ],
}
