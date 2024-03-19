Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYmM2NTg4Ny1iZDY5LTRlOTEtYjk0ZS1lMDY1NWY4N2VhOTgiLCJpZCI6MjIwNSwiaWF0IjoxNTMxOTg5Nzk0fQ.sPBKjs9mbYue8zBaLpMSUj8hzoF1wsgZcht1iUU2UGk';
const google = true;

const viewer = new Cesium.Viewer('cesiumContainer', {
  timeline: false,
  animation: false,
  sceneModePicker: false,
  baseLayerPicker: false,
  infoBox : false,
  geocoder :false,
  homeButton: false,
  navigationHelpButton : false,
  useDefaultRenderLoop: false,
  selectionIndicator : false,
  fullscreenButton : false,
  // globe : false
});
viewer.resolutionScale = 1.5

const createGoogle3DTileset = async () => {
  try {
    const tileset = await Cesium.createGooglePhotorealistic3DTileset();
    viewer.scene.primitives.add(tileset);
    // const tileset = viewer.scene.primitives.add(
    //   await Cesium.Cesium3DTileset.fromIonAssetId(2275207),
    // );
    console.log("3dtileset load success");
  } catch (error) {
    console.log(`Error loading Photorealistic 3D Tiles tileset.
      ${error}`);
  }
}
(async ()=>{
  if(google){
    viewer.scene.globe.show = false;
    await createGoogle3DTileset()
  }
  
})()
export default viewer;

