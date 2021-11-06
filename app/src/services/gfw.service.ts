import axios from 'axios'

import logger from 'logger'


class GfwService {

    static async getFields(urlDataset: string) {
        logger.debug(`Obtaining fields of ${urlDataset}`);
        const reqUrl = `${urlDataset}/fields`;
        logger.debug('Doing request to ', reqUrl);
        try {
            const result = await axios.get(reqUrl);
            return result.data;
        } catch (err) {
            logger.error('Error obtaining fields', err);
            throw new Error('Error obtaining fields');
        }
    }
}

export default GfwService;
