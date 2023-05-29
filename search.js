import mappin from '/mappin.png'
class SearchPlace {
  constructor(){
    this.searchInputId = "searchPlace";
  }

  async fetchSearchPlace (param){
    const query = param.q;
    const queryResult = await fetch(`https://nominatim.openstreetmap.org/search?q=${param.q}&format=json&accept-language=ko-kr,ko;q=0.8,en-us;q=0.5,en;q=0.3?limit=5`)
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      return data;
    });
    return queryResult;
  }

  queryResultToList(data, dom){
    this.setInputRounded(false);
    const targetDom = document.querySelector(`#${dom}`);
    targetDom.innerHTML = "";
    let htmlString='';
    data.map((cur, idx)=>{
      if(cur.importance > 0.4){
        htmlString += `<div class='p-2 duration-300 cursor-pointer hover:bg-gray-200' coord='${cur.lon},${cur.lat}'>${cur.display_name}</div>`;
      }
    })
    targetDom.innerHTML = htmlString;
    return htmlString;
  }

  setInputRounded(toggle){
    const targetDom = document.querySelector(`#${this.searchInputId}`);
    if(toggle){
      targetDom.classList.add('rounded-b-lg');
    } else {
      targetDom.classList.remove('rounded-b-lg');
    }
  }
  
  async createSelectedPlaceEntity(viewer, coord){
    let returnEntity = await this.getSampleHeight(viewer,coord).then((result)=>{
      const cartesianPosition = new Cesium.Cartesian3(result[0].x, result[0].y, result[0].z);
      const entity = viewer.entities.add({
        position: cartesianPosition,
        billboard: {
          image: mappin,
          show: true,
          pixelOffset: new Cesium.Cartesian2(0, 0),
          eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          scale: 1.0,
          alignedAxis: Cesium.Cartesian3.ZERO,
        },
      });
      return entity;
    });
    return returnEntity;
    
  }
  async getSampleHeight(viewer, coord){
    //sampleHeight
    // const inputCartesian = new Cesium.Cartographic.fromDegrees(coord[0], coord[1]);
    // const returnHeight = viewer.scene.sampleHeight(inputCartesian);

    //clampToHeightMostDetailed
    const inputCartesian = new Cesium.Cartesian3.fromDegrees(coord[0], coord[1]);
    const clampedCartesians = await viewer.scene.clampToHeightMostDetailed(
      [inputCartesian]
    );
    return clampedCartesians;
  }
}
export default SearchPlace;
