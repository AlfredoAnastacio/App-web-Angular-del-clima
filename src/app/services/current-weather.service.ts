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

export class CurrentWeatherService {

  public weatherSubject: Subject<any> = new Subject<any>();
  public weather$: Observable<any> = this.weatherSubject.asObservable();
  endpoint = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient, public geolocationService: GeolocationService) {

    this.weather$ = this.weatherSubject.asObservable().pipe(
      map((data: any) => {
        const mainWeather = data.weather[0];
        const weather: Weather = {
          name: data.name,
          cod: data.cod,
          temp: data.main.temp,
          ...mainWeather
        };
        return weather;
      })
    );


    this.geolocationService.coords$.subscribe((coords) => {
      this.get(coords);
    });
  }

  get(coords: Coords) {
    const args = `?lat=${coords.lat}&lon=${coords.long}&APPID=${environment.key}&units=metric`;
    const url = this.endpoint + args;

    this.http.get(url).subscribe(this.weatherSubject);
  }
}
