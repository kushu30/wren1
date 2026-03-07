# wren-web

Landing page for the Wren AI Security Gateway.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Google Fonts: Syne (display) + DM Sans (body) + JetBrains Mono (code)

## Setup

```bash
cd wren-web
npm install
npm run dev
```

Opens on http://localhost:3000

## Structure

```
wren-web/
├── app/
│   ├── layout.tsx       # Root layout + font imports
│   ├── page.tsx         # Home page (assembles sections)
│   └── globals.css      # Global styles + animations
├── components/
│   ├── Navbar.tsx       # Sticky nav with mobile menu
│   ├── Hero.tsx         # Hero + live attack log mockup
│   ├── HowItWorks.tsx   # Architecture + pipeline breakdown
│   ├── Features.tsx     # 6 feature cards
│   ├── DemoSection.tsx  # 4-step onboarding + CTA
│   └── Footer.tsx       # Footer
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Integration Notes

- `/signup` and `/login` routes need to be built — these link to the FastAPI auth backend
- API key generation: `POST /auth/generate-key` with `X-Wren-Token: <JWT>` header
- The SDK install + API key flow matches what's shown in the demo section

## Next Steps (auth backend)

1. FastAPI routes: `/auth/signup`, `/auth/login`, `/auth/api-keys`, `/auth/generate-key`
2. SQLite tables: `users`, `api_keys`
3. JWT via `python-jose`, bcrypt via `passlib`
4. Gateway reads `X-Wren-Key` header and validates against `api_keys` table
