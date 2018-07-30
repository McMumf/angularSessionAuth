import { Component, OnInit } from '@angular/core';
import { user } from "../user";
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user = new user;
  token;

  constructor(private jwt: JwtHelperService) {
    this.token = jwt.decodeToken(localStorage.getItem('token'));
    this.user.email = this.token.email;
   }

  ngOnInit() {
  }

}
