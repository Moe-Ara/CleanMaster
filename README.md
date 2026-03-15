# CleanMaster Landing Page

Single-page responsive landing page for a cleaning company, fully driven by environment variables.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build Static (Netlify Ready)

```bash
npm run build
```

This generates a static site in `dist/`:

- `dist/index.html`
- `dist/robots.txt`
- `dist/sitemap.xml`
- `dist/public/*`

## Deploy To Netlify

`netlify.toml` is included with:

- Build command: `npm run build`
- Publish directory: `dist`

In Netlify:

1. Import the Git repo.
2. Keep build settings from `netlify.toml`.
3. Add your environment variables from `.env` in Site Settings > Environment Variables.
4. Trigger deploy.

## Configure

Edit `.env` to change all business/content values:

- Company and contacts: `COMPANY_NAME`, `PHONE_NUMBER`, `EMAIL`, `WHATSAPP_NUMBER`, address fields.
- Branding: `LOGO_URL`, `LOGO_ALT`.
- Language: `DEFAULT_LANGUAGE=en|de`.
- SEO: `SITE_URL`, `SEO_TITLE_*`, `SEO_DESCRIPTION_*`, `SEO_KEYWORDS_*`, `SEO_OG_IMAGE`.
- Asset cache control: `ASSET_VERSION` (bump to force refresh), `STATIC_ASSET_CACHE_SECONDS` (set `0` while developing).
- Content per language: all `*_EN` and `*_DE` keys.
- New homepage sections:
  - hero visual note: `HERO_VISUAL_TAG_*`, `HERO_VISUAL_SUBTAG_*`
  - trust highlights: `TRUST_POINTS_*` (use `|` separator)
  - process flow: `STEPS_TITLE_*`, `STEPS_SUBTITLE_*`, `STEPS_*` (use `|`)
  - benefits grid: `BENEFITS_TITLE_*`, `BENEFITS_SUBTITLE_*`, `BENEFITS_*` (use `|`)
- Services list: `SERVICES_EN`, `SERVICES_DE` using `|` separator.
- Reviews slider placeholders: `REVIEWS_EN`, `REVIEWS_DE` using:
  - review separator: `;;`
  - fields per review: `Name||Text||Rating||ImageURL` (`ImageURL` is optional)
- Default review photo fallback: `DEFAULT_REVIEW_AVATAR`.

Example:

```env
REVIEWS_EN=Alex||Very reliable and detailed.||5||/public/avatar-placeholder.svg;;Sam||Great office cleaning.||4||https://example.com/reviewers/sam.jpg
```

## Notes

- WhatsApp button opens direct chat via `wa.me`.
- Email button opens a `mailto:` link.
- Language switch (EN/DE) updates page content and CTA messages instantly.
- SEO includes canonical, Open Graph, Twitter tags, `robots.txt`, `sitemap.xml`, and LocalBusiness schema.
