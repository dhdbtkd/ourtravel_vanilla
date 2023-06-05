import mappin from '/mappin_tourplan.png';


class TourPlan {
    constructor() {
        this.placeList = [

        ];
    }
    addTourPlanEntity = (viewer, title, cartesianPosition) => {
        const entity = viewer.entities.add({
            position: new Cesium.Cartesian3(cartesianPosition[0], cartesianPosition[1], cartesianPosition[2]),
            billboard: {
                image: mappin,
                show: true,
                pixelOffset: new Cesium.Cartesian2(0, 0),
                eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                scale: 0.7,
                alignedAxis: Cesium.Cartesian3.ZERO,
                scaleByDistance: new Cesium.NearFarScalar(1.5e3, 1.0, 1.5e5, 0.3),
            },
            zIndex : 1,
            label: {
                text: title,
                pixelOffset: new Cesium.Cartesian2(0.0, -130),
                font: "24px SUITE-Regular",
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
            },
            zIndex : 2
        });

        
        return entity;
    }
    drawLineBetweenPlaces(viewer) {
        const placeList = this.placeList;
        if (placeList.length < 2) return;
        console.log(placeList);
        const newEntity = placeList[placeList.length-1];
        const beforeEntity = placeList[placeList.length-2];
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
                zIndex : 0
            },
        });
    }
}

export default TourPlan;