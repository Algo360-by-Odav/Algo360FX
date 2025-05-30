// topbarEnhancer.js
// This script injects additional UI elements into the topbar

// Run the enhancer when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initial attempt
  setTimeout(() => {
    enhanceTopbar();
  }, 1000);

  // Additional attempts to ensure it works after navigation
  setTimeout(() => {
    enhanceTopbar();
  }, 2000);
  
  setTimeout(() => {
    enhanceTopbar();
  }, 5000);
});

// Also set up a MutationObserver to detect when the toolbar is added to the DOM
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length) {
      // Check if any of the added nodes is a toolbar or contains a toolbar
      for (const node of mutation.addedNodes) {
        if (node.querySelector && node.querySelector('.MuiToolbar-root')) {
          enhanceTopbar();
          break;
        }
      }
    }
  }
});

// Start observing the document body for changes
document.addEventListener('DOMContentLoaded', () => {
  observer.observe(document.body, { childList: true, subtree: true });
});

function enhanceTopbar() {
  // Find the topbar toolbar element - try different selectors
  const toolbar = document.querySelector('.MuiToolbar-root') || 
                 document.querySelector('.MuiAppBar-root .MuiToolbar-root') ||
                 document.querySelector('header .MuiToolbar-root');
  if (!toolbar) {
    console.error('Topbar toolbar not found');
    return;
  }
  
  // Check if we've already enhanced this toolbar
  if (toolbar.getAttribute('data-enhanced') === 'true') {
    console.log('Topbar already enhanced, skipping');
    return;
  }
  
  // Mark this toolbar as enhanced to prevent duplicate processing
  toolbar.setAttribute('data-enhanced', 'true');
  
  // Remove any existing enhanced elements to prevent duplicates
  const existingElements = document.querySelectorAll('[data-algo360-enhanced]');
  existingElements.forEach(el => el.remove());

  // Detect page type
  const isDashboard = window.location.pathname.includes('/dashboard') && !window.location.pathname.includes('/trading');
  const isTrading = window.location.pathname.includes('/trading');

  // Apply dark navy blue styling to all app bars
  const appBars = document.querySelectorAll('.MuiAppBar-root');
  appBars.forEach(appBar => {
    appBar.style.backgroundColor = '#1A2B45';
    appBar.style.color = '#ffffff';
    appBar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
  });

  // Ensure all text in the topbar is white
  const topbarText = toolbar.querySelectorAll('.MuiTypography-root');
  topbarText.forEach(text => {
    text.style.color = '#ffffff';
  });

  // Style any buttons in the topbar for consistency
  const buttons = toolbar.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.classList.contains('custom-styled')) {
      button.style.color = '#ffffff';
      button.addEventListener('mouseover', function() {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      });
      button.addEventListener('mouseout', function() {
        this.style.backgroundColor = 'transparent';
      });
      button.classList.add('custom-styled');
    }
  });

  // Create a container for our additional elements
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.marginLeft = 'auto';
  container.style.gap = '8px';

  // Add search bar with real functionality
  const searchContainer = document.createElement('div');
  searchContainer.setAttribute('data-algo360-enhanced', 'true');
  searchContainer.style.position = 'relative';
  searchContainer.style.borderRadius = '4px';
  searchContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
  searchContainer.style.marginRight = '16px';
  searchContainer.style.width = '240px';
  
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search...';
  searchInput.style.backgroundColor = 'transparent';
  searchInput.style.border = 'none';
  searchInput.style.outline = 'none';
  searchInput.style.color = '#ffffff';
  searchInput.style.width = '100%';
  searchInput.style.height = '36px';
  searchInput.style.padding = '0 8px 0 36px';
  searchInput.style.fontSize = '14px';
  
  // Add functionality to search input
  searchInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        // Simulate search functionality
        console.log(`Searching for: ${searchTerm}`);
        
        // If on dashboard, search within dashboard content
        if (isDashboard) {
          const dashboardContent = document.querySelector('.dashboard-content');
          if (dashboardContent) {
            // Highlight matches
            const regex = new RegExp(searchTerm, 'gi');
            const textNodes = getTextNodes(dashboardContent);
            
            textNodes.forEach(node => {
              const parent = node.parentNode;
              const text = node.nodeValue;
              if (regex.test(text)) {
                const newHtml = text.replace(regex, match => `<span style="background-color: yellow; color: black;">${match}</span>`);
                const wrapper = document.createElement('span');
                wrapper.innerHTML = newHtml;
                parent.replaceChild(wrapper, node);
              }
            });
          }
        } else {
          // Generic search function for other pages
          window.location.href = `/search?query=${encodeURIComponent(searchTerm)}`;
        }
      }
    }
  });
  
  const searchIcon = document.createElement('div');
  searchIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="white" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>';
  searchIcon.style.position = 'absolute';
  searchIcon.style.display = 'flex';
  searchIcon.style.alignItems = 'center';
  searchIcon.style.justifyContent = 'center';
  searchIcon.style.left = '8px';
  searchIcon.style.top = '50%';
  searchIcon.style.transform = 'translateY(-50%)';
  searchIcon.style.pointerEvents = 'none';
  
  // Helper function to get all text nodes
  function getTextNodes(node) {
    let textNodes = [];
    if (node.nodeType === 3) {
      textNodes.push(node);
    } else {
      const children = node.childNodes;
      for (let i = 0; i < children.length; i++) {
        textNodes = textNodes.concat(getTextNodes(children[i]));
      }
    }
    return textNodes;
  }
  
  searchContainer.appendChild(searchIcon);
  searchContainer.appendChild(searchInput);
  container.appendChild(searchContainer);
  
  // Add language selector with globe icon and dropdown menu
  const languageSelector = document.createElement('div');
  languageSelector.className = 'MuiIconButton-root';
  languageSelector.setAttribute('data-algo360-enhanced', 'true');
  languageSelector.style.color = '#ffffff';
  languageSelector.style.width = '40px';
  languageSelector.style.height = '40px';
  languageSelector.style.padding = '8px';
  languageSelector.style.display = 'flex';
  languageSelector.style.alignItems = 'center';
  languageSelector.style.justifyContent = 'center';
  languageSelector.style.cursor = 'pointer';
  languageSelector.style.borderRadius = '50%';
  languageSelector.style.transition = 'background-color 0.3s';
  languageSelector.style.position = 'relative';
  languageSelector.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12.87 15.07l-2.54-2.51l.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5l3.11 3.11l.76-2.04M18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12m-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>';
  languageSelector.title = 'Change Language';
  
  // Create language dropdown menu
  const languageDropdown = document.createElement('div');
  languageDropdown.setAttribute('data-algo360-enhanced', 'true');
  languageDropdown.style.position = 'absolute';
  languageDropdown.style.top = '48px';
  languageDropdown.style.right = '0';
  languageDropdown.style.backgroundColor = '#ffffff';
  languageDropdown.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  languageDropdown.style.borderRadius = '4px';
  languageDropdown.style.zIndex = '1000';
  languageDropdown.style.display = 'none';
  languageDropdown.style.width = '150px';
  
  // Add language options
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'jp', name: 'Japanese', flag: '🇯🇵' }
  ];
  
  languages.forEach(lang => {
    const langOption = document.createElement('div');
    langOption.style.padding = '10px 15px';
    langOption.style.cursor = 'pointer';
    langOption.style.display = 'flex';
    langOption.style.alignItems = 'center';
    langOption.style.color = '#333';
    langOption.innerHTML = `<span style="margin-right: 8px;">${lang.flag}</span> ${lang.name}`;
    
    langOption.addEventListener('mouseover', function() {
      this.style.backgroundColor = '#f5f5f5';
    });
    
    langOption.addEventListener('mouseout', function() {
      this.style.backgroundColor = 'transparent';
    });
    
    langOption.addEventListener('click', function(e) {
      e.stopPropagation();
      // Set language cookie
      document.cookie = `lang=${lang.code}; path=/; max-age=31536000`; // 1 year
      
      // Update UI to show selected language
      const currentLang = document.querySelector('#current-language');
      if (currentLang) {
        currentLang.textContent = lang.flag;
      }
      
      // Notify user
      const notification = document.createElement('div');
      notification.style.position = 'fixed';
      notification.style.bottom = '20px';
      notification.style.right = '20px';
      notification.style.backgroundColor = '#4caf50';
      notification.style.color = 'white';
      notification.style.padding = '10px 20px';
      notification.style.borderRadius = '4px';
      notification.style.zIndex = '10000';
      notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      notification.innerHTML = `Language changed to ${lang.name}`;
      document.body.appendChild(notification);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        notification.remove();
      }, 3000);
      
      // Hide dropdown
      languageDropdown.style.display = 'none';
    });
    
    languageDropdown.appendChild(langOption);
  });
  
  // Add current language indicator
  const currentLang = document.createElement('span');
  currentLang.id = 'current-language';
  currentLang.style.position = 'absolute';
  currentLang.style.top = '-5px';
  currentLang.style.right = '-5px';
  currentLang.style.fontSize = '12px';
  currentLang.textContent = '🇺🇸';
  languageSelector.appendChild(currentLang);
  
  // Add dropdown to language selector
  languageSelector.appendChild(languageDropdown);
  
  // Toggle dropdown on click
  languageSelector.addEventListener('mouseover', function() {
    this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  });
  
  languageSelector.addEventListener('mouseout', function() {
    this.style.backgroundColor = 'transparent';
  });
  
  languageSelector.addEventListener('click', function(e) {
    e.stopPropagation();
    if (languageDropdown.style.display === 'none') {
      languageDropdown.style.display = 'block';
      
      // Close dropdown when clicking outside
      const closeDropdown = function() {
        languageDropdown.style.display = 'none';
        document.removeEventListener('click', closeDropdown);
      };
      
      // Add event listener with slight delay to prevent immediate closing
      setTimeout(() => {
        document.addEventListener('click', closeDropdown);
      }, 100);
    } else {
      languageDropdown.style.display = 'none';
    }
  });
  
  container.appendChild(languageSelector);
  
  // Add notification icon with badge and dropdown
  const notificationIcon = document.createElement('div');
  notificationIcon.className = 'MuiIconButton-root';
  notificationIcon.setAttribute('data-algo360-enhanced', 'true');
  notificationIcon.style.color = '#ffffff';
  notificationIcon.style.width = '40px';
  notificationIcon.style.height = '40px';
  notificationIcon.style.padding = '8px';
  notificationIcon.style.display = 'flex';
  notificationIcon.style.alignItems = 'center';
  notificationIcon.style.justifyContent = 'center';
  notificationIcon.style.cursor = 'pointer';
  notificationIcon.style.borderRadius = '50%';
  notificationIcon.style.transition = 'background-color 0.3s';
  notificationIcon.style.position = 'relative';
  notificationIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>';
  notificationIcon.title = 'Notifications';
  
  // Add notification badge with count
  const notificationBadge = document.createElement('span');
  notificationBadge.style.position = 'absolute';
  notificationBadge.style.top = '2px';
  notificationBadge.style.right = '2px';
  notificationBadge.style.minWidth = '16px';
  notificationBadge.style.height = '16px';
  notificationBadge.style.backgroundColor = '#ff4081';
  notificationBadge.style.borderRadius = '10px';
  notificationBadge.style.color = 'white';
  notificationBadge.style.fontSize = '10px';
  notificationBadge.style.fontWeight = 'bold';
  notificationBadge.style.display = 'flex';
  notificationBadge.style.alignItems = 'center';
  notificationBadge.style.justifyContent = 'center';
  notificationBadge.textContent = '3';
  notificationIcon.appendChild(notificationBadge);
  
  // Create notification dropdown panel
  const notificationDropdown = document.createElement('div');
  notificationDropdown.setAttribute('data-algo360-enhanced', 'true');
  notificationDropdown.style.position = 'absolute';
  notificationDropdown.style.top = '48px';
  notificationDropdown.style.right = '0';
  notificationDropdown.style.backgroundColor = '#ffffff';
  notificationDropdown.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  notificationDropdown.style.borderRadius = '4px';
  notificationDropdown.style.zIndex = '1000';
  notificationDropdown.style.display = 'none';
  notificationDropdown.style.width = '320px';
  notificationDropdown.style.maxHeight = '400px';
  notificationDropdown.style.overflowY = 'auto';
  
  // Add notification header
  const notificationHeader = document.createElement('div');
  notificationHeader.style.padding = '12px 16px';
  notificationHeader.style.borderBottom = '1px solid #eee';
  notificationHeader.style.display = 'flex';
  notificationHeader.style.justifyContent = 'space-between';
  notificationHeader.style.alignItems = 'center';
  notificationHeader.innerHTML = '<h3 style="margin: 0; font-size: 16px; color: #333;">Notifications</h3>';
  
  // Add mark all as read button
  const markAllRead = document.createElement('button');
  markAllRead.style.backgroundColor = 'transparent';
  markAllRead.style.border = 'none';
  markAllRead.style.color = '#1976d2';
  markAllRead.style.cursor = 'pointer';
  markAllRead.style.fontSize = '12px';
  markAllRead.textContent = 'Mark all as read';
  markAllRead.addEventListener('click', function(e) {
    e.stopPropagation();
    
    // Mark all notifications as read
    const notificationItems = notificationDropdown.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
      item.style.backgroundColor = '#ffffff';
      item.setAttribute('data-read', 'true');
    });
    
    // Update badge count
    notificationBadge.textContent = '0';
    notificationBadge.style.display = 'none';
  });
  
  notificationHeader.appendChild(markAllRead);
  notificationDropdown.appendChild(notificationHeader);
  
  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: 'Market Alert',
      message: 'EUR/USD has increased by 0.5% in the last hour',
      time: '5 minutes ago',
      read: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ff9800"><path d="M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.33.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2z"/></svg>'
    },
    {
      id: 2,
      title: 'New Trading Strategy',
      message: 'A new momentum strategy has been added to your portfolio',
      time: '1 hour ago',
      read: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#4caf50"><path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H3V6h18v12zM9 10h2v4H9zm4 0h2v4h-2zm4 0h2v4h-2zM5 10h2v4H5z"/></svg>'
    },
    {
      id: 3,
      title: 'Account Update',
      message: 'Your account verification has been completed successfully',
      time: '2 days ago',
      read: true,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#2196f3"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'
    }
  ];
  
  // Create notification items
  notifications.forEach(notification => {
    const notificationItem = document.createElement('div');
    notificationItem.className = 'notification-item';
    notificationItem.setAttribute('data-read', notification.read ? 'true' : 'false');
    notificationItem.style.padding = '12px 16px';
    notificationItem.style.borderBottom = '1px solid #eee';
    notificationItem.style.cursor = 'pointer';
    notificationItem.style.display = 'flex';
    notificationItem.style.alignItems = 'flex-start';
    notificationItem.style.backgroundColor = notification.read ? '#ffffff' : '#f8f9fa';
    
    // Icon container
    const iconContainer = document.createElement('div');
    iconContainer.style.marginRight = '12px';
    iconContainer.style.flex = '0 0 auto';
    iconContainer.innerHTML = notification.icon;
    
    // Content container
    const contentContainer = document.createElement('div');
    contentContainer.style.flex = '1';
    
    // Title
    const title = document.createElement('div');
    title.style.fontWeight = 'bold';
    title.style.fontSize = '14px';
    title.style.marginBottom = '4px';
    title.style.color = '#333';
    title.textContent = notification.title;
    
    // Message
    const message = document.createElement('div');
    message.style.fontSize = '13px';
    message.style.color = '#666';
    message.style.marginBottom = '4px';
    message.textContent = notification.message;
    
    // Time
    const time = document.createElement('div');
    time.style.fontSize = '11px';
    time.style.color = '#999';
    time.textContent = notification.time;
    
    contentContainer.appendChild(title);
    contentContainer.appendChild(message);
    contentContainer.appendChild(time);
    
    notificationItem.appendChild(iconContainer);
    notificationItem.appendChild(contentContainer);
    
    // Mark as read on click
    notificationItem.addEventListener('click', function(e) {
      e.stopPropagation();
      this.style.backgroundColor = '#ffffff';
      this.setAttribute('data-read', 'true');
      
      // Update badge count
      const unreadCount = notificationDropdown.querySelectorAll('.notification-item[data-read="false"]').length;
      if (unreadCount > 0) {
        notificationBadge.textContent = unreadCount;
        notificationBadge.style.display = 'flex';
      } else {
        notificationBadge.style.display = 'none';
      }
      
      // Show notification detail or navigate to relevant page
      if (notification.id === 1) {
        window.location.href = '/dashboard/markets/currency-pairs/eurusd';
      } else if (notification.id === 2) {
        window.location.href = '/dashboard/strategies';
      } else if (notification.id === 3) {
        window.location.href = '/dashboard/account/profile';
      }
    });
    
    notificationDropdown.appendChild(notificationItem);
  });
  
  // Add the notification dropdown to the icon
  notificationIcon.appendChild(notificationDropdown);
  
  // Toggle dropdown on click
  notificationIcon.addEventListener('mouseover', function() {
    this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  });
  
  notificationIcon.addEventListener('mouseout', function() {
    this.style.backgroundColor = 'transparent';
  });
  
  notificationIcon.addEventListener('click', function(e) {
    e.stopPropagation();
    if (notificationDropdown.style.display === 'none') {
      notificationDropdown.style.display = 'block';
      
      // Close dropdown when clicking outside
      const closeDropdown = function() {
        notificationDropdown.style.display = 'none';
        document.removeEventListener('click', closeDropdown);
      };
      
      // Add event listener with slight delay to prevent immediate closing
      setTimeout(() => {
        document.addEventListener('click', closeDropdown);
      }, 100);
    } else {
      notificationDropdown.style.display = 'none';
    }
  });
  
  container.appendChild(notificationIcon);
  
  // Add message icon with badge and dropdown
  const messageIcon = document.createElement('div');
  messageIcon.className = 'MuiIconButton-root';
  messageIcon.setAttribute('data-algo360-enhanced', 'true');
  messageIcon.style.color = '#ffffff';
  messageIcon.style.width = '40px';
  messageIcon.style.height = '40px';
  messageIcon.style.padding = '8px';
  messageIcon.style.display = 'flex';
  messageIcon.style.alignItems = 'center';
  messageIcon.style.justifyContent = 'center';
  messageIcon.style.cursor = 'pointer';
  messageIcon.style.borderRadius = '50%';
  messageIcon.style.transition = 'background-color 0.3s';
  messageIcon.style.position = 'relative';
  messageIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>';
  messageIcon.title = 'Messages';
  
  // Add message badge with count
  const messageBadge = document.createElement('span');
  messageBadge.style.position = 'absolute';
  messageBadge.style.top = '2px';
  messageBadge.style.right = '2px';
  messageBadge.style.minWidth = '16px';
  messageBadge.style.height = '16px';
  messageBadge.style.backgroundColor = '#ff4081';
  messageBadge.style.borderRadius = '10px';
  messageBadge.style.color = 'white';
  messageBadge.style.fontSize = '10px';
  messageBadge.style.fontWeight = 'bold';
  messageBadge.style.display = 'flex';
  messageBadge.style.alignItems = 'center';
  messageBadge.style.justifyContent = 'center';
  messageBadge.textContent = '2';
  messageIcon.appendChild(messageBadge);
  
  // Create message dropdown panel
  const messageDropdown = document.createElement('div');
  messageDropdown.setAttribute('data-algo360-enhanced', 'true');
  messageDropdown.style.position = 'absolute';
  messageDropdown.style.top = '48px';
  messageDropdown.style.right = '0';
  messageDropdown.style.backgroundColor = '#ffffff';
  messageDropdown.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  messageDropdown.style.borderRadius = '4px';
  messageDropdown.style.zIndex = '1000';
  messageDropdown.style.display = 'none';
  messageDropdown.style.width = '320px';
  messageDropdown.style.maxHeight = '400px';
  messageDropdown.style.overflowY = 'auto';
  
  // Add message header
  const messageHeader = document.createElement('div');
  messageHeader.style.padding = '12px 16px';
  messageHeader.style.borderBottom = '1px solid #eee';
  messageHeader.style.display = 'flex';
  messageHeader.style.justifyContent = 'space-between';
  messageHeader.style.alignItems = 'center';
  messageHeader.innerHTML = '<h3 style="margin: 0; font-size: 16px; color: #333;">Messages</h3>';
  
  // Add view all button
  const viewAllBtn = document.createElement('button');
  viewAllBtn.style.backgroundColor = 'transparent';
  viewAllBtn.style.border = 'none';
  viewAllBtn.style.color = '#1976d2';
  viewAllBtn.style.cursor = 'pointer';
  viewAllBtn.style.fontSize = '12px';
  viewAllBtn.textContent = 'View all';
  viewAllBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    window.location.href = '/dashboard/messages';
  });
  
  messageHeader.appendChild(viewAllBtn);
  messageDropdown.appendChild(messageHeader);
  
  // Sample messages
  const messages = [
    {
      id: 1,
      sender: 'System Admin',
      avatar: '👨‍💼',
      message: 'Welcome to Algo360FX! Let us know if you need any assistance getting started.',
      time: '10:45 AM',
      read: false
    },
    {
      id: 2,
      sender: 'Trading Support',
      avatar: '👩‍💼',
      message: 'Your account has been verified. You can now deposit funds and start trading.',
      time: 'Yesterday',
      read: false
    },
    {
      id: 3,
      sender: 'Market Analyst',
      avatar: '📊',
      message: 'Weekly market report is now available. Check the Reports section for details.',
      time: 'Jan 15',
      read: true
    }
  ];
  
  // Create message items
  messages.forEach(msg => {
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item';
    messageItem.setAttribute('data-read', msg.read ? 'true' : 'false');
    messageItem.style.padding = '12px 16px';
    messageItem.style.borderBottom = '1px solid #eee';
    messageItem.style.cursor = 'pointer';
    messageItem.style.display = 'flex';
    messageItem.style.alignItems = 'flex-start';
    messageItem.style.backgroundColor = msg.read ? '#ffffff' : '#f8f9fa';
    
    // Avatar
    const avatar = document.createElement('div');
    avatar.style.width = '36px';
    avatar.style.height = '36px';
    avatar.style.borderRadius = '50%';
    avatar.style.backgroundColor = '#e0e0e0';
    avatar.style.display = 'flex';
    avatar.style.alignItems = 'center';
    avatar.style.justifyContent = 'center';
    avatar.style.marginRight = '12px';
    avatar.style.fontSize = '18px';
    avatar.textContent = msg.avatar;
    
    // Content
    const content = document.createElement('div');
    content.style.flex = '1';
    
    // Header with sender and time
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.marginBottom = '4px';
    
    const sender = document.createElement('div');
    sender.style.fontWeight = 'bold';
    sender.style.fontSize = '14px';
    sender.style.color = '#333';
    sender.textContent = msg.sender;
    
    const time = document.createElement('div');
    time.style.fontSize = '12px';
    time.style.color = '#999';
    time.textContent = msg.time;
    
    header.appendChild(sender);
    header.appendChild(time);
    
    // Message text
    const messageText = document.createElement('div');
    messageText.style.fontSize = '13px';
    messageText.style.color = '#666';
    messageText.style.lineHeight = '1.4';
    messageText.textContent = msg.message;
    
    content.appendChild(header);
    content.appendChild(messageText);
    
    messageItem.appendChild(avatar);
    messageItem.appendChild(content);
    
    // Mark as read on click and navigate
    messageItem.addEventListener('click', function(e) {
      e.stopPropagation();
      this.style.backgroundColor = '#ffffff';
      this.setAttribute('data-read', 'true');
      
      // Update badge count
      const unreadCount = messageDropdown.querySelectorAll('.message-item[data-read="false"]').length;
      if (unreadCount > 0) {
        messageBadge.textContent = unreadCount;
        messageBadge.style.display = 'flex';
      } else {
        messageBadge.style.display = 'none';
      }
      
      // Navigate to message detail
      window.location.href = `/dashboard/messages/${msg.id}`;
    });
    
    messageDropdown.appendChild(messageItem);
  });
  
  // Add compose button
  const composeBtn = document.createElement('button');
  composeBtn.style.backgroundColor = '#1976d2';
  composeBtn.style.color = 'white';
  composeBtn.style.border = 'none';
  composeBtn.style.borderRadius = '4px';
  composeBtn.style.padding = '8px 16px';
  composeBtn.style.margin = '12px';
  composeBtn.style.width = 'calc(100% - 24px)';
  composeBtn.style.cursor = 'pointer';
  composeBtn.style.fontSize = '14px';
  composeBtn.style.fontWeight = 'bold';
  composeBtn.style.display = 'flex';
  composeBtn.style.alignItems = 'center';
  composeBtn.style.justifyContent = 'center';
  composeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style="margin-right: 8px;"><path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg> Compose New Message';
  composeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    window.location.href = '/dashboard/messages/compose';
  });
  messageDropdown.appendChild(composeBtn);
  
  // Add the message dropdown to the icon
  messageIcon.appendChild(messageDropdown);
  
  // Toggle dropdown on click
  messageIcon.addEventListener('mouseover', function() {
    this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  });
  
  messageIcon.addEventListener('mouseout', function() {
    this.style.backgroundColor = 'transparent';
  });
  
  messageIcon.addEventListener('click', function(e) {
    e.stopPropagation();
    if (messageDropdown.style.display === 'none') {
      messageDropdown.style.display = 'block';
      
      // Close dropdown when clicking outside
      const closeDropdown = function() {
        messageDropdown.style.display = 'none';
        document.removeEventListener('click', closeDropdown);
      };
      
      // Add event listener with slight delay to prevent immediate closing
      setTimeout(() => {
        document.addEventListener('click', closeDropdown);
      }, 100);
    } else {
      messageDropdown.style.display = 'none';
    }
  });
  
  container.appendChild(messageIcon);
  
  // Add account icon with dropdown menu
  const accountIcon = document.createElement('div');
  accountIcon.className = 'MuiIconButton-root';
  accountIcon.setAttribute('data-algo360-enhanced', 'true');
  accountIcon.style.color = '#ffffff';
  accountIcon.style.width = '40px';
  accountIcon.style.height = '40px';
  accountIcon.style.padding = '8px';
  accountIcon.style.display = 'flex';
  accountIcon.style.alignItems = 'center';
  accountIcon.style.justifyContent = 'center';
  accountIcon.style.cursor = 'pointer';
  accountIcon.style.borderRadius = '50%';
  accountIcon.style.transition = 'background-color 0.3s';
  accountIcon.style.position = 'relative';
  accountIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3s1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22c.03-1.99 4-3.08 6-3.08c1.99 0 5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z"/></svg>';
  accountIcon.title = 'Account';
  
  // Create account dropdown menu
  const accountDropdown = document.createElement('div');
  accountDropdown.setAttribute('data-algo360-enhanced', 'true');
  accountDropdown.style.position = 'absolute';
  accountDropdown.style.top = '48px';
  accountDropdown.style.right = '0';
  accountDropdown.style.backgroundColor = '#ffffff';
  accountDropdown.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  accountDropdown.style.borderRadius = '4px';
  accountDropdown.style.zIndex = '1000';
  accountDropdown.style.display = 'none';
  accountDropdown.style.width = '220px';
  
  // Add user info section styled like the image
  const userInfo = document.createElement('div');
  userInfo.style.padding = '16px';
  userInfo.style.borderBottom = '1px solid #eee';
  userInfo.style.display = 'flex';
  userInfo.style.flexDirection = 'column';
  userInfo.style.alignItems = 'center';
  
  const userAvatar = document.createElement('div');
  userAvatar.style.width = '80px';
  userAvatar.style.height = '80px';
  userAvatar.style.borderRadius = '50%';
  userAvatar.style.backgroundColor = '#1A2B45';
  userAvatar.style.color = 'white';
  userAvatar.style.display = 'flex';
  userAvatar.style.alignItems = 'center';
  userAvatar.style.justifyContent = 'center';
  userAvatar.style.fontSize = '28px';
  userAvatar.style.marginBottom = '10px';
  userAvatar.style.fontWeight = 'bold';
  userAvatar.textContent = 'JD';
  
  const userName = document.createElement('div');
  userName.style.fontWeight = 'bold';
  userName.style.fontSize = '16px';
  userName.style.color = '#333';
  userName.style.marginBottom = '4px';
  userName.textContent = 'John Doe';
  
  const userEmail = document.createElement('div');
  userEmail.style.fontSize = '14px';
  userEmail.style.color = '#666';
  userEmail.textContent = 'john.doe@example.com';
  
  userInfo.appendChild(userAvatar);
  userInfo.appendChild(userName);
  userInfo.appendChild(userEmail);
  accountDropdown.appendChild(userInfo);
  
  // Menu items matching the image
  const menuItems = [
    { 
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>', 
      text: 'My Profile', 
      url: '/dashboard/account/profile',
      action: function() {
        // Use a custom event for React Router navigation
        const event = new CustomEvent('navigate', { detail: { path: '/dashboard/account/profile' } });
        window.dispatchEvent(event);
        
        // Fallback to direct navigation
        setTimeout(() => {
          console.log('Navigating to profile page via direct URL');
          window.location.replace('/dashboard/account/profile');
        }, 100);
      }
    },
    { 
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>', 
      text: 'Dashboard', 
      url: '/dashboard',
      action: function() {
        // Use a custom event for React Router navigation
        const event = new CustomEvent('navigate', { detail: { path: '/dashboard' } });
        window.dispatchEvent(event);
        
        // Fallback to direct navigation
        setTimeout(() => {
          console.log('Navigating to dashboard via direct URL');
          window.location.replace('/dashboard');
        }, 100);
      }
    },
    { 
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8z"/></svg>', 
      text: 'My Wallet', 
      url: '/dashboard/wallet',
      action: function() {
        // Use a different approach to navigate
        const event = new CustomEvent('navigate', { detail: { path: '/dashboard/wallet' } });
        window.dispatchEvent(event);
        
        // Add a fallback direct navigation
        setTimeout(() => {
          console.log('Navigating to wallet page via direct URL');
          window.location.replace('/dashboard/wallet');
        }, 100);
      }
    },
    { 
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>', 
      text: 'Settings', 
      url: '/dashboard/settings',
      action: function() {
        // Use a custom event for React Router navigation
        const event = new CustomEvent('navigate', { detail: { path: '/dashboard/settings' } });
        window.dispatchEvent(event);
        
        // Fallback to direct navigation
        setTimeout(() => {
          console.log('Navigating to settings page via direct URL');
          window.location.replace('/dashboard/settings');
        }, 100);
      }
    },
    { 
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>', 
      text: 'Sign Out', 
      url: '/logout',
      action: function() {
        // Handle logout with confirmation
        const confirmLogout = confirm('Are you sure you want to sign out?');
        if (confirmLogout) {
          // Clear session cookies
          document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          document.cookie = 'user_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          
          // Use a custom event for React Router navigation
          const event = new CustomEvent('navigate', { detail: { path: '/login' } });
          window.dispatchEvent(event);
          
          // Fallback to direct navigation
          setTimeout(() => {
            console.log('Signing out and navigating to login page');
            window.location.replace('/login');
          }, 100);
        }
      }
    }
  ];
  
  // Create menu items
  menuItems.forEach(item => {
    const menuItem = document.createElement('div');
    menuItem.className = 'account-menu-item';
    menuItem.style.padding = '12px 16px';
    menuItem.style.display = 'flex';
    menuItem.style.alignItems = 'center';
    menuItem.style.gap = '12px';
    menuItem.style.cursor = 'pointer';
    menuItem.style.transition = 'background-color 0.3s';
    
    const iconSpan = document.createElement('span');
    iconSpan.style.display = 'flex';
    iconSpan.style.alignItems = 'center';
    iconSpan.style.color = '#555';
    iconSpan.innerHTML = item.icon;
    
    const textSpan = document.createElement('span');
    textSpan.textContent = item.text;
    textSpan.style.fontSize = '14px';
    textSpan.style.color = '#333';
    
    menuItem.appendChild(iconSpan);
    menuItem.appendChild(textSpan);
    
    menuItem.addEventListener('mouseover', () => {
      menuItem.style.backgroundColor = '#f5f5f5';
    });
    
    menuItem.addEventListener('mouseout', () => {
      menuItem.style.backgroundColor = 'transparent';
    });
    
    menuItem.addEventListener('click', () => {
      // Execute the action function for the menu item
      if (typeof item.action === 'function') {
        item.action();
      } else {
        // Fallback to basic navigation if action isn't defined
        window.location.href = item.url;
      }
      
      // Hide dropdown
      accountDropdown.style.display = 'none';
    });
    
    accountDropdown.appendChild(menuItem);
  });
  
  // Add the account dropdown to the icon
  accountIcon.appendChild(accountDropdown);
  
  // Toggle dropdown on click
  accountIcon.addEventListener('mouseover', function() {
    this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  });
  
  accountIcon.addEventListener('mouseout', function() {
    this.style.backgroundColor = 'transparent';
  });
  
  accountIcon.addEventListener('click', function(e) {
    e.stopPropagation();
    if (accountDropdown.style.display === 'none') {
      accountDropdown.style.display = 'block';
      
      // Close dropdown when clicking outside
      const closeDropdown = function() {
        accountDropdown.style.display = 'none';
        document.removeEventListener('click', closeDropdown);
      };
      
      // Add event listener with slight delay to prevent immediate closing
      setTimeout(() => {
        document.addEventListener('click', closeDropdown);
      }, 100);
    } else {
      accountDropdown.style.display = 'none';
    }
  });
  
  container.appendChild(accountIcon);
  
  // Add theme toggle (light/dark mode)
  const themeToggle = document.createElement('div');
  themeToggle.className = 'MuiIconButton-root';
  themeToggle.style.color = '#ffffff';
  themeToggle.style.width = '40px';
  themeToggle.style.height = '40px';
  themeToggle.style.padding = '8px';
  themeToggle.style.display = 'flex';
  themeToggle.style.alignItems = 'center';
  themeToggle.style.justifyContent = 'center';
  themeToggle.style.cursor = 'pointer';
  themeToggle.style.borderRadius = '50%';
  themeToggle.style.transition = 'background-color 0.3s';
  themeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24"><path fill="currentColor" d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"></path></svg>';
  themeToggle.title = 'Toggle Theme';
  themeToggle.addEventListener('mouseover', function() {
    this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  });
  themeToggle.addEventListener('mouseout', function() {
    this.style.backgroundColor = 'transparent';
  });
  themeToggle.addEventListener('click', function() {
    alert('Theme toggle clicked');
  });
  
  // Check if we're on the Dashboard page
  if (isDashboard) {
    // Find the best place to add the action buttons
    const appBar = document.querySelector('.MuiAppBar-root');
    if (!appBar) return;
    
    // Clear any existing topbar buttons first
    const existingButtons = appBar.querySelectorAll('[data-algo360-action-button]');
    existingButtons.forEach(el => el.remove());
    
    // Create a single row to hold the action buttons
    const actionButtonRow = document.createElement('div');
    actionButtonRow.setAttribute('data-algo360-enhanced', 'true');
    actionButtonRow.setAttribute('data-algo360-action-button', 'true');
    actionButtonRow.style.display = 'flex';
    actionButtonRow.style.alignItems = 'center';
    actionButtonRow.style.height = '64px';
    actionButtonRow.style.marginLeft = '24px';
    
    // Create markets open indicator (green pill)
    const marketsOpenBtn = document.createElement('div');
    marketsOpenBtn.setAttribute('data-algo360-enhanced', 'true');
    marketsOpenBtn.innerHTML = 'Markets Open';
    marketsOpenBtn.style.backgroundColor = '#4caf50';
    marketsOpenBtn.style.color = 'white';
    marketsOpenBtn.style.padding = '4px 12px';
    marketsOpenBtn.style.borderRadius = '16px';
    marketsOpenBtn.style.fontSize = '12px';
    marketsOpenBtn.style.fontWeight = 'bold';
    marketsOpenBtn.style.marginRight = '16px';
    marketsOpenBtn.style.cursor = 'pointer';
    actionButtonRow.appendChild(marketsOpenBtn);
    
    // Create New Order button
    const newOrderBtn = document.createElement('button');
    newOrderBtn.setAttribute('data-algo360-enhanced', 'true');
    newOrderBtn.innerHTML = '<span style="margin-right: 4px;">+</span> NEW ORDER';
    newOrderBtn.style.backgroundColor = '#1976d2';
    newOrderBtn.style.color = 'white';
    newOrderBtn.style.padding = '6px 16px';
    newOrderBtn.style.border = 'none';
    newOrderBtn.style.borderRadius = '4px';
    newOrderBtn.style.fontSize = '13px';
    newOrderBtn.style.fontWeight = 'bold';
    newOrderBtn.style.marginRight = '8px';
    newOrderBtn.style.cursor = 'pointer';
    newOrderBtn.style.display = 'flex';
    newOrderBtn.style.alignItems = 'center';
    newOrderBtn.onclick = function() {
      alert('New Order clicked');
    };
    actionButtonRow.appendChild(newOrderBtn);
    
    // Create Refresh button
    const refreshBtn = document.createElement('button');
    refreshBtn.setAttribute('data-algo360-enhanced', 'true');
    refreshBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg> REFRESH';
    refreshBtn.style.backgroundColor = 'transparent';
    refreshBtn.style.color = 'white';
    refreshBtn.style.padding = '6px 16px';
    refreshBtn.style.border = 'none';
    refreshBtn.style.borderRadius = '4px';
    refreshBtn.style.fontSize = '13px';
    refreshBtn.style.fontWeight = 'bold';
    refreshBtn.style.marginRight = '8px';
    refreshBtn.style.cursor = 'pointer';
    refreshBtn.style.display = 'flex';
    refreshBtn.style.alignItems = 'center';
    refreshBtn.style.gap = '4px';
    refreshBtn.onclick = function() {
      alert('Refresh clicked');
    };
    actionButtonRow.appendChild(refreshBtn);
    
    // Create Export button
    const exportBtn = document.createElement('button');
    exportBtn.setAttribute('data-algo360-enhanced', 'true');
    exportBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/></svg> EXPORT';
    exportBtn.style.backgroundColor = 'transparent';
    exportBtn.style.color = 'white';
    exportBtn.style.padding = '6px 16px';
    exportBtn.style.border = 'none';
    exportBtn.style.borderRadius = '4px';
    exportBtn.style.fontSize = '13px';
    exportBtn.style.fontWeight = 'bold';
    exportBtn.style.marginRight = '8px';
    exportBtn.style.cursor = 'pointer';
    exportBtn.style.display = 'flex';
    exportBtn.style.alignItems = 'center';
    exportBtn.style.gap = '4px';
    exportBtn.onclick = function() {
      alert('Export clicked');
    };
    actionButtonRow.appendChild(exportBtn);
    
    // Find the logo/title element to insert after
    const logo = toolbar.querySelector('.MuiTypography-root');
    if (logo) {
      // Insert after the logo
      logo.parentNode.insertBefore(actionButtonRow, logo.nextSibling);
    } else {
      // If no logo found, just add to the beginning of the toolbar
      toolbar.insertBefore(actionButtonRow, toolbar.firstChild);
    }
  }
  
  // Set an ID on our container to identify it
  container.id = 'algo360-topbar-elements';
  
  // Add the container to the toolbar
  toolbar.appendChild(container);

  console.log('Topbar enhanced with additional UI elements');
}
