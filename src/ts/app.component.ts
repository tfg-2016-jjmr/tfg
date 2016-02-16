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
	    
        this.languages = {};
         
        this.http.get('/api/configuration')
            .map(res => res.json())
            .subscribe(
            (data) => {
                console.log(data);
                this.configuration = data;

                $.each(this.configuration.languages, (languageId, languagePath) => {
                    this._languageService.getLanguage(languagePath)
                        .subscribe(
                        (lang: ILanguage) => {
                            console.log(lang);
                            this.languages[lang.extension] = lang;
                            console.log(this.languages)
                        },
                        (err) => {
                            console.log(err);
                        });
                });
            },
            (err) => {
                console.log(err);
            });

        console.log(this.languages);

        this.initAce();
        let headers = new Headers();
        this.googleAPI = new MyGapi(this.http, headers);
        this.googleAPI.authorize(
            (token) => {
                console.log('fin de get file');
                this.googleAPI.loadDriveFile(
                    (file) => {
                        // console.log(file);
                        this.fileName = file.originalFilename;
                        this.fileExtension = file.fileExtension;
                        this.replaceEditorContent(file.content);
                        this.setEditorHandlers();
                        this.setEditorParameters();
                    },
                    () => console.log("Error de carga de archivo Drive.")
                );
                this.googleAPI.getUserInfo('me')
                    .then(
                    (user: User) => this.setUser(user.displayName, user.picture),
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
    }

    initAce() {
        this.editor = ace.edit("editor");
        this.editor.setTheme("ace/theme/xcode");
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
        let selectedFormat= this.languages[this.fileExtension].formats[0];

        if(selectedFormat.editorThemeId)
            this.editor.setTheme(selectedFormat.editorThemeId);
        if(selectedFormat.editorModeId)
            this.editor.getSession().setMode(selectedFormat.editorModeId);
    }

    setUser(displayname: string, picture: string) {
        this.user = {
            displayName: displayname,
            picture: picture
        };
    }
}
