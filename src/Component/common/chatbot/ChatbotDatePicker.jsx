import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button,
  IconButton,
} from '@mui/material';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { format } from 'date-fns';
import chatbotTheme from '../../../styles/chatbotTheme';

const ChatbotDatePicker = ({ onSelect, onClose }) => {
  const theme = chatbotTheme;
  
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      key: 'selection',
    },
  ]);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const handleConfirm = () => {
    const { startDate, endDate } = dateRange[0];
    onSelect({
      startDate,
      endDate,
      formattedStartDate: format(startDate, 'MMM dd, yyyy'),
      formattedEndDate: format(endDate, 'MMM dd, yyyy'),
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: theme.borders.radius.lg,
        overflow: 'hidden',
        width: '100%',
        maxWidth: '350px',
        alignSelf: 'center',
        mb: theme.spacing.md,
        boxShadow: theme.shadows.lg,
        border: `1px solid ${theme.colors.neutral.light}`,
      }}
    >
      <Box
        sx={{
          p: theme.spacing.sm,
          backgroundColor: theme.colors.primary.main,
          color: theme.colors.neutral.white,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: theme.typography.fontWeight.semibold,
            fontSize: theme.typography.fontSize.base,
          }}
        >
          Select Check-in & Check-out Dates
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: theme.colors.neutral.white }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box
        sx={{
          '.rdrCalendarWrapper': {
            fontSize: '14px',
            width: '100%',
          },
          '.rdrDateDisplayItem': {
            borderRadius: theme.borders.radius.md,
            boxShadow: 'none',
            border: `1px solid ${theme.colors.neutral.light}`,
          },
          '.rdrDateDisplayItemActive': {
            borderColor: theme.colors.primary.main,
          },
          '.rdrDayToday .rdrDayNumber span:after': {
            backgroundColor: theme.colors.primary.main,
          },
          '.rdrMonthAndYearWrapper': {
            paddingTop: theme.spacing.sm,
          },
          '.rdrDay:not(.rdrDayPassive) .rdrInRange ~ .rdrDayNumber span, .rdrDay:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span, .rdrDay:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span, .rdrDay:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span': {
            color: theme.colors.neutral.white,
          },
          '.rdrDayStartPreview, .rdrDayInPreview, .rdrDayEndPreview': {
            borderColor: `${theme.colors.primary.light}50`,
          },
          '.rdrDateRangeWrapper .rdrDayHovered .rdrDayNumber:after': {
            backgroundColor: theme.colors.primary.light,
          },
          '.rdrStartEdge, .rdrEndEdge, .rdrInRange': {
            backgroundColor: theme.colors.primary.main,
          },
          '.rdrDayStartPreview, .rdrDayInPreview, .rdrDayEndPreview': {
            borderColor: theme.colors.primary.light,
          },
          '.rdrDayHovered .rdrDayNumber:after': {
            backgroundColor: theme.colors.primary.light,
          },
          '.rdrMonthName': {
            fontWeight: theme.typography.fontWeight.semibold,
            fontSize: theme.typography.fontSize.sm,
          },
        }}
      >
        <DateRange
          editableDateInputs={true}
          onChange={handleSelect}
          moveRangeOnFirstSelection={false}
          ranges={dateRange}
          months={1}
          direction="vertical"
          rangeColors={[theme.colors.primary.main]}
          minDate={new Date()}
        />
      </Box>

      <Box
        sx={{
          p: theme.spacing.md,
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: `1px solid ${theme.colors.neutral.light}`,
        }}
      >
        <Typography variant="body2" sx={{ color: theme.colors.neutral.dark }}>
          {dateRange[0].startDate && dateRange[0].endDate
            ? `${format(dateRange[0].startDate, 'MMM dd')} - ${format(
                dateRange[0].endDate,
                'MMM dd, yyyy'
              )}`
            : 'Select dates'}
        </Typography>
        <Button
          variant="contained"
          onClick={handleConfirm}
          startIcon={<CheckIcon />}
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
          Confirm
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatbotDatePicker;
