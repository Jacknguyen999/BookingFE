# 🏨 Booking Frontend Application

A modern, responsive web application built with React for managing room bookings and reservations. Designed with user experience and scalability in mind.

---

## MyWiki : [Link](https://deepwiki.com/Jacknguyen999/BookingFE/5.2-chatbot-system)

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

## 📦 Available Scripts

| Command           | Description                              |
|------------------|------------------------------------------|
| `npm start`       | Run the app in development mode          |
| `npm test`        | Launch the test runner                   |
| `npm run build`   | Build the app for production             |
| `npm run eject`   | Ejects configuration (not reversible)    |

---

## 📁 Project Structure

```bash
src/
├── App.js                # Main app component
├── Component/
│   ├── admin/            # Admin-specific views and tools
│   ├── auth/             # Sign in / Sign up components
│   ├── booking_rooms/    # Room listing and booking logic
│   ├── common/           # Shared UI components (e.g., Header, Footer)
│   ├── Home/             # Homepage and landing content
│   └── profile/          # User profile and settings
├── Config/               # Configuration files (e.g., Axios, Constants)
