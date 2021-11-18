import logger from 'logger';
import nock from 'nock';

import { DEFAULT_RESPONSE_SQL_QUERY, DATASET_ATTRS } from './test.constants';

export const createMockConvertSQL: (sqlQuery: string) => void = (
  sqlQuery: string
) =>
  nock(process.env.CT_URL, { encodedQueryParams: true })
    .get(
      `/v1/convert/sql2SQL?sql=${encodeURIComponent(
        sqlQuery
      )}&experimental=true&raster=false`
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

export const createMockSQLQuery: (sql: string) => void = (sql: string) => {
  const encodedSql: string = encodeURIComponent(sql);
  nock('https://data-api.globalforestwatch.org')
    .get(`/dataset/nasa_viirs_fire_alerts/latest/query?sql=${encodedSql}`)
    .reply(200, DEFAULT_RESPONSE_SQL_QUERY);
};

export const createMockRegisterDataset: (id: string) => void = (id) =>
  nock(process.env.CT_URL).patch(`/v1/dataset/${id}`).reply(200, {});

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

  nock(process.env.CT_URL).get(`/v1/dataset/${id}`).reply(200, {
    data: dataset,
  });

  return dataset;
};
