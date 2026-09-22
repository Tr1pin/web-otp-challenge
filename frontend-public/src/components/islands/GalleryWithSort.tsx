import { useState, useMemo, useEffect } from 'react';
import type { Champion } from '../../types.ts';
import ChampionCard from './ChampionCard.tsx';

const API_URL = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:8080';

type SortKey = 'default' | 'votes' | 'winratio';

const OPTIONS: { key: Exclude<SortKey, 'default'>; label: string }[] = [
  { key: 'votes', label: 'Más votados' },
  { key: 'winratio', label: 'Mejor WR' },
];

export default function GalleryWithSort() {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sort, setSort] = useState<SortKey>('default');

  useEffect(() => {
    fetch(`${API_URL}/api/champions`)
      .then((res) => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then((data: Champion[]) => setChampions(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(() => {
    const copy = [...champions];
    if (sort === 'votes') {
      copy.sort((a, b) => (b.voteCount ?? 0) - (a.voteCount ?? 0));
    } else if (sort === 'winratio') {
      copy.sort((a, b) => (b.winRatio ?? 0) - (a.winRatio ?? 0));
    } else {
      copy.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
    }
    return copy;
  }, [champions, sort]);

  return (
    <>
      {/* Cabecera: título + filtro */}
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-medium text-hextech mb-1">OTP Challenge</h1>
          <p className="text-slate-400 ml-1 m-0">La serie de Werlyb, campeón a campeón.</p>
        </div>

        <nav className="flex items-center gap-2" aria-label="Ordenar champions">
          {OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSort(sort === opt.key ? 'default' : opt.key)}
              aria-pressed={sort === opt.key}
              className={
                sort === opt.key
                  ? 'text-sm px-4 py-2 rounded-lg bg-hextech text-page font-medium cursor-pointer transition-colors'
                  : 'text-sm px-4 py-2 rounded-lg bg-surface border border-surface-border text-slate-300 hover:border-hextech hover:text-hextech cursor-pointer transition-colors'
              }
            >
              {opt.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Estados */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">
          <i className="ti ti-loader-2 text-4xl text-slate-500 block mb-4 animate-spin"></i>
          Cargando champions…
        </div>
      ) : error ? (
        <div className="text-center py-20 text-slate-400">
          <i className="ti ti-alert-triangle text-5xl text-slate-500 block mb-4"></i>
          No se pudieron cargar los champions. Inténtalo más tarde.
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <i className="ti ti-mood-empty text-5xl text-slate-500 block mb-4"></i>
          No hay champions para mostrar ahora mismo.
        </div>
      ) : (
        <article className="champ-grid grid grid-cols-1 md:grid-cols-2 gap-20">
          {sorted.map((champion) => (
            <ChampionCard key={champion.id} champion={champion} />
          ))}
        </article>
      )}
    </>
  );
}