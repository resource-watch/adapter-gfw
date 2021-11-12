import { Context, Next } from 'koa';
import Router from 'koa-router';
import { RWAPIMicroservice, RequestToMicroserviceOptions} from 'rw-api-microservice-node';
import type request from 'request';

import FieldSerializer from 'serializers/field.serializer';
import logger from 'logger';
import DatasetMiddleware from 'middleware/dataset.middleware';
import GfwService from 'services/gfw.service';

const router: Router = new Router({
    prefix: `/api/${process.env.API_VERSION}/gfw`,
});

class GfwRouter {

    static async registerDataset(ctx: Context): Promise<void> {
        logger.info('Registering dataset with data', ctx.request.body);
        try {
            await GfwService.getFields(ctx.request.body.connector.connectorUrl);
            await RWAPIMicroservice.requestToMicroservice({
                method: 'PATCH',
                uri: `/${process.env.API_VERSION}/dataset/${ctx.request.body.connector.id}`,
                body: {
                    dataset: {
                        status: 1
                    }
                },
                json: true
            });
        } catch (e) {
            await RWAPIMicroservice.requestToMicroservice({
                method: 'PATCH',
                uri: `/${process.env.API_VERSION}/dataset/${ctx.request.body.connector.id}`,
                body: {
                    dataset: {
                        status: 2,
                        errorMessage: `${e.name} - ${e.message}`
                    }
                },
                json: true
            });
        }
        ctx.body = {};
    }

    static async fields(ctx: Context): Promise<void> {
        logger.info('Obtaining fields');
        const fields: Record<string, any> = await GfwService.getFields(ctx.request.body.dataset.connectorUrl);
        ctx.body = FieldSerializer.serialize(fields.data);
    }

    static async query(ctx: Context): Promise<void> {
        logger.info('Executing query');
        // @ts-ignore
        const queryResults: Record<string, any> = await GfwService.executeQuery(
            ctx.request.body.dataset.connectorUrl, ctx.query.sql,
            ctx.query.geostore_origin, ctx.query.geostore_id);
        ctx.body = queryResults;
    }
}

const serializeObjToQuery: (obj: Record<string, any>) => string = (obj: Record<string, any>) => Object.keys(obj).reduce((a, k) => {
    a.push(`${k}=${encodeURIComponent(obj[k])}`);
    return a;
}, []).join('&');


const toSQLMiddleware:(ctx: Context, next: Next) => Promise<void> = async (ctx: Context, next: Next) => {
    const options: RequestToMicroserviceOptions & request.OptionsWithUri = {
        method: 'GET',
        json: true,
        resolveWithFullResponse: true,
        simple: false,
        uri: '',
    };
    if (!ctx.query.sql && !ctx.request.body.sql) {
        ctx.throw(400, 'sql or fs required');
        return;
    }

    if (ctx.query.sql || ctx.request.body.sql) {
        const params: Record<string, any> = { ...ctx.query, ...ctx.request.body };
        options.uri = `${process.env.API_VERSION}/convert/sql2SQL?sql=${encodeURIComponent(params.sql)}&experimental=true&raster=${ctx.request.body.dataset.type === 'raster'}`;
        logger.debug(`Checking sql correct: ${params.sql}`);

        if (params.geostore) {
            options.uri += `&geostore=${params.geostore}`;
        }
        if (params.geojson) {
            options.body = {
                geojson: params.geojson
            };
            options.method = 'POST';
        }
    } else {
        logger.debug('Obtaining sql from featureService');
        const fs: Record<string, any> = { ...ctx.request.body };
        delete fs.dataset;
        const query: string = serializeObjToQuery(ctx.request.query);
        const body: Record<string, any> = fs;

        if (query) {
            options.uri = `/convert/fs2SQL${query}&tableName=data`;
        } else {
            options.uri = `/convert/fs2SQL?tableName=data`;
        }
        options.body = body;
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
        if (e.errors && e.errors.length > 0 && e.errors[0].status >= 400 && e.errors[0].status < 500) {
            ctx.status = e.errors[0].status;
            ctx.body = e;
        } else {
            throw e;
        }
    }
};

router.get('/fields/:dataset', DatasetMiddleware.getDatasetById, GfwRouter.fields);
router.post('/rest-datasets/gfw', GfwRouter.registerDataset);
router.get('/query/:dataset', DatasetMiddleware.getDatasetById, toSQLMiddleware, GfwRouter.query);
router.post('/query/:dataset', DatasetMiddleware.getDatasetById, toSQLMiddleware, GfwRouter.query);


export default router;