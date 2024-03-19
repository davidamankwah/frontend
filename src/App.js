//imports
import logo from './logo.svg';
import './App.css';
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from './pages/home';
import LoginPage from './pages/login';
import ChatsPage from './pages/chats';
import ProfilePage from './pages/profile';
import MessagePage from './pages/messages';
import NotfiPage from './pages/notification';


function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="App">
       <BrowserRouter>
       <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> : <Navigate to="/" />}  />
            <Route
              path="/chats"
              element={isAuth ? <ChatsPage /> : <Navigate to="/" />}
            />
             <Route
              path="/notification"
              element={isAuth ? <NotfiPage /> : <Navigate to="/" />}
            />
            <Route
              path="/message"
              element={isAuth ? <MessagePage /> : <Navigate to="/" />}
            />
          </Routes>
          </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
