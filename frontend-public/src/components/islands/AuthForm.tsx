import { useState, useEffect } from 'react';

const API_URL = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:8080';

export default function AuthForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, { credentials: 'include' })
        .then((res) => {
        if (res.ok) window.location.href = '/';
        else setChecking(false);
        })
        .catch(() => setChecking(false));
  }, []);

  const handleSubmit = async () => {
    setError('');

    if (!email || !password) {
      setError('Completa email y contraseña');
      return;
    }
    if (mode === 'register' && !displayName) {
      setError('Introduce un nombre');
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body =
        mode === 'login'
          ? { email, password }
          : { email, password, displayName };

      const res = await fetch(API_URL + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        if (res.status === 401) setError('Credenciales inválidas');
        else if (res.status === 409) setError('Ese email ya está registrado');
        else setError('No se pudo completar. Inténtalo de nuevo.');
        setLoading(false);
        return;
      }

      
      window.location.href = '/';
    } catch (e) {
      setError('Error de conexión');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="text-slate-100 text-lg font-medium mb-5">
        {mode === 'login' ? 'Entrar' : 'Crear cuenta'}
      </div>

      {/* Botón Google */}
        <a
        href={`${API_URL}/oauth2/authorization/google`}
        className="flex items-center justify-center gap-2 w-full bg-page border-[0.5px] border-surface-border text-slate-100 rounded-lg py-2.5 text-sm no-underline hover:border-white transition-colors mb-4"
      >
        <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
        </svg>
        Continuar con Google
      </a>

      {/* Separador */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex-1 h-px bg-surface-border"></div>
        <span className="text-slate-400 text-xs">o con email</span>
        <div className="flex-1 h-px bg-surface-border"></div>
      </div>

      {/* Campo nombre (solo registro) */}
      {mode === 'register' && (
        <input
          type="text"
          placeholder="tu nombre"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full bg-page border-[0.5px] border-surface-border text-slate-100 rounded-lg p-2.5 text-sm mb-2.5 outline-none focus:border-hextech"
        />
      )}

      <input
        type="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full bg-page border-[0.5px] border-surface-border text-slate-100 rounded-lg p-2.5 text-sm mb-2.5 outline-none focus:border-hextech"
      />
      <input
        type="password"
        placeholder="contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full bg-page border-[0.5px] border-surface-border text-slate-100 rounded-lg p-2.5 text-sm mb-4 outline-none focus:border-hextech"
      />

      {error && <div className="text-red-400 text-xs mb-3">{error}</div>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-hextech text-page rounded-lg py-2.5 text-sm font-medium cursor-pointer mb-4 disabled:opacity-60"
      >
        {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Registrarse'}
      </button>

      <div className="text-slate-400 text-xs text-center">
        {mode === 'login' ? (
          <>
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className="text-hextech cursor-pointer bg-transparent border-none font-[inherit]"
            >
              Regístrate
            </button>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className="text-hextech cursor-pointer bg-transparent border-none font-[inherit]"
            >
              Entrar
            </button>
          </>
        )}
      </div>
    </div>
  );
}