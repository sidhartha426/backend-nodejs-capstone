FROM node:18.12.1-bullseye-slim AS react-build

WORKDIR /usr/src/app/react
RUN mkdir -p ../secondchancewebsite/build/
COPY ./secondChance-frontend/package*.json ./
RUN npm install --omit=dev
COPY ./secondChance-frontend .
RUN npm run build


FROM node:18.12.1-bullseye-slim

WORKDIR /usr/src/app
COPY ./secondchancewebsite .
RUN npm install --omit=dev
RUN mkdir build
COPY --from=react-build  /usr/src/app/react/build ./build


EXPOSE 8000
CMD ["node", "index.js"]