Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYmM2NTg4Ny1iZDY5LTRlOTEtYjk0ZS1lMDY1NWY4N2VhOTgiLCJpZCI6MjIwNSwiaWF0IjoxNTMxOTg5Nzk0fQ.sPBKjs9mbYue8zBaLpMSUj8hzoF1wsgZcht1iUU2UGk';

const viewer = new Cesium.Viewer('cesiumContainer', {
  timeline: false,
  animation: false,
  sceneModePicker: false,
  baseLayerPicker: false,
  infoBox : false,
  geocoder :false,
  homeButton: false,
  navigationHelpButton : false
});
viewer.scene.globe.show = false;
const createGoogle3DTileset = async () => {
  try {
    const tileset = await Cesium.createGooglePhotorealistic3DTileset();
    viewer.scene.primitives.add(tileset);
  } catch (error) {
    console.log(`Error loading Photorealistic 3D Tiles tileset.
      ${error}`);
  }
}
createGoogle3DTileset()
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
  orientation: {
    heading: Cesium.Math.toRadians(0.0),
    pitch: Cesium.Math.toRadians(-15.0),
  }
});

export default viewer;