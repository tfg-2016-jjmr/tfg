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
    //@Output() clickedTab: EventEmitter<string> = new EventEmitter();
    selectedTab: string;

    addTab(tab: string) {
        this.tabs.push(tab);
    }

    ngOnInit(){
        console.log('toolbar initialised');
        console.log(this.tabs);
    }

    selectTab( language: string): void{
        //event.preventDefault();

        if(this.selectedTab === language)
            return;

        this.selectedTab = language;

        console.log(this.selectedTab);
        //this.clickedTab.emit(this.selectedTab);
        //this.clickedTab.emit(null);
    }
}