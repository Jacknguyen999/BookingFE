import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Rating,
} from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import TvIcon from '@mui/icons-material/Tv';
import chatbotTheme from '../../../styles/chatbotTheme';

const ChatbotRoomCard = ({ room, onSelect }) => {
  const theme = chatbotTheme;
  
  // Helper function to render amenity icons
  const renderAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <WifiIcon fontSize="small" />;
      case 'breakfast':
        return <LocalCafeIcon fontSize="small" />;
      case 'air conditioning':
        return <AcUnitIcon fontSize="small" />;
      case 'tv':
        return <TvIcon fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: theme.borders.radius.lg,
        overflow: 'hidden',
        width: '100%',
        maxWidth: '350px',
        alignSelf: 'flex-start',
        mb: theme.spacing.md,
        transition: `all ${theme.animations.durations.normal} ${theme.animations.easings.easeInOut}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows.lg,
        },
        border: `1px solid ${theme.colors.neutral.light}`,
      }}
    >
      <Box
        sx={{
          height: '140px',
          backgroundImage: `url(${room.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        {room.discount && (
          <Chip
            label={`${room.discount}% OFF`}
            size="small"
            sx={{
              position: 'absolute',
              top: theme.spacing.sm,
              right: theme.spacing.sm,
              backgroundColor: theme.colors.accent.error,
              color: theme.colors.neutral.white,
              fontWeight: theme.typography.fontWeight.bold,
            }}
          />
        )}
      </Box>

      <Box sx={{ p: theme.spacing.md }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: theme.typography.fontWeight.bold,
            fontSize: theme.typography.fontSize.lg,
            mb: theme.spacing.xs,
          }}
        >
          {room.name}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: theme.spacing.sm,
          }}
        >
          <Rating
            value={room.rating}
            precision={0.5}
            readOnly
            size="small"
            sx={{
              color: theme.colors.accent.warning,
              mr: theme.spacing.sm,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: theme.colors.neutral.medium,
              fontSize: theme.typography.fontSize.xs,
            }}
          >
            {room.reviews} reviews
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: theme.colors.neutral.dark,
            mb: theme.spacing.md,
            fontSize: theme.typography.fontSize.sm,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {room.description}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: theme.spacing.xs,
            mb: theme.spacing.md,
          }}
        >
          {room.amenities.map((amenity, index) => (
            <Chip
              key={index}
              icon={renderAmenityIcon(amenity)}
              label={amenity}
              size="small"
              variant="outlined"
              sx={{
                borderRadius: theme.borders.radius.md,
                borderColor: theme.colors.neutral.light,
                color: theme.colors.neutral.dark,
                '& .MuiChip-icon': {
                  color: theme.colors.primary.main,
                },
              }}
            />
          ))}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: theme.spacing.sm,
            borderTop: `1px solid ${theme.colors.neutral.light}`,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: theme.typography.fontWeight.bold,
                color: theme.colors.primary.main,
                fontSize: theme.typography.fontSize.lg,
              }}
            >
              ${room.price}
              <Typography
                component="span"
                sx={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.neutral.medium,
                  fontWeight: theme.typography.fontWeight.regular,
                }}
              >
                /night
              </Typography>
            </Typography>
            {room.originalPrice && (
              <Typography
                variant="body2"
                sx={{
                  textDecoration: 'line-through',
                  color: theme.colors.neutral.medium,
                  fontSize: theme.typography.fontSize.xs,
                }}
              >
                ${room.originalPrice}/night
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            onClick={() => onSelect(room)}
            sx={{
              backgroundColor: theme.colors.primary.main,
              color: theme.colors.neutral.white,
              '&:hover': {
                backgroundColor: theme.colors.primary.dark,
              },
              textTransform: 'none',
              fontWeight: theme.typography.fontWeight.medium,
              borderRadius: theme.borders.radius.md,
              boxShadow: 'none',
            }}
          >
            Select
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatbotRoomCard;
