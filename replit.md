# AgniAid - Unified Disaster Relief Platform

## Overview

AgniAid is an offline-first disaster relief platform that connects survivors, volunteers, NGOs, and donors through AI-powered coordination and real-time communication. The platform enables emergency request submission, volunteer coordination, donation management, and campaign tracking to ensure no cry for help goes unheard during disaster situations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with pages for home, emergency requests, volunteer registration, donations, and dashboard
- **UI Components**: Shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query for server state management and caching
- **Real-time Updates**: WebSocket integration for live data synchronization across the platform

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **API Design**: RESTful API endpoints with WebSocket support for real-time features
- **Database Integration**: Drizzle ORM with PostgreSQL using Neon serverless database
- **Storage Layer**: Abstracted storage interface for CRUD operations across all entities

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Design**: Comprehensive schema covering users, emergency requests, volunteers, NGOs, donations, campaigns, and contact messages
- **Session Management**: PostgreSQL session store using connect-pg-simple
- **Migration System**: Drizzle Kit for database schema migrations

### Authentication and Authorization
- **User Roles**: Multi-role system supporting survivors, volunteers, NGOs, donors, and administrators
- **User Management**: User registration, authentication, and profile management
- **Verification System**: Built-in verification workflows for volunteers and NGOs

### Real-time Communication
- **WebSocket Server**: Integrated WebSocket server for live updates
- **Event Broadcasting**: Real-time notifications for emergency requests, volunteer assignments, and donation updates
- **Connection Management**: Automatic reconnection and connection state tracking

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management and caching

### UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework with custom design system
- **class-variance-authority**: Component variant management
- **cmdk**: Command palette interface

### Development Tools
- **vite**: Fast development server and build tool
- **typescript**: Type safety across the entire application
- **tsx**: TypeScript execution for server development
- **esbuild**: Fast JavaScript bundler for production builds

### Real-time Features
- **ws**: WebSocket library for real-time communication
- **react-hook-form**: Form state management with validation

### Date and Utility Libraries
- **date-fns**: Date manipulation and formatting
- **zod**: Schema validation and type inference
- **clsx**: Conditional CSS class management