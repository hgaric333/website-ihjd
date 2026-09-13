# How to add things to the site

You don't need to know how to code for any of this. You need a text editor
(TextEdit on Mac, Notepad on Windows, or VS Code) and about ten minutes.

---

## 1. Add a new article

**Step 1 — make the article file**

Go into the `posts` folder. Copy the file `_template.html` and rename the copy
to something short, lowercase, with dashes instead of spaces:

```
posts/debt-and-development-in-ghana.html
```

That file name becomes part of the web address, so keep it readable.

**Step 2 — write the article**

Open your new file. Find these places and replace them:

| Look for | Replace with |
|---|---|
| `YOUR ARTICLE TITLE HERE` (3 places) | The real title |
| `ONE SENTENCE SUMMARY...` | One sentence for Google and social previews |
| `January 1, 2026` and `datetime="2026-01-01"` | The publication date |
| `0 min read` | Roughly 200 words per minute |
| The big comment block under `<div class="prose">` | Your writing |
| `topic one`, `topic two` | Your topics |

Each paragraph goes inside its own `<p> ... </p>`. That's the only rule.

**Step 3 — list it on the site**

Open `assets/js/posts.js`. Copy an existing block and paste it at the **top**
of the list, then edit it:

```js
{
  title: "Debt and Development in Ghana",
  file: "posts/debt-and-development-in-ghana.html",
  date: "2026-03-04",
  readingTime: "6 min read",
  excerpt: "One or two sentences that make someone want to read it.",
  tags: ["ghana", "debt", "public policy"]
},
```

Watch the commas: every block ends with `},` except the very last one, which
ends with `}`.

That's it. The article now appears on the home page and in the research
archive, and the topic filter picks up its tags automatically.

---

## 2. Add a podcast episode

Open `assets/js/episodes.js` and copy a block to the top of the list:

```js
{
  number: 2,
  title: "Oil, Debt and Who Gets Paid",
  date: "2026",
  description: "What the episode is about, in a sentence or two.",
  link: "https://open.spotify.com/episode/xxxxxxxx",
  audio: ""
},
```

- `link` — paste the episode's address from Spotify, Apple Podcasts, YouTube,
  anywhere. Leave it as `""` and the episode shows as **Coming soon**.
- `audio` — optional. If you have the actual mp3 file, put it in
  `assets/audio/` and write `"assets/audio/episode-2.mp3"` here. A play button
  then appears directly on the page.

### Linking an article to its episode

Inside an article, anywhere you want, add:

```html
<p><a href="../index.html#podcast">Listen to the episode on this topic</a></p>
```

---

## 3. Make the contact form actually send email

Right now the form opens the visitor's own email app. To have messages
delivered to an inbox instead:

1. Go to [formspree.io](https://formspree.io) and make a free account.
2. Create a new form. Formspree gives you an address like
   `https://formspree.io/f/abcdwxyz`.
3. Open `contact.html`, find the line starting with `<form id="contact-form"`,
   and replace `https://formspree.io/f/YOUR_FORM_ID` with your real address.

The free plan covers 50 messages a month. Nothing else needs changing — the
spam trap, validation and the thank-you message are already wired up.

---

## 4. Add photographs

Put image files in `assets/img/`, then:

- **Hero photo behind the title** — name it `hero.jpg` and add this line to
  `assets/css/style.css` inside the `:root { ... }` block at the top:
  `--hero-image: url("../img/hero.jpg");`
- **Hermina's portrait** — name it `hermina.jpg`, open `team.html`, and follow
  the comment just above the profile.

Resize photos to about 1600px wide before uploading so pages stay fast.

---

## 5. See your changes

Double-click `index.html` to open the site in a browser. Everything works from
your own computer — no server needed. When it looks right, commit and push.
