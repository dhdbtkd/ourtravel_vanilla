import mappin from '/mappin_tourplan.png';
import Sortable from 'sortablejs';
import _ from 'lodash';
import viewer from './map.js';
import { lineString, bbox, bboxPolygon } from '@turf/turf';
import config from './config.js';

class TourPlan {
    constructor(shareId) {
        this.activeDay = 1;
        this.lineGroupNm = "betweenPlaceLine";
        this.planInfo = {
            title: "",
            placeList: [

            ]
        };
        this.intro;
        if (shareId) {
            this.loadTourPlan(shareId);
        }
    }
    changeActiveDay(day) {
        this.activeDay = day;
    }
    addDay() {
        const planBody = document.querySelector("#planBody");
        const currentDays = document.querySelectorAll("#planBody .plan_day_container");
        const nextDay = currentDays.length + 1;
        planBody.insertAdjacentHTML("beforeend", `<div value="${nextDay}" class="plan_day_container">
        <div class="plan_day justify-between flex items-center text-lg">
        <div class="flex items-center">
            <svg value="plus" class="hidden cursor-pointer hover:text-gray-400 duration-200" fill="currentColor"
            width="1rem" xmlns="http://www.w3.org/2000/svg" height="1em"
            viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
          </svg>
          <svg value="minus" class="cursor-pointer hover:text-gray-400 duration-200" fill="currentColor"
            width="1rem" xmlns="http://www.w3.org/2000/svg" height="1em"
            viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM152 232H296c13.3 0 24 10.7 24 24s-10.7 24-24 24H152c-13.3 0-24-10.7-24-24s10.7-24 24-24z" />
          </svg>
          <span class="ml-3">
            <span class="day_number">
            ${nextDay}
            </span>
            <span>
                일차
            </span>
          </span>
          </div>
          <div class="px-3 py-1 cursor-pointer hover:text-gray-400 duration-200" value="removeDay">
            <svg value="removeDay" class="" fill="currentColor" width="1rem"
            xmlns="http://www.w3.org/2000/svg" height="1em"
            viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </div>
          
        </div>
        <div class="plan_place_list">

        </div>
      </div>`);
        this.addEventFoldUnfold(nextDay);
        this.addEventRemoveDay(nextDay);
        this.addSortable(nextDay);
    }
    addEventChangePlaceNM(day) {

    }
    addEventRemovePlace(placeDom) {
        const placeRemoveBtn = placeDom.querySelector(`:scope >div:last-child`);
        placeRemoveBtn.addEventListener("click", (e) => {
            placeDom.remove();
        })
        const removeSvg = dayDom.querySelector("div[value='removeDay']");
    }
    addEventFoldUnfold(day) {
        const dayDom = document.querySelector(`.plan_day_container[value='${day}']`);
        const plusSvg = dayDom.querySelector("svg[value='plus']");
        const minusSvg = dayDom.querySelector("svg[value='minus']");
        plusSvg.addEventListener("click", () => {
            this.toggleDayList(true, day);
        });
        minusSvg.addEventListener("click", () => {
            this.toggleDayList(false, day);
        })
    }
    labelDayNumber(){
        document.querySelectorAll(".plan_day_container").forEach((item, idx)=>{
            const currentIdx = Number(item.getAttribute("value"));
            const newIdx = idx+1;
            if(currentIdx === newIdx) return;
            item.setAttribute("value", newIdx);
            item.querySelector(".day_number").innerText = `${newIdx} `;
        })
    }
    addEventRemoveDay(day) {
        const dayDom = document.querySelector(`.plan_day_container[value='${day}']`);
        const removeSvg = dayDom.querySelector("div[value='removeDay']");
        removeSvg.addEventListener("click", (e) => {
            const dayDom = e.target.closest(".plan_day_container");
            dayDom.remove();
            this.labelDayNumber();
        })
    }
    addSortable(day) {
        const el = document.querySelector(`.plan_day_container[value='${day}']`).querySelector(":scope .plan_place_list");
        Sortable.create(el, {
            group: 'tourplan',
            handle: ".sortable",
            ghostClass: 'bg-gray-700',
            animation: 150,
            onEnd: (evt) => {
                if (evt.from == evt.to) console.log("같은 날짜에서 이동");
                const itemEl = evt.item;
                const container = itemEl.closest(".plan_day_container");
                const list = container.querySelector(".plan_place_list");
                const dayNumber = this.findBelongDay(itemEl);
                const placeOrder = this.getOrderFromParent(itemEl, list);
                this.reorderPlaces();
                this.removeChangedLine();
                this.redrawLines();
                // var itemEl = evt.item;  // dragged HTMLElement
                // evt.to;    // target list
                // evt.from;  // previous list
                // evt.oldIndex;  // element's old index within old parent
                // evt.newIndex;  // element's new index within new parent
                // evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
                // evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
                // evt.clone // the clone element
                // evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving
            },
        });
    }
    //여행지가 속한 날짜 확인
    findBelongDay(placeDom) {
        const container = placeDom.closest(".plan_day_container");
        const day = container.getAttribute("value");
        return day;
    }
    /**
     * 자식 DOM이 부모DOM에서 몇번째 자식인지 순서를 구한다.
     * @param {HTML Dom} childDom 자식 DOM
     * @param {HTML Dom} ParentDom 부모 DOm
     * @returns 
     */
    getOrderFromParent(childDom, ParentDom) {
        return Array.from(ParentDom.childNodes).indexOf(childDom);
    }
    reorderPlaces() {
        const planBody = document.querySelector("#planBody");
        const placeList = this.planInfo.placeList;
        placeList.map((cur, idx) => {
            const placeDom = planBody.querySelector(`.plan_place[place_id='${cur.id}']`);
            const list = placeDom.closest(".plan_place_list");
            const placeDay = this.findBelongDay(placeDom);
            const placeOrder = this.getOrderFromParent(placeDom, list);
            cur.day = placeDay;
            cur.order = placeOrder;
        })
        //날짜와 순서 필드 순으로 배열 재정렬
        placeList.sort((a, b) => {
            return a.day - b.day || a.order - b.order;
        });
    }
    removeChangedLine() {
        const placeList = this.planInfo.placeList;
        let newIds = [];
        placeList.map((cur, idx) => {
            if (!placeList[idx + 1]) return
            const entityId = `${cur.id}-${placeList[idx + 1].id}`;
            newIds.push(entityId);
            
        })
        const lines = viewer.entities._entities._array.filter((entity) => {
            return entity.group == this.lineGroupNm
        });
        const changedLines = lines.filter((line) => {
            return !newIds.includes(line.id);
        })
        changedLines.map((cur) => {
            viewer.entities.remove(cur);
        })

    }
    redrawLines() {
        const placeList = this.planInfo.placeList;
        placeList.map((cur, idx) => {
            if (!placeList[idx + 1]) return;
            const firstId = cur.id;
            const secondId = placeList[idx + 1].id;
            const entityId = `${firstId}-${secondId}`;
            const isEntityExist = this.isEntityExist(viewer, entityId);
            if (isEntityExist) return; //순서가 변경되지 않은 라인은 건너뛴다
            this.drawLineBetweenPlaces(viewer, cur, placeList[idx + 1]);
        })
    }
    isEntityExist(viewer, entityId) {
        const findEntity = viewer.entities._entities._array.find((entity) => {
            return entity.id == entityId;
        })
        if (findEntity) return true;
        return false;
    }
    toggleDayList(toggle, day) {
        const dayDom = document.querySelector(`.plan_day_container[value='${day}']`);
        const placeList = dayDom.querySelector(".plan_place_list");
        const plusSvg = dayDom.querySelector("svg[value='plus']");
        const minusSvg = dayDom.querySelector("svg[value='minus']");
        if (toggle) {
            plusSvg.classList.add("hidden");
            minusSvg.classList.remove("hidden");
            placeList.classList.remove("hidden");
        } else {
            plusSvg.classList.remove("hidden");
            minusSvg.classList.add("hidden");
            placeList.classList.add("hidden");
        }
    }
    addTourPlanEntity = (viewer, title, cartesianPosition, placeId) => {
        const entity = viewer.entities.add({
            id: placeId,
            day: 1,
            position: new Cesium.Cartesian3(cartesianPosition[0], cartesianPosition[1], cartesianPosition[2]),
            billboard: {
                image: mappin,
                show: true,
                pixelOffset: new Cesium.Cartesian2(0, 0),
                eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 5),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                scale: 0.7,
                alignedAxis: Cesium.Cartesian3.ZERO,
                scaleByDistance: new Cesium.NearFarScalar(1.5e3, 0.5, 4.5e4, 0.1),
                disableDepthTestDistance : 10000000
            },
            zIndex: 1,
            label: {
                text: title,
                pixelOffset: new Cesium.Cartesian2(0.0, -130),
                font: "24px KBO-Dia-Gothic-bold",
                fillColor: Cesium.Color.fromCssColorString("#ffffff"),
                outlineColor: Cesium.Color.fromCssColorString("#000000"),
                outlineWidth: 5,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
                    1.5e3,
                    1.0,
                    4.5e4,
                    0.2
                ),
                scaleByDistance: new Cesium.NearFarScalar(
                    5.5e3,
                    0.8,
                    4.5e4,
                    0.5
                ),
                disableDepthTestDistance : 10000000
            },
            zIndex: 2
        });


        return entity;
    }
    drawLineBetweenPlaces(viewer, firstEntity, secondEntity) {
        // const placeList = this.planInfo.placeList;
        // if (placeList.length < 2) return;
        // const newEntity = placeList[placeList.length - 1];
        // const beforeEntity = placeList[placeList.length - 2];
        const firstCoordCartesian = !Array.isArray(firstEntity.coordCartesian) ? JSON.parse(firstEntity.coordCartesian) : firstEntity.coordCartesian;
        const secondCoordCartesian = !Array.isArray(secondEntity.coordCartesian) ? JSON.parse(secondEntity.coordCartesian) : secondEntity.coordCartesian;
        const firstPoint = new Cesium.Cartesian3(firstCoordCartesian[0], firstCoordCartesian[1], firstCoordCartesian[2]);
        const secondPoint = new Cesium.Cartesian3(secondCoordCartesian[0], secondCoordCartesian[1], secondCoordCartesian[2])
        const betweenLine = viewer.entities.add({
            id: `${firstEntity.id}-${secondEntity.id}`,
            group: this.lineGroupNm,
            polyline: {
                positions: [firstPoint, secondPoint],
                width: 5,
                material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.ORANGE,
                    dashLength: 8.0,
                }),
                clampToGround: true
                // zIndex: 0 //zindex는 clamptoground true 일때만 동작
            },
        });
    }
    createNewPlaceListExceptEntity() {
        let newPlaceList = [];
        this.planInfo.placeList.map((cur, idx) => {
            const place = _.cloneDeep(cur);
            delete place["entity"];
            place.coord = `[${place.coord[0]},${place.coord[1]}]`;
            place.coordCartesian = `[${place.coordCartesian[0]},${place.coordCartesian[1]},${place.coordCartesian[2]}]`;
            newPlaceList.push(place);
        })
        return newPlaceList;
    }
    addToList(placeInfo) {
        //좌측 목록에 추가
        const list = document.querySelectorAll(`#planBody .plan_place_list`)[placeInfo.day - 1];
        list.insertAdjacentHTML("beforeend", `<div class="plan_place flex items-center select-none duration-150" place_id="${placeInfo.id}">
        <div class="w-8 h-8 flex items-center justify-center rounded-sm duration-150 cursor-ns-resize hover:bg-gray-700">
        <svg class="sortable" fill="currentColor" width="1rem" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M182.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L128 109.3V402.7L86.6 361.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 402.7V109.3l41.4 41.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-96-96z"/></svg>
        </div>
        <div coord="${placeInfo.coord}" class="flex-1 cursor-pointer hover:bg-gray-800 duration-300 rounded pl-3 py-1 my-2 mx-1">
            ${placeInfo.title}
        </div>
        <div class="w-8 h-8 flex items-center justify-center rounded-full duration-150 cursor-pointer hover:bg-gray-700 hidden">
        <svg fill="currentColor" width="1rem" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
        </div>
        <div class="w-8 h-8 flex items-center justify-center rounded-full duration-150 cursor-pointer hover:bg-gray-700">
        <svg fill="currentColor" width="1rem" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
        </div>
        </div>`);
        const tourPlanEntity = this.addTourPlanEntity(viewer, placeInfo.title, JSON.parse(placeInfo.coordCartesian), placeInfo.id);
        this.planInfo.placeList.push({
            title: placeInfo.title,
            coord: JSON.parse(placeInfo.coord),
            coordCartesian: JSON.parse(placeInfo.coordCartesian),
            id: placeInfo.id,
            entity: tourPlanEntity,
            day: placeInfo.day
        });
        //좌측 여행 목록에서 마지막 추가된 여행지에 클릭 이벤트 추가
        const placeDom = list.querySelector(":scope > div:last-child >div:nth-child(2)");
        this.addEventFly(viewer, tourPlanEntity, placeDom);
        //좌측 여행 목록에서 삭제 이벤트 추가
        const placeRemoveBtn = list.querySelector(":scope > .plan_place:last-child >div:last-child");
        this.addPlaceRemoveEvent(viewer, tourPlanEntity, placeRemoveBtn, this);
    }
    addEventFly(viewer, entity, placeDom) {
        placeDom.addEventListener("click", (e) => {
            const heading = Cesium.Math.toRadians(0);
            const pitch = Cesium.Math.toRadians(-40);
            const range = 500;
            viewer.flyTo(entity, {
                offset: new Cesium.HeadingPitchRange(heading, pitch, range),
                duration: 1.5
            })
        })
    }
    addPlaceRemoveEvent(viewer, entity, removeBtn, tourPlan) {
        removeBtn.addEventListener("click", (e) => {
            //.plan_place 클래스를 가진 부모를 찾는다
            const placeDom = e.target.closest(".plan_place");
            const placeId = placeDom.getAttribute("place_id");
            placeDom.remove(); // Dom 삭제
            //Entity 삭제
            viewer.entities.remove(entity);
            //tourPlan에서 삭제
            const tourPlan_placeIdx = tourPlan.planInfo.placeList.findIndex((item) => {
                return item.id == placeId
            })
            if (tourPlan_placeIdx > -1) tourPlan.planInfo.placeList.splice(tourPlan_placeIdx, 1);
            this.reorderPlaces();
            this.removeChangedLine();
            this.redrawLines();
        })
    }
    //여행계획 데이터 읽어서 나열
    processLoadTourPlan(places) {
        let currentDayCount = this.countDay();
        places.map((cur, idx) => {
            const day = cur.day;
            if (currentDayCount < day) { //현재 날짜 수가 여행 계획의 날짜보다 적을 경우
                for (let i = 0; i < day - currentDayCount; i++) { //날짜 차이 만큼
                    this.addDay(); //날짜를 추가
                    currentDayCount = this.countDay(); //현재 날짜 수를 갱신
                }
            }
            this.addToList(cur); //좌측 여행계획 목록에 추가 + Entity 추가
            if (!places[idx + 1]) return
            const firstEntity = cur;
            const secondEntity = places[idx + 1];
            this.drawLineBetweenPlaces(viewer, firstEntity, secondEntity);
        })

    }
    //여행계획 불러오기
    loadTourPlan(name) {
        if (!name) name = this.intro.userName;
        fetch(`${config.remoteUrl}/tourplans/${name}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.result) {
                    this.processLoadTourPlan(result.data[0].places);
                    if (result.data[0].places.length > 0) {
                        const turfLine = this.getTurfLine(this.planInfo.placeList);
                        const turfBboxPolygon = this.getBbox(turfLine);
                        this.setView(turfBboxPolygon);
                    } else {

                        viewer.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
                            orientation: {
                                heading: Cesium.Math.toRadians(0.0),
                                pitch: Cesium.Math.toRadians(-90.0),
                            }
                        });
                    }

                } else {
                    console.log("loadTourPlan fail");
                }

            });
    }
    /**
     * 여행 계획을 업데이트한다
     * @param {string} name 사용자명
     */
    saveTourPlan(name) {
        if (!name) name = this.intro.userName;
        const planJson = this.createNewPlaceListExceptEntity();
        fetch(`${config.remoteUrl}/tourplans/${name}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                planJson: planJson
            }),
            withCredentials: true,
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((result) => {
            });
    }

    createTourPlan(name) {
        fetch(`${config.remoteUrl}/tourplans`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
            }),
        })
            .then((response) => response.json())
            .then((result) => {
            });
    }
    /**
     * 현재 계획 목록에 있는 날짜 수를 센다
     * @returns 날짜 수
     */
    countDay() {
        return document.querySelectorAll(".plan_day_container").length;
    }
    toggleShareModal(toggle) {
        const shareModal = document.querySelector("#shareModal");
        if (toggle) {
            shareModal.classList.remove("hidden")
            this.createShareUrl()
        } else {
            shareModal.classList.add("hidden");
            this.toggleShareCopyBtn(false);
        }

    }
    toggleShareCopyBtn(toggle) {
        if (toggle) {
            const button = document.querySelector("#share_copybtn");
            const checkIcon = button.querySelector("svg:nth-child(1)");
            checkIcon.classList.remove("hidden");
            const copyIcon = button.querySelector("svg:nth-child(2)");
            copyIcon.classList.add("hidden");
            button.classList.add("bg-green-500");
            button.classList.remove("hover:bg-blue-800");
            button.querySelector("span").innerText = "복사 완료";
        } else {
            const button = document.querySelector("#share_copybtn");
            const checkIcon = button.querySelector("svg:nth-child(1)");
            checkIcon.classList.add("hidden");
            const copyIcon = button.querySelector("svg:nth-child(2)");
            copyIcon.classList.remove("hidden");
            button.classList.remove("bg-green-500");
            button.classList.add("hover:bg-blue-800");
            button.querySelector("span").innerText = "복사";
        }

    }
    copyValue(value) {
        window.navigator.clipboard.writeText(value).then(() => {
            this.toggleShareCopyBtn(true);
        });
    }
    createShareUrl() {
        const host = window.location.host;
        document.querySelector("#shareurl").value = `https://${host}/?share=${this.intro.userName}`;
    }
    getTurfLine(places) {
        let lineArr = [];
        places.map((cur) => {
            lineArr.push(cur.coord)
        })
        const turfLine = lineString(lineArr);
        return turfLine
    }
    getBbox(turfLine) {
        const turfBbox = bbox(turfLine);
        const turfBboxPolygon = bboxPolygon(turfBbox);
        return turfBboxPolygon
    }
    setView(turfBboxPolygon) {
        const extent = {
            minX: turfBboxPolygon.bbox[0],
            minY: turfBboxPolygon.bbox[1],
            maxX: turfBboxPolygon.bbox[2],
            maxY: turfBboxPolygon.bbox[3]
        }
        const bufferSize = {
            x: Math.abs(extent.minX - extent.maxX) * 0.1,
            y: Math.abs(extent.minY - extent.maxY) * 0.1,
        }
        const rectangle = Cesium.Rectangle.fromDegrees(
            extent.minX - bufferSize.x,
            extent.minY - bufferSize.y,
            extent.maxX + bufferSize.x,
            extent.maxY + bufferSize.y
        );
        viewer.camera.setView({
            destination: rectangle,
        });
    }
}

export default TourPlan;