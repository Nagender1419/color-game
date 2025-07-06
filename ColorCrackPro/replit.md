# replit.md

## Overview

This is a full-stack web application called "ColorWin" - a color-based betting game built with React, TypeScript, Express.js, and PostgreSQL. The application features a mobile-first design with a modern UI built using shadcn/ui components and Tailwind CSS.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints with JSON responses
- **Error Handling**: Centralized error handling middleware

### Mobile-First Design
- Responsive layout optimized for mobile devices
- Bottom navigation for easy thumb navigation
- Touch-friendly UI elements and interactions
- Progressive Web App capabilities

## Key Components

### Game Logic
- **Color Selection**: Players choose between red, green, and blue
- **Betting System**: Configurable bet amounts with predefined options
- **Game Timer**: 30-second countdown for each game round
- **Win Calculation**: 2x multiplier for winning bets
- **Fair Play**: Game hash generation for transparency

### User Management
- **Authentication**: Session-based authentication system
- **Wallet System**: Digital wallet for deposits, withdrawals, and game transactions
- **User Statistics**: Win rate, total games, earnings tracking
- **Transaction History**: Complete audit trail of all financial activities

### Payment Integration
- **Deposit Methods**: UPI, Credit Card, Net Banking support
- **Withdrawal System**: Bank transfer integration
- **Transaction Processing**: Secure payment handling with status tracking
- **Minimum Limits**: ₹100 minimum deposit, ₹250 minimum withdrawal

## Data Flow

1. **User Registration/Login**: Creates user session and wallet
2. **Game Participation**: 
   - User selects color and bet amount
   - System validates wallet balance
   - Game timer initiates 30-second countdown
   - Random winner selection occurs
   - Payouts processed automatically
3. **Financial Transactions**:
   - Deposits add funds to user wallet
   - Withdrawals deduct from wallet balance
   - All transactions logged with status tracking
4. **Real-time Updates**: Client polls server for game state and user data

## External Dependencies

### Core Libraries
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database operations
- **@neondatabase/serverless**: PostgreSQL database connection
- **zod**: Schema validation for forms and API
- **react-hook-form**: Form state management
- **date-fns**: Date formatting and manipulation

### UI/UX Libraries
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management
- **wouter**: Lightweight routing solution

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type safety and developer experience
- **drizzle-kit**: Database schema management
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- Vite development server with hot module replacement
- Drizzle database migrations for schema changes
- Environment variables for database and API configuration
- Replit integration with development banner

### Production Build
- Vite builds optimized frontend assets
- esbuild bundles Express.js server for Node.js
- Static assets served from Express server
- Database migrations run via Drizzle CLI

### Database Management
- PostgreSQL schema defined in `shared/schema.ts`
- Drizzle ORM handles migrations and type safety
- Neon serverless database for scalability
- Connection pooling and session management

## Changelog
- July 06, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.