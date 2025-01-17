# 1. Use the official Node.js 20 image as the base
FROM node:20-alpine AS builder

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json to the working directory
COPY package*.json ./

# 4. Install dependencies
RUN npm ci

# 5. Copy the rest of the application code to the working directory
COPY . .

# 6. Install development dependencies
RUN npm install

# 8. Build the Next.js application
RUN npm run build

# 9. Production image
FROM node:20-alpine

# 10. Set the working directory
WORKDIR /app

# 11. Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# 13. Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# 14. Expose the desired port
EXPOSE 3000

# 15. Start the Next.js application
CMD ["npm", "start"]