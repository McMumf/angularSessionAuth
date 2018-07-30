import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import {MediaMatcher} from '@angular/cdk/layout';
import { JwtHelperService } from '@auth0/angular-jwt';
import { user } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(private auth: AuthService, private router: Router,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private jwt: JwtHelperService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

    ngOnDestroy(): void {
      this.mobileQuery.removeListener(this._mobileQueryListener);
      this.auth.logout();
    }

}