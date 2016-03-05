/**
 * Created by mrivero on 28/02/2016.
 */
System.register(['angular2/core', 'angular2/http'], function(exports_1) {
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
    var GoogleService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            GoogleService = (function () {
                function GoogleService(http) {
                    this.http = http;
                    this.apiKey = "AIzaSyCoRUmlrl47ty3dMkM4nk0hUK55syJkjQw";
                    this.clientId = "63791508161-k9331fs3l9gh9iqf40en16j85mnhdlli.apps.googleusercontent.com";
                    this.scopes = [
                        'https://www.googleapis.com/auth/drive.install',
                        'https://www.googleapis.com/auth/drive',
                        'profile',
                        'email'
                    ];
                    this.gapi = gapi;
                    this.gapi.client.setApiKey(this.apiKey);
                    this.headers = new http_1.Headers();
                }
                GoogleService.prototype.authorize = function () {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        var config = {
                            'client_id': _this.clientId,
                            'scope': _this.scopes.join(' '),
                            'immediate': true
                        };
                        _this.gapi.auth.authorize(config, function (token) {
                            _this.gapi.auth.setToken(token);
                            if (token && !token.error) {
                                resolve();
                            }
                            else {
                                config['immediate'] = false;
                                gapi.auth.authorize(config, function (token) {
                                    if (token && !token.error) {
                                        console.log('Authorization completed');
                                        resolve(token);
                                    }
                                    else {
                                        console.log("Authorization error");
                                        reject();
                                    }
                                });
                            }
                        });
                    });
                };
                GoogleService.prototype.loadDriveFile = function (id) {
                    var _this = this;
                    var file;
                    return new Promise(function (resolve, reject) {
                        _this.gapi.client.load('drive', 'v2', function () {
                            var request = _this.gapi.client.drive.files.get({ 'fileId': id });
                            request.execute(function (resp) {
                                _this.headers.append('Authorization', 'Bearer ' + _this.gapi.auth.getToken().access_token);
                                resolve(resp);
                            });
                        });
                    });
                };
                GoogleService.prototype.getFileContent = function (downloadUrl) {
                    return this.http.get(downloadUrl, { headers: this.headers });
                };
                GoogleService.prototype.getUserInfo = function (userId) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        var user;
                        _this.gapi.client.load('plus', 'v1').then(function () {
                            var request = _this.gapi.client.plus.people.get({
                                'userId': userId
                            });
                            request.execute(function (resp) {
                                console.log('user');
                                console.log(resp);
                                user = {
                                    email: resp.emails[0].value,
                                    displayName: resp.displayName,
                                    picture: resp.image.url
                                };
                                resolve(user);
                            });
                        });
                    });
                };
                GoogleService.prototype.saveFileToDrive = function (id, content) {
                    var request = gapi.client.request({
                        'path': '/upload/drive/v2/files/' + id,
                        'method': 'PUT',
                        'params': { 'uploadType': 'media' },
                        'headers': {
                            'Content-Type': 'text/plain'
                        },
                        'body': content
                    });
                    request.execute(function (resp) {
                        console.log('content updated');
                    });
                };
                GoogleService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], GoogleService);
                return GoogleService;
            })();
            exports_1("GoogleService", GoogleService);
        }
    }
});
//# sourceMappingURL=GoogleService.js.map