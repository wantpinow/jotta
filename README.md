# Jotta

A modern web application built with Next.js, TypeScript, and PostgreSQL.

## Technical Overview

### Architecture

The project follows a modern full-stack architecture with the following key components:

1. **Frontend Framework**: Next.js 15 with React 19

   - Uses the App Router for modern routing and server components
   - Implements Turbopack for faster development builds
   - TypeScript for type safety and better developer experience

2. **Database Layer**

   - PostgreSQL database with NeonDB serverless driver
   - Drizzle ORM for type-safe database operations
   - Schema-first approach with migrations support
   - Key tables:
     - `user`: Stores user information with GitHub integration
     - `session`: Manages user authentication sessions

3. **Authentication System**

   - Custom authentication implementation
   - GitHub OAuth integration
   - Session-based authentication with secure cookie handling
   - Password hashing for email/password authentication

4. **Development Tools**
   - ESLint for code linting
   - Prettier for code formatting
   - TypeScript for static type checking
   - Tailwind CSS for styling
   - Bun as the JavaScript runtime and package manager

### Project Structure

```
src/
├── app/           # Next.js app router pages and layouts
├── components/    # Reusable React components
├── env/          # Environment configuration and validation
├── lib/          # Shared utilities and helpers
└── server/       # Server-side code
    └── db/       # Database configuration and schema
```

### Key Features

1. **Database Management**

   - Type-safe database operations with Drizzle ORM
   - Migration system for schema changes
   - Database seeding support
   - Local development database setup scripts

2. **Development Workflow**

   - Hot module replacement with Turbopack
   - TypeScript for type safety
   - ESLint and Prettier for code quality
   - Environment variable management with .env files

3. **Deployment**
   - Production-ready configuration
   - Environment-specific settings
   - Database connection pooling
   - Secure session handling

### Getting Started

1. **Prerequisites**

   - Node.js or Bun runtime
   - PostgreSQL database
   - GitHub OAuth credentials (for authentication)

2. **Environment Setup**

   - Copy `.env.example` to `.env.local`
   - Configure required environment variables
   - Set up database connection

3. **Development**

   ```bash
   # Install dependencies
   bun install

   # Start development server
   bun run dev

   # Database management
   bun run db:start    # Start local database
   bun run db:migrate  # Run migrations
   bun run db:seed     # Seed database
   ```

4. **Production Build**
   ```bash
   bun run build
   bun run start
   ```

### Database Management

The project includes several database management scripts:

- `db:generate`: Generate database migrations
- `db:migrate`: Apply database migrations
- `db:push`: Push schema changes directly to database
- `db:studio`: Launch Drizzle Studio for database management
- `db:seed`: Seed the database with initial data
- `db:start`: Start local development database
- `db:stop`: Stop local development database
- `db:reset`: Reset database (stop, start, migrate, seed)

### Security Features

- Secure session management
- Password hashing
- Environment variable protection
- Type-safe database operations
- OAuth integration with GitHub

### Performance Optimizations

- Server-side rendering with Next.js
- Turbopack for faster development builds
- Database connection pooling
- Efficient session handling
- Type-safe operations to prevent runtime errors

This project is designed to be scalable, maintainable, and developer-friendly while following modern web development best practices.
