import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import SearchPlace from './search.js'
import viewer from './map.js'

document.querySelector("#searchPlaceBtn").addEventListener("click", async ()=>{
  const queryString = document.querySelector("#searchPlace").value;
  const queryParam = {
    q: queryString
  };
  const searchObj = new SearchPlace()
  const queryResult = await searchObj.fetchSearchPlace(queryParam);
  console.log("queryResult", queryResult);
  searchObj.queryResultToList(queryResult, "searchResultList");
  const resultList = document.querySelectorAll("#searchResultList>div");
  [...resultList].forEach((item)=>{
    item.addEventListener("click", (e)=>{
      const coordArr = e.target.getAttribute('coord').split(',');
      
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(coordArr[0],coordArr[1], 400),
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-15.0),
        }
      });
    })
  })
})
