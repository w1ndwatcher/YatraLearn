import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import TrainerRegister from "./pages/TrainerRegister";
import Dashboard from "./pages/Dashboard";
import CreateReflection from "./pages/CreateReflection";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/trainer/register" element={<TrainerRegister />} />
        <Route path="/" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sessions/create" element={<CreateReflection />} />
      </Routes>
    </Router>
  );
};

export default App;