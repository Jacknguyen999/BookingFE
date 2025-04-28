import React from 'react';
import { Box, Paper, Avatar } from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';
import chatbotTheme from '../../../styles/chatbotTheme';

const ChatbotTypingIndicator = () => {
  const theme = chatbotTheme;
  
  return (
    <Box
      sx={{
        alignSelf: 'flex-start',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
        mb: theme.spacing.md,
      }}
    >
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
      
      <Paper
        elevation={0}
        sx={{
          p: theme.spacing.md,
          borderRadius: theme.borders.radius.lg,
          backgroundColor: theme.colors.bubbles.bot.background,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
          borderBottomLeftRadius: theme.borders.radius.sm,
          border: `1px solid ${theme.colors.bubbles.bot.border}`,
          boxShadow: theme.shadows.sm,
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: theme.colors.primary.main,
            animation: 'pulse 1s infinite',
            animationDelay: '0s',
            '@keyframes pulse': {
              '0%': { opacity: 0.4 },
              '50%': { opacity: 1 },
              '100%': { opacity: 0.4 },
            },
          }}
        />
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: theme.colors.primary.main,
            animation: 'pulse 1s infinite',
            animationDelay: '0.2s',
          }}
        />
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: theme.colors.primary.main,
            animation: 'pulse 1s infinite',
            animationDelay: '0.4s',
          }}
        />
      </Paper>
    </Box>
  );
};

export default ChatbotTypingIndicator;
