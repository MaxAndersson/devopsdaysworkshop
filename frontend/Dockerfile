FROM node:16 as base
WORKDIR /app
COPY package*.json .
RUN  npm install
COPY . .

FROM node:16 as build
WORKDIR /app
COPY --from=base /app .
RUN npm run build

FROM nginx
WORKDIR /usr/share/nginx/html
COPY --from=build /app/build . 
EXPOSE 80

