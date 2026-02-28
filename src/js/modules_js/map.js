// map
const mapContainer = document.getElementById('map');
if (mapContainer) {
   const data = {
      coordinates: '37.686374, 55.737314',
   }

   function loadYMapsAPI() {
      return new Promise((resolve, reject) => {
         if (window.ymaps3) {
            resolve();
            // console.log(" API Яндекс Карт загружено");
            return;
         }
      });
   }

   async function initMap() {
      await loadYMapsAPI();
      await ymaps3.ready;
      const { YMap, YMapMarker, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer } = ymaps3;

      const map = new YMap(
         mapContainer,
         {
            location: {
               center: data.coordinates.split(','),
               zoom: 17,
            }
         }, [
         new YMapDefaultSchemeLayer(),
         new YMapDefaultFeaturesLayer()
      ]
      );

      const markerTemplate = document.getElementById('marker');
      const markerClone = markerTemplate.content.cloneNode(true);
      const marker = new YMapMarker(
         {
            coordinates: data.coordinates.split(','),
         },
         markerClone
      );
      map.addChild(marker);
   }
   initMap();
}



// networks-map
const networks_map = document.getElementById('networks-map');

if (networks_map) {
   let coordinates = []
   const networks_map_marker = document.getElementById('networks-map-marker');

   const networks_map_tab_button = document.querySelectorAll('.networks-map__tab-button');
   networks_map_tab_button.forEach(e => {
      const data = e.dataset.coord;
      if (data) {
         coordinates.push(data)
      }
   })

   function loadYMapsAPI() {
      return new Promise((resolve, reject) => {
         if (window.ymaps3) {
            resolve();
            // console.log(" API Яндекс Карт загружен");
            return;
         }
      });
   }

   async function initMap() {
      await loadYMapsAPI();
      await ymaps3.ready;
      const {
         YMap,
         YMapMarker,
         YMapDefaultSchemeLayer,
         YMapDefaultFeaturesLayer,
         YMapControls,
      } = ymaps3;

      const {
         YMapZoomControl,
         YMapControlButton,
         Tooltip
      } = await ymaps3.import('@yandex/ymaps3-controls@0.0.1');

      const mapNetworks = new YMap(
         networks_map,
         {
            location: {
               center: coordinates[0].split(','),
               zoom: 11,
            },
            behaviors: ['drag'],
         },
         [new YMapDefaultSchemeLayer(), new YMapDefaultFeaturesLayer()]
      );
      const controls = new YMapControls({ position: 'bottom' });
      controls.addChild(new YMapZoomControl({}));
      mapNetworks.addChild(controls);


      function addMarker(coord, index) {
         if (!networks_map_marker) return;
         const markerClone = networks_map_marker.content.cloneNode(true);
         if (index == 0) {
            markerClone.querySelector('.networks-map__marker').classList.add('active');
         }
         const element = markerClone.querySelector('.networks-map__marker');
         if (element) {
            element.dataset.index = index;
            const observer = new MutationObserver((mutationsList, observer) => {
               if (element.classList.contains('active')) {
                  mapNetworks.update({
                     location: {
                        center: coord.split(','),
                        // zoom: 11,
                        duration: 700,
                     }
                  })
               }
            });
            observer.observe(element, {
               attributes: true,
               attributeFilter: ['class'],
               childList: false,
               subtree: false,
               characterData: false,
            });
         }
         const marker = new YMapMarker(
            {
               coordinates: coord.split(','),
            },
            markerClone
         );
         mapNetworks.addChild(marker);
      }
      coordinates.forEach((coord, index) => {
         addMarker(coord, index)
      })
   }

   initMap();

}

