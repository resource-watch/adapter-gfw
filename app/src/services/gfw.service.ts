import axios from 'axios';

import logger from 'logger';


class GfwService {

    static async getFields(urlDataset: string): Promise<Record<string, any>[]> {
        logger.debug(`Obtaining fields of ${urlDataset}`);
        const reqUrl: string = `${urlDataset}/fields`;
        logger.debug('Doing request to ', reqUrl);
        try {
            const result: Record<string, any> = await axios.get(reqUrl);
            return result.data;
        } catch (err) {
            logger.error('Error obtaining fields', err);
            throw new Error('Error obtaining fields');
        }
    }

    static async executeQuery(
        urlDataset: string,
        sqlQuery: string,
        geostoreOrigin: string,
        geostoreId: string,
    ): Promise<Record<string, any>> {
        let reqUrl: string = `${urlDataset}/query?sql=${sqlQuery}`;

        if (geostoreId) {
            reqUrl = `${reqUrl}&geostore_id=${geostoreId}`;

            if (geostoreOrigin) {
                reqUrl = `${reqUrl}&geostore_origin=${geostoreOrigin}`;
            }
        }
        logger.debug(`Sending query request to ${reqUrl}`);
        try {
            const result: Record<string, any> = await axios.get(reqUrl);
            return result.data;
        } catch (err) {
            logger.error('Error obtaining query', err);
            throw new Error('Error obtaining query results');
        }
    }
}

export default GfwService;
