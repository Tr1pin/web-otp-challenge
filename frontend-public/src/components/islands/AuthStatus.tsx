import { useState, useEffect } from 'react';
import type { User } from '../../types';

const API_URL = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:8080';

export default function AuthStatus() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    window.location.href = '/';
  };

  if (loading) {
    return <div className="text-slate-500 text-sm">...</div>;
  }

  if (user) {
    return (
      <div className="flex items-center justify-between gap-3">
        <span className="text-slate-300 text-sm">
          Bienvenido, <span className="text-hextech">{user.displayName}</span>
        </span>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 bg-page border border-surface-border text-slate-300 rounded-lg px-3 py-2 text-sm hover:border-hextech hover:text-hextech transition-colors cursor-pointer"
        >
          <i className="ti ti-logout-2"></i>
          Salir
        </button>
      </div>
    );
  }

  return (
    <a
      href="/login"
      className="inline-flex items-center gap-2 bg-hextech/10 border border-hextech/50 text-hextech rounded-lg px-4 py-2 text-sm hover:bg-hextech/20 transition-colors no-underline"
    >  
      <i className="ti ti-login-2"></i>
      Login
    </a>
  );
}