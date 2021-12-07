import { RWAPIMicroservice } from 'rw-api-microservice-node';
import logger from 'logger';

// @ts-ignore
import DatasetNotFound from 'errors/datasetNotFound.error';

const API_VERSION: string = 'v1';

interface Dataset {
  id: string;
  type: string;
}
class DatasetService {
  static async getDatasetById(datasetId: string): Promise<Record<string, any>> {
    logger.info(
      `[DatasetService - getDatasetById] Validating presence of dataset with id: ${datasetId}`
    );

    try {
      const dataset: Record<string, any> =
        await RWAPIMicroservice.requestToMicroservice({
          uri: `/${API_VERSION}/dataset/${datasetId}`,
          method: 'GET',
          json: true,
        });
      return dataset.data;
    } catch (err) {
      if (err.statusCode === 404) {
        logger.info(
          `[DatasetService - getDatasetById] There was an error obtaining a dataset: ${err}`
        );
        throw new DatasetNotFound(err.error.errors[0].detail);
      }
      logger.warn(
        `[DatasetService - getDatasetById] There was an error obtaining a dataset: ${err}`
      );
      throw err;
    }
  }
}

export default DatasetService;
