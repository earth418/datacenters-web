// import datacenters_data from './datacenters.json';
// let datacenter_locations = [];

let points_geojson = {
    'type': 'FeatureCollection',
    'features': [
    ]
};

function geojson_point(latlon) {
    return {
            'type': 'Feature',
            'properties': {},
            'geometry': {
                'type': 'Point',
                'coordinates': latlon
            }
    };
}

// const google_centers = await d3.json("../data/google_centers.geojson");

// CSV
// name, latitude, longitude 
// abc, 45.3, 44.09
// def, 42.21, 43.11
// ghi, 46.21, 47.11

// function fetchJSONData() {
// // fetch('./sample.json')
//     fetch('./datacenters.json')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//                 // return JSON();
//             }
//             return response.json();
//         })
//         .then(data => {return data;})  
//         .catch(error => console.error('Failed to fetch data:', error)); 
//         // return [];
// }
// const datacenters_data = fetchJSONData();
// console.log(datacenters_data);

// const datacenter_data = parseCSV(datacenters_file);

// for (let i = 0; i < datacenters_data.length; ++i) {
//     const val = datacenters_data[i];
//     points_geojson.features.push(geojson_point([val.latitude, val.longitude]));
// }



// The 'building' layer in the streets vector source contains building-height
// data from OpenStreetMap.
map.on('load', () => {
    // Insert the layer beneath any symbol layer.
    const layers = map.getStyle().layers;

    let labelLayerId;
    for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }

    function add_dcs(data, name, color) {
        map.addSource(name, {
            'type':'geojson',
            'data': data
        });
        map.addLayer(
        {
            'id':(name + "_layer"),
            'type':'circle',
            'source': name,
            'minzoom':2,
            'maxzoom':10,
            'paint': {
                'circle-radius': 6,
                'circle-color': color,
            }
        });
    }

    add_dcs(amazon_datacenters, "amazondatacenters", company_palette["amazon"]);
    add_dcs(xai_centers, "xaicenters", company_palette["tesla"]);
    add_dcs(ms_centers, "mscenters", company_palette["microsoft"]);
    add_dcs(meta_centers, "metacenters", company_palette["meta"]);
    add_dcs(google_centers, "googlecenters", company_palette["google"])

    for (let i = 0; i < 50; ++i) {
        // let h = indiana_cities[i].features[0].properties.houses;
        map.addSource(`indiana_city${i}`, {
            'type':'geojson',
            'data': indiana_cities[i]
        });
        map.addLayer({
            'id':`indiana_${i}`,
            'source': `indiana_city${i}`,
            'type':'circle',
            'minzoom':1,
            'maxzoom':13,
            'paint': {
                'circle-radius': 0.0,
                'circle-color': '#b32613'
            }
        });
    }

    // xai_centers.features[0].geometry.coordinates

    map.addSource('openfreemap', {
        url: `https://tiles.openfreemap.org/planet`,
        type: 'vector',
    });
    map.addLayer(
        {
            'id': '3d-buildings',
            'source': 'openfreemap',
            'source-layer': 'building',
            'type': 'fill-extrusion',
            'minzoom': 15,
            'filter': ['!=', ['get', 'hide_3d'], true],
            'paint': {
                'fill-extrusion-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'render_height'], 0, 'lightgray', 200, 'royalblue', 400, 'lightblue'
                ],
                'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    16,
                    ['get', 'render_height']
                ],
                'fill-extrusion-base': ['case',
                    ['>=', ['get', 'zoom'], 16],
                    ['get', 'render_min_height'], 0
                ]
            }
        },
        labelLayerId
    );

    map.addSource('west_memphis_google', {
        'type':'geojson',
        'data': west_memphis_google
    })
    map.addLayer(
    {
        'id':'westmemphisgoogle_layer',
        'type':'fill',
        'source':'west_memphis_google',
        'layout':{},
        'paint': {
            'fill-color': company_palette["google"],
            'fill-opacity': 0.0
        }
    })


    map.addSource('tuscon', {
        'type':'geojson',
        'data': tuscon_shape
    });
    map.addLayer(
    {
        'id':'tusconlayer',
        'type':'fill',
        'source':'tuscon',
        'layout':{},
        'paint': {
            'fill-color': company_palette["amazon"],
            'fill-opacity': 0.0
        }
    })

    map.addSource('indiana_state', {
        'type':'geojson',
        'data': indiana_shape
    });
    map.addLayer(
    {
        'id':'indiana_layer',
        'type':'fill',
        'source':'indiana_state',
        'layout':{},
        'paint': {
            'fill-color': '#088',
            'fill-opacity': 0.0
        }
    })

    map.addSource('xAIcolossus', {
        'type':'geojson',
        'data': memphis_colossus
    });
    map.addLayer(
    {
        'id':'xAIcolossuslayer',
        'type':'fill-extrusion',
        'source':'xAIcolossus',
        'layout':{},
        'paint': {
            'fill-extrusion-color': company_palette["tesla"],
            'fill-extrusion-height': 5.0,
            'fill-extrusion-opacity': 0.0,
        }
    });

    map.addSource('boxtown', {
        'type':'geojson',
        'data': boxtown_shape
    });
    map.addLayer(
    {
        'id':'boxtownlayer',
        'type':'fill',
        'source':'boxtown',
        'layout':{},
        'paint': {
            'fill-color': 'rgba(0, 37, 51, 1)',
            'fill-opacity': 0.0,
        }
    });
    // map.addLayer(
    // {
    //     'id':'tusconlayer',
    //     'type':'fill',
    //     'source':'tuscon',
    //     'layout':{},
    //     'paint': {
    //         'fill-color': '#088',
    //         'fill-opacity': 0.0
    //     }
    // });

    map.addSource('tuscon_city_limits', {
        'type':'geojson',
        'data': tuscon_city_limits
    });

    map.addLayer(
    {
        'id':'tusconcitylayer',
        'type':'fill',
        'source':'tuscon_city_limits',
        'layout':{},
        'paint': {
            'fill-color': '#003',
            'fill-opacity': 0.0,
        }
    });
    // map.addLayer(
    // {
    //     'id':'datacenter_points',
    //     'type':'symbol',
    //     'source':'datacenter_points',
    //     // 'layout':{

    //     // }
    // }
    // )

   
});


