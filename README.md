# 🏪 Vendomatic API

Backend API for the Vendomatic vending machine management system. Built with NestJS, TypeORM, and GraphQL.

## 📋 Overview

A comprehensive dashboard/backoffice system for managing and monitoring vending machines, including machine management, product inventory, restocking operations, and maintenance tracking.

This API integrates with edge devices (Rust servers running on Raspberry Pi) deployed in vending machines to:
- Communicate with coin acceptors and bill validators via MDB protocol
- Update product prices in real-time on the vending hardware
- Monitor payment device status and transactions
- Collect telemetry data for operational insights

For detailed project features and roadmap, see [ROADMAP.md](./docs/ROADMAP.md).

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Docker

### Installation

```bash
yarn install
```

### Environment Setup
Create a `.env` file based on your configuration.

### Development

```bash
# Start development services
yarn docker

# Start application locally
yarn start:dev
```

### Database Setup

```bash
# Run migrations
yarn migration:run
```

The API will be available at `http://localhost:3000/graphql`

## 📚 Available Scripts

### Development
- `yarn start:dev` - Start development server with hot reload
- `yarn start:debug` - Start with debugging enabled
- `yarn docker` - Run with Docker Compose

### Database
- `yarn migration:run` - Run database migrations
- `yarn migration:generate` - Generate new migration
- `yarn migration:revert` - Revert last migration

### Testing
- `yarn test` - Run all tests
- `yarn test:unit` - Run unit tests only
- `yarn test:e2e` - Run e2e tests only
- `yarn test:cov` - Run tests with coverage

### Code Quality
- `yarn lint:check` - Check linting issues
- `yarn lint:fix` - Fix linting issues
- `yarn format:check` - Check code formatting
- `yarn format:fix` - Fix code formatting
- `yarn type:check` - Run TypeScript type checking

### Production
- `yarn build` - Build for production
- `yarn start:prod` - Start production server

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **API**: GraphQL with Apollo Server
- **Language**: TypeScript
- **Testing**: Jest
