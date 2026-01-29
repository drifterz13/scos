FROM oven/bun:1.3.2-alpine AS base
WORKDIR /app

FROM base AS builder
COPY . .
RUN bunx turbo@2.8.0 prune warehouse --docker

FROM base AS installer
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/bun.lock /app/bun.lock
RUN bun install --frozen-lockfile

COPY --from=builder /app/out/full/ .
RUN bunx turbo@2.8.0 run build --filter=warehouse

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

USER bun
COPY --from=installer /app/apps/warehouse/dist ./dist
COPY --from=installer /app/apps/warehouse/package.json .
COPY --from=installer /app/node_modules ./node_modules

EXPOSE 3002
ENTRYPOINT [ "bun", "run", "dist/index.js" ]
