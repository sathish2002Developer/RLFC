# Refex Life Sciences — Web

## Local development (Vite + API)

The Vite app proxies `/api` to the Express server. **Start the backend** (`server/`, e.g. `npm run dev`) so APIs such as `/api/geo/india-cities` and `/api/cms/...` resolve. Default API URL is `http://127.0.0.1:8080` (matches `APP_PORT` in `server/index.js`). Override with `VITE_DEV_API_ORIGIN` (full URL) or `VITE_DEV_API_PORT` (host is always `127.0.0.1` in that case).

## Geographic data (ODbL)

India city and state lists served by `GET /api/geo/india-cities` are built from the **CountryStateCity** dataset via [`@countrystatecity/countries`](https://www.npmjs.com/package/@countrystatecity/countries) (license **ODbL-1.0**). If you reuse or publish derived geographic data, you must comply with the [Open Database License](https://opendatacommons.org/licenses/odbl/) attribution and share-alike requirements. The site footer includes a short attribution line for end users.

## Environment (contact → Kissflow)

- **`KISSFLOW_WEBHOOK_URL`** — Production should set this to your Kissflow integration URL. If unset, the server uses the configured default (server-side only; never bundled in the client).
- **`WEBSITE_NAME`** — Display name for webhook payloads (e.g. `Refex Life Sciences`). Used to build `submissionId` slug and `Website_and_form`.

## Email (SMTP)

Contact form notifications use **Nodemailer**. If **`SMTP_USER`** / **`SMTP_PASS`** are missing or left as the placeholder user, outbound mail is **skipped** and the API still returns success (Kissflow webhook still runs). For real mail, set at minimum:

- `SMTP_HOST` (e.g. `smtp.gmail.com`)
- `SMTP_PORT` (e.g. `587`)
- `SMTP_USER`, `SMTP_PASS` (app password for Gmail, etc.)

The reCAPTCHA widget showing “testing purposes only” means the site uses **Google test keys** in the frontend; replace with your domain’s keys in production (the server does not verify the token today—only checks presence).
