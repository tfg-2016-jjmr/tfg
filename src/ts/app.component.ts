/**
 * Created by mrivero on 27/12/2015.
 */

import {Component, View} from 'angular2/core';
import {Http, HTTP_PROVIDERS, Response, Request} from 'angular2/http';
import 'rxjs/Rx';

declare var gapi: any;
declare var ace: any;

var apiKey = "AIzaSyCoRUmlrl47ty3dMkM4nk0hUK55syJkjQw";
var clientId = "63791508161-k9331fs3l9gh9iqf40en16j85mnhdlli.apps.googleusercontent.com";
var scopes = [
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/userinfo.email'
];

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

        /**
         * GAPI
         */
        console.log('googleOnLoadCallback called');
        gapi.client.setApiKey(apiKey);
        window.setTimeout(this.checkAuth,1);
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

    checkAuth() {
        gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
    }
}


function handleAuthResult(authResult) {
    console.log("ASDASD");
    if (authResult && !authResult.error) {
        getPlusInfo("me");
        loadDriveApi();
    } else {
        var config = {
            'client_id': clientId,
            'scope': scopes.join(' ')
        };
        console.log("ASDASD => " + config);
        gapi.auth.authorize(config, function() {
            console.log('login complete');
            console.log(gapi.auth.getToken());
            getPlusInfo("me");
            loadDriveApi();
        });
    }
}

function getPlusInfo(userId) {
    gapi.client.load('plus', 'v1').then(function() {
        var request = gapi.client.plus.people.get({
            'userId': userId
        });
        request.execute(function(resp) {
            console.log('ID: ' + resp.id);
            console.log('Display Name: ' + resp.displayName);
            console.log('Image URL: ' + resp.image.url);
            console.log('Profile URL: ' + resp.url);
        });
    });
}

function loadDriveApi() {
    gapi.client.load('drive', 'v2', listFiles);
}

/**
 * Print files.
 */
function listFiles() {
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
