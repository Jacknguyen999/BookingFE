import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import ApiService from "../../Config/ApiService";
import {
  Box,
  Container,
  Typography,
  CardMedia,
  Button,
  TextField,
  Grid,
  Paper,
  Tabs,
  Tab,
  Rating,
  Divider,
  styled
} from '@mui/material';
import {
  Pool,
  LocalParking,
  Restaurant,
  Kitchen,
  Balcony,
  LocationOn,
  Share,
  FavoriteBorder,
  Person,
  ChildCare
} from '@mui/icons-material';
import "react-datepicker/dist/react-datepicker.css";

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '1200px',
}));

const ImageGallery = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: '4px',
  marginBottom: theme.spacing(3),
  '& .mainImage': {
    height: '400px',
    gridRow: '1 / span 2',
  },
  '& .secondaryImage': {
    height: '198px',
  },
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    '& .mainImage, & .secondaryImage': {
      height: '250px',
    },
  },
}));

const RoomDetailPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalGuests, setTotalGuests] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userId, setUserId] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [adultError, setAdultError] = useState("");
  const [childrenError, setChildrenError] = useState("");

  const { roomType, roomPrice, roomImageUrl, roomDescription, bookings } =
    roomDetails || {};

  const handleConfirmBooking = async () => {
    if (!checkInDate || !checkOutDate) {
      setErrorMessage("Vui lòng chọn ngày nhận và trả phòng");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    if (checkOutDate <= checkInDate) {
      setErrorMessage("Ngày trả phòng phải sau ngày nhận phòng");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    if (!numAdults || numAdults < 1) {
      setAdultError("Cần ít nhất 1 người lớn");
      return;
    } else {
      setAdultError("");
    }

    if (numChildren < 0) {
      setChildrenError("Số trẻ em không được âm");
      return;
    } else {
      setChildrenError("");
    }

    const oneDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);

    const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay));
    const totalGuests = numAdults + numChildren;
    const roomPricePerNight = roomDetails.roomPrice;
    const totalPrice = roomPricePerNight * totalDays;

    setTotalPrice(totalPrice);
    setTotalGuests(totalGuests);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await ApiService.getRoomById(roomId);
        setRoomDetails(response.room);
        const userProfile = await ApiService.getCurrentUser();
        setUserId(userProfile.user.id);
      } catch (e) {
        setError(e.response?.data?.message || e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [roomId]);

  const acceptBooking = async () => {
    try {
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);

      const formattedCheckInDate = new Date(
        startDate.getTime() - startDate.getTimezoneOffset() * 6000
      )
        .toISOString()
        .split("T")[0];
      const formattedCheckOutDate = new Date(
        endDate.getTime() - startDate.getTimezoneOffset() * 6000
      )
        .toISOString()
        .split("T")[0];

      const booking = {
        checkInDate: formattedCheckInDate,
        checkOutDate: formattedCheckOutDate,
        numOfAdults: numAdults,
        numOfChildren: numChildren,
      };

      const response = await ApiService.bookRoom(roomId, userId, booking);
      if (response.statusCode === 200) {
        setConfirmationCode(response.bookingConfirmationCode);
        setShowMessage(true);

        setTimeout(() => {
          setShowMessage(false);
          navigate("/profile");
        }, 5000);
      }
    } catch (e) {
      setErrorMessage(e.response?.data?.message || e.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  // Hàm xử lý thay đổi ngày check-in
  const handleCheckInChange = (date) => {
    setCheckInDate(date);
    // Nếu ngày check-out hiện tại nhỏ hơn hoặc bằng ngày check-in mới, reset check-out
    if (date && checkOutDate && checkOutDate <= date) {
      setCheckOutDate(null);
      setErrorMessage("Vui lòng chọn lại ngày trả phòng");
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  // Hàm xử lý thay đổi ngày check-out
  const handleCheckOutChange = (date) => {
    if (date && checkInDate && date <= checkInDate) {
      setErrorMessage("Ngày trả phòng phải sau ngày nhận phòng");
      setTimeout(() => setErrorMessage(""), 5000);
      setCheckOutDate(null);
    } else {
      setCheckOutDate(date);
    }
  };

  // Hàm xử lý thay đổi số lượng người lớn
  const handleAdultsChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setNumAdults("");
      setAdultError("Vui lòng nhập số người lớn");
    } else {
      const num = Number(value);
      if (num < 1) {
        setAdultError("Cần ít nhất 1 người lớn");
      } else if (num > 10) {
        setAdultError("Tối đa 10 người lớn");
      } else {
        setAdultError("");
      }
      setNumAdults(num);
    }
  };

  // Hàm xử lý thay đổi số lượng trẻ em
  const handleChildrenChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setNumChildren("");
      setChildrenError("Vui lòng nhập số trẻ em");
    } else {
      const num = Number(value);
      if (num < 0) {
        setChildrenError("Số trẻ em không được âm");
      } else if (num > 6) {
        setChildrenError("Tối đa 6 trẻ em");
      } else {
        setChildrenError("");
      }
      setNumChildren(num);
    }
  };

  if (isLoading) {
    return <p className="loading">Đang tải thông tin phòng...</p>;
  }
  if (error) {
    return <p className="error">{error}</p>;
  }
  if (!roomDetails) {
    return <p className="error">Không tìm thấy phòng.</p>;
  }

  return (
    <>
      <StyledContainer>
        {/* Header Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Rating value={4.5} readOnly precision={0.5} />
              <Typography variant="body2" color="text.secondary">
                (9,003 reviews)
              </Typography>
            </Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {roomType}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <LocationOn color="primary" fontSize="small" />
              <Typography variant="body2">
                280 Nam Ky Khoi Nghia, District 3, Ho Chi Minh City
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={2}>
            <Button startIcon={<Share />}>Share</Button>
            <Button startIcon={<FavoriteBorder />}>Save</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              Reserve
            </Button>
          </Box>
        </Box>

        {/* Image Gallery */}
        <ImageGallery>
          <CardMedia
            component="img"
            image={roomImageUrl}
            alt={roomType}
            className="mainImage"
            sx={{ borderRadius: 1 }}
          />
          {bookings?.slice(0, 2).map((_, index) => (
            <CardMedia
              key={index}
              component="img"
              image={roomImageUrl}
              alt={`Room view ${index + 2}`}
              className="secondaryImage"
              sx={{ borderRadius: 1 }}
            />
          ))}
        </ImageGallery>

        {/* Navigation Tabs */}
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab label="Overview" />
          <Tab label="Amenities" />
          <Tab label="Reviews" />
          <Tab label="Location" />
        </Tabs>

        {/* Content based on selected tab */}
        {tabValue === 0 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>Property Highlights</Typography>
              <Grid container spacing={3}>
                {[
                  { icon: <Pool />, title: 'Swimming pool', desc: 'Infinity pool on rooftop' },
                  { icon: <LocalParking />, title: 'Parking', desc: 'Free private parking' },
                  { icon: <Restaurant />, title: 'Breakfast', desc: 'Excellent breakfast available' },
                  { icon: <Kitchen />, title: 'Kitchen', desc: 'Fully equipped kitchen' },
                  { icon: <Balcony />, title: 'Views', desc: 'City view from balcony' },
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box display="flex" gap={2}>
                      {item.icon}
                      <Box>
                        <Typography variant="subtitle1">{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.desc}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Typography variant="body1" sx={{ mt: 4 }}>
                {roomDescription}
              </Typography>
            </Grid>

            {/* Booking Card */}
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                  ${roomPrice} <Typography component="span" variant="body2">per night</Typography>
                </Typography>

                <Box my={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <DatePicker
                        selected={checkInDate}
                        onChange={handleCheckInChange}
                        minDate={new Date()} // Không cho chọn ngày quá khứ
                        customInput={
                          <TextField
                            fullWidth
                            label="Nhận phòng"
                            size="small"
                            error={checkInDate && checkOutDate && checkOutDate <= checkInDate}
                            helperText={
                              checkInDate && checkOutDate && checkOutDate <= checkInDate
                                ? "Ngày nhận phòng không hợp lệ"
                                : ""
                            }
                          />
                        }
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Chọn ngày nhận phòng"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <DatePicker
                        selected={checkOutDate}
                        onChange={handleCheckOutChange}
                        minDate={checkInDate ? new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000) : null} // Phải sau check-in ít nhất 1 ngày
                        customInput={
                          <TextField
                            fullWidth
                            label="Trả phòng"
                            size="small"
                            error={checkInDate && checkOutDate && checkOutDate <= checkInDate}
                            helperText={
                              checkInDate && checkOutDate && checkOutDate <= checkInDate
                                ? "Ngày trả phòng phải sau ngày nhận phòng"
                                : ""
                            }
                          />
                        }
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Chọn ngày trả phòng"
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Người lớn"
                      type="number"
                      value={numAdults}
                      onChange={handleAdultsChange}
                      size="small"
                      error={!!adultError}
                      helperText={adultError || "Tuổi 13+"}
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                      inputProps={{
                        min: 1,
                        max: 10,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Trẻ em"
                      type="number"
                      value={numChildren}
                      onChange={handleChildrenChange}
                      size="small"
                      error={!!childrenError}
                      helperText={childrenError || "Tuổi 0-12"}
                      InputProps={{
                        startAdornment: <ChildCare sx={{ mr: 1, color: 'text.secondary' }} />,
                      }}
                      inputProps={{
                        min: 0,
                        max: 6,
                      }}
                    />
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleConfirmBooking}
                >
                  Đặt phòng
                </Button>

                {totalPrice > 0 && (
                  <Box mt={2}>
                    <Divider sx={{ my: 2 }} />
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography>Tổng giá</Typography>
                      <Typography variant="h6">${totalPrice}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Bao gồm thuế và phí
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      color="success"
                      onClick={acceptBooking}
                      sx={{ mt: 2 }}
                    >
                      Xác nhận đặt phòng
                    </Button>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
      </StyledContainer>
    </>
  );
};

export default RoomDetailPage;