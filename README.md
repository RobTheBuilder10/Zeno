# ZENO - Personal Finance Operating System

An AI-powered personal finance platform that turns financial chaos into clarity. Zeno organizes your finances, explains what's happening in plain language, and guides you with simple next actions.

## Features

- **Financial Dashboard** - See your complete financial picture at a glance
- **AI Insights (Zeno Brain)** - Personalized analysis and recommendations
- **Action Queue** - 1-3 high-impact next steps to improve your finances
- **Goals Tracking** - Track progress toward savings and debt payoff goals
- **Bills Management** - Never miss a payment with bill tracking
- **Debt Payoff** - Visualize and plan your path to debt freedom
- **World Layer** - Elegant progress visualization (optional)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Prisma
- **Authentication**: Clerk
- **State Management**: TanStack Query
- **Validation**: Zod
- **UI Components**: Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account (for authentication)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/zeno.git
cd zeno
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - From Clerk dashboard
- `CLERK_SECRET_KEY` - From Clerk dashboard

5. Initialize the database:
```bash
npm run db:generate
npm run db:push
```

6. (Optional) Seed demo data:
```bash
npm run db:seed
```

7. Start the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   └── api/               # API routes
├── components/
│   ├── ui/                # Design system components
│   ├── dashboard/         # Dashboard-specific components
│   └── ...
├── lib/
│   ├── db.ts              # Prisma client
│   ├── utils.ts           # Utility functions
│   └── validations/       # Zod schemas
├── services/
│   └── zeno-brain/        # AI insight generation
└── types/                 # TypeScript types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with demo data

## Environment Variables

See `.env.example` for all required environment variables.

## Design Principles

- **Minimal & Premium**: Clean typography, lots of whitespace, strong hierarchy
- **Mobile-First**: Optimized for iPhone, stunning on desktop
- **No Judgment**: Never guilt-trips, reframes mistakes as data
- **Calm & Clear**: Zeno's voice is supportive, direct, and encouraging

## Contributing

Contributions are welcome! Please read our contributing guidelines first.

## License

MIT
