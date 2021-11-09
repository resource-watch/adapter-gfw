import { Context, Next } from 'koa';
import Router from 'koa-router';
import { RWAPIMicroservice } from 'rw-api-microservice-node';

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
}

router.get('/fields/:dataset', DatasetMiddleware.getDatasetById, GfwRouter.fields);
router.post('/rest-datasets/gfw', GfwRouter.registerDataset);


export default router;