import { useState, useEffect } from 'react';
import type { MyVote, VoteButtonProps } from '../../types';

const API_URL = 'http://localhost:8080';


export default function VoteButton({ championId, championName, initialCount, winRatio }: VoteButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [myOtp, setMyOtp] = useState<MyVote | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/votes/me`, { credentials: 'include' })
      .then((res) => {
        if (res.ok) {
          setAuthed(true);
          return res.json();
        }
        setAuthed(false);
        return null;
      })
      .then((data: MyVote | null) => setMyOtp(data))
      .catch(() => setAuthed(false))
      .finally(() => setLoading(false));
  }, []);


  const isMyOtp = myOtp?.championId === championId;


  const sendVote = async () => {
    setVoting(true);
    setConfirming(false);
    try {
      const res = await fetch(`${API_URL}/api/votes/champion/${championId}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      if (!res.ok) {
        setVoting(false);
        return;
      }

      const data = await res.json();
      setCount(data.voteCount);
      setMyOtp(
        data.voted
          ? { championId: data.championId, championName: data.championName }
          : { championId: null, championName: null }
      );
    } catch {
      
    } finally {
      setVoting(false);
    }
  };

  const handleClick = () => {
    
    if (!authed) {
      window.location.href = '/login';
      return;
    }
    
    if (myOtp?.championId && myOtp.championId !== championId) {
      setConfirming(true);
      return;
    }
    
    sendVote();
  };

  return (
    <div className="flex flex-col items-center">

      {/* WR / votos */}
      <dl className="flex gap-8 m-0 justify-center">
        <div className="text-center">
          <dd className="text-3xl font-medium text-hextech m-0">{winRatio}%</dd>
          <dt className="text-slate-400 text-xs mt-1">win ratio</dt>
        </div>
        <div className="text-center">
          <dd className="text-3xl font-medium text-hextech m-0" aria-live="polite">{count}</dd>
          <dt className="text-slate-400 text-xs mt-1">votos</dt>
        </div>
      </dl>

      {/* Botón / confirmación */}
      <div className="mt-6 w-full flex flex-col items-center">
        {loading ? (
          <div className="text-slate-500 text-sm">...</div>
        ) : confirming && myOtp?.championName ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-slate-300 text-sm m-0 text-center">
              Tu OTP favorito actual es{' '}
              <span className="text-hextech font-medium">{myOtp.championName}</span>, ¿quieres cambiar a{' '}
              <span className="text-hextech font-medium">{championName}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={sendVote}
                disabled={voting}
                className="inline-flex items-center gap-1.5 bg-hextech text-page rounded-lg px-4 py-2 text-sm font-medium cursor-pointer disabled:opacity-60"
              >
                <i className="ti ti-check"></i>
                Sí, cambiar
              </button>
              <button
                onClick={() => setConfirming(false)}
                disabled={voting}
                className="inline-flex items-center gap-1.5 bg-page border border-surface-border text-slate-300 rounded-lg px-4 py-2 text-sm hover:border-hextech hover:text-hextech transition-colors cursor-pointer disabled:opacity-60"
              >
                <i className="ti ti-x"></i>
                No
              </button>
            </div>
          </div>
        ) : (
            <button
                onClick={handleClick}
                disabled={voting}
                aria-pressed={isMyOtp}
                className={
                    isMyOtp
                    ? 'inline-flex items-center gap-1.5 bg-hextech border border-hextech text-page rounded-lg pl-5 pr-4.5 py-2.5 text-sm font-medium cursor-pointer disabled:opacity-60 transition-colors'
                    : 'inline-flex items-center gap-1.5 bg-hextech/10 border border-hextech/50 text-hextech rounded-lg pl-5 pr-4.5 py-2.5 text-sm font-medium hover:bg-hextech/20 transition-colors cursor-pointer disabled:opacity-60'
                }
            >
                {voting ? 'cargando...' : isMyOtp ? 'Tu OTP favorito' : 'Votar como OTP'}
                <span aria-hidden="true">{isMyOtp ? '★' : '☆'}</span>
            </button>
        )}
      </div>
    </div>
  );
}