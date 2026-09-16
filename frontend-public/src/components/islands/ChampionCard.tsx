import { useState, useEffect } from 'react';
import type { Champion } from '../../types';

interface Props {
  champion: Champion;
}

export default function ChampionCard({ champion }: Props) {
  const winRatio = Math.round(champion.winRatio ?? 0);
  const collaboratorName = champion.collaborator?.name ?? 'Desconocido';
  const collaboratorPhoto = champion.collaborator?.photoUrl;
  const initial = collaboratorName.charAt(0).toUpperCase();

  const championImg = champion.photoUrl
    ? champion.photoUrl
    : `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.championKey}_0.jpg`;

  
  const [showChampion, setShowChampion] = useState(false);
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    // Detecta si el dispositivo carece de hover (táctil).
    const noHover = window.matchMedia('(hover: none)').matches;
    setAutoMode(noHover);

    if (!noHover) return;

    // En móvil: alterna colaborador <-> campeón cada 4 segundos, en bucle.
    const interval = setInterval(() => {
      setShowChampion((prev) => !prev);
    }, 4000);

    return () => clearInterval(interval); // limpia el temporizador al desmontar.
  }, []);

  // En escritorio, el hover controla el estado; en móvil, lo controla el ciclo.
  const handleEnter = () => { if (!autoMode) setShowChampion(true); };
  const handleLeave = () => { if (!autoMode) setShowChampion(false); };

  return (
    <article
      className="bg-surface border-[0.5px] border-surface-border rounded-2xl overflow-hidden transition-transform transition-colors duration-200 hover:scale-[1.04] hover:border-hextech"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <a href={`/champion/${champion.id}`} className="block no-underline">
        <header className="relative h-72 overflow-hidden bg-surface">
          {/* Campeón: debajo, se revela con el fade */}
          <img
            src={championImg}
            alt={`Splash art de ${champion.name}`}
            loading="lazy"
            style={{
              maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
            }}
            className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ${
              showChampion ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Colaborador: encima, se oculta con el fade */}
          <figure
            className={`absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2 w-72 h-64 rounded-xl bg-surface overflow-hidden flex items-center justify-center m-0 transition-opacity duration-500 ${
              showChampion ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {collaboratorPhoto
              ? <img src={collaboratorPhoto} alt={`Foto de ${collaboratorName}`} className="w-full h-full object-cover" />
              : <span className="text-slate-300 text-5xl font-medium">{initial}</span>
            }
          </figure>

        </header>

        <div className="px-4 pb-4 pt-1">
          <h3 className="text-center mb-3.5 text-[18px] font-medium text-slate-100 leading-tight px-2 min-h-[2.5rem] flex items-center justify-center">
            <span>
              {champion.name}
              <span className="text-hextech mx-1" aria-hidden="true">×</span>{collaboratorName}
            </span>
          </h3>

          <footer className="flex justify-between items-center border-t-[0.5px] border-surface-border pt-3.5">
            <p className="text-slate-400 text-[13px] m-0">
              <span className="text-slate-100">{champion.voteCount ?? 0}</span> votos
            </p>
            <p className="m-0">
              <span className="text-hextech text-2xl font-medium">{winRatio}%</span>
              <span className="text-slate-400 text-[11px] ml-1">WR</span>
            </p>
          </footer>
        </div>
      </a>
    </article>
  );
}