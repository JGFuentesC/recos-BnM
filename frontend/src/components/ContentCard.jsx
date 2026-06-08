import styles from "./ContentCard.module.css";

function ContentCard({
  contentId,
  title,
  cover,
  genres,
  rating,
  synopsis,
  type,
  onClick,
}) {
  const badgeLabel = type === "movie" ? "🎬 Película" : "📚 Libro";
  const visibleGenres = genres.slice(0, 3);
  const extraGenres = genres.length > 3 ? `+${genres.length - 3}` : null;

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.coverWrapper}>
        {cover ? (
          <img src={cover} alt={title} className={styles.cover} />
        ) : (
          <div className={styles.placeholder}>
            <span>{title}</span>
          </div>
        )}
        <div className={styles.gradient} />
        <span className={styles.badge}>{badgeLabel}</span>
        <h2 className={styles.title}>{title}</h2>
      </div>

      <div className={styles.info}>
        <div className={styles.genres}>
          {visibleGenres.map((g) => (
            <span key={g} className={styles.genreChip}>
              {g}
            </span>
          ))}
          {extraGenres && (
            <span className={styles.genreChip}>{extraGenres}</span>
          )}
        </div>
        <p className={styles.rating}>⭐ {rating.toFixed(1)}</p>
        <p className={styles.synopsis}>{synopsis}</p>
      </div>
    </div>
  );
}

export default ContentCard;
