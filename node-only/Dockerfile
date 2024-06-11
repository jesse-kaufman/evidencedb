# syntax=docker/dockerfile:1.4
FROM node:22-bookworm-slim AS production

# Defaults to production, docker-compose overrides this to development on build and run.
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

USER node
WORKDIR /app
EXPOSE ${NODE_PORT}

COPY package*.json .
RUN npm ci && npm cache clean --force

COPY --chown=node:node . .

RUN ./node_modules/.bin/gulp build && \
    rm -rf ./src/public/src && \
    rm -f tsconfig.json

CMD [ "npm", "start" ]

# Development container
FROM production AS development
CMD [ "./node_modules/.bin/gulp", "start-dev" ]
