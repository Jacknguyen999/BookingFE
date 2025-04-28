import axios from "axios";

const API_URL = "http://localhost:8484/api/chatbot";

// Helper function to get a unique user ID from localStorage or generate a new one
const getUserId = () => {
  let userId = localStorage.getItem("chatbot_user_id");
  if (!userId) {
    userId = "user_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("chatbot_user_id", userId);
  }
  return userId;
};

// Helper function to get the current session ID from localStorage
const getSessionId = () => {
  const sessionId = localStorage.getItem("chatbot_session_id");
  console.log("Retrieved session ID from localStorage:", sessionId);
  return sessionId;
};

// Helper function to save the session ID to localStorage
const saveSessionId = (sessionId) => {
  if (sessionId) {
    console.log("Saving session ID to localStorage:", sessionId);
    localStorage.setItem("chatbot_session_id", sessionId);

    // Verify it was saved correctly
    const savedId = localStorage.getItem("chatbot_session_id");
    console.log("Verified saved session ID:", savedId);
  } else {
    console.warn("Attempted to save empty session ID");
  }
};

const chatbotService = {
  // Test the API connection
  testConnection: async () => {
    try {
      console.log("Testing chatbot API connection...");
      // Send a simple ping message to test the connection
      const response = await axios.post(
        `${API_URL}/chat`,
        {
          message: "ping",
          userId: getUserId(),
        },
        {
          timeout: 5000, // 5 seconds timeout for quick test
        }
      );
      console.log("Chatbot API test response:", response.data);

      // Save the session ID if it's returned
      if (response.data && response.data.sessionId) {
        saveSessionId(response.data.sessionId);
      }

      return response.data;
    } catch (error) {
      console.error("Error testing chatbot API connection:", error);
      return { success: false, error: error.message };
    }
  },

  // Send a message to the chatbot
  sendMessage: async (message, userId = null) => {
    try {
      // Use provided userId or get from localStorage
      const actualUserId = userId || getUserId();
      const sessionId = getSessionId();

      console.log("Sending message to chatbot:", message);
      console.log("Using session ID:", sessionId);

      // Add a timeout to the request
      const response = await axios.post(
        `${API_URL}/chat`,
        {
          message,
          userId: actualUserId,
          sessionId,
        },
        {
          timeout: 15000, // 15 seconds timeout
        }
      );

      console.log("Chatbot response:", response.data);

      // Save the session ID if it's returned
      if (response.data && response.data.sessionId) {
        console.log(
          "Received session ID from server:",
          response.data.sessionId
        );
        saveSessionId(response.data.sessionId);
      } else {
        console.warn("No session ID received from server");
      }

      return response.data;
    } catch (error) {
      console.error("Error sending message to chatbot:", error);

      // Return a formatted error response
      return {
        success: false,
        error: error.response
          ? `Server error: ${error.response.status} ${error.response.statusText}`
          : `Network error: ${error.message}`,
      };
    }
  },

  // Get conversation history for a session
  getHistory: async (sessionId = null) => {
    try {
      const actualSessionId = sessionId || getSessionId();

      if (!actualSessionId) {
        return { success: false, error: "No session ID available" };
      }

      const response = await axios.get(
        `${API_URL}/history?sessionId=${actualSessionId}`
      );
      console.log("Conversation history:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching conversation history:", error);
      return { success: false, error: error.message };
    }
  },

  // Get all sessions for a user
  getUserSessions: async (userId = null) => {
    try {
      const actualUserId = userId || getUserId();

      const response = await axios.get(
        `${API_URL}/sessions?userId=${actualUserId}`
      );
      console.log("User sessions:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user sessions:", error);
      return { success: false, error: error.message };
    }
  },

  // Start a new session
  startNewSession: () => {
    localStorage.removeItem("chatbot_session_id");
    return { success: true };
  },
};

export default chatbotService;
