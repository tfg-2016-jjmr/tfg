/**
 * Created by mrivero on 27/12/2015.
 */

/// <reference path="./d/ace.d.ts" />
/// <reference path="./d/gapi.d.ts" />
/// <reference path="./d/jquery.d.ts" />

import {Component, View, OnInit} from 'angular2/core';
import {Http, HTTP_PROVIDERS, Response, Request, Headers} from 'angular2/http';
import {LanguageService} from './services/languageService';
import {GoogleService} from './services/GoogleService';
import 'rxjs/Rx';
import { IConfiguration, ILanguage, IFormat, IOperation, IUser} from './interfaces';
import {Tabs} from './components/tabs';
import {Editor} from './components/editor';



@Component({
    selector: 'app',
    templateUrl: 'templates/app.html',
    directives: [Tabs, Editor],
    providers: [GoogleService]
})
export class AppComponent implements OnInit{
    user: IUser;
    editor: any;
    fileName: string  = 'Governify';
    fileId: string;
    fileExtension: string;
    fileContent: string;
    loaded: boolean = false;
    configuration: IConfiguration;
    languages: { [key:string]: ILanguage };
    selectedFormat: string = '';
    extensions: string[] = [''];
    languageSettings: ILanguage;

    constructor(public http: Http, private _languageService: LanguageService, private _GS: GoogleService) {
        $('body').removeClass('unresolved');

        this.languages = {};

        let getConfigLang =  new Promise ((resolve, reject) => {
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
                                    (lang: ILanguage) => {
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

                    // aLenguagesDeferred.push((() => {
                    //     let d = new Promise((resolve, reject) => {
                    //         this._GS.authorize().then(
                    //             (token) => {
                    //                 console.log('authorized to get user');
                    //                 this._GS.getUserInfo('me')
                    //                     .then(
                    //                     (user: IUser) => {
                    //                         console.log('user returned');
                    //                         console.log(user);

                    //                         // this.setUser(user.email, user.displayName, user.picture)
                    //                         resolve();
                    //                     },
                    //                     () => {
                    //                         console.log('fail loading ')
                    //                         reject()
                    //                     }
                    //                     );

                    //                 // this.loaded = true;
                    //             },
                    //             (err) => {
                    //                 console.log(err);
                    //                 // this.loaded = true;
                    //             }
                    //         )
                    //         return d;
                    //     })
                    // })());


                        Promise.all(aLenguagesDeferred).then(() => resolve(), ()=> reject());
                    },
                    (err) => {
                        console.log(err);
                    })
        });

        //let loadUser = null;
        let loadUser = new Promise((resolve, reject) => {
            this._GS.authorize().then(
                (token) => {
                    console.log('authorized to get user');
                    this._GS.getUserInfo('me')
                        .then(
                            (user:IUser) => {
                                console.log('user returned');
                                console.log(user);
                                this.setUser(user.email, user.displayName, user.picture)
                                resolve();
                            },
                            () => {
                                console.log('fail loading ');
                                reject()
                            }
                        );

                    // this.loaded = true;
                },
                (err) => {
                    console.log(err);
                    reject();
                    // this.loaded = true;
                });
        });

        //Promise.all([loadContent, getConfigLang]).then(() => {
        Promise.all([
            getConfigLang,
            loadUser
        ]).then(() => {
            console.log("todo listo, calisto");
            console.log(this.languages);
            console.log(this.fileExtension);
            this.fileId = this.getUrlParameters('ids');
            console.log(this.fileId);


            console.log(this.extensions);
            //    this.initAce();
            //this.replaceEditorContent(this.fileContent);
            //this.setEditorHandlers();
            //this.setEditorParameters();
        });

    }

    ngOnInit(){
        //setTimeout(() => {
        //    $('ul.tabs').tabs();
            console.log('hola4554654645');
            //$('ul.tabs').tabs('select_tab', 'iagree');
        //}, 5000);
        //for(let ex in this.extensions){
        //    Tabs.addTab(ex);
        //}
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


    setUser(email: string, displayname: string, picture: string) {
        this.user = {
            email : email,
            displayName: displayname,
            picture: picture
        };
    }

    setSelectedFormat(e){
        console.log('Yayyyyyy tab has changed to ' + e);
        console.log(e);
    }

    extensionSelectedEvent(ext: string) {
        this.languageSettings = this.languages[ext];
        console.log(ext);
        console.log(this.languageSettings);
        let formats = this.languageSettings.formats;
        this.extensions = [];
        for(let f of formats){
            console.log(f.format);
            this.extensions.push(f.format);
        }
        this.selectedFormat = ext;
        $('ul.tabs').tabs();
        $('ul.tabs').tabs('select_tab', formats[0].format);
        setTimeout(() => $(window).trigger('resize'), 100);
    }

    fileNameChangedEvent(fileName: string) {
        console.log(fileName);
        this.fileName = fileName;
        this.loaded = true;
    }
}
