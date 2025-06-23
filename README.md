# KairOS Browser Homepage

> **"One Prompt. Every Purpose."** — The intent-driven browser that guards your attention, honors your focus, and frees you from endless scrolls.

## 🎯 Project Overview

This is the marketing homepage for KairOS Browser, built with SvelteKit, TypeScript, and TailwindCSS. The design implements a scientifically-informed dark color palette to convey trust, focus, and calm competence.

## ✨ Features

- **Modern SvelteKit Architecture** with TypeScript support
- **Custom Design System** implementing the KairOS color palette
- **Interactive Components** including animated intent demonstration
- **Responsive Design** optimized for all device sizes
- **Node.js API Server** for intent processing simulation
- **Zero-dependency Frontend** with local-first approach

## 🏗️ Project Structure

```
svelte-kairos-homepage/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte      # Global layout
│   │   └── +page.svelte        # Homepage
│   ├── lib/
│   │   └── components/
│   │       ├── Hero.svelte            # Hero section with starfield
│   │       ├── FeatureCard.svelte     # Feature cards component
│   │       └── IntentShowcase.svelte  # Interactive demo
│   ├── app.html               # HTML template
│   └── app.css               # Global styles & Tailwind
├── server.js                 # Node.js Express server
├── package.json             # Dependencies & scripts
└── tailwind.config.js       # Custom KairOS color palette
```

## 🎨 Design System

### Color Palette

The design uses a scientifically-informed color palette optimized for trust and focus:

| Color | Hex | Purpose |
|-------|-----|---------|
| **Charcoal** | `#121416` | Primary background - reduces visual noise |
| **Gunmetal** | `#1F262E` | Surface panels - provides depth and stability |
| **Silver** | `#C0C5CE` | Primary text - high readability and calmness |
| **Cool Gray** | `#8A9199` | Secondary text - soft guidance |
| **Trust Blue** | `#3B82F6` | Accent color - conveys trust and professionalism |
| **Responsible Green** | `#22C55E` | Success states - reinforces confidence |
| **Warm Amber** | `#FBBF24` | Warnings - draws attention without panic |
| **Coral Red** | `#F87171` | Errors - noticeable but not alarming |

### Typography

- **Font Family**: Inter (Google Fonts)
- **Weights**: Regular (400), Semibold (600), ExtraBold (800)
- **Hierarchy**: Clear typographic scale for optimal readability

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

3. **Start the API server (in a separate terminal):**
   ```bash
   node server.js
   ```
   The API will be available at `http://localhost:3000`

### Production Build

1. **Build the SvelteKit app:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   node server.js
   ```

## 🔌 API Endpoints

### POST `/api/intent`

Process user intentions and return simulated results.

**Request:**
```json
{
  "intent": "Summarize my last 10 Slack messages"
}
```

**Response:**
```json
{
  "result": "Summary task completed",
  "actions": [
    "Gathering information...",
    "Processing content...",
    "Summary generated ✓"
  ],
  "timestamp": "2025-01-11T10:30:00.000Z",
  "status": "success"
}
```

### GET `/api/health`

Health check endpoint for monitoring.

## 🎯 Key Components

### Hero Section
- Animated starfield background
- Interactive intent prompt with blinking cursor
- Primary and secondary CTA buttons
- Responsive typography scaling

### Feature Cards
- Hover animations with glowing effects
- Custom SVG icons for each feature
- Semantic color coding
- Grid layout with responsive breakpoints

### Intent Showcase
- Live browser mockup simulation
- Animated typing effect
- Real-time results streaming
- Auto-looping demonstration

### Trust & Social Proof
- User avatar representations
- Rotating testimonials
- Social proof indicators
- Biblical reference (Ephesians 5:15-16)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run Svelte type checking
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Customization

The design system can be easily customized by modifying:

- **Colors**: `tailwind.config.js` - Update the KairOS color palette
- **Typography**: `src/app.css` - Modify font families and scales
- **Animations**: `tailwind.config.js` - Add or modify keyframes
- **Components**: `src/lib/components/` - Update individual components

## 📱 Responsive Design

The homepage is fully responsive with breakpoints optimized for:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+
- **Large Desktop**: 1440px+

## ⚡ Performance

- **Lazy Loading**: Components load as needed
- **Optimized Assets**: Compressed images and fonts
- **Minimal JavaScript**: Only essential interactivity
- **CSS Purging**: Unused Tailwind classes removed in production

## 🌟 Biblical Foundation

> *"Look carefully then how you walk, not as unwise but as wise, making the best use of the time, because the days are evil."*  
> — Ephesians 5:15-16 ESV

KairOS is built on the principle of redeeming time and using technology wisely to honor our focus and attention.

## 📄 License

© 2025 Kairōs Inc. All rights reserved.

---

**Pronounced**: /kī-ROHS/ (Greek: καιρός - "the right time" or "opportune moment") 