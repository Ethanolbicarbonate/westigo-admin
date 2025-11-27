[![Westigo Admin Logo](src/assets/westigo_admin_logo.svg)](https://github.com/ethanolbicarbonate/westigo-admin)

The centralized administrative control panel for the Westigo ecosystem.
Manage West Visayas State University (WVSU) campus facilities, spaces, and events seamlessly.

[Key Features](#-key-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Configuration](#configuration)

---

## 📋 Overview

Westigo Admin is a modern, responsive single-page application designed for WVSU administrators. It serves as the backend content management system for the Westigo mobile application, enabling real-time updates to campus maps, building directories, and event schedules. Built with React and Vite, it leverages Supabase for a robust and scalable backend infrastructure.

## ✨ Key Features

### Admin Authentication
* **Secure login system** utilizing Supabase Auth.
* **Role-based access control** ensuring only authorized personnel can access the dashboard.

### Interactive Dashboard
* **At-a-glance statistics** for total facilities, spaces, and active events.
* Quick action shortcuts and a feed of upcoming scheduled activities.

### Campus Facility Management
* **CRUD operations** for campus buildings and landmarks.
* **Integrated Map Picker:** Uses Leaflet/OpenStreetMap to precisely pin facility locations and capture geolocation data (latitude/longitude) automatically.

### Space & Room Management
* Granular management of rooms, offices, and areas within facilities.
* **Hierarchical linking** ensures every space is correctly associated with a parent facility.

### Event Administration
* Comprehensive event scheduling system.
* **Audience targeting** (e.g., specific colleges, year levels).
* Image uploading for event banners.

### Master Lists
* Unified, nested view of the entire campus structure (Facility > Spaces) for easy auditing.

## 🛠️ Tech Stack

### Frontend Core
* **Framework:** React 19 + Vite
* **Styling:** Tailwind CSS & Material UI (MUI)
* **State Management:** Context API & Zustand
* **Routing:** React Router DOM v7

### Data & Backend
* **BaaS:** Supabase (Auth, Database, Storage, Realtime)
* **Data Fetching:** Custom Service Layer

### Utilities & Libraries
* **Forms:** React Hook Form + Zod (Validation)
* **Maps:** React Leaflet & Leaflet
* **UI Components:** Headless UI, Lucide React (Icons)
* **Notifications:** React Toastify
* **Dates:** date-fns

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn
* A Supabase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ethanolbicarbonate/westigo-admin.git
   cd westigo-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   Create a `.env` file in the root directory based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

### Configuration

Open your `.env` file and add your Supabase credentials:

```properties
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note:** Ensure your Supabase project has the required tables (`facilities`, `spaces`, `events`, `users`) and Storage buckets (`facilities`, `spaces`, `events`) set up.

### Running the App

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### 📦 Build for Production

To create a production-ready build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

## 📂 Project Structure

```text
src/
├── assets/          # Static assets (images, logos, svgs)
├── components/      # Reusable UI components
│   ├── common/      # Generic components (MapPicker, etc.)
│   ├── events/      # Event-specific forms/dialogs
│   ├── facilities/  # Facility-specific forms/dialogs
│   ├── layout/      # Layout components (Sidebar, Header)
│   ├── spaces/      # Space-specific forms/dialogs
│   └── ui/          # Core UI elements (Button, Card, Input, Modal)
├── config/          # Configuration files (Supabase, Theme)
├── context/         # React Context providers (Auth)
├── hooks/           # Custom React hooks
├── pages/           # Main route pages (Dashboard, Facilities, etc.)
├── services/        # API service layer for Supabase interactions
├── utils/           # Helper functions, constants, and validators
├── App.jsx          # Root component and Routing
└── main.jsx         # Entry point
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

***

_Built with 💙 by the Westigo Development Team_

