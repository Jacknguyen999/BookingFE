import React from "react";
import { Box, Paper, Typography, Avatar, Fade } from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import PersonIcon from "@mui/icons-material/Person";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import chatbotTheme from "../../../styles/chatbotTheme";

const ChatbotMessage = ({ message, isLastMessage }) => {
  const theme = chatbotTheme;
  const isUser = message.sender === "user";

  // Format timestamp
  const formatTime = (date) => {
    return format(new Date(date), "h:mm a");
  };

  return (
    <Fade in={true} timeout={500}>
      <Box
        sx={{
          alignSelf: isUser ? "flex-end" : "flex-start",
          maxWidth: theme.components.messageBubble.maxWidth,
          display: "flex",
          flexDirection: isUser ? "row-reverse" : "row",
          alignItems: "flex-end",
          gap: theme.spacing.sm,
          mb: theme.spacing.md,
        }}
      >
        {!isUser && (
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: theme.colors.primary.main,
              boxShadow: `0 2px 6px ${theme.colors.functional.shadow}`,
            }}
          >
            <HotelIcon sx={{ fontSize: 18 }} />
          </Avatar>
        )}

        {isUser && (
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: theme.colors.secondary.main,
              boxShadow: `0 2px 6px ${theme.colors.functional.shadow}`,
            }}
          >
            <PersonIcon sx={{ fontSize: 18 }} />
          </Avatar>
        )}

        <Box>
          <Paper
            elevation={0}
            sx={{
              p: theme.components.messageBubble.padding.text,
              borderRadius: theme.borders.radius.lg,
              backgroundColor: isUser
                ? theme.colors.bubbles.user.background
                : theme.colors.bubbles.bot.background,
              color: isUser
                ? theme.colors.bubbles.user.text
                : theme.colors.bubbles.bot.text,
              boxShadow: isUser
                ? `0 2px 12px ${theme.colors.functional.shadow}`
                : theme.shadows.sm,
              borderBottomLeftRadius: !isUser
                ? theme.borders.radius.sm
                : undefined,
              borderBottomRightRadius: isUser
                ? theme.borders.radius.sm
                : undefined,
              transition: `transform ${theme.animations.durations.normal} ${theme.animations.easings.easeInOut}`,
              "&:hover": {
                transform: "translateY(-2px)",
              },
              border: !isUser
                ? `1px solid ${theme.colors.bubbles.bot.border}`
                : "none",
            }}
          >
            {isUser ? (
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-wrap",
                  fontWeight: theme.typography.fontWeight.regular,
                  lineHeight: theme.typography.lineHeight.relaxed,
                  fontSize: theme.typography.fontSize.sm,
                }}
              >
                {message.text}
              </Typography>
            ) : (
              <Box
                sx={{
                  fontWeight: theme.typography.fontWeight.regular,
                  lineHeight: theme.typography.lineHeight.relaxed,
                  fontSize: theme.typography.fontSize.sm,
                  "& p": { margin: "0.5em 0" },
                  "& p:first-of-type": { marginTop: 0 },
                  "& p:last-of-type": { marginBottom: 0 },
                  "& h1, & h2, & h3, & h4, & h5, & h6": {
                    margin: "0.5em 0",
                    fontWeight: theme.typography.fontWeight.bold,
                    lineHeight: 1.2,
                  },
                  "& h1": { fontSize: "1.5em" },
                  "& h2": { fontSize: "1.3em" },
                  "& h3": { fontSize: "1.2em" },
                  "& h4, & h5, & h6": { fontSize: "1.1em" },
                  "& ul, & ol": {
                    paddingLeft: "1.5em",
                    margin: "0.5em 0",
                  },
                  "& li": { margin: "0.25em 0" },
                  "& a": {
                    color: theme.colors.primary.main,
                    textDecoration: "underline",
                  },
                  "& code": {
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    padding: "0.1em 0.3em",
                    borderRadius: "0.2em",
                    fontFamily: "monospace",
                  },
                  "& pre": {
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    padding: "0.5em",
                    borderRadius: "0.3em",
                    overflow: "auto",
                    margin: "0.5em 0",
                  },
                  "& pre code": {
                    backgroundColor: "transparent",
                    padding: 0,
                  },
                  "& blockquote": {
                    borderLeft: `3px solid ${theme.colors.neutral.light}`,
                    paddingLeft: "0.5em",
                    margin: "0.5em 0",
                    color: theme.colors.neutral.dark,
                  },
                  "& hr": {
                    border: 0,
                    borderTop: `1px solid ${theme.colors.neutral.light}`,
                    margin: "0.5em 0",
                  },
                  "& table": {
                    borderCollapse: "collapse",
                    width: "100%",
                    margin: "0.5em 0",
                  },
                  "& th, & td": {
                    border: `1px solid ${theme.colors.neutral.light}`,
                    padding: "0.3em 0.5em",
                    textAlign: "left",
                  },
                  "& th": {
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    fontWeight: theme.typography.fontWeight.semibold,
                  },
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.text}
                </ReactMarkdown>
              </Box>
            )}
          </Paper>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: theme.spacing.xs,
              color: theme.colors.neutral.medium,
              textAlign: isUser ? "right" : "left",
              fontSize: theme.typography.fontSize.xs,
              mx: theme.spacing.xs,
              fontWeight: theme.typography.fontWeight.medium,
            }}
          >
            {formatTime(message.timestamp)}
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default ChatbotMessage;
