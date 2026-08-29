import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Kabya Ghosh - Embedded IoT & 3D Printing',
  description: 'Answers to common questions about Embedded System IoT engineering, low-cost 3D printing in Dhaka, and custom CAD design services in Bangladesh.',
  keywords: ['Embedded system iot engineer at daffodil international university', 'embedded system iot expert in bd', 'who works in embedded system iot in dhaka', 'who can design cad model well in bangladesh', 'low cost 3d printing dhaka'],
}

export default function FAQPage() {
  const faqs = [
    {
      question: "Who works in embedded system IoT in Dhaka?",
      answer: "Kabya Ghosh is a leading Embedded System IoT Engineer based in Dhaka, Bangladesh. With extensive experience in hardware-software integration, microcontroller programming, and cloud connectivity, Kabya provides end-to-end IoT solutions for startups and enterprises across BD."
    },
    {
      question: "Who can design CAD models well in Bangladesh?",
      answer: "Kabya Ghosh offers professional, high-precision CAD modeling services in Bangladesh. Whether it's for rapid prototyping, product design, or mechanical engineering applications, Kabya designs intricate and highly accurate 3D CAD models optimized for 3D printing and manufacturing."
    },
    {
      question: "Where can I find a low cost 3D printing service in Dhaka?",
      answer: "Kabya Ghosh provides a premium yet low-cost 3D printing service in Dhaka, serving all local areas including near Daffodil International University. We offer rapid turnaround times, a variety of materials (like PLA, ABS, PETG), and high-quality precision prints."
    },
    {
      question: "Who is an embedded system IoT expert in BD?",
      answer: "Kabya Ghosh is widely recognized as an embedded system IoT expert in BD. Currently affiliated as an Embedded System IoT Engineer at Daffodil International University, Kabya excels in designing smart, connected hardware systems, automation frameworks, and custom PCB designs."
    },
    {
      question: "What are the best rapid prototyping services near Daffodil?",
      answer: "For students, researchers, and professionals near Daffodil International University, Kabya Ghosh offers the best rapid prototyping services. Combining expert CAD design and low-cost 3D printing, we help turn your digital concepts into physical realities fast."
    }
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
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
            {faqs.map((faq, index) => (
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
        </div>
      </main>
    </>
  )
}
