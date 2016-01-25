/**
 * Created by mrivero on 27/12/2015.
 */

import {Component, View} from 'angular2/core';
import {Http, HTTP_PROVIDERS, Response, Request, Headers} from 'angular2/http';
import {MockBackend} from 'angular2/http/testing';
import {MyGapi, User} from './GoogleAPI';
import 'rxjs/Rx';

declare var gapi: any;
declare var ace: any;

@Component({
    selector: 'app',
    templateUrl: 'templates/app.html',
})
export class AppComponent {
    user: User;
    editor: any;

    constructor (public http: Http) {
        this.initAce();
        let headers = new Headers();
        var googleAPI = new MyGapi(this.http, headers);
        googleAPI.authorize(
            (token) => {
                console.log('fin de get file');
                googleAPI.loadDriveFile((data) => this.replaceEditorContent(data), () => console.log("Error de carga de archivo Drive."));
                googleAPI.getUserInfo('me')
                    .then(
                        (user: User) => this.setUser(user.displayName, user.picture),
                        ()=>{
                            console.log('fail')
                        }
                    );
            },
            (err) => {
                console.log(err);
            });
    }

    initAce(){
        this.editor = ace.edit("editor");
        this.editor.setTheme("ace/theme/xcode");
        this.editor.getSession().setMode("ace/mode/javascript");
    }

    replaceEditorContent(newContent: string) {
        this.editor.setValue(newContent, -1);
    }

    setUser(displayname: string, picture: string){
        this.user = {
            displayName: displayname,
            picture: picture
        };
    }
}
