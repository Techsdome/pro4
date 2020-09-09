import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {User} from '../../shared/services/user';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs';
import {switchMap, filter} from 'rxjs/operators';
import {DataServiceService} from '../../shared/services/data-service.service';
import {Item} from '../../models/Item';
import {UtilitiesService} from '../../app.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {trigger, style, animate, transition} from '@angular/animations';
import {AngularFirestore} from 'angularfire2/firestore';
import {FormControl} from '@angular/forms';
import {CreatePostNewComponent} from '../create-post-new/create-post-new.component';
import * as firebase from 'firebase';

@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./main-navbar.component.css'],
  animations: [
    trigger('slide', [
      transition(':enter', [
        style({transform: 'translate(0px, 150px)'}),
        animate('1s')
      ]),
    ]),
  ]
})
export class MainNavbarComponent implements OnInit {
  public status = false;
  public menuClicked = false;
  user: firebase.User;
  items: Item[];
  photoURL: string;
  stat: string;
  myControl = new FormControl();
  results: Observable<any[]>;
  offset = new Subject<string>();
  userId: string;

  constructor(@Inject(AuthService) public authService: AuthService,
              @Inject(DataServiceService) private dataService: DataServiceService,
              private utilitiesService: UtilitiesService,
              private modalService: NgbModal, 
              private afs: AngularFirestore) {
  }

  onkeyup(e) {
    this.offset.next(e.target.value.toLowerCase());
  }

  search() {
    return this.offset.pipe(
      filter(val => !!val),
      switchMap(offset => {
        return this.afs.collection('users', ref =>
          ref.orderBy(`searchableIndex.${offset}`).limit(5)
        ).valueChanges();
      })
    );
  }


  animateOn() {
    this.status = !this.status;
  }

  showMenuBar() {
    this.menuClicked = !this.menuClicked;
  }

  createNewPost(type:string) {
    const openPost = this.modalService.open(CreatePostNewComponent,
      {
        scrollable: true
      });
      openPost.componentInstance.type = type;
  }

  slideIt(dat) {
    this.stat = dat;
  }

  ngOnInit() {
    this.results = this.search();
    this.authService.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        this.photoURL = user.photoURL;
        this.userId = user.uid;
      }
    });

  }
}
