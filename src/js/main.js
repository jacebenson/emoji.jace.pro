// Emoji search and copy functionality
class EmojiApp {
    constructor() {
        this.searchInput = document.getElementById('emoji-search');
        this.clearBtn = document.getElementById('clear-search');
        this.searchResults = document.getElementById('search-results');
        this.searchGrid = document.getElementById('search-grid');
        this.popularEmojis = document.querySelector('.popular-emojis');
        this.emojiCategories = document.querySelector('.emoji-categories');
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toast-message');
        
        // Get all emoji data from the page
        this.allEmojis = this.extractEmojiData();
        this.globalEmojis = null;
        
        // Load global emoji data for comprehensive search
        this.loadGlobalEmojis();
        
        this.initEventListeners();
    }
    
    async loadGlobalEmojis() {
        // Use global emoji data if available
        if (window.EMOJI_DATA) {
            this.globalEmojis = window.EMOJI_DATA;
            console.log(`Loaded ${this.globalEmojis.length} emojis for search`);
            return;
        }
        
        // Fallback to API endpoint
        try {
            const response = await fetch('/api/emojis.json');
            if (response.ok) {
                const data = await response.json();
                this.globalEmojis = data.all || [];
                console.log(`Loaded ${this.globalEmojis.length} emojis for search`);
            }
        } catch (err) {
            console.log('Could not load global emoji data, using page data only');
        }
    }
    
    extractEmojiData() {
        const emojiItems = document.querySelectorAll('.emoji-item[data-emoji]');
        return Array.from(emojiItems).map(item => ({
            char: item.dataset.emoji,
            name: item.dataset.name,
            codepoints: item.dataset.codepoints,
            element: item
        }));
    }
    
