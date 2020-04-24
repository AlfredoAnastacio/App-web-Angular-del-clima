import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Coords } from 'src/structures/coords.structure';
import { map } from 'rxjs/operators';
import { Weather } from 'src/structures/weather.structure';
import { GeolocationService } from './geolocation.service';

@Injectable({
  providedIn: 'root'
})
export class ForecastService {

  public weatherSubject: Subject<any> = new Subject<any>();
  public weather$: Observable<any>;

  endpoint = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient, public geolocationService: GeolocationService) {
    this.weather$ = this.weatherSubject.asObservable().pipe(map(this.structureData));

    this.geolocationService.coords$.subscribe((coords) => {
      this.get(coords);
    });
  }

  structureData(data: any) {

    const minMaxPerDay = {};

    data.list.forEach(weatherObject => {
      const date = new Date(weatherObject.dt * 1000);
      const hours = date.getHours();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const key = `${month}-${day}`;

      let tempPerDay: Weather = {
        minMaxTemp : {}
      };

      if (!tempPerDay.cod || hours === 16) {
        const source = weatherObject.weather[0];
        tempPerDay = { ...tempPerDay, ...source };
        tempPerDay.cod = source.id;
        tempPerDay.name = data.city.name;
      }

      if (!tempPerDay.minMaxTemp.min || weatherObject.main.temp_min < tempPerDay.minMaxTemp.min) {
        tempPerDay.minMaxTemp.min = weatherObject.main.temp_min;
      }
      if (!tempPerDay.minMaxTemp.max || weatherObject.main.temp_max > tempPerDay.minMaxTemp.max) {
        tempPerDay.minMaxTemp.max = weatherObject.main.temp_max;
      }

      minMaxPerDay[key] = tempPerDay;
    });

    return Object.values(minMaxPerDay);
  }

  get(coords: Coords) {
    const args = `?lat=${coords.lat}&lon=${coords.long}&APPID=${environment.key}&units=metric`;
    const url = this.endpoint + args;

    // if (isDevMode()) {
    //   url = 'assets/forecast.json';
    // }

    this.http.get(url).subscribe(this.weatherSubject);
  }
}
