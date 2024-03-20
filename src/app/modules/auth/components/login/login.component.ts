import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular/lib/firebaseui-angular-library.helper';
import { environment } from 'src/environments/environment';
import { AuthModel} from '../../models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  defaultAuth: any = {
    email: 'admin@demo.com',
    password: 'demo',
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  userData: any;

  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;  
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public fbAuth: AngularFireAuth
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
    this.fbAuth.authState.subscribe((user) => {
      if (user) {
        localStorage.setItem('fire_user', JSON.stringify(user));
        this.userData = JSON.parse(localStorage.getItem('fire_user')!);
        const auth = new AuthModel()
        auth.authToken = this.userData.stsTokenManager.accessToken
        auth.expiresIn = this.userData.stsTokenManager.expirationTime
        auth.refreshToken = this.userData.stsTokenManager.refreshToken
        localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
        
        const userModel = new UserModel()
        userModel.email = this.userData.email
        userModel.authToken = this.userData.stsTokenManager.accessToken
        userModel.fullname = this.userData.displayName
        userModel.pic = this.userData.photoURL
        userModel.expiresIn = this.userData.stsTokenManager.expirationTime
        userModel.id = this.userData.email
        this.authService.currentUserValue = userModel 
      } else {
        localStorage.setItem('fire_user', 'null');
        JSON.parse(localStorage.getItem('fire_user')!);
      }
    });
  }

  ngOnInit(): void {
    //this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
      
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }
/*
  initForm() {
    this.loginForm = this.fb.group({
      email: [
        this.defaultAuth.email,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  } 

  submit() {
    this.hasError = false;
    const loginSubscr = this.authService
      .login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe((user: UserModel | undefined) => {
        if (user) {
          this.router.navigate([this.returnUrl]);
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(loginSubscr);
  }*/

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  successCallback(data: FirebaseUISignInSuccessWithAuthResult) {
    console.log('successCallback', data);
    this.fbAuth.authState.subscribe((user) => {
      if(user) {
        this.router.navigate([this.returnUrl]);
      }
    });
  }

  errorCallback(data: FirebaseUISignInFailure) {
    alert('Failed to login')
    console.warn('errorCallback', data);
  }

  /*
  // Sign in with Twitter
  TwitterAuth() {
    return this.AuthLogin(new TwitterAuthProvider());
  }
  // Auth logic to run auth providers
  AuthLogin(provider:TwitterAuthProvider) {
    return this.fbAuth
      .signInWithPopup(provider)
      .then((result) => {
        console.log('You have been successfully logged in!');
      })
      .catch((error) => {
        console.log(error);
      });
  }
  */
}
