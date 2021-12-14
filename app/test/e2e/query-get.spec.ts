import nock from 'nock';
import chai from 'chai';

import { getTestAgent } from './utils/test-server';
import {
    createMockGetDataset,
    createMockConvertSQL,
    createMockSQLQuery,
} from './utils/mock';
import { ensureCorrectError } from './utils/helpers';
import { DEFAULT_RESPONSE_SQL_QUERY } from './utils/test.constants';

let requester: ChaiHttp.Agent;

chai.should();

describe('Query tests - GET HTTP verb', () => {
    before(async () => {
        nock.cleanAll();

        if (process.env.NODE_ENV !== 'test') {
            throw Error(
                `Running the test suite with NODE_ENV ${process.env.NODE_ENV} may result in permanent data loss. Please use NODE_ENV=test.`,
            );
        }

        requester = await getTestAgent();
    });

    it('Query to dataset without connectorType gfw should fail', async () => {
        const timestamp: string = String(new Date().getTime());

        createMockGetDataset(timestamp, { connectorType: 'foo' });

        const requestBody: Record<string, any> = {};
        const query: string = `select * from ${timestamp}`;
        const response: Record<string, any> = await requester
            .get(
                `/api/v1/gfw/query/${timestamp}?sql=${encodeURI(query)}&geostore_id=`,
            )
            .send(requestBody);

        ensureCorrectError(
            response,
            "This operation is only supported for datasets with connectorType 'rest'",
            422,
        );
    });

    it('Query to dataset without a supported provider should fail', async () => {
        const timestamp: string = String(new Date().getTime());

        createMockGetDataset(timestamp, { provider: 'foo' });

        const requestBody: Record<string, any> = {};
        const query: string = `select * from ${timestamp}`;
        const response: Record<string, any> = await requester
            .get(`/api/v1/gfw/query/${timestamp}?sql=${query}`)
            .send(requestBody);

        ensureCorrectError(
            response,
            "This operation is only supported for datasets with provider 'gfw'",
            422,
        );
    });

    it('Query without sql or fs parameter should return bad request', async () => {
        const timestamp: string = String(new Date().getTime());

        createMockGetDataset(timestamp);

        const response: Record<string, any> = await requester
            .get(`/api/v1/gfw/query/${timestamp}`)
            .send();

        ensureCorrectError(response, 'sql or fs required', 400);
    });

    it('Send query should return result(happy case)', async () => {
        const timestamp: string = String(new Date().getTime());
        const sql: string = 'SELECT * from DATA LIMIT 2';

        createMockGetDataset(timestamp);
        createMockSQLQuery(sql, false, undefined, 'GET');
        createMockConvertSQL(sql);

        const response: Record<string, any> = await requester
            .get(`/api/v1/gfw/query/${timestamp}`)
            .query({ sql })
            .send();

        response.status.should.equal(200);
        response.body.should.have.property('data').and.instanceOf(Array);
        response.body.should.have.property('meta').and.instanceOf(Object);

        const { meta, data } = response.body;
        data.should.deep.equal(DEFAULT_RESPONSE_SQL_QUERY.data);

        meta.should.have.property('cloneUrl').and.instanceOf(Object);
        // eslint-disable-next-line camelcase
        const {
            cloneUrl: { http_method: httpMethod, url, body },
        } = meta;
        httpMethod.should.equal('POST');
        url.should.equal(`/dataset/${timestamp}/clone`);
        body.should.have.property('dataset').and.instanceOf(Object);

        const { datasetUrl, application } = body.dataset;
        application.should.deep.equal(['your', 'apps']);
        datasetUrl.should.equal(
            `/query/${timestamp}?sql=${encodeURI(sql).replace('*', '%2A')}`,
        );
    });

    afterEach(() => {
        if (!nock.isDone()) {
            throw new Error(
                `Not all nock interceptors were used: ${nock.pendingMocks()}`,
            );
        }
    });
});
