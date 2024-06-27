# Toptal REST series

[![Maintainability](https://api.codeclimate.com/v1/badges/966e204fd4b23815ceb9/maintainability)](https://codeclimate.com/github/makinhs/toptal-rest-series/maintainability)

A project made for the free _Building a Node.js/TypeScript REST API_ series at the Toptal Engineering Blog:

- [Part 1: Express.js](https://www.toptal.com/express-js/nodejs-typescript-rest-api-pt-1) &rarr; [source tree](https://github.com/makinhs/toptal-rest-series/tree/toptal-article-01)
- [Part 2: Models, Middleware, and Services](https://www.toptal.com/express-js/nodejs-typescript-rest-api-pt-2) &rarr; [source tree](https://github.com/makinhs/toptal-rest-series/tree/toptal-article-02)
- [Part 3: MongoDB, Authentication, and Automated Tests](https://www.toptal.com/express-js/nodejs-typescript-rest-api-pt-3) &rarr; [source tree](https://github.com/makinhs/toptal-rest-series/tree/toptal-article-03)

Visit https://www.toptal.com/blog and subscribe to our newsletter to read great articles!

# Quick Start Guide

To run the cloned codebase directly, you need to have Node.js and Docker installed.

1. Run `npm i` to install dependencies.
2. Run `sudo docker-compose up -d` to get a MongoDB instance running.
3. Make your own `.env` file in the project root, following the key name but not value used in [`.env.example`](https://github.com/makinhs/toptal-rest-series/blob/toptal-article-03/.env.example).
4. From there, any the following should work:
  - `npm run test`
  - `npm run test-debug`
  - `npm start`
  - `npm run debug`

## Bonus: Prettification and Linting

Be sure to check the README and relevant files of the [extra features](https://github.com/makinhs/toptal-rest-series/tree/toptal-extra-features) branch for help on setting up Prettier and ESLint the same way they're used in this project.
