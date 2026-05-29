import React, { useState, useEffect } from 'react';
const API_BASE = 'https://localhost:7219';
//const API_BASE = 'https://26.185.217.20:7219';

export default function GenresFilter({ onGenreSelect, selectedGenres = [] }) {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/Genre/get-all`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const genresArray = Array.isArray(data) ? data : (data?.data ?? []);
        setGenres(genresArray);
      } catch (err) {
        setError(err.message ?? 'Не удалось загрузить жанры');
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleCheckboxChange = (genreId) => {
    const newSelectedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter((id) => id !== genreId)
      : [...selectedGenres, genreId];

    if (onGenreSelect) {
      onGenreSelect(newSelectedGenres);
    }
  };

  if (loading) {
    return <div className="genres-filter-loading">Загрузка жанров...</div>;
  }

  if (error) {
    return <div className="genres-filter-error">Ошибка: {error}</div>;
  }

  return (
    <div className="genres-filter">
      <div className="genres-filter-title">Жанры</div>
      <div className="genres-filter-items">
        {genres.length === 0 ? (
          <div className="genres-filter-empty">Жанры не найдены</div>
        ) : (
          genres.map((genre) => (
            <div key={genre?.id || genre?.Id} className="genres-filter-item">
              <input
                type="checkbox"
                id={`genre-${genre?.id || genre?.Id}`}
                checked={selectedGenres.includes(genre?.id || genre?.Id)}
                onChange={() => handleCheckboxChange(genre?.id || genre?.Id)}
                className="genres-filter-checkbox"
              />
              <label
                htmlFor={`genre-${genre?.id || genre?.Id}`}
                className="genres-filter-label"
              >
                {genre?.name || genre?.Name || 'Без названия'}
              </label>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
