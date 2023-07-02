export const isEpisodesAndmovies = (cartoonSubmenuChildren: HTMLCollection) =>
  isEpisodes(cartoonSubmenuChildren) && isMovies(cartoonSubmenuChildren);

export const isEpisodes = (cartoonSubmenuChildren: HTMLCollection) =>
  cartoonSubmenuChildren[0].children[0].textContent?.toLocaleLowerCase() ===
  'episodes';

const isMovies = (cartoonSubmenuChildren: HTMLCollection) =>
  cartoonSubmenuChildren[1].children[0].textContent?.toLocaleLowerCase() ===
  'movies';
