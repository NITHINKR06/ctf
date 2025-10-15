# CTF Platform 🚀

A modern, secure Capture The Flag (CTF) platform built with Next.js, Prisma, and PostgreSQL. Features a stunning cyberpunk-themed UI with glassmorphism effects, gradient animations, and a fully responsive design.

![CTF Platform](https://img.shields.io/badge/CTF-Platform-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.14-teal?style=for-the-badge&logo=prisma)

## ✨ Features

- 🎯 **Challenge Management**: Create, edit, and manage CTF challenges
- 👤 **User Authentication**: Secure registration and login system
- 🏆 **Leaderboard**: Real-time ranking system
- 🛡️ **Admin Dashboard**: Complete control over users and challenges
- 🎨 **Modern UI**: Cyberpunk-themed design with animations
- 📱 **Responsive**: Works perfectly on all devices
- 🔒 **Secure**: Built with security best practices
- ⚡ **Fast**: Optimized for Vercel's edge network

## 🚀 One-Click Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ctf-platform&env=DATABASE_URL,NEXTAUTH_SECRET,NEXTAUTH_URL&envDescription=Required%20environment%20variables&envLink=https://github.com/yourusername/ctf-platform%23environment-variables)

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (or use Prisma's hosted database)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ctf-platform.git
cd ctf-platform/ctf-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="your_postgresql_connection_string"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

To generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the platform.

## 🚀 Deployment to Vercel

### Method 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Your secret key
   - `NEXTAUTH_URL`: Your production URL (e.g., https://your-app.vercel.app)

### Method 2: Using GitHub

1. Push your code to GitHub
2. Import the repository in Vercel
3. Set environment variables
4. Deploy!

## 🔐 Security Features

- **Password Hashing**: Uses bcrypt for secure password storage
- **Session Management**: Secure JWT-based sessions with NextAuth
- **Input Validation**: All inputs are validated and sanitized
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **HTTPS Only**: Enforced in production
- **Rate Limiting**: Built-in protection against brute force attacks

## 👤 Admin Account

The **first user** to register automatically becomes an admin. Subsequent users are regular players.

### Admin Capabilities:
- Create and manage challenges
- View and edit all users
- Promote users to admin role
- Access admin dashboard at `/admin`

## 📊 Database Schema

```prisma
User
├── id (String)
├── email (String, unique)
├── name (String)
├── password (String, hashed)
├── role (USER | ADMIN)
└── submissions (Relation)

Challenge
├── id (String)
├── title (String)
├── description (String)
├── flag (String)
├── points (Int)
└── submissions (Relation)

Submission
├── id (String)
├── userId (String)
├── challengeId (String)
├── isCorrect (Boolean)
└── timestamp (DateTime)
```

## 🎮 Usage

### For Players:
1. Register an account
2. Login to the platform
3. View available challenges
4. Submit flags to earn points
5. Check your ranking on the leaderboard

### For Admins:
1. Access the admin panel at `/admin`
2. Create new challenges with title, description, flag, and points
3. Manage user roles
4. Monitor platform activity

## 🎨 UI Features

- **Glassmorphism Effects**: Modern glass-like UI elements
- **Gradient Animations**: Smooth color transitions
- **Floating Elements**: Animated background orbs
- **Neon Glow Effects**: Cyberpunk-style text effects
- **Responsive Grid**: Adapts to all screen sizes
- **Dark Theme**: Easy on the eyes for long hacking sessions

## 🔧 Configuration

### Vercel Configuration

The platform is optimized for Vercel's free tier:

- **Edge Functions**: API routes run on the edge
- **Static Generation**: Pages are pre-rendered when possible
- **Image Optimization**: Automatic image optimization
- **Analytics**: Built-in analytics support

### Performance Optimization

- **Database Connection Pooling**: Efficient connection management
- **Caching**: Smart caching strategies
- **Code Splitting**: Automatic code splitting
- **Lazy Loading**: Components load on demand

## 📈 Scaling

The platform is designed to handle 100+ concurrent users on Vercel's free tier:

- **Serverless Functions**: Auto-scaling based on demand
- **CDN**: Global content delivery
- **Database Pooling**: Efficient connection management
- **Optimized Queries**: Minimal database load

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues or questions, please open an issue on GitHub.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database by [Prisma](https://www.prisma.io/)
- Hosted on [Vercel](https://vercel.com/)
- UI inspired by cyberpunk aesthetics

---

**Made with 💜 for the hacking community**
