require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// JWT Secret (in production, use environment variable)
const JWT_SECRET = 'your-secret-key-change-in-production';

// In-memory storage (in production, use a database)
let users = [
    {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: '$2a$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ',
        age: 25,
        location: 'New York',
        bio: 'Love traveling, photography, and meeting new people! Always up for an adventure.',
        interests: ['Travel', 'Photography', 'Music', 'Art'],
        friends: [],
        avatar: 'https://via.placeholder.com/150/ec4899/ffffff?text=S',
        createdAt: new Date()
    },
    {
        id: 2,
        name: 'Mike Chen',
        email: 'mike@example.com',
        password: '$2a$10$rQZ8K9vX2mN3pL4qR5sT6uV7wX8yZ9aA0bB1cC2dE3fF4gG5hH6iI7jJ8kK9lL0mM1nN2oO3pP4qQ5rR6sS7tT8uU9vV0wW1xX2yY3zZ',
        age: 28,
        location: 'Los Angeles',
        bio: 'Tech enthusiast and coffee lover. Building the future one line of code at a time.',
        interests: ['Technology', 'Coffee', 'Gaming', 'Fitness'],
        friends: [],
        avatar: 'https://via.placeholder.com/150/6366f1/ffffff?text=M',
        createdAt: new Date()
    }
];

let conversations = [
    {
        id: 1,
        participants: [1, 2],
        messages: [
            {
                id: 1,
                senderId: 1,
                text: 'Hey! I saw we have similar interests in technology!',
                timestamp: new Date(Date.now() - 3600000)
            },
            {
                id: 2,
                senderId: 2,
                text: 'Hi Sarah! Yes, I love coding and coffee. What kind of tech are you into?',
                timestamp: new Date(Date.now() - 3500000)
            }
        ],
        createdAt: new Date()
    }
];

