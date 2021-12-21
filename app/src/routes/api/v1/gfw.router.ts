import { Method } from 'axios';
import { Context, Next } from 'koa';
import Router from 'koa-router';
import {
    RWAPIMicroservice,
    RequestToMicroserviceOptions,
} from 'rw-api-microservice-node';
import type request from 'request';

import FieldSerializer from 'serializers/field.serializer';
import logger from 'logger';
import DatasetMiddleware from 'middleware/dataset.middleware';
import GfwService from 'services/gfw.service';
import ErrorSerializer from 'serializers/error.serializer';
import { MicroserviceConnectionError } from 'errors/microserviceConnection.error';

const router: Router = new Router({
    prefix: '/api/v1/gfw',
});

class GfwRouter {
    static getCloneUrl(url: string, idDataset: string): Record<string, any> {
        return {
            http_method: 'POST',
            url: `/dataset/${idDataset}/clone`,
            body: {
                dataset: {
                    datasetUrl: url.replace('/gfw', '').replace('/api/v1', ''),
                    application: ['your', 'apps'],
                },
            },
        };
    }

    static async registerDataset(ctx: Context): Promise<void> {
        logger.info('Registering dataset with data', ctx.request.body);
        try {
            await GfwService.getFields(ctx.request.body.connector.connectorUrl);
            await RWAPIMicroservice.requestToMicroservice({
                method: 'PATCH',
                uri: `/v1/dataset/${ctx.request.body.connector.id}`,
                body: {
                    dataset: {
                        status: 1,
                    },
                },
                json: true,
            });
        } catch (e) {
            try {
                await RWAPIMicroservice.requestToMicroservice({
                    method: 'PATCH',
                    uri: `/v1/dataset/${ctx.request.body.connector.id}`,
                    body: {
                        dataset: {
                            status: 2,
                            errorMessage: `${e.name} - ${e.message}`,
                        },
                    },
                    json: true,
                });
            } catch (err) {
                logger.error('Error updating dataset');
                throw new MicroserviceConnectionError(
                    `Error updating dataset: ${err.message}`,
                );
            }
        }
        ctx.body = {};
    }

    static async fields(ctx: Context): Promise<void> {
        logger.info('Obtaining fields');
        const fields: Record<string, any> = await GfwService.getFields(
            ctx.request.body.dataset.connectorUrl,
        );
        ctx.body = FieldSerializer.serialize(fields.data);
    }

    static async query(ctx: Context): Promise<void> {
        const cloneUrl: Record<string, any> = GfwRouter.getCloneUrl(
            ctx.request.url,
            ctx.params.dataset,
        );
        logger.info('Executing query');
        const queryResults: Record<string, any> = await GfwService.executeQuery(
            ctx.request.body.dataset.connectorUrl,
            ctx.query.sql as string,
            ctx.request.method as Method,
            false,
            undefined,
            ctx.query.geostore_origin as string,
            ctx.query.geostore_id as string,
            cloneUrl,
        );
        ctx.body = queryResults;
    }

    static async download(ctx: Context): Promise<void> {
        try {
            const format: string = ctx.query.format
                ? (ctx.query.format as string)
                : 'csv';
            logger.debug('download format', format);
            let mimetype: string;
            switch (format) {
                case 'csv':
                    mimetype = 'text/csv';
                    break;
                case 'json':
                default:
                    mimetype = 'application/json';
                    break;
            }
            const queryResults: Record<string, any> = await GfwService.executeQuery(
                ctx.request.body.dataset.connectorUrl,
                ctx.query.sql as string,
                ctx.request.method as Method,
                true,
                format,
                ctx.query.geostore_origin as string,
                ctx.query.geostore_id as string,
            );
            ctx.body = queryResults;
            ctx.set(
                'Content-disposition',
                `attachment; filename=${ctx.request.body.dataset.id}.${format}`,
            );
            ctx.set('Content-type', mimetype);
        } catch (err) {
            ctx.body = ErrorSerializer.serializeError(
                err.statusCode || 500,
                err.error && err.error.error ? err.error.error[0] : err.message,
            );
            ctx.status = 500;
        }
    }
}

const toSQLMiddleware: (ctx: Context, next: Next) => Promise<void> = async (
    ctx: Context,
    next: Next,
) => {
    const options: RequestToMicroserviceOptions & request.OptionsWithUri = {
        method: 'GET',
        json: true,
        resolveWithFullResponse: true,
        simple: false,
        uri: '',
    };
    if (!ctx.query.sql && !ctx.request.body.sql) {
        ctx.throw(400, 'sql required');
        return;
    }

    const params: Record<string, any> = { ...ctx.query, ...ctx.request.body };
    options.uri = `/v1/convert/sql2SQL?sql=${encodeURIComponent(
        params.sql,
    )}&experimental=true&raster=${ctx.request.body.dataset.type === 'raster'}`;
    logger.debug(`Checking sql correct: ${params.sql}`);

    if (params.geostore) {
        options.uri += `&geostore=${params.geostore}`;
    }
    if (params.geojson) {
        options.body = {
            geojson: params.geojson,
        };
        options.method = 'POST';
    }

    try {
        const result: Record<string, any> = await RWAPIMicroservice.requestToMicroservice(options);
        logger.debug('result', result.statusCode);
        if (result.statusCode === 204 || result.statusCode === 200) {
            ctx.query.sql = result.body.data.attributes.query;
            ctx.state.jsonSql = result.body.data.attributes.jsonSql;
            await next();
        } else if (result.statusCode === 400) {
            ctx.status = result.statusCode;
            ctx.body = result.body;
        } else {
            ctx.throw(result.statusCode, result.body);
        }
    } catch (e) {
        if (
            e.errors
            && e.errors.length > 0
            && e.errors[0].status >= 400
            && e.errors[0].status < 500
        ) {
            ctx.status = e.errors[0].status;
            ctx.body = e;
        } else {
            throw e;
        }
    }
};

router.get(
    '/fields/:dataset',
    DatasetMiddleware.getDatasetById,
    GfwRouter.fields,
);
router.post('/rest-datasets/gfw', GfwRouter.registerDataset);
router.get(
    '/query/:dataset',
    DatasetMiddleware.getDatasetById,
    toSQLMiddleware,
    GfwRouter.query,
);
router.post(
    '/query/:dataset',
    DatasetMiddleware.getDatasetById,
    toSQLMiddleware,
    GfwRouter.query,
);
router.get(
    '/download/:dataset',
    DatasetMiddleware.getDatasetById,
    toSQLMiddleware,
    GfwRouter.download,
);
router.post(
    '/download/:dataset',
    DatasetMiddleware.getDatasetById,
    toSQLMiddleware,
    GfwRouter.download,
);

export default router;
