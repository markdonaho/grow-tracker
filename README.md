# GrowTracker

GrowTracker is a containerized cannabis cultivation management system that helps growers track plants, log actions, monitor growth metrics, and manage their cultivation process from start to finish.

## Features

- **Plant Management**: Track individual plants from seedling to harvest
- **Action Logging**: Record watering, feeding, pruning, and training activities
- **Growth Tracking**: Monitor plant metrics over time with visual charts
- **Image Gallery**: Store and view photos of your plants at different growth stages
- **Task Scheduling**: Set reminders for upcoming cultivation tasks

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Storage**: MinIO (S3-compatible)
- **Containerization**: Docker
- **Orchestration**: Kubernetes

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for local development with MongoDB and MinIO)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/grow-tracker.git
   cd grow-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
4. Start the MongoDB and MinIO containers:
   ```bash
   docker-compose up -d
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
grow-tracker/                    # Root project directory
├── public/                      # Static assets
├── src/                         # Source code
│   ├── app/                     # Next.js App Router
│   │   ├── api/                 # API Routes
│   │   ├── dashboard/           # Dashboard page
│   │   ├── plants/              # Plants pages
│   │   └── ...                  # Other pages
│   ├── components/              # React components
│   │   ├── ui/                  # UI components from shadcn
│   │   ├── forms/               # Form components
│   │   ├── layouts/             # Layout components
│   │   ├── plants/              # Plant-specific components
│   │   └── dashboard/           # Dashboard components
│   ├── lib/                     # Utility libraries
│   │   ├── db/                  # Database utilities
│   │   ├── storage/             # Storage utilities
│   │   └── utils.ts             # General utility functions
│   └── types/                   # TypeScript type definitions
├── docker-compose.yml           # Local development containers
└── ...                          # Other configuration files
```

## Development Workflow

### Phase 1: Core Application Development (Current)
- Set up Next.js project with TypeScript
- Configure Tailwind CSS and shadcn/ui components
- Create basic folder structure
- Implement dashboard layout and navigation
- Create plant list and plant detail views
- Develop forms for adding/editing plants
- Build action logging interface
- Create growth tracking forms and display
- Implement basic image upload component
- Set up mock data service for development

### Phase 2: Data Layer Integration (Next)
- Set up MongoDB and MinIO connections
- Implement data models and CRUD operations
- Connect UI to API endpoints
- Implement image upload and storage flow

## Deployment

### Local Development
```bash
# Start MongoDB and MinIO containers
docker-compose up -d

# Run the Next.js development server
npm run dev
```

### Production (Kubernetes)
Kubernetes deployment instructions will be added in Phase 4.

## License

This project is licensed under the MIT License.