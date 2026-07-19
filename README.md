# Gomer Faith Ministries — Website + Editing Dashboard

This is the full website, rebuilt so it now has a real editing dashboard
(like Wix or Base44) that a non-technical person at the church can use to
change text, swap photos, and add events or sermons — without touching code.

**Nothing about the design changed.** Same layout, same colours, same
photography. What changed is *where the content lives*: instead of being
hardcoded into HTML files, it now lives in small content files that both
the website and the dashboard read from.

---

## How it works, in plain terms

- **Eleventy** is a tool that takes your content (text files) and your
  design (templates) and combines them into the final website — this
  happens automatically every time content changes.
- **Decap CMS** is the actual dashboard. It shows up at `yoursite.com/admin`
  as a clean login screen, then a form-based editor — text boxes, image
  upload buttons, "add new event" buttons. No code, no HTML.
- **Netlify** hosts the site and rebuilds it automatically the moment
  someone clicks "Publish" in the dashboard. It also handles who's allowed
  to log in.
- **GitHub** quietly stores every version of the content in the background
  (this is what makes "Publish" work, and it means every change is backed
  up and reversible — nothing is ever truly lost).

None of that machinery is visible to whoever's editing the site day to day.
They just see a dashboard.

---

## One-time setup (about 20–30 minutes)

### 1. Create a GitHub repository
1. Go to [github.com](https://github.com) and create a free account if you
   don't have one.
2. Create a new **private** repository (name it whatever you like, e.g.
   `gomer-website`).
3. Upload everything in this folder to that repository. Easiest way if
   you're not familiar with git: on the repo page, use **"Add file" →
   "Upload files"** and drag in the whole project folder contents (except
   `node_modules`, which shouldn't exist yet anyway).

### 2. Connect Netlify
1. Go to [netlify.com](https://netlify.com) and sign up (free tier is
   plenty for this site).
2. **Add new site → Import an existing project → Deploy with GitHub.**
3. Authorize Netlify to access your GitHub account, then select the
   `gomer-website` repository.
4. Netlify will auto-detect the build settings from `netlify.toml`
   (build command: `npm run build`, publish directory: `_site`). Just
   click **Deploy**.
5. Wait 1–2 minutes for the first build. You'll get a live URL like
   `random-name-123.netlify.app`.

### 3. Turn on Netlify Identity (this is the login system)
1. In your Netlify site dashboard: **Site configuration → Identity → Enable Identity.**
2. Under **Registration**, set it to **Invite only** (so random people
   can't sign up as editors).
3. Under **Services**, enable **Git Gateway** — this is what lets the
   dashboard actually save changes back to GitHub without editors needing
   their own GitHub accounts.

### 4. Invite whoever will be editing the site
1. Still in **Identity**, click **Invite users**, enter their email.
2. They'll get an email, click the link, set a password.
3. Send them to `yoursite.netlify.app/admin` — that's their dashboard from
   now on.

### 5. (Optional) Connect your real domain
Site configuration → Domain management → Add a custom domain, then follow
Netlify's DNS instructions. This replaces the earlier AWS-based plan — for
this editing workflow, Netlify hosting is simpler to keep everything working
together, so I'd recommend fully moving over rather than running both.

---

## What an editor can actually do in the dashboard

Once logged in at `/admin`, they'll see a sidebar with:

- **Site Settings** — church name, logo, address, service time, social
  links, the Google Map. One place, updates everywhere.
- **Homepage** — every section's headline and text, the hero photo, mission
  points, the Scripture callout, all editable.
- **Visit Us / Watch & Sermons / Give / Prayer Request / About / Contact
  Pages** — headline and body text for each.
- **Ministries** — add, remove, or edit any ministry card (name, schedule,
  photo, description). Adding a new ministry is just clicking "New
  Ministries" and filling in the form.
- **Upcoming Events** — same idea, add/remove events freely.
- **Sermons** — add a new sermon each week: title, speaker, scripture,
  duration, topic tags, thumbnail, and (once streaming is set up) a video
  link.
- **Testimonials** — add or retire member quotes.
- **Leadership** — edit or add leader bios and photos.

Every image field has a built-in upload button — no need to resize or
rename files, Decap CMS handles that.

Changes are staged as a draft until the editor clicks **Publish**, at which
point Netlify rebuilds the live site automatically (takes under a minute).

---

## Local development (only needed if you want to work on the code/design itself)

```bash
npm install
npm start
```
This runs the site locally at `http://localhost:8080` with live reload.

```bash
npm run build
```
Builds the production site into `_site/`.

---

## Project structure

```
content/
  data/           → single-instance page content (settings, homepage, etc.)
  ministries/      events/      sermons/      testimonials/      leaders/
                  → one markdown file per entry, these are what "Ministries",
                    "Events", "Sermons" etc. look like in the dashboard
src/
  includes/base.njk   → shared header/footer template
  *.njk                → one template per page
  css/ js/ images/     → design assets, unchanged from before
admin/
  index.html      → loads the Decap CMS dashboard
  config.yml       → defines every field an editor sees — this is the
                    file to edit if you want to add new editable fields
                    later
.eleventy.js       → build configuration
netlify.toml        → tells Netlify how to build and deploy
```

## If something in the dashboard needs to change later
Almost everything about *what fields editors can edit* is controlled by
`admin/config.yml`. Adding a new field to an existing page, or a new
editable page entirely, means adding a few lines there — happy to help with
that whenever it comes up.
