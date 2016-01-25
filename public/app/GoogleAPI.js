/**
 * Created by mrivero on 17/01/2016.
 */
System.register([], function(exports_1) {
    var MyGapi;
    return {
        setters:[],
        execute: function() {
            /// <reference path="./d/gapi.d.ts" />
            MyGapi = (function () {
                function MyGapi(http, headers) {
                    this.http = http;
                    this.headers = headers;
                    this.apiKey = "AIzaSyCoRUmlrl47ty3dMkM4nk0hUK55syJkjQw";
                    this.clientId = "63791508161-k9331fs3l9gh9iqf40en16j85mnhdlli.apps.googleusercontent.com";
                    this.scopes = [
                        'https://www.googleapis.com/auth/drive.install',
                        'https://www.googleapis.com/auth/drive',
                        'profile',
                        'email'
                    ];
                    console.log('class gapi constructor');
                    this.gapi = gapi;
                    this.gapi.client.setApiKey(this.apiKey);
                }
                MyGapi.prototype.authorize = function (success, error) {
                    var _this = this;
                    var config = {
                        'client_id': this.clientId,
                        'scope': this.scopes.join(' '),
                        'immediate': true
                    };
                    this.gapi.auth.authorize(config, function (token) {
                        _this.gapi.auth.setToken(token);
                        if (token && !token.error) {
                            success(token);
                        }
                        else {
                            config['immediate'] = false;
                            gapi.auth.authorize(config, function (token) {
                                if (token && !token.error) {
                                    console.log('Authorization completed');
                                    success(token);
                                }
                                else {
                                    console.log("Authorization error");
                                }
                            });
                        }
                    });
                };
                MyGapi.prototype.loadDriveFile = function (success, error) {
                    var _this = this;
                    var aIds = this.getUrlParameters("ids");
                    console.log('aIds');
                    console.log(aIds);
                    if (aIds === null || aIds[0] === undefined) {
                        console.log('Coudnt get file Id');
                        return;
                    }
                    this.gapi.client.load('drive', 'v2', function () {
                        var request = _this.gapi.client.drive.files.get({ 'fileId': aIds[0] });
                        request.execute(function (resp) {
                            console.log("My file: " + resp.id);
                            console.log("downloadUrl: " + resp.downloadUrl);
                            //this.headers = new Headers();
                            console.log(_this.gapi.auth.getToken());
                            _this.headers.append('Authorization', 'Bearer ' + _this.gapi.auth.getToken().access_token);
                            _this.http.get(resp.downloadUrl, { headers: _this.headers })
                                .map(function (res) { return res.text(); })
                                .subscribe(function (data) {
                                console.log('fileLoaded');
                                //console.log(data);
                                success(data);
                            }, function (err) { return console.log(err); }, function () { return console.log("File loaded successfully"); });
                        });
                    });
                };
                MyGapi.prototype.getUserInfo = function (userId) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        var user;
                        _this.gapi.client.load('plus', 'v1').then(function () {
                            var request = _this.gapi.client.plus.people.get({
                                'userId': userId
                            });
                            console.log(_this);
                            //this.headers.append('Authorization', 'Bearer ' + this.gapi.auth.getToken().access_token);
                            request.execute(function (resp) {
                                console.log('ID: ' + resp.id);
                                console.log('Display Name: ' + resp.displayName);
                                console.log('Image URL: ' + resp.image.url);
                                console.log('Profile URL: ' + resp.url);
                                console.log(_this);
                                user = {
                                    displayName: resp.displayName,
                                    picture: resp.image.url
                                };
                                //success(user);
                                resolve(user);
                            });
                        });
                    });
                };
                MyGapi.prototype.getUrlParameters = function (param) {
                    var result = null, query = window.location.search, map = {}, state, group;
                    console.log(param);
                    console.log(query);
                    if (param === null || query === '') {
                        console.log('source is empty');
                        return result;
                    }
                    var groups = query.substr(1).split("&"), i;
                    console.log(groups);
                    for (var i_1 in groups) {
                        //console.log(i);
                        //console.log(map);
                        i_1 = groups[i_1].split("=");
                        map[decodeURIComponent(i_1[0])] = decodeURIComponent(i_1[1]);
                    }
                    console.log(map);
                    state = map["state"];
                    if (state != null) {
                        result = JSON.parse(state)[param];
                    }
                    console.log(result);
                    return result;
                };
                return MyGapi;
            })();
            exports_1("MyGapi", MyGapi);
        }
    }
});
//# sourceMappingURL=GoogleAPI.js.map