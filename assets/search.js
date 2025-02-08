// Search and filter functionality
function performSearch() {
    const searchQuery = document.querySelector('.search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    const contentFilter = document.getElementById('contentFilter').value;
    const posts = document.querySelectorAll('.blog-post');
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
        if (categoryFilter && postCategory !== categoryFilter) {
            isVisible = false;
        }

        // Apply date filter
        if (dateFilter && !isWithinDateRange(postDate, dateFilter)) {
            isVisible = false;
        }

        // Apply content type filter
        if (contentFilter) {
            const shouldHidePost = (contentFilter === 'with-images' && !hasImage) || 
                                 (contentFilter === 'without-images' && hasImage);
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
    activeFiltersContainer.innerHTML = '';

    const activeFilters = [];
    
    // Check each filter
    if (document.querySelector('.search-input').value) {
        activeFilters.push({
            type: 'search',
            value: document.querySelector('.search-input').value
        });
    }
    
    if (document.getElementById('categoryFilter').value) {
        activeFilters.push({
            type: 'category',
            value: getCategoryLabel(document.getElementById('categoryFilter').value)
        });
    }
    
    if (document.getElementById('dateFilter').value) {
        activeFilters.push({
            type: 'date',
            value: document.getElementById('dateFilter').value
        });
    }
    
    if (document.getElementById('contentFilter').value) {
        activeFilters.push({
            type: 'content',
            value: document.getElementById('contentFilter').value
        });
    }

    // Create filter tags
    activeFilters.forEach(filter => {
        const filterTag = document.createElement('span');
        filterTag.className = 'active-filter';
        filterTag.innerHTML = `${filter.value} <button onclick="clearFilter('${filter.type}')">&times;</button>`;
        activeFiltersContainer.appendChild(filterTag);
    });
}

function clearFilter(filterType) {
    switch (filterType) {
        case 'search':
            document.querySelector('.search-input').value = '';
            document.querySelector('.search-clear').style.display = 'none';
            break;
        case 'category':
            document.getElementById('categoryFilter').value = '';
            break;
        case 'date':
            document.getElementById('dateFilter').value = '';
            break;
        case 'content':
            document.getElementById('contentFilter').value = '';
            break;
    }
    performSearch();
}

function getCategoryLabel(category) {
    const categoryLabels = {
        'events': 'Events',
        'projects': 'Projects',
        'development': 'Development',
        'ai': 'AI & Machine Learning',
        'gauntlet': 'Gauntlet Journey'
    };
    return categoryLabels[category] || category;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const clearButton = document.querySelector('.search-clear');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateFilter = document.getElementById('dateFilter');
    const contentFilter = document.getElementById('contentFilter');
    const resetFiltersBtn = document.querySelector('.reset-filters-btn');

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
}); 