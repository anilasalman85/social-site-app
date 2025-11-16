import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import Posts from "./pages/Posts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostForm from "./components/PostForm";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      {/* Only show navbar when user is logged in */}
      {token && <Navbar />}

      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />

        {/* Protected Routes */}
        {token ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/posts/edit/:id" element={<PostForm />} />

            {/* Default when logged in */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          /* Default when not logged in */
          <Route path="*" element={<Navigate to="/login" />} />
        )}

      </Routes>
    </Router>
  );
}

export default App;
