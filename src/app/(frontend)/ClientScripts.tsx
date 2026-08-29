'use client'
import { useEffect } from 'react'

export function ClientScripts() {
  useEffect(() => {
    // --- 1. 3D Tilt Logic (Desktop Only) ---
    const heroSection = document.querySelector('#hero') as HTMLElement;
    const tiltCard = document.querySelector('.tilt-card') as HTMLElement;

    if (heroSection && tiltCard && window.innerWidth > 768) {
        heroSection.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 50;

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
    const tiltElements = document.querySelectorAll('.studio-card, .file-card');

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

            const rotateX = ((y - centerY) / centerY) * -4; // Max 4deg
            const rotateY = ((x - centerX) / centerX) * 4;

            htmlEl.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
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
    const mobileOverlay = document.getElementById('mobile-overlay');

    const toggleMenu = (forceClose = false) => {
        if (!navMenu || !hamburger) return;
        
        const isClosing = forceClose || navMenu.classList.contains('active');
        
        if (isClosing) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Unlock scrolling
        } else {
            navMenu.classList.add('active');
            hamburger.classList.add('active');
            if (mobileOverlay) mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scrolling
        }
    };

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => toggleMenu());

        navLinks.forEach(link => {
            link.addEventListener('click', () => toggleMenu(true));
        });

        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', () => toggleMenu(true));
        }
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
