const toFiltersCount = (films) => {
  const all = films.length;
  const watchlist = films.filter((it) => it.userDetails.watchlist).length;
  const watched = films.filter((it) => it.userDetails.alreadyWatched).length;
  const favorite = films.filter((it) => it.userDetails.favorite).length;

  return {
    all,
    watchlist,
    watched,
    favorite,
  };
};

export {
  toFiltersCount
};
