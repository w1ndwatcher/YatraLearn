import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import TrainerRegister from "./pages/TrainerRegister";
import Dashboard from "./pages/Dashboard";
import CreateReflection from "./pages/CreateReflection";
import ReflectionList from "./pages/ReflectionList";
import EditReflection from "./pages/EditReflection";
import Participants from "./pages/Participants";
import ParticipantProfile from "./pages/ParticipantProfile";
import ParticipantReport from "./pages/ParticipantReport";
import ParticipantChat from "./pages/ParticipantChat";
import ParticipantSessions from "./pages/ParticipantSessions";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/trainer/register" element={<TrainerRegister />} />
        <Route path="/" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/sessions/create" element={<CreateReflection />} />
        <Route path="/sessions/list" element={<ReflectionList />} />
        <Route path="/sessions/edit/:id" element={<EditReflection />} />
        <Route path="/sessions/:id/participants" element={<Participants />} />
        <Route path="/participants/:id" element={<ParticipantProfile />} />
        <Route path="/participants/:id/report" element={<ParticipantReport />} />

        <Route path="/participant/sessions" element={<ParticipantSessions />} />
        <Route path="/participant/profile" element={<ParticipantProfile />} />
        <Route path="/participant/chat/:id" element={<ParticipantChat />} />
        
      </Routes>
    </Router>
  );
};

export default App;