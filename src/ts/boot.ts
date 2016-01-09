/**
 * Created by mrivero on 27/12/2015.
 */
import {bootstrap} from 'angular2/platform/browser'
import {AppComponent} from './app.component'
import {Http, HTTP_PROVIDERS, Response, Request} from 'angular2/http';

bootstrap(AppComponent, [HTTP_PROVIDERS]);