

# NutriCare

NutriCare is a simple nutrition and fitness dashboard prototype built with React, Vite, TypeScript, shadcn-ui, and Tailwind CSS. It provides a foundation for tracking meal plans, workouts, and wellness insights.

---

## Features

- Modern, responsive UI with reusable components
- Pages for meal plans, progress, insights, and more
- Ready for Supabase integration (auth/data)
- Easy to extend and customize

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

```sh
git clone https://github.com/VarunPahuja/NutriCare.git
cd NutriCare
npm install
```

### Running Locally

```sh
npm run dev
```
Visit `http://localhost:8080` in your browser.

---

## Project Structure

- `src/pages/` — Main app pages (MealPlans, Progress, etc.)
- `src/components/` — Reusable UI components
- `src/integrations/supabase/` — Supabase client setup (to be configured)
- `src/services/` — Service files for data logic

---

## Deployment

Build for production:

```sh
npm run build
```
Deploy the `dist` folder to Vercel, Netlify, or your preferred static host.

---

## Custom Domain

Most static hosts allow you to connect a custom domain. Refer to your host’s documentation.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.
