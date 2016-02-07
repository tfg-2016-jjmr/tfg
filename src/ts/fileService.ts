'use strict';
/// <reference path="./d/gapi.d.ts" />

import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http'

export interface File {
    content: string;
    metadata: Object;
}

@Injectable()
export class FileService{
    file : File;
    
    
    constructor(public http: Http, public headers: Headers){    
    }
    
    getFileContentById(id: string){
        return gapi.client.load('drive', 'v2',
                    () => {
                        let request = gapi.client.drive.files.get({'fileId': id});
                        request.execute((resp) => {
                            console.log("My file: " + resp.id);
                            console.log("downloadUrl: " + resp.downloadUrl);
                            console.log(resp);
                            this.file = resp;
                            //this.headers = new Headers();
                            console.log(gapi.auth.getToken());
                            this.headers.append('Authorization', 'Bearer ' + gapi.auth.getToken().access_token);
                            this.http.get(resp.downloadUrl, {headers: this.headers})
                                .map(res => res.text())
                                .map(content => {
                                        console.log('fileLoaded');
                                        //console.log(data);
                                        this.file['content'] = content;

                                        return this.file;
                                })
                        });
                    });
    }
}