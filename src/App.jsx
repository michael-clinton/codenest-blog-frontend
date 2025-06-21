// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexPage from './pages/indexPage';
import ArchivePage from './pages/archivePage';
import ContactPage from './pages/contactPage';
import BlogDetails from './pages/BlogDetails';
import CategoryPage from './pages/categoryPage';
import ScrollToTop from './components/ScrollToTop';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/Security/ProtectedRoute';

import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';


const App = () => (
  <Router>
    <ScrollToTop />
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<IndexPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
      </Route>
    </Routes>
  </Router>
);

export default App;
