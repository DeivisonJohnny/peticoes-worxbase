FROM node:18-alpine as deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# --------------------------

FROM node:18-alpine as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# --------------------------

FROM node:18-alpine as runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs

RUN adduser --system --uid 1001 -G nodejs nodejs

COPY --chown=nodejs:nodejs --from=builder /app .

USER nodejs

CMD ["yarn", "start"]