import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  username : string;
  password : string;
  @Output() loginEvent = new EventEmitter<object>()
  constructor() { }

  ngOnInit() {
  }

  onSubmit(){
    let authObj = {
      username: this.username,
      password: this.password
    }
    this.loginEvent.emit(authObj)
  }
}
