# Klean Frontend

A comprehensive React-based frontend application for managing a laundry and cleaning service business. This application provides role-based dashboards for administrators, managers, staff, and customers, along with features for booking services, managing inventory, processing orders, and generating reports.

## Features

### Admin & Management
- **Role-Based Access Control**: Separate dashboards for Super Admin, Branch Managers, Staff, and Customers
- **User Management**: Create, update, and manage employees, customers, and managers
- **Branch Management**: Handle multiple service locations
- **Inventory Tracking**: Monitor cleaning supplies and equipment
- **Order Processing**: Manage service orders from booking to completion
- **Invoice Generation**: Automated invoicing for completed services
- **Reports & Analytics**: Comprehensive reporting on business metrics

### Customer Features
- **Online Booking**: Easy-to-use booking form with service selection
- **Order Tracking**: Real-time status updates on service orders
- **Profile Management**: Customer account management
- **Service History**: View past orders and invoices

### Technical Features
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Real-time Updates**: Live data synchronization with React Query
- **Form Validation**: Robust client-side validation
- **Search & Filtering**: Advanced search capabilities across all modules
- **Notifications**: In-app notifications for important updates

## Tech Stack

- **Frontend Framework**: React 19.2.0 with Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18 with Radix UI components
- **State Management**: TanStack React Query 5.90.20 for server state
- **HTTP Client**: Axios 1.13.4 for API communication
- **Routing**: React Router DOM 7.12.0
- **Icons**: Lucide React 0.562.0
- **Charts**: Recharts 3.7.0 for data visualization
- **Animations**: Framer Motion 12.33.0
- **Date Handling**: date-fns 4.1.0
- **Notifications**: Sonner 2.0.7 for toast notifications
- **Build Tool**: Vite 7.2.4
- **Linting**: ESLint 9.39.1

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd klean-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

## Deployment

This application is configured for deployment on Vercel. The `vercel.json` file handles SPA routing by rewriting all routes to `index.html`.

To deploy:
1. Push your changes to the repository
2. Connect the repository to Vercel
3. Vercel will automatically build and deploy using the `npm run build` script

## Usage

### Development
- Run `npm run dev` to start the development server
- The application will be available at `http://localhost:5173`
- Use `npm run lint` to check for code quality issues

### Production
- Run `npm run build` to create an optimized production build
- The build artifacts will be stored in the `dist/` directory
- Use `npm run preview` to preview the production build locally

## Project Structure

```
klean-frontend/
├── public/                 # Static assets
├── src/
│   ├── admin/              # Admin-specific components
│   │   ├── admin-auth/     # Admin authentication page
│   │   ├── customers/      # Customer management
│   │   ├── dashboard/      # Role-based dashboards
│   │   ├── employees/      # Employee management
│   │   ├── inventory/      # Inventory management
│   │   ├── invoices/       # Invoice handling
│   │   ├── layout/         # Admin layout component
│   │   ├── locations/      # Branch/location management
│   │   ├── managers/       # Manager tools
│   │   ├── orders/         # Order processing
│   │   ├── reports/        # Reporting features
│   │   ├── tracking/       # Order tracking
│   │   └── unauthorized/   # Unauthorized access page
│   ├── api/                # API client functions
│   ├── assets/             # Static assets
│   ├── components/         # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   ├── common/         # Shared components
│   │   ├── customers/      # Customer-specific components
│   │   ├── dashboard/      # Dashboard widgets
│   │   ├── employees/      # Employee components
│   │   ├── inventory/      # Inventory components
│   │   ├── invoices/       # Invoice components
│   │   ├── landing/        # Landing page components
│   │   ├── layout/         # Layout components
│   │   ├── managers/       # Manager components
│   │   ├── orders/         # Order components
│   │   ├── reports/        # Report components
│   │   ├── tracking/       # Tracking components
│   │   └── ui/             # UI library components
│   ├── constants/          # Application constants
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── pages/              # Page components
│   ├── router/             # Routing configuration
│   └── utils/              # Utility functions
├── eslint.config.js        # ESLint configuration
├── index.html              # Main HTML file
├── package.json            # Project dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## Key Components

### Authentication System
- Role-based routing with protected routes
- Admin authentication with different access levels
- Customer login and registration

### Booking System
- Customer-facing booking form
- Service selection with pricing
- Branch and time slot selection
- Automatic form population from user profile

### Dashboard System
- **Super Admin**: System-wide overview and management
- **Branch Manager**: Branch-specific operations
- **Staff**: Daily operations and customer service
- **Customer**: Personal orders and account management

### API Integration
- RESTful API client with Axios
- React Query for caching and synchronization
- Error handling and loading states

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow the existing ESLint configuration
- Use meaningful commit messages
- Write descriptive component and function names
- Add comments for complex logic

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the development team or create an issue in the repository.

---

Built with ❤️ using React and Vite
