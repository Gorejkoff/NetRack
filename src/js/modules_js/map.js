// map
const mapContainer = document.getElementById('map');
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
