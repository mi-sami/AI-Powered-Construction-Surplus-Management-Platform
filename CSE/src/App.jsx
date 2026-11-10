import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AuthenticatedFolder from './Component/AuthenticatedFolder/AuthenticatedFolder';
import AddNewAdvertisement from './pages/AddNewAdvertisement';
import EditAdvertisement from './pages/EditAdvertisement';

const App = () => {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Route */}
        <Route element={<AuthenticatedFolder />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-advertisement" element={<AddNewAdvertisement />} />
          <Route path="/edit-advertisement/:id" element={<EditAdvertisement />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;