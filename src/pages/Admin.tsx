// src/pages/Admin.tsx
import { useEffect, useState } from "react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getToken, setToken, clearToken } from "@/lib/adminApi";
import { Seo } from "@/components/seo/Seo";

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

  return (
    <>
      <Seo title="Admin | Meptrasoft AI Technologies" description="Meptrasoft admin." path="/admin" noindex />
      {!token ? <AdminLogin onSuccess={handleLoginSuccess} /> : <AdminDashboard token={token} onLogout={handleLogout} />}
    </>
  );
}
