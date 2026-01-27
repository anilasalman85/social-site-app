import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import Posts from "./pages/Posts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostForm from "./components/PostForm";

function App() {
  const auth = useContext(AuthContext);

  if (!auth) return null; // safety

  const { token } = auth;

  return (
    <Router>
      {token && <Navbar />}

      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/dashboard" /> : <Register />}
        />

        {/* Protected */}
        {token ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/posts/edit/:id" element={<PostForm />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
