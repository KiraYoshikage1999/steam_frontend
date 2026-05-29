import { GamesFetch } from "../Functional/Games/GamesFetch";

export default function SteamHero({ onGameClick, selectedGenres }) {
  return (
    <section className="steam-hero">
      <GamesFetch onGameClick={onGameClick} selectedGenres={selectedGenres} />
    </section>
  );
}
