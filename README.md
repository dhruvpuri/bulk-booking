# BulkStay - Bulk Booking Subscription Platform

A comprehensive bulk-booking subscription platform built with Next.js, TypeScript, and Tailwind CSS. This platform allows guests to purchase bulk accommodation packages and hosts to manage their properties with bulk booking capabilities.

## 🚀 Features

### For Guests
- **Package Selection**: Choose from Weekend Explorer, Monthly Nomad, and Annual Adventurer packages
- **Calendar Integration**: Select tentative travel dates with interactive calendar
- **Flexible Booking**: Modify dates anytime within validity period
- **Indian Market Focus**: Pricing in Indian Rupees with GST calculation
- **4-Step Booking Flow**: Registration → Package Selection → Payment → Confirmation

### For Hosts
- **Property Management**: Enable/disable bulk booking for properties
- **Booking Calendar**: View and manage bookings with detailed calendar interface
- **Revenue Tracking**: Monitor performance and occupancy rates
- **Guest Management**: View guest details and booking information

### Calendar Features
- **Multiple Selection Modes**: Single date, multiple dates, or date range selection
- **Availability Display**: Clear indication of booked, available, and disabled dates
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Indian Date Formatting**: Localized date display for Indian users

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.5.2, React, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Date Handling**: Native JavaScript Date API
- **Currency**: Indian Rupee (INR) formatting

## 📦 Project Structure

```
bulk-booking-platform/
├── app/                          # Next.js app directory
├── components/
│   ├── auth/                     # Authentication components
│   ├── booking/                  # Booking flow components
│   ├── calendar/                 # Calendar components
│   │   ├── Calendar.tsx          # Base calendar component
│   │   ├── AvailabilityCalendar.tsx  # Guest date selection
│   │   └── BookingCalendar.tsx   # Host booking management
│   ├── guest/                    # Guest-facing components
│   ├── host/                     # Host dashboard components
│   └── ui/                       # Reusable UI components
├── services/
│   └── api.ts                    # Mock API service with INR pricing
├── types/
│   └── index.ts                  # TypeScript type definitions
└── lib/
    └── utils.ts                  # Utility functions
```

## 🎯 Key Components

### Calendar System
- **Calendar.tsx**: Base calendar component with multiple selection modes
- **AvailabilityCalendar.tsx**: Guest-facing calendar for date selection
- **BookingCalendar.tsx**: Host-facing calendar for booking management

### Booking Flow
- **GuestRegistration.tsx**: User account creation
- **PackageSelection.tsx**: Package selection with calendar integration
- **PaymentScreen.tsx**: Payment processing with GST calculation
- **ConfirmationPage.tsx**: Booking confirmation and next steps

### Host Management
- **HostDashboard.tsx**: Complete host management interface
- **PropertyCard.tsx**: Individual property management
- **BookingCalendar.tsx**: Detailed booking calendar view

## 💰 Pricing (Indian Market)

### Package Tiers
- **Weekend Explorer**: ₹24,999 (6 nights, 12 months validity)
- **Monthly Nomad**: ₹74,999 (15 nights, 18 months validity)
- **Annual Adventurer**: ₹1,24,999 (30 nights, 24 months validity)

### Property Pricing Examples
- **Oceanview Villa (Goa)**: ₹37,500/night
- **Mountain Retreat (Manali)**: ₹26,700/night
- **City Loft (Mumbai)**: ₹23,300/night
- **Beachfront Condo (Kochi)**: ₹31,700/night

*All prices include 18% GST as per Indian tax regulations*

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn or bun

### Installation
1. Clone the repository:
```bash
git clone https://github.com/dhruvpuri/bulk-booking.git
cd bulk-booking
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Credentials
- **Guest**: guest@example.com / password
- **Host**: host@example.com / password

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_CURRENCY=INR
NEXT_PUBLIC_GST_RATE=0.18
```

### Customization
- **Currency**: Update `formatINR` function in `services/api.ts`
- **GST Rate**: Modify tax calculation in `PaymentScreen.tsx`
- **Package Pricing**: Update `mockPackages` in `services/api.ts`
- **Property Data**: Modify `mockProperties` in `services/api.ts`

## 📱 Responsive Design

The platform is fully responsive with breakpoints:
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#059669)
- **Warning**: Amber (#d97706)
- **Error**: Red (#dc2626)
- **Neutral**: Gray scale

### Typography
- **Font Family**: Inter
- **Headings**: 700 weight
- **Body**: 400-500 weight
- **Captions**: 400 weight

## 🔐 Authentication

Currently uses mock authentication. In production, integrate with:
- **Firebase Auth**
- **Auth0**
- **NextAuth.js**
- **Custom JWT implementation**

## 📊 Analytics & Monitoring

Ready for integration with:
- **Google Analytics**
- **Mixpanel**
- **Amplitude**
- **Custom analytics dashboard**

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Configure build command and publish directory
- **AWS Amplify**: Set up continuous deployment
- **Railway**: Connect GitHub repository

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework
- **Next.js** for the React framework
- **Unsplash** for the property images

## 📞 Support

For support and questions:
- **Email**: support@bulkstay.com
- **Phone**: 1800-BULK-STAY
- **Live Chat**: Available 24/7 on the platform

---

**Live Demo**: [https://bulkstay-platform.lindy.site](https://bulkstay-platform.lindy.site)

Built with ❤️ for the Indian travel market
