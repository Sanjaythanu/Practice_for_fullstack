# FriendConnect 🌟

A modern, responsive social platform designed to help people make meaningful connections and build lasting friendships. Whether you're new to a city, looking to expand your social circle, or simply want to meet people with similar interests, FriendConnect is here to help.

## ✨ Features

### 🎯 Core Features
- **User Authentication**: Secure registration and login system
- **Profile Management**: Create and customize your profile with interests and bio
- **Friend Discovery**: Find and connect with people based on location, age, and interests
- **Real-time Messaging**: Chat with your friends and new connections
- **Friend Requests**: Send and manage friend requests
- **Advanced Filtering**: Filter users by age, location, and interests

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Beautiful transitions and hover effects
- **Modern Color Scheme**: Eye-catching gradients and professional styling
- **Interactive Elements**: Engaging buttons, cards, and forms
- **Loading States**: Visual feedback for all user actions

### 🔒 Security & Privacy
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for user passwords
- **Input Validation**: Comprehensive form validation
- **CORS Protection**: Cross-origin resource sharing security
- **Rate Limiting**: Protection against abuse

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd friendconnect
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Start the backend server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

4. **Open the application**
   - Navigate to `http://localhost:3000` in your browser
   - The frontend is served directly by the backend server

## 📁 Project Structure

```
friendconnect/
├── frontend/
│   ├── index.html          # Main HTML file
│   ├── style.css           # Modern CSS with animations
│   ├── app.js              # Frontend JavaScript application
│   └── README.txt          # Frontend documentation
├── backend/
│   ├── server.js           # Express server with all routes
│   ├── package.json        # Backend dependencies
│   ├── models/             # Data models (if using database)
│   └── routes/             # API route handlers
└── README.md               # This file
```

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript**: No framework dependencies for fast loading
- **Font Awesome**: Beautiful icons
- **Google Fonts**: Inter font family for modern typography

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing
- **CORS**: Cross-origin resource sharing

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (with filters)

### Friends
- `POST /api/friends/request` - Send friend request
- `PUT /api/friends/request/:id` - Accept/reject friend request
- `GET /api/friends/requests` - Get pending friend requests

### Messaging
- `GET /api/conversations` - Get user conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations/:id/messages` - Get conversation messages
- `POST /api/conversations/:id/messages` - Send message

## 🎨 Design Features

### Color Palette
- **Primary**: Indigo (#6366f1)
- **Secondary**: Amber (#f59e0b)
- **Accent**: Pink (#ec4899)
- **Success**: Emerald (#10b981)
- **Error**: Red (#ef4444)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive**: Scales beautifully across all devices

### Animations
- **Smooth Transitions**: 150ms, 300ms, and 500ms durations
- **Hover Effects**: Cards lift and buttons scale
- **Loading States**: Spinning animations for async operations
- **Scroll Animations**: Elements fade in as you scroll

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: 1200px+ (full feature set)
- **Tablet**: 768px - 1199px (adapted layout)
- **Mobile**: < 768px (mobile-first design)

### Mobile Features
- Hamburger menu for navigation
- Touch-friendly buttons and forms
- Optimized spacing and typography
- Swipe gestures for better UX

## 🔐 Security Features

### Authentication
- JWT tokens with 24-hour expiration
- Secure password hashing with bcrypt
- Protected routes with middleware
- Automatic token validation

### Data Protection
- Input sanitization and validation
- CORS configuration for security
- Rate limiting to prevent abuse
- Error handling without sensitive data exposure

## 🚀 Performance Optimizations

### Frontend
- Minimal JavaScript bundle
- Optimized CSS with CSS custom properties
- Lazy loading for images
- Efficient DOM manipulation

### Backend
- In-memory storage for fast access
- Optimized database queries (when implemented)
- Efficient routing and middleware
- Proper error handling

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Profile creation and editing
- [ ] User discovery and filtering
- [ ] Friend request functionality
- [ ] Messaging system
- [ ] Responsive design on all devices
- [ ] Form validation and error handling

## 🚀 Deployment

### Local Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend is served by backend at http://localhost:3000
```

### Production Deployment
1. Set up environment variables
2. Install production dependencies
3. Build and optimize assets
4. Deploy to your preferred hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Font Awesome** for beautiful icons
- **Google Fonts** for typography
- **Inter font family** for modern design
- **CSS Grid and Flexbox** for responsive layouts

## 📞 Support

If you have any questions or need help:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**Made with ❤️ for connecting people and building friendships** 