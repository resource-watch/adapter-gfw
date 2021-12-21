export const DATASET: Record<string, any> = {
    data: {
        id: '00c47f6d-13e6-4a45-8690-897bdaa2c723',
        attributes: {
            connectorUrl:
        'https://data-api.globalforestwatch.org/dataset/nasa_viirs_fire_alerts',
            table_name: 'data',
        },
    },
};

export const DEFAULT_RESPONSE_SQL_QUERY: Record<'data' | 'status', any> = {
    data: [
        {
            iso: 'COL',
            adm1: 5,
            adm2: 10,
            longitude: -75.14911,
            latitude: 9.65229,
            alert__date: '2012-01-28',
            alert__time_utc: '1823',
            confidence__cat: 'n',
            bright_ti4__K: 335.4,
            bright_ti5__K: 307.5,
            frp__MW: 3.3,
            wdpa_protected_area__iucn_cat: null,
            is__umd_regional_primary_forest_2001: false,
            is__birdlife_alliance_for_zero_extinction_site: false,
            is__birdlife_key_biodiversity_area: false,
            is__landmark_land_right: false,
            gfw_plantation__type: null,
            is__gfw_mining: false,
            is__gfw_managed_forest: false,
            rspo_oil_palm__certification_status: null,
            is__gfw_wood_fiber: false,
            is__peatland: false,
            is__idn_forest_moratorium: false,
            is__gfw_oil_palm: false,
            idn_forest_area__type: null,
            per_forest_concession__type: null,
            is__gfw_oil_gas: false,
            is__gmw_mangroves_2016: false,
            is__ifl_intact_forest_landscape_2016: false,
            bra_biome__name: 'Not applicable',
            alert__count: 1,
            geom: '0101000020E61000006B60AB048BC952C0040473F4F84D2340',
            geom_wm: '0101000020110F00000340292A7EE95FC13B7546BB36793041',
        },
        {
            iso: 'COL',
            adm1: 28,
            adm2: 12,
            longitude: -75.20794,
            latitude: 9.55805,
            alert__date: '2012-01-28',
            alert__time_utc: '1823',
            confidence__cat: 'n',
            bright_ti4__K: 339.4,
            bright_ti5__K: 303.7,
            frp__MW: 3.4,
            wdpa_protected_area__iucn_cat: null,
            is__umd_regional_primary_forest_2001: false,
            is__birdlife_alliance_for_zero_extinction_site: false,
            is__birdlife_key_biodiversity_area: false,
            is__landmark_land_right: false,
            gfw_plantation__type: null,
            is__gfw_mining: false,
            is__gfw_managed_forest: false,
            rspo_oil_palm__certification_status: null,
            is__gfw_wood_fiber: false,
            is__peatland: false,
            is__idn_forest_moratorium: false,
            is__gfw_oil_palm: false,
            idn_forest_area__type: null,
            per_forest_concession__type: null,
            is__gfw_oil_gas: false,
            is__gmw_mangroves_2016: false,
            is__ifl_intact_forest_landscape_2016: false,
            bra_biome__name: 'Not applicable',
            alert__count: 1,
            geom: '0101000020E6100000EFE192E34ECD52C0CB10C7BAB81D2340',
            geom_wm: '0101000020110F0000B1FD6665E3EF5FC15F2A06D2A64F3041',
        },
    ],
    status: 'success',
};

export const DATASET_ATTRS: Record<string, any> = {
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
};

export const fields: Record<string, any>[] = [
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
