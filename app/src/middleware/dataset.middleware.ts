import { Context, Next } from 'koa';

import logger from 'logger';
import DatasetService from 'services/dataset.service';

class DatasetMiddleware {

    static async getDatasetById(ctx: Context, next: Next): Promise<void> {
        const datasetId: string = ctx.params.dataset;
        logger.debug('[DatasetRouter - getDatasetById] - Dataset id', datasetId);

        if (!datasetId) {
            ctx.throw(400, 'Invalid request');
        }

        const dataset: Record<string, any> = await DatasetService.getDatasetById(datasetId);

        if (!dataset) {
            ctx.throw(404, 'Dataset not found');
        }

        if (dataset.attributes.connectorType !== 'rest') {
            ctx.throw(422, 'This operation is only supported for datasets with connectorType \'rest\'');
        }

        if (dataset.attributes.provider !== 'gfw') {
            ctx.throw(422, 'This operation is only supported for datasets with provider \'gfw\'');
        }

        ctx.request.body.dataset = {
            id: dataset.id,
            ...dataset.attributes,
        };

        await next();
    }

}

export default DatasetMiddleware;
