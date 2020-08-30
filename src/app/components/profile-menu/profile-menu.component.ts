
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {User} from '../../shared/services/user';
import {NewProjectService} from '../../shared/services/new-project.service';
import {DataServiceService} from '../../shared/services/data-service.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.css']
})
export class ProfileMenuComponent implements OnInit {

  user: User;
  @Input() activeMenuItem: string;
  activeFilter: boolean;

  @Output() activeMenuItemChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() activeFilterChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private dataService: DataServiceService, private authService: AuthService, private pservice: NewProjectService) {
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  setActive(link) {
    this.activeMenuItem = link;
    this.activeMenuItemChange.emit(link);
  }

  toggleFilter() {
    if (!this.activeFilter) {
      this.activeFilterChange.emit('popular');
    } else {
      this.activeFilterChange.emit('recent');
    }

    this.activeFilter = !this.activeFilter;
  }

}

