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
  
}
export default SearchPlace;
// export async function fetchSearchPlace(param) {
//   const query = param.q;
//   const queryResult = await fetch(`https://nominatim.openstreetmap.org/search?q=${param.q}&format=json&accept-language=ko-kr,ko;q=0.8,en-us;q=0.5,en;q=0.3?limit=5`)
//   .then((response)=>{
//     return response.json();
//   })
//   .then((data)=>{
//     return data;
//   });
//   return queryResult;
// }
