import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {DataServiceService} from '../../shared/services/data-service.service';
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
  profileOwner = false;                                // True if profileViewer is profileOwner

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
      this.authService.afs.collection('users').doc(this.searchedUserId).valueChanges().subscribe((val: any) => {
        this.job = val.job;
        this.description = val.description;
        this.skills = val.skills;
        this.firstname = val.firstname;
        this.lastname = val.lastname;
        this.photoURL = val.photoURL;
        this.displayName = val.displayName;
        this.email = val.email;
      });
    });

    this.htmlSkillElements = (document.getElementsByClassName('skillDeleteButton') as HTMLCollection);

    this.dataService.getCurrentUser().subscribe(user => {
      this.user = user;
      if (this.searchedUserId === this.user.uid) {
        this.profileOwner = true;
      }
      if (this.searchedUser) {
        this.user = this.searchedUser;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

