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
  waypointData: Array<Array<number>> = []

  constructor(private geoJsonService: GeoJsonService) {
  }

  // подсчет длины всего пути по методу Евклидово.
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
          }
        }
        this.calculationOfTheSettlement();
      },
      error => {
        console.log(error);
      }
    )
  }
  getDataWithNormalRange(): void {
    this.coordinatesData.filter((waypoint: number[]) => {
      if ((waypoint[0] > 0 && waypoint[0] < 90) && (waypoint[1] > 0 && waypoint[1] < 180)) {
        this.waypointData.push(waypoint);
      }
    })
  }
  subarray: any = [];
  onMapReady(event: YaReadyEvent<ymaps.Map>): void {
    const objectManagerOptions: ymaps.IObjectManagerOptions = {
      clusterize: true,
      gridSize: 32,
      clusterDisableClickZoom: true,
    };
    this.getDataWithNormalRange();
    const objectManager = new ymaps.ObjectManager(objectManagerOptions);
    objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    event.target.geoObjects.add(objectManager);
    const SIZE = 200; //размер подмассива
    const TIME = 5000;
    let i = 0
    for (i; i < Math.ceil(this.waypointData.length / SIZE); i++) {
      this.subarray[i] = (this.waypointData.slice((i * SIZE), (i * SIZE) + SIZE));
    }

    let counter = 1;
    let stepSubArray = this.subarray[0];


    let count = setInterval(() => {
      counter += 1;
      for (let waypint of this.subarray[counter]) {
        stepSubArray.push(waypint);
      }

      (stepSubArray as Array<Array<number>>).forEach((point, index) => {
        objectManager.add({
          type: 'Feature',
          id: index,
          geometry: {
            type: 'Point',
            coordinates: point,
          },
        });
      });
      // if (counter > this.subarray.length) {
      //   clearInterval(count)
      // }
      if (counter > 10) {
        clearInterval(count)
      }
    }, TIME);

  }
}
