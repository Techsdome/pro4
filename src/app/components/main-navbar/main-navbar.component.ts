import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {User} from '../../shared/services/user';
import {Observable} from 'rxjs';
import {DataServiceService} from '../../shared/services/data-service.service';
import {Item} from '../../models/Item';
import {NewProjectComponent} from '../new-project/new-project.component';
import {UtilitiesService} from '../../app.component';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {trigger, state, style, animate, transition, keyframes, query, stagger} from '@angular/animations';

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
  user: Observable<User>;
  items: Item[];
  photoURL: string;
  stat: string;

  // @ViewChild('myproject', {read: ElementRef, static: false}) myproject: ElementRef

  constructor(@Inject(AuthService) public authService: AuthService,
              @Inject(DataServiceService) private dataService: DataServiceService,
              public addproject: NewProjectComponent, private utilitiesService: UtilitiesService,
              public activeModal: NgbActiveModal, private modalService: NgbModal) {
  }

  open() {
    const modalRef = this.modalService.open(NewProjectComponent, { scrollable: true });
    // modalRef.componentInstance.name = 'World';
  }

  openScrollableContent() {
    this.modalService.open(NewProjectComponent, { scrollable: true });
  }

  animateOn() {
    this.status = !this.status;
  }

  showMenuBar() {
    this.menuClicked = !this.menuClicked;
  }

  ngOnInit() {
    this.authService.afAuth.authState.subscribe(user => {
      if (user) {
        this.photoURL = user.photoURL;
      }
    });

  }

// const directory = document.querySelector('.bubble').getBoundingClientRect();

    slideIt(dat) {
      this.stat = dat;
    }
}
