document.addEventListener('DOMContentLoaded', () => {
    // Access code configuration - replace with your actual access codes and names
    const accessCodes = {
        'PHOTOS2025': { name: 'Photos 2025' }, 
        'RUINA': { name: 'Ruina' },
        'JESSE': { name: 'Jesse' },
        'ALINA': { name: 'Alina' },
        'GRANT': { name: 'Grant' },
        'DEMO': { name: 'Demo Access' }
    };
    
    const loginForm = document.getElementById('login-form');
    const accessCodeInput = document.getElementById('access-code');
    const errorMessage = document.getElementById('error-message');
    
    // Add focus effect to input field
    accessCodeInput.addEventListener('focus', () => {
        accessCodeInput.parentElement.classList.add('input-focused');
    });
    
    accessCodeInput.addEventListener('blur', () => {
        accessCodeInput.parentElement.classList.remove('input-focused');
    });
    
    // Check for saved session
    const savedSession = localStorage.getItem('photoAccessSession');
    if (savedSession) {
        try {
            const session = JSON.parse(savedSession);
            if (session && session.code && session.expires > Date.now()) {
                // Valid session exists, redirect to gallery
                redirectToGallery(session.code, session.name);
                return;
            } else {
                // Expired session, remove it
                localStorage.removeItem('photoAccessSession');
            }
        } catch (e) {
            console.error('Error parsing saved session:', e);
            localStorage.removeItem('photoAccessSession');
        }
    }
    
    // Handle form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const code = accessCodeInput.value.trim().toUpperCase();
        
        if (!code) {
            showError('Please enter an access code');
            return;
        }
        
        if (accessCodes[code]) {
            // Valid access code - show success animation
            showSuccess();
            
            // Save session (expires in 30 days)
            const session = {
                code,
                name: accessCodes[code].name,
                expires: Date.now() + (30 * 24 * 60 * 60 * 1000)
            };
            localStorage.setItem('photoAccessSession', JSON.stringify(session));
            
            // Redirect to gallery after short delay for animation
            setTimeout(() => {
                redirectToGallery(code, accessCodes[code].name);
            }, 800);
        } else {
            // Invalid code
            showError('Invalid access code');
            accessCodeInput.value = '';
            accessCodeInput.focus();
        }
    });
    
    // Helper function to show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.opacity = 1;
        
        // Shake animation
        loginForm.classList.add('shake');
        setTimeout(() => {
            loginForm.classList.remove('shake');
        }, 500);
    }
    
    // Helper function to show success animation
    function showSuccess() {
        // Add success class to form
        loginForm.classList.add('success');
        
        // Add success message
        errorMessage.textContent = 'Access granted! Redirecting...';
        errorMessage.style.color = '#48bb78';
        errorMessage.style.opacity = 1;
        
        // Change button icon to check
        const buttonIcon = document.querySelector('.login-btn i');
        buttonIcon.className = 'fas fa-check';
        
        // Add success pulse to button
        const loginBtn = document.querySelector('.login-btn');
        loginBtn.classList.add('success-pulse');
    }
    
    // Helper function to redirect to gallery
    function redirectToGallery(code, name) {
        // Redirect to gallery page with access code as parameter
        window.location.href = `gallery.html?code=${encodeURIComponent(code)}&name=${encodeURIComponent(name)}`;
    }
    
    // Animation for login form appearance
    setTimeout(() => {
        document.querySelector('.login-box').classList.add('appear');
    }, 100);
    
    // Create floating animation for orbs
    const createRandomMovement = () => {
        const orbs = document.querySelectorAll('.light-orb');
        
        orbs.forEach(orb => {
            // Add some random movement to each orb
            const randomX = Math.random() * 10 - 5; // -5 to 5
            const randomY = Math.random() * 10 - 5; // -5 to 5
            const randomDuration = 15 + Math.random() * 10; // 15-25s
            const randomDelay = Math.random() * -15; // -15 to 0s
            
            orb.style.animationDuration = `${randomDuration}s`;
            orb.style.animationDelay = `${randomDelay}s`;
        });
    };
    
    createRandomMovement();

    // Simple parallax effect for pricing section
    const pricingSection = document.getElementById('pricing-section');
    
    window.addEventListener('scroll', function() {
        if (pricingSection) {
            const rect = pricingSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                const scrollPosition = window.scrollY;
                const speed = 0.05;
                pricingSection.style.backgroundPosition = `center ${scrollPosition * speed}px`;
            }
        }
    });
}); 