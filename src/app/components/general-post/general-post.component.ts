import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-general-post',
    templateUrl: './general-post.component.html',
    styleUrls: ['./general-post.component.css']
})
export class GeneralPostComponent implements OnInit {

    edit = false;

    @Input() postMessage: string;
    @Input() postDate: string;
    @Input() postHour: string;
    @Input() postMinute: string;
    @Input() postSecond: string;
    @Input() postDisplayName: string;
    @Input() postPhotoUrl: string;

    constructor() {
    }

    ngOnInit(): void {
    }

    openComment() {
        this.edit = !this.edit;
    }

}
