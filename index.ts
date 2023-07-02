import puppeteer from 'puppeteer-extra';
import { executablePath, Browser, Page } from 'puppeteer';
import hidden from 'puppeteer-extra-plugin-stealth';
import { isEpisodes, isEpisodesAndmovies } from './utils';

async function main() {
  let browser: Browser | null = null;

  try {
    puppeteer.use(hidden());

    browser = await puppeteer.launch({
      headless: 'new',
      executablePath: executablePath(),
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2 * 60 * 1000);

    // Go to page
    await page.goto('https://raretoonsindia.tv/');
    await onBrowser(page);

    return;
  } catch (err) {
    console.error('scrap failed', err);
  } finally {
    await browser?.close();
  }
}

async function onBrowser(page: Page) {
  await page.waitForSelector('#menu-main-menu-2');
  const { data, extra } = await page.evaluate(() => {
    const mobileMenu =
      document.querySelector<HTMLUListElement>('#menu-main-menu-2');

    if (!mobileMenu) process.abort();

    const extra: any[] = [];
    const cartoons = [];

    for (const cartoon of mobileMenu.children) {
      const cartoonChildren = cartoon.children;

      // Title
      const title = cartoonChildren[0].textContent;
      if (!title) continue;

      const cartoonSubmenu =
        (cartoonChildren[1] as HTMLUListElement | null) ?? null;

      const cartoonSubmenuChildren = cartoonSubmenu?.children;

      if (!(cartoonSubmenu && cartoonSubmenuChildren?.length)) {
        cartoons.push({ title });
        continue;
      }

      if (isEpisodesAndmovies(cartoonSubmenuChildren)) {
        cartoons.push({
          title,
          ...getEpisodesAndMovies(cartoonSubmenuChildren),
        });
      } else if (isEpisodes(cartoonSubmenuChildren)) {
        cartoons.push({
          title,
          ...getEpisodes(cartoonSubmenuChildren),
        });
      } else {
        cartoons.push({
          title,
          ...getEpisodes(cartoonSubmenuChildren),
        });
      }
    }

    return { data: cartoons, extra };
  });

  console.log(data);
  console.log(extra);
}

async function getEpisodesAndMovies(cartoonSubmenuChildren: HTMLCollection) {
  const episodes = getEpisodes(cartoonSubmenuChildren);
  const moviesA = cartoonSubmenuChildren[1]
    .children[0] as HTMLAnchorElement | null;

  if (!(moviesA && moviesA.href)) {
    return { episodes };
  }

  return {
    episodes,
    movies: getMovies(moviesA.href),
  };
}

function getEpisodes(cartoonSubmenuChildren: HTMLCollection) {
  const episodesULChildren = cartoonSubmenuChildren[0].children[1].children;
  const episodes: Episode[] = [];

  for (const episodeLI of episodesULChildren) {
    const { textContent, href } = episodeLI.children[0] as HTMLAnchorElement;
    if (!(textContent && href)) continue;
    episodes.push({
      title: textContent,
      link: href,
    });
  }

  return episodes;
}

async function getMovies(link: string) {
  return 'Movie';
}

main();
