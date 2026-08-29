'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DotLottiePlayer } from '@dotlottie/react-player'
import '@dotlottie/react-player/dist/index.css'
import Link from 'next/link'

interface Props {
  availableMaterials: string[]
  availableColors: string[]
}

export const PrintingOrderForm: React.FC<Props> = ({ availableMaterials, availableColors }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    orderType: 'CAD Model Provided',
    fileLink: '',
    ideaDescription: '',
    material: availableMaterials.length > 0 ? availableMaterials[0] : 'PLA',
    color: availableColors.length > 0 ? availableColors[0] : 'Black',
    infill: '20%',
    layerHeight: '0.20mm (Standard)',
    notes: '',
  })
  
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [step, setStep] = useState(1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    try {
      const res = await fetch('/api/printing-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      
      if (res.ok) {
        setStatus('success')
        setForm({
          name: '', email: '', phone: '', address: '', fileLink: '', orderType: 'CAD Model Provided', ideaDescription: '',
          material: availableMaterials.length > 0 ? availableMaterials[0] : 'PLA', 
          color: availableColors.length > 0 ? availableColors[0] : 'Black', 
          infill: '20%', layerHeight: '0.20mm (Standard)', notes: ''
        })
        setAgreedToTerms(false)
        setStep(1)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const nextStep = (e: React.MouseEvent) => {
    e.preventDefault()
    // Simple check - let native HTML5 validation happen on actual submit, but here we just proceed.
    // Ideally we'd validate required fields per step.
    if (step < 3) setStep(step + 1)
  }

  const prevStep = (e: React.MouseEvent) => {
    e.preventDefault()
    if (step > 1) setStep(step - 1)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px', borderRadius: '12px',
    border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.8)',
    fontSize: '0.95rem', color: '#1d1d1f', outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxSizing: 'border-box', fontFamily: 'inherit',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
  }
  
  const labelStyle: React.CSSProperties = {
    display: 'block', color: '#4b5563', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px',
    letterSpacing: '0.02em'
  }

  return (
    <>
      <style>{`
        .printing-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 100vh;
          overflow: hidden;
          background: #fff;
          flex: 1;
        }
        .printing-left {
          background: linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%);
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
          height: 100%;
        }
        .printing-right {
          padding: 30px 40px;
          background: #f8fafc;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          overflow: hidden;
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .home-btn {
          position: absolute;
          top: 30px;
          left: 30px;
          z-index: 10;
        }
        @media (max-width: 768px) {
          .printing-container {
            display: flex;
            flex-direction: column;
            height: auto;
            overflow: visible;
          }
          .printing-left {
            height: auto;
            min-height: 400px;
            padding: 80px 20px 40px 20px;
          }
          .printing-right {
            height: auto;
            padding: 40px 20px;
            overflow: visible;
          }
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
          .home-btn {
            top: 20px;
            left: 20px;
          }
        }
      `}</style>
      <div className="printing-container">
        
        {/* LEFT SIDE - VISUALS & BRANDING */}
        <div className="printing-left">
        {/* Home Button */}
        <div className="home-btn">
          <Link href="/" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, transition: 'color 0.2s', letterSpacing: '0.02em' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}>
             <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>

        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%', background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.15) 0%, transparent 60%)', zIndex: 0 }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '500px', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 style={{ color: '#fff', fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '16px' }}>
              3D Printing Service <span style={{ color: '#818cf8' }}>in BD.</span>
            </h1>
            <h2 style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.5, marginBottom: '20px', fontWeight: 400 }}>
              Low cost 3D printing service in Dhaka. Premium precision prints delivered fast, serving all local areas including near Daffodil.
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1, delay: 0.2 }}
            style={{ width: '220px', height: '220px', margin: '0 auto' }}
          >
            <DotLottiePlayer
              src="https://lottie.host/d7dfafa4-1d91-470e-8682-0ed044516b7e/Gmso1MWI18.lottie"
              autoplay
              loop
            />
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE - SEAMLESS FORM */}
      <div className="printing-right">
        <div style={{ maxWidth: '600px', width: '100%' }}>
          {status === 'success' ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ width: '150px', height: '150px', margin: '0 auto 10px' }}>
                <DotLottiePlayer
                  src="/order-confirmed-animation.json"
                  autoplay
                  loop={false}
                />
              </div>
              <h4 style={{ color: '#1d1d1f', fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>Request Submitted</h4>
              <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.5 }}>We are reviewing your model geometry. You'll receive a detailed quote in your inbox shortly.</p>
              <button onClick={() => setStatus('idle')} style={{ marginTop: '30px', padding: '12px 28px', background: '#1d1d1f', color: '#fff', fontSize: '0.95rem', fontWeight: 600, border: 'none', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>Submit Another Order</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.02), 0 1px 3px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', position: 'relative' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>Configure Order</h3>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px' }}>Step {step} of 3</div>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>Please provide your details and technical specifications.</p>

              <div style={{ minHeight: '300px' }}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="form-grid-2">
                        <div>
                          <label style={labelStyle}>Full Name</label>
                          <input required type="text" placeholder="Your Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Email Address</label>
                          <input required type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} />
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>Phone Number (For SMS Updates)</label>
                        <input required type="tel" placeholder="01XXXXXXXXX" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>What do you have?</label>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#4b5563', cursor: 'pointer' }}>
                            <input type="radio" name="orderType" value="CAD Model Provided" checked={form.orderType === 'CAD Model Provided'} onChange={e => setForm({...form, orderType: e.target.value})} />
                            I have a 3D Model (Link)
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#4b5563', cursor: 'pointer' }}>
                            <input type="radio" name="orderType" value="Idea / Need CAD Design" checked={form.orderType === 'Idea / Need CAD Design'} onChange={e => setForm({...form, orderType: e.target.value})} />
                            I have an idea / Provide Dimensions
                          </label>
                        </div>
                      </div>
                      
                      {form.orderType === 'CAD Model Provided' ? (
                        <div>
                          <label style={labelStyle}>3D Model Link (Drive, Dropbox)</label>
                          <input required type="url" placeholder="https://..." value={form.fileLink} onChange={e => setForm({...form, fileLink: e.target.value})} style={inputStyle} />
                        </div>
                      ) : (
                        <div>
                          <label style={labelStyle}>Idea & Dimensions</label>
                          <textarea required rows={4} placeholder="Describe your idea in detail and provide rough dimensions..." value={form.ideaDescription} onChange={e => setForm({...form, ideaDescription: e.target.value})} style={{...inputStyle, resize: 'vertical'}} />
                        </div>
                      )}
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} className="form-grid-2" style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                      <div>
                        <label style={labelStyle}>Material</label>
                        <select required value={form.material} onChange={e => setForm({...form, material: e.target.value})} style={inputStyle}>
                          {availableMaterials.map((m, i) => (
                            <option key={i} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Color</label>
                        <select required value={form.color} onChange={e => setForm({...form, color: e.target.value})} style={inputStyle}>
                          {availableColors.map((c, i) => (
                            <option key={i} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Infill</label>
                        <select required value={form.infill} onChange={e => setForm({...form, infill: e.target.value})} style={inputStyle}>
                          <option value="10%">10% (Light)</option>
                          <option value="20%">20% (Standard)</option>
                          <option value="50%">50% (Strong)</option>
                          <option value="100% (Solid)">100% (Solid)</option>
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Quality</label>
                        <select required value={form.layerHeight} onChange={e => setForm({...form, layerHeight: e.target.value})} style={inputStyle}>
                          <option value="0.28mm (Draft/Fast)">0.28mm (Draft)</option>
                          <option value="0.20mm (Standard)">0.20mm (Standard)</option>
                          <option value="0.12mm (High Detail)">0.12mm (Ultra)</option>
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>Shipping Address</label>
                        <input required type="text" placeholder="Full address including zip code" value={form.address} onChange={e => setForm({...form, address: e.target.value})} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Project Notes</label>
                        <textarea rows={3} placeholder="Any specific requirements for orientation, supports, etc." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} style={{...inputStyle, resize: 'none'}} />
                      </div>
                      <div style={{ marginTop: '12px', background: '#fef2f2', padding: '12px', borderRadius: '8px', border: '1px solid #fee2e2' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: '#7f1d1d', cursor: 'pointer', lineHeight: 1.4 }}>
                          <input type="checkbox" required checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} style={{ marginTop: '2px' }} />
                          <span>I understand that payments are <strong>non-refundable</strong> once printing begins. Sending money to the wrong number is not the responsibility of Kabya 3D Printing.</span>
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {status === 'error' && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', padding: '10px', borderRadius: '8px', marginTop: '16px', fontSize: '0.85rem' }}>
                  Something went wrong. Please check your inputs and try again.
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                {step > 1 && (
                  <motion.button
                    type="button" onClick={prevStep}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    style={{
                      flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer',
                      background: '#fff', color: '#475569', fontSize: '0.95rem', fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                    }}
                  >
                    Back
                  </motion.button>
                )}
                
                {step < 3 ? (
                  <motion.button
                    type="button" onClick={nextStep}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    style={{
                      flex: 2, padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                      background: '#1d1d1f', color: '#fff', fontSize: '0.95rem', fontWeight: 600,
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    Next Step
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit" disabled={status === 'loading'}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    style={{
                      flex: 2, padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                      background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', color: '#fff',
                      fontSize: '0.95rem', fontWeight: 600,
                      boxShadow: '0 8px 16px rgba(79, 70, 229, 0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: status === 'loading' ? 0.7 : 1, transition: 'opacity 0.2s'
                    }}
                  >
                    {status === 'loading' ? 'Processing...' : 'Get a Quote'}
                  </motion.button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
