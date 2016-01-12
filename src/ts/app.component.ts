/**
 * Created by mrivero on 27/12/2015.
 */

import {Component, View} from 'angular2/core';
import {Http, HTTP_PROVIDERS, Response, Request} from 'angular2/http';
import 'rxjs/Rx';

declare var gapi: any;
declare var ace: any;



interface User {
    displayName: string;
    picture?: string;
};

@Component({
    selector: 'app',
    templateUrl: 'templates/app.html',
})
export class AppComponent {

    user: User;
    apiKey: string;
    clientId: string;
    scopes: Array<string>;

    constructor (public http: Http) {
        this.initCredentials();
        //this.getRandomUser();
        this.initAce();
        console.log(this);

    }

    initAce(){
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/xcode");
        editor.getSession().setMode("ace/mode/javascript");

    }

    getRandomUser(){
        this.http.get('https://randomuser.me/api/')
            .map(res => res.json())
            .subscribe(
                data => {
                    //var newUser = data.json().results[0];
                    var newUser = data.results[0]['user'];
                    this.user = {
                        displayName: newUser.name.first[0].substring(0, 1).toUpperCase() +  newUser.name.first.substring(1) + " " +newUser.name.last[0].substring(0, 1).toUpperCase() +  newUser.name.last.substring(1),
                        picture: newUser.picture.thumbnail
                    }
                },
                err => console.log(err),
                () => console.log("Get user completed")
            );
    };

    setUser(displayname: string, picture: string){
        this.user = {
            displayName: displayname,
            picture: picture
        };
        //this.user.displayName = displayname;
        //this.user.picture = picture;
    }

    initCredentials() {
        this.apiKey= "AIzaSyCoRUmlrl47ty3dMkM4nk0hUK55syJkjQw";
        this.clientId  = "63791508161-k9331fs3l9gh9iqf40en16j85mnhdlli.apps.googleusercontent.com";
        this.scopes = [
            'https://www.googleapis.com/auth/drive.metadata.readonly',
            'https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/userinfo.email'
        ];

        /**
         * GAPI
         */
        console.log('googleOnLoadCallback called');
        gapi.client.setApiKey(this.apiKey);
        //setTimeout(()=>{this.checkAuth();},1);
        this.checkAuth();
    }

    checkAuth() {
        gapi.auth.authorize({client_id: this.clientId, scope: this.scopes, immediate: true}, (data)=>{this.handleAuthResult(data);});
    }

    handleAuthResult(authResult: any) {
        console.log("ASDASD");
        console.log(this);
        var self = this;
        if (authResult && !authResult.error) {
            this.getPlusInfo("me");
            this.loadDriveApi();
        } else {
            console.log(this.clientId);
            console.log(this.scopes);
            var config = {
                'client_id': this.clientId,
                'scope': this.scopes.join(' ')
            };
            console.log("ASDASD => " + config);
            gapi.auth.authorize(config, () => {
                console.log(this);
                console.log('login complete');
                console.log(gapi.auth.getToken());
                this.getPlusInfo("me");
                this.loadDriveApi();
            });
        }
    }

    getPlusInfo(userId: any) {
        gapi.client.load('plus', 'v1').then(() => {
            var request = gapi.client.plus.people.get({
                'userId': userId
            });
            request.execute((resp) => {
                console.log('ID: ' + resp.id);
                console.log('Display Name: ' + resp.displayName);
                console.log('Image URL: ' + resp.image.url);
                console.log('Profile URL: ' + resp.url);
                console.log(this);
                this.setUser(resp.displayName, resp.image.url)
            });
        });
    }

    loadDriveApi() {
        gapi.client.load('drive', 'v2', this.listFiles);
    }

    /**
     * Print files.
     */
    listFiles() {
        var request = gapi.client.drive.files.list({
            'maxResults': 10
        });

        request.execute(function(resp) {
            console.log('Files:');
            var files = resp.items;
            if (files && files.length > 0) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    console.log(file.title + ' (' + file.id + ')');
                }
            } else {
                console.log('No files found.');
            }
        });
    }
}

