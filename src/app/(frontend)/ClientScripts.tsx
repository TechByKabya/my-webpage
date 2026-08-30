'use client'
import { useEffect } from 'react'

export function ClientScripts() {
  useEffect(() => {
    let tiltAnimationFrame: number;

    // --- 1. 3D Tilt Logic (Desktop Only) ---
    const handleHeroMousemove = (e: MouseEvent) => {
      if (window.innerWidth <= 768) return;
      const tiltCard = document.querySelector('.tilt-card') as HTMLElement;
      if (!tiltCard) return;
      
      const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
      tiltCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    };

    const handleHeroMouseleave = () => {
      const tiltCard = document.querySelector('.tilt-card') as HTMLElement;
      if (!tiltCard) return;
      tiltCard.style.transform = `rotateY(0deg) rotateX(0deg)`;
      tiltCard.style.transition = 'transform 0.5s ease';
    };

    const handleHeroMouseenter = () => {
      const tiltCard = document.querySelector('.tilt-card') as HTMLElement;
      if (!tiltCard) return;
      tiltCard.style.transition = 'none';
    };

    const heroSection = document.querySelector('#hero');
    if (heroSection) {
      heroSection.addEventListener('mousemove', handleHeroMousemove as EventListener);
      heroSection.addEventListener('mouseleave', handleHeroMouseleave);
      heroSection.addEventListener('mouseenter', handleHeroMouseenter);
    }

    // --- 2. Universal 3D Tilt (Event Delegation) ---
    const handleGlobalMousemove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const card = target.closest('.studio-card, .file-card') as HTMLElement;
      
      if (card) {
        if (!card.dataset.tilted) {
          card.style.transition = 'none';
          card.dataset.tilted = 'true';
        }

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4; // Max 4deg
        const rotateY = ((x - centerX) / centerX) * 4;

        if (tiltAnimationFrame) cancelAnimationFrame(tiltAnimationFrame);
        tiltAnimationFrame = requestAnimationFrame(() => {
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
        });
      }
    };

    const handleGlobalMouseout = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const card = target.closest('.studio-card, .file-card') as HTMLElement;
      const relatedTarget = e.relatedTarget as HTMLElement;
      
      // Only reset if we actually leave the card (not just moving to a child)
      if (card && (!relatedTarget || !card.contains(relatedTarget))) {
        card.style.transition = 'transform 0.5s ease';
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        delete card.dataset.tilted;
      }
    };

    document.addEventListener('mousemove', handleGlobalMousemove);
    document.addEventListener('mouseout', handleGlobalMouseout);

    // --- 3. Mobile Navigation ---
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');

    const toggleMenu = (forceClose = false) => {
        if (!navMenu || !hamburger) return;
        const isClosing = forceClose || navMenu.classList.contains('active');
        
        if (isClosing) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            navMenu.classList.add('active');
            hamburger.classList.add('active');
            if (mobileOverlay) mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    const handleHamburgerClick = () => toggleMenu();
    const handleOverlayClick = () => toggleMenu(true);
    
    // Use event delegation for nav links
    const handleNavClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.menu a')) {
        toggleMenu(true);
      }
    };

    if (hamburger) hamburger.addEventListener('click', handleHamburgerClick);
    if (mobileOverlay) mobileOverlay.addEventListener('click', handleOverlayClick);
    document.addEventListener('click', handleNavClick);

    // --- 4. Scroll Animations ---
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

    // --- 5. Particles ---
    // @ts-ignore
    let particlesInstance: any = null;
    if((window as any).Particles && document.getElementById('particles-canvas')) {
      // @ts-ignore
      particlesInstance = (window as any).Particles.init({
        selector: '#particles-canvas',
        color: ['#00ff88', '#ffffff'],
        connectParticles: true,
        maxParticles: 100,
        responsive: [
          { breakpoint: 768, options: { maxParticles: 50, connectParticles: false } }
        ]
      });
    }

    // --- CLEANUP FUNCTION ---
    return () => {
      if (heroSection) {
        heroSection.removeEventListener('mousemove', handleHeroMousemove as EventListener);
        heroSection.removeEventListener('mouseleave', handleHeroMouseleave);
        heroSection.removeEventListener('mouseenter', handleHeroMouseenter);
      }
      
      document.removeEventListener('mousemove', handleGlobalMousemove);
      document.removeEventListener('mouseout', handleGlobalMouseout);
      document.removeEventListener('click', handleNavClick);
      
      if (hamburger) hamburger.removeEventListener('click', handleHamburgerClick);
      if (mobileOverlay) mobileOverlay.removeEventListener('click', handleOverlayClick);
      
      observer.disconnect();
      if (tiltAnimationFrame) cancelAnimationFrame(tiltAnimationFrame);
      
      if (particlesInstance && particlesInstance.destroy) {
        particlesInstance.destroy();
      }
    };
  }, [])
  return null
}
