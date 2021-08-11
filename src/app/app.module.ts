import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {GeoJsonService} from "../service/geo-json.service";
import {AngularYandexMapsModule} from "angular8-yandex-maps";

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularYandexMapsModule
  ],
  providers: [
    GeoJsonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
