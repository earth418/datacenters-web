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
console.log(datacenters_data);

// const datacenter_data = parseCSV(datacenters_file);

for (let i = 0; i < datacenters_data.length; ++i) {
    const val = datacenters_data[i];
    points_geojson.features.push(geojson_point([val.latitude, val.longitude]));
}



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

    map.addSource('openfreemap', {
        url: `https://tiles.openfreemap.org/planet`,
        // url: `https://github.com/openmaptiles/positron-gl-style/blob/master/style.json`,
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
    // map.addSource('datacenter_points', {
    //     'type':'geojson',
    //     'data': points_geojson
    // });
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
            'fill-extrusion-color': 'rgba(53, 1, 42, 1)',
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


