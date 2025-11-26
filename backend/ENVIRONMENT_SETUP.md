# 🔧 Environment Configuration Guide

## 📋 Spring Profiles

This application uses Spring Boot profiles to manage different configurations for development and production environments.

---

## 🏠 Development Profile (Default)

**Profile Name:** `default` (no profile specified)  
**Configuration File:** `application.properties`  
**Usage:** Local development

### Features:
- ✅ SQL logging enabled
- ✅ Detailed error messages
- ✅ DevTools enabled (hot reload)
- ✅ Local database connection
- ✅ Debug logging
- ✅ CORS allows localhost

### To Run in Development:
```bash
# Default (no profile needed)
mvn spring-boot:run

# Or explicitly
export SPRING_PROFILES_ACTIVE=
mvn spring-boot:run
```

### Environment Variables (Development):
```properties
# Database (from application.properties)
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/printandread
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=admin@mark

# Cloudinary (from application.properties)
CLOUDINARY_CLOUD_NAME=deqnohf2h
CLOUDINARY_API_KEY=248939745186147
CLOUDINARY_API_SECRET=gJstoqETDXmVh21U23zqmyRstgQ
```

---

## 🚀 Production Profile

**Profile Name:** `production`  
**Configuration File:** `application-prod.properties`  
**Usage:** Render deployment, production servers

### Features:
- ✅ Optimized connection pooling
- ✅ SQL logging disabled
- ✅ Minimal error details (security)
- ✅ Production database connection
- ✅ Info-level logging
- ✅ CORS configured for production frontend URL
- ✅ Compression enabled
- ✅ Flyway migrations auto-run

### To Run in Production:
```bash
# Set profile via environment variable
export SPRING_PROFILES_ACTIVE=production
mvn spring-boot:run
```

### Environment Variables (Production - Render):
```properties
# Profile
SPRING_PROFILES_ACTIVE=production

# Database (from Render database service)
SPRING_DATASOURCE_URL=<auto-set by Render>
SPRING_DATASOURCE_USERNAME=<auto-set by Render>
SPRING_DATASOURCE_PASSWORD=<auto-set by Render>

# Server
PORT=8080

# Frontend
FRONTEND_URL=https://printandread-frontend.onrender.com

# Cloudinary (set manually in Render dashboard)
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

---

## 🔄 Profile Activation

### Method 1: Environment Variable (Recommended)
```bash
# Development
export SPRING_PROFILES_ACTIVE=
# or don't set it (defaults to development)

# Production
export SPRING_PROFILES_ACTIVE=production
```

### Method 2: Command Line
```bash
# Development
mvn spring-boot:run

# Production
mvn spring-boot:run -Dspring-boot.run.profiles=production
```

### Method 3: Application Properties
```properties
# In application.properties (not recommended for production)
spring.profiles.active=production
```

---

## 📊 Configuration Comparison

| Feature | Development | Production |
|---------|------------|------------|
| **SQL Logging** | ✅ Enabled | ❌ Disabled |
| **Error Details** | ✅ Full stack traces | ❌ Minimal |
| **Logging Level** | DEBUG | INFO |
| **DevTools** | ✅ Enabled | ❌ Disabled |
| **Connection Pool** | Default | Optimized (10 max) |
| **Compression** | ❌ | ✅ Enabled |
| **CORS Origins** | localhost:3000, localhost:4200 | Production frontend URL |
| **Database** | Local PostgreSQL | Render PostgreSQL |

---

## 🐳 Docker Deployment

### Development (Local):
```bash
docker-compose up
# Uses development profile by default
```

### Production (Render):
- Profile is set via `SPRING_PROFILES_ACTIVE=production` in `render.yaml`
- Dockerfile doesn't need profile specification
- Environment variables are injected at runtime

---

## ✅ Verification

### Check Active Profile:
```bash
# In application logs, look for:
# "The following profiles are active: production"
# or
# "No active profile set, falling back to default"
```

### Test Profile-Specific Config:
```bash
# Development: Should see SQL queries in logs
# Production: Should NOT see SQL queries
```

---

## 🔒 Security Notes

1. **Never commit production credentials** to `application.properties`
2. **Use environment variables** for production secrets
3. **Development credentials** in `application.properties` are for local use only
4. **Render automatically sets** database credentials from linked database service

---

**Last Updated:** 2025-01-17

