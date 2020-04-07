import {Component, OnInit} from '@angular/core';
import {DataServiceService} from '../../shared/services/data-service.service';
import {Item} from '../../models/Item';
import {User} from '../../shared/services/user';


@Component({
    selector: 'app-user-data',
    templateUrl: './user-data.component.html',
    styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {

    items: Item[];
    user: User;

    constructor(private dataService: DataServiceService) {
    }

    ngOnInit(): void {
        this.dataService.getItems().subscribe(items => {
            this.items = items;
        });

        this.dataService.getCurrentUser().subscribe(user => {
            this.user = user;
            console.log(this.user);
        });
    }
}
