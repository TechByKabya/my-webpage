'use client'

import React, { useRef } from 'react'
import { motion, useInView, Variants } from 'framer-motion'

export type SkillItem = {
  id?: string
  name: string
  description?: string
  icon?: string
  color?: string
}

interface SkillsSectionProps {
  title?: string
  subtitle?: string
  skills?: SkillItem[]
}

import {
  Cpu,
  Wifi,
  Layers,
  CodeXml,
  DraftingCompass,
  BrainCircuit,
  Wrench,
  Zap,
  Camera,
  Terminal,
} from 'lucide-react'

const ICONS: Record<string, React.ReactNode> = {
  microchip: <Cpu strokeWidth={1.5} size={28} />,
  iot: <Wifi strokeWidth={1.5} size={28} />,
  '3d': <Layers strokeWidth={1.5} size={28} />,
  code: <CodeXml strokeWidth={1.5} size={28} />,
  cad: <DraftingCompass strokeWidth={1.5} size={28} />,
  ai: <BrainCircuit strokeWidth={1.5} size={28} />,
  hardware: <Wrench strokeWidth={1.5} size={28} />,
  electronics: <Zap strokeWidth={1.5} size={28} />,
  cv: <Camera strokeWidth={1.5} size={28} />,
  python: <Terminal strokeWidth={1.5} size={28} />,
}

const COLORS: Record<string, { bg: string; icon: string; shadow: string }> = {
  indigo:  { bg: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', icon: '#ffffff', shadow: '0 8px 16px -4px rgba(79, 70, 229, 0.4)' },
  blue:    { bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', icon: '#ffffff', shadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)' },
  green:   { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', icon: '#ffffff', shadow: '0 8px 16px -4px rgba(5, 150, 105, 0.4)' },
  amber:   { bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', icon: '#ffffff', shadow: '0 8px 16px -4px rgba(217, 119, 6, 0.4)' },
  red:     { bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', icon: '#ffffff', shadow: '0 8px 16px -4px rgba(220, 38, 38, 0.4)' },
  purple:  { bg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', icon: '#ffffff', shadow: '0 8px 16px -4px rgba(124, 58, 237, 0.4)' },
  teal:    { bg: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', icon: '#ffffff', shadow: '0 8px 16px -4px rgba(13, 148, 136, 0.4)' },
  pink:    { bg: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', icon: '#ffffff', shadow: '0 8px 16px -4px rgba(219, 39, 119, 0.4)' },
}

const DEFAULT_SKILLS: SkillItem[] = [
  { name: 'Embedded Systems', description: 'STM32, ESP32, AVR, RTOS', icon: 'microchip', color: 'indigo' },
  { name: 'IoT', description: 'MQTT, Wi-Fi, BLE, LoRa', icon: 'iot', color: 'blue' },
  { name: '3D Printing', description: 'FDM, Resin, Slicing, Design', icon: '3d', color: 'green' },
  { name: 'Web Development', description: 'Next.js, React, Node.js', icon: 'code', color: 'amber' },
  { name: 'Fusion 360', description: 'CAD, CAM, Simulation', icon: 'cad', color: 'red' },
  { name: 'AIoT / Edge AI', description: 'TensorFlow Lite, ONNX, CV', icon: 'ai', color: 'purple' },
]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const cardVariant: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ title, subtitle, skills }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  const displaySkills = (skills && skills.length > 0) ? skills : DEFAULT_SKILLS
  const displayTitle = title || 'Core Competencies'
  const displaySubtitle = subtitle || 'The tools and technologies I use to bring ideas to life.'

  return (
    <section
      ref={ref}
      style={{
        padding: '60px 20px 80px',
        background: '#ffffff',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <h2 style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#1D1D1F',
            margin: 0,
            lineHeight: 1.2,
          }}>
            {displayTitle}
          </h2>
          <p style={{
            marginTop: '12px',
            color: '#6b7280',
            fontSize: '1rem',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            {displaySubtitle}
          </p>
        </motion.div>

        <style>{`
          .skills-grid-mobile {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 16px;
          }
          @media (max-width: 768px) {
            .skills-grid-mobile {
              grid-template-columns: 1fr 1fr;
            }
            .skill-card-mobile {
              flex-direction: column !important;
              text-align: center;
              padding: 16px 10px !important;
              gap: 10px !important;
            }
          }
        `}</style>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="skills-grid-mobile"
        >
          {displaySkills.map((skill, i) => {
            const palette = COLORS[skill.color || 'indigo'] || COLORS.indigo
            const icon = ICONS[skill.icon || 'microchip'] || ICONS.microchip

            return (
              <motion.div
                key={skill.id || i}
                variants={cardVariant}
                whileHover={{ y: -3, scale: 1.01, boxShadow: '0 12px 24px rgba(0,0,0,0.06)' }}
                className="skill-card-mobile"
                style={{
                  background: '#f8fafc',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  border: '1px solid rgba(0,0,0,0.03)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.04), 0 2px 6px rgba(0,0,0,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'default',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: palette.bg,
                  color: palette.icon,
                  boxShadow: palette.shadow,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {icon}
                </div>

                <div>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: '#1D1D1F',
                    letterSpacing: '-0.01em',
                    marginBottom: '2px',
                  }}>
                    {skill.name}
                  </div>
                  {skill.description && (
                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                      {skill.description}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
