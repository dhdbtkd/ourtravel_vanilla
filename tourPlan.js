import mappin from '/mappin_tourplan.png';
import Sortable from 'sortablejs';

class TourPlan {
    constructor() {
        this.activeDay = 1;
        this.placeList = [

        ];
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
            ${nextDay}일차
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
    addEventRemoveDay(day) {
        const dayDom = document.querySelector(`.plan_day_container[value='${day}']`);
        const removeSvg = dayDom.querySelector("div[value='removeDay']");
        removeSvg.addEventListener("click", (e) => {
            console.log(e.target);

            const dayDom = e.target.closest(".plan_day_container");
            dayDom.remove();

        })
    }
    addSortable(day) {
        const el = document.querySelector(`.plan_day_container[value='${day}']`).querySelector(":scope .plan_place_list");
        Sortable.create(el, {
            group: 'tourplan',
            handle: ".sortable",
            ghostClass: 'bg-gray-700',
            animation: 150,
        });
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
    addTourPlanEntity = (viewer, title, cartesianPosition) => {
        const entity = viewer.entities.add({
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
                scaleByDistance: new Cesium.NearFarScalar(1.5e3, 1.0, 4.5e4, 0.1),
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
                    1.0,
                    4.5e4,
                    0.5
                ),
            },
            zIndex: 2
        });


        return entity;
    }
    drawLineBetweenPlaces(viewer) {
        const placeList = this.placeList;
        if (placeList.length < 2) return;
        console.log(placeList);
        const newEntity = placeList[placeList.length - 1];
        const beforeEntity = placeList[placeList.length - 2];
        const firstPoint = new Cesium.Cartesian3(beforeEntity.coordCartesian[0], beforeEntity.coordCartesian[1], beforeEntity.coordCartesian[2]);
        const secondPoint = new Cesium.Cartesian3(newEntity.coordCartesian[0], newEntity.coordCartesian[1], newEntity.coordCartesian[2])
        const betweenLine = viewer.entities.add({
            polyline: {
                positions: [firstPoint, secondPoint],
                width: 5,
                material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.ORANGE,
                    dashLength: 8.0,
                }),
                // zIndex: 0 //zindex는 clamptoground true 일때만 동작
            },
        });
    }
}

export default TourPlan;