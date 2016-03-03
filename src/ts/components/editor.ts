/**
 * Created by mrivero on 20/02/2016.
 */
/// <reference path="../d/ace.d.ts" />

import {Component, Input, Output, OnInit, OnChanges, SimpleChange, EventEmitter} from "angular2/core";
import {GoogleService} from "../services/GoogleService";
import {LanguageService} from '../services/languageService';
import {Http, HTTP_PROVIDERS, Response, Request, Headers} from 'angular2/http';
import {ILanguage, IFormat, IOperation, IConfiguration} from "../interfaces";


@Component({
    selector: 'editor',
    templateUrl: 'templates/editor.html',
    providers: [LanguageService, GoogleService]
})
export class Editor implements OnInit, OnChanges {
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

    constructor(public http: Http, private _GS: GoogleService, private _languageService: LanguageService) {}

    ngOnInit(){
        //setInterval(()=>{console.log(this.format)}, 2000);
        console.log('EDITOR Initialised');
        this.initAce();
        this._GS.authorize().then(
            () => {
                console.log('yahooo en el constructor con ide: '+ this.id);
                this._GS.loadDriveFile(this.id).then(
                    (file: Object) => {
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

    ngOnChanges(changes: {[propName: string]: SimpleChange}) {
        if (changes['language'] && typeof changes["language"].currentValue !== 'undefined') {
            //let oldLang: ILanguage = changes["language"].previousValue;
            //let newLang: ILanguage = changes["language"].currentValue;
            this.setEditorParameters(this.language.formats[0]);
        }
    }

    processLanguage() {

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

        if(this.selectedFormat.checkLanguage){
            console.log(this.selectedFormat);
            console.log(this.config.languages[this.language.id]);
            console.log(this.selectedFormat.format);
            console.log(this.editor);
            //console.log(this.editor.getSession().getValue());

            //this.http.get('/api/checkLanguage' + this.config.languages[this.language.id] + "/format/" + this.selectedFormat.format)
            //    .map(res => res.json())
        }
    }

    checkLanguage(){
        console.log('inside checkLanguage');
        // let url = 'https://labs.isa.us.es:8181'+ this.config.languages[this.language.id] + '/language/format/'+this.selectedFormat.format+"/checkLanguage";
        // var headers = new Headers();
        //     headers.append('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
        //     headers.append('Host', 'labs.isa.us.es:8181');
        //     //headers.append('Cookie','_ga=GA1.2.1232218510.1442432386');
        // let body = 'id='+this.selectedFormat.format+'&content='+encodeURIComponent(this.editor.getValue())+'&fileUri=';
        // let options = {
        //     headers: headers,
        //     rejectUnauthorized: false
        // };

        // console.log(url);
        // this.http.post(url, body, options )
        //     .subscribe(
        //         (data) => {
        //             console.log(data);
        //         },
        //         (err) => {
        //             console.log(err);
        //         }
        //     );

        this._languageService.postCheckLanguage(this.config.languages[this.language.id], this.selectedFormat.format, this.editor.getValue(), this.fileName)
           .subscribe(
               (data) => {
                   console.log(data);
               },
               (err) => {
                   console.log(err);
               }
           );

    }


    setEditorHandlers() {
        this.editor.on('change', (content) => {
            if (this.saveTimeout !== null) {
                clearTimeout(this.saveTimeout);
            }

            this.saveTimeout = setTimeout(
                () => {
                    this._GS.saveFileToDrive(this.id, this.editor.getValue());
                }
                , 2000);
        });
    }
}