import nock from 'nock';
import { SelectionRange } from 'typescript';

export const createMockGetDataset: (id: string, otherData: Record<string, any>) => Record<string, any> = (id: string, otherData = {}) => {
    const dataset: Record<string, any> = {
        id,
        type: 'dataset',
        attributes: {
            name: 'Test dataset 1',
            slug: 'test-dataset-1',
            type: 'tabular',
            subtitle: null,
            application: [
                'gfw'
            ],
            dataPath: null,
            attributesPath: null,
            connectorType: 'rest',
            provider: 'gfw',
            userId: '1',
            connectorUrl: 'https://data-api.globalforestwatch.org/dataset/nasa_viirs_fire_alerts/latest',
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
            ...otherData
        }
    };

    nock(process.env.CT_URL)
        .get(`/v1/dataset/${id}`)
        .reply(200, {
            data: dataset
        });

    return dataset;
};