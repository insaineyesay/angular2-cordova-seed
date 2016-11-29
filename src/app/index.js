import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {routing, RootComponent} from './routes';

import {HelloComponent} from './hello';

@NgModule({
  imports: [
    BrowserModule,
    routing
  ],
  declarations: [
    RootComponent,
    HelloComponent
  ],
  bootstrap: [RootComponent]
})
/**
 * Class that represents our App
 */
export class AppModule {}
