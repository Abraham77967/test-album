// Access Control Script
(function() {
    // Access code configuration - keep in sync with login.js
    const accessCodes = {
        'PHOTOS2025': { name: 'Photos 2025' }, 
        'RUINA': { name: 'Ruina' },
        'JESSE': { name: 'Jesse' },
        'ALINA': { name: 'Alina' },
        'GRANT': { name: 'Grant' },
        'DEMO': { name: 'Demo Access' }
    };
    
    // Encryption key for sharing (simple encryption for demo purposes)
    const encryptionKey = 'photoalbum2025';
    
    // Check if the user has access to the page
    function checkAccess() {
        // Parse URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const codeParam = urlParams.get('code');
        const nameParam = urlParams.get('name');
        const shareParam = urlParams.get('share');
        
        // Check session storage for existing session
        const savedSession = localStorage.getItem('photoAccessSession');
        let hasAccess = false;
        let userName = 'Guest';
        let accessCode = '';
        
        if (savedSession) {
            try {
                const session = JSON.parse(savedSession);
                if (session && session.code && session.expires > Date.now()) {
                    // Valid session exists
                    hasAccess = true;
                    userName = session.name;
                    accessCode = session.code;
                } else {
                    // Expired session, remove it
                    localStorage.removeItem('photoAccessSession');
                }
            } catch (e) {
                console.error('Error parsing saved session:', e);
                localStorage.removeItem('photoAccessSession');
            }
        } else if (shareParam) {
            // Try to decrypt the share token
            try {
                const decrypted = decryptShareToken(shareParam);
                if (decrypted && decrypted.code && accessCodes[decrypted.code]) {
                    hasAccess = true;
                    userName = decrypted.name || accessCodes[decrypted.code].name;
                    accessCode = decrypted.code;
                    
                    // Save session (expires in 30 days)
                    const session = {
                        code: accessCode,
                        name: userName,
                        expires: Date.now() + (30 * 24 * 60 * 60 * 1000)
                    };
                    localStorage.setItem('photoAccessSession', JSON.stringify(session));
                }
            } catch (e) {
                console.error('Error decrypting share token:', e);
            }
        } else if (codeParam && accessCodes[codeParam.toUpperCase()]) {
            // Valid access code in URL
            hasAccess = true;
            userName = nameParam || accessCodes[codeParam.toUpperCase()].name;
            accessCode = codeParam.toUpperCase();
            
            // Save session (expires in 30 days)
            const session = {
                code: accessCode,
                name: userName,
                expires: Date.now() + (30 * 24 * 60 * 60 * 1000)
            };
            localStorage.setItem('photoAccessSession', JSON.stringify(session));
        }
        
        // If not authenticated, redirect to login page
        if (!hasAccess) {
            window.location.href = 'index.html';
            return false;
        }
        
        // Show welcome banner
        showWelcomeBanner(userName);
        
        // Initialize sharing functionality
        if (window.location.pathname.includes('gallery.html')) {
            initShareFunctionality(accessCode, userName);
        }
        
        return true;
    }
    
    // Show welcome banner
    function showWelcomeBanner(name) {
        const welcomeBanner = document.getElementById('welcome-banner');
        const userName = document.getElementById('user-name');
        
        if (welcomeBanner && userName) {
            userName.textContent = name;
            welcomeBanner.style.display = 'flex';
            
            // Handle logout button click
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('photoAccessSession');
                    window.location.href = 'index.html';
                });
            }
        }
    }
    
    // Initialize sharing functionality
    function initShareFunctionality(code, name) {
        const shareBtn = document.getElementById('share-btn');
        const shareModal = document.getElementById('share-modal');
        const closeBtn = document.querySelector('.modal-close');
        const copyBtn = document.getElementById('copy-link-btn');
        const shareLink = document.getElementById('share-link');
        const copySuccess = document.getElementById('copy-success');
        
        if (!shareBtn || !shareModal) return;
        
        // Create share token
        const shareToken = createShareToken(code, name);
        
        // Create share URL
        const currentUrl = window.location.href.split('?')[0]; // Remove any query params
        const shareUrl = `${currentUrl}?share=${shareToken}`;
        
        // Set the share link input value
        if (shareLink) {
            shareLink.value = shareUrl;
        }
        
        // Show modal when share button is clicked
        shareBtn.addEventListener('click', () => {
            shareModal.classList.add('show');
            if (shareLink) {
                setTimeout(() => {
                    shareLink.select();
                }, 300);
            }
        });
        
        // Close modal when close button is clicked
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                shareModal.classList.remove('show');
            });
        }
        
        // Close modal when clicking outside the content
        shareModal.addEventListener('click', (event) => {
            if (event.target === shareModal) {
                shareModal.classList.remove('show');
            }
        });
        
        // Close modal with escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && shareModal.classList.contains('show')) {
                shareModal.classList.remove('show');
            }
        });
        
        // Copy link to clipboard when copy button is clicked
        if (copyBtn && shareLink) {
            copyBtn.addEventListener('click', () => {
                shareLink.select();
                
                try {
                    // Try using the newer clipboard API first
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(shareLink.value)
                            .then(() => showCopySuccess())
                            .catch(err => {
                                console.error('Clipboard error:', err);
                                fallbackCopy();
                            });
                    } else {
                        fallbackCopy();
                    }
                } catch (e) {
                    console.error('Copy error:', e);
                    fallbackCopy();
                }
            });
        }
        
        // Fallback copy method using execCommand
        function fallbackCopy() {
            shareLink.select();
            const success = document.execCommand('copy');
            if (success) {
                showCopySuccess();
            } else {
                console.error('Failed to copy');
            }
        }
        
        // Show copy success message
        function showCopySuccess() {
            if (copySuccess) {
                copySuccess.classList.add('show');
                setTimeout(() => {
                    copySuccess.classList.remove('show');
                }, 2000);
            }
        }
    }
    
    // Create encrypted share token (simple encryption for demo purposes)
    function createShareToken(code, name) {
        const data = { code, name };
        const jsonData = JSON.stringify(data);
        return btoa(encodeURIComponent(jsonData)); // Base64 encode
    }
    
    // Decrypt share token
    function decryptShareToken(token) {
        try {
            const jsonData = decodeURIComponent(atob(token)); // Base64 decode
            return JSON.parse(jsonData);
        } catch (e) {
            console.error('Error decrypting token:', e);
            return null;
        }
    }
    
    // Run access check on page load
    window.addEventListener('DOMContentLoaded', () => {
        checkAccess();
    });
})(); 