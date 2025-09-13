# Scheduler with Recurring Slots

A full-stack scheduling application that allows users to create, manage, and modify recurring weekly time slots with exception handling.

## Features

- **Recurring Slots**: Create slots that automatically repeat for the same day of the week
- **Exception Handling**: Modify or delete specific instances without affecting the recurring pattern
- **Weekly View**: Display current week with all scheduled slots
- **Infinite Scroll**: Load upcoming weeks as you scroll
- **Real-time Updates**: Optimistic UI updates for better user experience
- **Mobile-first Design**: Responsive interface built with TailwindCSS

## Tech Stack

### Frontend
- React 18 with TypeScript
- TailwindCSS for styling
- Vite for build tooling
- Axios for API calls
- date-fns for date manipulation

### Backend
- Node.js with TypeScript
- Express.js framework
- PostgreSQL database
- Knex.js for database queries
- Zod for validation

## Project Structure

```
scheduler-app/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── types/          # TypeScript types
│   │   └── ...
│   └── package.json
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── database/       # Database connection
│   │   ├── types/          # TypeScript types
│   │   └── migrations/     # Database migrations
│   └── package.json
└── package.json            # Root package.json for workspaces
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd scheduler-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
# Create a PostgreSQL database
createdb scheduler_db

# Set up environment variables
cp backend/env.example backend/.env
# Edit backend/.env with your database credentials
```

4. Run database migrations:
```bash
cd backend
npm run db:migrate
```

5. Start the development servers:
```bash
# From the root directory
npm run dev
```

This will start both the frontend (http://localhost:3000) and backend (http://localhost:3001) servers.

## API Endpoints

### Slots
- `POST /api/slots` - Create a new recurring slot
- `GET /api/slots/week?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - Get slots for a week
- `PUT /api/slots/:id` - Update a slot (creates exception)
- `DELETE /api/slots/:id` - Delete a slot (creates exception)

## Database Schema

### Slots Table
- `id` - Primary key
- `day_of_week` - Day of week (0=Sunday, 1=Monday, etc.)
- `start_time` - Slot start time
- `end_time` - Slot end time
- `specific_date` - Specific date for exceptions (null for recurring)
- `is_recurring` - Boolean flag for recurring vs exception
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set the following:
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && node dist/index.js`
   - **Environment**: Node
4. Set environment variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `DATABASE_URL` = Your PostgreSQL connection string (from Render PostgreSQL)
   - `SKIP_DB` = `false`
5. Deploy

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set the following:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Set environment variables:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com`
4. Deploy

### Frontend (Netlify)
1. Connect your GitHub repository to Netlify
2. Set the following:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
3. Set environment variables:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com`
4. Deploy

### Database (Render PostgreSQL)
1. Create a new PostgreSQL service on Render
2. Use the connection string as your `DATABASE_URL` in the backend service

## Usage

1. **Creating Slots**: Click the "+" button next to any day to add a new slot. The slot will automatically recur for that day of the week.

2. **Editing Slots**: Click the edit icon next to any slot to modify it. This creates an exception for that specific date.

3. **Deleting Slots**: Click the trash icon to delete a slot. For recurring slots, this creates a deletion exception.

4. **Navigation**: Use the arrow buttons to navigate between weeks.

## License

MIT License
