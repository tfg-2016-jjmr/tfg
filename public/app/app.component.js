/**
 * Created by mrivero on 27/12/2015.
 */
System.register(['angular2/core', 'angular2/http', './language.service', './GoogleAPI', 'rxjs/Rx'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, language_service_1, GoogleAPI_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (language_service_1_1) {
                language_service_1 = language_service_1_1;
            },
            function (GoogleAPI_1_1) {
                GoogleAPI_1 = GoogleAPI_1_1;
            },
            function (_1) {}],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(http, _languageService) {
                    var _this = this;
                    this.http = http;
                    this._languageService = _languageService;
                    this.loaded = false;
                    $('body').removeClass('unresolved');
                    var languagesDef = $.Deferred(), aLanDef = [];
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
                        new Promise(function (resolve, reject) {
                            _this.http.get('/api/configuration')
                                .map(function (res) { return res.json(); })
                                .subscribe(function (data) {
                                _this.configuration = data;
                                var listo = [];
                                $.each(_this.configuration.languages, function (languageId, languagePath) {
                                    listo.push((function () {
                                        var d = new Promise(function (resolve, reject) {
                                            _this._languageService.getLanguage(languagePath)
                                                .subscribe(function (lang) {
                                                _this.languages[lang.extension] = lang;
                                                resolve();
                                            }, function (err) {
                                                console.log(err);
                                                reject();
                                            });
                                        });
                                        return d;
                                    })());
                                });
                                Promise.all(listo).then(function () { return resolve(); }, function () { return reject(); });
                            }, function (err) {
                                console.log(err);
                            });
                        }),
                        new Promise(function (resolve, reject) {
                            var headers = new http_1.Headers();
                            _this.googleAPI = new GoogleAPI_1.MyGapi(_this.http, headers);
                            _this.googleAPI.authorize(function (token) {
                                _this.googleAPI.loadDriveFile(function (file) {
                                    console.log("FILE");
                                    console.log(file);
                                    _this.fileName = file.originalFilename;
                                    _this.fileExtension = file.fileExtension;
                                    _this.replaceEditorContent(file.content);
                                    resolve();
                                }, function () { return console.log("Error de carga de archivo Drive."); });
                                _this.googleAPI.getUserInfo('me')
                                    .then(function (user) { return _this.setUser(user.displayName, user.picture); }, function () {
                                    console.log('fail loading ');
                                });
                                _this.loaded = true;
                            }, function (err) {
                                console.log(err);
                                _this.loaded = true;
                            });
                        })
                    ]).then(function () {
                        console.log("todo listo, calisto");
                        console.log(_this.languages);
                        _this.setEditorHandlers();
                        _this.setEditorParameters();
                    });
                }
                AppComponent.prototype.initAce = function () {
                    this.editor = ace.edit("editor");
                    //this.editor.setTheme("ace/theme/xcode");
                    // this.editor.getSession().setMode("ace/mode/javascript");
                    // Disable sintax error
                    this.editor.getSession().setUseWorker(false);
                };
                AppComponent.prototype.setEditorHandlers = function () {
                    var _this = this;
                    this.editor.on('change', function (content) {
                        if (_this.saveTimeout !== null) {
                            clearTimeout(_this.saveTimeout);
                        }
                        _this.saveTimeout = setTimeout(function (content) {
                            _this.saveFileToDrive(_this.editor.getValue());
                        }, 2000);
                    });
                };
                AppComponent.prototype.saveFileToDrive = function (content) {
                    console.log('save file');
                    this.googleAPI.saveFileToDrive(content);
                };
                AppComponent.prototype.replaceEditorContent = function (newContent) {
                    this.editor.setValue(newContent, -1);
                };
                AppComponent.prototype.setEditorParameters = function () {
                    console.log(this.fileExtension);
                    var selectedFormat = this.languages[this.fileExtension].formats[0];
                    if (selectedFormat.editorThemeId) {
                        console.log(selectedFormat.editorThemeId);
                        this.editor.setTheme(selectedFormat.editorThemeId);
                    }
                    if (selectedFormat.editorModeId) {
                        console.log(selectedFormat.editorModeId);
                        this.editor.getSession().setMode(selectedFormat.editorModeId);
                    }
                };
                AppComponent.prototype.setUser = function (displayname, picture) {
                    this.user = {
                        displayName: displayname,
                        picture: picture
                    };
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'app',
                        templateUrl: 'templates/app.html',
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, language_service_1.LanguageService])
                ], AppComponent);
                return AppComponent;
            })();
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map