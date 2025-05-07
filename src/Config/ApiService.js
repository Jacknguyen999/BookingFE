import axios from "axios";

export default class ApiService {
  static BASE_URL = "http://localhost:8484";

  static getHeader() {
    const token = localStorage.getItem("token");
    if (!token) return { "Content-Type": "application/json" };

    try {
      // Check if token is expired
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds

      // If token is expired, clear it and redirect to login
      if (Date.now() >= expirationTime) {
        this.logout();
        return { "Content-Type": "application/json" };
      }

      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    } catch (error) {
      console.error("Error checking token:", error);
      this.logout();
      return { "Content-Type": "application/json" };
    }
  }

  /** AUTH */
  // Register a new user
  static async registerUser(registration) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/auth/register`,
        registration
      );
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
      }
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  // Login
  static async loginUser(loginDetails) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/auth/login`,
        loginDetails
      );
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
      }
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  /***USERS */

  /*   get all  user profile */
  static async getAllUsers() {
    const response = await axios.get(`${this.BASE_URL}/users/all`, {
      headers: this.getHeader(),
    });
    return response.data;
  }

  static async getCurrentUser() {
    const response = await axios.get(
      `${this.BASE_URL}/users/get_current_user_profile`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  static async getUserById(userId) {
    const response = await axios.get(
      `${this.BASE_URL}/users/get_by_id/${userId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  // get user booking
  static async getUserBooking(userId) {
    const response = await axios.get(
      `${this.BASE_URL}/users/get_user_booking/${userId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  // delete user
  static async deleteUser(userId) {
    const response = await axios.delete(
      `${this.BASE_URL}/users/delete/${userId}`,
      {
        headers: this.getHeader(),
      }
    );
    return response.data;
  }

  /**ROOM */

  /* add a new room */
  static async addRoom(formData) {
    const result = await axios.post(`${this.BASE_URL}/room/add`, formData, {
      headers: {
        ...this.getHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  }

  static async getUnavailableDates(roomId) {
    const result = await axios.get(
      `${this.BASE_URL}/room/unavailable-dates/${roomId}`
    );
    return result.data;
  }

  static async getAllAvailableRooms() {
    const result = await axios.get(
      `${this.BASE_URL}/rooms/all-available-rooms`
    );
    return result.data;
  }

  static async getAvailableRoomsByDateAndType(
    checkInDate,
    checkOutDate,
    roomType
  ) {
    const result = await axios.get(
      `${this.BASE_URL}/room/available-rooms-by-date-and-type?checkInDate=${checkInDate}
		&checkOutDate=${checkOutDate}&roomType=${roomType}`
    );
    return result.data;
  }

  static async getRoomTypes() {
    const response = await axios.get(`${this.BASE_URL}/room/types`);
    return response.data;
  }

  static async getAllRooms() {
    const result = await axios.get(`${this.BASE_URL}/room/all`);
    return result.data;
  }

  static async getRoomById(roomId) {
    const result = await axios.get(
      `${this.BASE_URL}/room/room-by-id/${roomId}`
    );
    return result.data;
  }

  static async deleteRoom(roomId) {
    const result = await axios.delete(
      `${this.BASE_URL}/room/delete/${roomId}`,
      {
        headers: this.getHeader(),
      }
    );
    return result.data;
  }

  static async updateRoom(roomId, formData) {
    const result = await axios.put(
      `${this.BASE_URL}/room/update/${roomId}`,
      formData,
      {
        headers: {
          ...this.getHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return result.data;
  }

  /**BOOKING */

  static async bookRoom(roomId, userId, booking) {
    try {
      console.log("USER ID IS: " + userId);
      const response = await axios.post(
        `${this.BASE_URL}/bookings/book-room/${roomId}/${userId}`,
        booking,
        {
          headers: this.getHeader(),
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw {
          response: {
            data: error.response.data,
            status: error.response.status,
          },
        };
      } else if (error.request) {
        // The request was made but no response was received
        throw {
          message: "Không thể kết nối đến server",
        };
      } else {
        // Something happened in setting up the request that triggered an Error
        throw {
          message: error.message || "Có lỗi xảy ra khi đặt phòng",
        };
      }
    }
  }

  static async getAllBookings() {
    const result = await axios.get(`${this.BASE_URL}/bookings/all-booking`, {
      headers: this.getHeader(),
    });
    return result.data;
  }

  static async getBookingByConfirmationCode(bookingCode) {
    const result = await axios.get(
      `${this.BASE_URL}/bookings/get-by-confirmation-code/${bookingCode}`
    );
    return result.data;
  }

  static async cancelBooking(bookingId) {
    const result = await axios.delete(
      `${this.BASE_URL}/bookings/cancel/${bookingId}`,
      {
        headers: this.getHeader(),
      }
    );
    return result.data;
  }

  /**AUTHENTICATION CHECKER */

  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login"; // Force redirect to login
  }

  static isAuthenticated() {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      // Check if token is expired
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds

      // If token is expired, clear it
      if (Date.now() >= expirationTime) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return false;
    }
  }

  static isAdmin() {
    const role = localStorage.getItem("role");
    return role === "ADMIN";
  }

  static isUser() {
    const role = localStorage.getItem("role");
    return role === "USER";
  }
}
