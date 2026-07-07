// src/pages/Admin.tsx
import { useEffect, useState } from "react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getToken, setToken, clearToken } from "@/lib/adminApi";

export default function Admin() {
  const [token, setTokenState] = useState<string | null>(() => getToken());

  // /admin renders outside the marketing <Layout>, so a mobile-nav scroll
  // lock (document.body.style.overflow = "hidden") left over from navigating
  // here with the menu open would never get cleared — force it clean.
  useEffect(() => {
    document.body.style.overflow = "";
  }, []);

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
