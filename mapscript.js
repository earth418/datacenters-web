const map = new maplibregl.Map({
      style: `https://tiles.openfreemap.org/styles/bright`,
      center: [-96.0066, 38.7135],
      zoom: 4.0,
      pitch: 0,
      bearing: 0,
      container: 'map-container',
      canvasContextAttributes: {antialias: true},
      attributionControl: false
  });

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
  });