'use client'
import { useEffect } from 'react'

export function ClientScripts() {
  useEffect(() => {
    // --- 1. 3D Tilt Logic (Desktop Only) ---
    const heroSection = document.querySelector('#hero') as HTMLElement;
    const tiltCard = document.querySelector('.tilt-card') as HTMLElement;

    if (heroSection && tiltCard && window.innerWidth > 768) {
        heroSection.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 20;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 20;

            // Subtle 3D effect - Limit rotation
            tiltCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });

        // Reset smoothly when mouse leaves
        heroSection.addEventListener('mouseleave', () => {
            tiltCard.style.transform = `rotateY(0deg) rotateX(0deg)`;
            tiltCard.style.transition = 'transform 0.5s ease';
        });

        // Remove transition when entering to prevent lag
        heroSection.addEventListener('mouseenter', () => {
            tiltCard.style.transition = 'none';
        });
    }

    // --- 3. Universal 3D Tilt ---
    const tiltElements = document.querySelectorAll('.project-card, .studio-card, .file-card');

    tiltElements.forEach(el => {
        const htmlEl = el as HTMLElement;
        htmlEl.addEventListener('mouseenter', () => {
            htmlEl.style.transition = 'none';
        });

        htmlEl.addEventListener('mousemove', (e: Event) => {
            const mouseEvent = e as MouseEvent;
            const rect = htmlEl.getBoundingClientRect();
            const x = mouseEvent.clientX - rect.left;
            const y = mouseEvent.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            htmlEl.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        htmlEl.addEventListener('mouseleave', () => {
            htmlEl.style.transition = 'transform 0.5s ease';
            htmlEl.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // --- 3. Mobile Navigation ---
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.menu a');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if(icon) {
              if (navMenu.classList.contains('active')) {
                  icon.classList.remove('fa-bars');
                  icon.classList.add('fa-times');
              } else {
                  icon.classList.remove('fa-times');
                  icon.classList.add('fa-bars');
              }
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if(icon) {
                  icon.classList.remove('fa-times');
                  icon.classList.add('fa-bars');
                }
            });
        });
    }

    // --- Chatbot ---
    const toggler = document.getElementById('chatbot-toggler');
    const windowBot = document.getElementById('chatbot-window');
    const closeBot = document.getElementById('close-bot');
    const sendBtn = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input') as HTMLInputElement;
    const chatBody = document.getElementById('chat-body');

    if (toggler && windowBot) toggler.addEventListener('click', () => windowBot.classList.add('open'));
    if (closeBot && windowBot) closeBot.addEventListener('click', () => windowBot.classList.remove('open'));

    const botReply = (msg: string) => {
        if(!chatBody) return;
        const div = document.createElement('div');
        div.className = 'msg bot-msg';

        const lowerMsg = msg.toLowerCase();
        let text = "I can help with that! Ask about my **Skills**, **Projects**, **Goals**, or **Contact** info.";

        if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            text = "Hi — I'm a small helper here. Ask about projects, skills, or how to get in touch.";
        }
        else if (lowerMsg.includes('who') || lowerMsg.includes('about') || lowerMsg.includes('bio')) {
            text = "I'm Kabya Ghosh, a CSE student from Bangladesh interested in robotics, AI, and embedded systems. I like building practical projects to learn and solve problems.";
        }
        else if (lowerMsg.includes('skill') || lowerMsg.includes('stack') || lowerMsg.includes('code')) {
            text = "My core skills include **Python, C++, Arduino, ESP32, Raspberry Pi, and ROS**. I also do PCB Design and Basic Web Dev.";
        }
        else if (lowerMsg.includes('project') || lowerMsg.includes('work')) {
            text = "Here are my top projects:\n1. **Mission Bot** (Autonomous Rover)\n2. **Smart Irrigation** (GSM-based)\n3. **Laser Security System**\n4. **Flood Protection System**\n5. **CampusCore ERP**";
        }
        else if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('phone')) {
            text = "You can reach me at **kabyaghosh4@gmail.com** or **+8801950440296**.";
        }
        else if (lowerMsg.includes('hardware') || lowerMsg.includes('tool') || lowerMsg.includes('inventory')) {
            text = "I own a **Creality Ender 3 V3 KE** 3D Printer, various motors (Stepper, BLDC), Arduino/ESP32 boards, and a full soldering setup.";
        }

        div.innerHTML = text.replace(/\n/g, '<br>');
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    if (sendBtn && chatInput && chatBody) {
        sendBtn.addEventListener('click', () => {
            const val = chatInput.value.trim();
            if (!val) return;

            const userDiv = document.createElement('div');
            userDiv.className = 'msg user-msg';
            userDiv.textContent = val;
            chatBody.appendChild(userDiv);
            chatInput.value = '';

            setTimeout(() => botReply(val), 600);
        });

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendBtn.click();
        });
    }

    // --- Scroll Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-section');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('section, .project-card, .clean-card');
    hiddenElements.forEach(el => {
        el.classList.add('hidden-section');
        observer.observe(el);
    });



    // --- Particles ---
    // @ts-ignore
    if(window.Particles && document.getElementById('particles-canvas')) {
      // @ts-ignore
      window.Particles.init({
        selector: '#particles-canvas',
        color: ['#00ff88', '#ffffff'],
        connectParticles: true,
        maxParticles: 100,
        responsive: [
          { breakpoint: 768, options: { maxParticles: 50, connectParticles: false } }
        ]
      });
    }
  }, [])
  return null
}
