import React from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import HistoryIcon from "@mui/icons-material/History";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import chatbotTheme from "../../../styles/chatbotTheme";

const ChatbotHeader = ({
  sessionId,
  onClose,
  onNewConversation,
  onMenuOpen,
  onMenuClose,
  menuAnchorEl,
  isMenuOpen,
}) => {
  const theme = chatbotTheme;

  const handleCopySessionId = () => {
    if (sessionId) {
      navigator.clipboard.writeText(sessionId);
      onMenuClose();
    }
  };

  return (
    <Box
      sx={{
        p: theme.spacing.md,
        background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
        color: theme.colors.neutral.white,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: theme.shadows.md,
        borderTopLeftRadius: theme.borders.radius.lg,
        borderTopRightRadius: theme.borders.radius.lg,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          sx={{
            mr: theme.spacing.md,
            backgroundColor: theme.colors.neutral.white,
            boxShadow: theme.shadows.sm,
            p: theme.spacing.xs,
          }}
        >
          <HotelIcon sx={{ color: theme.colors.primary.main }} />
        </Avatar>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: theme.typography.fontWeight.bold,
              letterSpacing: "0.5px",
              color: theme.colors.neutral.white,
              fontSize: theme.typography.fontSize.xl, // Increased font size
              lineHeight: theme.typography.lineHeight.tight,
              textShadow: "0 1px 3px rgba(0,0,0,0.3)", // Added text shadow for better readability
            }}
          >
            Hotel Assistant
          </Typography>
          <Typography
            variant="caption"
            sx={{
              opacity: 1,
              backgroundColor: "rgba(255,255,255,0.3)", // Increased opacity for better contrast
              px: theme.spacing.sm,
              py: theme.spacing.xs,
              borderRadius: theme.borders.radius.sm,
              fontWeight: theme.typography.fontWeight.semibold, // Increased font weight
              letterSpacing: "0.3px",
              fontSize: theme.typography.fontSize.sm, // Increased font size
              display: "inline-block",
              mt: theme.spacing.xs,
              textShadow: "0 1px 2px rgba(0,0,0,0.2)", // Added text shadow for better readability
            }}
          >
            {sessionId ? (
              <Box
                component="span"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.xs,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: theme.colors.accent.success,
                    display: "inline-block",
                    boxShadow: "0 0 0 2px rgb(0, 150, 40)",
                  }}
                />
                Conversation active
              </Box>
            ) : (
              <Box
                component="span"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.xs,
                  color: theme.colors.neutral.white,
                  fontWeight: theme.typography.fontWeight.bold,
                }}
              >
                <RestartAltIcon sx={{ fontSize: "12px" }} />
                New conversation
              </Box>
            )}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex" }}>
        <Tooltip title="Options">
          <IconButton
            size="small"
            onClick={onMenuOpen}
            sx={{
              color: theme.colors.neutral.white,
              mr: theme.spacing.sm,
              backgroundColor: "rgba(255,255,255,0.15)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.25)",
              },
              transition: `background-color ${theme.animations.durations.normal} ${theme.animations.easings.easeInOut}`,
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Close">
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              color: theme.colors.neutral.white,
              transition: `transform ${theme.animations.durations.normal} ${theme.animations.easings.easeInOut}`,
              "&:hover": {
                transform: "rotate(90deg)",
              },
            }}
            aria-label="Close chat"
          >
            <RestartAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Menu for conversation options */}
        <Menu
          anchorEl={menuAnchorEl}
          open={isMenuOpen}
          onClose={onMenuClose}
          slotProps={{
            paper: {
              elevation: 3,
              sx: {
                minWidth: 200,
                borderRadius: theme.borders.radius.md,
                overflow: "hidden",
                boxShadow: theme.shadows.lg,
                mt: theme.spacing.sm,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={onNewConversation}
            sx={{
              backgroundColor: theme.colors.primary.main,
              color: theme.colors.neutral.white,
              "&:hover": {
                backgroundColor: theme.colors.primary.dark,
              },
              my: theme.spacing.xs,
              borderRadius: theme.borders.radius.sm,
              mx: theme.spacing.xs,
              transition: `background-color ${theme.animations.durations.normal} ${theme.animations.easings.easeInOut}`,
            }}
          >
            <ListItemIcon sx={{ color: theme.colors.neutral.white }}>
              <RestartAltIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="New Conversation"
              primaryTypographyProps={{
                fontWeight: theme.typography.fontWeight.bold,
                fontSize: theme.typography.fontSize.sm,
              }}
            />
          </MenuItem>

          <MenuItem
            sx={{
              my: theme.spacing.xs,
              mx: theme.spacing.xs,
            }}
          >
            <ListItemIcon>
              <InfoOutlinedIcon
                fontSize="small"
                sx={{ color: theme.colors.primary.main }}
              />
            </ListItemIcon>
            <ListItemText
              primary="About Hotel Assistant"
              primaryTypographyProps={{
                fontSize: theme.typography.fontSize.sm,
              }}
            />
          </MenuItem>

          {sessionId && (
            <MenuItem
              onClick={handleCopySessionId}
              sx={{
                borderTop: `1px solid ${theme.colors.neutral.light}`,
                mt: theme.spacing.xs,
                pt: theme.spacing.sm,
                opacity: 0.9,
              }}
            >
              <ListItemIcon>
                <HistoryIcon
                  fontSize="small"
                  sx={{ color: theme.colors.primary.main }}
                />
              </ListItemIcon>
              <ListItemText
                primary={`Session ID: ${sessionId.substring(0, 8)}...`}
                secondary="Click to copy"
                primaryTypographyProps={{
                  variant: "body2",
                  color: theme.colors.primary.main,
                  fontFamily: theme.typography.fontFamily.monospace,
                  fontWeight: theme.typography.fontWeight.bold,
                  style: { wordBreak: "break-all" },
                }}
                secondaryTypographyProps={{
                  color: theme.colors.neutral.medium,
                  fontSize: theme.typography.fontSize.xs,
                }}
              />
            </MenuItem>
          )}
        </Menu>
      </Box>
    </Box>
  );
};

export default ChatbotHeader;
