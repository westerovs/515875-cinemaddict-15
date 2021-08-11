const toFiltersCount = (tasks) => {
  const all = tasks.length;
  const watchlist = tasks.filter((it) => it.userDetails.watchlist).length;
  const watched = tasks.filter((it) => it.userDetails.alreadyWatched).length;
  const favorite = tasks.filter((it) => it.userDetails.favorite).length;

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
