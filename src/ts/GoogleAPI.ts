//import GoogleApiOAuth2TokenObject = gapi.GoogleApiOAuth2TokenObject;
/**
 * Created by mrivero on 17/01/2016.
 */

//import {gapi} from './d/gapi';
/// <reference path="./d/gapi.d.ts" />

export interface User {
    displayName: string;
    picture?: string;
}

//import gapi = require("./d/gapi.d.ts");

export class MyGapi {

    gapi: any;
    apiKey = "AIzaSyCoRUmlrl47ty3dMkM4nk0hUK55syJkjQw";
    clientId = "63791508161-k9331fs3l9gh9iqf40en16j85mnhdlli.apps.googleusercontent.com";
    scopes = [
        'https://www.googleapis.com/auth/drive.readonly',
        //'/profile', '/email',
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/drive.install'
    ];

    constructor(public http:any, public headers:any) {
        console.log('class gapi constructor');
        this.gapi = gapi;
        this.gapi.client.setApiKey(this.apiKey);
    }

    authorize(success:(data: any) => void, error:(err: any) => void) {
        this.gapi.auth.authorize({
                client_id: this.clientId,
                scope: this.scopes,
                immediate: true
            },
            (token) => {
                this.gapi.auth.setToken(token);
                if (token && !token.error) {
                    //Callback
                    success(token);
                } else {
                    let config:Object = {
                        'client_id': this.clientId,
                        'scope': this.scopes.join(' '),
                        'immediate': false
                    };
                    gapi.auth.authorize(config, () => {
                        console.log('login complete');
                        //Callback
                        success(token);
                    });
                }
            });
    }


    loadDriveFile(success:(data: any) => void, error:(err: any) => void) {
        let aIds = this.getUrlParameters("ids");
        console.log('aIds');
        console.log(aIds);
        if (aIds === null || aIds[0] === undefined){
            console.log('Coudnt get file Id');
            return;
        }
        this.gapi.client.load('drive', 'v2',
            () => {
                let request = this.gapi.client.drive.files.get({'fileId': aIds[0]});
                request.execute((resp) => {
                    console.log("My file: " + resp.id);
                    console.log("downloadUrl: " + resp.downloadUrl);

                    //this.headers = new Headers();
                    console.log(this.gapi.auth.getToken());
                    this.headers.append('Authorization', 'Bearer ' + this.gapi.auth.getToken().access_token);
                    this.http.get(resp.downloadUrl, {headers: this.headers})
                        .map(res => res.text())
                        .subscribe(
                            data => {
                                console.log('fileLoaded');
                                //console.log(data);
                                success(data);
                            },
                            err => console.log(err),
                            () => console.log("File loaded successfully")
                        );
                });
            });
    }
    getUserInfo(userId:any) {
        return new  Promise((resolve, reject) => {
            let user:User;
            this.gapi.client.load('plus', 'v1').then(() => {
                let request = this.gapi.client.plus.people.get({
                    'userId': userId
                });
                console.log(this);
                //this.headers.append('Authorization', 'Bearer ' + this.gapi.auth.getToken().access_token);
                request.execute((resp) => {
                    console.log('ID: ' + resp.id);
                    console.log('Display Name: ' + resp.displayName);
                    console.log('Image URL: ' + resp.image.url);
                    console.log('Profile URL: ' + resp.url);
                    console.log(this);

                    user = {
                        displayName: resp.displayName,
                        picture: resp.image.url
                    };

                    //success(user);
                    resolve(user);
                });
            });
        });
    }

    getUrlParameters(param) {
        let result = null,
            query = window.location.search,
            map: Object = {},
            state:string,
            group;

        console.log(param);
        console.log(query);

        if (param === null || query === ''){
            console.log('source is empty')
            return result;
        }

        let groups = query.substr(1).split("&"), i;
        console.log(groups);

        for (let i in groups) {
            //console.log(i);
            //console.log(map);
            i = groups[i].split("=");
            map[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
        }
        console.log(map);
        state = map["state"];
        if (state != null) {
            result = JSON.parse(state)[param];
        }
        console.log(result);
        return result;
    }


}

