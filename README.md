# 🚀 N8N - Advanced Workflow Automation Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-green?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![tRPC](https://img.shields.io/badge/tRPC-11.7-blue?style=for-the-badge&logo=trpc)](https://trpc.io/)
[![React](https://img.shields.io/badge/React-19.1.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)

**A modern, full-stack workflow automation platform inspired by n8n, built with cutting-edge technologies and best practices.**

[Features](#-key-features) • [Tech Stack](#-technology-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture) • [Documentation](#-documentation)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [Development](#-development)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**N8N** is a sophisticated workflow automation platform that enables users to create, execute, and monitor complex automated workflows through an intuitive visual interface. Built with modern web technologies and enterprise-grade patterns, this project demonstrates proficiency in full-stack development, real-time systems, and scalable architecture design.

### Why This Project Stands Out

- **Production-Ready Architecture**: Implements industry best practices including tRPC for type-safe APIs, Prisma for type-safe database access, and comprehensive error handling
- **Real-Time Workflow Execution**: Leverages Inngest for reliable, distributed workflow execution with real-time monitoring
- **Enterprise Authentication**: Implements Better Auth with support for multiple OAuth providers (GitHub, Google) and email/password authentication
- **AI-Powered Workflows**: Integrates multiple AI providers (OpenAI, Anthropic Claude, Google Gemini) with the Vercel AI SDK
- **Payment Integration**: Full Stripe and Polar.sh integration for subscription management
- **Modern UI/UX**: Built with Radix UI primitives and advanced React patterns for a seamless user experience
- **Type-Safe End-to-End**: Full TypeScript implementation with strict typing across frontend, backend, and database layers
- **Production Monitoring**: Integrated Sentry for error tracking and performance monitoring

---

## ✨ Key Features

### 🎨 Visual Workflow Editor

- **Drag-and-Drop Interface**: Intuitive node-based workflow editor powered by XYFlow (ReactFlow)
- **Real-Time Collaboration**: Live workflow state management with Jotai
- **Custom Node Types**: Support for multiple node types including triggers, actions, and AI models
- **Connection Management**: Visual connection system with validation and error handling

### 🔐 Robust Authentication System

- **Multi-Provider OAuth**: GitHub and Google social authentication
- **Email/Password Authentication**: Secure credential-based authentication with Better Auth
- **Session Management**: Secure session handling with token-based authentication
- **Protected Routes**: Comprehensive route protection and authorization

### 🤖 AI Integration

- **Multi-Model Support**: OpenAI GPT, Anthropic Claude, and Google Gemini integration
- **Streaming Responses**: Real-time AI response streaming with Vercel AI SDK
- **Secure Credential Management**: Encrypted API key storage using industry-standard encryption
- **Flexible AI Nodes**: Configurable AI nodes with custom prompts and parameters

### ⚡ Advanced Workflow Execution

- **Background Processing**: Inngest-powered distributed workflow execution
- **Real-Time Monitoring**: Live execution status with Inngest Realtime
- **Error Handling**: Comprehensive error capture with stack traces and retry logic
- **Execution History**: Complete audit trail of all workflow runs

### 🔌 Extensible Trigger System

- **Manual Triggers**: On-demand workflow execution
- **HTTP Webhooks**: RESTful API endpoint triggers
- **Google Forms Integration**: Automated form submission processing
- **Stripe Webhooks**: Payment event triggers for e-commerce automation

### 💳 Payment & Subscription Management

- **Stripe Integration**: Full payment processing with webhook support
- **Polar.sh Integration**: Subscription management and billing
- **Usage-Based Billing**: Track and monetize workflow executions
- **Customer Portal**: Self-service subscription management

### 📊 Data Management

- **PostgreSQL Database**: Relational data storage with Prisma ORM
- **Type-Safe Queries**: Compile-time query validation
- **Automated Migrations**: Version-controlled database schema
- **Optimistic Updates**: React Query integration for responsive UI

### 🛡️ Security & Monitoring

- **Encrypted Credentials**: AES-256 encryption for sensitive data
- **Sentry Integration**: Real-time error tracking and performance monitoring
- **Environment Validation**: Runtime environment variable validation
- **CORS Protection**: Secure API endpoints with proper CORS configuration

---

## 🛠️ Technology Stack

### Frontend

| Technology          | Purpose                         | Version |
| ------------------- | ------------------------------- | ------- |
| **Next.js**         | React framework with App Router | 15.5.4  |
| **React**           | UI library                      | 19.1.0  |
| **TypeScript**      | Type-safe development           | 5.x     |
| **Tailwind CSS**    | Utility-first styling           | 4.x     |
| **Radix UI**        | Accessible component primitives | Latest  |
| **XYFlow**          | Node-based UI builder           | 12.9.3  |
| **Jotai**           | Atomic state management         | 2.15.1  |
| **TanStack Query**  | Server state management         | 5.90.10 |
| **React Hook Form** | Form management                 | 7.66.1  |
| **Zod**             | Schema validation               | 4.1.12  |
| **Sonner**          | Toast notifications             | 2.0.7   |
| **Lucide React**    | Icon library                    | 0.554.0 |

### Backend

| Technology      | Purpose                  | Version |
| --------------- | ------------------------ | ------- |
| **tRPC**        | Type-safe API layer      | 11.7.1  |
| **Prisma**      | ORM and database toolkit | 6.19.0  |
| **PostgreSQL**  | Relational database      | Latest  |
| **Better Auth** | Authentication framework | 1.3.26  |
| **Inngest**     | Workflow orchestration   | 3.44.1  |
| **Handlebars**  | Template engine          | 4.7.8   |
| **SuperJSON**   | JSON serialization       | 2.2.2   |

### AI & Integration

| Technology        | Purpose                  | Version |
| ----------------- | ------------------------ | ------- |
| **Vercel AI SDK** | AI model integration     | 5.0.96  |
| **OpenAI SDK**    | GPT model integration    | 2.0.69  |
| **Anthropic SDK** | Claude model integration | 2.0.45  |
| **Google AI SDK** | Gemini model integration | 2.0.39  |
| **Stripe**        | Payment processing       | 20.0.0  |
| **Polar.sh SDK**  | Subscription management  | 0.40.3  |

### DevOps & Tooling

| Technology | Purpose                | Version |
| ---------- | ---------------------- | ------- |
| **Sentry** | Error tracking         | 10.26.0 |
| **Biome**  | Linter and formatter   | 2.2.0   |
| **Docker** | Containerization       | Latest  |
| **mprocs** | Process management     | 0.7.3   |
| **dotenv** | Environment management | 17.2.3  |

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js App                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Client Components (React 19)             │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐     │  │
│  │  │ Workflow │  │   Node   │  │   Execution      │     │  │
│  │  │  Editor  │  │ Builder  │  │   Monitor        │     │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘     │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↕                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               tRPC API Layer (Type-Safe)              │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↕                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Server Components & Actions              │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐     │  │
│  │  │   Auth   │  │ Workflow │  │   Credential     │     │  │
│  │  │  Logic   │  │  Engine  │  │   Manager        │     │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    External Services                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Inngest  │  │ Prisma/  │  │   AI     │  │  Stripe  │     │
│  │ Workflow │  │   DB     │  │ Providers│  │ Payments │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Patterns

1. **Feature-Based Structure**: Organized by domain features (auth, workflows, executions, etc.)
2. **Server/Client Separation**: Clear boundaries with `server-only` and `client-only` packages
3. **Type-Safe APIs**: End-to-end type safety with tRPC
4. **Atomic State Management**: Jotai for granular, composable state
5. **Optimistic Updates**: React Query for responsive UI interactions
6. **Background Jobs**: Inngest for reliable, distributed execution
7. **Database Abstraction**: Prisma for type-safe database operations

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **PostgreSQL** 14.x or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/n8n.git
   cd n8n
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration (see [Environment Variables](#-environment-variables))

4. **Set up the database**

   ```bash
   # Start PostgreSQL (using Docker)
   docker-compose up -d

   # Run Prisma migrations
   npx prisma migrate dev

   # Generate Prisma client
   npx prisma generate
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Quick Start with All Services

Use `mprocs` to run all services concurrently:

```bash
npm run dev:all
```

This will start:

- Next.js development server
- Inngest development server
- ngrok tunnel (for webhooks)

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

### Application

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NGROK_URL=your_ngrok_url
```

### Database

```env
DATABASE_URL=postgres://n8n:n8n@localhost:5432/n8n
```

### Authentication

```env
BETTER_AUTH_SECRET=your_random_secret_here
BETTER_AUTH_URL=http://localhost:3000
LOGIN_CALLBACK_URL=http://localhost:3000
SIGNUP_CALLBACK_URL=http://localhost:3000
```

### OAuth Providers

```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### AI Providers

```env
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
```

### Payment Providers

```env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

POLAR_ACCESS_TOKEN=your_polar_access_token
POLAR_PRODUCT_ID=your_polar_product_id
POLAR_SUCCESS_URL=http://localhost:3000
```

### Security

```env
ENCRYPTION_SECRET=your_encryption_secret
```

### Monitoring

```env
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

> **Note**: See `.env.example` for a complete list of required variables.

---

## 🗄️ Database Schema

### Core Models

- **User**: User accounts with authentication data
- **Session**: Active user sessions
- **Account**: OAuth provider connections
- **Workflow**: Workflow definitions and metadata
- **Node**: Individual workflow nodes with configurations
- **Connection**: Node connections and data flow
- **Credential**: Encrypted API keys and credentials
- **Execution**: Workflow execution logs and results

### Entity Relationship Overview

```
User ──┬── Workflows ──┬── Nodes ──── Connections
       │               └── Executions
       ├── Credentials ──── Nodes
       ├── Sessions
       └── Accounts
```

### Key Features

- **Cascading Deletes**: Automatic cleanup of related entities
- **Timestamps**: `createdAt` and `updatedAt` on all models
- **Type Safety**: Enums for node types, credential types, and execution status
- **Flexible JSON**: Unstructured data support with JSON fields

---

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start Next.js dev server
npm run dev:all          # Start all services with mprocs
npm run inngest:dev      # Start Inngest dev server
npm run ngrok:dev        # Start ngrok tunnel

# Building
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run Biome linter
npm run format           # Format code with Biome
npm run tsc              # Type checking

# Database
npx prisma migrate dev   # Create and apply migrations
npx prisma generate      # Generate Prisma client
npx prisma studio        # Open Prisma Studio
```

### Development Workflow

1. **Feature Development**: Work in feature-specific directories under `src/features/`
2. **API Routes**: Create tRPC routers in `src/trpc/routers/`
3. **Database Changes**: Update `prisma/schema.prisma` and run migrations
4. **UI Components**: Build reusable components in `src/components/`
5. **Type Safety**: Ensure all code passes `npm run tsc`
6. **Code Quality**: Run `npm run lint` and `npm run format` before commits

---

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**

   ```bash
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your repository to Vercel
   - Configure environment variables
   - Deploy automatically on push

### Environment Setup

Ensure all environment variables are configured in your deployment platform:

- Database URL (production PostgreSQL instance)
- All API keys and secrets
- OAuth credentials with production callback URLs
- Webhook URLs for Stripe and other integrations

### Database Migration

```bash
npx prisma migrate deploy
```

### Build Configuration

The project includes production optimizations:

- Sentry error tracking
- Next.js output file tracing for Prisma
- Automatic redirects
- Static asset optimization

---

## 📁 Project Structure

```
n8n/
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   └── api/               # API routes
│   ├── components/            # Reusable UI components
│   ├── features/              # Feature-based modules
│   │   ├── auth/             # Authentication logic
│   │   ├── workflows/        # Workflow management
│   │   ├── executions/       # Workflow execution
│   │   ├── editor/           # Visual workflow editor
│   │   ├── credentials/      # Credential management
│   │   ├── triggers/         # Trigger implementations
│   │   └── subscriptions/    # Payment/subscription logic
│   ├── inngest/              # Background job definitions
│   │   ├── functions.ts      # Inngest workflow functions
│   │   ├── channels/         # Real-time channels
│   │   └── utils.ts          # Execution utilities
│   ├── lib/                  # Core utilities
│   │   ├── auth.ts           # Better Auth configuration
│   │   ├── database.ts       # Prisma client
│   │   └── polar-client.ts   # Polar.sh client
│   ├── trpc/                 # tRPC API layer
│   │   ├── routers/          # API route handlers
│   │   ├── trpc.ts           # tRPC initialization
│   │   └── app-router.ts     # Root router
│   └── hooks/                # Custom React hooks
├── .env.example              # Environment variable template
├── biome.json                # Biome configuration
├── docker-compose.yml        # Docker services
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies
├── prisma.config.ts          # Prisma configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

---

## 🎓 What This Project Demonstrates

### Technical Skills

✅ **Full-Stack Development**: Complete ownership of frontend and backend architecture  
✅ **Type Safety**: End-to-end TypeScript with tRPC and Prisma  
✅ **Modern React**: React 19 with Server Components and Suspense  
✅ **API Design**: RESTful principles with type-safe tRPC implementation  
✅ **Database Design**: Normalized schema with proper relationships  
✅ **Authentication**: OAuth 2.0 and credential-based auth flows  
✅ **Real-Time Systems**: WebSocket communication and live updates  
✅ **Background Jobs**: Distributed task processing with Inngest  
✅ **AI Integration**: Multi-provider LLM integration  
✅ **Payment Processing**: Stripe and subscription management  
✅ **Security**: Encryption, secure credential storage, CORS  
✅ **Error Handling**: Comprehensive error tracking with Sentry  
✅ **Testing**: Type-safe development with compile-time checks  
✅ **DevOps**: Docker, environment management, CI/CD ready

### Software Engineering Principles

✅ **Clean Architecture**: Separation of concerns with feature-based organization  
✅ **SOLID Principles**: Single responsibility, dependency injection  
✅ **DRY Code**: Reusable components and utilities  
✅ **Code Quality**: Consistent formatting and linting  
✅ **Documentation**: Comprehensive README and inline comments  
✅ **Version Control**: Proper Git workflow and commit history  
✅ **Security First**: Environment validation, encryption, secure defaults

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Contact

**Ayush Ranjan Sinha**

- GitHub: [@asayushranjansinha](https://github.com/asayushranjansinha)
- LinkedIn: [Ayush Ranjan Sinha](https://linkedin.com/in/asayushranjansinha)
- Email: asayushranjansinha@gmail.com

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Inngest](https://www.inngest.com/) - Workflow orchestration platform
- [Better Auth](https://github.com/better-auth/better-auth) - Modern authentication
- [Vercel](https://vercel.com/) - Deployment platform
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives

---

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Ayush Ranjan Sinha](https://github.com/asayushranjansinha)
