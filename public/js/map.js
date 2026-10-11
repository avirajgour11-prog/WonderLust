
const map = new mapboxgl.Map({
  accessToken: mapToken,
  container: 'map', // container ID
  center: listing.geometry.coordinates, // starting position [longitute , lattitude]. Note that lat must be set between -90 and 90
  zoom: 10 // starting zoom
});



  // Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({color: "red"})
  .setLngLat(listing.geometry.coordinates)//listing.geometry.coordinates 
  .setPopup(new mapboxgl.Popup({offset: 25})
  .setHTML(`<h4>${listing.location}</h4> <p> Exact loaction provided after booking </p>`))
  .addTo(map);