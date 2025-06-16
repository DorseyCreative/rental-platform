# AI-Powered Rental Management Platform

🚀 **Production-Ready Multi-Tenant Rental Management System with AI-Powered Onboarding**

Transform any rental business with AI-driven automation, real brand extraction, and complete data management.

## ✨ Features

### 🤖 AI-Powered Onboarding
- **Auto Brand Extraction**: AI analyzes websites to extract logos, colors, and business information
- **Smart Business Type Detection**: Automatically identifies heavy equipment, party rental, car rental, or tool rental businesses
- **Web Intelligence**: Real-time reputation scoring and competitive analysis
- **Dynamic System Configuration**: Creates custom workflows based on business type

### 🏢 Multi-Tenant Architecture
- **Complete Business Isolation**: Each business gets their own branded environment
- **Custom Equipment Categories**: Dynamically configured based on business type
- **Flexible Pricing Models**: Daily, weekly, monthly rates with automatic calculations
- **Role-Based Access Control**: Admin, manager, staff, and driver permissions

### 📊 Full Business Management
- **Equipment Management**: Track inventory, maintenance, GPS location, and availability
- **Customer Portal**: Self-service booking, contract signing, and payment processing
- **Rental Scheduling**: Conflict detection, automated pricing, delivery coordination
- **Financial Management**: Invoicing, payments, deposits, and revenue tracking

### 🎨 Dynamic Branding
- **Real-Time Brand Application**: Extracted colors and logos applied throughout the system
- **Business-Specific Dashboards**: Customized layouts and metrics per business type
- **White-Label Ready**: Fully customizable for reseller partnerships

## 🏗️ Technical Architecture

### Frontend
- **Next.js 14** with App Router and TypeScript
- **Framer Motion** for smooth animations and transitions
- **Tailwind CSS** with dynamic color theming
- **Responsive Design** optimized for mobile and desktop

### Backend
- **Supabase** for real-time database and authentication
- **Row Level Security** for multi-tenant data isolation
- **RESTful APIs** with full CRUD operations
- **Anthropic AI** integration for website analysis

### Infrastructure
- **GitHub Pages** deployment with static export
- **Supabase Edge Functions** for serverless processing
- **Real-time subscriptions** for live updates
- **CDN optimization** for global performance

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- GitHub repository

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/rental-platform.git
cd rental-platform
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 3. Database Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Link your project
supabase link --project-ref YOUR_PROJECT_ID

# Run migrations
supabase db push

# Generate types
npm run db:generate-types
```

### 4. Development
```bash
npm run dev
# Open http://localhost:3002
```

### 5. Production Deployment
```bash
npm run build:github-pages
# Automated deployment via GitHub Actions
```

## 📈 Live Demo

Experience the AI onboarding process:
1. Visit the live demo: [Your Demo URL]
2. Enter any business website URL
3. Watch AI extract branding and configure the system
4. Explore the generated dashboard with real data

## 🏪 Supported Business Types

### Heavy Equipment Rental
- Excavators, bulldozers, cranes, skid steers
- GPS tracking, maintenance scheduling
- Operator certification management

### Party & Event Rental
- Tents, tables, chairs, linens, decorations
- Event planning tools, setup coordination
- Delivery and pickup scheduling

### Car & Vehicle Rental
- Fleet management, insurance tracking
- Mileage monitoring, fuel management
- Digital contracts and check-in

### Tool & Equipment Rental
- Power tools, generators, safety equipment
- Maintenance tracking, safety certifications
- Quick checkout and return processing

### Custom Business Types
- Fully configurable equipment categories
- Custom fields and pricing models
- Tailored workflows and features

## 💼 Business Intelligence

### AI-Powered Analytics
- **Revenue Forecasting**: Predictive analytics based on seasonal trends
- **Equipment Utilization**: Optimize inventory and pricing strategies
- **Customer Insights**: Behavior analysis and retention strategies
- **Competitive Analysis**: Market positioning and opportunity identification

### Real-Time Reporting
- Live dashboard with key performance indicators
- Automated alerts for maintenance, overdue returns
- Financial reports with tax calculations
- Custom report generation and export

## 🔧 API Documentation

### Complete REST API
- **Equipment**: Full CRUD with availability checking
- **Customers**: Management with rental history
- **Rentals**: Booking, contracts, and returns
- **Invoices**: Automated billing and payment tracking
- **Maintenance**: Scheduling and record keeping

### WebHooks & Integrations
- Payment processor integration (Stripe, Square)
- Email notifications (SendGrid, Mailgun)
- SMS alerts (Twilio)
- Accounting software sync (QuickBooks)

## 🛡️ Security & Compliance

### Data Protection
- Row Level Security for multi-tenant isolation
- Encrypted data storage and transmission
- GDPR compliance ready
- Regular security audits

### Authentication
- Supabase Auth with email/password
- Social login options (Google, Facebook)
- Multi-factor authentication
- Session management and security

## 📊 Database Schema

Complete schema with 9 core tables:
- `businesses` - Multi-tenant business configuration
- `equipment` - Inventory management with custom fields
- `customers` - Customer profiles and payment methods
- `rentals` - Booking and contract management
- `invoices` - Automated billing and accounting
- `payments` - Transaction tracking and reconciliation
- `maintenance_records` - Equipment service history
- `delivery_schedules` - Logistics coordination
- `staff` - User management and permissions

## 🌟 Unique Value Propositions

### For Business Owners
- **5-Minute Setup**: AI extracts all branding automatically
- **Zero Configuration**: Smart defaults based on business type
- **Real Data**: Connects to live systems, not demo data
- **Mobile-First**: Manage business from anywhere

### For Developers
- **Production-Ready**: Complete CI/CD with GitHub Actions
- **Fully Documented**: API docs and deployment guides
- **Type-Safe**: End-to-end TypeScript implementation
- **Extensible**: Plugin architecture for custom features

### For End Users
- **Intuitive Interface**: Stripe-inspired design language
- **Real-Time Updates**: Live notifications and status changes
- **Self-Service**: Customer portal reduces support burden
- **Professional**: White-label ready for reseller partners

## 📋 Roadmap

### Phase 1: Core Platform ✅
- AI-powered onboarding
- Multi-tenant architecture
- Complete CRUD operations
- GitHub Pages deployment

### Phase 2: Advanced Features 🚧
- Payment processing integration
- Advanced analytics and reporting
- Mobile app development
- Third-party integrations

### Phase 3: Enterprise Features 📅
- Advanced security and compliance
- Custom domain management
- API rate limiting and usage tracking
- Enterprise support and SLAs

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📚 [Documentation](DEPLOYMENT.md)
- 🐛 [Issue Tracker](https://github.com/yourusername/rental-platform/issues)
- 💬 [Community Discussions](https://github.com/yourusername/rental-platform/discussions)
- 📧 [Contact Support](mailto:support@yourdomain.com)

---

**Ready to transform your rental business with AI?** 

[🚀 Deploy Now](DEPLOYMENT.md) | [📖 View Docs](docs/) | [🎯 Live Demo](https://your-demo-url.com)