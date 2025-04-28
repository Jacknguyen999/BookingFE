import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import chatbotTheme from '../../../styles/chatbotTheme';

const ChatbotSuggestions = ({ suggestions, onSuggestionClick }) => {
  const theme = chatbotTheme;
  
  return (
    <Box
      sx={{
        p: theme.spacing.md,
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        backgroundColor: theme.colors.neutral.lighter,
        borderBottom: `1px solid ${theme.colors.neutral.light}`,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          width: '100%',
          mb: theme.spacing.xs,
          color: theme.colors.neutral.dark,
          fontWeight: theme.typography.fontWeight.semibold,
          fontSize: theme.typography.fontSize.xs,
        }}
      >
        Suggested questions:
      </Typography>
      
      {suggestions.map((suggestion, index) => (
        <Chip
          key={index}
          icon={suggestion.icon}
          label={suggestion.text}
          onClick={() => onSuggestionClick(suggestion.text)}
          variant="filled"
          size="small"
          sx={{
            borderRadius: theme.borders.radius.md,
            transition: `all ${theme.animations.durations.normal} ${theme.animations.easings.easeInOut}`,
            backgroundColor: theme.colors.neutral.white,
            border: `1px solid ${theme.colors.neutral.light}`,
            color: theme.colors.neutral.dark,
            fontWeight: theme.typography.fontWeight.medium,
            '& .MuiChip-icon': {
              color: theme.colors.primary.main,
            },
            '&:hover': {
              backgroundColor: theme.colors.primary.main,
              color: theme.colors.neutral.white,
              borderColor: 'transparent',
              '& .MuiChip-icon': {
                color: theme.colors.neutral.white,
              },
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows.sm,
            },
            height: theme.components.suggestionChip.height,
          }}
        />
      ))}
    </Box>
  );
};

export default ChatbotSuggestions;
