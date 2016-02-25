/**
 * Created by mrivero on 20/02/2016.
 */
import {Component, Input, OnInit} from "angular2/core";

@Component({
    selector: 'editor',
    templateUrl: 'templates/editor.html'

})
export class Editor implements OnInit{
    @Input() id: string;
    @Input() format:string;

    ngOnInit(){
        setInterval(()=>{console.log(this.format)}, 2000)
        console.log('EDITOR Initialised');
    }

}