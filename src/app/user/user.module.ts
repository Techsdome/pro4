import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {UserDashboardComponent} from './user-dashboard/user-dashboard.component';
import {UserListComponent} from './user-list/user-list.component';
import {UserListItemComponent} from './user-list-item/user-list-item.component';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
    {path: 'me', component: UserDashboardComponent, data: { title: 'Dashboard'}},
    {path: 'users', component: UserListComponent, data: { title: 'Users'}},
    {path: 'profile', component: UserDetailComponent, data: { title: 'profile'}}
];

@NgModule({
    declarations: [UserDetailComponent, UserDashboardComponent, UserListComponent, UserListItemComponent],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class UserModule {
}
