import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../Config/ApiService";

const AdminPage = () => {
  const [adminName, setAdminName] = useState("");
  const [stats, setStats] = useState({
    bookings: 0,
    users: 0,
    rooms: 0,
    pending: 0,
    success: 0,
    revenue: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const response = await ApiService.getCurrentUser();
        setAdminName(response.user.name);
      } catch (error) {
        // ignore
      }
    };
    fetchAdminName();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const bookingsRes = await ApiService.getAllBookings();
        const usersRes = await ApiService.getAllUsers();
        const roomsRes = await ApiService.getAllRooms();
        const paymentsRes = (await ApiService.getAllPayments)
          ? await ApiService.getAllPayments()
          : { paymentList: [] };

        const bookings = bookingsRes.bookingList || [];
        const pending = bookings.filter(
          (b) => b.paymentStatus === "PENDING"
        ).length;
        const success = bookings.filter(
          (b) => b.paymentStatus === "PAID"
        ).length;

        // Sum revenue from bookings with status PAID
        const revenue = bookings
          .filter(
            (b) =>
              typeof b.paymentStatus === "string" &&
              b.paymentStatus.toUpperCase() === "PAID"
          )
          .reduce(
            (sum, b) =>
              sum + (typeof b.totalPrice === "number" ? b.totalPrice : 0),
            0
          );

        setStats({
          bookings: bookings.length,
          users: Array.isArray(usersRes.userList)
            ? usersRes.userList.filter((u) => u.role === "USER").length
            : 0,
          rooms: roomsRes.roomList ? roomsRes.roomList.length : 0,
          pending,
          success,
          revenue,
        });
      } catch (e) {
        // ignore
      }
    };
    fetchStats();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fafcff",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
          padding: "2.5rem 2rem",
          minWidth: "400px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#008080",
            fontWeight: 700,
            marginBottom: "2rem",
            fontSize: "2rem",
          }}
        >
          Welcome, {adminName || "Admin"}
        </h1>
        <div
          style={{
            display: "flex",
            gap: "2.5rem",
            justifyContent: "center",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {stats.bookings}
            </div>
            <div>Total Bookings</div>
          </div>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {stats.users}
            </div>
            <div>Total Users</div>
          </div>
          <div>
            <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {stats.rooms}
            </div>
            <div>Total Rooms</div>
          </div>
          <div>
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#db2109" }}
            >
              {stats.pending}
            </div>
            <div>Cancel Bookings</div>
          </div>
          <div>
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#22c55e" }}
            >
              {stats.success}
            </div>
            <div>Success Bookings</div>
          </div>
          <div>
            <div
              style={{ fontSize: "2rem", fontWeight: "bold", color: "#0ea5e9" }}
            >
              {stats.revenue.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              })}
            </div>
            <div>Total Revenue</div>
          </div>
        </div>
        <div
          style={{ display: "flex", gap: "1.5rem", justifyContent: "center" }}
        >
          <button
            className="admin-button"
            style={{
              background: "#008080",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "0.75rem 2rem",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            }}
            onClick={() => navigate("/admin/manage-rooms")}
          >
            Manage Room
          </button>
          <button
            className="admin-button"
            style={{
              background: "#008080",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "0.75rem 2rem",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            }}
            onClick={() => navigate("/admin/manage-bookings")}
          >
            Manage Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
