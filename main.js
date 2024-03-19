import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import SearchPlace from './search.js'
import viewer from './map.js'
import TourPlan from './tourPlan.js';
import Sortable from 'sortablejs';
import Intro from './intro';
import Login from './login';
import Share from './share';
import config from './config.js';

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
let shareId = params.share;

const login = new Login();
const loginValid = await login.loginValidCheck();

const intro = new Intro(loginValid, login.name);

// const tourPlan = new TourPlan(intro);
// intro.TourPlan = tourPlan; //intro에 tourplan 할당
let tourPlan;
if(loginValid){
  tourPlan = intro.TourPlan;
} else if(shareId){
  new Share(shareId);
} else {
  tourPlan = new TourPlan();
  intro.tourPlan = tourPlan;
}
if(!shareId){
  tourPlan.intro = intro;
  tourPlan.addDay();
  
  // 날짜추가 버튼 클릭 이벤트
  document.querySelector("#add_day").addEventListener("click",()=>{
    tourPlan.addDay();
  })
  // 저장 버튼 클릭 이벤트
  document.querySelector("#save").addEventListener("click", ()=>{
    tourPlan.saveTourPlan()
  })
  // 공유 버튼 클릭 이벤트
  document.querySelector("#share").addEventListener("click", ()=>{
    tourPlan.toggleShareModal(true);
  })
  // 공유 종료 버튼 클릭 이벤트
  document.querySelector("#share_closebtn").addEventListener("click", ()=>{
    tourPlan.toggleShareModal(false);
  })
  // 공유 복사 버튼 클릭 이벤트
  document.querySelector("#share_copybtn").addEventListener("click", ()=>{
    const shareUrl = document.querySelector("#shareurl").value;
    tourPlan.copyValue(shareUrl);
  })
  
  //장소 검색 시 Enter키 입력 이벤트
  document.querySelector("#searchPlace").addEventListener("keydown", (e)=>{
    if(e.key != "Enter") return;
    if(document.querySelector("#searchPlace").value.length < 1) return;
    document.querySelector("#searchPlaceBtn").click();
    console.log(e.key);
  })
  const googleGeocode = async (query)=>{
    const url = `${config.remoteUrl}/search/geocode/${query}`;
    const queryResult = await fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return data;
      });
    return queryResult;
  }
  document.querySelector("#searchPlaceBtn").addEventListener("click", async ()=>{
    const queryString = document.querySelector("#searchPlace").value;
    const queryParam = {
      q: queryString
    };
    const searchObj = new SearchPlace(viewer, tourPlan);
    const queryResult = await searchObj.fetchSearchPlace(queryParam);
    console.log("queryResult", queryResult);
    searchObj.queryResultToList(queryResult, "searchResultList");
    const resultList = document.querySelectorAll("#searchResultList>div");
    [...resultList].forEach((item)=>{
      item.addEventListener("click", async (e)=>{
        console.log(e.target);
        if(searchObj.searchEngine === "google"){
          const placeNM = e.target.closest(".search_place").querySelector(".main_text").innerText;
          const placeId = e.target.closest(".search_place").getAttribute("place_id");
          console.log("🚀 ~ file: main.js:94 ~ item.addEventListener ~ placeId:", placeId)
          if(placeId){
            const geocodeResult = await googleGeocode(placeId);
            console.log("🚀 ~ file: main.js:98 ~ item.addEventListener ~ geocodeResult:", geocodeResult)
            const coordArr = [geocodeResult.data.results[0].geometry.location.lng, geocodeResult.data.results[0].geometry.location.lat];
            const selectedEntity = await searchObj.createSelectedPlaceEntity(viewer, coordArr, placeNM);
            const entityCartesian = selectedEntity.position._value;
            const entityCarto = new Cesium.Cartographic.fromCartesian(entityCartesian);
            const entityHeight = entityCarto.height;
            const heading = Cesium.Math.toRadians(0);
            const pitch = Cesium.Math.toRadians(-40);
            const range = entityHeight*2.5;
            viewer.flyTo(selectedEntity, {
              offset : new Cesium.HeadingPitchRange(heading, pitch, range),
              duration : 2
            })
            
          }
          
        } else {
          const placeNM = e.target.innerHTML.split(",")[0];
          console.log(placeNM);
          const coordArr = e.target.getAttribute('coord').split(',');
          const selectedEntity = await searchObj.createSelectedPlaceEntity(viewer, coordArr, placeNM);
          const entityCartesian = selectedEntity.position._value;
          const entityCarto = new Cesium.Cartographic.fromCartesian(entityCartesian);
          const entityHeight = entityCarto.height;
          const heading = Cesium.Math.toRadians(0);
          const pitch = Cesium.Math.toRadians(-40);
          const range = entityHeight*2.5;
          viewer.flyTo(selectedEntity, {
            offset : new Cesium.HeadingPitchRange(heading, pitch, range),
            duration : 2
          })
        }
        
        // viewer.camera.flyTo({
        //   destination: Cesium.Cartesian3.fromDegrees(coordArr[0],coordArr[1], 400),
        //   orientation: {
        //     heading: Cesium.Math.toRadians(0.0),
        //     pitch: Cesium.Math.toRadians(-15.0),
        //   },
        //   complete : (e)=>{
        //     searchObj.createSelectedPlaceEntity(viewer, coordArr);
        //   }
        // });
      })
    })
  })
}

