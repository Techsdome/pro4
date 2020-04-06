import {Component, OnInit} from '@angular/core';
import {DataServiceService} from '../../shared/services/data-service.service';
import {Item} from '../../models/Item';

@Component({
    selector: 'app-user-data',
    templateUrl: './user-data.component.html',
    styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {

    items: Item[];

    constructor(private dataService: DataServiceService) {
    }

    ngOnInit(): void {
        this.dataService.getItems().subscribe(items => {
            this.items = items;
        });
    }
}
