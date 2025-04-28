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
import { AdminRoute, CustomerRoute } from "./Config/Authen";
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
            element={<CustomerRoute element={<RoomDetailPage />} />}
          />
          <Route
            path="/profile"
            element={<CustomerRoute element={<ProfilePage />} />}
          />
          <Route
            path="/edit-profile"
            element={<CustomerRoute element={<EditProfilePage />} />}
          />

          {/* Admin Routes */}

          <Route
            path="/admin"
            element={<AdminRoute element={<AdminPage />} />}
          />

          <Route
            path="/admin/manage-rooms"
            element={<AdminRoute element={<ManageRoomPage />} />}
          />

          <Route
            path="/admin/add-room"
            element={<AdminRoute element={<AddRoomPage />} />}
          />

          <Route
            path="/admin/manage-bookings"
            element={<AdminRoute element={<ManageBookingPage />} />}
          />
          <Route
            path="/admin/edit-booking/:bookingCode"
            element={<AdminRoute element={<EditBookingPage />} />}
          />

          <Route
            path="/admin/edit-room/:roomId"
            element={<AdminRoute element={<EditRoomPage />} />}
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
      <Layout />
    </BrowserRouter>
  );
}

export default App;
