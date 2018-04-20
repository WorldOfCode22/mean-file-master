import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  gettingUser = true
  gotUserData = false
  errorGettingUser = false
  user: object
  constructor() { 
  }

  ngOnInit() {
    this.getUser()
  }

  async getUser(){
    try {
      let username = localStorage.getItem('username')
      let token = localStorage.getItem('token')
      if(username){
      let res = await fetch(`${environment.getUser}/${username}/${token}`, {
        method: 'GET'
      })
      if (res.status !== 200) throw new Error('Could not fetch user profile')
      let data = await res.json()
      if (data.user){
        this.gettingUser = false
        this.user = data.user
        this.gotUserData = true
      } 
      }
    } catch (e) {
      this.errorGettingUser = true
      this.gettingUser = false
      console.log(e)
    }
  }

}
