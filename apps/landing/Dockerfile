FROM node:22-alpine AS base
RUN npm install -g pnpm turbo

FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune @repo/landing --docker

FROM base AS installer
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

FROM installer AS builder
COPY --from=pruner /app/out/full/ .
ARG ASTRO_BASE=/landing
ENV ASTRO_BASE=${ASTRO_BASE}
RUN pnpm turbo build --filter=@repo/landing

FROM nginx:alpine AS runner
COPY --from=builder /app/apps/landing/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
