// tools-loader.js - Dynamic Tool Loading & Search Logic
// Centralized resource hub: https://jamesabela.github.io/jsfun/usefulresources.json

const CENTRAL_RESOURCES_URL = 'https://jamesabela.github.io/jsfun/usefulresources.json';

let toolsData = [];
let activeCategory = 'All';
let searchQuery = '';

/**
 * Resolves tool URLs appropriately for local development vs live deployment
 */
function resolveToolUrl(url) {
    if (!url) return '#';
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.protocol === 'file:';
    if (isLocal && url.startsWith('https://jamesabela.github.io/reading/')) {
        return url.replace('https://jamesabela.github.io/reading/', '');
    }
    return url;
}

/**
/**
 * Initialize tools directly from the central usefulresources.json
 */
async function initTools() {
    const container = document.getElementById('tools-grid-container');
    try {
        const response = await fetch(CENTRAL_RESOURCES_URL);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();

        // Extract English tools from the central multi-topic structure
        if (data && data.byTopic && Array.isArray(data.byTopic.english)) {
            toolsData = data.byTopic.english;
        } else if (data && Array.isArray(data.categories)) {
            // Filter categories containing English tools
            toolsData = data.categories.map(cat => ({
                ...cat,
                tools: (cat.tools || []).filter(tool => Array.isArray(tool.topics) && tool.topics.includes('english'))
            })).filter(cat => cat.tools && cat.tools.length > 0);
        } else {
            throw new Error('Unrecognized resources data format');
        }

        renderFilters();
        renderTools();
        setupSearch();
    } catch (error) {
        console.error('Error loading tools:', error);
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <h3>Couldn't load resources</h3>
                    <p style="color: var(--text-muted); margin-top: 0.5rem;">Please check your connection or refresh the page.</p>
                </div>
            `;
        }
    }
}

/**
 * Render category filter chips
 */
function renderFilters() {
    const filterContainer = document.getElementById('filter-chips');
    if (!filterContainer) return;

    const categories = ['All', ...toolsData.map(cat => cat.category)];

    filterContainer.innerHTML = categories.map(cat => `
        <button class="chip ${cat === activeCategory ? 'active' : ''}" data-category="${cat}">
            ${cat}
        </button>
    `).join('');

    // Filter click handlers
    filterContainer.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            activeCategory = chip.dataset.category;
            filterContainer.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            renderTools();
        });
    });
}

/**
 * Configure search input listener
 */
function setupSearch() {
    const searchInput = document.getElementById('tool-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderTools();
    });
}

/**
 * Render tools grid based on active filter and search query
 */
function renderTools() {
    const container = document.getElementById('tools-grid-container');
    if (!container) return;

    container.innerHTML = '';

    let resultsFound = false;

    toolsData.forEach(catSection => {
        // Skip if category mismatch (unless 'All')
        if (activeCategory !== 'All' && activeCategory !== catSection.category) return;

        const filteredTools = (catSection.tools || []).filter(tool => {
            if (!searchQuery) return true;
            const titleMatch = tool.title && tool.title.toLowerCase().includes(searchQuery);
            const descMatch = tool.desc && tool.desc.toLowerCase().includes(searchQuery);
            const tagMatch = tool.tag && tool.tag.toLowerCase().includes(searchQuery);
            const authorMatch = tool.author && tool.author.toLowerCase().includes(searchQuery);
            return titleMatch || descMatch || tagMatch || authorMatch;
        });

        if (filteredTools.length > 0) {
            resultsFound = true;

            const section = document.createElement('div');
            section.className = 'category-section reveal active';

            section.innerHTML = `
                <div class="category-title">
                    <h2>${catSection.category}</h2>
                    ${catSection.description ? `<p class="category-desc">${catSection.description}</p>` : ''}
                </div>
                <div class="grid-3">
                    ${filteredTools.map(tool => {
                        const targetUrl = resolveToolUrl(tool.url);
                        return `
                        <div class="card reveal active tool-card">
                            <div class="tool-card-header">
                                <span class="tag">${tool.tag || 'English'}</span>
                                ${tool.author ? `<span class="author-badge">By ${tool.author}</span>` : ''}
                            </div>
                            <h3>${tool.title}</h3>
                            <p class="tool-desc">${tool.desc}</p>
                            <div class="tool-card-actions">
                                <a href="${targetUrl}" ${tool.isExternal ? 'target="_blank" rel="noopener"' : ''} class="btn btn-primary"
                                    style="padding: 0.6rem 1.2rem; font-size: 0.8rem;">
                                    ${tool.isExternal ? 'Visit Tool' : 'Launch App'}
                                </a>
                                ${tool.tutorialVideo ? `
                                <a href="${tool.tutorialVideo}" target="_blank" rel="noopener" class="btn btn-secondary tool-video-btn" title="Watch Video Tutorial">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                    Video
                                </a>` : ''}
                            </div>
                        </div>
                    `;
                    }).join('')}
                </div>
            `;
            container.appendChild(section);
        }
    });

    if (!resultsFound) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
                <h3>No tools found matching "${searchQuery}"</h3>
                <p style="color: var(--text-muted); margin-top: 0.5rem;">Try a different keyword or select another category filter.</p>
            </div>
        `;
    }

    // Re-trigger reveal animations for new elements if using the observer
    if (window.revealObserver) {
        document.querySelectorAll('.reveal').forEach(el => window.revealObserver.observe(el));
    }
}

document.addEventListener('DOMContentLoaded', initTools);
