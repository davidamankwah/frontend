import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, TextField, Typography } from '@mui/material';
import { DeleteOutlined } from "@mui/icons-material";
import Navbar from '../../pages/navbar';
import { setMessages } from '../../state';
import FollowersWidgets from '../widget/FollowersWidgets';

const MessagePage = () => {
  const dispatch = useDispatch();
  const loggedInUserId = useSelector((state) => state.user._id);
  const loggedInUsername = useSelector((state) => state.user.userName);
  const [messageContent, setMessageContent] = useState('');
  const [senderMessages, setSenderMessages] = useState([]);
  const [receiverMessages, setReceiverMessages] = useState([]);
  const [selectedReceiverId, setSelectedReceiverId] = useState(null);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    // Fetch messages sent by the logged-in user (sender)
    const fetchSenderMessages = async () => {
      try {
        const response = await fetch(`https://server-tyt9.onrender.com/messages/sender/${loggedInUserId}`);
        if (response.ok) {
          const senderMessagesData = await response.json();
          setSenderMessages(senderMessagesData);
        } else {
          console.error('Failed to fetch sender messages');
        }
      } catch (error) {
        console.error('Error fetching sender messages:', error);
      }
    };

    // Fetch messages received by the logged-in user (receiver)
    const fetchReceiverMessages = async () => {
      try {
        const response = await fetch(`https://server-tyt9.onrender.com/messages/receiver/${loggedInUserId}`);
        if (response.ok) {
          const receiverMessagesData = await response.json();
          setReceiverMessages(receiverMessagesData);
        } else {
          console.error('Failed to fetch receiver messages');
        }
      } catch (error) {
        console.error('Error fetching receiver messages:', error);
      }
    };

    fetchSenderMessages();
    fetchReceiverMessages();
  }, [loggedInUserId]);

  const sendMessage = async () => {
    try {
      if (!selectedReceiverId) {
        console.error('Please select a receiver');
        return;
      }

      const response = await fetch('https://server-tyt9.onrender.com/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include authorization token
        },
        body: JSON.stringify({
          sender: loggedInUserId,
          receiver: selectedReceiverId,
          content: messageContent,
        }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        dispatch(setMessages([newMessage]));
        setMessageContent('');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`https://server-tyt9.onrender.com/messages/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Filter out the deleted message from the local state
        setSenderMessages(senderMessages.filter(message => message._id !== messageId));
        setReceiverMessages(receiverMessages.filter(message => message._id !== messageId));
      } else {
        console.error('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <Box>
      <Navbar />
      <Box p={2}>
        <Typography variant="h2" gutterBottom>Messages Page</Typography>
        <FollowersWidgets
          userId={loggedInUserId}
          onSelectReceiver={setSelectedReceiverId}
        />
        <Typography variant="h4" gutterBottom>Sent Messages</Typography>
        {senderMessages.map((message) => (
          <Box key={message._id}>
            <Typography>{loggedInUsername}: {message.content}</Typography>
            <DeleteOutlined variant="outlined" onClick={() => deleteMessage(message._id)}  sx={{ color: "red" }}>Delete</DeleteOutlined>
          </Box>
        ))}
        <Typography variant="h4" gutterBottom>Received Messages</Typography>
        {receiverMessages.map((message) => (
          <Box key={message._id}>
            <Typography>{message.sender.userName}: {message.content}</Typography>
            <DeleteOutlined variant="outlined" onClick={() => deleteMessage(message._id)} sx={{ color: "red" }}></DeleteOutlined>
          </Box>
        ))}
        <TextField
          label="Message"
          multiline
          rows={4}
          variant="outlined"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" onClick={sendMessage}>Send Message</Button>
      </Box>
    </Box>
  );
};

export default MessagePage;