/**
 * Created by mrivero on 27/12/2015.
 */
System.register(['angular2/core', 'angular2/http', './GoogleAPI', 'rxjs/Rx'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1, GoogleAPI_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (GoogleAPI_1_1) {
                GoogleAPI_1 = GoogleAPI_1_1;
            },
            function (_1) {}],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(http) {
                    var _this = this;
                    this.http = http;
                    this.initAce();
                    var headers = new http_1.Headers();
                    this.googleAPI = new GoogleAPI_1.MyGapi(this.http, headers);
                    this.googleAPI.authorize(function (token) {
                        console.log('fin de get file');
                        _this.googleAPI.loadDriveFile(function (data) {
                            _this.replaceEditorContent(data);
                            _this.setEditorHandlers();
                        }, function () { return console.log("Error de carga de archivo Drive."); });
                        _this.googleAPI.getUserInfo('me')
                            .then(function (user) { return _this.setUser(user.displayName, user.picture); }, function () {
                            console.log('fail');
                        });
                    }, function (err) {
                        console.log(err);
                    });
                }
                AppComponent.prototype.initAce = function () {
                    this.editor = ace.edit("editor");
                    this.editor.setTheme("ace/theme/xcode");
                    this.editor.getSession().setMode("ace/mode/javascript");
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
                    __metadata('design:paramtypes', [http_1.Http])
                ], AppComponent);
                return AppComponent;
            })();
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map