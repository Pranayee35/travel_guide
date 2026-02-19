import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Regions from "./pages/Regions";
import States from "./pages/States";
import Destinations from "./pages/Destinations";
import Packages from "./pages/Packages";
import Bookings from "./pages/Bookings";
import Users from "./pages/Users";
import Newsletter from "./pages/Newsletter";

function Protected({ children }) {
  const user = JSON.parse(localStorage.getItem("adminUser") || "null");
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route index element={<Navigate to="/regions" replace />} />
        <Route path="regions" element={<Regions />} />
        <Route path="states" element={<States />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="packages" element={<Packages />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="users" element={<Users />} />
        <Route path="newsletter" element={<Newsletter />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
