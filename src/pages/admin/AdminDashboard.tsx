import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to users page by default
    navigate("/admin/users");
  }, [navigate]);

  return null;
}
