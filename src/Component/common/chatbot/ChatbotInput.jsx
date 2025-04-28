import React from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import chatbotTheme from '../../../styles/chatbotTheme';

const ChatbotInput = ({ 
  message, 
  setMessage, 
  handleSendMessage, 
  inputRef, 
  isLoading,
  handleKeyPress 
}) => {
  const theme = chatbotTheme;
  
  return (
    <Box
      component="form"
      onSubmit={handleSendMessage}
      sx={{
        p: theme.spacing.md,
        borderTop: `1px solid ${theme.colors.neutral.light}`,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: theme.colors.neutral.white,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.03)',
      }}
    >
      <Tooltip title="Attach files (coming soon)">
        <IconButton
          size="small"
          sx={{
            mr: theme.spacing.sm,
            color: theme.colors.neutral.medium,
            transition: `color ${theme.animations.durations.normal} ${theme.animations.easings.easeInOut}`,
            '&:hover': {
              color: theme.colors.primary.main,
            },
          }}
          disabled={isLoading}
        >
          <AttachFileIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <TextField
        fullWidth
        size="small"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        variant="outlined"
        inputRef={inputRef}
        multiline
        maxRows={3}
        disabled={isLoading}
        sx={{
          mr: theme.spacing.sm,
          '& .MuiOutlinedInput-root': {
            borderRadius: theme.borders.radius.lg,
            backgroundColor: theme.colors.neutral.lighter,
            transition: `all ${theme.animations.durations.normal} ${theme.animations.easings.easeInOut}`,
            border: 'none',
            '&:hover, &.Mui-focused': {
              boxShadow: `0 0 0 2px ${theme.colors.primary.light}20`,
              backgroundColor: theme.colors.neutral.white,
            },
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: 'transparent',
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.colors.primary.main,
            },
          },
          '& .MuiInputBase-input': {
            color: theme.colors.neutral.dark,
            fontSize: theme.typography.fontSize.sm,
            '&::placeholder': {
              color: theme.colors.neutral.medium,
              opacity: 0.8,
            },
          },
        }}
        InputProps={{
          endAdornment: (
            <Tooltip title="Add emoji (coming soon)">
              <IconButton
                size="small"
                edge="end"
                sx={{
                  color: theme.colors.neutral.medium,
                  transition: `color ${theme.animations.durations.normal} ${theme.animations.easings.easeInOut}`,
                  '&:hover': {
                    color: theme.colors.primary.main,
                  },
                }}
                disabled={isLoading}
              >
                <EmojiEmotionsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ),
        }}
      />
      
      <IconButton
        color="primary"
        type="submit"
        disabled={isLoading || !message.trim()}
        sx={{
          backgroundColor: theme.colors.primary.main,
          color: theme.colors.neutral.white,
          '&:hover': {
            backgroundColor: theme.colors.primary.dark,
            transform: 'scale(1.05)',
          },
          '&.Mui-disabled': {
            backgroundColor: 'rgba(0,0,0,0.12)',
            color: 'rgba(0,0,0,0.26)',
          },
          transition: `all ${theme.animations.durations.normal} ${theme.animations.easings.easeInOut}`,
          boxShadow: theme.shadows.md,
          width: 40,
          height: 40,
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default ChatbotInput;
