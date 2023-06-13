import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  registerMode = false;
  loginMode = false;
  users: any;
  constructor() {}

  ngOnInit(): void {}
  registerToggle() {
    this.registerMode = !this.registerMode;
    this.loginMode = false;
  }

  loginToggle() {
    this.loginMode = !this.loginMode;
    this.registerMode = false;
  }

  cancleRegisterMode(event: boolean) {
    this.registerMode = event;
    this.loginMode = false;
  }

  cancleLoginMode(event: boolean) {
    this.loginMode = event;
    this.registerMode = false;
  }
}
