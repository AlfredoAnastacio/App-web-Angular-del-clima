import { Component } from '@angular/core';
import { GeolocationService } from './services/geolocation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})

export class AppComponent {
  title = 'weather';

  constructor( public geolocationService: GeolocationService) {}

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.geolocationService.requestGeolocation();
  }

}
