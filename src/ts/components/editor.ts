/**
 * Created by mrivero on 20/02/2016.
 */
/// <reference path="../d/ace.d.ts" />

import {Component, Input, Output, OnInit, OnChanges, SimpleChange, EventEmitter} from "angular2/core";
import {GoogleService} from "../services/GoogleService";
import {LanguageService} from '../services/languageService';
import {Http, HTTP_PROVIDERS, Response, Request, Headers} from 'angular2/http';
import {ILanguage, IFormat, IOperation, IConfiguration, IAnnotations} from "../interfaces";


@Component({
    selector: 'editor',
    templateUrl: 'templates/editor.html',
    providers: [LanguageService, GoogleService]
})
export class Editor implements OnChanges {
    @Input() id: string;
    @Input() format: string;
    @Input() language: ILanguage;
    @Input() config: IConfiguration;
    @Output() fileExtension: EventEmitter<string> = new EventEmitter<string>();
    @Output() fileNameChange: EventEmitter<string> = new EventEmitter<string>();
    editor: ace;
    saveTimeout;
    fileName: string;
    selectedFormat: IFormat;
    oldFormat: IFormat;
    hasError: boolean;

    constructor(public http: Http, private _GS: GoogleService, private _languageService: LanguageService) {}

    ngOnChanges(changes: {[propName: string]: SimpleChange}) {
        if (changes['language'] && typeof changes["language"].currentValue !== 'undefined') {
            //let oldLang: ILanguage = changes["language"].previousValue;
            //let newLang: ILanguage = changes["language"].currentValue;
            this.setEditorParameters(this.language.formats[0]);
        }

        if (changes['selectedFormat'] && typeof changes["selectedFormat"].currentValue !== 'undefined') {
            this.oldFormat = changes["selectedFormat"].previousValue;
            this.convertLanguage(this.selectedFormat, this.oldFormat);
        }
        if (changes["id"] && typeof changes["id"].currentValue !== 'undefined' && changes["id"].currentValue !== "") {
            console.log('EDITOR Initialised');
            this.initAce();
            this._GS.authorize().then(
                () => {
                    console.log('yahooo en el constructor con ide: ' + this.id);
                    this._GS.loadDriveFile(this.id).then(
                        (file:Object) => {
                            console.log("THE FILE!!!");
                            console.log(file);
                            this.fileName = file.title;
                            this.fileNameChange.next(this.fileName);
                            this.fileExtension.next(file.fileExtension);
                            this._GS.getFileContent(file.downloadUrl)
                                .map(res => res.text())
                                .subscribe(
                                    (content) => {
                                        console.log('succes getting file content');
                                        this.replaceEditorContent(content);
                                        console.log(this.checkLanguage);
                                        this.checkLanguage();
                                        this.setEditorHandlers();
                                    },
                                    (err) => {
                                        console.log('error getting file content');
                                    }
                                )
                        }
                    )

                }
            );
        }
    }

    setAnnotations(annotations) {
        this.editor.getSession().setAnnotations(annotations);
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

    replaceEditorContent(newContent: string) {
        this.editor.setValue(newContent, -1);
    }

    setEditorParameters(selectedFormat: IFormat){
        console.log(this.fileExtension);
        this.selectedFormat= selectedFormat;

        if(this.selectedFormat.editorThemeId){
            console.log(this.selectedFormat.editorThemeId);
            this.editor.setTheme(this.selectedFormat.editorThemeId);
        }
        if(this.selectedFormat.editorModeId){
            console.log(selectedFormat.editorModeId);
            this.editor.getSession().setMode(this.selectedFormat.editorModeId);
        }
    }

    checkLanguage() : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._languageService.postCheckLanguage(this.config.languages[this.language.id], this.selectedFormat.format, this.editor.getValue(), this.fileName)
                .subscribe(
                    (data: IAnnotations) => {
                        console.log(data);
                        if (data.status === 'OK'){
                            console.log('No errors in this file. Yahooooo!');
                            this.hasError = false;
                        } else {
                            this.setAnnotations(data.annotations);
                            this.hasError = true;
                        }
                        resolve();
                    },
                    (err) => {
                        console.log(err);
                        reject();
                    }
                );
        });
    }


    setEditorHandlers() {
        this.editor.on('change', (content) => {
            // If after checking language there is no error we can save.
            if (!this.selectedFormat.checkLanguage)
                return;

            this.checklanguage().then(() => {
                if(!this.hasError){
                    if (this.saveTimeout !== null) {
                        clearTimeout(this.saveTimeout);
                    }

                    this.saveTimeout = setTimeout(() => {
                            this._GS.saveFileToDrive(this.id, this.editor.getValue());
                        }, 2000);
                }
            })
        });
    }

    convertLanguage(desiredFormat: IFormat, oldFormat: IFormat){
        if(!this.hasError){
            this._languageService.convertLanguage(this.config.languages[this.language.id], oldFormat.format, desiredFormat.format, this.editor.getValue(), this.fileName)
                .subscribe(
                    (res: IAnnotations) => {
                        if(status == 'OK'){
                            let content = JSON.parse(res.data);
                            console.log(content);
                            this.replaceEditorContent(content);
                        }

                    },
                    (err) => {
                        console.log(err);
                    }
                )
        }
    }
}