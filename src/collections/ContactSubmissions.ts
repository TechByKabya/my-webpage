import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { Resend } from 'resend'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Contact Submission',
    plural: 'Contact Submissions',
  },
  admin: {
    // Removed hidden: true to make the collection visible in the admin sidebar
    group: '\u200B\u200BContact',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'status', 'createdAt'],
    description: 'Messages submitted through the contact form on the website.',
  },
  access: {
    create: anyone,       // Public can submit
    read: authenticated,  // Only admins can view
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Only trigger on update when the checkbox is explicitly checked
        if (operation === 'update' && data.sendReplyEmail === true) {
          const resendApiKey = process.env.RESEND_API_KEY
          
          if (resendApiKey && data.adminReply) {
            const resend = new Resend(resendApiKey)
            
            try {
              await resend.emails.send({
                from: 'no-reply@orders.kabyac.tech',
                to: data.email,
                subject: `Re: ${data.subject || 'Your Message to Kabya Ghosh'}`,
                text: data.adminReply,
                html: `<div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                  <p>Hi ${data.name},</p>
                  <p style="white-space: pre-wrap;">${data.adminReply}</p>
                  <br/>
                  <p>Best regards,<br/>Kabya Ghosh</p>
                  <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                  <p style="font-size: 0.9em; color: #888;">On ${new Date(data.createdAt || Date.now()).toLocaleDateString()}, you wrote:</p>
                  <blockquote style="border-left: 3px solid #ccc; padding-left: 10px; color: #666; white-space: pre-wrap;">
                    ${data.message}
                  </blockquote>
                </div>`
              })

              // Update the status to 'replied' automatically
              data.status = 'replied'
              req.payload.logger.info(`Successfully sent reply email to ${data.email}`)
            } catch (error) {
              req.payload.logger.error(`Error sending contact reply email: ${error}`)
            }
          }
          
          // Always uncheck the box after processing, whether it succeeded or failed (or lacked an API key)
          data.sendReplyEmail = false
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full Name',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'subject',
      type: 'text',
      label: 'Subject',
      admin: { readOnly: true },
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'adminReply',
      type: 'textarea',
      label: 'Admin Reply',
      admin: {
        description: 'Type your message here. Check the box in the sidebar and save to email this reply to the user.',
      }
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'new',
      options: [
        { label: '🔵 New', value: 'new' },
        { label: '👀 Read', value: 'read' },
        { label: '✅ Replied', value: 'replied' },
        { label: '🗑️ Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'sendReplyEmail',
      type: 'checkbox',
      label: 'Send Reply Email via Resend',
      defaultValue: false,
      admin: {
        description: 'Check this box and click Save to instantly send the reply to the user.',
        position: 'sidebar'
      }
    }
  ],
  timestamps: true,
}
