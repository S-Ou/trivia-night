FROM node:22-alpine AS builder
WORKDIR /app

# enable corepack (pnpm) and copy lockfile for reproducible installs
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./

# copy the rest and install
COPY . .
RUN pnpm install --frozen-lockfile

# generate prisma client and build the Next app
RUN npx prisma generate
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@latest --activate

# copy standalone output and static assets created by next's standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# copy node_modules and package.json so runtime deps (including prisma) are available
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV PORT=3000

# Start the Next standalone server directly. Migrations should be run outside of the container (CI/job).
CMD ["node", "server.js"]
