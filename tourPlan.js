import mappin from '/mappin_tourplan.png';


class TourPlan {
    constructor() {
        this.placeList = [

        ];
    }
    addEventFoldUnfold(day){
        const dayDom = document.querySelector(`.plan_day_container[value='${day}']`);
        const plusSvg = dayDom.querySelector("svg[value='plus']");
        const minusSvg = dayDom.querySelector("svg[value='minus']");
        plusSvg.addEventListener("click",()=>{
            this.toggleDayList(true, day);
        });
        minusSvg.addEventListener("click",()=>{
            this.toggleDayList(false, day);
        })
    }
    toggleDayList (toggle, day) {
        const dayDom = document.querySelector(`.plan_day_container[value='${day}']`);
        const placeList = dayDom.querySelector(".plan_place_list");
        const plusSvg = dayDom.querySelector("svg[value='plus']");
        const minusSvg = dayDom.querySelector("svg[value='minus']");
        if(toggle){
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
                scaleByDistance : new Cesium.NearFarScalar(
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