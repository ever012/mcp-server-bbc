# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install pnpm
RUN npm install -g pnpm

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile --no-optional

# Copy source code and tsconfig
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:22-alpine

# Install system dependencies for builderbot/baileys and sharp
RUN apk add --no-cache \
    dumb-init \
    vips-dev \
    vips-tools \
    ffmpeg \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    python3 \
    make \
    g++

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    FFMPEG_PATH=/usr/bin/ffmpeg \
    NODE_OPTIONS="--no-warnings"

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install pnpm
RUN npm install -g pnpm

# Install production dependencies
# Using --no-optional to avoid platform-specific binaries issues
RUN pnpm install --frozen-lockfile --prod

# Rebuild sharp for Alpine Linux (musl libc)
RUN npm rebuild sharp

# Copy built application from builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Create ffmpeg-installer compatibility structure
# This fixes the "Cannot find module" error for @ffmpeg-installer
RUN FFMPEG_PATH=$(find /app/node_modules/.pnpm -type d -name "@ffmpeg-installer+ffmpeg@*" 2>/dev/null | head -n 1) && \
    if [ -n "$FFMPEG_PATH" ]; then \
        mkdir -p "$FFMPEG_PATH/node_modules/@ffmpeg-installer/linux-x64" && \
        ln -sf /usr/bin/ffmpeg "$FFMPEG_PATH/node_modules/@ffmpeg-installer/linux-x64/ffmpeg" && \
        echo '{"name":"@ffmpeg-installer/linux-x64","version":"4.1.0","os":["linux"],"cpu":["x64"],"main":"index.js"}' > "$FFMPEG_PATH/node_modules/@ffmpeg-installer/linux-x64/package.json" && \
        echo 'module.exports = { path: "/usr/bin/ffmpeg", version: "4.1.0", url: "system" };' > "$FFMPEG_PATH/node_modules/@ffmpeg-installer/linux-x64/index.js"; \
    fi

# Create necessary directories for builderbot/baileys
RUN mkdir -p /app/.wwebjs_auth /app/.wwebjs_cache && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose ports
EXPOSE 3141 3001

# Health check to verify the service is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3141', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/@interface/index.js"]