    initEventListeners() {
        // Search functionality
        if (this.searchInput) {
            this.searchInput.addEventListener('input', this.handleSearch.bind(this));
            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.clearSearch();
                }
            });
        }
        
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', this.clearSearch.bind(this));
        }
        
        // Copy functionality for emoji items
        document.addEventListener('click', (e) => {
            const emojiItem = e.target.closest('.emoji-item');
            const copyBtn = e.target.closest('.copy-btn-large, .copy-option');
            const emojiLarge = e.target.closest('.emoji-large');
            
            if (emojiItem) {
                this.copyEmoji(emojiItem.dataset.emoji, emojiItem.dataset.name);
            } else if (copyBtn) {
                if (copyBtn.dataset.emoji) {
                    this.copyEmoji(copyBtn.dataset.emoji, copyBtn.dataset.name);
                } else if (copyBtn.dataset.copy) {
                    this.copyText(copyBtn.dataset.copy);
                }
            } else if (emojiLarge) {
                this.copyEmoji(emojiLarge.dataset.emoji, emojiLarge.dataset.name);
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Focus search with Ctrl/Cmd + K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (this.searchInput) {
                    this.searchInput.focus();
                }
            }
        });
    }
    
    handleSearch(e) {
        const query = e.target.value.trim().toLowerCase();
        
        if (query.length === 0) {
            this.clearSearch();
            return;
        }
        
        // Perform search immediately
        this.performSearch(query);
    }
    
    performSearch(query) {
        // Create a more comprehensive search that includes both the page emojis and allows for global search
        const results = this.searchEmojis(query);
        this.displaySearchResults(results, query);
    }
    
    searchEmojis(query) {
        // Use global emoji data if available, otherwise use page emojis
        const searchData = this.globalEmojis || this.allEmojis;
        
        const results = searchData.filter(emoji => {
            const name = emoji.name || '';
            const char = emoji.char || '';
            const codepoints = emoji.codepoints || '';
            
            return name.toLowerCase().includes(query) ||
                   char === query ||
                   codepoints.toLowerCase().includes(query);
        });
        
        // Limit results to 100 for performance
        return results.slice(0, 100);
    }
    
    displaySearchResults(results, query) {
        if (!this.searchResults || !this.searchGrid) return;
        
        console.log(`Search for "${query}" returned ${results.length} results`);
        
        // Hide other sections
        if (this.popularEmojis) this.popularEmojis.style.display = 'none';
        if (this.emojiCategories) this.emojiCategories.style.display = 'none';
        
        // Show search results
        this.searchResults.style.display = 'block';
        
        if (results.length === 0) {
            this.searchGrid.innerHTML = '<p class="no-results">No emojis found for "' + this.escapeHtml(query) + '"</p>';
            return;
        }
        
        // Generate HTML for search results
        this.searchGrid.innerHTML = results.map(emoji => `
            <div class="emoji-item" data-emoji="${emoji.char}" data-name="${emoji.name}" data-codepoints="${emoji.codepoints}">
                <span class="emoji-char">${emoji.char}</span>
                <span class="emoji-name">${emoji.name}</span>
            </div>
        `).join('');
    }
    
    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        
        if (this.searchResults) {
            this.searchResults.style.display = 'none';
        }
        
        // Show other sections
        if (this.popularEmojis) this.popularEmojis.style.display = 'block';
        if (this.emojiCategories) this.emojiCategories.style.display = 'block';
    }
    
    async copyEmoji(emoji, name) {
        await this.copyText(emoji);
        this.showToast(`Copied ${emoji} ${name}`);
    }
    
    async copyText(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers or non-secure contexts
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            
            if (!text.includes(' ')) { // Simple check if it's just emoji/code
                this.showToast(`Copied: ${text}`);
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            this.showToast('Failed to copy to clipboard', 'error');
        }
    }
    
    showToast(message, type = 'success') {
        if (!this.toast || !this.toastMessage) return;
        
        this.toastMessage.textContent = message;
        this.toast.className = `toast ${type}`;
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Enhanced search for pages with more emoji data
class GlobalEmojiSearch extends EmojiApp {
    constructor() {
        super();
        this.emojiDatabase = null;
        this.loadEmojiDatabase();
    }
    
    async loadEmojiDatabase() {
        // Try to load emoji data from a JSON endpoint if available
        try {
            const response = await fetch('/api/emojis.json');
            if (response.ok) {
                this.emojiDatabase = await response.json();
            }
        } catch (err) {
            console.log('Global emoji database not available, using page data only');
        }
    }
    
    searchEmojis(query) {
        let results = super.searchEmojis(query);
        
        // If we have a global database and few results, search it too
        if (this.emojiDatabase && results.length < 20) {
            const globalResults = this.emojiDatabase.filter(emoji => {
                return emoji.name.toLowerCase().includes(query) ||
                       emoji.char === query ||
                       emoji.codepoints.toLowerCase().includes(query);
            });
            
            // Merge results, avoiding duplicates
            const existingChars = new Set(results.map(r => r.char));
            const newResults = globalResults.filter(r => !existingChars.has(r.char));
            results = [...results, ...newResults].slice(0, 100); // Limit to 100 results
        }
        
        return results;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Use GlobalEmojiSearch if we're on the homepage, regular EmojiApp elsewhere
    const isHomepage = document.body.classList.contains('homepage') || 
                      window.location.pathname === '/' || 
                      document.querySelector('.popular-emojis');
    
    if (isHomepage) {
        window.emojiApp = new GlobalEmojiSearch();
    } else {
        window.emojiApp = new EmojiApp();
    }
});

// Add some utility functions to the global scope
window.copyEmoji = function(emoji, name) {
    if (window.emojiApp) {
        window.emojiApp.copyEmoji(emoji, name);
    }
};

// Add keyboard shortcut info to search placeholder
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('emoji-search');
    if (searchInput) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const shortcut = isMac ? '⌘K' : 'Ctrl+K';
        searchInput.placeholder = `Search emojis... (${shortcut})`;
    }
});
