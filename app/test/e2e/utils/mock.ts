import { Method } from 'axios';
import nock from 'nock';

import { DEFAULT_RESPONSE_SQL_QUERY, DATASET_ATTRS } from './test.constants';

export const createMockConvertSQL: (sqlQuery: string) => void = (
    sqlQuery: string,
) => nock(process.env.GATEWAY_URL, { encodedQueryParams: true })
    .get(
        `/v1/convert/sql2SQL?sql=${encodeURIComponent(
            sqlQuery,
        )}&experimental=true&raster=false`,
    )
    .reply(200, {
        data: {
            type: 'result',
            id: 'undefined',
            attributes: {
                query: 'SELECT * from DATA LIMIT 2',
                jsonSql: {
                    select: [{ value: '*', alias: null, type: 'literal' }],
                    from: 'data',
                },
            },
            relationships: {},
        },
    });

export const createMockSQLQuery: (
    sql: string,
    download: boolean,
    format: string,
    method: Method
) => void = (sql: string, download: boolean, format, method: Method) => {
    const encodedSql: string = encodeURIComponent(sql);
    let pathPart: string = '';
    let response: Record<'data' | 'status', any> | String;
    if (download) {
        pathPart = `download/${format}`;
        response = 'some data "iso","adm1"';
    } else {
        pathPart = 'query';
        response = DEFAULT_RESPONSE_SQL_QUERY;
    }

    if (method === 'GET') {
        pathPart = `${pathPart}?sql=${encodedSql}`;
    }
    nock('https://data-api.globalforestwatch.org')
        .intercept(`/dataset/nasa_viirs_fire_alerts/latest/${pathPart}`, method)
        .reply(200, response);
};

export const createMockRegisterDataset: (id: string) => void = (id) => nock(process.env.GATEWAY_URL).patch(`/v1/dataset/${id}`).reply(200, {});

export const createMockGetDataset: (
    id: string,
    otherData: Record<string, any>
) => Record<string, any> = (id: string, otherData = {}) => {
    const dataset: Record<string, any> = {
        id,
        type: 'dataset',
        attributes: {
            ...DATASET_ATTRS,
            ...otherData,
        },
    };

    nock(process.env.GATEWAY_URL).get(`/v1/dataset/${id}`).reply(200, {
        data: dataset,
    });

    return dataset;
};
