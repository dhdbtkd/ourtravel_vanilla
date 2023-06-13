import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import SearchPlace from './search.js'
import viewer from './map.js'
import TourPlan from './tourPlan.js';
import Sortable from 'sortablejs';

import { createClient, createPool } from '@vercel/postgres';

const pool = createPool({
  connectionString : import.meta.env.VITE_POSTGRES_URL
})
console.log(pool);
const { rows, fields } =  await pool.sql`SELECT * FROM tourplans;`;
console.log(rows, fields);

console.log(import.meta.env.VITE_POSTGRES_DATABASE)

const tourPlan = new TourPlan();
tourPlan.addDay();
const removeHtmlOverlayEvent = ()=>{

}
// 날짜추가 버튼 클릭 이벤트
document.querySelector("#add_day").addEventListener("click",()=>{
  tourPlan.addDay();
})

//장소 검색 시 Enter키 입력 이벤트
document.querySelector("#searchPlace").addEventListener("keydown", (e)=>{
  if(e.key != "Enter") return;
  if(document.querySelector("#searchPlace").value.length < 1) return;
  document.querySelector("#searchPlaceBtn").click();
  console.log(e.key);
})
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
