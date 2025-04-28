import React from 'react';
import { Box, Paper, Typography, Avatar, Fade } from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';
import PersonIcon from '@mui/icons-material/Person';
import { format } from 'date-fns';
import chatbotTheme from '../../../styles/chatbotTheme';

const ChatbotMessage = ({ message, isLastMessage }) => {
  const theme = chatbotTheme;
  const isUser = message.sender === 'user';
  
  // Format timestamp
  const formatTime = (date) => {
    return format(new Date(date), 'h:mm a');
  };
  
  return (
    <Fade in={true} timeout={500}>
      <Box
        sx={{
          alignSelf: isUser ? 'flex-end' : 'flex-start',
          maxWidth: theme.components.messageBubble.maxWidth,
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-end',
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
              borderBottomLeftRadius: !isUser ? theme.borders.radius.sm : undefined,
              borderBottomRightRadius: isUser ? theme.borders.radius.sm : undefined,
              transition: `transform ${theme.animations.durations.normal} ${theme.animations.easings.easeInOut}`,
              '&:hover': {
                transform: 'translateY(-2px)',
              },
              border: !isUser
                ? `1px solid ${theme.colors.bubbles.bot.border}`
                : 'none',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'pre-wrap',
                fontWeight: theme.typography.fontWeight.regular,
                lineHeight: theme.typography.lineHeight.relaxed,
                fontSize: theme.typography.fontSize.sm,
              }}
            >
              {message.text}
            </Typography>
          </Paper>
          
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: theme.spacing.xs,
              color: theme.colors.neutral.medium,
              textAlign: isUser ? 'right' : 'left',
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
