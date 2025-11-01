// Sidebar Toggle Functionality and All Other Features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeSidebar();
    setupDropdownFunctionality();
    setupProfilePageNavigation();
    setupRefreshButton();
    simulateLiveAnalytics();
    addHoverEffects();
    loadSavedTheme();
});

// Sidebar and Main Navigation
function initializeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Toggle sidebar collapse
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }
    
    // Menu item click handling
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Here you would typically load different content based on the menu item
            console.log('Switching to:', this.querySelector('span').textContent);
        });
    });
}

// Profile Dropdown Functionality
function setupDropdownFunctionality() {
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const themeStatus = document.querySelector('.theme-status');
    
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.getAttribute('data-action');
            
            switch(action) {
                case 'profile':
                    openProfilePage();
                    break;
                case 'theme':
                    toggleTheme();
                    break;
                case 'exit':
                    closePortfolio();
                    break;
            }
        });
    });
    
    function toggleTheme() {
        const body = document.body;
        const isDark = body.classList.toggle('dark-theme');
        
        // Update theme status text
        if (themeStatus) {
            themeStatus.textContent = isDark ? 'Dark' : 'Light';
        }
        
        // Update theme icon
        const themeIcon = document.querySelector('[data-action="theme"] i');
        if (themeIcon) {
            themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Save theme preference to localStorage
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        console.log('Theme toggled to:', isDark ? 'Dark' : 'Light');
    }
    
    function closePortfolio() {
        if (confirm('Are you sure you want to close the portfolio?')) {
            window.close();
            // If window.close doesn't work (due to browser restrictions), provide alternative
            console.log('Portfolio tab should close. If not, use browser close button.');
        }
    }
}

// Profile Page Navigation
function setupProfilePageNavigation() {
    // Use event delegation for dynamic elements
    document.addEventListener('click', function(e) {
        // Back to Dashboard button
        if (e.target.closest('.back-to-dashboard')) {
            e.preventDefault();
            closeProfilePage();
        }
        
        // Download Resume button
        if (e.target.closest('.download-resume')) {
            e.preventDefault();
            downloadResume();
        }
    });
}

function openProfilePage() {
    // Hide main dashboard content
    const mainContent = document.querySelector('.main-content');
    const sidebar = document.querySelector('.sidebar');
    const profilePage = document.getElementById('profilePage');
    
    if (mainContent) mainContent.style.display = 'none';
    if (sidebar) sidebar.style.display = 'none';
    if (profilePage) profilePage.classList.remove('hidden');
    
    console.log('Profile page opened');
}

function closeProfilePage() {
    // Show main dashboard content
    const mainContent = document.querySelector('.main-content');
    const sidebar = document.querySelector('.sidebar');
    const profilePage = document.getElementById('profilePage');
    
    if (mainContent) mainContent.style.display = 'block';
    if (sidebar) sidebar.style.display = 'block';
    if (profilePage) profilePage.classList.add('hidden');
    
    console.log('Returned to dashboard');
}

function downloadResume() {
    // This would typically download your actual PDF resume
    alert('This would download your Resume_4.pdf file');
    console.log('Downloading resume...');
    
    // In a real implementation, you would use:
    // const link = document.createElement('a');
    // link.href = 'Resume_4.pdf';
    // link.download = 'Vaibhav_Srivastava_Resume.pdf';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
}

// Refresh Button Functionality
function setupRefreshButton() {
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.classList.add('rotating');
            setTimeout(() => {
                this.classList.remove('rotating');
                simulateDataRefresh();
            }, 1000);
        });
    }
}

function simulateDataRefresh() {
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        item.style.opacity = '0.5';
        setTimeout(() => {
            item.style.opacity = '1';
        }, 300);
    });
    
    // Show refresh confirmation
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        const originalHTML = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            refreshBtn.innerHTML = originalHTML;
        }, 1000);
    }
}

function simulateLiveAnalytics() {
    const metricValue = document.querySelector('.metric-value');
    const statValues = document.querySelectorAll('.stat-value');
    
    if (!metricValue) return;
    
    // Simulate visitor count increase
    setInterval(() => {
        const currentCount = parseInt(metricValue.textContent);
        metricValue.textContent = currentCount + 1;
        
        // Randomly update other stats occasionally
        if (Math.random() > 0.7) {
            statValues.forEach(stat => {
                const current = parseInt(stat.textContent);
                stat.textContent = current + 1;
            });
        }
    }, 5000); // Update every 5 seconds
}

function addHoverEffects() {
    // Add subtle animations to metric cards
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeStatus = document.querySelector('.theme-status');
    const themeIcon = document.querySelector('[data-action="theme"] i');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeStatus) themeStatus.textContent = 'Dark';
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    }
}

// Add CSS for rotating animation
const style = document.createElement('style');
style.textContent = `
    .rotating {
        animation: rotate 0.5s ease-in-out;
    }
    
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .metric-card, .card, .btn {
        transition: all 0.3s ease;
    }
    
    .hidden {
        display: none !important;
    }
`;
document.head.appendChild(style);