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

  return (
    <article className="bg-surface border-[0.5px] border-surface-border rounded-2xl overflow-hidden transition-transform transition-colors duration-200 hover:scale-[1.04] hover:border-hextech">
      <a href={`/champion/${champion.id}`} className="block no-underline">
        <header className="relative h-72 overflow-hidden bg-[#141821]">
          <img
            src={championImg}
            alt={`Splash art de ${champion.name}`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <figure className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-72 h-64 rounded-xl bg-hextech/10 overflow-hidden flex items-center justify-center m-0">
            {collaboratorPhoto
              ? <img src={collaboratorPhoto} alt={`Foto de ${collaboratorName}`} className="w-full h-full object-cover opacity-80" />
              : <span className="text-slate-300 text-5xl font-medium">{initial}</span>
            }
          </figure>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#181a20]/55 to-surface pointer-events-none"></div>
        </header>

        <div className="px-4 pb-4 pt-1">
          <h3 className="text-center mb-3.5 text-[18px] font-medium text-slate-100">
            {champion.name}<span className="text-hextech mx-1" aria-hidden="true">×</span>{collaboratorName}
          </h3>

          <footer className="flex justify-between items-center border-t-[0.5px] border-surface-border pt-3.5">
            <p className="flex items-center gap-2 text-slate-400 text-[13px] m-0">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="#22d3ee" aria-hidden="true"><path d="M12 21s-6.7-4.35-9.3-8.5C1 9.5 2.5 6 6 6c2 0 3.2 1.2 4 2.3C10.8 7.2 12 6 14 6c3.5 0 5 3.5 3.3 6.5C18.7 16.65 12 21 12 21z"/></svg>
              <span className="text-slate-100">{champion.voteCount ?? 0}</span>
              votos
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