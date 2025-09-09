# Shumanbeans Wedding Website 💕

> **"Two hearts, one journey, endless love."** — Celebrating the love story and upcoming wedding of the Shumanbeans

## 💒 Project Overview

This is the wedding website for shumanbeans.com, built with SvelteKit, TypeScript, and TailwindCSS. The design celebrates our love story while providing guests with all the information they need for our special day.

## ✨ Features

- **Love Story Timeline** - Interactive journey through our relationship
- **Wedding Details** - Date, venue, schedule, and logistics
- **RSVP System** - Easy guest response management
- **Photo Gallery** - Sharing memories leading up to the big day
- **Gift Registry** - Links to our preferred wedding registry
- **Responsive Design** - Beautiful on all devices
- **Modern SvelteKit Architecture** with TypeScript support

## 🏗️ Project Structure

```
shumanbeans/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte      # Global layout
│   │   └── +page.svelte        # Homepage
│   ├── lib/
│   │   └── components/
│   │       ├── Hero.svelte            # Hero section with wedding info
│   │       ├── FeatureCard.svelte     # Wedding detail cards
│   │       └── IntentShowcase.svelte  # RSVP or registry showcase
│   ├── app.html               # HTML template
│   └── app.css               # Global styles & Tailwind
├── package.json             # Dependencies & scripts
├── deploy.sh                # Deployment script
└── tailwind.config.js       # Custom wedding color palette
```

## 💐 Wedding Information

### Save the Date

- **Date**: [To be announced]
- **Venue**: [To be announced]
- **Theme**: Elegant and timeless celebration of love

### Design Aesthetic

The website maintains an elegant design palette suitable for a wedding celebration while preserving the technical excellence of the original codebase.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm (recommended package manager)

### Local Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev  # launches Vite on http://localhost:5173
   ```
   
   The app will be available at `http://localhost:5173` with hot module replacement and live reload.

### Production Build

1. **Build the SvelteKit app:**

   ```bash
   npm run build
   ```

2. **Preview the production build:**
   ```bash
   npm run preview
   ```

3. **Start the production server:**
   ```bash
   npm start
   ```

### Environment Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure Google Sheets integration:**
   - Create a Google Cloud project and enable Google Sheets API
   - Create service account credentials and download JSON key
   - Extract `client_email` and `private_key` from the JSON file
   - Add these values to your `.env` file as `GOOGLE_CLIENT_EMAIL` and `GOOGLE_PRIVATE_KEY`
   - Share your Google Sheet with the service account email
   - Add the Google Sheet ID to your `.env` file

3. **Configure email service:**
   - Sign up for [Resend](https://resend.com)
   - Add your API key and FROM_EMAIL to `.env`

### Deployment (DigitalOcean)

This project deploys on [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform).

- **Build command**: `NPM_CONFIG_PRODUCTION=false npm ci && npm run build`
- **Start command**: `npm start`

## 🔌 API Endpoints

### POST `/api/rsvp`

Handle RSVP submissions from wedding guests.

**Request:**

```json
{
  "name": "John and Jane Smith",
  "email": "john.smith@email.com",
  "attending": true,
  "guests": 2,
  "dietary_restrictions": "None"
}
```

**Response:**

```json
{
  "result": "RSVP received successfully",
  "message": "Thank you for your response! We can't wait to celebrate with you.",
  "timestamp": "2025-01-11T10:30:00.000Z",
  "status": "success"
}
```

### GET `/api/health`

Health check endpoint for monitoring.

## 🎯 Key Components

### Hero Section

- Beautiful wedding-themed background
- Couple names and wedding date prominently displayed
- RSVP and registry call-to-action buttons
- Responsive typography scaling

### Information Cards

- Wedding date and time details
- Venue information with directions
- Schedule of events
- Travel and accommodation information

### RSVP System

- Simple and elegant response form
- Guest count and dietary restriction capture
- Confirmation messaging
- Email notifications

### Love Story & Gallery

- Timeline of the relationship
- Photo carousel of memorable moments
- Engagement story
- Wedding party introductions

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

- **Colors**: `tailwind.config.js` - Update the wedding color palette
- **Typography**: `src/app.css` - Modify font families and scales
- **Animations**: `tailwind.config.js` - Add or modify keyframes
- **Components**: `src/lib/components/` - Update individual components

## 📱 Responsive Design

The wedding website is fully responsive with breakpoints optimized for:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+
- **Large Desktop**: 1440px+

## ⚡ Performance

- **Lazy Loading**: Components load as needed
- **Optimized Assets**: Compressed images and fonts
- **Minimal JavaScript**: Only essential interactivity
- **CSS Purging**: Unused Tailwind classes removed in production

## 💕 Love & Gratitude

> _"Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up."_  
> — Ecclesiastes 4:9-10 ESV

Our wedding website celebrates the beautiful journey of love and the joy of two hearts becoming one.

## 📄 License

© 2025 The Shumanbeans. All rights reserved.

---

**Made with ❤️ for our special day**
