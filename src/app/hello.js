import {Component} from '@angular/core';

@Component({
  selector: 'fountain-app',
  template: require('./hello.html')
})
/**
 * Hello component class
 */
export class HelloComponent {
  /**
   * Hello component constructor
   */
  constructor() {
    this.hello = 'Hello World!';
  }
}
