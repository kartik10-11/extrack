# Ledger — Personal Budget Tracker

A full-stack personal finance app: log income/expenses, set category budgets,
visualize spending, and split shared expenses with a group. Built with
**MongoDB + Express + React + Node (MERN)**.

## How the pieces fit together

```
Browser (React)  ──HTTP/JSON──▶  Express API  ──Mongoose──▶  MongoDB
   :5173                            :5000                    (Atlas)
```

- **React (frontend/)** renders the UI and calls the API for data. It holds
  no business logic about money — it just displays whatever the API gives it.
- **Express (backend/)** exposes URLs like `POST /api/transactions`. Each
  route checks who's logged in (via JWT), then reads/writes MongoDB.
- **MongoDB** stores everything as JSON-like documents — a natural fit since
  your data (a transaction, a budget, a group) is naturally document-shaped.
- **JWT (JSON Web Token)** is how the backend recognizes you without a
  database lookup on every request: when you log in, the server hands you a
  signed token; your browser attaches it to every future request; the server
  verifies the signature instead of checking a session table.

## Project structure

```
budget-tracker/
├── backend/
│   ├── models/        Mongoose schemas (User, Transaction, Budget, Group...)
│   ├── routes/        Express routes — one file per resource
│   ├── middleware/     auth.js verifies the JWT on protected routes
│   ├── utils/balances.js   the Splitwise-style balance calculation
│   └── server.js       wires it all together
└── frontend/
    └── src/
        ├── api.js              axios client, attaches your JWT automatically
        ├── context/AuthContext.jsx   login/register/logout + saved user
        ├── components/         reusable pieces (forms, tables, charts)
        └── pages/              one file per route (Dashboard, Transactions...)
```

## How each requirement is covered

| Requirement | Where |
|---|---|
| Add/edit/delete transactions, filter by date/type/category | `transactionRoutes.js`, `Transactions.jsx` |
| Category budgets + progress tracking | `budgetRoutes.js`, `Budgets.jsx`, `BudgetCard.jsx` |
| Pie / bar / line charts | `Charts.jsx` (Recharts), aggregated in `Dashboard.jsx` |
| Summaries: income, expenses, net, % of budget used | `Dashboard.jsx`, `BudgetCard.jsx` |
| Structured storage + CRUD | MongoDB via Mongoose models |
| Login/signup | `authRoutes.js` (bcrypt + JWT), `Login.jsx` / `Register.jsx` |
| Group expenses, splitting, balances, settlements | `groupRoutes.js`, `utils/balances.js`, `GroupDetail.jsx` |

## Run it locally

### 1. Get a free MongoDB database
1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Create a free (M0) cluster.
3. Under **Database Access**, create a user with a password.
4. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere) so it's reachable while you develop.
5. Click **Connect → Drivers**, copy the connection string — it looks like
   `mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/`.

### 2. Backend
```bash
cd backend
cp .env.example .env
# edit .env: paste your MONGO_URI, and set JWT_SECRET to any long random string
npm install
npm run dev
```
You should see `MongoDB connected` and `Server running on port 5000`.

### 3. Frontend (in a second terminal)
```bash
cd frontend
npm install
npm run dev
```
Open the URL it prints (usually `http://localhost:5173`). Register an
account and start adding transactions.

**Why no CORS errors locally?** `vite.config.js` proxies any request to
`/api` over to `http://localhost:5000`, so the browser thinks it's talking
to itself. In production this proxy doesn't exist, which is why the backend
also has `cors()` configured with your real frontend URL.

## Deploy it for free

### 1. Database — you already have MongoDB Atlas from setup above.
For production, in **Network Access** you can restrict the IP allowlist to
just your hosting provider's IPs (optional, but more secure than `0.0.0.0/0`).

### 2. Backend → Render
1. Push this project to a GitHub repo.
2. On [render.com](https://render.com), **New → Web Service**, connect the repo.
3. Root directory: `backend`. Build command: `npm install`. Start command: `npm start`.
4. Add environment variables: `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` (you'll
   fill this in after step 3, once you know your Vercel URL).
5. Deploy. Note the URL Render gives you, e.g. `https://ledger-api.onrender.com`.

### 3. Frontend → Vercel
1. On [vercel.com](https://vercel.com), **New Project**, import the same repo.
2. Root directory: `frontend`. Framework preset: Vite.
3. Add environment variable: `VITE_API_URL = https://ledger-api.onrender.com/api`.
4. Deploy. Note the URL Vercel gives you, e.g. `https://ledger.vercel.app`.

### 4. Connect them
Go back to Render → your backend's environment variables → set
`CLIENT_URL = https://ledger.vercel.app` (no trailing slash) → redeploy.
This tells the backend's CORS policy to trust requests from your live frontend.

Open your Vercel URL — you're live and publishable.

## Ideas for extending it (good for the "Innovation" grading criteria)
- CSV/JSON export of transactions (the spec lists this as optional)
- Recurring transactions (rent, subscriptions) that auto-log monthly
- Dark mode toggle
- Email/password reset flow
- Custom (unequal) splits in group expenses — the data model already
  supports arbitrary `splits`, the UI currently only builds equal ones
