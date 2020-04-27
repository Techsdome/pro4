import {AfterViewInit, Component, HostListener, Injectable, OnInit} from '@angular/core';
import {PresenceService} from './services/presence.service';
import {Subject} from 'rxjs';
import {NavigationCancel, NavigationEnd, NavigationStart, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 //  constructor(public presence: PresenceService) {}
  title = 'Techsdome';
  loading;
  constructor(private utilitiesService: UtilitiesService, private router: Router) {
    this.loading = true;
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    this.utilitiesService.documentClickedTarget.next(event.target);
  }

  // ngAfterViewInit(): void {
  //   this.router.events
  //     .subscribe((event) => {
  //       if (event instanceof NavigationStart) {
  //         this.loading = true;
  //       } else if (
  //         event instanceof NavigationEnd ||
  //         event instanceof NavigationCancel
  //       ) {
  //         this.loading = false;
  //       }
  //     });
  // }
}

@Injectable({ providedIn: 'root' })
export class UtilitiesService {
  documentClickedTarget: Subject<HTMLElement> = new Subject<HTMLElement>();
}
