import nock from 'nock';
import chai from 'chai';
import { getTestServer } from './utils/test-server';

import { createMockGetDataset } from './utils/mock';
import { ensureCorrectError, mockValidateRequestWithApiKey } from './utils/helpers';
import { fields } from './utils/test.constants';

let requester: ChaiHttp.Agent;

chai.should();

describe('GET fields', () => {
    before(async () => {
        nock.cleanAll();

        if (process.env.NODE_ENV !== 'test') {
            throw Error(
                `Running the test suite with NODE_ENV ${process.env.NODE_ENV} may result in permanent data loss. Please use NODE_ENV=test.`
            );
        }

        requester = await getTestServer();
    });

    it('Getting the fields for a dataset without connectorType document should fail', async () => {
        mockValidateRequestWithApiKey({})
        const timestamp: string = String(new Date().getTime());

        createMockGetDataset(timestamp, { connectorType: 'foo' });

        const requestBody: Record<string, any> = {};

        const response: Record<string, any> = await requester
            .get(`/api/v1/gfw/fields/${timestamp}`)
            .set('x-api-key', 'api-key-test')
            .send(requestBody);

        ensureCorrectError(
            response,
            "This operation is only supported for datasets with connectorType 'rest'",
            422
        );
    });

    it('Getting the fields for a dataset without a supported provider should fail', async () => {
        mockValidateRequestWithApiKey({})
        const timestamp: string = String(new Date().getTime());

        createMockGetDataset(timestamp, { provider: 'foo' });

        const requestBody: Record<string, any> = {};

        const response: Record<string, any> = await requester
            .get(`/api/v1/gfw/fields/${timestamp}`)
            .set('x-api-key', 'api-key-test')
            .send(requestBody);

        ensureCorrectError(
            response,
            "This operation is only supported for datasets with provider 'gfw'",
            422
        );
    });

    it('Get fields correctly for a gfw dataset should return the field list (happy case)', async () => {
        mockValidateRequestWithApiKey({})
        const timestamp: string = String(new Date().getTime());

        const dataset: Record<string, any> = createMockGetDataset(
            timestamp,
            undefined
        );

        nock('https://data-api.globalforestwatch.org')
            .get('/dataset/nasa_viirs_fire_alerts/latest/fields')
            .reply(200, {
                data: fields,
            });

        const response: Record<string, any> = await requester
            .get(`/api/v1/gfw/fields/${dataset.id}`)
            .set('x-api-key', 'api-key-test')
            .send({});

        response.status.should.equal(200);
        response.body.should.have.property('fields');
        response.body.fields.should.deep.equal(fields);
    });

    afterEach(() => {
        if (!nock.isDone()) {
            throw new Error(
                `Not all nock interceptors were used: ${nock.pendingMocks()}`
            );
        }
    });
});
