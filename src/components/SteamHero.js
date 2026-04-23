import { GamesFetch } from "../Functional/Games/GamesFetch";

export default function SteamHero({ onGameClick }) {
  return (
    <section className="steam-hero">
      <GamesFetch onGameClick={onGameClick} />
    </section>
  );
}
