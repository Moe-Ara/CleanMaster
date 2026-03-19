# CleanMaster Landing Page

Single-page responsive landing page for a home services company, fully driven by environment variables.

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
- Advanced SEO: `SEO_OG_IMAGE_TYPE`, `SEO_OG_IMAGE_WIDTH`, `SEO_OG_IMAGE_HEIGHT`, `SEO_OG_IMAGE_ALT_*`, `SEO_ROBOTS`, `SEO_TWITTER_CARD`, `SEO_GEO_REGION`, `SEO_GEO_PLACENAME`.
- Asset cache control: `ASSET_VERSION` (bump to force refresh), `STATIC_ASSET_CACHE_SECONDS` (set `0` while developing).
- SEO localization: `SEO_LOCALE_EN`, `SEO_LOCALE_DE`, `SEO_AUTHOR`, `SEO_TWITTER_SITE`.
- Content per language: all `*_EN` and `*_DE` keys.
- Hero conversion: `CTA_QUOTE_*`, `CTA_CALL_*`, `HERO_BADGES_*` (use `|`).
- Service cards: `SERVICE_CARDS_*` using `Title||Description` with `;;` separator.
- Service card popup labels: `SERVICE_MODAL_LABEL_*`, `SERVICE_MODAL_CLOSE_*`.
- Trust section: `TRUST_TITLE_*`, `TRUST_SUBTITLE_*`, `TRUST_STATS_*` using `Value||Label` with `;;`.
- Service area list: `SERVICE_AREA_TITLE_*`, `SERVICE_AREA_SUBTITLE_*`, `SERVICE_CITIES_*` (use `|`).
- Quote form labels/types: `FORM_*`, `SERVICE_TYPES_*` (use `|`).
- Final CTA: `FINAL_CTA_*`.
- Footer labels/social links: `FOOTER_*`, `SOCIAL_FACEBOOK_URL`, `SOCIAL_INSTAGRAM_URL`, `SOCIAL_GOOGLE_URL`.
- FAQ SEO section: `FAQ_TITLE_*`, `FAQS_*` (`Question||Answer` with `;;` separator).
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
- Language switch (EN/DE) updates all major sections and CTA messages instantly.
- Crawlable localized pages are generated at `/en/` and `/de/` with hreflang/canonical tags.
- Lead form is Netlify-compatible (`data-netlify="true"`).
- SEO includes canonical/hreflang, Open Graph, Twitter tags, geo tags, `robots.txt`, `sitemap.xml`, and JSON-LD (`Organization`, `LocalBusiness`, `WebSite`, `FAQPage`).
- `robots.txt` auto-blocks crawling when `SEO_ROBOTS` contains `noindex` (or `SITE_URL` uses `.example`).
- Netlify config includes redirect normalization (`/en`, `/de`) and hardened headers.

## Publish Checklist

Before going live, set these values in production environment variables:

1. `SITE_URL` to your real domain (for canonical + sitemap + schema URLs).
2. `PHONE_NUMBER`, `EMAIL`, `WHATSAPP_NUMBER`, and address fields.
3. `SEO_OG_IMAGE` to a real 1200x630 social image.
4. `SEO_TWITTER_SITE` to your Twitter/X handle (optional).
5. `SEO_ROBOTS=index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1` on production.
6. `STATIC_ASSET_CACHE_SECONDS` to a long cache value (for example `31536000`) and bump `ASSET_VERSION` for each release.
