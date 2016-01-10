/**
 * Created by mrivero on 27/12/2015.
 */

import {Component, View} from 'angular2/core';
import {Http, HTTP_PROVIDERS, Response, Request} from 'angular2/http';
import 'rxjs/Rx';

@Component({
    selector: 'app',
    templateUrl: 'templates/app.html',
})
export class AppComponent {

    user:Object;

    constructor (public http: Http) {
        this.getUser();
        console.log('aqui');
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/xcode");
        editor.getSession().setMode("ace/mode/javascript");

    }

    getUser(){
        this.http.get('https://randomuser.me/api/')
            .map(res => res.json())
            .subscribe(
                data => {
                    //var newUser = data.json().results[0];
                    var newUser = data.results[0]['user'];
                    this.user = {
                        name:{
                            first:  newUser.name.first[0].substring(0, 1).toUpperCase() +  newUser.name.first.substring(1),
                            last: newUser.name.last[0].substring(0, 1).toUpperCase() +  newUser.name.last.substring(1)
                        },
                        picture: newUser.picture.thumbnail
                    }
                },
                err => console.log(err),
                () => console.log("Get user completed")
            );
    }
}
