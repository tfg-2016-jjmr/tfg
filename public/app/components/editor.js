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
                    this.ignoreChangeAceEvent = false;
                }
                Editor.prototype.ngOnChanges = function (changes) {
                    var _this = this;
                    if (changes['language'] && typeof changes["language"].currentValue !== 'undefined') {
                        this.setEditorParameters(this.language.formats[0]);
                    }
                    if (changes['selectedFormat']) {
                        console.trace();
                    }
                    if (changes['format']) {
                        if (Object.keys(changes['format'].previousValue).length > 0 && Object.keys(changes['format'].currentValue).length > 0
                            || (changes['format'].currentValue != "" && changes['format'].previousValue != "")) {
                            if (this.language != undefined) {
                                this.oldFormat = this.getFormatFromId(changes["format"].previousValue);
                                this.selectedFormat = this.getFormatFromId(changes["format"].currentValue);
                                if (this.selectedFormat.checkLanguage) {
                                    this.convertLanguage(this.selectedFormat.format, this.oldFormat.format);
                                    this.checkEditorLanguage();
                                }
                                else {
                                    this.convertLanguage(this.selectedFormat.format, this.oldFormat.format);
                                }
                            }
                        }
                    }
                    if (changes["id"] && typeof changes["id"].currentValue !== 'undefined' && changes["id"].currentValue !== "") {
                        this.initAce();
                        this._GS.authorize().then(function () {
                            _this._GS.loadDriveFile(_this.id).then(function (file) {
                                _this.fileName = file.title;
                                _this.fileNameChange.next(_this.fileName);
                                _this.fileExtension.next(file.fileExtension);
                                _this._GS.getFileContent(file.downloadUrl)
                                    .map(function (res) { return res.text(); })
                                    .subscribe(function (content) {
                                    _this.replaceEditorContent(content);
                                    _this.checkEditorLanguage();
                                    _this.setEditorHandlers();
                                }, function (err) {
                                    console.error('error getting file content');
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
                    this.ignoreChangeAceEvent = true;
                    this.editor.setValue(newContent, -1);
                    if (this.selectedFormat.checkLanguage) {
                        this.checkEditorLanguage();
                    }
                    this.ignoreChangeAceEvent = false;
                };
                Editor.prototype.setEditorParameters = function (selectedFormat) {
                    this.selectedFormat = selectedFormat;
                    if (this.selectedFormat.editorThemeId) {
                        this.editor.setTheme(this.selectedFormat.editorThemeId);
                    }
                    if (this.selectedFormat.editorModeId) {
                        this.editor.getSession().setMode(this.selectedFormat.editorModeId);
                    }
                };
                Editor.prototype.checkEditorLanguage = function () {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this._languageService.postCheckLanguage(_this.config.languages[_this.language.id], _this.selectedFormat.format, _this.editor.getValue(), _this.fileName)
                            .subscribe(function (data) {
                            _this.setAnnotations(data.annotations);
                            if (data.status === 'OK') {
                                _this.hasError = false;
                            }
                            else {
                                _this.hasError = true;
                            }
                            resolve();
                        }, function (err) {
                            console.error(err);
                            reject();
                        });
                    });
                };
                Editor.prototype.setEditorHandlers = function () {
                    var _this = this;
                    this.editor.on('change', function (content) {
                        if (!_this.ignoreChangeAceEvent) {
                            if (_this.selectedFormat.checkLanguage) {
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
                            }
                            else {
                            }
                        }
                    });
                };
                Editor.prototype.convertLanguage = function (desiredFormat, oldFormat) {
                    var _this = this;
                    var langId = this.config.languages[this.language.id], content = this.editor.getValue();
                    if (!this.hasError /*&& content !== null && content !== ""*/) {
                        this._languageService.convertLanguage(langId, oldFormat, desiredFormat, content, this.fileName)
                            .subscribe(function (res) {
                            if (res.status == 'OK') {
                                var content_1 = res.data;
                                _this.replaceEditorContent(content_1);
                            }
                        }, function (err) {
                            console.error(err);
                        });
                    }
                    else {
                        console.log('Default format has errors!');
                    }
                };
                Editor.prototype.getFormatFromId = function (formatId) {
                    var fmt;
                    for (var _i = 0, _a = this.language.formats; _i < _a.length; _i++) {
                        var f = _a[_i];
                        if (f.format === formatId) {
                            fmt = f;
                            break;
                        }
                    }
                    return fmt;
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