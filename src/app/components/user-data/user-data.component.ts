import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {DataServiceService} from '../../shared/services/data-service.service';
import {Item} from '../../models/Item';
import {User} from '../../shared/services/user';
import {AuthService} from '../../shared/services/auth.service';
import {ActivatedRoute, Route} from '@angular/router';
import * as admin from 'firebase-admin';
import * as firebase from 'firebase';
import {AngularFirestore} from "angularfire2/firestore";


@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit, OnDestroy {
  items: Item[];
  user: User;
  job: string;
  public description: string;
  skills: string[];
  firstname: string;
  lastname: string;
  photoURL = '';
  edit = false;
  skill: string;
  htmlSkillElements: HTMLCollection;
  displayName: string;

  @Input() searchedUser: any;                          // The searched User of search bar
  private sub: any;
  searchedUserId;

  constructor(private dataService: DataServiceService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private afs: AngularFirestore) {
    const id: string = route.snapshot.params.user;

    //console.log(id);
  }

  editToggle() {
    this.edit = !this.edit;
  }

  getExtendedData(item) {
    for (const it in item) {
      if (this.user.uid === item[it].uid) {
        this.job = item[it].job;
        this.description = item[it].description;
        this.skills = item[it].skills;
        this.firstname = item[it].firstname;
        this.lastname = item[it].lastname;
        this.photoURL = item[it].photoURL;
        this.displayName = item[it].displayName;
      }
    }
    if (this.firstname) {
      this.displayName = this.firstname;
    }
  }

  saveSkill() {
    if (this.skills === undefined) {
      this.skills = [];
    }
    this.skills.push(this.skill);
    if (this.edit) {
      this.edit = !this.edit;
    }
    this.updateSkillsFirebase();
    this.skill = '';
  }

  updateSkillsFirebase() {
    this.authService.afs.collection('users').doc(this.authService.userData.uid).update({
      skills: [] = this.skills
    });
  }

  deleteSkillElement(event) {
    for (let i = 0; i < this.skills.length; i++) {
      if (this.skills[i] === event.target.previousElementSibling.value) {
        this.skills.splice(i, 1);
      }
    }
    this.updateSkillsFirebase();
  }


  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.searchedUserId = params.user;

      this.authService.afs.collection('users').doc(this.searchedUserId).valueChanges().subscribe((val) => {
        console.log(val);
      });
      });

    this.htmlSkillElements = (document.getElementsByClassName('skillDeleteButton') as HTMLCollection);

    if (this.searchedUser) {
      this.user = this.searchedUser;
    } else {
      this.dataService.getCurrentUser().subscribe(user => {
        this.user = user;
      });
    }

    this.dataService.getItems().subscribe(items => {
      this.items = items;
      this.getExtendedData(items);
    });

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

