# Todo App - Frontend Only

A modern, beautiful, and fully-functional Todo application optimized for iPhone 14 Pro Max. **No backend required** - all data is stored locally in your browser!

## ✨ Features

- 🔐 **Simple Authentication**: Login/Signup stored in localStorage
- ✅ **Todo Management**: Create, edit, delete, and toggle todos
- 🎨 **Beautiful UI**: Modern glassmorphism design with smooth animations
- 📱 **Mobile-First**: Optimized for iPhone 14 Pro Max (430x932px)
- 🔔 **Daily Reminders**: Receive notifications at 9 AM for todos due today
- 💾 **Local Storage**: All data persists in your browser
- 🌙 **Dark Mode**: Built-in dark theme support

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)

### Installation

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the app**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Go to: http://localhost:5173
   - For mobile testing: Open DevTools (F12) and set viewport to **430x932px** (iPhone 14 Pro Max)

## 📱 How to Use

### 1. Sign Up / Login
- Create an account with your name, email, and password
- Your credentials are stored securely in localStorage

### 2. Create Todos
- Click the **+** button (bottom right)
- Add title, description, priority, and due date
- Enable **daily reminder** to get notifications at 9 AM

### 3. Manage Todos
- ✓ Click the circle to mark as complete
- ✏️ Click edit icon to modify
- 🗑️ Click trash icon to delete

### 4. Enable Notifications
- When prompted, click **Allow** for notifications
- You'll receive daily reminders at 9 AM for todos due that day

## 🎨 Tech Stack

- **React 18** + Vite
- **TailwindCSS v4** with glassmorphism
- **Framer Motion** for animations
- **Zustand** for state management
- **Web Notification API** for reminders
- **localStorage** for data persistence

## 🔔 Notification Features

- **Daily Reminders**: Automatically checks at 9 AM every day
- **Due Date Alerts**: Get notified for todos due today
- **Persistent**: Reminders continue even after closing the browser (if app is open)

## 💾 Data Storage

All data is stored in your browser's localStorage:
- **Users**: Login credentials
- **Todos**: All your tasks with details
- **Auth State**: Current login session

**Note**: Data is specific to your browser. Clearing browser data will delete all todos.

## 🎯 Priority Levels

- 🔴 **High**: Red indicator
- 🟡 **Medium**: Yellow indicator  
- 🟢 **Low**: Green indicator

## 📝 No Backend Needed!

This app runs entirely in your browser - no server, no database setup required. Just install and run!

## 🐛 Troubleshooting

**Notifications not working?**
- Make sure you clicked "Allow" when prompted
- Check browser notification settings
- Notifications only work when the app is open

**Lost your data?**
- Data is stored in localStorage
- Clearing browser data will delete todos
- Export feature coming soon!

---

**Enjoy your beautiful Todo App! 🎉**
