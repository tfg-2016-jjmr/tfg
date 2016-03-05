/**
 * Created by mrivero on 20/02/2016.
 */
import {Component, Input, Output, OnInit, EventEmitter} from "angular2/core";

@Component({
    selector: 'tabs',
    templateUrl: 'templates/tabs.html',
})
export class Tabs implements OnInit{
    //@Input() extensions : string[];
    @Input() tabs : string[];
    @Output() changeTab: EventEmitter<string> = new EventEmitter();
    selectedTab: string;
    @Input() selectedFormat: string;

    addTab(tab: string) {
        this.tabs.push(tab);
    }

    ngOnInit(){
        console.log('toolbar initialised');
        console.log(this.tabs);
        this.selectedFormat = 'iagree';
        $(window).trigger('resize');
    }

    setSelectedTab($event,  language: string): void{
        $event.preventDefault();

        if(this.selectedTab === language)
            return;

        this.selectedTab = language;
        this.selectedFormat= language;

        console.log(this.selectedTab);
        //this.changeTab.next(this.selectedTab);
        this.changeTab.emit(this.selectedTab);
    }
}