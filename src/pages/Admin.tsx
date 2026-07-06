// src/pages/Admin.tsx
import { useState } from "react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getToken, setToken, clearToken } from "@/lib/adminApi";

export default function Admin() {
  const [token, setTokenState] = useState<string | null>(() => getToken());

  function handleLoginSuccess(newToken: string) {
    setToken(newToken);
    setTokenState(newToken);
  }

  function handleLogout() {
    clearToken();
    setTokenState(null);
  }

  if (!token) return <AdminLogin onSuccess={handleLoginSuccess} />;
  return <AdminDashboard token={token} onLogout={handleLogout} />;
}
