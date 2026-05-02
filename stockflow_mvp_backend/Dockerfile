FROM node:20-alpine

# Required for Prisma on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies
RUN npm install

# Generate Prisma client
RUN node node_modules/prisma/build/index.js generate

# Copy rest of source
COPY . .

# Build TypeScript using node directly (avoids binary permission issues)
RUN node node_modules/@nestjs/cli/bin/nest.js build

# Remove dev dependencies after build
RUN npm prune --omit=dev

EXPOSE 3000

CMD ["sh", "-c", "node node_modules/prisma/build/index.js migrate deploy && node dist/main"]
