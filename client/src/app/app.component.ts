import { Component } from '@angular/core';
import {environment}  from '../environments/environment'
interface User{
  username: string,
  password: string,
  loggedIn?: boolean
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title : string = 'File Master';
  information : string = 'A place to store and share files'
  currentPage : string = 'home'
  pages : string[] = ['home', 'userLogin']
  user: User

  changePage(page : string){
    if (this.pages.indexOf(page) === -1) console.log('Invalid Page')
    else this.currentPage = page
  }

  onUserLogin($event){
    this.user = {username: $event.username, password: $event.password}
    let headers = new Headers()
    headers.append('Content-Type', 'application/x-www-form-urlencoded')
    console.log(this.user.username)
    fetch(environment.usersLogin,{
      method: 'POST',
      body: `username=${this.user.username}&password=${this.user.password}`,
      headers
    })
    .then(
      (res) => {return res.json()}
    )
    .then (
      (data) => { 
        if (data.token) {
          localStorage.setItem('token', data.token)
          this.changePage('home')
        }
      }
    )
    .catch(
      (err) => { console.log(err) }
    )
  }
}
