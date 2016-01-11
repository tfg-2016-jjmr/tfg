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
    var apiKey, clientId, scopes, AppComponent;
    function handleAuthResult(authResult) {
        console.log("ASDASD");
        if (authResult && !authResult.error) {
            getPlusInfo("me");
            loadDriveApi();
        }
        else {
            var config = {
                'client_id': clientId,
                'scope': scopes.join(' ')
            };
            console.log("ASDASD => " + config);
            gapi.auth.authorize(config, function () {
                console.log('login complete');
                console.log(gapi.auth.getToken());
                getPlusInfo("me");
                loadDriveApi();
            });
        }
    }
    function getPlusInfo(userId) {
        gapi.client.load('plus', 'v1').then(function () {
            var request = gapi.client.plus.people.get({
                'userId': userId
            });
            request.execute(function (resp) {
                console.log('ID: ' + resp.id);
                console.log('Display Name: ' + resp.displayName);
                console.log('Image URL: ' + resp.image.url);
                console.log('Profile URL: ' + resp.url);
            });
        });
    }
    function loadDriveApi() {
        gapi.client.load('drive', 'v2', listFiles);
    }
    /**
     * Print files.
     */
    function listFiles() {
        var request = gapi.client.drive.files.list({
            'maxResults': 10
        });
        request.execute(function (resp) {
            console.log('Files:');
            var files = resp.items;
            if (files && files.length > 0) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    console.log(file.title + ' (' + file.id + ')');
                }
            }
            else {
                console.log('No files found.');
            }
        });
    }
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
            apiKey = "AIzaSyCoRUmlrl47ty3dMkM4nk0hUK55syJkjQw";
            clientId = "63791508161-k9331fs3l9gh9iqf40en16j85mnhdlli.apps.googleusercontent.com";
            scopes = [
                'https://www.googleapis.com/auth/drive.metadata.readonly',
                'https://www.googleapis.com/auth/plus.login',
                'https://www.googleapis.com/auth/userinfo.email'
            ];
            AppComponent = (function () {
                function AppComponent(http) {
                    this.http = http;
                    this.getUser();
                    console.log('aqui');
                    var editor = ace.edit("editor");
                    editor.setTheme("ace/theme/xcode");
                    editor.getSession().setMode("ace/mode/javascript");
                    /**
                     * GAPI
                     */
                    console.log('googleOnLoadCallback called');
                    gapi.client.setApiKey(apiKey);
                    window.setTimeout(this.checkAuth, 1);
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
                AppComponent.prototype.checkAuth = function () {
                    gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: true }, handleAuthResult);
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