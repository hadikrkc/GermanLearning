# -------- Production multi-stage build --------
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
WORKDIR /repo

FROM base AS deps
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile || pnpm install

FROM base AS build
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/api/node_modules ./apps/api/node_modules
COPY . .
WORKDIR /repo/apps/api
RUN pnpm prisma generate
RUN pnpm build

FROM node:20-alpine AS runtime
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
RUN apk add --no-cache openssl
ENV NODE_ENV=production

# pnpm'in symlink yapisini bozmamak icin tum /repo'yu kopyaliyoruz.
# Sonradan pnpm deploy ile slim image uretebiliriz; MVP icin bu yeterli.
COPY --from=build /repo /repo
WORKDIR /repo/apps/api

EXPOSE 3000
CMD ["sh", "-c", "pnpm exec prisma migrate deploy && node dist/main.js"]
