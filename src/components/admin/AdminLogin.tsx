// src/components/admin/AdminLogin.tsx
import { useState } from "react";
import { login } from "@/lib/adminApi";
import { Icon } from "@/components/ui/Icon";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_username: "Username is incorrect",
  invalid_password: "Password is incorrect",
  invalid_both: "Username and password are both incorrect",
  network: "Couldn't reach the server — check your connection",
};

export function AdminLogin({ onSuccess }: { onSuccess: (token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!username.trim() && !password.trim()) {
      setError("Enter username and password");
      return;
    }
    if (!username.trim()) {
      setError("Enter username");
      return;
    }
    if (!password.trim()) {
      setError("Enter password");
      return;
    }

    setLoading(true);
    setError(null);
    const result = await login(username, password);
    setLoading(false);
    if (result.ok && result.token) {
      onSuccess(result.token);
    } else {
      setError(ERROR_MESSAGES[result.error ?? ""] ?? "Sign in failed — try again");
    }
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-navy-900 px-4 py-12 sm:items-center sm:py-0">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-xl font-bold text-navy-800">Admin login</h1>
        <label className="mb-1 block text-sm font-semibold text-navy-800">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 w-full rounded border border-line-200 px-3 py-2 text-navy-800 placeholder:text-slate-400"
          autoComplete="username"
        />
        <label className="mb-1 block text-sm font-semibold text-navy-800">Password</label>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-line-200 px-3 py-2 pr-10 text-navy-800 placeholder:text-slate-400"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-navy-800"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <Icon name={showPassword ? "eye-slash" : "eye"} size={16} />
          </button>
        </div>
        {error && <p className="mb-4 text-sm font-medium text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-navy-800 py-2.5 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
