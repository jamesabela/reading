// tools-loader.js - Dynamic Tool Loading & Search Logic

let toolsData = [];
let activeCategory = 'All';
let searchQuery = '';

async function initTools() {
    try {
        const response = await fetch('tools.json');
        toolsData = await response.json();
        
        renderFilters();
        renderTools();
        setupSearch();
    } catch (error) {
        console.error('Error loading tools:', error);
        document.getElementById('tools-grid-container').innerHTML = `
            <div class="empty-state">
                <h3>Oops! Couldn't load tools.</h3>
                <p>Please check your connection and try again.</p>
            </div>
        `;
    }
}

function renderFilters() {
    const filterContainer = document.getElementById('filter-chips');
    if (!filterContainer) return;

    const categories = ['All', ...toolsData.map(cat => cat.category)];
    
    filterContainer.innerHTML = categories.map(cat => `
        <button class="chip ${cat === activeCategory ? 'active' : ''}" data-category="${cat}">
            ${cat}
        </button>
    `).join('');

    // Filter Click Logic
    filterContainer.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            activeCategory = chip.dataset.category;
            filterContainer.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            renderTools();
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('tool-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderTools();
    });
}

function renderTools() {
    const container = document.getElementById('tools-grid-container');
    if (!container) return;

    container.innerHTML = ''; // Clear current tools

    let resultsFound = false;

    toolsData.forEach(catSection => {
        // Skip if category mismatch (unless 'All')
        if (activeCategory !== 'All' && activeCategory !== catSection.category) return;

        const filteredTools = catSection.tools.filter(tool => {
            const matchesSearch = tool.title.toLowerCase().includes(searchQuery) || 
                                tool.desc.toLowerCase().includes(searchQuery) ||
                                tool.tag.toLowerCase().includes(searchQuery);
            return matchesSearch;
        });

        if (filteredTools.length > 0) {
            resultsFound = true;
            
            // Create Category Section
            const section = document.createElement('div');
            section.className = 'category-section reveal active'; // Reveal active immediately for dynamic feel
            
            section.innerHTML = `
                <div class="category-title">
                    <h2>${catSection.category}</h2>
                </div>
                <div class="grid-3">
                    ${filteredTools.map(tool => `
                        <div class="card reveal active tool-card">
                            <span class="emoji">${tool.emoji}</span>
                            <span class="tag">${tool.tag}</span>
                            <h3>${tool.title}</h3>
                            <p style="color: var(--text-muted); margin: 1.5rem 0;">${tool.desc}</p>
                            <a href="${tool.url}" ${tool.isExternal ? 'target="_blank"' : ''} class="btn btn-primary"
                                style="padding: 0.6rem 1.2rem; font-size: 0.8rem;">
                                ${tool.isExternal ? 'Visit Tool' : 'Launch App'}
                            </a>
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(section);
        }
    });

    if (!resultsFound) {
        container.innerHTML = `
            <div class="empty-state">
                <span style="font-size: 3rem; display: block; margin-bottom: 1rem;">🔍</span>
                <h3>No tools found matching "${searchQuery}"</h3>
                <p>Try a different keyword or browse by category.</p>
            </div>
        `;
    }

    // Re-trigger reveal animations for new elements if using the observer
    if (window.revealObserver) {
        document.querySelectorAll('.reveal').forEach(el => window.revealObserver.observe(el));
    }
}

document.addEventListener('DOMContentLoaded', initTools);
