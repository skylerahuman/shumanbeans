# Wedding Automation & Interactive Features 💕

> **Shumanbeans Wedding Website** - Intelligent automation and interactive experiences for our special day

## 🎭 Interactive Features Overview

The Shumanbeans wedding website includes several automated and interactive features designed to enhance the guest experience and streamline wedding planning.

### Core Interactive Components

```
Wedding Feature Architecture:
├── RSVP Automation System     # Guest response processing
├── Date Polling Engine        # Collaborative date selection
├── Real-time Game Platform    # Entertainment for guests
├── Guest Management System    # Attendance and preferences tracking
└── QR Code Generation         # Dynamic invitation sharing
```

## 🎯 Automated Wedding Features

### 1. RSVP Processing System

**Location**: `/api/intent` with RSVP-specific handling  
**Purpose**: Automated guest response management

**Capabilities:**

- 📝 **Response Collection** - Capture guest attendance confirmations
- 🍽️ **Dietary Tracking** - Automatic dietary restriction logging
- 📊 **Attendance Analytics** - Real-time guest count tracking
- 📧 **Confirmation Emails** - Automated thank you messages

**Example RSVP Request:**

```json
{
  "intent": "RSVP for John and Jane Smith, attending with 2 guests, vegetarian meals needed"
}
```

### 2. Date Polling Agent

**Location**: `/date-poll` route  
**Purpose**: Collaborative wedding date selection

**Features:**

- **Availability Collection** - Gather guest availability preferences
- **Conflict Resolution** - Identify optimal dates for maximum attendance
- **Real-time Updates** - Live polling results for family coordination
- **Decision Analytics** - Data-driven date recommendation

### 3. Guest Entertainment System

**Location**: `/hackbox` route  
**Purpose**: Interactive games and activities for wedding guests

**Components:**

- `HackboxLobby.svelte` - Guest check-in and game room setup
- `HackboxQuestion.svelte` - Wedding trivia and couple questions
- `HackboxTimer.svelte` - Timed activities and photo challenges
- `HackboxVoting.svelte` - "Best wishes" voting and selection
- `HackboxGame.svelte` - Main entertainment orchestration

**Game Types:**

- 💝 **Couple Trivia** - How well do guests know the couple?
- 📸 **Photo Challenges** - Scavenger hunt style activities
- 🗳️ **Wish Voting** - Guests vote on best wedding wishes
- 🎵 **Music Requests** - Collaborative reception playlist building

## 🤖 Wedding Planning Automation

### Guest Communication Bot

Automated responses for common wedding inquiries:

```javascript
// Wedding-specific intent processing
if (intent.toLowerCase().includes("rsvp")) {
  actions = [
    "Processing RSVP response...",
    "Updating guest list...",
    "Sending confirmation email...",
    "RSVP recorded successfully ✓",
  ];
  result = "Thank you for your RSVP! We can't wait to celebrate with you.";
}
```

### Vendor Coordination

Automated scheduling and communication:

- **Photographer Scheduling** - Optimal timeline coordination
- **Catering Management** - Guest count and dietary updates
- **Venue Communication** - Setup and logistics automation
- **Music Coordination** - Playlist and timing management

## 🎨 Wedding UI Components

### Design System

The interactive features use a romantic color palette:

```css
/* Wedding Color Palette (replacing kairos-* classes) */
.text-wedding-gold        /* Elegant gold accents */
/* Elegant gold accents */
/* Elegant gold accents */
/* Elegant gold accents */
.text-wedding-blush       /* Soft romantic pink */
.text-wedding-sage        /* Natural sage green */
.text-wedding-cream       /* Warm cream backgrounds */
.text-wedding-charcoal; /* Sophisticated dark text */
```

### Interactive Elements

- **QR Code Generator** - Dynamic invitation and info sharing
- **Real-time Polling** - Live guest preference collection
- **Photo Gallery** - Automated memory timeline
- **Guest Guestbook** - Digital signature collection

## 🔧 Development & Customization

### Adding Wedding Features

1. **Create New Wedding Components**:

```typescript
// WeddingFeature.svelte
<script lang="ts">// Wedding-specific logic</script>
```

2. **Extend Guest Management**:

```javascript
// In server.js
app.post("/api/wedding-feature", (req, res) => {
  // Handle wedding-specific requests
});
```

3. **Real-time Guest Interaction**:

```typescript
// Socket.IO for live wedding updates
io.on("connection", (socket) => {
  socket.on("guest_action", (data) => {
    // Broadcast to other wedding guests
  });
});
```

### Database Schema for Wedding Data

```sql
-- Guest management
CREATE TABLE wedding_guests (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  attending BOOLEAN,
  guest_count INTEGER,
  dietary_restrictions TEXT,
  rsvp_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Wedding polls and decisions
CREATE TABLE wedding_polls (
  id INTEGER PRIMARY KEY,
  poll_type TEXT,
  guest_id INTEGER,
  response TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Game scores and activities
CREATE TABLE wedding_games (
  id INTEGER PRIMARY KEY,
  game_type TEXT,
  guest_name TEXT,
  score INTEGER,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Running Wedding Features

### Development Mode

```bash
# Start the wedding website with all interactive features
npm run dev

# Start the backend for RSVP and game automation
node server.js
```

### Wedding Day Deployment

```bash
# Build for wedding day
npm run build

# Deploy with guest interaction features
./deploy.sh
```

## 📱 Guest Experience Features

### Mobile-First Design

All interactive wedding features are optimized for:

- **Guest Mobile Devices** - Easy RSVP on phones
- **Tablet Check-ins** - Wedding day registration
- **Large Displays** - Reception slideshow and games

### Real-time Updates

- **Live Guest Count** - Real-time attendance tracking
- **Game Leaderboards** - Live scoring during reception
- **Photo Stream** - Live wedding photo sharing
- **Message Board** - Real-time guest well-wishes

## 💐 Wedding-Specific Automation

### Pre-Wedding

- [ ] **Save the Date** automation - Email scheduling
- [ ] **Invitation Tracking** - RSVP deadline reminders
- [ ] **Vendor Coordination** - Automated status updates
- [ ] **Guest Preferences** - Dietary and seating optimization

### Wedding Day

- [ ] **Check-in Automation** - QR code guest registration
- [ ] **Photo Collection** - Automated guest photo gathering
- [ ] **Timeline Management** - Event scheduling and reminders
- [ ] **Music Requests** - Live DJ playlist updates

### Post-Wedding

- [ ] **Thank You Notes** - Automated personalized messages
- [ ] **Photo Sharing** - Guest photo distribution
- [ ] **Memory Book** - Automated compilation of wedding moments

---

**Made with 💕 for the Shumanbeans** - Where technology meets love
