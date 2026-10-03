# BitShift Hackathon — Setup & Deployment

A deliberately small Next.js + Supabase project. No UI framework, no ORM, no state-management package, and no extra deployment service.

## Stack

- Next.js App Router
- React + TypeScript
- Supabase PostgreSQL + Auth
- Vercel
- One GitHub repository

## 1. Create Supabase project

1. Open Supabase and create a new project.
2. Go to **SQL Editor**.
3. Copy/paste `supabase/schema.sql`.
4. Run it.
5. Go to **Authentication → Users**.
6. Create one admin user with email + password.
7. Disable public sign-ups if you do not want visitors creating accounts.

> This starter uses a simple authenticated admin account. The `/admin` page is not linked as a prominent navigation item, but it is protected by Supabase database RLS. For a single-admin hackathon site, this is intentionally simpler than adding a separate roles table.

## 2. Local setup

Requirements: Node.js 20+ and Git.

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd bitshift-hackathon
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Get both values from **Supabase → Project Settings → API**.

Run:

```bash
npm run dev
```

Open `http://localhost:3000`.

Admin:

```text
http://localhost:3000/admin
```

## 3. Push to GitHub

```bash
git add .
git commit -m "Initial BitShift Hackathon website"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## 4. Deploy to Vercel

1. Open Vercel.
2. Click **Add New → Project**.
3. Import the GitHub repository.
4. Framework preset should detect **Next.js** automatically.
5. Add these Environment Variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

6. Click **Deploy**.

After deployment, every push to `main` can trigger a new Vercel deployment automatically.

## 5. Supabase Auth URL

In Supabase go to **Authentication → URL Configuration**.

Set:

- **Site URL** = your Vercel production URL.
- Add your Vercel URL to **Redirect URLs** if Supabase asks for it.

For example:

```text
https://your-project.vercel.app
```

## 6. Admin workflow

1. Visit `/admin`.
2. Sign in using the Supabase admin user.
3. Add a problem.
4. Edit a problem.
5. Delete a problem.
6. Toggle Published to control public visibility.
7. Sign out.

Public users only see published problems.

## 7. Performance / scale

For roughly 400–1000 visitors, this architecture is intentionally simple:

- Vercel serves the Next.js app.
- Supabase handles PostgreSQL and authentication.
- Public problem data is small and indexed naturally through the primary key.
- Search/filtering happens in the browser after the problem list is fetched.
- No server, Docker, Redis, or separate API service is required.

If the problem list becomes very large, move search/filtering into a server/database query later. For a normal hackathon problem list, client-side filtering is simpler.

## 8. Production checklist

- [ ] Run `npm run build` locally before pushing.
- [ ] Add only production environment variables to Vercel.
- [ ] Never commit `.env.local`.
- [ ] Create the admin user in Supabase Auth.
- [ ] Disable public sign-up if not needed.
- [ ] Test `/admin` with an unauthenticated browser.
- [ ] Test add/edit/delete after deployment.
- [ ] Test the site on a phone.

## Useful commands

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Production start:

```bash
npm run start
```

The intended deployment path is simply:

**GitHub → Vercel → Supabase**

No additional backend server is required.
