# ---------- BUILDER ----------
FROM node:22-bookworm AS builder
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files first (for better caching)
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDeps for build)
RUN pnpm install --frozen-lockfile

# Copy the rest of the project
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Disable Next telemetry for build
ENV NEXT_TELEMETRY_DISABLED=1
# Skip type-check and ESLint in Docker builds (CI can handle it)
ENV NEXT_IGNORE_TYPECHECK=1
ENV NEXT_IGNORE_ESLINT=1

# Build Next.js (standalone output)
RUN pnpm build

# ---------- RUNNER ----------
FROM node:22-bookworm AS runner
WORKDIR /app
ENV NODE_ENV=production

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only what's needed for runtime
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose and set port
EXPOSE 3000
ENV PORT=3000

# Start standalone Next.js server
CMD ["node", "server.js"]
