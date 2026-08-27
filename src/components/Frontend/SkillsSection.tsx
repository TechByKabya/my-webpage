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

const COLORS: Record<string, { fg: string; bg: string }> = {
  indigo:  { fg: '#5B5BF5', bg: '#EEF0FF' },
  blue:    { fg: '#0EA5E9', bg: '#E0F2FE' },
  green:   { fg: '#10B981', bg: '#D1FAE5' },
  amber:   { fg: '#F59E0B', bg: '#FEF3C7' },
  red:     { fg: '#EF4444', bg: '#FEE2E2' },
  purple:  { fg: '#8B5CF6', bg: '#EDE9FE' },
  teal:    { fg: '#14B8A6', bg: '#CCFBF1' },
  pink:    { fg: '#EC4899', bg: '#FCE7F3' },
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
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ title, subtitle, skills }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const displaySkills = (skills && skills.length > 0) ? skills : DEFAULT_SKILLS
  const displayTitle = title || 'Core Competencies'
  const displaySubtitle = subtitle || 'From hardware to software — the tools and technologies I use to bring ideas to life.'

  return (
    <section
      ref={ref}
      style={{
        padding: '100px 20px',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <span style={{
            display: 'inline-block',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#6366f1',
            background: '#eef2ff',
            padding: '6px 16px',
            borderRadius: '999px',
            marginBottom: '16px',
          }}>
            What I Work With
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#1D1D1F',
            margin: 0,
            lineHeight: 1.15,
          }}>
            {displayTitle}
          </h2>
          <p style={{
            marginTop: '16px',
            color: '#6b7280',
            fontSize: '1.05rem',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            {displaySubtitle}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {displaySkills.map((skill, i) => {
            const palette = COLORS[skill.color || 'indigo'] || COLORS.indigo
            const icon = ICONS[skill.icon || 'microchip'] || ICONS.microchip

            return (
              <motion.div
                key={skill.id || i}
                variants={cardVariant}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '28px 24px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  cursor: 'default',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: palette.bg,
                  color: palette.fg,
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
                    fontSize: '1.1rem',
                    color: '#1D1D1F',
                    letterSpacing: '-0.02em',
                    marginBottom: '6px',
                  }}>
                    {skill.name}
                  </div>
                  {skill.description && (
                    <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>
                      {skill.description}
                    </div>
                  )}
                </div>

                <div style={{
                  height: '3px',
                  borderRadius: '999px',
                  background: `linear-gradient(90deg, ${palette.fg}33, ${palette.fg})`,
                  marginTop: 'auto',
                }} />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
