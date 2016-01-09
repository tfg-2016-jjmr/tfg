/**
 * Created by mrivero on 27/12/2015.
 */
System.register(['angular2/core', 'angular2/http', 'rxjs/Rx'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, http_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {}],
        execute: function() {
            //import {Http, Response, HTTP_PROVIDERS, Request, RequestMethod } from 'angular2/http';
            AppComponent = (function () {
                //user =  {
                //    name:{
                //        first: "Miguel",
                //        last: "Rivero"
                //    },
                //    picture: {
                //        thumbnail: '/images/rrr.png'
                //    }
                //};
                function AppComponent(http) {
                    this.http = http;
                    this.getUser();
                    console.log('aqui');
                    var editor = ace.edit("editor");
                    editor.setTheme("ace/theme/xcode");
                    editor.getSession().setMode("ace/mode/javascript");
                }
                AppComponent.prototype.getUser = function () {
                    var _this = this;
                    this.http.get('https://randomuser.me/api/')
                        .map(function (res) { return res.json(); })
                        .subscribe(function (data) {
                        //var newUser = data.json().results[0];
                        var newUser = data.results[0]['user'];
                        _this.user = {
                            name: {
                                first: newUser.name.first[0].substring(0, 1).toUpperCase() + newUser.name.first.substring(1),
                                last: newUser.name.last[0].substring(0, 1).toUpperCase() + newUser.name.last.substring(1)
                            },
                            picture: newUser.picture.thumbnail
                        };
                    }, function (err) { return console.log(err); }, function () { return console.log("Get user completed"); });
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'app',
                        templateUrl: 'templates/aceEditor.html',
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