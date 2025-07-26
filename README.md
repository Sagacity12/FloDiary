# 📖 FloDiary API

A secure and modern personal diary application API built with TypeScript, Express.js, and MongoDB. FloDiary provides robust authentication, user management, and diary entry features with enterprise-grade security.

## 🚀 Features

- **🔐 Secure Authentication** - JWT-based authentication with refresh tokens
- **👤 User Management** - Complete user profile management system
- **📝 Diary Entries** - Personal diary creation and management (coming soon)
- **🔒 Password Security** - Bcrypt hashing with salt rounds
- **⚡ Redis Caching** - Token blacklisting and session management
- **📊 Logging** - Comprehensive Winston logging system
- **🛡️ Security Middleware** - Rate limiting, CORS, and security headers

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis for session management
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt, helmet, cors, express-rate-limit
- **Validation**: AJV (Another JSON Schema Validator)
- **Logging**: Winston

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- Redis (v6.0 or higher)
- npm or yarn package manager

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Sagacity12/FloDiary.git
   cd FloDiary
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```


   # Security
   BCRYPT_SALT_ROUNDS=12
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔗 API Endpoints

### Base URL

```
http://localhost:3000/api/v1
```

### 🔐 Authentication Endpoints

#### Register User

Create a new user account with secure password hashing and validation.

**Endpoint:** `POST /api/v1/auth/register`

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!"
}
```

```

---

#### Login User

Authenticate an existing user and receive access tokens.

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**

```json
{
 "username": "johndoe",
  "password": "SecurePassword123!"
}
```




```

---

### 🔒 Protected Authentication Features

The API also includes several other authentication features that require proper authorization:

- **Password Reset** - Secure password reset functionality with validation
- **Token Verification** - Validate and verify JWT tokens
- **User Profile Access** - Get current user profile information
- **Logout** - Secure logout with token blacklisting
- **Logout All Devices** - Global logout from all sessions

### 👤 User Management Features

FloDiary provides comprehensive user management capabilities:

- **Profile Management** - Update user information and preferences
- **Profile Pictures** - Upload and manage user avatars
- **Public Profiles** - View other users' public information
- **User Search** - Find other users by various criteria
- **Account Management** - Account settings and deletion options

### 📝 Diary Features (Coming Soon)

The diary functionality will include:

- **Entry Creation** - Write and save personal diary entries
- **Entry Management** - Edit, delete, and organize entries
- **Privacy Controls** - Manage entry visibility and sharing
- **Search & Filter** - Find specific entries by date, mood, or content
- **Export Options** - Download diary entries in various formats

## 🔧 Development

### Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm run test         # Run test suite
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Project Structure

```
src/
├── controllers/     # Request handlers
├── services/       # Business logic
├── middleware/     # Express middleware
├── routes/         # API route definitions
├── models/         # Database models
├── helpers/        # Utility functions
├── logger/         # Winston logging setup
└── servers/        # Database connections
```

## 🛡️ Security Features

- **JWT Authentication** with secure token rotation
- **Password Hashing** using bcrypt with configurable salt rounds
- **Rate Limiting** to prevent abuse and brute force attacks
- **CORS Protection** with configurable origins
- **Security Headers** via Helmet.js
- **Input Validation** using AJV schema validation
- **Token Blacklisting** via Redis for secure logout

## 📊 Logging

FloDiary uses Winston for comprehensive logging:

- **Error Logging** - All errors are logged with stack traces
- **Request Logging** - HTTP requests and responses
- **Security Events** - Authentication attempts and failures
- **Performance Monitoring** - Response times and database queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

- Create an issue on GitHub
- Check the documentation
- Review the API responses for detailed error messages

---

**Built with ❤️ by the FloDiary Team**

_Your personal diary, secured and organized._
