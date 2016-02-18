/**
 * Created by mrivero on 27/12/2015.
 */

/// <reference path="./d/ace.d.ts" />
/// <reference path="./d/gapi.d.ts" />
/// <reference path="./d/jquery.d.ts" />

import {Component, View} from 'angular2/core';
import {Http, HTTP_PROVIDERS, Response, Request, Headers} from 'angular2/http';
import {LanguageService} from './language.service';
import {MyGapi, User} from './GoogleAPI';
import 'rxjs/Rx';
import { IConfiguration, ILanguage, IFormat, IOperation} from './interfaces';




@Component({
    selector: 'app',
    templateUrl: 'templates/app.html',
})
export class AppComponent {
    user: User;
    editor: any;
    saveTimeout: any;
    googleAPI: any;
    fileName: string;
    fileExtension: string;
    loaded: boolean = false;
    configuration: IConfiguration;
    languages: { [key:string]: ILanguage };
    selectedFormat: string;

    constructor(public http: Http, private _languageService: LanguageService) {
        $('body').removeClass('unresolved');
        let languagesDef= $.Deferred(),
            aLanDef = [];
	    
        this.languages = {};

        //this.http.get('/api/configuration')
        //    .map(res => res.json())
        //    .subscribe(
        //        (data) => {
        //            this.configuration = data;
        //            languagesDef.resolve();
        //        },
        //        (err) => {
        //            languagesDef.reject();
        //        }
        //    );
        //$.when(languagesDef)
        //    .done(() => {
        //        $.each(this.configuration.languages, (languageId, languagePath) => {
        //            let d = $.Deferred();
        //            this._languageService.getLanguage(languagePath)
        //                .subscribe(
        //                    (lang:ILanguage) => {
        //                        this.languages[lang.extension] = lang;
        //                        d.resolve();
        //                    },
        //                    (err) => {
        //                        d.reject();
        //                    });
        //            aLanDef.push(d.promise());
        //        });
        //        $.when.apply($, aLanDef)
        //            .done(() => console.log('se leyeron todos los lenguajes';)
        //            .fail(() => console.log('No se cogiron todos los lenguajes';);
        //    });


        this.initAce();

        Promise.all([
            new Promise ((resolve, reject) => {
                this.http.get('/api/configuration')
                    .map(res => res.json())
                    .subscribe(
                        (data) => {
                            this.configuration = data;
                            let listo = [];
                            $.each(this.configuration.languages, (languageId, languagePath) => {
                                listo.push((() => {
                                    let d = new Promise((resolve, reject) => {
                                        this._languageService.getLanguage(languagePath)
                                            .subscribe(
                                                (lang:ILanguage) => {
                                                    this.languages[lang.extension] = lang;
                                                    resolve();
                                                },
                                                (err) => {
                                                    console.log(err);
                                                    reject();
                                                });
                                    });
                                    return d;
                                })());

                            });

                            Promise.all(listo).then(() => resolve(), ()=> reject());
                        },
                        (err) => {
                            console.log(err);
                        })
                }),
            new Promise((resolve, reject) => {
                let headers = new Headers();
                this.googleAPI = new MyGapi(this.http, headers);
                this.googleAPI.authorize(
                    (token) => {
                        this.googleAPI.loadDriveFile(
                            (file) => {
                                console.log("FILE");
                                console.log(file);
                                this.fileName = file.originalFilename;
                                this.fileExtension = file.fileExtension;
                                this.replaceEditorContent(file.content);
                                resolve();
                            },
                            () => console.log("Error de carga de archivo Drive.")
                        );
                        this.googleAPI.getUserInfo('me')
                            .then(
                                (user:User) => this.setUser(user.displayName, user.picture),
                                () => {
                                    console.log('fail loading ')
                                }
                            );

                        this.loaded = true;
                    },
                    (err) => {
                        console.log(err);
                        this.loaded = true;
                    });
            })
        ]).then(() => {
            console.log("todo listo, calisto");
            console.log(this.languages);
            this.setEditorHandlers();
            this.setEditorParameters();
        });


    }

    initAce() {
        this.editor = ace.edit("editor");
        //this.editor.setTheme("ace/theme/xcode");
        // this.editor.getSession().setMode("ace/mode/javascript");
        // Disable sintax error
        this.editor.getSession().setUseWorker(false);
    }

    setEditorHandlers() {
        this.editor.on('change', (content) => {
            if (this.saveTimeout !== null) {
                clearTimeout(this.saveTimeout);
            }

            this.saveTimeout = setTimeout(
                (content) => {
                    this.saveFileToDrive(this.editor.getValue());
                }
                , 2000);
        });
    }

    saveFileToDrive(content: string) {
        console.log('save file');
        this.googleAPI.saveFileToDrive(content);
    }

    replaceEditorContent(newContent: string) {
        this.editor.setValue(newContent, -1);
    }

    setEditorParameters(){
        console.log(this.fileExtension);
        let selectedFormat= this.languages[this.fileExtension].formats[0];

        if(selectedFormat.editorThemeId){
            console.log(selectedFormat.editorThemeId)
            this.editor.setTheme(selectedFormat.editorThemeId);
        }
        if(selectedFormat.editorModeId){
            console.log(selectedFormat.editorModeId);
            this.editor.getSession().setMode(selectedFormat.editorModeId);
        }
    }

    setUser(displayname: string, picture: string) {
        this.user = {
            displayName: displayname,
            picture: picture
        };
    }
}
