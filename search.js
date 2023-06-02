import mappin from '/mappin.png'
class SearchPlace {
  constructor(){
    this.searchInputId = "searchPlace";
    this.selectedPlace = {
      title : "",
      position : "",
    };
    this.htmlOverlayDomId = "htmlOverlay";
    this.SearchGroup = new Cesium.Entity();
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
  
  async createSelectedPlaceEntity(viewer, coord, placeNM){
    this.resetSearchGroup(viewer);
    this.selectedPlace = {
      title : placeNM,
      position : coord
    }
    let returnEntity = await this.getSampleHeight(viewer,coord).then((result)=>{
      let cartesianPosition;
      if(result[0]){
        cartesianPosition = new Cesium.Cartesian3(result[0].x, result[0].y, result[0].z);
      } else {
        cartesianPosition = new Cesium.Cartesian3.fromDegrees(coord[0], coord[1],100);
      }
      
      const entity = viewer.entities.add({
        id : "searchSelected",
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
      this.createHtmlLabel(viewer, cartesianPosition, this.htmlOverlayDomId);
      return entity;
    });
    return returnEntity;
    
  }
  async getSampleHeight(viewer, coord){
    //clampToHeightMostDetailed
    const inputCartesian = new Cesium.Cartesian3.fromDegrees(coord[0], coord[1]);
    const clampedCartesians = await viewer.scene.clampToHeightMostDetailed(
      [inputCartesian]
    );
    return clampedCartesians;
  }
  
  createHtmlLabel(viewer, cartesian, domId){
    const htmlOverlay = document.querySelector(`#${domId}`);
    htmlOverlay.classList.remove("hidden");
    htmlOverlay.querySelector("div").innerHTML = this.selectedPlace.title;
    const scratch = new Cesium.Cartesian2();
    viewer.scene.preRender.addEventListener(function () {
      const canvasPosition = viewer.scene.cartesianToCanvasCoordinates(
        cartesian,
        scratch
      );
      if (Cesium.defined(canvasPosition)) {
        htmlOverlay.style.top = `${canvasPosition.y - 230}px`;
        htmlOverlay.style.left = `${canvasPosition.x}px`;
      }
    });
  }
  resetSearchGroup(viewer){
    const findEntity = viewer.entities._entities._array.find((item)=>{
      return item.id == 'searchSelected'
    });
    viewer.entities.remove(findEntity);
  }
  clickHtmlLabel(domId){
    const htmlOverlay = document.querySelector(`#${domId}`);
    const list = document.querySelector("#planBody .plan_place_list");
  }
}
export default SearchPlace;
