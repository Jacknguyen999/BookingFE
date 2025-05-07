// Chatbot Design System
// This file contains the design tokens and theme for the chatbot component

const chatbotTheme = {
  // Color Palette
  colors: {
    // Primary colors
    primary: {
      main: "#2563eb", // Royal blue - primary brand color
      light: "#3b82f6", // Lighter blue for hover states
      dark: "#1d4ed8", // Darker blue for active states
      contrast: "#ffffff", // White text on primary backgrounds
    },

    // Secondary colors
    secondary: {
      main: "#0ea5e9", // Sky blue - secondary brand color
      light: "#38bdf8", // Lighter sky blue
      dark: "#0284c7", // Darker sky blue
      contrast: "#ffffff", // White text on secondary backgrounds
    },

    // Accent colors
    accent: {
      success: "#10b981", // Green for success states
      warning: "#f59e0b", // Amber for warning states
      error: "#ef4444", // Red for error states
      info: "#6366f1", // Indigo for info states
    },

    // Neutral colors
    neutral: {
      white: "#ffffff",
      lightest: "#f8fafc", // Almost white background
      lighter: "#f1f5f9", // Light gray for backgrounds
      light: "#e2e8f0", // Light gray for borders
      medium: "#94a3b8", // Medium gray for secondary text
      dark: "#334155", // Dark gray for primary text
      darker: "#1e293b", // Very dark gray for headings
      darkest: "#0f172a", // Almost black
    },

    // Message bubbles
    bubbles: {
      user: {
        background: "#2563eb",
        text: "#ffffff", // White text for better contrast on blue background
      },
      bot: {
        background: "#ffffff",
        text: "#1e293b", // Dark gray text for better readability on white background
        border: "#dcdfe3",
      },
    },

    // Functional colors
    functional: {
      overlay: "rgba(15, 23, 42, 0.3)",
      shadow: "rgba(15, 23, 42, 0.1)",
      backdrop: "rgba(255, 255, 255, 0.8)",
    },
  },

  // Typography
  typography: {
    fontFamily: {
      primary: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
      monospace: '"SF Mono", "Consolas", "Monaco", monospace',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Spacing
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "2.5rem", // 40px
    "3xl": "3rem", // 48px
  },

  // Borders
  borders: {
    radius: {
      sm: "0.375rem", // 6px
      md: "0.5rem", // 8px
      lg: "0.75rem", // 12px
      xl: "1rem", // 16px
      "2xl": "1.5rem", // 24px
      full: "9999px", // Fully rounded
    },
    width: {
      thin: "1px",
      medium: "2px",
      thick: "3px",
    },
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px rgba(15, 23, 42, 0.05)",
    md: "0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -1px rgba(15, 23, 42, 0.06)",
    lg: "0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)",
    xl: "0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04)",
    "2xl": "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(15, 23, 42, 0.06)",
  },

  // Animations
  animations: {
    durations: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    easings: {
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeOut: "cubic-bezier(0, 0, 0.2, 1)",
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    },
  },

  // Z-index
  zIndex: {
    chatbot: 1000,
    modal: 1050,
    tooltip: 1100,
  },

  // Component-specific styles
  components: {
    chatButton: {
      size: "3.5rem",
      iconSize: "1.5rem",
    },
    chatWindow: {
      width: {
        mobile: "calc(100vw - 32px)",
        desktop: "380px",
      },
      height: {
        mobile: "calc(100vh - 100px)",
        desktop: "600px",
      },
    },
    inputField: {
      height: "2.5rem",
      maxHeight: "6rem",
    },
    messageBubble: {
      maxWidth: "85%",
      padding: {
        text: "0.75rem 1rem",
        media: "0.5rem",
      },
    },
    suggestionChip: {
      height: "2rem",
      padding: "0 0.75rem",
    },
  },
};

export default chatbotTheme;
