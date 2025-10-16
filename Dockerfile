# ---------- BUILDER ----------
FROM node:22-bookworm AS builder
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files first
COPY package.json pnpm-lock.yaml ./

# Use cache mount for pnpm store
RUN --mount=type=cache,target=/pnpm-store \
    pnpm config set store-dir /pnpm-store && \
    pnpm install --frozen-lockfile

# Copy rest of source
COPY . .

# Disable telemetry and heavy checks
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_DISABLE_SOURCEMAPS=1
ENV NEXT_IGNORE_TYPECHECK=1
ENV NEXT_IGNORE_ESLINT=1

# Build faster
RUN pnpm build --turbo

# ---------- RUNNER ----------
FROM node:22-bookworm AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
