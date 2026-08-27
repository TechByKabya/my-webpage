import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Script from 'next/script'
import { ClientScripts } from '@/app/(frontend)/ClientScripts'

export default async function GlobalElements() {
  const payload = await getPayload({ config: configPromise })
  const settings = await payload.findGlobal({
    slug: 'homepage-settings',
    depth: 1,
  })

  const botWelcome = settings.botWelcomeMessage || 'Hello — ask me about projects, skills, or how to get in touch.'
  const filesPassword = settings.filesPassword || 'techkabya'

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      <canvas id="particle-canvas"></canvas>

      <header id="main-nav">
          <div className="nav-container">
              <a href="/" className="logo">Kabya<span>.Dev</span></a>

              <ul className="menu" id="nav-menu">
                  {(settings.menuItems && settings.menuItems.length > 0 ? settings.menuItems : [
                      { label: 'Home', link: '/', isButton: false },
                      { label: 'Projects', link: '/projects', isButton: false },
                      { label: 'Blogs', link: '/blogs', isButton: false },
                      { label: 'Contact', link: '/contact', isButton: true },
                  ]).map((item, i) => (
                      <li key={i}>
                          <a 
                            href={item.link} 
                            className={item.isButton ? "btn-nav" : ""} 
                            data-cursor={item.label}
                          >
                            {item.label}
                          </a>
                      </li>
                  ))}
              </ul>

              <button className="hamburger" id="hamburger-menu">
                  <i className="fas fa-bars"></i>
              </button>
          </div>
      </header>



      {/* CHATBOT */}
      <div className="chatbot-wrapper">
          <div className="chatbot-window" id="chatbot-window">
              <div className="chat-header">
                  <div className="bot-id">
                      <div className="bot-dot"></div>
                      <span>Kabya AI</span>
                  </div>
                  <button id="close-bot">×</button>
              </div>
              <div className="chat-body" id="chat-body">
                  <div className="msg bot-msg" dangerouslySetInnerHTML={{__html: botWelcome}}></div>
              </div>
              <div className="chat-input">
                  <input type="text" id="chat-input" placeholder="Type a message..." />
                  <button id="chat-send"><i className="fas fa-paper-plane"></i></button>
              </div>
          </div>
          <button className="chatbot-toggler" id="chatbot-toggler">
              <i className="fas fa-comment-dots"></i>
          </button>
      </div>

      <Script src="/particles.js" strategy="lazyOnload" />
      <ClientScripts />
    </>
  )
}
