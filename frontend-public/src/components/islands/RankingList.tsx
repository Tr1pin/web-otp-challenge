import { useState, useEffect } from 'react';
import type { Champion } from '../../types.ts';

const API_URL = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:8080';

function rankColor(pos: number): string {
  if (pos === 1) return 'text-[#facc15]'; // oro
  if (pos === 2) return 'text-[#cbd5e1]'; // plata
  if (pos === 3) return 'text-[#d98a4b]'; // bronce
  return 'text-slate-500';
}

export default function RankingList() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/champions?sort=votes`)
      .then((res) => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then((data: Champion[]) => setChampions(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const top = champions.slice(0, 5);

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400">
        <i className="ti ti-loader-2 text-4xl text-slate-500 block mb-4 animate-spin"></i>
        Cargando ranking…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-slate-400">
        <i className="ti ti-alert-triangle text-5xl text-slate-500 block mb-4"></i>
        No se pudo cargar el ranking. Inténtalo más tarde.
      </div>
    );
  }

  if (top.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <i className="ti ti-mood-empty text-5xl text-slate-500 block mb-4"></i>
        No hay campeones para mostrar ahora mismo.
      </div>
    );
  }

  return (
    <ol className="list-none p-0 m-0 flex flex-col gap-3 items-center">
      {top.map((champion, i) => {
        const pos = i + 1;
        const winRatio = Math.round(champion.winRatio ?? 0);
        const collaboratorName = champion.collaborator?.name ?? 'Desconocido';
        const collaboratorPhoto = champion.collaborator?.photoUrl;
        const initial = collaboratorName.charAt(0).toUpperCase();
        const championSplash = champion.photoUrl
          ? champion.photoUrl
          : `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.championKey}_0.jpg`;

        return (
          <li key={champion.id}>
            <a
              href={`/champion/${champion.id}`}
              className="inline-flex items-center gap-5 w-fit bg-surface border-[0.5px] border-surface-border rounded-xl px-5 pt-5.5 pb-3 no-underline transition-colors hover:border-hextech"
            >
              <span className={`text-4xl font-medium w-12 text-center shrink-0 ${rankColor(pos)}`}>
                {pos}º
              </span>

              <div className="flex flex-col items-center gap-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <figure className="relative w-60 h-60 shrink-0 rounded-lg overflow-hidden border border-gray-50/30 flex items-center justify-center m-0">
                    {collaboratorPhoto
                      ? <img src={collaboratorPhoto} alt={`Foto de ${collaboratorName}`} className="w-full h-full object-cover" />
                      : <span className="text-slate-300 text-4xl font-medium">{initial}</span>
                    }
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-6 pb-1.5 px-2">
                      <span className="block text-slate-100 text-lg font-medium text-center truncate">{collaboratorName}</span>
                    </div>
                  </figure>

                  <span className="text-hextech text-2xl font-medium shrink-0" aria-hidden="true">×</span>

                  <figure className="relative w-60 h-60 shrink-0 rounded-lg overflow-hidden border border-gray-50/30 m-0">
                    <img src={championSplash} alt={`Splash art de ${champion.name}`} loading="lazy" className="w-full h-full object-cover object-top" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent pt-6 pb-1.5 px-2">
                      <span className="block text-slate-100 text-lg font-medium text-center truncate">{champion.name}</span>
                    </div>
                  </figure>
                </div>

                <div className="flex justify-center gap-8">
                  <div className="text-center">
                    <div className="flex items-center gap-1.5 justify-center">
                      <span className="text-slate-100 text-xl font-medium">{champion.voteCount ?? 0}</span>
                    </div>
                    <div className="text-slate-400 text-[11px] mt-1">votos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-hextech text-xl font-medium">{winRatio}%</div>
                    <div className="text-slate-400 text-[11px] mt-1">WR</div>
                  </div>
                </div>
              </div>

              <span className="w-12"></span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}