# Premier League Hub

A comprehensive Premier League tracking application built with Next.js, featuring real-time match data, team information, standings, and personalized favorites management.

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 15.3.3](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) with Radix UI primitives
- **Icons**: [Lucide React](https://lucide.dev)
- **Animations**: Custom CSS animations with tw-animate-css

### Backend & Data
- **API**: [TheSportsDB](https://www.thesportsdb.com) for Premier League data
- **State Management**: React hooks with custom state management
- **Data Persistence**: LocalStorage for favorites and preferences

### Development
- **Package Manager**: pnpm
- **Development Server**: Next.js with Turbopack
- **Type Safety**: Full TypeScript implementation
- **Code Quality**: ESLint configuration

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── favorites/         # Favorite teams page
│   ├── matches/           # Match details and history
│   ├── schedule/          # Upcoming matches schedule
│   ├── standings/         # League table and standings
│   ├── teams/             # Team profiles and details
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── match-card.tsx    # Match display component
│   ├── navigation.tsx    # Main navigation
│   ├── player-card.tsx   # Player information card
│   └── team-card.tsx     # Team display component
├── hooks/                # Custom React hooks
│   └── use-favorites.ts  # Favorites management hook
├── lib/                  # Utility functions and API
│   ├── api.ts           # TheSportsDB API integration
│   ├── favorites.ts     # Favorites management utilities
│   └── utils.ts         # General utility functions
└── types/               # TypeScript type definitions
    └── index.ts         # API response types and interfaces
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18.0 or later
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd premier-league-hub
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint
```

## 🚀 Deployment

### Vercel (Recommended)
The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy with automatic builds

### Manual Deployment
```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [TheSportsDB](https://www.thesportsdb.com) for providing comprehensive sports data
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- [Vercel](https://vercel.com) for hosting and deployment platform
- Premier League for the amazing football content

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ for Premier League fans in Indonesia
