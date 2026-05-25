# 💰 Spendix — Expense Management PWA

A production-ready, installable Progressive Web App for tracking expenses, budgets and spending analytics. Built with React + Vite + Tailwind CSS, deployable to Vercel in one click.

![Spendix Screenshot](https://via.placeholder.com/1200x600/080d1a/22c55e?text=Spendix+PWA)

---

## ✨ Features

| Feature | Details |
|---|---|
| **Expense CRUD** | Add, edit, delete expenses with category, payment method, notes |
| **Dashboard** | Stats cards, budget progress, weekly bar chart, 6-month area trend |
| **Analytics** | Pie chart, category breakdown, monthly bar chart, payment methods |
| **Budget Tracking** | Per-category budgets with progress bars and over-budget alerts |
| **Google Sheets Sync** | Optional cloud database via Sheets API v4 |
| **PWA** | Installable, offline-ready, service worker, app shortcuts |
| **Dark / Light mode** | Fintech-style dark theme by default, toggleable |
| **Multi-currency** | USD, EUR, GBP, PKR, INR, AED, SAR |
| **CSV Export** | Download all expenses as a spreadsheet |
| **Responsive** | Sidebar on desktop, bottom nav on mobile |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/spendix.git
cd spendix
npm install
```

### 2. Generate PWA Icons

```bash
npm run generate-icons
```

This creates PNG icons of all required sizes in `public/icons/` from the SVG source.

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` — the app works entirely with `localStorage` out of the box. Google Sheets is optional.

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🌍 Deploy to Vercel

### Option A — Vercel CLI (fastest)

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel auto-detects Vite. Done.

### Option B — GitHub + Vercel Dashboard

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Framework preset: **Vite** (auto-detected)
5. Add environment variables from your `.env` file
6. Click **Deploy**

### Vercel Environment Variables

In the Vercel dashboard → Project → Settings → Environment Variables, add:

| Key | Value |
|---|---|
| `VITE_GOOGLE_SHEETS_API_KEY` | Your Google API key |
| `VITE_SPREADSHEET_ID` | Your spreadsheet ID |
| `VITE_SHEET_NAME` | `Expenses` (default) |
| `VITE_USE_SHEETS` | `true` to enable sync |

---

## 📊 Google Sheets Integration

### Setup Steps

1. **Create a Google Cloud project**
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project

2. **Enable the Sheets API**
   - APIs & Services → Library
   - Search "Google Sheets API" → Enable

3. **Create credentials**
   - APIs & Services → Credentials
   - **For read access (public sheets):** Create API Key, restrict to Sheets API
   - **For write access:** Create Service Account → download JSON key

4. **Create your spreadsheet**
   - Create a new Google Sheet
   - Copy the ID from the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Add header row in row 1: `ID | Amount | Description | Category | Date | PaymentMethod | Notes | CreatedAt`

5. **Share with service account**
   - Share the spreadsheet with the service account email (e.g. `spendix@project.iam.gserviceaccount.com`) as Editor

6. **Enable sync in the app**
   - Fill in your `.env` values
   - In Settings → toggle "Sync with Google Sheets"

> **⚠ Security Note:** Never commit your `.env` file. For production write operations, proxy API calls through a Vercel Edge Function to keep your service account credentials server-side only.

---

## 🗂 Project Structure

```
spendix/
├── public/
│   ├── icons/              # PWA icons (generate with npm run generate-icons)
│   │   ├── icon.svg        # Source SVG icon
│   │   └── icon-*.png      # Generated PNG icons
│   └── favicon.ico
├── scripts/
│   └── generate-icons.mjs  # Icon generator (uses sharp)
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── FieldInput.jsx
│   │   │   └── Toggle.jsx
│   │   ├── BottomNav.jsx
│   │   ├── ExpenseModal.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatCard.jsx
│   │   └── Toast.jsx
│   ├── constants/
│   │   └── index.js        # Categories, currencies, seed data
│   ├── context/
│   │   └── AppContext.jsx   # Global state, theme function
│   ├── hooks/
│   │   └── useWindowSize.js
│   ├── pages/
│   │   ├── Analytics.jsx
│   │   ├── Budget.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Expenses.jsx
│   │   └── Settings.jsx
│   ├── services/
│   │   └── sheetsApi.js    # Google Sheets REST API
│   ├── utils/
│   │   └── index.js        # Formatting, grouping, CSV export
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx            # Entry point + PWA registration
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS + inline CSS variables |
| Charts | Recharts |
| Icons | Lucide React |
| PWA | vite-plugin-pwa + Workbox |
| Database | localStorage (default) / Google Sheets API v4 |
| Deployment | Vercel |

---

## 📱 PWA Installation

After deployment, users can install Spendix:

- **Chrome / Edge:** Click the install icon in the address bar
- **Safari (iOS):** Share → Add to Home Screen
- **Android:** Browser menu → Add to Home Screen

The app supports:
- ✅ Offline access via Workbox service worker
- ✅ Background sync
- ✅ App shortcuts ("Add Expense" from home screen long-press)
- ✅ Splash screens
- ✅ Maskable icons

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server at localhost:5173 |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run generate-icons` | Generate PNG icons from `public/icons/icon.svg` |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT © Spendix Contributors
