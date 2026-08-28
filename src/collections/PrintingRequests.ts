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
        if (operation === 'update') {
          // If status changes to Approved and price is set
          if (
            doc.status === 'Approved' &&
            previousDoc.status !== 'Approved' &&
            doc.price > 0
          ) {
            try {
              await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: 'kabyaghosh4@gmail.com', // Sending to your verified email for testing since onboarding@resend.dev is restricted
                subject: 'Your 3D Printing Order is Approved!',
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Great news, ${doc.name}!</h2>
                    <p>Your 3D printing request has been reviewed and approved.</p>
                    <p><strong>Total Price:</strong> $${doc.price}</p>
                    <p>We are ready to start printing your model using <strong>${doc.material}</strong> in <strong>${doc.color}</strong>.</p>
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                    <p style="color: #666; font-size: 14px;">Thank you for choosing Kabya Ghosh 3D Printing Service!</p>
                  </div>
                `
              })
              console.log(\`Successfully sent approval email for order \${doc.id}\`)
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
      type: 'select',
      options: ['PLA', 'PETG', 'ABS', 'Resin', 'TPU (Flexible)', 'Carbon Fiber'],
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
