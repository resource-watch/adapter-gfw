import nock from 'nock';
import chai from 'chai';

import { getTestServer } from './utils/test-server';
import { createMockRegisterDataset } from './utils/mock';
import { DATASET } from './utils/test.constants';
import { mockValidateRequestWithApiKey } from "./utils/helpers";

let requester: ChaiHttp.Agent;

chai.should();

describe('Create GFW dataset tests', () => {
    before(async () => {
        nock.cleanAll();

        if (process.env.NODE_ENV !== 'test') {
            throw Error(
                `Running the test suite with NODE_ENV ${process.env.NODE_ENV} may result in permanent data loss. Please use NODE_ENV=test.`,
            );
        }

        requester = await getTestServer();
    });

    it('Should create dataset', async () => {
        mockValidateRequestWithApiKey({})
        createMockRegisterDataset(DATASET.data.id);

        const response: Record<string, any> = await requester
            .post('/api/v1/gfw/rest-datasets/gfw')
            .set('x-api-key', 'api-key-test')
            .send({
                connector: {
                    connectorUrl: DATASET.data.attributes.connectorUrl,
                    tableName: DATASET.data.attributes.table_name,
                    id: DATASET.data.id,
                },
            });

        response.status.should.equal(200);
    });

    afterEach(() => {
        if (!nock.isDone()) {
            throw new Error(
                `Not all nock interceptors were used: ${nock.pendingMocks()}`,
            );
        }
    });
});
