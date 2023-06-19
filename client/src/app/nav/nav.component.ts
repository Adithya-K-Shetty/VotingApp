import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Observable, of, take } from 'rxjs';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { getHours } from 'ngx-bootstrap/chronos/utils/date-getters';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  model: any = {};
  user: User | undefined;
  voteDate = 19;
  show = true;
  constructor(
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
        }
        console.log('Helloooooo' + this.user);
      },
    });
    if (this.voteDate == new Date().getDate() && new Date().getHours() < 18) {
      this.show = false;
    }
    if (this.voteDate != new Date().getDate()) {
      this.show = false;
    }
  }

  ngOnInit(): void {}

  //custom observable has to be unsubscribed
  //memory leak issue
  // getCurrentUser() {
  //   this.accountService.currentUser$.subscribe({
  //     next: (user) => (this.loggedIn = !!user), // converts object into boolean
  //     error: (error) => console.log(error),
  //   });
  // }

  //here it is not necessary to unsubscribe cause
  //as soon as the hhtp method ends
  //automatic unsubscription takes place
  login() {
    this.accountService.login(this.model).subscribe({
      next: (_) => this.router.navigateByUrl('/members'),
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
