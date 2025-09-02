# Use Ubuntu 22.04 to match DigitalOcean App Platform exactly
FROM ubuntu:22.04

# Set environment variables to prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

# Update package lists and install essential packages
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    gnupg \
    lsb-release \
    ca-certificates \
    software-properties-common \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 18.x (LTS) to match DigitalOcean App Platform
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Verify Node.js and npm versions match requirements
RUN node --version && npm --version

# Set working directory
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package.json ./

# Install dependencies using npm (matching DO App Platform)
# Note: Even though you have yarn.lock, DO App Platform uses npm by default
RUN npm install --production=false

# Copy all application files
COPY . .

# Build the application (matching DO App Platform build command)
RUN npm run build

# Create non-root user for security (matching DO App Platform practices)
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expose port 3000 (matching your DO App Platform config)
EXPOSE 3000

# Set production environment (matching DO App Platform)
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Health check to ensure container is running properly
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Start the application (matching DO App Platform run command)
CMD ["npm", "start"]
