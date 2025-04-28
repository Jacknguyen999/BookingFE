import React from "react";
import { Fab, Badge, Zoom, Tooltip } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import chatbotTheme from "../../../styles/chatbotTheme";

const ChatbotButton = ({ isOpen, unreadCount, onClick }) => {
  const theme = chatbotTheme;

  return (
    <Zoom in={true}>
      <Badge
        badgeContent={unreadCount}
        color="error"
        overlap="circular"
        invisible={unreadCount === 0}
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: theme.colors.accent.error,
            color: theme.colors.neutral.white,
            fontWeight: theme.typography.fontWeight.bold,
            boxShadow: `0 0 0 2px ${theme.colors.neutral.white}`,
            fontSize: "0.85rem", // Increased font size
            minWidth: "22px", // Increased badge size
            height: "22px",
            padding: "0 6px",
            zIndex: theme.zIndex.tooltip, // Ensure badge appears above chat modal
          },
        }}
      >
        <Tooltip title={isOpen ? "Close chat" : "Open chat"}>
          <Fab
            onClick={onClick}
            aria-label={isOpen ? "Close chat" : "Open chat"}
            sx={{
              width: theme.components.chatButton.size,
              height: theme.components.chatButton.size,
              backgroundColor: isOpen
                ? theme.colors.neutral.white
                : theme.colors.primary.main,
              color: isOpen
                ? theme.colors.primary.main
                : theme.colors.primary.contrast,
              boxShadow: theme.shadows.lg,
              "&:hover": {
                backgroundColor: isOpen
                  ? theme.colors.neutral.lightest
                  : theme.colors.primary.light,
                transform: "translateY(-2px)",
                boxShadow: theme.shadows.xl,
              },
              transition: `all ${theme.animations.durations.normal} ${theme.animations.easings.easeInOut}`,
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            {isOpen ? (
              <CloseIcon
                sx={{
                  fontSize: theme.components.chatButton.iconSize,
                  transition: `transform ${theme.animations.durations.normal} ${theme.animations.easings.easeInOut}`,
                  "&:hover": {
                    transform: "rotate(90deg)",
                  },
                }}
              />
            ) : (
              <ChatIcon
                sx={{
                  fontSize: theme.components.chatButton.iconSize,
                }}
              />
            )}
          </Fab>
        </Tooltip>
      </Badge>
    </Zoom>
  );
};

export default ChatbotButton;
