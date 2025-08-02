# 🗺️ Vendomatic Roadmap

## 📊 Current Implementation Status

### ✅ Implemented Features

#### Core Infrastructure
- **NestJS Framework** - REST and GraphQL API foundation
- **Database Setup** - PostgreSQL with TypeORM migrations
- **Configuration Management** - Environment-based configuration
- **Testing Framework** - Jest setup for unit and e2e tests
- **Code Quality** - ESLint, Prettier, and pre-commit hooks

#### Machine Management (Partial)
- **Spot Entity** - Basic machine/location model (`src/spot/`)
  - Create, read, update, delete operations
  - Fields: id, name, location, timestamps
  - GraphQL API endpoints

### 🚧 In Development
Currently implementing the foundational machine management system.

---

## 🎯 Planned Features (Based on User Stories)

### 🏢 Machine Management
- [ ] **US001** - Enhanced machine creation with validation
- [ ] **US002** - Location change tracking with history
- [ ] **US003** - Machine deactivation with data retention
- [ ] Machine status monitoring
- [ ] Machine configuration management

### 🛍️ Product Management
- [ ] **US004** - Product catalog and machine-specific products
- [ ] **US005** - Location-based pricing system
- [ ] **US006** - Product removal with stock alerts
- [ ] Product capacity and stock tracking
- [ ] Price history tracking

### 📦 Restocking Operations
- [ ] **US007** - Restocking registration system
- [ ] **US008** - Waste/disposal tracking
- [ ] **US009** - Restocking history and reporting
- [ ] Employee association with operations
- [ ] Money collection tracking

### 🔧 Maintenance Management
- [ ] **US010** - Maintenance activity logging
- [ ] **US011** - Maintenance history and analytics
- [ ] Preventive maintenance scheduling
- [ ] Technician assignment system
- [ ] Photo/document attachments

### 👥 User Management
- [ ] Authentication and authorization system
- [ ] Role-based access control (Admin, Employee, Technician)
- [ ] User activity auditing
- [ ] Permission management

### 📊 Analytics & Reporting (Future)
- [ ] **US012** - Sales statistics and charts
- [ ] **US013** - Profitability analysis
- [ ] **US014** - Waste pattern analysis
- [ ] Real-time dashboards
- [ ] Export functionality

---

## 🏗️ Technical Architecture Roadmap

### Database Schema Evolution
- [ ] Product entities and relationships
- [ ] User management tables
- [ ] Restocking operation tracking
- [ ] Maintenance records
- [ ] Audit logging system

### API Development
- [ ] Authentication middleware
- [ ] Role-based authorization guards
- [ ] File upload handling (photos/documents)
- [ ] Real-time subscriptions (GraphQL)
- [ ] API rate limiting and security

### Frontend Integration
- [ ] API documentation (GraphQL schema)
- [ ] Error handling standardization
- [ ] Pagination and filtering
- [ ] Data validation schemas

### Hardware Integration (Edge Devices)
- [ ] Edge device communication API endpoints
- [ ] Real-time price synchronization with vending machines
- [ ] Payment device status monitoring
- [ ] Transaction event handling from MDB devices
- [ ] Telemetry data collection and aggregation

---

## 🔌 Hardware Architecture (Planned)

### Edge Device Setup
Each vending machine will have:
- **Raspberry Pi Zero 2W** running custom Rust server
- **4G LTE HAT** for cellular connectivity (Waveshare SIM7600 or similar)
- **MDB-RS232 Interface** for payment device communication
- **USB-to-Serial Adapter** for protocol bridging

### Communication Flow
```
Vending Machine Hardware ← MDB Protocol → Raspberry Pi (Rust) ← 4G/API → Vendomatic Backend
```

### Edge Device Responsibilities
- Translate MDB protocol to/from API calls
- Push price updates from backoffice to vending machine
- Buffer transactions in SQLite during connectivity issues
- Monitor payment device health
- Report telemetry and diagnostics

---

## 📈 Implementation Phases

### Phase 1: Foundation (Current)
- ✅ Project setup and infrastructure
- ✅ Basic machine/spot management
- 🚧 Database schema design

### Phase 2: Core Features
- User authentication system
- Complete machine management
- Product catalog and inventory

### Phase 3: Operations
- Restocking workflow
- Maintenance tracking
- Basic reporting

### Phase 4: Analytics
- Advanced reporting
- Data visualization
- Performance optimization

### Phase 5: Advanced Features
- Real-time monitoring
- Mobile app support
- Advanced analytics

---

## 🔄 Next Immediate Steps

1. **Complete Spot/Machine Model**
   - Add status field (active/inactive)
   - Add configuration fields
   - Implement validation

2. **User Authentication**
   - JWT implementation
   - Role-based access
   - User entity creation

3. **Product Management**
   - Product entity design
   - Machine-product relationships
   - Pricing system

---
