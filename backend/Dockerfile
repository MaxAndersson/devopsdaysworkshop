FROM node:17 as base
WORKDIR /app
COPY package*.json .
RUN  npm install
COPY . .

FROM node:17-alpine
WORKDIR /app
COPY --from=base /app .
EXPOSE 4000
ENV PORT=4000
ENTRYPOINT ["node","index.js"]

