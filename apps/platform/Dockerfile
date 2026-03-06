FROM node:22-alpine AS base
RUN npm install -g pnpm turbo

FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune @repo/platform --docker

FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

FROM installer AS builder
COPY --from=pruner /app/out/full/ .
ARG NEXT_BASE_PATH=/app
ENV NEXT_BASE_PATH=${NEXT_BASE_PATH}
RUN pnpm turbo build --filter=@repo/platform

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_BASE_PATH=/app
COPY --from=builder /app/apps/platform/.next/standalone ./
COPY --from=builder /app/apps/platform/.next/static ./apps/platform/.next/static
COPY --from=builder /app/apps/platform/public ./apps/platform/public
EXPOSE 3000
CMD ["node", "apps/platform/server.js"]
