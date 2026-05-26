# News Management Hub

Full-stack news management application with React frontend and NestJS backend.

## 🚀 Features

- **Authentication**: JWT-based auth with refresh tokens
- **User Management**: CRUD operations for users with role-based access (admin, manager, reporter)
- **News Management**: Create, read, update, delete news articles with rich text editor
- **Profile Management**: Update profile, change password, upload profile pictures
- **Calendar & Tasks**: Todo management with calendar view
- **Dashboard**: Analytics and statistics visualization

## 🛠 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **React Router** for navigation
- **React Query** for data fetching
- **Axios** for API calls
- **Chart.js** for data visualization
- **Vitest** for testing

### Backend
- **NestJS** framework
- **MongoDB** with Mongoose
- **JWT** authentication
- **Passport** for auth strategies
- **Bcrypt** for password hashing
- **Swagger** for API documentation
- **Jest** for testing

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Clone Repository
```bash
git clone https://github.com/dashaaaa21/app-news-management.git
cd app-news-management
```

### Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### Environment Variables

**Server** (`server/.env`):
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/news-db
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d
```

**Client** (`client/.env`):
```env
VITE_API_BASE_URL=http://localhost:3001
```

## 🏃 Running Locally

### Development Mode

**Run both client and server:**
```bash
npm run start
```

**Or run separately:**
```bash
# Terminal 1 - Server
npm run server

# Terminal 2 - Client
npm run dev
```

**Access:**
- Client: http://localhost:5173
- Server: http://localhost:3001
- Swagger API Docs: http://localhost:3001/api/docs

### Production Build

**Client:**
```bash
cd client
npm run build
npm run preview
```

**Server:**
```bash
cd server
npm run build
npm run start
```

## 🧪 Testing

### Server Tests (Jest)
```bash
cd server
npm test
```

### Client Tests (Vitest)
```bash
cd client
npm test              # Run once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3001/api/docs

### Main Endpoints

**Auth:**
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /User/refreshToken` - Refresh access token
- `POST /logout/:userId` - Logout user
- `POST /changePassword` - Change password
- `POST /updateProfile` - Update user profile

**Users:**
- `GET /getAllUsers` - Get all users
- `GET /getUserById/:id` - Get user by ID
- `PUT /updateUserById/:id` - Update user
- `DELETE /deleteUser/:id` - Delete user

**News:**
- `GET /api/news` - Get all news
- `GET /api/news/:id` - Get news by ID
- `POST /api/news` - Create news
- `PUT /api/news/:id` - Update news
- `DELETE /api/news/:id` - Delete news

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

**Client (Vercel):**
1. Connect GitHub repo to Vercel
2. Set root directory to `client`
3. Add `VITE_API_BASE_URL` environment variable
4. Deploy

**Server (Render):**
1. Connect GitHub repo to Render
2. Set root directory to `server`
3. Add environment variables (MongoDB URI, JWT secrets)
4. Deploy

## 📁 Project Structure

```
news-management-hub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API calls
│   │   ├── common/        # Shared utilities, hooks, types
│   │   ├── components/    # React components
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   ├── router/        # Routing configuration
│   │   └── test/          # Test setup
│   └── package.json
├── server/                # NestJS backend
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # Users module
│   │   ├── news/          # News module
│   │   └── main.ts        # Entry point
│   └── package.json
├── DEPLOYMENT.md          # Deployment guide
└── README.md
```

## 🔐 Default Users

For testing purposes (mock login):
```
Admin:
  Email: admin@admin.com
  Password: admin123

Manager:
  Email: manager@manager.com
  Password: manager123

Reporter:
  Email: reporter@reporter.com
  Password: reporter123
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Daryna Tkachenko - [GitHub](https://github.com/dashaaaa21)

## 🙏 Acknowledgments

- NestJS documentation
- React documentation
- MongoDB documentation
