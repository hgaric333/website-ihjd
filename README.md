# Narratives In Between

Website for **Narratives In Between** — independent policy research on
colonialism, imperialism and the international political economy.

A rebuild of the original Wix site: same identity and structure, hand-built as
plain HTML, CSS and JavaScript with no build step, no framework and no
dependencies.

## Editing the site

If you want to add an article, a podcast episode, a photo, or connect the
contact form — **read [ADDING-POSTS.md](ADDING-POSTS.md)**. It's written for
someone who doesn't code.

## Layout

```
index.html            Home — hero, latest articles, podcast
research.html         Full archive with topic filtering
team.html             Team profiles
contact.html          Contact form + details
posts/                One HTML file per article
  _template.html        Copy this to start a new article
assets/
  css/style.css       All styling (design tokens at the top)
  js/posts.js         ← the list of articles (edit this)
  js/episodes.js      ← the list of podcast episodes (edit this)
  js/site.js          Navigation, rendering, form handling
  img/                Photographs
```

`posts.js` and `episodes.js` are the only two files that change in normal use.
`site.js` reads them and renders the cards, the archive and the topic filter.

## Running it

Open `index.html` in a browser. That's the whole workflow.

For a local server (only needed if you add features that use `fetch`):

```bash
python3 -m http.server 8000
```

## Deploying

Static files, so anything works. The simplest options:

- **GitHub Pages** — Settings → Pages → Deploy from branch → `main` / root.
- **Netlify / Vercel** — connect the repo, no build command, publish directory `/`.

## Design

| Token | Value | Where |
|---|---|---|
| Maroon | `#5C3C3E` | Headers, hero, footer |
| Cream | `#F6F9F5` | Page background |
| Olive | `#4B540F` | Links, labels, accents |
| Serif | Spectral | Headlines and article text |
| Sans | Inter | Navigation, labels, UI |

Colours are carried over from the original site. Everything is defined once in
`:root` at the top of `assets/css/style.css`.

## License

Code: MIT (see `LICENSE`). Written content and research: © Narratives In Between.
