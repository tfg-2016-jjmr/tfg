/**
 * Created by mrivero on 27/12/2015.
 */
System.register(['angular2/core', 'angular2/http', './services/languageService', './services/GoogleService', 'rxjs/Rx', './components/tabs', './components/editor'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, languageService_1, GoogleService_1, tabs_1, editor_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (languageService_1_1) {
                languageService_1 = languageService_1_1;
            },
            function (GoogleService_1_1) {
                GoogleService_1 = GoogleService_1_1;
            },
            function (_1) {},
            function (tabs_1_1) {
                tabs_1 = tabs_1_1;
            },
            function (editor_1_1) {
                editor_1 = editor_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(http, _languageService, _GS) {
                    var _this = this;
                    this.http = http;
                    this._languageService = _languageService;
                    this._GS = _GS;
                    this.fileName = 'Governify';
                    this.fileId = '';
                    this.loaded = false;
                    this.selectedFormat = '';
                    this.extensions = [''];
                    $('body').removeClass('unresolved');
                    this.languages = {};
                    var getConfigLang = new Promise(function (resolve, reject) {
                        _this.http.get('/api/configuration')
                            .map(function (res) { return res.json(); })
                            .subscribe(function (data) {
                            _this.configuration = data;
                            var aLenguagesDeferred = [];
                            $.each(_this.configuration.languages, function (languageId, languagePath) {
                                aLenguagesDeferred.push((function () {
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
                            Promise.all(aLenguagesDeferred).then(function () { return resolve(); }, function () { return reject(); });
                        }, function (err) {
                            console.log(err);
                        });
                    });
                    //Promise.all([loadContent, getConfigLang]).then(() => {
                    Promise.all([getConfigLang]).then(function () {
                        console.log("todo listo, calisto");
                        console.log(_this.languages);
                        console.log(_this.fileExtension);
                        _this.fileId = _this.getUrlParameters('ids');
                        console.log(_this.fileId);
                        console.log(_this.extensions);
                        //    this.initAce();
                        //this.replaceEditorContent(this.fileContent);
                        //this.setEditorHandlers();
                        //this.setEditorParameters();
                    });
                }
                AppComponent.prototype.ngOnInit = function () {
                    //setTimeout(() => {
                    //    $('ul.tabs').tabs();
                    console.log('hola4554654645');
                    //$('ul.tabs').tabs('select_tab', 'iagree');
                    //}, 5000);
                    //for(let ex in this.extensions){
                    //    Tabs.addTab(ex);
                    //}
                };
                AppComponent.prototype.getUrlParameters = function (param) {
                    var result = null, query = window.location.search, map = {}, state;
                    console.log("param: " + param);
                    console.log('query: ' + query);
                    if (param === null || query === '') {
                        console.log('source is empty');
                        return result;
                    }
                    var groups = query.substr(1).split("&");
                    console.log(groups);
                    for (var i in groups) {
                        i = groups[i].split("=");
                        map[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
                    }
                    if (map != null) {
                        var value = map[param];
                        try {
                            result = JSON.parse(value);
                        }
                        catch (e) {
                            result = value;
                        }
                    }
                    console.log(result);
                    return result;
                };
                AppComponent.prototype.setUser = function (email, displayname, picture) {
                    this.user = {
                        email: email,
                        displayName: displayname,
                        picture: picture
                    };
                };
                AppComponent.prototype.setSelectedFormat = function (e) {
                    console.log('Yayyyyyy tab has changed to ' + e);
                    console.log(e);
                };
                AppComponent.prototype.extensionSelectedEvent = function (ext) {
                    console.log(ext);
                    this.languageSettings = this.languages[ext];
                    var formats = this.languageSettings.formats;
                    this.extensions = [];
                    for (var _i = 0; _i < formats.length; _i++) {
                        var f = formats[_i];
                        console.log(f.format);
                        this.extensions.push(f.format);
                    }
                    $('ul.tabs').tabs();
                    $('ul.tabs').tabs('select_tab', formats[0].format);
                };
                AppComponent.prototype.fileNameChangedEvent = function (fileName) {
                    console.log(fileName);
                    this.fileName = fileName;
                    this.loaded = true;
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'app',
                        templateUrl: 'templates/app.html',
                        directives: [tabs_1.Tabs, editor_1.Editor],
                        providers: [GoogleService_1.GoogleService]
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, languageService_1.LanguageService, GoogleService_1.GoogleService])
                ], AppComponent);
                return AppComponent;
            })();
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map