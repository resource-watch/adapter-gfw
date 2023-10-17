import nock from 'nock';
import chai from 'chai';

import logger from 'logger';
import { getTestServer } from './utils/test-server';
import {
    createMockGetDataset,
    createMockConvertSQL,
    createMockSQLQuery,
} from './utils/mock';
import { ensureCorrectError, mockValidateRequestWithApiKey } from './utils/helpers';

let requester: ChaiHttp.Agent;

chai.should();

describe('Query download tests - POST HTTP verb', () => {
    before(async () => {
        nock.cleanAll();

        if (process.env.NODE_ENV !== 'test') {
            throw Error(
                `Running the test suite with NODE_ENV ${process.env.NODE_ENV} may result in permanent data loss. Please use NODE_ENV=test.`,
            );
        }

        requester = await getTestServer();
    });

    it('Download from a dataset without connectorType gfw should fail', async () => {
        mockValidateRequestWithApiKey({})
        const timestamp: string = String(new Date().getTime());

        createMockGetDataset(timestamp, { connectorType: 'foo' });

        const requestBody: Record<string, any> = {};
        const query: string = `select * from ${timestamp}`;
        const response: Record<string, any> = await requester
            .post(
                `/api/v1/gfw/download/${timestamp}?sql=${encodeURI(
                    query,
                )}&geostore_id=`,
            )
            .set('x-api-key', 'api-key-test')
            .send(requestBody);

        ensureCorrectError(
            response,
            "This operation is only supported for datasets with connectorType 'rest'",
            422,
        );
    });

    it('Download from a dataset without a supported provider should fail', async () => {
        mockValidateRequestWithApiKey({})
        const timestamp: string = String(new Date().getTime());

        createMockGetDataset(timestamp, { provider: 'foo' });

        const requestBody: Record<string, any> = {};
        const query: string = `select * from ${timestamp}`;
        const response: Record<string, any> = await requester
            .post(`/api/v1/gfw/download/${timestamp}?sql=${query}`)
            .set('x-api-key', 'api-key-test')
            .send(requestBody);

        ensureCorrectError(
            response,
            "This operation is only supported for datasets with provider 'gfw'",
            422,
        );
    });

    it('Download without sql parameter should return bad request', async () => {
        mockValidateRequestWithApiKey({})
        const timestamp: string = String(new Date().getTime());

        createMockGetDataset(timestamp, undefined);

        const response: Record<string, any> = await requester
            .post(`/api/v1/gfw/download/${timestamp}`)
            .set('x-api-key', 'api-key-test')
            .send();

        ensureCorrectError(response, 'sql required', 400);
    });

    it('Download should return result with format csv (happy case)', async () => {
        mockValidateRequestWithApiKey({})
        const timestamp: string = String(new Date().getTime());
        const sql: string = 'SELECT * from DATA LIMIT 2';

        createMockGetDataset(timestamp, undefined);
        createMockSQLQuery(sql, true, 'csv', 'POST');
        createMockConvertSQL(sql);

        const response: Record<string, any> = await requester
            .post(`/api/v1/gfw/download/${timestamp}`)
            .set('x-api-key', 'api-key-test')
            .query({ format: 'csv' })
            .send({
                sql,
                geometry: {
                    type: 'Polygon',
                    coordinates: [
                        [100.0, 0.0],
                        [101.0, 0.0],
                        [101.0, 1.0],
                        [100.0, 1.0],
                        [100.0, 0.0],
                    ],
                },
            });

        response.status.should.equal(200);
        response.headers['content-type'].should.equal('text/csv');
        response.headers['content-disposition'].should.equal(
            `attachment; filename=${timestamp}.csv`,
        );
        logger.debug('text', response.text);
        response.text.should.contains('"iso","adm1"');
    });

    afterEach(() => {
        if (!nock.isDone()) {
            throw new Error(
                `Not all nock interceptors were used: ${nock.pendingMocks()}`,
            );
        }
    });
});
