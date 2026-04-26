# Carecube — Healthcare Resource Transparency Platform

## Quick Start

```bash
npx create-react-app carecube
cd carecube
# Replace the src/ folder with this project's src/
npm start
```

## Project Structure

```
src/
├── context/
│   └── ThemeContext.jsx        # OS theme detection + manual override (System/Light/Dark)
│
├── data/
│   └── mockData.js             # All hospitals, allocations, requests, tracking steps
│
├── hooks/
│   └── useHospitalFilter.js    # Reusable filter logic for location + resource availability
│
├── components/
│   ├── ui/
│   │   ├── Badge.jsx           # Status/priority badge with dot indicator
│   │   ├── StatCard.jsx        # KPI card with icon, value, subtitle
│   │   ├── ResourceBar.jsx     # Animated progress bar for resource utilisation
│   │   ├── DonutChart.jsx      # SVG donut chart for utilisation %
│   │   ├── Sparkline.jsx       # Mini area chart for trends
│   │   └── PasswordField.jsx   # Password input with strength meter + criteria panel
│   │
│   ├── GlobalStyles.jsx        # Theme-aware CSS injected via <style> tag
│   ├── Nav.jsx                 # Top navigation bar with ThemeToggle
│   ├── ThemeToggle.jsx         # System / Light / Dark dropdown
│   ├── PageShell.jsx           # Page wrapper with title, subtitle, action slot
│   └── HospitalFilterBar.jsx   # Location + resource availability filter panel
│
├── pages/
│   ├── HomePage.jsx            # Landing page with hero, stats bar, features
│   ├── LoginPage.jsx           # Role selection + auth form with password validation
│   ├── DashboardPage.jsx       # Role-router → Admin / Hospital / NGO dashboard
│   ├── HospitalsPage.jsx       # Hospital directory with full filter UI
│   ├── AllocationsPage.jsx     # Allocation log table
│   ├── RequestsPage.jsx        # Incoming/outgoing resource requests
│   ├── TrackingPage.jsx        # End-to-end delivery timeline
│   └── AlertsPage.jsx          # System notifications
│
└── App.jsx                     # Root: ThemeProvider wraps router
```

## Features

- **System theme detection** — reads `prefers-color-scheme`, updates in real time
- **Manual override** — System / Light / Dark toggle in nav, persisted to localStorage
- **Hospital filter** — filter by State, City, Status, and all 4 resource types (beds, ventilators, oxygen, blood) with range sliders
- **Role-based dashboards** — Admin, Hospital, NGO each see different views and nav links
- **Password strength meter** — 6-criteria checklist, animated strength bar
- **Resource tracking timeline** — step-by-step delivery status
