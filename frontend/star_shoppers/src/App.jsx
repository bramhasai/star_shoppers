import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes,Route } from "react-router-dom";
import Login_home from "./pages/Login_home";
import Register from "./pages/Register";
function App() {

  return (
    <div>
        <Routes>
          <Route path="/login_home"  element={<Login_home />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </div>
  )
}

export default App
