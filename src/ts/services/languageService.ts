import {Injectable} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';
import {Observable} from "rxjs/Observable";
import {ILanguage, IFormat, IOperation} from '../interfaces'



@Injectable()
export class LanguageService {

    constructor(public http: Http) { }

    getLanguage(languagePath: string){
        return this.http.get('/api/language' + languagePath)
            .map((res) => <ILanguage> res.json())
            // .do(data => console.log(data)) // eyeball results in the console
            .catch(this.handleError);
    }
    
    postCheckLanguage(languageId: string, format: string, content: string, fileUri: string){
        let url = '/api/checkLanguage' + languageId + "/format/" + format;
        let body = 'id='+format+'&content='+encodeURIComponent(content)+'&fileUri='+fileUri;
        let headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            headers.append('accept', 'application/json');
            //headers.append('Referer', 'https://labs.isa.us.es:8181/IDEAS/app/editor');
        let options = {
            headers: headers
        };
        console.log(body);
        return this.http.post(url, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }



    private handleError (error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        // return Observable.throw(error.json().error || 'Server error');
        return Observable.throw('Server error');
    }

}