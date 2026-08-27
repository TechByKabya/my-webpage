document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 3D Tilt Logic (Desktop Only) ---
    const heroSection = document.querySelector('#hero');
    const tiltCard = document.querySelector('.tilt-card');

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

    // --- 2. Custom Cursor Logic - REMOVED ---


    // --- 3. Universal 3D Tilt ---
    const tiltElements = document.querySelectorAll('.project-card, .studio-card');

    tiltElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.transition = 'none';
            // Remove transition to prevent lag during movement
        });

        el.addEventListener('mousemove', (e) => {
            // if (window.innerWidth <= 768) return; // Removed to force 3D effect

            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top; // Fixed typo: rect.clientY -> rect.top

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transition = 'transform 0.5s ease';
            // Add smooth transition back to normal
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // --- 3. Mobile Navigation ---
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.menu a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle Icon
            const icon = hamburger.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when link clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.querySelector('i').classList.remove('fa-times');
                hamburger.querySelector('i').classList.add('fa-bars');
            });
        });
    }

    const toggler = document.getElementById('chatbot-toggler');
    const windowBot = document.getElementById('chatbot-window');
    const closeBot = document.getElementById('close-bot');
    const sendBtn = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');

    // Toggle
    if (toggler) toggler.addEventListener('click', () => windowBot.classList.add('open'));
    if (closeBot) closeBot.addEventListener('click', () => windowBot.classList.remove('open'));

    // Smart Auto-Reply
    const botReply = (msg) => {
        const div = document.createElement('div');
        div.className = 'msg bot-msg';

        const lowerMsg = msg.toLowerCase();
        let text = "I can help with that! Ask about my **Skills**, **Projects**, **Goals**, or **Contact** info.";

        // Knowledge Base
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
        else if (lowerMsg.includes('mission') || lowerMsg.includes('rover')) {
            text = "Mission Bot is a rover prototype focused on terrain mapping and basic navigation — a project for learning practical navigation techniques.";
        }
        else if (lowerMsg.includes('goal') || lowerMsg.includes('future')) {
            text = "I'm working to improve in robotics and AI, and hope to put together a modest R&D space. I'm exploring rover ideas and practical IoT systems.";
        }
        else if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('phone')) {
            text = "You can reach me at **kabyaghosh4@gmail.com** or **+8801950440296**. I'm open to practical collaborations and project work.";
        }
        else if (lowerMsg.includes('hardware') || lowerMsg.includes('tool') || lowerMsg.includes('inventory')) {
            text = "I own a **Creality Ender 3 V3 KE** 3D Printer, various motors (Stepper, BLDC), Arduino/ESP32 boards, and a full soldering setup.";
        }
        else if (lowerMsg.includes('quote') || lowerMsg.includes('slogan')) {
            text = "“I like to spend my coffee money on microcontrollers, and my fancy hoodie money on a Raspberry Pi.”";
        }
        else if (lowerMsg.includes('youtube') || lowerMsg.includes('channel') || lowerMsg.includes('video')) {
            text = "Check out my YouTube channel **KraftGenesis** for project demos and tutorials! Link in the footer.";
        }
        else if (lowerMsg.includes('facebook') || lowerMsg.includes('fb') || lowerMsg.includes('social')) {
            text = "Connect with me on Facebook: **kabya.ghosh.official**. I share updates there too.";
        }
        else if (lowerMsg.includes('erp') || lowerMsg.includes('campus')) {
            text = "My CampusCore ERP is live — it helps with student records and routine administrative tasks. See the 'Enterprise Scale' section for a demo link.";
        }

        // Format line breaks
        div.innerHTML = text.replace(/\n/g, '<br>');
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            const val = chatInput.value.trim();
            if (!val) return;

            // User Msg
            const userDiv = document.createElement('div');
            userDiv.className = 'msg user-msg';
            userDiv.textContent = val;
            chatBody.appendChild(userDiv);
            chatInput.value = '';

            // Bot Reply Delay
            setTimeout(() => botReply(val), 600);
        });

        // Enter key support
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendBtn.click();
        });
    }

    // --- 5. Dynamic Year ---
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- 6. Scroll Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-section');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('section, .project-card, .clean-card');
    hiddenElements.forEach(el => {
        el.classList.add('hidden-section');
        observer.observe(el);
    });

    // --- 7. My Files Modal Functionality ---
    const filesToggler = document.getElementById('files-toggler');
    const filesModal = document.getElementById('files-modal');
    const closeFiles = document.getElementById('close-files');
    const passwordScreen = document.getElementById('password-screen');
    const filesBody = document.getElementById('files-body');
    const passwordInput = document.getElementById('password-input');
    const passwordSubmit = document.getElementById('password-submit');
    const passwordError = document.getElementById('password-error');

    const CORRECT_PASSWORD = 'techkabya';
    let isAuthenticated = false;

    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'files-modal-backdrop';
    document.body.appendChild(backdrop);

    // Open modal
    if (filesToggler) {
        filesToggler.addEventListener('click', () => {
            filesModal.classList.add('open');
            backdrop.classList.add('active');

            // Reset to password screen if not authenticated
            if (!isAuthenticated) {
                passwordScreen.style.display = 'flex';
                filesBody.style.display = 'none';
                passwordInput.value = '';
                passwordError.classList.remove('show');
                // Auto-focus password input
                setTimeout(() => passwordInput.focus(), 300);
            } else {
                passwordScreen.style.display = 'none';
                filesBody.style.display = 'block';
            }
        });
    }

    // Close modal
    if (closeFiles) {
        closeFiles.addEventListener('click', () => {
            filesModal.classList.remove('open');
            backdrop.classList.remove('active');
        });
    }

    // Close on backdrop click
    backdrop.addEventListener('click', () => {
        filesModal.classList.remove('open');
        backdrop.classList.remove('active');
    });

    // Password validation
    const checkPassword = () => {
        const enteredPassword = passwordInput.value.trim();

        if (enteredPassword === CORRECT_PASSWORD) {
            // Correct password
            isAuthenticated = true;
            passwordScreen.style.display = 'none';
            filesBody.style.display = 'block';
            passwordError.classList.remove('show');
        } else {
            // Wrong password
            passwordError.classList.add('show');
            passwordInput.value = '';
            passwordInput.focus();

            // Shake animation
            passwordInput.style.animation = 'shake 0.5s';
            setTimeout(() => {
                passwordInput.style.animation = '';
            }, 500);
        }
    };

    // Password submit button
    if (passwordSubmit) {
        passwordSubmit.addEventListener('click', checkPassword);
    }

    // Enter key support
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
    }

    // 3D Tilt for file cards
    const fileCards = document.querySelectorAll('.file-card');
    fileCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });

        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
});

