import React, { useRef, useEffect } from 'react';
import { Box, CircularProgress, Typography, Divider, Chip, Fab } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { format } from 'date-fns';
import ChatbotMessage from './ChatbotMessage';
import ChatbotTypingIndicator from './ChatbotTypingIndicator';
import chatbotTheme from '../../../styles/chatbotTheme';

const ChatbotMessages = ({ 
  messages, 
  isTyping, 
  isLoading, 
  isLoadingHistory,
  showScrollToBottom,
  scrollToBottom
}) => {
  const theme = chatbotTheme;
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (!showScrollToBottom) {
      scrollToBottom();
    }
  }, [messages, isTyping, showScrollToBottom, scrollToBottom]);
  
  // Group messages by date
  const messagesByDate = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
  
  return (
    <Box
      sx={{
        p: theme.spacing.md,
        flexGrow: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.md,
        backgroundColor: theme.colors.neutral.lightest,
        position: 'relative',
        scrollBehavior: 'smooth',
      }}
    >
      {isLoadingHistory && (
        <Box
          sx={{
            alignSelf: 'center',
            p: theme.spacing.md,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: theme.spacing.sm,
          }}
        >
          <CircularProgress size={24} sx={{ color: theme.colors.primary.main }} />
          <Typography
            variant="caption"
            sx={{
              color: theme.colors.neutral.medium,
              fontWeight: theme.typography.fontWeight.medium,
            }}
          >
            Loading conversation history...
          </Typography>
        </Box>
      )}

      {/* Messages grouped by date */}
      {Object.entries(messagesByDate).map(([date, dateMessages], dateIndex) => (
        <React.Fragment key={date}>
          <Divider sx={{ my: theme.spacing.sm }}>
            <Chip
              label={format(new Date(date), 'MMMM d, yyyy')}
              size="small"
              sx={{
                backgroundColor: theme.colors.neutral.lighter,
                color: theme.colors.neutral.dark,
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.semibold,
                borderRadius: theme.borders.radius.sm,
                py: theme.spacing.xs,
              }}
            />
          </Divider>
          
          {dateMessages.map((message, messageIndex) => (
            <ChatbotMessage
              key={`${date}-${messageIndex}`}
              message={message}
              isLastMessage={
                dateIndex === Object.keys(messagesByDate).length - 1 &&
                messageIndex === dateMessages.length - 1
              }
            />
          ))}
        </React.Fragment>
      ))}

      {/* Typing indicator */}
      {isTyping && <ChatbotTypingIndicator />}

      {/* Loading indicator */}
      {isLoading && !isTyping && (
        <Box sx={{ alignSelf: 'center', p: theme.spacing.sm }}>
          <CircularProgress size={24} sx={{ color: theme.colors.primary.main }} />
        </Box>
      )}

      {/* Scroll to bottom button */}
      {showScrollToBottom && (
        <Fab
          size="small"
          color="primary"
          aria-label="scroll to bottom"
          onClick={scrollToBottom}
          sx={{
            position: 'absolute',
            bottom: theme.spacing.md,
            right: theme.spacing.md,
            opacity: 0.8,
            boxShadow: theme.shadows.md,
            backgroundColor: theme.colors.primary.main,
            '&:hover': {
              opacity: 1,
              backgroundColor: theme.colors.primary.dark,
            },
            zIndex: 10,
          }}
        >
          <KeyboardArrowDownIcon />
        </Fab>
      )}

      <div ref={messagesEndRef} />
    </Box>
  );
};

export default ChatbotMessages;
