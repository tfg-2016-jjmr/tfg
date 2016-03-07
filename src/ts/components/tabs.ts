/**
 * Created by mrivero on 20/02/2016.
 */
import {Component, Input, Output, SimpleChange, EventEmitter} from "angular2/core";

@Component({
    selector: 'tabs',
    templateUrl: 'templates/tabs.html',
})
export class Tabs {
    @Input() tabs : string[];
    @Output() changeTab: EventEmitter<string> = new EventEmitter();
    @Input() selectedFormat: string;
    //selectedTab: string;

    //ngOnChanges(changes: {[propName: string]: SimpleChange}) {
    //    //if (changes['tabs'] && typeof changes["tabs"].currentValue !== 'undefined') {
    //    //    console.log('toolbar initialised');
    //    //    console.log(this.tabs);
    //    //    //$('ul.tabs').tabs();
    //    //    //$('ul.tabs').tabs('select_tab', this.selectedFormat);
    //    //    //this.selectedFormat = 'iagree';
    //    //}
    //
    //    if (changes['selectedFormat']) {
    //        console.log(this.selectedFormat);
    //    }
    //
    //}


    setSelectedTab($event,  language: string): void{
        $event.preventDefault();

        if(this.selectedFormat === language)
            return;

        //this.selectedTab = language;
        this.selectedFormat= language;

        console.log(this.selectedFormat);
        //this.changeTab.next(this.selectedTab);
        this.changeTab.emit(this.selectedFormat);
    }
}