let friendRequests = [];

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// User Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, age, location } = req.body;

        // Validation
        if (!name || !email || !password || !age || !location) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        if (age < 18 || age > 100) {
            return res.status(400).json({ error: 'Age must be between 18 and 100' });
        }

        // Check if user already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            id: users.length + 1,
            name,
            email,
            password: hashedPassword,
            age: parseInt(age),
            location,
            bio: 'Tell us about yourself...',
            interests: [],
            friends: [],
            avatar: `https://via.placeholder.com/150/6366f1/ffffff?text=${name.charAt(0).toUpperCase()}`,
            createdAt: new Date()
        };

        users.push(newUser);

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;

        res.status(201).json({
            message: 'User created successfully',
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'Login successful',
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user profile
app.get('/api/users/profile', authenticateToken, (req, res) => {
    try {
        const user = users.find(u => u.id === req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user profile
app.put('/api/users/profile', authenticateToken, (req, res) => {
    try {
        const { name, bio, interests, avatar } = req.body;
        const userIndex = users.findIndex(u => u.id === req.user.userId);

        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user fields
        if (name) users[userIndex].name = name;
        if (bio) users[userIndex].bio = bio;
        if (interests) users[userIndex].interests = interests;
        if (avatar) users[userIndex].avatar = avatar;

        const { password, ...userWithoutPassword } = users[userIndex];
        res.json({
            message: 'Profile updated successfully',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all users (for discovery)
app.get('/api/users', authenticateToken, (req, res) => {
    try {
        const { age, location, interest } = req.query;
        let filteredUsers = users.filter(user => user.id !== req.user.userId);

        // Apply filters
        if (age) {
            const [min, max] = age.split('-').map(Number);
            filteredUsers = filteredUsers.filter(user => {
                if (max) return user.age >= min && user.age <= max;
                return user.age >= min;
            });
        }

        if (location) {
            filteredUsers = filteredUsers.filter(user => 
                user.location.toLowerCase().includes(location.toLowerCase())
            );
        }

        if (interest) {
            filteredUsers = filteredUsers.filter(user => 
                user.interests.some(i => 
                    i.toLowerCase().includes(interest.toLowerCase())
                )
            );
        }

        // Remove sensitive information
        const safeUsers = filteredUsers.map(user => {
            const { password, ...safeUser } = user;
            return safeUser;
        });

        res.json(safeUsers);

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Send friend request
app.post('/api/friends/request', authenticateToken, (req, res) => {
    try {
        const { targetUserId } = req.body;

        if (!targetUserId) {
            return res.status(400).json({ error: 'Target user ID is required' });
        }

        // Check if target user exists
        const targetUser = users.find(u => u.id === targetUserId);
        if (!targetUser) {
            return res.status(404).json({ error: 'Target user not found' });
        }

        // Check if already friends
        const currentUser = users.find(u => u.id === req.user.userId);
        if (currentUser.friends.includes(targetUserId)) {
            return res.status(400).json({ error: 'Already friends' });
        }

        // Check if request already exists
        const existingRequest = friendRequests.find(req => 
            req.fromUserId === req.user.userId && req.toUserId === targetUserId
        );

        if (existingRequest) {
            return res.status(400).json({ error: 'Friend request already sent' });
        }

        // Create friend request
        const friendRequest = {
            id: friendRequests.length + 1,
            fromUserId: req.user.userId,
            toUserId: targetUserId,
            status: 'pending',
            createdAt: new Date()
        };

        friendRequests.push(friendRequest);

        res.json({
            message: 'Friend request sent successfully',
            request: friendRequest
        });

    } catch (error) {
        console.error('Send friend request error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Accept/Reject friend request
app.put('/api/friends/request/:requestId', authenticateToken, (req, res) => {
    try {
        const { requestId } = req.params;
        const { action } = req.body; // 'accept' or 'reject'

        const requestIndex = friendRequests.findIndex(req => 
            req.id === parseInt(requestId) && req.toUserId === req.user.userId
        );

        if (requestIndex === -1) {
            return res.status(404).json({ error: 'Friend request not found' });
        }

        const request = friendRequests[requestIndex];

        if (action === 'accept') {
            // Add to friends list
            const fromUser = users.find(u => u.id === request.fromUserId);
            const toUser = users.find(u => u.id === request.toUserId);

            if (!fromUser.friends.includes(request.toUserId)) {
                fromUser.friends.push(request.toUserId);
            }
            if (!toUser.friends.includes(request.fromUserId)) {
                toUser.friends.push(request.fromUserId);
            }

            request.status = 'accepted';
            res.json({ message: 'Friend request accepted' });

        } else if (action === 'reject') {
            request.status = 'rejected';
            res.json({ message: 'Friend request rejected' });

        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }

    } catch (error) {
        console.error('Handle friend request error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get friend requests
app.get('/api/friends/requests', authenticateToken, (req, res) => {
    try {
        const userRequests = friendRequests.filter(req => 
            req.toUserId === req.user.userId && req.status === 'pending'
        );

        const requestsWithUserInfo = userRequests.map(req => {
            const fromUser = users.find(u => u.id === req.fromUserId);
            const { password, ...safeUser } = fromUser;
            return {
                ...req,
                fromUser: safeUser
            };
        });

        res.json(requestsWithUserInfo);

    } catch (error) {
        console.error('Get friend requests error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get conversations
app.get('/api/conversations', authenticateToken, (req, res) => {
    try {
        const userConversations = conversations.filter(conv => 
            conv.participants.includes(req.user.userId)
        );

        const conversationsWithUserInfo = userConversations.map(conv => {
            const otherUserId = conv.participants.find(id => id !== req.user.userId);
            const otherUser = users.find(u => u.id === otherUserId);
            const { password, ...safeUser } = otherUser;

            return {
                ...conv,
                otherUser: safeUser,
                lastMessage: conv.messages[conv.messages.length - 1] || null
            };
        });

        res.json(conversationsWithUserInfo);

    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get conversation messages
app.get('/api/conversations/:conversationId/messages', authenticateToken, (req, res) => {
    try {
        const { conversationId } = req.params;
        const conversation = conversations.find(conv => 
            conv.id === parseInt(conversationId) && conv.participants.includes(req.user.userId)
        );

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.json(conversation.messages);

    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Send message
app.post('/api/conversations/:conversationId/messages', authenticateToken, (req, res) => {
    try {
        const { conversationId } = req.params;
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Message text is required' });
        }

        const conversation = conversations.find(conv => 
            conv.id === parseInt(conversationId) && conv.participants.includes(req.user.userId)
        );

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        const newMessage = {
            id: Date.now(),
            senderId: req.user.userId,
            text: text.trim(),
            timestamp: new Date()
        };

        conversation.messages.push(newMessage);

        res.status(201).json({
            message: 'Message sent successfully',
            messageData: newMessage
        });

    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new conversation
app.post('/api/conversations', authenticateToken, (req, res) => {
    try {
        const { targetUserId } = req.body;

        if (!targetUserId) {
            return res.status(400).json({ error: 'Target user ID is required' });
        }

        // Check if target user exists
        const targetUser = users.find(u => u.id === targetUserId);
        if (!targetUser) {
            return res.status(404).json({ error: 'Target user not found' });
        }

        // Check if conversation already exists
        const existingConversation = conversations.find(conv => 
            conv.participants.includes(req.user.userId) && conv.participants.includes(targetUserId)
        );

        if (existingConversation) {
            return res.json({
                message: 'Conversation already exists',
                conversation: existingConversation
            });
        }

        // Create new conversation
        const newConversation = {
            id: conversations.length + 1,
            participants: [req.user.userId, targetUserId],
            messages: [],
            createdAt: new Date()
        };

        conversations.push(newConversation);

        res.status(201).json({
            message: 'Conversation created successfully',
            conversation: newConversation
        });

    } catch (error) {
        console.error('Create conversation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`FriendConnect server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the application`);
}); 