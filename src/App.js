import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./Component/common/Navbar";
import Footer from "./Component/common/footer";
import Chatbot from "./Component/common/Chatbot";
import Homepage from "./Component/Home/homepage";
import SignIn from "./Component/auth/SignIn";
import SignUp from "./Component/auth/SignUp";
import ApiService from "./Config/ApiService";
import ProfilePage from "./Component/profile/ProfilePage";
import EditProfilePage from "./Component/profile/EditProfilePage";
import AllRoomPage from "./Component/booking_rooms/AllRoomPage";
import RoomDetailPage from "./Component/booking_rooms/RoomDetailPage";
import FindBookingPage from "./Component/booking_rooms/FindBookingPage";
import { ManageRoomPage } from "./Component/admin/ManageRoompage";
import AddRoomPage from "./Component/admin/AddRoomPage";
import AdminPage from "./Component/admin/AdminPage";
import ManageBookingPage from "./Component/admin/ManageBookingPage";
import EditBookingPage from "./Component/admin/EditBookingPage";
import EditRoomPage from "./Component/admin/EditRoomPage";
import { ToastProvider } from "./contexts/ToastContext";

// Protected route components
const CustomerProtectedRoute = ({ children }) => {
  const location = useLocation();
  return ApiService.isAuthenticated() ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();
  return ApiService.isAdmin() ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

function Layout() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="App">
      {/* Conditionally render Navbar and Footer */}
      {!isAuthPage && <Navbar />}
      <div className="content">
        <Routes>
          {/* Public Routes */}
          <Route exact path="/home" element={<Homepage />} />
          <Route exact path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/rooms" element={<AllRoomPage />} />
          <Route path="/find-booking" element={<FindBookingPage />} />

          {/* Protected Routes */}
          <Route
            path="/room-details-book/:roomId"
            element={
              <CustomerProtectedRoute>
                <RoomDetailPage />
              </CustomerProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <CustomerProtectedRoute>
                <ProfilePage />
              </CustomerProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <CustomerProtectedRoute>
                <EditProfilePage />
              </CustomerProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminPage />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/manage-rooms"
            element={
              <AdminProtectedRoute>
                <ManageRoomPage />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/add-room"
            element={
              <AdminProtectedRoute>
                <AddRoomPage />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/manage-bookings"
            element={
              <AdminProtectedRoute>
                <ManageBookingPage />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/edit-booking/:bookingCode"
            element={
              <AdminProtectedRoute>
                <EditBookingPage />
              </AdminProtectedRoute>
            }
          />

          <Route
            path="/admin/edit-room/:roomId"
            element={
              <AdminProtectedRoute>
                <EditRoomPage />
              </AdminProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
      {/* Conditionally render Footer */}
      {!isAuthPage && <Footer />}
      {/* Chatbot component - available on all pages */}
      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Layout />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
