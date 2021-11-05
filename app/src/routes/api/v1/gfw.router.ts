import { Context, Next } from 'koa';
import Router from 'koa-router';
import { RWAPIMicroservice } from 'rw-api-microservice-node';

import logger from 'logger'
import DatasetMiddleware from 'middleware/dataset.middleware';
import GfwService from 'services/gfw.service';

const router = new Router({
    prefix: '/gfw',
});


class GfwRouter {

    static async registerDataset(ctx: Context) {
        logger.info('Registering dataset with data', ctx.request.body);
        try {
            await GfwService.getFields(ctx.request.body.connector.connectorUrl);
            await RWAPIMicroservice.requestToMicroservice({
                method: 'PATCH',
                uri: `/dataset/${ctx.request.body.connector.id}`,
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
                uri: `/dataset/${ctx.request.body.connector.id}`,
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
    }}
// router.post('/rest-datasets/cartodb', sanitizeUrl, CartoRouter.registerDataset);
router.post('/rest-datasets/gfw', GfwRouter.registerDataset)

export default router