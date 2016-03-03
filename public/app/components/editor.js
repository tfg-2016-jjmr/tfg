/**
 * Created by mrivero on 20/02/2016.
 */
/// <reference path="../d/ace.d.ts" />
System.register(["angular2/core", "../services/GoogleService", '../services/languageService', 'angular2/http'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, GoogleService_1, languageService_1, http_1;
    var Editor;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (GoogleService_1_1) {
                GoogleService_1 = GoogleService_1_1;
            },
            function (languageService_1_1) {
                languageService_1 = languageService_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            Editor = (function () {
                function Editor(http, _GS, _languageService) {
                    this.http = http;
                    this._GS = _GS;
                    this._languageService = _languageService;
                    this.fileExtension = new core_1.EventEmitter();
                    this.fileNameChange = new core_1.EventEmitter();
                }
                Editor.prototype.ngOnInit = function () {
                    var _this = this;
                    //setInterval(()=>{console.log(this.format)}, 2000);
                    console.log('EDITOR Initialised');
                    this.initAce();
                    this._GS.authorize().then(function () {
                        console.log('yahooo en el constructor con ide: ' + _this.id);
                        _this._GS.loadDriveFile(_this.id).then(function (file) {
                            console.log(file);
                            _this.fileName = file.title;
                            _this.fileNameChange.next(_this.fileName);
                            _this.fileExtension.next(file.fileExtension);
                            _this._GS.getFileContent(file.downloadUrl)
                                .map(function (res) { return res.text(); })
                                .subscribe(function (content) {
                                console.log('succes getting file content');
                                _this.replaceEditorContent(content);
                                _this.checkLanguage();
                                _this.setEditorHandlers();
                            }, function (err) {
                                console.log('error getting file content');
                            });
                        });
                    });
                };
                Editor.prototype.ngOnChanges = function (changes) {
                    if (changes['language'] && typeof changes["language"].currentValue !== 'undefined') {
                        //let oldLang: ILanguage = changes["language"].previousValue;
                        //let newLang: ILanguage = changes["language"].currentValue;
                        this.setEditorParameters(this.language.formats[0]);
                    }
                };
                Editor.prototype.processLanguage = function () {
                };
                Editor.prototype.setAnnotations = function (annotations) {
                    this.editor.getSession().setAnnotations(annotations);
                };
                Editor.prototype.initAce = function () {
                    this.editor = ace.edit("editor");
                    //this.editor.setTheme("ace/theme/xcode");
                    // this.editor.getSession().setMode("ace/mode/javascript");
                    // Disable sintax error
                    this.editor.getSession().setUseWorker(false);
                    //Remove 80character vertical line
                    this.editor.setShowPrintMargin(false);
                };
                Editor.prototype.replaceEditorContent = function (newContent) {
                    this.editor.setValue(newContent, -1);
                };
                Editor.prototype.setEditorParameters = function (selectedFormat) {
                    console.log(this.fileExtension);
                    this.selectedFormat = selectedFormat;
                    if (this.selectedFormat.editorThemeId) {
                        console.log(this.selectedFormat.editorThemeId);
                        this.editor.setTheme(this.selectedFormat.editorThemeId);
                    }
                    if (this.selectedFormat.editorModeId) {
                        console.log(selectedFormat.editorModeId);
                        this.editor.getSession().setMode(this.selectedFormat.editorModeId);
                    }
                    if (this.selectedFormat.checkLanguage) {
                        console.log(this.selectedFormat);
                        console.log(this.config.languages[this.language.id]);
                        console.log(this.selectedFormat.format);
                        console.log(this.editor);
                    }
                };
                Editor.prototype.checkLanguage = function () {
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
                        .subscribe(function (data) {
                        console.log(data);
                    }, function (err) {
                        console.log(err);
                    });
                };
                Editor.prototype.setEditorHandlers = function () {
                    var _this = this;
                    this.editor.on('change', function (content) {
                        if (_this.saveTimeout !== null) {
                            clearTimeout(_this.saveTimeout);
                        }
                        _this.saveTimeout = setTimeout(function () {
                            _this._GS.saveFileToDrive(_this.id, _this.editor.getValue());
                        }, 2000);
                    });
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], Editor.prototype, "id", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], Editor.prototype, "format", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], Editor.prototype, "language", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], Editor.prototype, "config", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], Editor.prototype, "fileExtension", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], Editor.prototype, "fileNameChange", void 0);
                Editor = __decorate([
                    core_1.Component({
                        selector: 'editor',
                        templateUrl: 'templates/editor.html',
                        providers: [languageService_1.LanguageService, GoogleService_1.GoogleService]
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, GoogleService_1.GoogleService, languageService_1.LanguageService])
                ], Editor);
                return Editor;
            }());
            exports_1("Editor", Editor);
        }
    }
});
//# sourceMappingURL=editor.js.map