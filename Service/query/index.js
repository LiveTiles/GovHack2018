const request = require('request-promise');
const querystring = require('querystring');

module.exports = function query(context, req){
    const address = req.query.address.toUpperCase();
 
    var addressQueryString = querystring.stringify({
        where: `ADDRESS like '%${address}%' or PROPERTY_NAME like '%${address}%'`,
        returnIdsOnly: true,
        orderByFields: 'STREET',
        f: 'json'
    });

    context.log(`Address: ${address}`);

    request(`https://services.thelist.tas.gov.au/arcgis/rest/services/Public/SearchService/MapServer/7/query?${addressQueryString}`, {
        json: true
    })
        .then(result => {
            if (!result.objectIds || result.objectIds.length === 0)
                return [];

            const objectIdConvertQueryString = querystring.stringify({
                where: `objectid in (${result.objectIds.join(',')})`,
                outFields: 'OBJECTID,ADDRESS,PROPERTY_NAME,LOCALITY',
                orderByFields: 'STREET',
                f: 'json'
            });

            return request(`https://services.thelist.tas.gov.au/arcgis/rest/services/Public/SearchService/MapServer/7/query?${objectIdConvertQueryString}`, {
                json: true,
                headers: {}
            })
                .then(result => {

                    const coordinates = result.features[0].geometry;
                    const tfsQueryString = querystring.stringify({
                        f: 'json',
                        token: 'Gh1iXb-zIoXlU2AQ69Mdwhz7vh-N-QrCwn5WhjB03qFBD6xmW8cwxxipQnPnkAGj3DPXnnyX_ljBl1I2kJPzEaglGIwesvnY3AqqEbSf1YZtnHcLV9aKg8hDSMRhEENIbICtXL04oTPiDCygt8VanyT_nk2FMap79GdhmQKf9H5FsEfMcxVy6A2ODENsEtPwXHL5ILGZI8XVJmON60O8h_Y8F3pw3R9xZZpgf1biGS7eqfqcdgNt7cr4ijgLp73B',
                        geometry: `${coordinates.x}, ${coordinates.y}`,
                        sr: '3857',
                        layers: 'visible:6',
                        tolerance: 6,
                        geometryPrecision: 0,
                        maxAllowableOffset: 2,
                        imageDisplay: '1703, 751, 96',
                        mapExtent: `${coordinates.x - 3000},${coordinates.y - 3000},${coordinates.x + 3000},${coordinates.y + 3000}`,
                        // mapExtent: '16380946.691136,-5080001.8659538,16385024.128864,-5078207.9844462',
                        returnGeometry: false
                    });

                    const cadastreAdminQueryString = querystring.stringify({
                        f: 'json',
                        geometry: `${coordinates.x}, ${coordinates.y}`,
                        tolerance: 6,
                        mapExtent: `${coordinates.x - 2000},${coordinates.y - 3000},${coordinates.x + 2000},${coordinates.y + 3000}`,
                        sr: '3857',
                        geometryPrecision: 0,
                        maxAllowableOffset: 2,
                        layers: 'visible:0',
                        imageDisplay: '1703, 751, 96',
                        returnGeometry: false
                    });

                    const coastialQueryString = querystring.stringify({
                        f: 'json',
                        geometry: `${coordinates.x}, ${coordinates.y}`,
                        tolerance: 6,
                        mapExtent: `${coordinates.x - 3000},${coordinates.y - 3000},${coordinates.x + 3000},${coordinates.y + 3000}`,
                        sr: '3857',
                        geometryPrecision: 0,
                        maxAllowableOffset: 2,
                        layers: 'visible:82',
                        imageDisplay: '1703, 751, 96',
                        returnGeometry: false
                    });

                    const landslipQueryString = querystring.stringify({
                        f: 'json',
                        geometry: `${coordinates.x}, ${coordinates.y}`,
                        tolerance: 6,
                        mapExtent: `${coordinates.x - 3000},${coordinates.y - 3000},${coordinates.x + 3000},${coordinates.y + 3000}`,
                        sr: '3857',
                        geometryPrecision: 0,
                        maxAllowableOffset: 2,
                        layers: 'visible:23',
                        imageDisplay: '1703, 751, 96',
                        returnGeometry: false
                    });

                    const damFloodQueryString = querystring.stringify({
                        f: 'json',
                        geometry: `${coordinates.x}, ${coordinates.y}`,
                        tolerance: 6,
                        mapExtent: `${coordinates.x - 3000},${coordinates.y - 3000},${coordinates.x + 3000},${coordinates.y + 3000}`,
                        sr: '3857',
                        geometryPrecision: 0,
                        maxAllowableOffset: 2,
                        layers: 'visible:23',
                        imageDisplay: '1703, 751, 96',
                        returnGeometry: false,
                        token: 'Gh1iXb-zIoXlU2AQ69Mdwl0Ck29kaKZ0j8_ZJ-0urrKrbjHsz6o89nUFQRwGhEJ23QjurEupZIdif6laugGe_5oCdr5-0HPAFEqx_SfyiCIwx-l7hOakWuIvA47Ymuia_1j5AVfM6m5Nproy-DUK1elo8Dd78ZOUlJ3Vtk7NUVYZutRhXAPhdI_vwTzvTWRwIbx2BDEEwyobi8Yxlkt_x6R6J-G7XCzxP-dtUZIR_vtnXuVoajAI45-nPcLrtLVb'
                    })

                    const coastalInundationQueryString = querystring.stringify({
                        f: 'json',
                        geometry: `${coordinates.x}, ${coordinates.y}`,
                        tolerance: 6,
                        mapExtent: `${coordinates.x - 3000},${coordinates.y - 3000},${coordinates.x + 3000},${coordinates.y + 3000}`,
                        sr: '3857',
                        geometryPrecision: 0,
                        maxAllowableOffset: 2,
                        layers: 'visible:83',
                        imageDisplay: '1703, 751, 96',
                        returnGeometry: false
                    });

                    const seaRiseQueryString = querystring.stringify({
                        f: 'json',
                        geometry: `${coordinates.x}, ${coordinates.y}`,
                        tolerance: 6,
                        mapExtent: `${coordinates.x - 3000},${coordinates.y - 3000},${coordinates.x + 3000},${coordinates.y + 3000}`,
                        sr: '3857',
                        geometryPrecision: 0,
                        maxAllowableOffset: 2,
                        layers: 'visible:47',
                        imageDisplay: '1703, 751, 96',
                        returnGeometry: false
                    });

                    console.log(`https://services.thelist.tas.gov.au/arcgis/rest/services/Public/MarineAndCoastal/MapServer/identify?${coastialQueryString}`)
                    return Promise.all([
                        request(`https://services.thelist.tas.gov.au/arcgis/rest/services/Restricted/TFS_CPP_Datasets/MapServer/identify?${tfsQueryString}`, {
                            json: true,
                            headers: {
                                Referer: 'https://maps.thelist.tas.gov.au/listmap/app/list/map?layout-options=LAYER_LIST_OPEN&cpoint=146.54,-42.03,500000&srs=EPSG:4283&bmlayer=3&layers=1083'
                            }
                        })
                            .then(result => {
                                if (!result.results || result.results.length == 0)
                                    return [];

                                const high = result.results.find(result => result.attributes["Interface Type"] == "2");
                                const medium = result.results.find(result => result.attributes["Interface Type"] == "1");

                                if (high)
                                    return [{
                                        name: "HIGH_FIRE_RISK",
                                        detail: "Areas where structures are scattered within bushland fuels, the built & natural environments are blended, and dwellings are spaced further apart (e.g. a typical rural/rural-residential area with larger blocks, long driveways etc)."
                                    }];

                                if (medium)
                                    return [{
                                        name: "MEDIUM_FIRE_RISK",
                                        detail: "Areas where structures adjoin bushland fuels, there is a clear delineation between the built & natural environments, and there are multiple dwellings in close proximity to one another (e.g. a typical suburban neighbourhood backing onto bushland)."
                                    }]

                                return [];
                            }),
                        request(`https://services.thelist.tas.gov.au/arcgis/rest/services/Public/CadastreAndAdministrative/MapServer/identify?${cadastreAdminQueryString}`,
                            {
                                json: true
                            })
                            .then(result => {
                                return result.results.map(result => {
                                    return {
                                        "name": "HERITAGE_LISTED",
                                        "detail": result.name
                                    }
                                })
                            }),
                        request(`https://services.thelist.tas.gov.au/arcgis/rest/services/Public/MarineAndCoastal/MapServer/identify?${coastialQueryString}`, {
                            json: true
                        })
                            .then(result => {
                                if (!result.results || result.results.length == 0)
                                    return [];

                                const high = result.results.find(result => result.attributes["HAZARD_BAND"] == "High");
                                const acceptable = result.results.find(result => result.attributes["HAZARD_BAND"] == "Acceptable");
                                const low = result.results.find(result => result.attributes["HAZARD_BAND"] == "Low");

                                if (high) return [{
                                    name: 'EROSION_HIGH'
                                }]

                                if (low) return [{
                                    name: 'EROSION_LOW'
                                }]

                                return []
                            }),
                        request(`https://services.thelist.tas.gov.au/arcgis/rest/services/Public/GeologicalAndSoils/MapServer/identify?${landslipQueryString}`, {
                            json: true
                        })
                            .then(result => {
                                if (!result.results || result.results.length == 0)
                                    return [];

                                const low = result.results.find(result => result.attributes['Hazard Band'] === 'Low');
                                const medium = result.results.find(result => result.attributes['Hazard Band'] === 'Medium' || result.attributes['Hazard Band'] === 'Medium - Active');
                                const high = result.results.find(result => result.attributes['Hazard Band'] === 'High');

                                if (high) return [{
                                    name: 'LANDSLIP_HIGH'
                                }]

                                if (medium) return [{
                                    name: 'LANDSLIP_MEDIUM'
                                }]

                                if (low) return [{
                                    name: 'LANDSLIP_LOW'
                                }]

                                return [];
                            })
                            .then(result => {
                                const high = result.find(result => result.name === 'LANDSLIP_HIGH')
                                const medium = result.find(result => result.name === 'LANDSLIP_MEDIUM')
                                const low = result.find(result => result.name === 'LANDSLIP_LOW')

                                if (high)
                                    return [high];

                                if (medium)
                                    return [medium];

                                if (low)
                                    return [low];

                                return []
                            }),
                        request(`https://services.thelist.tas.gov.au/arcgis/rest/services/Public/Infrastructure/MapServer/identify?${damFloodQueryString}`, {
                            json: true,
                            headers: {
                                Referer: 'https://maps.thelist.tas.gov.au/listmap/app/list/map?layout-options=LAYER_LIST_OPEN&cpoint=146.54,-42.03,500000&srs=EPSG:4283&bmlayer=3&layers=1083'
                            }
                        })
                            .then(result => {
                                if (result.results && result.results.length > 0)
                                    return [{
                                        name: 'DAM_FLOOD_RISK'
                                    }]
                                else
                                    return []
                            }),
                        request(`https://services.thelist.tas.gov.au/arcgis/rest/services/Public/MarineAndCoastal/MapServer/identify?${coastalInundationQueryString}`, {
                            json: true
                        })
                            .then(result => {
                                const high = result.results.find(result => result.attributes['Hazard Band'] === 'High');
                                const medium = result.results.find(result => result.attributes['Hazard Band'] === 'Medium');
                                const low = result.results.find(result => result.attributes['Hazard Band'] === 'Low');

                                if (high)
                                    return [{
                                        name: 'COASTAL_FLOOD_HIGH'
                                    }]

                                if (medium)
                                    return [{
                                        name: 'COASTAL_FLOOD_MEDIUM'
                                    }]

                                if (low)
                                    return [{
                                        name: 'COASTAL_FLOOD_LOW'
                                    }]

                                return [];
                            }),
                        request(`https://services.thelist.tas.gov.au/arcgis/rest/services/Public/ClimateChange/MapServer/identify?${seaRiseQueryString}`, {
                            json: true
                        })
                            .then(result => {
                                if (!result.results || result.results.length == 0)
                                    return [];

                                const fifty = result.results.find(result => result.attributes['TR_LEV_RU'] == '2050');
                                const twentyOne = result.results.find(result => result.attributes['TR_LEV_RU'] == '2100');

                                if (fifty) return [{
                                    name: 'SEA_RISE_2050'
                                }]

                                if (twentyOne) return [{
                                    name: 'SEA_RISE_2100'
                                }]

                                return []
                            })
                    ])
                })
        })
        .then(results => {
            return [].concat.apply([], results);
        })
        .then(results => {
            const uniqueResults = [];

            results.forEach(element => {
                if (!uniqueResults.find(result => result.name === element.name))
                    uniqueResults.push(element);
            });

            return uniqueResults;
        })
        .catch(err => {
            context.log("err", err);
            context.done(err);
        })
        .then(results => {
            context.log("done", results);

            context.res = {
                status: 200,
                body: results
            };
            context.done();
        });
}