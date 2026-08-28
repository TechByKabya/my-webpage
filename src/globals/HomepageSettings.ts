import type { GlobalConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'

export const HomepageSettings: GlobalConfig = {
  slug: 'homepage-settings',
  label: 'Homepage Settings',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: ' ',
  },
  fields: [
    // ── SIDEBAR ASSETS ───────────────────────────────────
    {
      name: 'heroPhoto',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero Profile Photo',
      admin: {
        position: 'sidebar',
        description: 'Displayed at the top of the homepage next to your bio.',
      },
    },
    {
      name: 'footerVideoBg',
      type: 'upload',
      relationTo: 'media',
      label: 'Footer Background Video',
      admin: {
        position: 'sidebar',
        description: 'Optional looping video behind the contact section.',
      },
    },
    // ── MAIN CONTENT TABS ────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        // ── NAVIGATION TAB ──────────────────────────────
        {
          label: 'Navigation',
          description: 'Manage the links shown in the top navigation bar.',
          fields: [
            {
              name: 'menuItems',
              type: 'array',
              label: 'Menu Links',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      admin: { width: '33%' },
                    },
                    {
                      name: 'link',
                      type: 'text',
                      required: true,
                      admin: {
                        width: '33%',
                        description: 'URL or anchor link (e.g., #hero, #projects)',
                      },
                    },
                    {
                      name: 'isButton',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        width: '33%',
                        description: 'Render as a highlighted button',
                        style: { alignSelf: 'flex-end', paddingBottom: '10px' }
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        // ── HERO TAB ────────────────────────────────────
        {
          label: 'Hero Section',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'heroBadgeText',
                  type: 'text',
                  label: 'Badge Text',
                  defaultValue: 'Based in Bangladesh',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'heroTitle',
              type: 'textarea',
              label: 'Hero Title (Use newline for breaks)',
              defaultValue: 'Design.\nBuild.\nLearn.',
              required: true,
            },
            {
              name: 'heroBio',
              type: 'textarea',
              label: 'Bio / Description',
              defaultValue: 'I work where hardware and software meet — building practical projects, helping teams, and learning along the way.',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'heroFloatCard1Icon',
                  type: 'text',
                  label: 'Float Card 1 Icon Class (FontAwesome)',
                  defaultValue: 'fas fa-bolt',
                  admin: { width: '50%' },
                },
                {
                  name: 'heroFloatCard1Text',
                  type: 'text',
                  label: 'Float Card 1 Text',
                  defaultValue: ' & IoT',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'heroFloatCard2Icon',
                  type: 'text',
                  label: 'Float Card 2 Icon Class (FontAwesome)',
                  defaultValue: 'fas fa-brain',
                  admin: { width: '50%' },
                },
                {
                  name: 'heroFloatCard2Text',
                  type: 'text',
                  label: 'Float Card 2 Text',
                  defaultValue: 'AIOT',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        // ── SKILLS TAB ──────────────────────────────────
        {
          label: 'Skills',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'skillsSectionTitle',
                  type: 'text',
                  label: 'Section Title',
                  defaultValue: 'Core Competencies',
                  admin: { width: '50%' },
                },
                {
                  name: 'skillsSectionSubtitle',
                  type: 'text',
                  label: 'Section Subtitle',
                  defaultValue: 'From hardware to software — the tools and technologies I use to bring ideas to life.',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'skills',
              type: 'array',
              label: 'Skills List',
              admin: {
                description: 'Add or remove skills. Each shows as a card with an icon, name, and description.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      label: 'Skill Name',
                      required: true,
                      admin: { width: '33%' },
                    },
                    {
                      name: 'icon',
                      type: 'select',
                      label: 'Icon',
                      options: [
                        { label: 'Microchip (Embedded)', value: 'microchip' },
                        { label: 'WiFi/Radio (IoT)', value: 'iot' },
                        { label: 'Layers (3D Printing)', value: '3d' },
                        { label: 'Code (Web Dev)', value: 'code' },
                        { label: 'Box 3D (CAD / Fusion 360)', value: 'cad' },
                        { label: 'Brain (AI / ML)', value: 'ai' },
                        { label: 'Wrench (Hardware)', value: 'hardware' },
                        { label: 'Circuit (Electronics)', value: 'electronics' },
                        { label: 'Camera (Computer Vision)', value: 'cv' },
                        { label: 'Python (Programming)', value: 'python' },
                      ],
                      defaultValue: 'microchip',
                      admin: { width: '33%' },
                    },
                    {
                      name: 'color',
                      type: 'select',
                      label: 'Card Accent Color',
                      options: [
                        { label: 'Indigo', value: 'indigo' },
                        { label: 'Blue', value: 'blue' },
                        { label: 'Green', value: 'green' },
                        { label: 'Amber', value: 'amber' },
                        { label: 'Red', value: 'red' },
                        { label: 'Purple', value: 'purple' },
                        { label: 'Teal', value: 'teal' },
                        { label: 'Pink', value: 'pink' },
                      ],
                      defaultValue: 'indigo',
                      admin: { width: '33%' },
                    },
                  ],
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Short Description (e.g. "STM32, ESP32, RTOS")',
                },
              ],
              defaultValue: [
                { name: 'Embedded Systems', description: 'STM32, ESP32, AVR, RTOS', icon: 'microchip', color: 'indigo' },
                { name: 'IoT', description: 'MQTT, Wi-Fi, BLE, LoRa', icon: 'iot', color: 'blue' },
                { name: '3D Printing', description: 'FDM, Resin, Slicing, Design', icon: '3d', color: 'green' },
                { name: 'Web Development', description: 'Next.js, React, Node.js', icon: 'code', color: 'amber' },
                { name: 'Fusion 360', description: 'CAD, CAM, Simulation', icon: 'cad', color: 'red' },
                { name: 'AIoT / Edge AI', description: 'TensorFlow Lite, ONNX, CV', icon: 'ai', color: 'purple' },
              ],
            },
          ],
        },
        // ── CONTACT TAB ─────────────────────────────────
        {
          label: 'Contact & Socials',
          fields: [
            {
              name: 'contactTitle',
              type: 'text',
              label: 'Title',
              defaultValue: 'Interested in collaborating?',
            },
            {
              name: 'contactSubtitle',
              type: 'textarea',
              label: 'Description',
              defaultValue: 'Open to practical collaborations, small R&D efforts, and project work.',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'contactEmail',
                  type: 'text',
                  label: 'Email',
                  defaultValue: 'kabyaghosh4@gmail.com',
                  admin: { width: '50%' },
                },
                {
                  name: 'contactPhone',
                  type: 'text',
                  label: 'Phone Number',
                  defaultValue: '+880 1950-440296',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'githubUrl',
                  type: 'text',
                  label: 'GitHub URL',
                  admin: { width: '50%' },
                },
                {
                  name: 'linkedinUrl',
                  type: 'text',
                  label: 'LinkedIn URL (Optional)',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'facebookUrl',
                  type: 'text',
                  label: 'Facebook URL',
                  admin: { width: '50%' },
                },
                {
                  name: 'youtubeUrl',
                  type: 'text',
                  label: 'YouTube URL',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        // ── CHATBOT TAB ─────────────────────────────────
        {
          label: 'AI Chatbot',
          fields: [
            {
              name: 'botWelcomeMessage',
              type: 'textarea',
              defaultValue: 'Hello — ask me about projects, skills, or how to get in touch.',
              label: 'Welcome Message',
            },
            {
              name: 'chatbotKnowledge',
              type: 'textarea',
              label: 'AI Chatbot Knowledge Base',
              admin: {
                description: 'Provide a paragraph of information here. The AI chatbot will use this to learn about you and answer user questions.',
              }
            },
          ],
        },
      ],
    },
  ],
}
