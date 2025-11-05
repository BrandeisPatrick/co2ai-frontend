# 🌱 CO2AI Frontend - Wet Lab Equipment Emissions Monitoring

[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-38b2ac?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> A modern, responsive dashboard for real-time wet lab equipment emissions monitoring with comprehensive analytics and inventory management.

---

## ✨ Key Features

### 📊 Dashboard
- **Real-time Monitoring** - Track CO₂ emissions, active equipment, efficiency scores, and energy consumption
- **Interactive Charts** - Visualize monthly emissions trends and top equipment by emissions
- **Predictive Alerts** - Get notified about maintenance needs and optimization opportunities
- **Month-over-Month Analytics** - Compare current and previous month metrics with percentage changes

### 🔧 Equipment Inventory
- **List/Grid View Toggle** - Switch between 3-column responsive grid and sortable table views
- **Equipment Search** - Filter by name, type, manufacturer, or equipment ID
- **Faulty Equipment Tracking** - Visual indicators with error messages for equipment needing maintenance
- **Color-Coded Status Badges** - Active 🟢 | Idle 🟡 | Maintenance 🟠 | Offline ⚫ | Faulty 🔴
- **Sortable Columns** - Click headers to sort any equipment attribute
- **Persistent Preferences** - Remember view preference across sessions

### 📈 Analytics
- **Time Range Selection** - Toggle between Week, Month, or Year views
- **Dual Metrics Tracking** - Monitor emissions (📉 line chart) and consumption (📊 bar chart)
- **Smart Unit Scaling** - Auto-converts MWh/kWh and tCO₂e/kgCO₂e based on magnitude
- **Daily Data Points** - Month view shows 30 individual days for granular analysis
- **Comprehensive Statistics** - Totals and averages with context-aware formatting

### 💾 Data Management
- **Internal Database** - Centralized data store with observer pattern for reactive updates
- **Time Series Aggregation** - 90 days of historical data with daily, weekly, and monthly aggregates
- **Realistic Mock Data** - Historical data generation with:
  - 📅 Weekend/weekday variations (30% reduction on weekends)
  - 📈 Seasonal trends (10% growth over 90 days)
  - 🎲 Natural daily fluctuations (±15% variation)
- **Data Consistency** - Dashboard and Analytics use unified time series source

### 🎨 User Experience
- **Dark Theme** - Professional dark UI, easy on the eyes
- **Responsive Design** - Perfect on desktop 💻, tablet 📱, and mobile 📱
- **Real-time Sync** - Manual sync button with loading states
- **Error Handling** - Graceful error messages with retry functionality

---

## 🛠 Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 18 |
| **TypeScript** | Type Safety | 5.0+ |
| **Vite** | Build Tool | 5.4+ |
| **Tailwind CSS** | Styling | 3.0+ |
| **Recharts** | Data Visualization | Latest |
| **React Router** | Navigation | v6 |
| **@tanstack/react-table** | Table Functionality | Latest |
| **Lucide React** | Icons | Latest |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 16+
- **npm** or **yarn**

### Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/BrandeisPatrick/co2ai-frontend.git
cd co2ai-frontend

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start development server
npm run dev

# 4️⃣ Open in browser
# Visit http://localhost:5173
```

---

## 📋 Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint and type checking
npm run lint
```

---

## 📁 Project Structure

```
src/
├── 📄 components/
│   ├── 📊 dashboard/
│   │   ├── StatCard.tsx              # KPI metric cards
│   │   ├── MonthlyEmissionsTrend.tsx # Trend line chart
│   │   ├── TopEquipmentChart.tsx     # Top 5 equipment bar chart
│   │   └── PredictiveAlerts.tsx      # Alert cards
│   ├── 🔧 equipment/
│   │   ├── EquipmentCard.tsx         # Grid view card component
│   │   ├── EquipmentTable.tsx        # List view table (@tanstack/react-table)
│   │   └── ViewToggle.tsx            # Grid/List toggle buttons
│   └── 🎨 layout/
│       ├── Sidebar.tsx               # Navigation sidebar
│       └── DashboardLayout.tsx       # Main layout wrapper
├── 📄 pages/
│   ├── Dashboard.tsx                 # Dashboard page
│   ├── EquipmentInventory.tsx        # Equipment inventory page
│   └── Analytics.tsx                 # Analytics page
├── 📄 services/
│   ├── api.ts                        # Mock API & equipment data
│   ├── dataStore.ts                  # Internal database with observer pattern
│   └── mockTimeSeriesDb.ts           # 90-day historical data generation
├── 🎯 hooks/
│   └── useDataContext.ts             # Custom hook for data access
├── 📚 utils/
│   └── timeSeriesHelpers.ts          # Time series calculations & formatting
├── 📄 contexts/
│   └── DataContext.tsx               # Global data context provider
├── 🎨 types/
│   └── index.ts                      # TypeScript interfaces
├── App.tsx                           # App component with routing
├── main.tsx                          # React entry point
└── index.css                         # Global Tailwind CSS
```

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   React Components                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Dashboard   │  │  Equipment   │  │  Analytics   │  │
│  │              │  │  Inventory   │  │              │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
          └──────────┬───────┴──────────┬───────┘
                     │                  │
          ┌──────────▼──────────────────▼────────┐
          │     DataContext Provider              │
          │   (Global State Management)           │
          └──────────┬───────────────────────────┘
                     │
          ┌──────────▼──────────────────────────┐
          │    InternalDatabase (DataStore)     │
          │  • Observer Pattern                 │
          │  • Equipment State                  │
          │  • Historical Data                  │
          └──────────┬───────────────────────────┘
                     │
          ┌──────────▼──────────────────────────┐
          │   MockTimeSeriesDatabase            │
          │  • 90 days of history               │
          │  • Daily aggregates                 │
          │  • Realistic variations             │
          └──────────┬───────────────────────────┘
                     │
          ┌──────────▼──────────────────────────┐
          │    Equipment Data (Mock API)        │
          │  • 12 lab equipment items           │
          │  • Faulty equipment tracking        │
          └─────────────────────────────────────┘
```

---

## 📊 Data Flow

```
API/JSONBin
    ↓
Equipment Data
    ↓
DataStore (InternalDatabase)
    ├─→ Equipment List (12 items)
    └─→ MockTimeSeriesDb
        ├─→ 90 days of snapshots
        ├─→ Daily Aggregates (30 days)
        ├─→ Weekly Aggregates (12 weeks)
        └─→ Monthly Aggregates (12 months)
    ↓
DataContext (Global State)
    ├─→ Dashboard (derives metrics)
    ├─→ Equipment Inventory (filters/sorts)
    └─→ Analytics (time series visualization)
```

---

## 🎯 Recent Implementations

### ✅ FEATURE 1: Equipment Inventory List/Grid View Toggle
- Toggle between responsive grid and sortable table views
- localStorage persistence of user preference
- Faulty equipment visual indicators
- Search functionality in both views
- **Status**: ✨ Complete & Production Ready

### ✅ Time Series Data Consistency Fix
- Unified data calculation across Dashboard and Analytics
- Fixed metric discrepancies (Dashboard vs Analytics)
- Smart unit formatting (auto-scaling MWh/kWh)
- Consistent month-over-month comparisons
- **Status**: ✨ Complete & Production Ready

---

## 🔌 Equipment Status Colors

| Status | Color | Meaning |
|--------|-------|---------|
| **Active** | 🟢 Green | Equipment is operational |
| **Idle** | 🟡 Yellow | Equipment is available but not in use |
| **Maintenance** | 🟠 Orange | Equipment requires scheduled maintenance |
| **Offline** | ⚫ Gray | Equipment is not connected/powered off |
| **Faulty** | 🔴 Red | Equipment has errors and needs attention |

---

## 📊 Sample Equipment Data

The application includes 12 mock lab equipment items:

| Equipment | Type | Power Draw | Daily Emissions | Status |
|-----------|------|-----------|-----------------|--------|
| ULT Freezer #1 | Ultra-Low Freezer | 2.5 kW | 85 kg | 🟢 Active |
| ULT Freezer #2 | Ultra-Low Freezer | 2.4 kW | 82 kg | 🟢 Active |
| CO₂ Incubator Pro | CO2 Incubator | 0.8 kW | 28 kg | 🟢 Active |
| **Autoclave #4** | Autoclave | 3.2 kW | 110 kg | 🔴 **Faulty** |
| PCR Thermal Cycler | PCR Machine | 1.2 kW | 41 kg | 🟢 Active |
| Centrifuge Unit | Centrifuge | 2.1 kW | 72 kg | 🟡 Idle |
| **UV-Vis Spectro #8** | Spectrophotometer | 0.5 kW | 17 kg | 🔴 **Faulty** |
| *...and 5 more items* | - | - | - | - |

---

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```typescript
colors: {
  primary: '#your-color',
  secondary: '#your-color'
}
```

### Modify Chart Appearance
Update components in `src/components/dashboard/` and `src/pages/Analytics.tsx`

### Update Navigation
Edit `src/components/layout/Sidebar.tsx` to add/remove menu items

---

## 🚀 Production Build

```bash
# Build optimized production bundle
npm run build

# Output files in dist/ directory
# Ready for deployment to:
# • Vercel
# • Netlify
# • AWS S3 + CloudFront
# • Any static hosting service
```

### Build Statistics
- **Bundle Size**: ~671 KB (minified)
- **Gzip Size**: ~189 KB
- **Assets**: CSS, JS, HTML optimized
- **TypeScript**: Full type checking included

---

## 🔐 Security & Performance

- ✅ **Type Safety**: 100% TypeScript coverage
- ✅ **Dark Mode**: Reduces eye strain
- ✅ **Responsive**: Mobile-first design
- ✅ **Optimized**: Code-splitting ready
- ✅ **Error Handling**: Graceful fallbacks
- ✅ **Lazy Loading**: Components load on demand

---

## 📝 Next Steps / Roadmap

- [ ] FEATURE 2: Remove API Integrations page
- [ ] FEATURE 3: Reports page with CSV/PDF exports
- [ ] FEATURE 4: Enhanced Analytics with drill-down views
- [ ] Phase 2: AI/ML features (requires infrastructure)
- [ ] Real-time data updates via WebSockets
- [ ] User authentication & role-based access

---

## 📄 License

MIT © 2024 CO2AI

---

## 👨‍💻 Development

### Environment Setup
```bash
# Node.js version
node --version  # 16.0.0 or higher

# Install dependencies
npm install

# Start with hot reload
npm run dev

# Open http://localhost:5173
```

### Type Checking
```bash
# Run TypeScript compiler
npm run build  # Includes type checking via tsc
```

---

## 📞 Support

For issues, feature requests, or questions:
1. Check existing GitHub issues
2. Create a new issue with detailed information
3. Include screenshots or error messages

---

**Made with ❤️ for sustainable computing** 🌍
