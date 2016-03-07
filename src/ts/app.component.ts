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
    /**
     * The logged user's information. Contains the user's avatar and contact info.
     * @type {IUser}
     */
    user: IUser;
    /**
     * Instance of the ACE editor.
     */
    editor: any;
    /**
     * The app title that will hold the file name.
     * @type {string}
     */
    fileName: string  = 'Governify';
    /**
     * File id that comes from the URL parameter. It's used on the [Editor] component for retrieving
     * the file's content.
     * @type {string}
     */
    fileId: string;
    /**
     * The loading file's extension. This attribute is received from the [Editor] component and
     * it's used for loading the [extensions] tabs.
     * @type {string}
     */
    fileExtension: string;
    fileContent: string;
    /**
     * True when the application has loaded all the initial components.
     * @type {boolean}
     */
    loaded: boolean = false;
    /**
     * Initial app configuration containing the manifests of all the [languages].
     * @type {IConfiguration}
     */
    configuration: IConfiguration;
    /**
     * Languages contained on [configuration]. It's a map which keys are file's extensions.
     * @type {Map<string, ILanguage>}
     */
    languages: { [key:string]: ILanguage };
    /**
     * Define the selected tab from [Tabs] web component.
     * @type {string}
     */
    selectedFormat: string = '';
    /**
     * Different extensions on the [languageSettings] used on [Tabs] to create every tab.
     * @type {string[]}
     */
    extensions: string[] = [''];
    /**
     * Language of the loaded file retrieved from [languages].
     * @type {ILanguage}
     */
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

                    Promise.all(aLenguagesDeferred).then(() => resolve(), ()=> reject());
                },
                (err) => {
                    console.log(err);
                })
        });

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
                },
                (err) => {
                    console.log(err);
                    reject();
                });
        });

        Promise.all([
            getConfigLang,
            loadUser
        ]).then(() => {
            this.fileId = this.getUrlParameters('ids');
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


    setUser(email: string, displayname: string, picture: string) {
        this.user = {
            email : email,
            displayName: displayname,
            picture: picture
        };
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
        this.selectedFormat = this.extensions[0];
        $('ul.tabs').tabs();
        //$('ul.tabs').tabs('select_tab', formats[0].format);
        setTimeout(() => $(window).trigger('resize'), 100);
    }

    fileNameChangedEvent(fileName: string) {
        console.log(fileName);
        this.fileName = fileName;
        this.loaded = true;
    }

    changeSelectedFormatEvent( formatId: string) : void {
        for(let f of this.languageSettings.formats) {
            if(f.format === formatId) {
                console.log(this.languageSettings);
                this.selectedFormat = f.format;
                break;
            }
        }

    }
}
