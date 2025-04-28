import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Snackbar,
  Alert,
  Fade,
  useMediaQuery,
  useTheme,
  Typography,
  CircularProgress,
  Divider,
  Chip,
  Avatar,
  Zoom,
  Fab,
} from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ErrorIcon from "@mui/icons-material/Error";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { format } from "date-fns";
import chatbotService from "../../Config/chatbotService";
import chatbotTheme from "../../styles/chatbotTheme";

// Import components
import ChatbotButton from "./chatbot/ChatbotButton";
import ChatbotHeader from "./chatbot/ChatbotHeader";
import ChatbotSuggestions from "./chatbot/ChatbotSuggestions";
import ChatbotInput from "./chatbot/ChatbotInput";

// Suggested questions for quick access
const SUGGESTED_QUESTIONS = [
  { text: "Room availability", icon: <HotelIcon fontSize="small" /> },
  { text: "Hotel amenities", icon: <RoomServiceIcon fontSize="small" /> },
  { text: "Special offers", icon: <LocalOfferIcon fontSize="small" /> },
  { text: "Check-in times", icon: <EventAvailableIcon fontSize="small" /> },
];

const Chatbot = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your hotel booking assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [apiStatus, setApiStatus] = useState({ tested: false, working: false });
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [sessionId, setSessionId] = useState(
    localStorage.getItem("chatbot_session_id") || ""
  );
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Menu state
  const isMenuOpen = Boolean(menuAnchorEl);

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Check for existing session ID in localStorage on component mount
  useEffect(() => {
    const storedSessionId = localStorage.getItem("chatbot_session_id");
    console.log("Initial session ID from localStorage:", storedSessionId);

    if (storedSessionId) {
      setSessionId(storedSessionId);
      console.log("Set initial session ID from localStorage:", storedSessionId);
    }
  }, []);

  // Test API connection when component mounts
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const result = await chatbotService.testConnection();
        console.log("API test result:", result);
        setApiStatus({ tested: true, working: true });

        // Update session ID if returned from API
        if (result && result.sessionId) {
          console.log("Received session ID from API test:", result.sessionId);
          setSessionId(result.sessionId);
          localStorage.setItem("chatbot_session_id", result.sessionId);
          console.log("Saved session ID from API test to localStorage");
        } else {
          console.warn("No session ID returned from API test");
        }
      } catch (error) {
        console.error("API test failed:", error);
        setApiStatus({ tested: true, working: false });
        setErrorMessage(
          "Could not connect to chatbot service. Some features may not work."
        );
        setShowError(true);
      }
    };

    testApiConnection();
  }, []);

  // Load conversation history when session ID changes
  useEffect(() => {
    const loadConversationHistory = async () => {
      if (sessionId && isOpen) {
        setIsLoadingHistory(true);
        try {
          const history = await chatbotService.getHistory(sessionId);

          if (Array.isArray(history) && history.length > 0) {
            // Convert the history to the format expected by the component
            const formattedHistory = history.map((msg) => ({
              text: msg.message,
              sender: msg.role,
              timestamp: new Date(msg.timestamp),
            }));

            // Only update if we have history and it's different from current messages
            if (formattedHistory.length > messages.length) {
              setMessages(formattedHistory);
            }
          }
        } catch (error) {
          console.error("Error loading conversation history:", error);
        } finally {
          setIsLoadingHistory(false);
        }
      }
    };

    loadConversationHistory();
  }, [sessionId, isOpen, messages.length]);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }

    // Reset unread count when opening chat
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Check scroll position to show/hide scroll to bottom button
  useEffect(() => {
    const checkScrollPosition = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          messagesContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollToBottom(!isNearBottom);
      }
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      return () => container.removeEventListener("scroll", checkScrollPosition);
    }
  }, []);

  // Increment unread count when new message arrives and chat is closed
  useEffect(() => {
    if (
      !isOpen &&
      messages.length > 0 &&
      messages[messages.length - 1].sender === "bot"
    ) {
      setUnreadCount((prev) => prev + 1);
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // Reset unread count when opening
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const simulateTyping = () => {
    setIsTyping(true);
    // Simulate typing for a more natural feel
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsTyping(false);
        resolve();
      }, 1500); // Adjust typing time based on message length
    });
  };

  // Start a new conversation
  const handleStartNewConversation = () => {
    // Close the menu
    handleMenuClose();

    // Clear the session ID
    localStorage.removeItem("chatbot_session_id");
    chatbotService.startNewSession();
    setSessionId("");

    // Reset messages
    setMessages([
      {
        text: "Hello! I'm your hotel booking assistant. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);

    // Show confirmation
    setErrorMessage("Started a new conversation");
    setShowError(true);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault(); // Make it optional for suggestion chips

    if (!message.trim()) return;

    // Check if API is working
    if (apiStatus.tested && !apiStatus.working) {
      setErrorMessage(
        "Cannot connect to chatbot service. Please try again later."
      );
      setShowError(true);
      return;
    }

    // Add user message to chat
    const userMessage = {
      text: message,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      // Simulate typing indicator before sending to API
      await simulateTyping();

      // Send message to backend
      const response = await chatbotService.sendMessage(message);
      console.log("Response from chatbot service:", response);

      // Add bot response to chat
      if (response && response.success !== false) {
        // Success case
        setMessages((prev) => [
          ...prev,
          {
            text: response.response,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);

        // Update session ID if provided
        if (response.sessionId) {
          console.log("Received session ID in response:", response.sessionId);
          setSessionId(response.sessionId);
          localStorage.setItem("chatbot_session_id", response.sessionId);
          console.log("Saved session ID to state and localStorage");
        } else {
          console.warn("No session ID in response:", response);
        }
      } else {
        // Error case from API
        console.error(
          "Error from chatbot API:",
          response.error || "Unknown error"
        );
        setErrorMessage(
          response.error || "An error occurred with the chatbot service."
        );
        setShowError(true);

        setMessages((prev) => [
          ...prev,
          {
            text: "Sorry, I encountered an error processing your request. Please try again later.",
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      // Network or other error
      console.error("Error sending message:", error);
      setErrorMessage("Network error connecting to chatbot service.");
      setShowError(true);

      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I encountered a network error. Please check your connection and try again.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggestion chip click
  const handleSuggestionClick = (question) => {
    setMessage(question);
    // Use setTimeout to ensure the message state is updated before sending
    setTimeout(() => {
      handleSendMessage();
    }, 10);
  };

  // Handle closing the error snackbar
  const handleCloseError = () => {
    setShowError(false);
  };

  // Format timestamp
  const formatTime = (date) => {
    return format(date, "h:mm a");
  };

  // Handle key press in input field
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Use imported chatbot theme

  // Use theme colors
  const colors = {
    primary: chatbotTheme.colors.primary.main,
    secondary: chatbotTheme.colors.secondary.main,
    accent: chatbotTheme.colors.accent.info,
    success: chatbotTheme.colors.accent.success,
    userBubble: chatbotTheme.colors.bubbles.user.background,
    botBubble: chatbotTheme.colors.bubbles.bot.background,
    botBubbleText: chatbotTheme.colors.bubbles.bot.text,
    userBubbleText: chatbotTheme.colors.bubbles.user.text,
    lightGray: chatbotTheme.colors.neutral.lighter,
    mediumGray: chatbotTheme.colors.neutral.medium,
    darkGray: chatbotTheme.colors.neutral.dark,
    background: chatbotTheme.colors.neutral.white,
    divider: chatbotTheme.colors.neutral.light,
    shadow: chatbotTheme.colors.functional.shadow,
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: chatbotTheme.zIndex.chatbot,
      }}
    >
      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{
            width: "100%",
            borderRadius: chatbotTheme.borders.radius.md,
            boxShadow: chatbotTheme.shadows.md,
            "& .MuiAlert-icon": {
              color: chatbotTheme.colors.accent.error,
            },
            "& .MuiAlert-message": {
              color: chatbotTheme.colors.neutral.darker,
              fontWeight: chatbotTheme.typography.fontWeight.medium,
            },
          }}
          icon={<ErrorIcon />}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Chat toggle button */}
      <ChatbotButton
        isOpen={isOpen}
        unreadCount={unreadCount}
        onClick={toggleChat}
        colors={colors}
      />

      {/* Chat window */}
      <Fade in={isOpen}>
        <Paper
          elevation={8}
          sx={{
            width: isMobile
              ? chatbotTheme.components.chatWindow.width.mobile
              : chatbotTheme.components.chatWindow.width.desktop,
            height: isMobile
              ? chatbotTheme.components.chatWindow.height.mobile
              : chatbotTheme.components.chatWindow.height.desktop,
            mb: chatbotTheme.spacing.md,
            display: "flex",
            flexDirection: "column",
            borderRadius: chatbotTheme.borders.radius.lg,
            overflow: "hidden",
            boxShadow: chatbotTheme.shadows.xl,
            border: "none",
            position: "absolute",
            bottom: 70, // Increased to avoid overlapping with the button
            right: 10, // Added right margin to avoid overlapping with notification badge
            backdropFilter: "blur(10px)",
            backgroundColor: colors.background,
          }}
        >
          {/* Chat header */}
          <ChatbotHeader
            sessionId={sessionId}
            onClose={toggleChat}
            onNewConversation={handleStartNewConversation}
            onMenuOpen={handleMenuOpen}
            onMenuClose={handleMenuClose}
            menuAnchorEl={menuAnchorEl}
            isMenuOpen={isMenuOpen}
          />

          {/* Suggested questions */}
          <ChatbotSuggestions
            suggestions={SUGGESTED_QUESTIONS}
            onSuggestionClick={handleSuggestionClick}
          />

          {/* Messages area */}
          <Box
            ref={messagesContainerRef}
            sx={{
              flexGrow: 1,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              backgroundColor: colors.background,
              position: "relative",
              scrollBehavior: "smooth",
            }}
          >
            {messages.map((message, index) => (
              <React.Fragment key={index}>
                {index === 0 ||
                new Date(message.timestamp).toDateString() !==
                  new Date(messages[index - 1].timestamp).toDateString() ? (
                  <Divider sx={{ my: 2 }}>
                    <Chip
                      label={format(
                        new Date(message.timestamp),
                        "MMMM d, yyyy"
                      )}
                      size="small"
                      sx={{
                        backgroundColor: colors.primary,
                        color: colors.userBubbleText, // White text for better contrast
                        fontSize: "0.8rem", // Increased font size
                        fontWeight: 600,
                        borderRadius: 1,
                        py: 0.5,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Added shadow for depth
                        border: "none",
                      }}
                    />
                  </Divider>
                ) : null}

                <Fade in={true} timeout={500}>
                  <Box
                    sx={{
                      alignSelf:
                        message.sender === "user" ? "flex-end" : "flex-start",
                      maxWidth: "85%",
                      display: "flex",
                      flexDirection:
                        message.sender === "user" ? "row-reverse" : "row",
                      alignItems: "flex-end",
                      gap: 1,
                      mb: 2,
                      mx: 2,
                    }}
                  >
                    {message.sender === "bot" && (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: colors.primary,
                          boxShadow: "0 2px 6px rgba(67, 97, 238, 0.2)",
                        }}
                      >
                        <HotelIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                    )}

                    {message.sender === "user" && (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: colors.secondary,
                          boxShadow: "0 2px 6px rgba(67, 97, 238, 0.2)",
                        }}
                      >
                        <HotelIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                    )}

                    <Box>
                      <Paper
                        elevation={0}
                        sx={{
                          p:
                            message.sender === "user"
                              ? "0.75rem 1rem"
                              : "0.75rem 1rem",
                          borderRadius: "0.75rem",
                          backgroundColor:
                            message.sender === "user"
                              ? colors.primary
                              : colors.botBubble,
                          color:
                            message.sender === "user"
                              ? "#ffffff"
                              : colors.botBubbleText,
                          boxShadow:
                            message.sender === "user"
                              ? "0 2px 8px rgba(67, 97, 238, 0.2)"
                              : "0 2px 8px rgba(0, 0, 0, 0.05)",
                          borderBottomLeftRadius:
                            message.sender === "bot" ? "0.25rem" : undefined,
                          borderBottomRightRadius:
                            message.sender === "user" ? "0.25rem" : undefined,
                          transition: "transform 0.2s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                          },
                          border:
                            message.sender === "bot"
                              ? `1px solid ${colors.divider}`
                              : "none",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            whiteSpace: "pre-wrap",
                            fontWeight: message.sender === "user" ? 500 : 400, // Increased font weight for user messages
                            lineHeight: 1.5,
                            fontSize: "1rem", // Increased font size
                            letterSpacing: "0.01em", // Added letter spacing for better readability
                            textShadow:
                              message.sender === "user"
                                ? "0 1px 1px rgba(0,0,0,0.1)"
                                : "none", // Added text shadow for user messages
                          }}
                        >
                          {message.text}
                        </Typography>
                      </Paper>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 0.5,
                          color: colors.darkGray, // Darker color for better contrast
                          textAlign:
                            message.sender === "user" ? "right" : "left",
                          fontSize: "0.75rem", // Increased font size
                          mx: 0.5,
                          fontWeight: 600, // Increased font weight
                          opacity: 0.8, // Added opacity for subtle appearance
                        }}
                      >
                        {formatTime(message.timestamp)}
                      </Typography>
                    </Box>
                  </Box>
                </Fade>
              </React.Fragment>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <Box
                sx={{
                  alignSelf: "flex-start",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                  mx: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: colors.primary,
                    boxShadow: "0 2px 6px rgba(67, 97, 238, 0.2)",
                  }}
                >
                  <HotelIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: "0.75rem",
                    backgroundColor: colors.botBubble,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    borderBottomLeftRadius: "0.25rem",
                    border: `1px solid ${colors.divider}`,
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: colors.primary,
                      animation: "pulse 1s infinite",
                      animationDelay: "0s",
                      "@keyframes pulse": {
                        "0%": { opacity: 0.4 },
                        "50%": { opacity: 1 },
                        "100%": { opacity: 0.4 },
                      },
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: colors.primary,
                      animation: "pulse 1s infinite",
                      animationDelay: "0.2s",
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: colors.primary,
                      animation: "pulse 1s infinite",
                      animationDelay: "0.4s",
                    }}
                  />
                </Paper>
              </Box>
            )}

            {/* Loading indicator */}
            {isLoadingHistory && (
              <Box
                sx={{
                  alignSelf: "center",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CircularProgress size={24} sx={{ color: colors.primary }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: colors.mediumGray,
                    fontWeight: 500,
                  }}
                >
                  Loading conversation history...
                </Typography>
              </Box>
            )}

            {isLoading && !isTyping && (
              <Box sx={{ alignSelf: "center", p: 1 }}>
                <CircularProgress size={24} sx={{ color: colors.primary }} />
              </Box>
            )}

            {/* Scroll to bottom button */}
            {showScrollToBottom && (
              <Zoom in={showScrollToBottom}>
                <Fab
                  size="small"
                  color="primary"
                  aria-label="scroll to bottom"
                  onClick={scrollToBottom}
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    opacity: 0.8,
                    boxShadow: "0 4px 12px rgba(67, 97, 238, 0.2)",
                    backgroundColor: colors.primary,
                    "&:hover": {
                      opacity: 1,
                      backgroundColor: colors.secondary,
                    },
                  }}
                >
                  <KeyboardArrowDownIcon />
                </Fab>
              </Zoom>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Input area */}
          <ChatbotInput
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            inputRef={inputRef}
            isLoading={isLoading}
            handleKeyPress={handleKeyPress}
          />
        </Paper>
      </Fade>
    </Box>
  );
};

export default Chatbot;
