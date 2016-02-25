/**
 * Created by mrivero on 27/12/2015.
 */

/// <reference path="./d/ace.d.ts" />
/// <reference path="./d/gapi.d.ts" />
/// <reference path="./d/jquery.d.ts" />

import {Component, View, OnInit} from 'angular2/core';
import {Http, HTTP_PROVIDERS, Response, Request, Headers} from 'angular2/http';
import {LanguageService} from './language.service';
import {MyGapi, User} from './GoogleAPI';
import 'rxjs/Rx';
import { IConfiguration, ILanguage, IFormat, IOperation} from './interfaces';
import {Tabs} from './components/tabs';
import {Editor} from './components/editor';



@Component({
    selector: 'app',
    templateUrl: 'templates/app.html',
    directives: [Tabs, Editor]
})
export class AppComponent implements OnInit{
    user: User;
    editor: any;
    saveTimeout: any;
    googleAPI: any;
    fileName: string;
    fileId: string = '';
    fileExtension: string;
    fileContent: string;
    loaded: boolean = false;
    configuration: IConfiguration;
    languages: { [key:string]: ILanguage };
    selectedFormat: string;
    extensions: string[] = [''];

    constructor(public http: Http, private _languageService: LanguageService) {
        $('body').removeClass('unresolved');
        let languagesDef= $.Deferred(),
            aLanDef = [];
	    
        this.languages = {};

        this.initAce();

        var getConfigLang =  new Promise ((resolve, reject) => {
            this.http.get('/api/configuration')
                .map(res => res.json())
                .subscribe(
                    (data) => {
                        this.configuration = data;
                        let aLenguagesDeferred = [];
                        $.each(this.configuration.languages, (languageId, languagePath) => {
                            aLenguagesDeferred.push((() => {
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

                        Promise.all(aLenguagesDeferred).then(() => resolve(), ()=> reject());
                    },
                    (err) => {
                        console.log(err);
                    })
        });

        var loadContent =  new Promise((resolve, reject) => {
            let headers = new Headers();
            this.googleAPI = new MyGapi(this.http, headers);
            this.googleAPI.authorize(
                (token) => {
                    this.googleAPI.loadDriveFile(
                        (id, file) => {
                            console.log("FILE");
                            console.log(file);
                            this.fileId = id;
                            this.fileName = file.originalFilename;
                            this.fileExtension = file.fileExtension;
                            this.fileContent = file.content;
                            resolve();
                        },
                        () => console.log("Error de carga de archivo Drive.")
                    );
                    this.googleAPI.getUserInfo('me')
                        .then(
                            (user:User) => this.setUser(user.email, user.displayName, user.picture),
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
        });


        Promise.all([loadContent, getConfigLang]).then(() => {
            console.log("todo listo, calisto");
            console.log(this.languages);
            let formats = this.languages[this.fileExtension].formats;
            this.extensions = [];
            for(let f in formats){
                console.log(formats[f].format);
                this.extensions.push(formats[f].format);
                //Tabs.addTab(formats[f].format);

            }
            //    this.initAce();
            this.replaceEditorContent(this.fileContent);
            this.setEditorHandlers();
            this.setEditorParameters();
            $('ul.tabs').tabs();
        });



    }

    ngOnInit(){
        //setTimeout(() => {
            console.log('hola4554654645');
            $('ul.tabs').tabs('select_tab', 'iagree');
        //}, 5000);
        //for(let ex in this.extensions){
        //    Tabs.addTab(ex);
        //}
    }

    initAce() {
        this.editor = ace.edit("editor");
        //this.editor.setTheme("ace/theme/xcode");
        // this.editor.getSession().setMode("ace/mode/javascript");

        // Disable sintax error
        this.editor.getSession().setUseWorker(false);

        //Remove 80character vertical line
        this.editor.setShowPrintMargin(false);
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

    setUser(email: string, displayname: string, picture: string) {
        this.user = {
            email : email,
            displayName: displayname,
            picture: picture
        };
    }

    clickedEventRecievedFromTabs(e){
        console.log('Yayyyyyy tab has changed to ' + e);
        console.log(e);
    }
}
