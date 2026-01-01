# 🏥 RSUP PPK Website

> Sistem Manajemen Panduan Praktik Klinis (PPK) untuk Rumah Sakit Umum Pusat

## ✨ Features

- 📄 **Document Management** - Upload, versioning, dan distribusi dokumen PPK
- 👥 **User Management** - Role-based access control (Admin & User)
- 🗂️ **Master Data** - Kelola KSM dan Jenis Dokumen
- 📊 **Pagination** - Server-side pagination dengan filtering
- 🔔 **Error Handling** - Global error notification system
- 🌐 **Network Monitor** - Auto-detect offline/online status

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Storage**: Cloudinary

## 📦 Installation

```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

## 🔧 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   └── dashboard/         # Dashboard pages
├── components/            # React components
│   ├── features/         # Feature-specific components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   └── ui/               # Reusable UI components
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utilities & helpers
├── services/             # API services
├── types/                # TypeScript types
└── constants/            # App constants
```

## 🎯 Key Features

### Document Management
- Upload dokumen dengan metadata lengkap
- Version control otomatis
- Soft delete dengan restore capability
- Export ke Excel

### Pagination System
- Server-side pagination (20 items/page)
- Advanced filtering (search, KSM, type, status, date range)
- URL-based state persistence
- Soft delete aware filtering

### Error Handling
- Global error notification
- Network status monitoring
- User-friendly error messages
- Auto-dismiss toast notifications

## 🔐 Authentication

Role-based access dengan 2 level:
- **Admin**: Full access (CRUD operations)
- **User**: Read-only access

## 📱 Responsive Design

Fully responsive untuk:
- 💻 Desktop
- 📱 Mobile
- 📲 Tablet

## 🛠️ Development

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint
```

## 📝 Best Practices

- ✅ **SRP** - Single Responsibility Principle
- ✅ **SSOT** - Single Source of Truth
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **Server-Side Rendering** - Next.js App Router
- ✅ **Error Handling** - Centralized error management
- ✅ **Code Splitting** - Dynamic imports untuk performance

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Master Admin**

---

<p align="center">Made with ❤️ for RSUP</p>
