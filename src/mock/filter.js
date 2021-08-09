const toFiltersCount = (tasks) => {
  const all = tasks.length;
  const watchlist = tasks.filter((it) => it.watchlist).length;
  const watched = tasks.filter((it) => it.watched).length;
  const favorite = tasks.filter((it) => it.favorite).length;

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
