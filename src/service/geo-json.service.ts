import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class GeoJsonService {
  title = 'geoMapTask';

  constructor(private http: HttpClient) {
  }

  getGeoJson(): Observable<any>{
    return this.http.get('/api/russia.geo.json');
  }
}
