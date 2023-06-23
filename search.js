import mappin from '/mappin.png'


class SearchPlace {
  constructor(viewer, tourPlan) {
    this.viewer = viewer;
    this.searchInputId = "searchPlace";
    this.searchPlaceListId = "searchResultList";
    this.selectedPlace = {
      title: "",
      position: "",
    };
    this.htmlOverlayDomId = "htmlOverlay";
    this.SearchGroup = new Cesium.Entity();
    this.initialize(tourPlan);
  }
  initialize(tourPlan){
    var old_element = document.querySelector("#addPlaceToList");
    var new_element = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(new_element, old_element);
    document.querySelector("#addPlaceToList").addEventListener("click", ()=>{
      this.clickHtmlLabel(this.htmlOverlayDomId,this.viewer, tourPlan);
    });
  }

  async fetchSearchPlace(param) {
    const query = param.q;
    const queryResult = await fetch(`https://nominatim.openstreetmap.org/search?q=${param.q}&format=json&accept-language=ko-kr,ko;q=0.8,en-us;q=0.5,en;q=0.3?limit=5`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data;
      });
    return queryResult;
  }

  queryResultToList(data, dom) {
    this.setInputRounded(false);
    const targetDom = document.querySelector(`#${dom}`);
    targetDom.innerHTML = "";
    let htmlString = '';
    data.map((cur, idx) => {
      if (cur.importance > 0.4) {
        htmlString += `<div class='p-2 duration-300 cursor-pointer hover:bg-gray-200' coord='${cur.lon},${cur.lat}'>${cur.display_name}</div>`;
      }
    })
    targetDom.innerHTML = htmlString;
    return htmlString;
  }
  //검색창 및 검색결과 초기화
  resetSearchInput(dom){
    if(!dom){
      dom = this.searchPlaceListId;
    }
    console.log("dom", dom);
    this.setInputRounded(true);
    const targetDom = document.querySelector(`#${dom}`);
    targetDom.innerHTML = "";
  }
  //검색창 Rounded 토글
  setInputRounded(toggle) {
    const targetDom = document.querySelector(`#${this.searchInputId}`);
    if (toggle) {
      targetDom.classList.add('rounded-b-lg');
    } else {
      targetDom.classList.remove('rounded-b-lg');
    }
  }

  async createSelectedPlaceEntity(viewer, coord, placeNM) {
    this.resetSearchGroup(viewer);
    this.selectedPlace = {
      title: placeNM,
      position: coord
    }
    let returnEntity = await this.getSampleHeight(viewer, coord).then((result) => {
      let cartesianPosition;
      if (result[0]) {
        cartesianPosition = new Cesium.Cartesian3(result[0].x, result[0].y, result[0].z);
        const carto = new Cesium.Cartographic.fromCartesian(cartesianPosition);
        if(carto.height < -100){
          cartesianPosition = new Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude), 50);
        } else {
          cartesianPosition = new Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude), carto.height+60);
        }
      } else {
        cartesianPosition = new Cesium.Cartesian3.fromDegrees(coord[0], coord[1], 100);
      }

      const entity = viewer.entities.add({
        id: "searchSelected",
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
          scaleByDistance: new Cesium.NearFarScalar(1.5e3, 1.0, 4.5e4, 0.1),
        },
      });
      this.createHtmlLabel(viewer, cartesianPosition, this.htmlOverlayDomId);
      console.log(cartesianPosition);
      this.selectedPlace.cartesianPosition = [cartesianPosition.x,cartesianPosition.y,cartesianPosition.z];
      return entity;
    });
    return returnEntity;

  }
  async getSampleHeight(viewer, coord) {
    //clampToHeightMostDetailed
    const inputCartesian = new Cesium.Cartesian3.fromDegrees(coord[0], coord[1], 0);
    const clampedCartesians = await viewer.scene.clampToHeightMostDetailed(
      [inputCartesian]
    );
    return clampedCartesians;
  }

  createHtmlLabel(viewer, cartesian, domId) {
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
  resetSearchGroup(viewer) {
    const findEntity = viewer.entities._entities._array.find((item) => {
      return item.id == 'searchSelected'
    });
    viewer.entities.remove(findEntity);
  }
  
  clickHtmlLabel(domId, viewer, tourPlan) {
    //검색 결과 초기화
    this.resetSearchInput();
    //html 오버레이 숨기기
    const htmlOverlay = document.querySelector(`#${domId}`);
    htmlOverlay.classList.add("hidden");
    //좌측 목록에 추가
    const countDay = document.querySelectorAll("#planBody .plan_place_list").length;
    const list = document.querySelectorAll("#planBody .plan_place_list")[countDay-1];
    list.insertAdjacentHTML("beforeend", `<div class="plan_place flex items-center select-none duration-150">
      <div class="w-8 h-8 flex items-center justify-center rounded-sm duration-150 cursor-ns-resize hover:bg-gray-700">
      <svg class="sortable" fill="currentColor" width="1rem" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M182.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L128 109.3V402.7L86.6 361.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 402.7V109.3l41.4 41.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-96-96z"/></svg>
      </div>
      <div coord="${this.selectedPlace.position}" class="flex-1 cursor-pointer hover:bg-gray-800 duration-300 rounded pl-3 py-1 my-2 mx-1">
        ${this.selectedPlace.title}
      </div>
      <div class="w-8 h-8 flex items-center justify-center rounded-full duration-150 cursor-pointer hover:bg-gray-700">
      <svg fill="currentColor" width="1rem" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
      </div>
      <div class="w-8 h-8 flex items-center justify-center rounded-full duration-150 cursor-pointer hover:bg-gray-700">
      <svg fill="currentColor" width="1rem" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
      </div>
    </div>`);
    const tourPlanEntity = tourPlan.addTourPlanEntity(viewer, this.selectedPlace.title, this.selectedPlace.cartesianPosition);
    tourPlan.planInfo.placeList.push({
      title : this.selectedPlace.title,
      coord : this.selectedPlace.position,
      coordCartesian : this.selectedPlace.cartesianPosition,
      id : tourPlan.planInfo.placeList.length+1,
      entity : tourPlanEntity,
      day : countDay
    });
    console.log("tourPlan.planInfo.placeList", tourPlan.planInfo.placeList);
    //Entity간 Line 그리기
    tourPlan.drawLineBetweenPlaces(viewer);
    
    //좌측 여행 목록에서 마지막 추가된 여행지에 클릭 이벤트 추가
    const placeDom = list.querySelector(":scope > div:last-child >div:nth-child(2)");
    this.addEventFly(viewer, tourPlanEntity, placeDom);
  }

  addEventFly(viewer,entity, placeDom){
    placeDom.addEventListener("click",(e)=>{
      const heading = Cesium.Math.toRadians(0);
      const pitch = Cesium.Math.toRadians(-40);
      const range = 500;
      viewer.flyTo(entity, {
        offset : new Cesium.HeadingPitchRange(heading, pitch, range),
        duration : 1.5
      })
    })
  }
}
export default SearchPlace;
