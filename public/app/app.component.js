/**
 * Created by mrivero on 27/12/2015.
 */
System.register(['angular2/core', 'angular2/http', 'rxjs/Rx', './GoogleAPI'], function(exports_1) {
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
            function (_1) {},
            function (GoogleAPI_1_1) {
                GoogleAPI_1 = GoogleAPI_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(http) {
                    var _this = this;
                    this.http = http;
                    this.initAce();
                    var headers = new http_1.Headers();
                    var googleAPI = new GoogleAPI_1.MyGapi(this.http, headers);
                    googleAPI.authorize(function (token) {
                        console.log('fin de get file');
                        googleAPI.loadDriveFile(function (data) { return _this.replaceEditorContent(data); }, function () { return console.log("Error de carga de archivo Drive."); });
                        googleAPI.getUserInfo('me')
                            .then(function (user) { return _this.setUser(user); }, function () {
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
                AppComponent.prototype.replaceEditorContent = function (newContent) {
                    this.editor.setValue(newContent, -1);
                };
                //getRandomUser(){
                //    this.http.get('https://randomuser.me/api/')
                //        .map(res => res.json())
                //        .subscribe(
                //            data => {
                //                //var newUser = data.json().results[0];
                //                var newUser = data.results[0]['user'];
                //                this.user = {
                //                    displayName: newUser.name.first[0].substring(0, 1).toUpperCase() +  newUser.name.first.substring(1) + " " +newUser.name.last[0].substring(0, 1).toUpperCase() +  newUser.name.last.substring(1),
                //                    picture: newUser.picture.thumbnail
                //                }
                //            },
                //            err => console.log(err),
                //            () => console.log("Get user completed")
                //        );
                //};
                AppComponent.prototype.setUser = function (user) {
                    this.user = user;
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
//function getUrlParameters(param) {
//    var result = null;
//    if (param != null) {
//        var source = window.location.search,
//            map = {};
//        if ("" != source) {
//            var groups = source.substr(1).split("&"), i;
//
//            for (i in groups) {
//                i = groups[i].split("=");
//                map[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
//            }
//        }
//
//        var state = map["state"];
//        if (state != null) {
//            result = JSON.parse(state)[param];
//        }
//        console.log(result);
//    }
//    return result;
//}
//# sourceMappingURL=app.component.js.map