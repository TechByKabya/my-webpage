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
      <main className="bg-[#f8fafc] text-[#1d1d1f] min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-[#0f172a]">
            Frequently Asked Questions
          </h1>
          <p className="text-[#64748b] text-lg mb-12">
            Common questions about our embedded systems, IoT engineering, CAD design, and 3D printing services in Bangladesh.
          </p>

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                <h2 className="text-xl font-bold text-[#1e293b] mb-4 tracking-tight leading-snug">
                  {faq.question}
                </h2>
                <p className="text-[#475569] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
