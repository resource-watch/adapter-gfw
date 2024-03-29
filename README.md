# Resource Watch GFW Adapter

[![Build Status](https://travis-ci.com/resource-watch/adapter-gfw.svg?branch=dev)](https://travis-ci.com/resource-watch/adapter-gfw)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ab671d1627547f12813a/test_coverage)](https://codeclimate.com/github/resource-watch/adapter-gfw/test_coverage)

This repository is the microservice that implements the GFW adapter
funcionality, which is exposed on the `/gfw` endpoint.

## Dependencies

<!-- TODO: Add localstack local dev dependency when it's functional -->

The GFW Adapter microservice is built using [Node.js](https://nodejs.org/en/), and can be executed either natively or using Docker, each of which has its own set of requirements.

Native execution requires:

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)

Execution using Docker requires:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

Dependencies on other Microservices:

- [Authorization](https://github.com/resource-watch/authorization)
- [Dataset](https://github.com/resource-watch/dataset/)
- [Converter](https://github.com/resource-watch/converter)
- [Query](https://github.com/resource-watch/query)

## Getting started

Start by cloning the repository from github to your execution environment

```
git clone https://github.com/resource-watch/adapter-gfw.git && cd adapter-gfw
```

After that, follow one of the instructions below:

### Using native execution

1 - Set up your environment variables. See `dev.env.sample` for a list of variables you should set, which are described in detail in [this section](#environment-variables) of the documentation. Native execution will NOT load the `dev.env` file content, so you need to use another way to define those values. One option is to export them from `dev.env`:

```
export $(xargs < dev.env)
```

2 - Install node dependencies using yarn:

```
yarn
```

3 - Start the application server:

```
yarn start
```

 <!-- TODO: Add sentence on how to connect to the MS via localstack when it's functional -->

### Using Docker

1 - Create and complete your `dev.env` file with your configuration. The meaning of the variables is available in this [section](#Environment variables). You can find an example `dev.env.sample` file in the project root.

2 - Execute the following command to run GFW Adapter:

```
./gfw_adapter.sh develop
```

 <!-- TODO: Add sentence on how to connect to the MS via localstack when it's functional -->

## Testing

There are two ways to run the included tests:

### Using native execution

Follow the instruction above for setting up the runtime environment for native execution, then run:

```
yarn test
```

### Using Docker

Follow the instruction above for setting up the runtime environment for Docker execution, then run:

```
./gfw_adapter.sh test
```

## Configuration

### Environment variables

- PORT: number => TCP port in which the service will run.
- NODE_PATH: path => relative path to the source code. Should be `app/src`.
- MICROSERVICE_TOKEN: string => Admin role token to use with the authorization microservice.
- GATEWAY_URL: URL => AWS Gateway URL in cloud deployment. <!--TODO: add localstack when it's functional -->
- GFW_API_KEY => API key to access GFW DATA API.
- FASTLY_ENABLED: boolean => Whether to enable Fastly caching.

You can optionally set other variables, see [this file](config/custom-environment-variables.json) for an extended list.
