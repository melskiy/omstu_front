
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { CubeProvider } from '@cubejs-client/react';
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import cube from '@cubejs-client/core';
import AdminLayout from "layouts/Admin.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
  
const cubeApi = cube( 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjA3Njk5ODl9.ir0jgyxdr7Q-EEJ6rKoMSvJbuF-g4tsLPckf0JULv-s', 
  { apiUrl: 'https://gold-sawfish.aws-us-east-1.cubecloudapp.dev/dev-mode/dev--3f5c11ba/cubejs-api/v1' } 
); 

root.render(
  <CubeProvider cubeApi={cubeApi}>
  <BrowserRouter>
    <Routes>
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="*" element={<Navigate to="/admin/index" replace />} />
    </Routes>
  </BrowserRouter>
  </CubeProvider>
);
