/**
 * Created by mrivero on 17/01/2016.
 */

/// <reference path="./d/gapi.d.ts" />

export interface User {
    displayName: string;
    picture?: string;
}

export class MyGapi {

    gapi: any;
    apiKey = "AIzaSyCoRUmlrl47ty3dMkM4nk0hUK55syJkjQw";
    clientId = "63791508161-k9331fs3l9gh9iqf40en16j85mnhdlli.apps.googleusercontent.com";
    scopes = [
        'https://www.googleapis.com/auth/drive.install',
        'https://www.googleapis.com/auth/drive',
        'profile',
        'email'
    ];
    fileId: string;

    constructor(public http:any, public headers:any) {
        console.log('class gapi constructor');
        this.gapi = gapi;
        this.gapi.client.setApiKey(this.apiKey);
    }

    authorize(success:(data: any) => void, error:(err: any) => void) {
        let config:Object = {
            'client_id': this.clientId,
            'scope': this.scopes.join(' '),
            'immediate': true
        };
        this.gapi.auth.authorize(config,
            (token) => {
                this.gapi.auth.setToken(token);
                if (token && !token.error) {
                    success(token);
                } else {
                    config['immediate'] = false;
                    gapi.auth.authorize(config, (token) => {
                        if (token && !token.error) {
                            console.log('Authorization completed');
                            success(token);
                        } else {
                            console.log("Authorization error");
                        }
                    });
                }
            });
    }


    loadDriveFile(success:(data: any) => void, error:(err: any) => void) {
        let aIds = this.getUrlParameters("ids"),
            file: Object;


        console.log(aIds);
        if (aIds === null || aIds[0] === undefined){
            console.log('Coudnt get file Id');
            return;
        }

        if (typeof aIds == 'string') {
            this.fileId = aIds;
        } else if (typeof aIds == 'object') {
            this.fileId = aIds[0];
        }

        this.gapi.client.load('drive', 'v2',
            () => {
                let request = this.gapi.client.drive.files.get({'fileId': this.fileId});
                request.execute((resp) => {
                    console.log("My file: " + resp.id);
                    console.log("downloadUrl: " + resp.downloadUrl);
                    console.log(resp);
                    file = resp;
                    //this.headers = new Headers();
                    console.log(this.gapi.auth.getToken());
                    this.headers.append('Authorization', 'Bearer ' + this.gapi.auth.getToken().access_token);
                    this.http.get(resp.downloadUrl, {headers: this.headers})
                        .map(res => res.text())
                        .subscribe(
                        data => {
                            console.log('fileLoaded');
                            //console.log(data);
                                file["content"] = data;
                                success(file);
                            },
                            err => console.log(err),
                            () => console.log("File loaded successfully")
                        );
                });
            });
    }

    saveFileToDrive(content: string) {
        var request = gapi.client.request({
            'path': '/upload/drive/v2/files/' + this.fileId,
            'method': 'PUT',
            'params': {'uploadType': 'media'},
            'headers': {
                'Content-Type': 'text/plain'
            },
            'body': content
        });

        request.execute(
            (resp) => {
                console.log('content updated');
            }
        );
    }

    getUserInfo(userId: any) {
        return new Promise((resolve, reject) => {
            let user: User;
            this.gapi.client.load('plus', 'v1').then(() => {
                let request = this.gapi.client.plus.people.get({
                    'userId': userId
                });

                request.execute((resp) => {
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
            state: string;
        console.log("param: " + param);
        console.log('query: ' + query);
        if(param === null || query === '') {
            console.log('source is empty')
            return result;
        }

        let groups: Array<string> = query.substr(1).split("&");
        console.log(groups);
        for (let i in groups) {
            i = groups[i].split("=");
            map[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
        }
        if (map != null) {
            var value = map[param];
            try{
                result=JSON.parse(value);
            }catch(e){
                result = value;
            }
        }
        console.log(result);
        return result;
    }


}
