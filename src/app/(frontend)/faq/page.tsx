import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Kabya Ghosh - Embedded IoT & 3D Printing',
  description: 'Answers to common questions about Embedded System IoT engineering, low-cost 3D printing in Dhaka, and custom CAD design services in Bangladesh.',
  keywords: ['Embedded system iot engineer at daffodil international university', 'embedded system iot expert in bd', 'who works in embedded system iot in dhaka', 'who can design cad model well in bangladesh', 'low cost 3d printing dhaka'],
}

export default function FAQPage() {
  const faqCategories = [
    {
      category: "Background & Academics",
      faqs: [
        { question: "Who is Kabya Ghosh?", answer: "I am a Computer Science and Engineering undergraduate at Daffodil International University." },
        { question: "What is your core expertise?", answer: "I specialize in embedded systems, IoT architecture, and full-stack hardware prototyping." },
        { question: "What is Team EmbedX?", answer: "A competitive engineering and research group I founded to tackle advanced hardware hackathons." },
        { question: "Are you involved in university research?", answer: "I actively collaborate with the Microprocessor & Embedded System Laboratory." }
      ]
    },
    {
      category: "Hardware & IoT Engineering",
      faqs: [
        { question: "Which microcontrollers do you program?", answer: "I develop custom firmware extensively for the ESP32 series, Arduino Uno, and STM32 platforms." },
        { question: "Do you design custom PCBs?", answer: "Yes, I use KiCad and EasyEDA to route multi-layer SMD boards, optocouplers, and power management systems." },
        { question: "What is the Smart Student Attendance System?", answer: "A multi-modal IoT biometric device I built utilizing RFID, fingerprint, and voice recognition." },
        { question: "Have you built robotics platforms?", answer: "I engineered Mission BOT, an award-winning solar-powered rover featuring a 3-DOF robotic arm." },
        { question: "What power systems have you prototyped?", answer: "I design custom circuits like logic gate traffic controllers and 12V auto cut-off battery chargers." }
      ]
    },
    {
      category: "AI, Web & Software Development",
      faqs: [
        { question: "What is your experience with Edge AI?", answer: "I implement TinyML to run local machine learning models directly on microcontroller hardware." },
        { question: "What is the electronic nose project?", answer: "A handheld Edge AI device leveraging gas sensors to evaluate and detect food freshness." },
        { question: "Do you develop web dashboards?", answer: "I build custom backend systems and APIs using Python (Flask), PHP, HTML, CSS, and JavaScript." },
        { question: "Can you create WordPress tools?", answer: "Yes, I program dynamic, single-file PHP plugins for tools like e-libraries and interactive quizzes." },
        { question: "Have you built environmental platforms?", answer: "I engineered EnviroSense, an IoT architecture for flood monitoring and smart aquaculture telemetry." },
        { question: "What is your primary software stack?", answer: "I rely on Visual Studio Code, GitHub, and macOS for seamless development workflows." }
      ]
    },
    {
      category: "3D Prototyping & Media",
      faqs: [
        { question: "Do you offer CAD modeling?", answer: "I design functional enclosures and parametric robotics components using Autodesk Fusion 360." },
        { question: "What is your 3D printing workflow?", answer: "I fabricate high-tolerance physical prototypes on a Bambu Lab A1 using PLA+ and PETG filaments." },
        { question: "Do you create 3D animations?", answer: "I utilize Blender for photorealistic Cycles rendering and procedural environment scattering." },
        { question: "How do you edit showcase videos?", answer: "I handle project demonstrations and color grading using DaVinci Resolve." },
        { question: "Are you available for custom hardware projects?", answer: "I actively design, prototype, and deploy end-to-end IoT and embedded system solutions." }
      ]
    }
  ]

  const allFaqs = faqCategories.flatMap(cat => cat.faqs)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main style={{ 
        backgroundColor: '#f9fafb', 
        minHeight: '100vh', 
        paddingTop: '160px', 
        paddingBottom: '120px', 
        paddingLeft: '24px', 
        paddingRight: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <style>{`
          .faq-container {
            width: 100%;
            max-width: 800px;
          }
          .faq-header {
            text-align: center;
            margin-bottom: 60px;
          }
          .faq-title {
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 800;
            color: #1d1d1f;
            letter-spacing: -0.04em;
            margin-bottom: 16px;
            background: linear-gradient(135deg, #1d1d1f 0%, #434345 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .faq-subtitle {
            font-size: clamp(1.1rem, 2vw, 1.25rem);
            color: #6b7280;
            line-height: 1.6;
            max-width: 600px;
            margin: 0 auto;
          }
          .faq-details {
            background: #ffffff;
            border: 1px solid rgba(0,0,0,0.05);
            border-radius: 20px;
            margin-bottom: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.02);
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          }
          .faq-details:hover {
            box-shadow: 0 10px 30px rgba(0,0,0,0.06);
            transform: translateY(-2px);
          }
          .faq-details[open] {
            border-color: rgba(99, 102, 241, 0.3);
            box-shadow: 0 10px 40px rgba(99, 102, 241, 0.08);
          }
          .faq-summary {
            padding: 24px 30px;
            cursor: pointer;
            list-style: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: clamp(1.1rem, 2.5vw, 1.25rem);
            font-weight: 700;
            color: #1d1d1f;
            transition: color 0.2s;
            user-select: none;
          }
          .faq-summary::-webkit-details-marker {
            display: none;
          }
          .faq-summary:hover {
            color: #6366f1;
          }
          .faq-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #6b7280;
            transition: all 0.3s ease;
            flex-shrink: 0;
            margin-left: 16px;
          }
          .faq-details[open] .faq-icon {
            background: #6366f1;
            color: #ffffff;
            transform: rotate(180deg);
          }
          .faq-content {
            padding: 0 30px 30px 30px;
            color: #4b5563;
            font-size: clamp(1rem, 2vw, 1.1rem);
            line-height: 1.7;
            animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
            transform: translateY(-10px);
          }
          @keyframes slideDown {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @media (max-width: 600px) {
            .faq-summary {
              padding: 20px;
            }
            .faq-content {
              padding: 0 20px 24px 20px;
            }
          }
        `}</style>
        
        <div className="faq-container">
          <div className="faq-header">
            <h1 className="faq-title">Frequently Asked Questions</h1>
            <p className="faq-subtitle">
              Everything you need to know about our embedded systems, IoT engineering, CAD design, and 3D printing services in Bangladesh.
            </p>
          </div>

          <div className="faq-list">
            {faqCategories.map((categoryBlock, catIndex) => (
              <div key={catIndex} style={{ marginBottom: '40px' }}>
                <h2 style={{ 
                  fontSize: '1.4rem', 
                  fontWeight: 800, 
                  color: '#1d1d1f', 
                  marginBottom: '20px', 
                  paddingLeft: '10px',
                  borderLeft: '4px solid #6366f1'
                }}>
                  {categoryBlock.category}
                </h2>
                {categoryBlock.faqs.map((faq, index) => (
                  <details key={index} className="faq-details">
                    <summary className="faq-summary">
                      {faq.question}
                      <div className="faq-icon">
                        <i className="fas fa-chevron-down" style={{ fontSize: '0.9rem' }}></i>
                      </div>
                    </summary>
                    <div className="faq-content">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
