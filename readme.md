# Search Image

A lightweight image search application built with AngularJS and Masonry that allows users to search and browse high-quality photography from the Pexels API.

The project was originally built as a frontend-only application and later modernized to use a Cloudflare Worker as a secure API proxy so that API credentials are never exposed to the browser.

## Features

- Search images from the Pexels API
- Responsive Masonry-style image layout
- Automatic image attribution
- Secure API key handling through Cloudflare Workers
- Serverless deployment on Cloudflare
- Mobile and desktop friendly

## Technology Stack

### Frontend

- AngularJS
- jQuery
- Masonry Layout
- HTML5
- CSS3

### Backend

- Cloudflare Workers
- Pexels API

### Hosting

- Cloudflare Workers Assets

---

## Architecture

### High-Level Flow

```text
User Browser
      │
      ▼
Cloudflare Worker
      │
      ├── Serves frontend assets
      │
      └── Proxies image search requests
               │
               ▼
          Pexels API
```

### Why a Proxy?

The Pexels API requires an API key.

Exposing the key in frontend JavaScript would allow anyone visiting the site to access and misuse it.

Instead, the browser sends requests to:

```text
/search
```

The Cloudflare Worker receives the request, attaches the API key securely, and forwards the request to Pexels.

The API key never reaches the browser.

---

## Project Structure

```text
searchApp/
│
├── dist/
│   ├── index.html
│   ├── app/
│   ├── content/
│
├── server.js
├── wrangler.jsonc
├── package.json
└── README.md
```

---

## Local Development

### Install Dependencies

```bash
npm install
```

### Add Pexels API Key

Create a Cloudflare Worker secret:

```bash
npx wrangler secret put PEXELS_API_KEY
```

Paste your Pexels API key when prompted.

### Run Locally

```bash
npm run dev
```

Wrangler will start a local development server.

Open the URL shown in the terminal, typically:

```text
http://localhost:8787
```

---

## Deployment

Deploy to Cloudflare:

```bash
npm run deploy
```

or

```bash
npx wrangler deploy
```

---

## Worker Configuration

The application uses a Cloudflare Worker as both:

1. Static asset host
2. API proxy

The Worker:

- Serves frontend assets from the configured assets directory
- Handles requests to `/search`
- Securely injects the Pexels API key
- Returns search results to the frontend

---

## Environment Variables

### Required Secret

```text
PEXELS_API_KEY
```

Create it with:

```bash
npx wrangler secret put PEXELS_API_KEY
```

Never commit API keys to source control.

---

## Search Endpoint

Frontend requests:

```text
/search?query=mountains&per_page=30
```

The Worker forwards the request to:

```text
https://api.pexels.com/v1/search
```

and returns the response to the browser.

---

## Future Improvements

- Infinite scrolling
- Lazy loading
- Search suggestions
- Favorites/bookmarking
- Image detail modal
- Improved mobile Masonry layout

---

## License

MIT
