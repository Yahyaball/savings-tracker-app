# Savings Tracker

A savings-goal tracker built with Nuxt 4, Appwrite, and Tailwind CSS. Users can create goals, add deposits, follow progress on the dashboard, and manage their account. This project was built from the Frontend Mentor savings tracker challenge and is intended as a portfolio piece.

## Features

- Email/password authentication with sign-up, login, logout, password recovery, and route guards
- Account menu with profile editing (name/email) and password changes
- Create, edit, and delete savings goals with an optional deadline
- Add deposits with an optional note and view the full deposit history
- Dashboard totals for savings, active goals, and completed goals
- Monthly deposits chart for the last 12 months
- Filter goals by status and sort by deadline, progress, amount saved, name, or creation date
- Goal cards with animated progress, completion badges, and deadline information
- Responsive layout with keyboard-accessible dialogs, focus restoration, and live-region announcements
- Reduced-motion support

## Tech stack

- [Nuxt 4](https://nuxt.com/) with Vue 3 and TypeScript
- [Appwrite](https://appwrite.io/) Auth and TablesDB (Web SDK)
- [Tailwind CSS 4](https://tailwindcss.com/) and Tailwind Variants
- [Zod](https://zod.dev/) for input validation
- [Motion for Vue](https://motion.dev/) and Auto Animate
- [Bun](https://bun.sh/) for local scripts

## Getting started

### 1. Install dependencies

```bash
bun install
```

### 2. Create the Appwrite resources

Create an Appwrite project, then create a database and a table named `goals` with these columns:

| Column | Type | Notes |
| --- | --- | --- |
| `name` | String | Goal name |
| `target` | Float | Target amount, greater than 0 |
| `deadline` | DateTime | Optional |
| `deposits` | String | JSON-encoded array of deposits |
| `userId` | String | Appwrite user ID |

Recommended permissions:

- Table: allow the `users` role to create rows.
- Rows: grant the owning user read, update, and delete permissions. The app creates each row with these permissions.

The dashboard and goal detail routes are rendered client-side because the Appwrite Web SDK stores sessions in `localStorage`.

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your project values:

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `NUXT_PUBLIC_APPWRITE_ENDPOINT` | Appwrite API endpoint, for example `https://fra.cloud.appwrite.io/v1` |
| `NUXT_PUBLIC_APPWRITE_PROJECT_ID` | Appwrite project ID |
| `NUXT_PUBLIC_APPWRITE_PROJECT_NAME` | Appwrite project display name |
| `NUXT_PUBLIC_APPWRITE_DATABASE_ID` | Database containing the goals table |
| `NUXT_PUBLIC_APPWRITE_GOALS_TABLE_ID` | Goals table ID (usually `goals`) |

The legacy `APPWRITE_*` names are still accepted locally, but use the `NUXT_PUBLIC_*` names for deployment.

### 4. Add a web platform

In the Appwrite Console, add `localhost` as a Web platform for local development. Add your deployed site hostname as another Web platform before testing authentication in production.

### 5. Run the app

```bash
bun run dev
```

## Deploying to Appwrite Sites

1. Add the `NUXT_PUBLIC_APPWRITE_*` variables under **Site settings → Environment variables**.
2. Add the deployed site hostname as a **Web platform** in the Appwrite project. Authentication requests are blocked otherwise.
3. Use the Nuxt preset settings: install `bun install`, build `bun run build`, output `.output`.
4. Redeploy after changing environment variables. Appwrite only applies variable changes to new deployments.
5. Do not create custom variables with the `APPWRITE_` prefix on Appwrite Sites. Appwrite reserves that prefix for injected variables such as `APPWRITE_SITE_API_ENDPOINT` and `APPWRITE_SITE_PROJECT_ID`.

The runtime config falls back to the injected `APPWRITE_SITE_API_ENDPOINT` and `APPWRITE_SITE_PROJECT_ID` when the public variables are absent, but setting the `NUXT_PUBLIC_*` values explicitly is recommended.

### Troubleshooting

**`Endpoint must be a valid string`**

The Appwrite client was created without a usable endpoint. This usually means the production environment variables were missing or the site was not redeployed after adding them. Set `NUXT_PUBLIC_APPWRITE_ENDPOINT` and `NUXT_PUBLIC_APPWRITE_PROJECT_ID` in the Appwrite Site settings, confirm the deployed site domain is registered as a Web platform, then redeploy.

**Authentication works locally but fails after deployment**

Check that:

- `NUXT_PUBLIC_APPWRITE_ENDPOINT` uses the public API endpoint for your Appwrite region.
- The deployed hostname is listed as a Web platform.
- The site was redeployed after the environment variables were added.
- The Appwrite project allows the authentication method being used.

## Scripts

```bash
bun run dev       # Start the development server
bun run build     # Build for production
bun run preview   # Preview the production build
bun run generate  # Generate a static build
```

## Project structure

```text
app/
  components/     Shared UI, dialogs, navigation, goal cards
  composables/    Auth, goals/data access, count-up, live announcements
  layouts/        Nuxt layouts
  middleware/     Auth and guest route guards
  pages/          Dashboard, goal detail, and auth pages
  plugins/        Appwrite client initialization
  types/          Shared TypeScript types
  utils/          Validation schemas and savings helpers
```

## Accessibility

- Dialogs use labelled titles, labelled close buttons, focus restoration, and Escape-to-close behavior.
- Goal and deposit changes are announced through a polite live region.
- Progress bars expose accessible values.
- Interactive elements have visible focus styles.
- Animations respect `prefers-reduced-motion`.

## Known limitations

- Currency is fixed to USD.
- Deposits are stored as JSON in a text column and updated with a read-modify-write request; concurrent updates can overwrite each other.
- There is no email-verification page. Email changes reset Appwrite's verification status, and the UI marks the address as unverified.
- No demo seed data or screenshot is included yet.

## Acknowledgements

Built as a solution to a [Frontend Mentor](https://www.frontendmentor.io/) challenge.
