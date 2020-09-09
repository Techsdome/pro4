import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {DataServiceService} from '../../shared/services/data-service.service';
import {Item} from '../../models/Item';
import {User} from '../../shared/services/user';
import {AuthService} from '../../shared/services/auth.service';
import {ActivatedRoute} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';


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
  email: string;
  photoURL = '';
  edit = false;
  htmlSkillElements: HTMLCollection;
  displayName: string;
  editJob = false;

  @Input() searchedUser: any;                          // The searched User of search bar
  private sub: any;
  searchedUserId;

  constructor(private dataService: DataServiceService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private afs: AngularFirestore) {
    const id: string = route.snapshot.params.user;
  }

  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'size'],
      ['blockquote', 'code-block', 'link'],
    ]
  };

  editToggle() {
    this.edit = !this.edit;
  }

  editToggleJob() {
    this.editJob = !this.editJob;
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
        this.email = item[it].email;
      }
    }
  }

  saveDataJob() {
    if (this.editJob) {
        this.editJob = !this.editJob;
    }
    this.authService.afs.collection('users').doc(this.authService.userData.uid).update({
      job: this.job
    });
}


  saveSkill() {
    if (this.edit) {
      this.edit = !this.edit;
    }
    this.updateSkillsFirebase();
  }

  updateSkillArray(params) {
    this.skills = params;
  }

  updateSkillsFirebase() {
    this.authService.afs.collection('users').doc(this.authService.userData.uid).update({
      skills: [] = this.skills
    }).then(r => {});
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.searchedUserId = params.user;

      this.authService.afs.collection('users').doc(this.searchedUserId).valueChanges().subscribe((val) => {
        // @ts-ignore
        this.job = val.job;
        // @ts-ignore
        this.description = val.description;
        // @ts-ignore
        this.skills = val.skills;
        // @ts-ignore
        this.firstname = val.firstname;
        // @ts-ignore
        this.lastname = val.lastname;
        // @ts-ignore
        this.photoURL = val.photoURL;
        // @ts-ignore
        this.displayName = val.displayName;
        // @ts-ignore
        this.email = val.email;
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

