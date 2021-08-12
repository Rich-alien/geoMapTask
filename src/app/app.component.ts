import {Component, OnInit} from '@angular/core';
import {GeoJsonService} from "../service/geo-json.service";
import {YaReadyEvent} from 'angular8-yandex-maps';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'geoMapTask';
  coordinatesData: Array<Array<number>> = [];
  waypointData: Array<Array<Array<number>>> = []

  constructor(private geoJsonService: GeoJsonService) {
  }

  // подсчет длины всего пути по методу Евклидово.
  // выводиятся данные в консоле
  calculationOfTheSettlement() {
    let coordinates = this.coordinatesData;
    let distance = 0;
    for (let i = 1; i < coordinates.length; i++) {
      distance += Math.sqrt(((coordinates[i][0] - coordinates[i - 1][0]) ** 2) + ((coordinates[i][1] - coordinates[i - 1][1]) ** 2))
    }
    console.log(distance);
  }

  ngOnInit() {
    this.geoJsonService.getGeoJson().subscribe(
      data => {
        for (let coordinatesArray of data.features[0].geometry.coordinates) {
          for (let coordinates of coordinatesArray) {
            for (let coordinate of coordinates) {
              this.coordinatesData.push(coordinate);
            }
            this.waypointData.push(coordinates);
          }
        }
        this.calculationOfTheSettlement();
      },
      error => {
        console.log(error);
      }
    )
  }
  // функция при которой мы можем убрать все линии за терриорией карты, при её использваоние
  // устраниятся все те что выходят за пределы линий
  // для её работы нужно будет удалить c строчки 36;
  // а так же расскоментировать запуск функции на 59 строчке
  // но по заданию ничего не говорилось про удаление ненужных точек. но функционал есть для этого
  // getDataWithNormalRange(): void {
  //   this.coordinatesData.filter((waypoint: number[]) => {
  //     if ((waypoint[0] > 0 && waypoint[0] < 90) && (waypoint[1] > 0 && waypoint[1] < 180)) {
  //       this.waypointData.push(waypoint);
  //     }
  //   })
  // }
  // создание кривых на карте в виде полигонов.
  onMapReady(event: YaReadyEvent<ymaps.Map>): void {
    // this.getDataWithNormalRange();
    let myPolyline: any;
    for (let polyLine of this.waypointData) {
      myPolyline = new ymaps.Polyline(polyLine, {}, {});
      event.target.geoObjects.add(myPolyline);
    }
  }
}
