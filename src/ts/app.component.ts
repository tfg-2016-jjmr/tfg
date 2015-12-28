/**
 * Created by mrivero on 27/12/2015.
 */

import {Component} from 'angular2/core'

@Component({
    selector: 'app',
    templateUrl: 'templates/aceEditor.html'
})
export class AppComponent {
    constructor () {
        setTimeout(function(){
            console.log('aqui');
            var editor = ace.edit("editor");
            editor.setTheme("ace/theme/xcode");
            editor.getSession().setMode("ace/mode/javascript");
        }, 1000)
    }
}
