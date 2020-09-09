import { Component, OnInit } from '@angular/core';
import {User} from 'firebase';
import {DataServiceService} from '../../../shared/services/data-service.service';
import {AngularFirestore} from 'angularfire2/firestore';

@Component({
  selector: 'app-people-page',
  templateUrl: './people-page.component.html',
  styleUrls: ['./people-page.component.css']
})
export class PeoplePageComponent implements OnInit {

  constructor(private userSerive: DataServiceService, private afs: AngularFirestore) { }

  allUsers: User;

  ngOnInit(): void {
    
  }



}
