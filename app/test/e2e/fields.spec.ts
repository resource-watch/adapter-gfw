import nock from 'nock';
import chai from 'chai';
import { getTestAgent } from './utils/test-server';

import { createMockGetDataset } from './utils/mock';
import { ensureCorrectError } from './utils/helpers';

let requester: ChaiHttp.Agent;

chai.should();

const fields: Record<string, any>[] = [
  {
    field_name: 'iso',
    field_alias: 'iso',
    field_description: null,
    field_type: 'text',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'adm1',
    field_alias: 'adm1',
    field_description: null,
    field_type: 'integer',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'adm2',
    field_alias: 'adm2',
    field_description: null,
    field_type: 'integer',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'longitude',
    field_alias: 'longitude',
    field_description: null,
    field_type: 'numeric',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'latitude',
    field_alias: 'latitude',
    field_description: null,
    field_type: 'numeric',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'alert__date',
    field_alias: 'alert__date',
    field_description: null,
    field_type: 'date',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'alert__time_utc',
    field_alias: 'alert__time_utc',
    field_description: null,
    field_type: 'text',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'confidence__cat',
    field_alias: 'confidence__cat',
    field_description: null,
    field_type: 'text',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'bright_ti4__K',
    field_alias: 'bright_ti4__K',
    field_description: null,
    field_type: 'numeric',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'bright_ti5__K',
    field_alias: 'bright_ti5__K',
    field_description: null,
    field_type: 'numeric',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'frp__MW',
    field_alias: 'frp__MW',
    field_description: null,
    field_type: 'numeric',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'wdpa_protected_area__iucn_cat',
    field_alias: 'wdpa_protected_area__iucn_cat',
    field_description: null,
    field_type: 'text',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'is__umd_regional_primary_forest_2001',
    field_alias: 'is__umd_regional_primary_forest_2001',
    field_description: null,
    field_type: 'boolean',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'is__birdlife_alliance_for_zero_extinction_site',
    field_alias: 'is__birdlife_alliance_for_zero_extinction_site',
    field_description: null,
    field_type: 'boolean',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'is__birdlife_key_biodiversity_area',
    field_alias: 'is__birdlife_key_biodiversity_area',
    field_description: null,
    field_type: 'boolean',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'is__landmark_land_right',
    field_alias: 'is__landmark_land_right',
    field_description: null,
    field_type: 'boolean',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'gfw_plantation__type',
    field_alias: 'gfw_plantation__type',
    field_description: null,
    field_type: 'text',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'is__gfw_mining',
    field_alias: 'is__gfw_mining',
    field_description: null,
    field_type: 'boolean',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'is__gfw_managed_forest',
    field_alias: 'is__gfw_managed_forest',
    field_description: null,
    field_type: 'boolean',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'rspo_oil_palm__certification_status',
    field_alias: 'rspo_oil_palm__certification_status',
    field_description: null,
    field_type: 'text',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'is__gfw_wood_fiber',
    field_alias: 'is__gfw_wood_fiber',
    field_description: null,
    field_type: 'boolean',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'is__peatland',
    field_alias: 'is__peatland',
    field_description: null,
    field_type: 'boolean',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'is__idn_forest_moratorium',
    field_alias: 'is__idn_forest_moratorium',
    field_description: null,
    field_type: 'boolean',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'is__gfw_oil_palm',
    field_alias: 'is__gfw_oil_palm',
    field_description: null,
    field_type: 'boolean',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'idn_forest_area__type',
    field_alias: 'idn_forest_area__type',
    field_description: null,
    field_type: 'text',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'per_forest_concession__type',
    field_alias: 'per_forest_concession__type',
    field_description: null,
    field_type: 'text',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'is__gfw_oil_gas',
    field_alias: 'is__gfw_oil_gas',
    field_description: null,
    field_type: 'boolean',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'is__gmw_mangroves_2016',
    field_alias: 'is__gmw_mangroves_2016',
    field_description: null,
    field_type: 'boolean',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'is__ifl_intact_forest_landscape_2016',
    field_alias: 'is__ifl_intact_forest_landscape_2016',
    field_description: null,
    field_type: 'boolean',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'bra_biome__name',
    field_alias: 'bra_biome__name',
    field_description: null,
    field_type: 'text',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'alert__count',
    field_alias: 'alert__count',
    field_description: null,
    field_type: 'integer',
    is_feature_info: true,
    is_filter: true,
  },
  {
    field_name: 'geom',
    field_alias: 'geom',
    field_description: null,
    field_type: 'geometry',
    is_feature_info: false,
    is_filter: false,
  },
  {
    field_name: 'geom_wm',
    field_alias: 'geom_wm',
    field_description: null,
    field_type: 'geometry',
    is_feature_info: false,
    is_filter: false,
  },
];

describe('GET fields', () => {
  before(async () => {
    nock.cleanAll();

    if (process.env.NODE_ENV !== 'test') {
      throw Error(
        `Running the test suite with NODE_ENV ${process.env.NODE_ENV} may result in permanent data loss. Please use NODE_ENV=test.`
      );
    }

    requester = await getTestAgent();
  });

  it('Getting the fields for a dataset without connectorType document should fail', async () => {
    const timestamp: string = String(new Date().getTime());

    createMockGetDataset(timestamp, { connectorType: 'foo' });

    const requestBody: Record<string, any> = {};

    const response: Record<string, any> = await requester
      .get(`/api/v1/gfw/fields/${timestamp}`)
      .send(requestBody);

    ensureCorrectError(
      response,
      "This operation is only supported for datasets with connectorType 'rest'",
      422
    );
  });

  it('Getting the fields for a dataset without a supported provider should fail', async () => {
    const timestamp: string = String(new Date().getTime());

    createMockGetDataset(timestamp, { provider: 'foo' });

    const requestBody: Record<string, any> = {};

    const response: Record<string, any> = await requester
      .get(`/api/v1/gfw/fields/${timestamp}`)
      .send(requestBody);

    ensureCorrectError(
      response,
      "This operation is only supported for datasets with provider 'gfw'",
      422
    );
  });

  it('Get fields correctly for a gfw dataset should return the field list (happy case)', async () => {
    const timestamp: string = String(new Date().getTime());

    const dataset: Record<string, any> = createMockGetDataset(timestamp);

    nock('https://data-api.globalforestwatch.org')
      .get('/dataset/nasa_viirs_fire_alerts/latest/fields')
      .reply(200, {
        data: fields,
      });

    const response: Record<string, any> = await requester
      .get(`/api/v1/gfw/fields/${dataset.id}`)
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
