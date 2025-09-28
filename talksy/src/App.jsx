import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./Home";
import Chat from "./Chat";
import { AnimatePresence } from "framer-motion";
import ChatPage from "./convo";

const App = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/convo" element={<ChatPage />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
