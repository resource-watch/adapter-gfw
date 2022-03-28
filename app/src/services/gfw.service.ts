import axios from 'axios';

import logger from 'logger';

class GfwService {
    static async getFields(urlDataset: string): Promise<Record<string, any>[]> {
        logger.debug(`Obtaining fields of ${urlDataset}`);
        const reqUrl: string = `${urlDataset}/fields`;
        try {
            const result: Record<string, any> = await axios.get(reqUrl);
            return result.data;
        } catch (err) {
            throw new Error('Error obtaining fields');
        }
    }

    static async executeQuery(
        urlDataset: string,
        sqlQuery: string,
        download: boolean,
        format: string,
        geometry: Record<string, any>,
        geostoreOrigin: string,
        geostoreId: string,
        cloneUrl?: Record<string, any>,
    ): Promise<Record<string, any>> {
        let reqUrl: string = `${urlDataset}`;

        if (download) {
            reqUrl = `${reqUrl}/download/${format}`;
        } else {
            reqUrl = `${reqUrl}/query`;
        }

        let requestConfig: Record<string, any>;
        if (geometry) {
            requestConfig = {
                url: reqUrl,
                method: 'POST',
                data: { sql: sqlQuery, geometry },
            };
        } else {
            reqUrl = `${reqUrl}?sql=${sqlQuery}`;
            if (geostoreId) reqUrl = `${reqUrl}&geostore_id=${geostoreId}`;
            if (geostoreOrigin) {
                reqUrl = `${reqUrl}&geostore_origin=${geostoreOrigin}`;
            }

            requestConfig = {
                url: reqUrl,
                method: 'GET',
            };
        }

        requestConfig.headers = {
            'x-api-key': process.env.GFW_API_KEY,
        };
        logger.debug(`Sending query request to ${reqUrl}`);

        try {
            if (download) {
                requestConfig.responseType = 'text';
                const result: Record<string, any> = await axios.request(
                    requestConfig,
                );
                return result.data;
            }
            const result: Record<string, any> = await axios.request(
                requestConfig,
            );
            logger.debug('QUERY RESULT', result.data);
            return { data: result.data.data, meta: { cloneUrl } };
        } catch (err) {
            logger.error('Error obtaining query', err);
            throw new Error('Error obtaining query results');
        }
    }
}

export default GfwService;
