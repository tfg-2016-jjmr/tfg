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
    var LanguageService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            LanguageService = (function () {
                function LanguageService(baserURL, http) {
                    this.baserURL = baserURL;
                    this.http = http;
                }
                LanguageService.prototype.getLanguage = function (languageId) {
                    return this.http.get(this.baserURL + languageId)
                        .map(function (res) { return res.json(); });
                };
                LanguageService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [String, http_1.Http])
                ], LanguageService);
                return LanguageService;
            })();
            exports_1("LanguageService", LanguageService);
        }
    }
});
//# sourceMappingURL=languageService.js.map