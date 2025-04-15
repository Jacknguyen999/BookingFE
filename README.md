# 🏨 Booking Frontend Application

A modern, responsive web application built with React for managing room bookings and reservations. Designed with user experience and scalability in mind.

---

## 🚀 Features

### 👤 Authentication & Authorization
- Sign In / Sign Up
- Role-based access control: **Admin** & **Customer**

### 🏠 Room Management
- Browse all rooms
- View detailed room information
- Book rooms with date picker
- Search and view bookings

### 🧑‍💼 User Profile
- View personal profile
- Edit profile details

### 🛠️ Admin Capabilities
- Admin dashboard
- Add / Edit / Delete rooms
- Manage all bookings

---

## 🛠 Tech Stack

- **Frontend Framework**: React 18
- **Routing**: React Router v7
- **State Management**: Redux + Redux Thunk
- **UI Libraries**: Material UI v6, Tailwind CSS
- **Form Handling**: Formik
- **HTTP Requests**: Axios
- **Real-Time Communication**: WebSocket (STOMP over SockJS)
- **Date Picker**: React DatePicker

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (Latest LTS version)
- npm or yarn

### Installation


# 1. Clone the repository
git clone [your-repo-url]

# 2. Navigate to the project folder
cd booking-frontend

# 3. Install dependencies
npm install

# 4. Start the development server
npm start

The application will be available at `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Project Structure
```bash
src/
├── Component/
│ ├── admin/ # Admin-specific components
│ ├── auth/ # Authentication components
│ ├── booking_rooms/ # Room booking components
│ ├── common/ # Shared components
│ ├── Home/ # Homepage components
│ └── profile/ # User profile components
├── Config/ # Configuration files
└── App.js # Main application component
