/**
 * Created by mrivero on 20/02/2016.
 */
import {Component, Input, Output, OnInit, OnChanges,
        SimpleChange, EventEmitter} from "angular2/core";

@Component({
    selector: 'tabs',
    templateUrl: 'templates/tabs.html',
})
export class Tabs implements OnChanges, OnInit {
    //@Input() extensions : string[];
    @Input() tabs : string[];
    @Output() changeTab: EventEmitter<string> = new EventEmitter();
    selectedTab: string;
    @Input() selectedFormat: string;

    addTab(tab: string) {
        this.tabs.push(tab);
    }

    ngOnChanges(changes: {[propName: string]: SimpleChange}) {
        if (changes['tabs'] && typeof changes["tabs"].currentValue !== 'undefined') {
            console.log('toolbar initialised');
            console.log(this.tabs);
            this.selectedFormat = 'iagree';
        }
    }

    ngOnInit() {
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