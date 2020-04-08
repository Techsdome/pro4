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
    job: string;
    description: string;

    constructor(private dataService: DataServiceService) {
    }

    getJob(item) {
        console.log('this.user.uid: ' + JSON.stringify(this.user.uid));
        for (const it in item) {
            if (this.user.uid === item[it].uid) {
                this.job = item[it].job;
                this.description = item[it].description;
            }
        }
    }

    ngOnInit(): void {
        this.dataService.getItems().subscribe(items => {
            this.items = items;
            /*console.log(this.items);*/
            this.getJob(items);
        });

        this.dataService.getCurrentUser().subscribe(user => {
            this.user = user;
            console.log(this.user);
        });
    }
}
