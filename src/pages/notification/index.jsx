// NotfiPage.js
import { Box, Typography, Paper } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from 'react';
import Navbar from "../../pages/navbar";
import io from 'socket.io-client';
import { setNotifications } from "../../state";

const NotfiPage = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:4001'); 
    socket.on("notification", (data) => {
      dispatch(setNotifications([...notifications, data.message]));
    });

    socket.on("connect_error", (error) => {
      setError(error.message);
    });
    
    return () => {
      socket.disconnect();
    };
  }, [notifications]);

  return (
    <Box>
      <Navbar />
      <Box p={2}>
        <Typography variant="h2" gutterBottom>Notifications</Typography>
        {error && (
          <Paper elevation={3} sx={{ padding: '10px', marginBottom: '10px', backgroundColor: '#FFEBEE', color: '#D32F2F' }}>
            {error}
          </Paper>
        )}
        {notifications.length === 0 ? (
          <Typography>No notifications</Typography>
        ) : (
          notifications.map((notification, index) => (
            <Paper key={index} elevation={3} sx={{ padding: '10px', marginBottom: '10px', backgroundColor: '#E0F7FA' }}>
              <Typography>{notification}</Typography>
            </Paper>
          ))
        )}
      </Box>
    </Box>
  );
};

export default NotfiPage;
