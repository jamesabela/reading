// Concept Grid - Shared Global Components

function renderNav() {
    const navPlaceholder = document.getElementById('main-nav');
    if (!navPlaceholder) return;

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const pathParts = window.location.pathname.split('/');
    const isSubdir = pathParts.includes('penalties') || pathParts.includes('editor') || pathParts.includes('assets');
    const basePath = isSubdir ? '../' : '';

    const navHTML = `
        <div class="container nav-content">
            <a href="${basePath}index.html" class="logo">
                <img src="${basePath}assets/Logo%20Transparent.png" alt="Logo" style="height: 40px; margin-right: 10px;"> Concept Grid
            </a>
            <button class="nav-toggle" id="mobile-toggle">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-links" id="nav-menu">
                <li><a href="${basePath}index.html" class="${currentPath === 'index.html' && !isSubdir ? 'active' : ''}">Home</a></li>
                <li><a href="${basePath}research.html" class="${currentPath === 'research.html' ? 'active' : ''}">Research</a></li>
                <li><a href="${basePath}dyslexia.html" class="${currentPath === 'dyslexia.html' ? 'active' : ''}">Dyslexia</a></li>
                <li><a href="${basePath}eal.html" class="${currentPath === 'eal.html' ? 'active' : ''}">EAL Support</a></li>
                <li><a href="${basePath}news.html" class="${currentPath === 'news.html' ? 'active' : ''}">News</a></li>
                <li><a href="${basePath}videos.html" class="${currentPath === 'videos.html' ? 'active' : ''}">Videos</a></li>
                <li><a href="${basePath}apps.html" class="${currentPath === 'apps.html' ? 'active' : ''}">English Tools</a></li>
                <li><a href="${basePath}contact.html" class="${currentPath === 'contact.html' ? 'active' : ''}">Contact</a></li>
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

    const pathParts = window.location.pathname.split('/');
    const isSubdir = pathParts.includes('penalties') || pathParts.includes('editor') || pathParts.includes('assets');
    const basePath = isSubdir ? '../' : '';

    footerPlaceholder.innerHTML = `
        <div class="container">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; text-align: left; margin-bottom: 4rem;">
                <div>
                    <h4 style="margin-bottom: 1.5rem;">Concept Grid</h4>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Empowering educators with world-class vocabulary tools. Powered by <a href="${basePath}lexaengine.html" style="color: inherit; text-decoration: underline;">LexaEngine™</a>.</p>
                </div>
                <div>
                    <h4 style="margin-bottom: 1.5rem;">Explore</h4>
                    <ul style="list-style: none; font-size: 0.9rem;">
                        <li><a href="${basePath}research.html" style="color: var(--text-muted); text-decoration: none;">Research</a></li>
                        <li><a href="${basePath}dyslexia.html" style="color: var(--text-muted); text-decoration: none;">Dyslexia Support</a></li>
                        <li><a href="${basePath}eal.html" style="color: var(--text-muted); text-decoration: none;">EAL Support</a></li>
                        <li><a href="${basePath}news.html" style="color: var(--text-muted); text-decoration: none;">Latest News</a></li>
                        <li><a href="${basePath}contact.html" style="color: var(--text-muted); text-decoration: none;">Contact Us</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style="margin-bottom: 1.5rem;">Download</h4>
                    <p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 1rem;">Includes a 7-day free trial.</p>
                    <a href="https://apps.microsoft.com/detail/9nfvnqtj2j7r">
                        <img src="${basePath}assets/en-us%20dark.svg" alt="Get it from Microsoft" style="width: 140px;">
                    </a>
                </div>
            </div>
            <div style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding-top: 2rem; border-top: 2px solid var(--card-border);">
                © 2026 Concept Grid. Built for Classroom Excellence.
            </div>
        </div>
    `;
}

function renderNews() {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;

    const newsItems = [
        {
            version: "Version 1.3.0.0",
            date: "Tuesday, April 14, 2026",
            title: "Enhanced Accessibility & Audio",
            content: "The latest update enhances usability and accessibility by introducing dynamic right-click context menus for both grid quadrants and the centre word. New read-aloud features allow users to hear selected text, supporting improved accessibility. Piper Neural text to speech has been integrated to provide high-quality offline speech synthesis, now fully managed within the application for a seamless experience.",
            highlight: "NEW AUDIO SYSTEM"
        },
        {
            version: "Version 1.2.0.0",
            date: "Friday, April 10, 2026",
            title: "Expanded Export & Layouts",
            content: "This version adds new export options to make Concept Grid even more useful in the classroom, including Excel (XLSX) export and a new spelling worksheet PDF export with a 'Look-Say-Cover-Write-Check' layout. Strengthens accessibility with better spacing and layout support for Open Dyslexic.",
            highlight: "CLASSROOM TOOLS"
        }
    ];

    newsGrid.innerHTML = newsItems.map(item => `
        <div class="card reveal">
            <span style="font-size: 0.7rem; font-weight: 800; color: var(--secondary); text-transform: uppercase;">${item.highlight} • ${item.date}</span>
            <h2 style="margin: 1rem 0;">${item.version}</h2>
            <h4 style="color: var(--primary); margin-bottom: 1rem;">${item.title}</h4>
            <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">${item.content}</p>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    renderNav();
    renderFooter();
    renderNews();

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
