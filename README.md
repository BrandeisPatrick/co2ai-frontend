# Green Bio Compute - Wet Lab Module

A modern, responsive dashboard for real-time wet lab equipment emissions monitoring.

## Features

- **Real-time Monitoring**: Track CO2 emissions, active equipment, efficiency scores, and energy consumption
- **Interactive Charts**: Visualize monthly emissions trends and top equipment by emissions
- **Predictive Alerts**: Get notified about maintenance needs and optimization opportunities
- **Dark Theme**: Easy on the eyes with a professional dark UI
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Router** for navigation
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and visit `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── StatCard.tsx
│   │   ├── MonthlyEmissionsTrend.tsx
│   │   ├── TopEquipmentChart.tsx
│   │   └── PredictiveAlerts.tsx
│   └── layout/             # Layout components
│       ├── Sidebar.tsx
│       └── DashboardLayout.tsx
├── pages/
│   └── Dashboard.tsx       # Main dashboard page
├── services/
│   └── api.ts             # API service layer
├── types/
│   └── index.ts           # TypeScript interfaces
├── App.tsx                # App component with routing
├── main.tsx              # App entry point
└── index.css             # Global styles
```

## API Integration

Currently using mock data from `src/services/api.ts`. To integrate with a real API:

1. Update the `apiService.getDashboardData()` method in `src/services/api.ts`
2. Replace the mock data with actual fetch calls to your backend
3. Update the API endpoint URLs as needed

Example:
```typescript
async getDashboardData(): Promise<DashboardData> {
  const response = await fetch('/api/dashboard', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data')
  }

  return response.json()
}
```

## Customization

### Colors
Edit `tailwind.config.js` to customize the color palette.

### Chart Styles
Modify the chart components in `src/components/dashboard/` to adjust colors, tooltips, and other visual elements.

### Navigation
Update `src/components/layout/Sidebar.tsx` to add or remove navigation items.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to be deployed to any static hosting service.

## License

MIT
