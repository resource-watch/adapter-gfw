import { RWAPIMicroservice } from 'rw-api-microservice-node';
import logger from 'logger';

import { DatasetNotFound } from 'errors/datasetNotFound.error';

class DatasetService {
    static async getDatasetById(
        datasetId: string,
        apiKey: string,
    ): Promise<Record<string, any>> {
        logger.info(
            `[DatasetService - getDatasetById] Validating presence of dataset with id: ${datasetId}`,
        );

        try {
            const dataset: Record<string, any> = await RWAPIMicroservice.requestToMicroservice({
                uri: `/v1/dataset/${datasetId}`,
                method: 'GET',
                headers: {
                    'x-api-key': apiKey
                }
            });
            return dataset.data;
        } catch (err) {
            if (err.statusCode === 404) {
                logger.info(
                    `[DatasetService - getDatasetById] There was an error obtaining a dataset: ${err}`,
                );
                throw new DatasetNotFound(err.error.errors[0].detail);
            }
            logger.warn(
                `[DatasetService - getDatasetById] There was an error obtaining a dataset: ${err}`,
            );
            throw err;
        }
    }
}

export default DatasetService;
