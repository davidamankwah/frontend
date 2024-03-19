import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Importing useSelector to access data from Redux store
import io from "socket.io-client";
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";
import "./chats.css";

let socket;
const CONNECTION_PORT = "https://server-tyt9.onrender.com";

const ChatsPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [messageList, setMessageList] = useState([]);

  // Accessing userName from Redux store
  const userName = useSelector((state) => state.user.userName);

  useEffect(() => {
    socket = io(CONNECTION_PORT);
  }, [CONNECTION_PORT]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList([...messageList, data]);
    });
  });

  const connectToRoom = () => {
    setLoggedIn(true);
    socket.emit("join_room", room);
  };

  const sendMessage = async () => {
    let messageContent = {
      room: room,
      content: {
        author: userName, // Assigning the current user's name
        message: message,
      },
    };

    await socket.emit("send_message", messageContent);
    setMessageList([...messageList, messageContent.content]);
    setMessage("");
  };

  const handleHomeClick = () => {
    console.log('Navigating to home');
    navigate(`/home/`);
  };

  return (
    <div className="Chat">
      {!loggedIn ? (
        <div className="logIn">
          <div className="inputs">
            <input
              type="text"
              placeholder="Enter a Room"
              onChange={(e) => {
                setRoom(e.target.value);
              }}
            />
          </div>
          <button onClick={connectToRoom}>Enter Chat</button>
        </div>
      ) : (
        <div className="chatContainer">
          <div className="messages">
            {messageList.map((val, index) => (
              <div
                className="messageContainer"
                id={val.author === userName ? "You" : "Other"}
                key={index} // Assuming val has a unique identifier like an id
              >
                <div className="messageIndividual">
                  {val.author}: {val.message}
                </div>
              </div>
            ))}
          </div>
          <div className="messageInputs">
            <input
              type="text"
              placeholder="Message..."
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
      <h1>Live Chats</h1>
      <HomeIcon onClick={() => handleHomeClick()}></HomeIcon>
    </div>
  );
};

export default ChatsPage;
