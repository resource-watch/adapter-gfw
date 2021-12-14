import axios, { Method } from 'axios';

import logger from 'logger';

class GfwService {
    static async getFields(urlDataset: string): Promise<Record<string, any>[]> {
        logger.debug(`Obtaining fields of ${urlDataset}`);
        const reqUrl: string = `${urlDataset}/fields`;
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
        method: Method,
        download: boolean,
        format: string,
        geostoreOrigin: string,
        geostoreId: string,
        cloneUrl?: Record<string, any>,
    ): Promise<Record<string, any>> {
        let reqUrl: string = `${urlDataset}`;
        let data: Record<string, any> = {};

        if (download) {
            reqUrl = `${reqUrl}/download/${format}`;
        } else {
            reqUrl = `${reqUrl}/query`;
        }

        if (method === 'GET') {
            reqUrl = `${reqUrl}?sql=${sqlQuery}`;
        }

        let requestConfig: Record<string, any> = {
            url: reqUrl,
            method,
        };

        if (method === 'POST') {
            data = { sql: sqlQuery };
            requestConfig.data = data;
        }

        if (geostoreId) {
            reqUrl = `${reqUrl}&geostore_id=${geostoreId}`;

            if (geostoreOrigin) {
                reqUrl = `${reqUrl}&geostore_origin=${geostoreOrigin}`;
            }
        }
        logger.debug(`Sending query request to ${reqUrl}`);
        delete data.dataset;

        try {
            if (download) {
                requestConfig.responseType = 'text';
                const result: Record<string, any> = await axios.request(
                    requestConfig,
                );
                return result.data;
            } else {
                const result: Record<string, any> = await axios.request(
                    requestConfig,
                );
                logger.debug('QUERY RESULT', result.data);
                return { data: result.data.data, meta: { cloneUrl } };
            }
        } catch (err) {
            logger.error('Error obtaining query', err);
            throw new Error('Error obtaining query results');
        }
    }
}

export default GfwService;
