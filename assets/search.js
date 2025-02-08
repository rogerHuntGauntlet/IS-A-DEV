// Search and filter functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
});

function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const clearButton = document.querySelector('.search-clear');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFilter = document.getElementById('dateFilter');
    const contentFilter = document.getElementById('contentFilter');
    const resetFiltersBtn = document.querySelector('.reset-filters-btn');
    const activeFiltersContainer = document.querySelector('.active-filters');

    if (!searchInput || !clearButton || !categoryFilter || !dateFilter || 
        !contentFilter || !resetFiltersBtn || !activeFiltersContainer) {
        console.warn('Some search elements are missing');
        return;
    }

    // Event listeners
    searchInput.addEventListener('input', () => {
        clearButton.style.display = searchInput.value ? 'block' : 'none';
        performSearch();
    });

    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        clearButton.style.display = 'none';
        performSearch();
    });

    categoryFilter.addEventListener('change', performSearch);
    dateFilter.addEventListener('change', performSearch);
    contentFilter.addEventListener('change', performSearch);

    resetFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        categoryFilter.value = '';
        dateFilter.value = '';
        contentFilter.value = '';
        clearButton.style.display = 'none';
        performSearch();
    });
}

function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFilter = document.getElementById('dateFilter');
    const contentFilter = document.getElementById('contentFilter');
    const posts = document.querySelectorAll('.blog-post');

    if (!searchInput || !categoryFilter || !dateFilter || !contentFilter) return;

    const searchQuery = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const dateRange = dateFilter.value;
    const contentType = contentFilter.value;
    let matchCount = 0;

    posts.forEach(post => {
        const postText = post.textContent.toLowerCase();
        const postCategory = post.dataset.category;
        const postDate = new Date(post.dataset.date);
        const hasImage = post.querySelector('.blog-image') !== null;
        
        let isVisible = true;

        // Apply search filter
        if (searchQuery && !postText.includes(searchQuery)) {
            isVisible = false;
        }

        // Apply category filter
        if (category && postCategory !== category) {
            isVisible = false;
        }

        // Apply date filter
        if (dateRange && !isWithinDateRange(postDate, dateRange)) {
            isVisible = false;
        }

        // Apply content type filter
        if (contentType) {
            const shouldHidePost = (contentType === 'with-images' && !hasImage) || 
                                 (contentType === 'without-images' && hasImage);
            if (shouldHidePost) {
                isVisible = false;
            }
        }

        post.classList.toggle('hidden', !isVisible);
        if (isVisible) matchCount++;
    });

    updateSearchResults(matchCount);
    updateActiveFilters();
}

function isWithinDateRange(date, range) {
    const now = new Date();
    const compareDate = new Date();

    switch (range) {
        case 'last-7-days':
            compareDate.setDate(now.getDate() - 7);
            return date >= compareDate;
        case 'last-30-days':
            compareDate.setDate(now.getDate() - 30);
            return date >= compareDate;
        case 'last-3-months':
            compareDate.setMonth(now.getMonth() - 3);
            return date >= compareDate;
        case 'last-year':
            compareDate.setFullYear(now.getFullYear() - 1);
            return date >= compareDate;
        default:
            return true;
    }
}

function updateActiveFilters() {
    const activeFiltersContainer = document.querySelector('.active-filters');
    if (!activeFiltersContainer) return;

    activeFiltersContainer.innerHTML = '';
    const activeFilters = [];

    const searchInput = document.querySelector('.search-input');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFilter = document.getElementById('dateFilter');
    const contentFilter = document.getElementById('contentFilter');

    if (!searchInput || !categoryFilter || !dateFilter || !contentFilter) return;
    
    if (searchInput.value) {
        activeFilters.push({
            type: 'search',
            value: searchInput.value
        });
    }
    
    if (categoryFilter.value) {
        activeFilters.push({
            type: 'category',
            value: getCategoryLabel(categoryFilter.value)
        });
    }
    
    if (dateFilter.value) {
        activeFilters.push({
            type: 'date',
            value: dateFilter.value
        });
    }
    
    if (contentFilter.value) {
        activeFilters.push({
            type: 'content',
            value: contentFilter.value
        });
    }

    activeFilters.forEach(filter => {
        const filterTag = document.createElement('span');
        filterTag.className = 'active-filter';
        filterTag.innerHTML = `${filter.value} <button onclick="clearFilter('${filter.type}')">&times;</button>`;
        activeFiltersContainer.appendChild(filterTag);
    });
}

function updateSearchResults(count) {
    const searchResults = document.querySelector('.search-results');
    if (!searchResults) return;

    const searchInput = document.querySelector('.search-input');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFilter = document.getElementById('dateFilter');
    const contentFilter = document.getElementById('contentFilter');

    if (!searchInput || !categoryFilter || !dateFilter || !contentFilter) return;

    let message = '';
    if (count === 0) {
        message = 'No posts found';
    } else {
        message = `Found ${count} ${count === 1 ? 'post' : 'posts'}`;
        if (searchInput.value) {
            message += ` matching "${searchInput.value}"`;
        }
        if (categoryFilter.value || dateFilter.value || contentFilter.value) {
            message += ' with selected filters';
        }
    }
    searchResults.textContent = message;
}

function clearFilter(filterType) {
    const searchInput = document.querySelector('.search-input');
    const searchClear = document.querySelector('.search-clear');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFilter = document.getElementById('dateFilter');
    const contentFilter = document.getElementById('contentFilter');

    if (!searchInput || !searchClear || !categoryFilter || !dateFilter || !contentFilter) return;

    switch (filterType) {
        case 'search':
            searchInput.value = '';
            searchClear.style.display = 'none';
            break;
        case 'category':
            categoryFilter.value = '';
            break;
        case 'date':
            dateFilter.value = '';
            break;
        case 'content':
            contentFilter.value = '';
            break;
    }
    performSearch();
}

function getCategoryLabel(category) {
    const labels = {
        'development': '💻 Development',
        'ai': '🤖 AI & ML',
        'gauntlet': '⚡ Gauntlet Program',
        'projects': '🚀 Projects',
        'events': '📅 Events & Updates'
    };
    return labels[category] || category;
} 