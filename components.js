// Concept Grid - Shared Global Components

function renderNav() {
    const navPlaceholder = document.getElementById('main-nav');
    if (!navPlaceholder) return;

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    const navHTML = `
        <div class="container nav-content">
            <a href="index.html" class="logo">
                <img src="assets/Logo%20Transparent.png" alt="Logo" style="height: 40px; margin-right: 10px;"> Concept Grid
            </a>
            <button class="nav-toggle" id="mobile-toggle">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-links" id="nav-menu">
                <li><a href="index.html" class="${currentPath === 'index.html' ? 'active' : ''}">Home</a></li>
                <li><a href="research.html" class="${currentPath === 'research.html' ? 'active' : ''}">Research</a></li>
                <li><a href="dyslexia.html" class="${currentPath === 'dyslexia.html' ? 'active' : ''}">Dyslexia</a></li>
                <li><a href="eal.html" class="${currentPath === 'eal.html' ? 'active' : ''}">EAL Support</a></li>
                <li><a href="apps.html" class="${currentPath === 'apps.html' ? 'active' : ''}">English Tools</a></li>
                <li><a href="contact.html" class="${currentPath === 'contact.html' ? 'active' : ''}">Contact</a></li>
            </ul>
            <a href="https://apps.microsoft.com/detail/9nfvnqtj2j7r" class="btn btn-primary" style="padding: 0.8rem 1.5rem; font-size: 0.9rem; margin-left: 1.5rem;">Download Now</a>
        </div>
    `;

    navPlaceholder.innerHTML = navHTML;
    navPlaceholder.className = 'scrolled'; // Always show background for consistency if preferred

    // Mobile Toggle Logic
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('nav-menu');

    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        toggle.classList.toggle('open');
        // Simple animation for hamburger
        const spans = toggle.querySelectorAll('span');
        if(menu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

function renderFooter() {
    const footerPlaceholder = document.getElementById('main-footer');
    if (!footerPlaceholder) return;

    footerPlaceholder.innerHTML = `
        <div class="container">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; text-align: left; margin-bottom: 4rem;">
                <div>
                    <h4 style="margin-bottom: 1.5rem;">Concept Grid</h4>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Empowering educators with world-class vocabulary tools. Powered by <a href="lexaengine.html" style="color: inherit; text-decoration: underline;">LexaEngine™</a>.</p>
                </div>
                <div>
                    <h4 style="margin-bottom: 1.5rem;">Explore</h4>
                    <ul style="list-style: none; font-size: 0.9rem;">
                        <li><a href="research.html" style="color: var(--text-muted); text-decoration: none;">Research</a></li>
                        <li><a href="dyslexia.html" style="color: var(--text-muted); text-decoration: none;">Dyslexia Support</a></li>
                        <li><a href="eal.html" style="color: var(--text-muted); text-decoration: none;">EAL Support</a></li>
                        <li><a href="contact.html" style="color: var(--text-muted); text-decoration: none;">Contact Us</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style="margin-bottom: 1.5rem;">Download</h4>
                    <p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 1rem;">Includes a 7-day free trial.</p>
                    <a href="https://apps.microsoft.com/detail/9nfvnqtj2j7r">
                        <img src="assets/en-us%20dark.svg" alt="Get it from Microsoft" style="width: 140px;">
                    </a>
                </div>
            </div>
            <div style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding-top: 2rem; border-top: 2px solid var(--card-border);">
                © 2026 Concept Grid. Built for Classroom Excellence.
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    renderNav();
    renderFooter();

    // Scroll effect for nav
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('main-nav');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            // Keep scrolled class if it was manually added or stay consistent
            // For multi-page, leaving it 'scrolled' looks cleaner on interior pages
        }
    });

    // Reveal animations
    window.revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => window.revealObserver.observe(el));
});
