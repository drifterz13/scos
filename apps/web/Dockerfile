FROM oven/bun:1.3.2-alpine AS base
WORKDIR /app

FROM base AS builder
COPY . .
RUN bunx turbo@2.8.0 prune web --docker

FROM base AS installer
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/bun.lock /app/bun.lock
RUN bun install --frozen-lockfile

COPY --from=builder /app/out/full/ .
RUN bunx turbo@2.8.0 run build --filter=web

FROM caddy:2.10-alpine AS runner
WORKDIR /srv

COPY --from=installer /app/apps/web/dist /srv
COPY apps/web/Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
EXPOSE 443
