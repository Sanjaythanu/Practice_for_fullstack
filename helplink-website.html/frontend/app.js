// FriendConnect - Main Application
class FriendConnect {
    constructor() {
        this.currentUser = null;
        this.users = [];
        this.conversations = [];
        this.currentConversation = null;
        this.isAuthenticated = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMockData();
        this.checkAuthStatus();
        this.setupScrollAnimations();
        this.setupMobileMenu();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection(e.target.getAttribute('href').substring(1));
            });
        });

        // Auth buttons
        document.getElementById('login-btn').addEventListener('click', () => this.showAuthModal('login'));
        document.getElementById('signup-btn').addEventListener('click', () => this.showAuthModal('signup'));
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        document.getElementById('close-modal').addEventListener('click', () => this.hideAuthModal());

        // Auth forms
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signup-form').addEventListener('submit', (e) => this.handleSignup(e));

        // Auth tabs
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchAuthTab(e.target.dataset.tab));
        });

        // Hero buttons
        document.getElementById('get-started-btn').addEventListener('click', () => this.showAuthModal('signup'));
        document.getElementById('learn-more-btn').addEventListener('click', () => this.navigateToSection('about'));

        // Filters
        document.getElementById('age-filter').addEventListener('change', () => this.filterUsers());
        document.getElementById('location-filter').addEventListener('change', () => this.filterUsers());
        document.getElementById('interest-filter').addEventListener('change', () => this.filterUsers());

        // Profile
        document.getElementById('edit-profile-btn').addEventListener('click', () => this.editProfile());
        document.querySelector('.edit-avatar-btn').addEventListener('click', () => this.changeAvatar());

        // Messages
        document.getElementById('send-message-btn').addEventListener('click', () => this.sendMessage());
        document.getElementById('message-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Modal backdrop
        document.getElementById('auth-modal').addEventListener('click', (e) => {
            if (e.target.id === 'auth-modal') this.hideAuthModal();
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    setupMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Add fade-in class to elements
        document.querySelectorAll('.user-card, .feature-card, .profile-header').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    navigateToSection(sectionId) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[href="#${sectionId}"]`).classList.add('active');

        // Scroll to section
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }

        // Load section-specific content
        this.loadSectionContent(sectionId);
    }

    loadSectionContent(sectionId) {
        switch (sectionId) {
            case 'discover':
                this.loadUsers();
                break;
            case 'profile':
                this.loadProfile();
                break;
            case 'messages':
                this.loadConversations();
                break;
        }
    }

    showAuthModal(type = 'login') {
        const modal = document.getElementById('auth-modal');
        modal.classList.add('show');
        this.switchAuthTab(type);
        document.body.style.overflow = 'hidden';
    }

    hideAuthModal() {
        const modal = document.getElementById('auth-modal');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    switchAuthTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Show/hide forms
        document.getElementById('login-form').style.display = tab === 'login' ? 'flex' : 'none';
        document.getElementById('signup-form').style.display = tab === 'signup' ? 'flex' : 'none';
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> Logging in...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock authentication
            const user = this.users.find(u => u.email === email && u.password === password);
            if (user) {
                this.login(user);
                this.hideAuthModal();
                this.showNotification('Successfully logged in!', 'success');
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = {
            name: formData.get('signup-name'),
            email: formData.get('signup-email'),
            password: formData.get('signup-password'),
            age: parseInt(formData.get('signup-age')),
            location: formData.get('signup-location'),
            bio: 'Tell us about yourself...',
            interests: [],
            friends: [],
            avatar: `https://via.placeholder.com/150/6366f1/ffffff?text=${userData.name.charAt(0).toUpperCase()}`
        };

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> Creating account...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check if user already exists
            if (this.users.find(u => u.email === userData.email)) {
                throw new Error('User already exists');
            }

            // Add new user
            const newUser = { ...userData, id: Date.now() };
            this.users.push(newUser);
            this.login(newUser);
            this.hideAuthModal();
            this.showNotification('Account created successfully!', 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    login(user) {
        this.currentUser = user;
        this.isAuthenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.updateUI();
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('currentUser');
        this.updateUI();
        this.showNotification('Logged out successfully', 'info');
    }

    checkAuthStatus() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            this.login(user);
        }
    }

    updateUI() {
        const authButtons = document.querySelector('.nav-auth');
        const userMenu = document.getElementById('user-menu');

        if (this.isAuthenticated) {
            authButtons.style.display = 'none';
            userMenu.style.display = 'flex';
            document.querySelector('.user-name').textContent = this.currentUser.name;
            document.querySelector('.user-avatar').src = this.currentUser.avatar;
        } else {
            authButtons.style.display = 'flex';
            userMenu.style.display = 'none';
        }
    }

    loadMockData() {
        // Mock users
        this.users = [
            {
                id: 1,
                name: 'Sarah Johnson',
                email: 'sarah@example.com',
                password: 'password123',
                age: 25,
                location: 'New York',
                bio: 'Love traveling, photography, and meeting new people! Always up for an adventure.',
                interests: ['Travel', 'Photography', 'Music', 'Art'],
                friends: [],
                avatar: 'https://via.placeholder.com/150/ec4899/ffffff?text=S'
            },
            {
                id: 2,
                name: 'Mike Chen',
                email: 'mike@example.com',
                password: 'password123',
                age: 28,
                location: 'Los Angeles',
                bio: 'Tech enthusiast and coffee lover. Building the future one line of code at a time.',
                interests: ['Technology', 'Coffee', 'Gaming', 'Fitness'],
                friends: [],
                avatar: 'https://via.placeholder.com/150/6366f1/ffffff?text=M'
            },
            {
                id: 3,
                name: 'Emma Wilson',
                email: 'emma@example.com',
                password: 'password123',
                age: 23,
                location: 'Chicago',
                bio: 'Artist and nature lover. Finding beauty in everyday moments.',
                interests: ['Art', 'Nature', 'Yoga', 'Cooking'],
                friends: [],
                avatar: 'https://via.placeholder.com/150/10b981/ffffff?text=E'
            },
            {
                id: 4,
                name: 'Alex Rodriguez',
                email: 'alex@example.com',
                password: 'password123',
                age: 30,
                location: 'Houston',
                bio: 'Sports fanatic and foodie. Always looking for the next great restaurant.',
                interests: ['Sports', 'Food', 'Travel', 'Music'],
                friends: [],
                avatar: 'https://via.placeholder.com/150/f59e0b/ffffff?text=A'
            }
        ];

        // Mock conversations
        this.conversations = [
            {
                id: 1,
                participants: [1, 2],
                messages: [
                    { id: 1, senderId: 1, text: 'Hey! I saw we have similar interests in technology!', timestamp: new Date(Date.now() - 3600000) },
                    { id: 2, senderId: 2, text: 'Hi Sarah! Yes, I love coding and coffee. What kind of tech are you into?', timestamp: new Date(Date.now() - 3500000) },
                    { id: 3, senderId: 1, text: 'I\'m into web development and AI. Would love to chat more!', timestamp: new Date(Date.now() - 3400000) }
                ]
            }
        ];
    }

    loadUsers() {
        const usersGrid = document.getElementById('users-grid');
        const filteredUsers = this.users.filter(user => user.id !== this.currentUser?.id);
        
        usersGrid.innerHTML = filteredUsers.map(user => `
            <div class="user-card fade-in">
                <div class="user-header">
                    <img src="${user.avatar}" alt="${user.name}" class="user-avatar-large">
                    <div class="user-info">
                        <h3>${user.name}</h3>
                        <p>${user.age} • ${user.location}</p>
                    </div>
                </div>
                <p class="user-bio">${user.bio}</p>
                <div class="user-interests">
                    ${user.interests.map(interest => `<span class="interest-tag">${interest}</span>`).join('')}
                </div>
                <div class="user-actions">
                    <button class="btn btn-primary" onclick="app.sendFriendRequest(${user.id})">
                        <i class="fas fa-user-plus"></i> Add Friend
                    </button>
                    <button class="btn btn-outline" onclick="app.startConversation(${user.id})">
                        <i class="fas fa-comment"></i> Message
                    </button>
                </div>
            </div>
        `).join('');
    }

    filterUsers() {
        const ageFilter = document.getElementById('age-filter').value;
        const locationFilter = document.getElementById('location-filter').value;
        const interestFilter = document.getElementById('interest-filter').value;

        const filteredUsers = this.users.filter(user => {
            if (user.id === this.currentUser?.id) return false;
            
            if (ageFilter) {
                const [min, max] = ageFilter.split('-').map(Number);
                if (max && (user.age < min || user.age > max)) return false;
                if (!max && user.age < min) return false;
            }
            
            if (locationFilter && user.location !== locationFilter) return false;
            if (interestFilter && !user.interests.includes(interestFilter)) return false;
            
            return true;
        });

        const usersGrid = document.getElementById('users-grid');
        usersGrid.innerHTML = filteredUsers.map(user => `
            <div class="user-card fade-in">
                <div class="user-header">
                    <img src="${user.avatar}" alt="${user.name}" class="user-avatar-large">
                    <div class="user-info">
                        <h3>${user.name}</h3>
                        <p>${user.age} • ${user.location}</p>
                    </div>
                </div>
                <p class="user-bio">${user.bio}</p>
                <div class="user-interests">
                    ${user.interests.map(interest => `<span class="interest-tag">${interest}</span>`).join('')}
                </div>
                <div class="user-actions">
                    <button class="btn btn-primary" onclick="app.sendFriendRequest(${user.id})">
                        <i class="fas fa-user-plus"></i> Add Friend
                    </button>
                    <button class="btn btn-outline" onclick="app.startConversation(${user.id})">
                        <i class="fas fa-comment"></i> Message
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadProfile() {
        if (!this.currentUser) {
            this.showNotification('Please log in to view your profile', 'warning');
            return;
        }

        document.getElementById('profile-name').textContent = this.currentUser.name;
        document.getElementById('profile-location').textContent = this.currentUser.location;
        document.getElementById('profile-age').textContent = `${this.currentUser.age} years old`;
        document.getElementById('profile-bio').textContent = this.currentUser.bio;
        document.getElementById('profile-avatar').src = this.currentUser.avatar;

        // Load interests
        const interestsContainer = document.getElementById('interests-tags');
        interestsContainer.innerHTML = this.currentUser.interests.map(interest => 
            `<span class="interest-tag">${interest}</span>`
        ).join('');

        // Load friends
        this.loadFriends();
    }

    loadFriends() {
        const friendsList = document.getElementById('friends-list');
        const friends = this.users.filter(user => 
            this.currentUser.friends.includes(user.id)
        );

        if (friends.length === 0) {
            friendsList.innerHTML = '<p>No friends yet. Start connecting with people!</p>';
            return;
        }

        friendsList.innerHTML = friends.map(friend => `
            <div class="friend-item">
                <img src="${friend.avatar}" alt="${friend.name}">
                <div>
                    <h4>${friend.name}</h4>
                    <p>${friend.location}</p>
                </div>
            </div>
        `).join('');
    }

    loadConversations() {
        if (!this.currentUser) {
            this.showNotification('Please log in to view messages', 'warning');
            return;
        }

        const conversationsList = document.getElementById('conversations-list');
        const userConversations = this.conversations.filter(conv => 
            conv.participants.includes(this.currentUser.id)
        );

        conversationsList.innerHTML = userConversations.map(conv => {
            const otherUserId = conv.participants.find(id => id !== this.currentUser.id);
            const otherUser = this.users.find(u => u.id === otherUserId);
            const lastMessage = conv.messages[conv.messages.length - 1];

            return `
                <div class="conversation-item" onclick="app.selectConversation(${conv.id})">
                    <img src="${otherUser.avatar}" alt="${otherUser.name}">
                    <div>
                        <h4>${otherUser.name}</h4>
                        <p>${lastMessage.text.substring(0, 30)}${lastMessage.text.length > 30 ? '...' : ''}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    selectConversation(conversationId) {
        this.currentConversation = this.conversations.find(c => c.id === conversationId);
        this.loadMessages();
        
        // Update active conversation
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
    }

    loadMessages() {
        if (!this.currentConversation) return;

        const chatMessages = document.getElementById('chat-messages');
        const otherUserId = this.currentConversation.participants.find(id => id !== this.currentUser.id);
        const otherUser = this.users.find(u => u.id === otherUserId);

        // Update chat header
        document.querySelector('.chat-header h3').textContent = otherUser.name;

        // Load messages
        chatMessages.innerHTML = this.currentConversation.messages.map(message => `
            <div class="message ${message.senderId === this.currentUser.id ? 'sent' : 'received'}">
                ${message.text}
            </div>
        `).join('');

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendMessage() {
        if (!this.currentConversation || !this.currentUser) return;

        const input = document.getElementById('message-input');
        const text = input.value.trim();
        
        if (!text) return;

        // Add message to conversation
        const newMessage = {
            id: Date.now(),
            senderId: this.currentUser.id,
            text: text,
            timestamp: new Date()
        };

        this.currentConversation.messages.push(newMessage);
        input.value = '';

        // Update UI
        this.loadMessages();

        // Simulate reply after 2 seconds
        setTimeout(() => {
            const otherUserId = this.currentConversation.participants.find(id => id !== this.currentUser.id);
            const reply = {
                id: Date.now() + 1,
                senderId: otherUserId,
                text: 'Thanks for the message! I\'ll get back to you soon.',
                timestamp: new Date()
            };
            this.currentConversation.messages.push(reply);
            this.loadMessages();
        }, 2000);
    }

    sendFriendRequest(userId) {
        if (!this.currentUser) {
            this.showNotification('Please log in to send friend requests', 'warning');
            return;
        }

        const targetUser = this.users.find(u => u.id === userId);
        if (targetUser.friends.includes(this.currentUser.id)) {
            this.showNotification('You are already friends!', 'info');
            return;
        }

        // Simulate friend request
        targetUser.friends.push(this.currentUser.id);
        this.currentUser.friends.push(userId);
        
        this.showNotification(`Friend request sent to ${targetUser.name}!`, 'success');
        this.loadUsers(); // Refresh the users grid
    }

    startConversation(userId) {
        if (!this.currentUser) {
            this.showNotification('Please log in to start conversations', 'warning');
            return;
        }

        // Check if conversation already exists
        let conversation = this.conversations.find(c => 
            c.participants.includes(this.currentUser.id) && c.participants.includes(userId)
        );

        if (!conversation) {
            // Create new conversation
            conversation = {
                id: Date.now(),
                participants: [this.currentUser.id, userId],
                messages: []
            };
            this.conversations.push(conversation);
        }

        // Navigate to messages and select conversation
        this.navigateToSection('messages');
        setTimeout(() => {
            this.selectConversation(conversation.id);
        }, 500);
    }

    editProfile() {
        // Simple profile editing - in a real app, this would open a modal
        const newBio = prompt('Update your bio:', this.currentUser.bio);
        if (newBio && newBio.trim()) {
            this.currentUser.bio = newBio.trim();
            this.loadProfile();
            this.showNotification('Profile updated successfully!', 'success');
        }
    }

    changeAvatar() {
        // Simple avatar change - in a real app, this would open a file picker
        const newAvatar = prompt('Enter avatar URL:', this.currentUser.avatar);
        if (newAvatar && newAvatar.trim()) {
            this.currentUser.avatar = newAvatar.trim();
            this.loadProfile();
            this.updateUI();
            this.showNotification('Avatar updated successfully!', 'success');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#6366f1'
        };
        return colors[type] || '#6366f1';
    }
}

// Initialize the application
const app = new FriendConnect();

// Add notification styles to head
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-content button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(notificationStyles);

// Add smooth scroll behavior for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });

    // Add hover effects to cards
    document.querySelectorAll('.user-card, .feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Export for global access
window.app = app; 