const here = (...any) => console.log('here', ...any);

let mainMenuBar = document.querySelector('#menu-main-menu-2');

let channelsAndCartoons = mainMenuBar.children;

let cartoons = [];

let unrecognizedMainMenuItems = [];
for (const menuItem of channelsAndCartoons) {
  const firstItem = menuItem.children[0];

  if (firstItem.localName && firstItem.localName === 'a') {
    const name = firstItem.innerText;
    console.log(name);
    if (
      menuItem.children.length === 1 &&
      firstItem.href &&
      firstItem.href !== '#'
    ) {
      const link = firstItem.href;
      console.log(link);

      cartoons.push({ name, link, priority: 0 });
    } else {
      unrecognizedMainMenuItems.push(menuItem);
    }
  }
}

// for (const menuItem of unrecognizedMainMenuItems) { }

function condition1(element, priority) {
  let firstItem = element.children[0];
  if (firstItem.localName && firstItem.localName === 'a') {
    const name = firstItem.innerText;

    if (element.children.length >= 2) {
      let secondItem = element.children[1];
      if (secondItem.localName && secondItem.localName === 'ul') {
        let childList = secondItem.children;
        let seasons = [];
        for (const child of childList) {
          if (child.children.length === 1) {
            let node = child.children[0];
            if (
              node.localName &&
              node.localName === 'a' &&
              node.href &&
              node.href !== '#'
            ) {
              let maySeasonName = node.innerText;
              if (maySeasonName.toLowerCase().startsWith('season')) {
                let link = node.href;
                seasons.push({ name: maySeasonName, link });
              }
            }
          }
        }
        if (seasons.length) {
          return { sesionalCartoon: { name, seasons, priority } };
        }
      }
    }
  }

  return { unrecognized: true };
}

let unrecognizedList = [...unrecognizedMainMenuItems];
let newUnrecognizedList = [];
for (const menuItem of unrecognizedList) {
  const { sesionalCartoon, unrecognized } = condition1(menuItem, 0);
  if (unrecognized) {
    newUnrecognizedList.push(menuItem);
  } else {
    cartoons.push(sesionalCartoon);
  }
}
unrecognizedMainMenuItems = newUnrecognizedList;

function condition2(element, priority) {
  let firstItem = element.children[0];
  if (firstItem.localName && firstItem.localName === 'a') {
    const name = firstItem.innerText;

    if (element.children.length >= 2) {
      let secondItem = element.children[1];
      if (secondItem.localName && secondItem.localName === 'ul') {
        let childList = secondItem.children;
        if (childList.length === 2) {
          const [episodes, movies] = childList;

          let cartoon = {};

          if (episodes.localName && episodes.localName === 'li') {
            if (episodes.children[0].innerText.toLowerCase() === 'episodes') {
              let episodesList = [];
              let childList = episodes.children[1].children;
              for (const child of childList) {
                if (child.children.length === 1) {
                  let node = child.children[0];
                  if (
                    node.localName &&
                    node.localName === 'a' &&
                    node.href &&
                    node.href !== '#'
                  ) {
                    let mayEpisodeName = node.innerText;
                    let mayEpisodeNameLower = mayEpisodeName.toLowerCase();
                    if (
                      mayEpisodeNameLower.length > 2 &&
                      mayEpisodeNameLower[0] === 's' &&
                      parseInt(mayEpisodeNameLower[1])
                    ) {
                      let link = node.href;
                      episodesList.push({ name: mayEpisodeName, link });
                    }
                  }
                }
              }
              if (episodesList.length) {
                cartoon.episodes = episodesList;
              }
            }
          }

          if (movies.localName && movies.localName === 'li') {
            here(movies.children);
            if (
              movies.children[0].innerText.toLowerCase() === 'movies' ||
              movies.children[0].innerText.toLowerCase() === 'all movies'
            ) {
              let moviesList = [];
              let childList = movies.children[1].children;
              for (const child of childList) {
                if (child.children.length === 1) {
                  let node = child.children[0];
                  if (
                    node.localName &&
                    node.localName === 'a' &&
                    node.href &&
                    node.href !== '#'
                  ) {
                    let mayMoviesName = node.innerText;
                    let mayMoviesNameLower = mayMoviesName.toLowerCase();
                    if (
                      mayMoviesNameLower.length > 2 &&
                      mayMoviesNameLower[0] === 'm' &&
                      parseInt(mayMoviesNameLower[1])
                    ) {
                      let link = node.href;
                      moviesList.push({ name: mayMoviesName, link });
                    }
                  }
                }
              }
              if (moviesList.length) {
                cartoon.movies = moviesList;
              }
            }
          }

          return { cartoon: { name, ...cartoon, priority } };
        }
      }
    }
  }

  return { unrecognized: true };
}

unrecognizedList = [...unrecognizedMainMenuItems];
newUnrecognizedList = [];
for (const menuItem of unrecognizedList) {
  const { cartoon, unrecognized } = condition2(menuItem, 0);
  if (unrecognized) {
    newUnrecognizedList.push(menuItem);
  } else {
    cartoons.push(cartoon);
  }
}
unrecognizedMainMenuItems = newUnrecognizedList;

cartoons;
