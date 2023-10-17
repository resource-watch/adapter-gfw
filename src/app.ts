import { Server } from 'http';
import Koa from 'koa';
import koaBody from 'koa-body';
import koaLogger from 'koa-logger';
import { RWAPIMicroservice } from 'rw-api-microservice-node';
import cors from '@koa/cors';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import koaSimpleHealthCheck from 'koa-simple-healthcheck';
import logger from 'logger';
import ErrorSerializer from 'serializers/error.serializer';
import router from 'routes/gfw.router';
import config from 'config';

interface IInit {
    server: Server;
    app: Koa;
}

const init: () => Promise<IInit> = async (): Promise<IInit> => {
    return new Promise((resolve: (value: IInit | PromiseLike<IInit>) => void,
    ) => {
        const app: Koa = new Koa();

        app.use(
            koaBody({
                multipart: true,
                jsonLimit: '50mb',
                formLimit: '50mb',
                textLimit: '50mb',
            }),
        );
        app.use(koaSimpleHealthCheck());
        app.use(koaLogger());

        app.use(cors({ credentials: true }));

        app.use(
            async (
                ctx: { status: number; response: { type: string }; body: any },
                next: () => any,
            ) => {
                try {
                    await next();
                } catch (error) {
                    ctx.status = error.status || 500;

                    if (ctx.status >= 500) {
                        logger.error(error);
                    } else {
                        logger.info(error);
                    }

                    if (process.env.NODE_ENV === 'prod' && ctx.status === 500) {
                        ctx.response.type = 'application/vnd.api+json';
                        ctx.body = ErrorSerializer.serializeError(
                            ctx.status,
                            'Unexpected error',
                        );
                        return;
                    }

                    ctx.response.type = 'application/vnd.api+json';
                    ctx.body = ErrorSerializer.serializeError(
                        ctx.status,
                        error.message,
                    );
                }
            },
        );

        app.use(
            RWAPIMicroservice.bootstrap({
                logger,
                gatewayURL: process.env.GATEWAY_URL,
                microserviceToken: process.env.MICROSERVICE_TOKEN,
                fastlyEnabled: process.env.FASTLY_ENABLED as | boolean | 'true' | 'false',
                fastlyServiceId: process.env.FASTLY_SERVICEID,
                fastlyAPIKey: process.env.FASTLY_APIKEY,
                requireAPIKey: process.env.REQUIRE_API_KEY as boolean | 'true' | 'false' || true,
                awsCloudWatchLoggingEnabled: process.env.AWS_CLOUD_WATCH_LOGGING_ENABLED as boolean | 'true' | 'false' || true,
                awsRegion: process.env.AWS_REGION,
                awsCloudWatchLogStreamName: config.get('service.name'),
            }),
        );

        app.use(router.routes());

        const port: string = process.env.PORT || '9000';

        const server: Server = app.listen(port);

        logger.info('Server started in ', port);
        resolve({ app, server });
    })
};

export { init };
