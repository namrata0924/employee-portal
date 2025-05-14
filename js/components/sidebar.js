document.addEventListener('DOMContentLoaded', function() {
    // Function to load and inject the sidebar
    async function loadSidebar() {
        try {
            const response = await fetch('../js/components/sidebar.html');
            const sidebarHtml = await response.text();
            
            // Create a container for the sidebar if it doesn't exist
            let sidebarContainer = document.querySelector('.app-container');
            if (!sidebarContainer) {
                sidebarContainer = document.createElement('div');
                sidebarContainer.className = 'app-container';
                document.body.prepend(sidebarContainer);
            }
            
            // Insert the sidebar at the beginning of the container
            sidebarContainer.insertAdjacentHTML('afterbegin', sidebarHtml);
            
            // Highlight the current page in the sidebar
            const currentPath = window.location.pathname;
            const currentLink = document.querySelector(`.nav-link[href="${currentPath}"]`);
            if (currentLink) {
                currentLink.classList.add('active');
            }
        } catch (error) {
            console.error('Error loading sidebar:', error);
        }
    }

    // Load the sidebar
    loadSidebar();
}); 