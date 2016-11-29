import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HelloComponent} from './hello';

@Component({
  selector: 'fountain-root',
  template: '<router-outlet></router-outlet>'
})
/**
 * Class that represents the most basic component of the app
 */
export class RootComponent {}

export const routes = [
  {
    path: '',
    component: HelloComponent
  }
];

export const routing = RouterModule.forRoot(routes);
