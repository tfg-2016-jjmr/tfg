import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable} from "rxjs/Observable";
import {ILanguage, IFormat, IOperation} from './interfaces'



@Injectable()
export class LanguageService {
    private _baserURL: string= 'https://labs.isa.us.es:8181';

    constructor(public http: Http) { }

    getLanguage(languagePath: string){
        return this.http.get('/api/language' + languagePath)
            .map((res) => <ILanguage> res.json())
            // .do(data => console.log(data)) // eyeball results in the console
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