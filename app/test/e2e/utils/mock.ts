import logger from 'logger';
import nock from 'nock';

import { DEFAULT_RESPONSE_SQL_QUERY } from './test.constants';

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
      name: 'Test dataset 1',
      slug: 'test-dataset-1',
      type: 'tabular',
      subtitle: null,
      application: ['gfw'],
      dataPath: null,
      attributesPath: null,
      connectorType: 'rest',
      provider: 'gfw',
      userId: '1',
      connectorUrl:
        'https://data-api.globalforestwatch.org/dataset/nasa_viirs_fire_alerts/latest',
      sources: [],
      tableName: 'data',
      status: 'saved',
      published: false,
      overwrite: true,
      mainDateField: null,
      env: 'production',
      geoInfo: false,
      protected: false,
      clonedHost: {},
      legend: {},
      errorMessage: null,
      taskId: null,
      createdAt: '2016-08-01T15:28:15.050Z',
      updatedAt: '2018-01-05T18:15:23.266Z',
      dataLastUpdated: null,
      widgetRelevantProps: [],
      layerRelevantProps: [],
      ...otherData,
    },
  };

  nock(process.env.CT_URL).get(`/v1/dataset/${id}`).reply(200, {
    data: dataset,
  });

  return dataset;
};
