/**
 * Created by mrivero on 20/02/2016.
 */
/// <reference path="../d/ace.d.ts" />
System.register(["angular2/core", "../services/GoogleService", '../services/languageService', 'angular2/http'], function(exports_1) {
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
                Editor.prototype.ngOnChanges = function (changes) {
                    var _this = this;
                    if (changes['language'] && typeof changes["language"].currentValue !== 'undefined') {
                        //let oldLang: ILanguage = changes["language"].previousValue;
                        //let newLang: ILanguage = changes["language"].currentValue;
                        this.setEditorParameters(this.language.formats[0]);
                    }
                    if (changes['format']) {
                        if (Object.keys(changes['format'].previousValue).length > 0 && Object.keys(changes['format'].currentValue).length > 0
                            || (changes['format'].currentValue != "" && changes['format'].previousValue != "")) {
                            console.log('changed format');
                            console.log(changes["format"].previousValue);
                            console.log(typeof changes["format"].previousValue);
                            console.log(changes["format"].currentValue);
                            console.log(typeof changes["format"].currentValue);
                            this.oldFormat = changes["format"].previousValue;
                            console.log(this.oldFormat);
                            console.log(this.format);
                            if (this.config != undefined)
                                this.convertLanguage(this.format, this.oldFormat);
                        }
                    }
                    if (changes["id"] && typeof changes["id"].currentValue !== 'undefined' && changes["id"].currentValue !== "") {
                        console.log('EDITOR Initialised');
                        this.initAce();
                        this._GS.authorize().then(function () {
                            console.log('yahooo en el constructor con ide: ' + _this.id);
                            _this._GS.loadDriveFile(_this.id).then(function (file) {
                                console.log("THE FILE!!!");
                                console.log(file);
                                _this.fileName = file.title;
                                _this.fileNameChange.next(_this.fileName);
                                _this.fileExtension.next(file.fileExtension);
                                _this._GS.getFileContent(file.downloadUrl)
                                    .map(function (res) { return res.text(); })
                                    .subscribe(function (content) {
                                    console.log('succes getting file content');
                                    _this.replaceEditorContent(content);
                                    console.log(_this.checkEditorLanguage);
                                    _this.checkEditorLanguage();
                                    _this.setEditorHandlers();
                                }, function (err) {
                                    console.log('error getting file content');
                                });
                            });
                        });
                    }
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
                };
                Editor.prototype.checkEditorLanguage = function () {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this._languageService.postCheckLanguage(_this.config.languages[_this.language.id], _this.selectedFormat.format, _this.editor.getValue(), _this.fileName)
                            .subscribe(function (data) {
                            console.log(data);
                            if (data.status === 'OK') {
                                console.log('No errors in this file. Yahooooo!');
                                _this.hasError = false;
                            }
                            else {
                                _this.setAnnotations(data.annotations);
                                _this.hasError = true;
                            }
                            resolve();
                        }, function (err) {
                            console.log(err);
                            reject();
                        });
                    });
                };
                Editor.prototype.setEditorHandlers = function () {
                    var _this = this;
                    this.editor.on('change', function (content) {
                        // If after checking language there is no error we can save.
                        if (!_this.selectedFormat.checkLanguage)
                            return;
                        _this.checkEditorLanguage().then(function () {
                            if (!_this.hasError) {
                                if (_this.saveTimeout !== null) {
                                    clearTimeout(_this.saveTimeout);
                                }
                                _this.saveTimeout = setTimeout(function () {
                                    _this._GS.saveFileToDrive(_this.id, _this.editor.getValue());
                                }, 2000);
                            }
                        });
                    });
                };
                Editor.prototype.convertLanguage = function (desiredFormat, oldFormat) {
                    var _this = this;
                    console.log('++++++++++++++++++++++++++++++++ in convert language');
                    //console.log(oldFormat);
                    //console.log(desiredFormat);
                    var langId = this.config.languages[this.language.id], content = this.editor.getValue();
                    console.log(langId);
                    console.log(content);
                    if (!this.hasError /*&& content !== null && content !== ""*/) {
                        console.log(this.config);
                        this._languageService.convertLanguage(langId, oldFormat, desiredFormat, content, this.fileName)
                            .subscribe(function (res) {
                            if (status == 'OK') {
                                var content_1 = JSON.parse(res.data);
                                console.log(content_1);
                                _this.replaceEditorContent(content_1);
                            }
                        }, function (err) {
                            console.log(err);
                        });
                    }
                    else {
                        console.log('Default format has errors!');
                    }
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
            })();
            exports_1("Editor", Editor);
        }
    }
});
//# sourceMappingURL=editor.js.map