const toFiltersCount = (films) => {
  const all = films.length;
  const isWatchlist = films.filter((it) => it.userDetails.isWatchlist).length;
  const isWatched = films.filter((it) => it.userDetails.isAlreadyWatched).length;
  const isFavorite = films.filter((it) => it.userDetails.isFavorite).length;

  return {
    all,
    isWatchlist,
    isWatched,
    isFavorite,
  };
};

export {
  toFiltersCount
};
