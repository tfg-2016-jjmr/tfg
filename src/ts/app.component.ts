/**
 * Created by mrivero on 27/12/2015.
 */

/// <reference path="./d/ace.d.ts" />
/// <reference path="./d/gapi.d.ts" />

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
    saveTimeout: any;
    googleAPI: any;

    constructor(public http: Http) {
        this.initAce();
        let headers = new Headers();
        this.googleAPI = new MyGapi(this.http, headers);
        this.googleAPI.authorize(
            (token) => {
                console.log('fin de get file');
                this.googleAPI.loadDriveFile(
                    (data) => {
                        this.replaceEditorContent(data);
                        this.setEditorHandlers();
                    },
                    () => console.log("Error de carga de archivo Drive.")
                );
                this.googleAPI.getUserInfo('me')
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

    initAce() {
        this.editor = ace.edit("editor");
        this.editor.setTheme("ace/theme/xcode");
        this.editor.getSession().setMode("ace/mode/javascript");
    }

    setEditorHandlers() {
        this.editor.on('change', (content) => {
            if(this.saveTimeout !== null){
                clearTimeout(this.saveTimeout);
            }

            this.saveTimeout = setTimeout(
                (content) => {
                    this.saveFileToDrive(this.editor.getValue());
                }
                ,2000);
        });
    }

    saveFileToDrive(content: string) {
        console.log('save file');
        this.googleAPI.saveFileToDrive(content);
    }

    replaceEditorContent(newContent: string) {
        this.editor.setValue(newContent, -1);
    }

    setUser(displayname: string, picture: string) {
        this.user = {
            displayName: displayname,
            picture: picture
        };
    }
}
