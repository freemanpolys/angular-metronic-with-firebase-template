import { Injectable } from '@angular/core';
import { Observable, map, of, from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel} from '../../models/auth.model';
const API_USERS_URL = `${environment.apiUrl}/auth`;
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from "firebase/compat/app";




// https://medium.com/@sanjaytoge/firebase-authentication-with-angular-2235783956f7

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(
    private http: HttpClient,
    public fbAuth: AngularFireAuth,
    ) {}

  // public methods
  login(email: string, password: string): Observable<AuthModel> {
    return from(this.fbAuth
      .signInWithEmailAndPassword(email, password)
      .then((result: firebase.auth.UserCredential ) => {
        const sUser = JSON.stringify(result.user)
        const userData = JSON.parse(sUser)
        localStorage.setItem('fire_user', sUser);
        return this.firebaseUserToAuthModel(userData)
      }))
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel|undefined> {
    return from(this.fbAuth.createUserWithEmailAndPassword(user.email, user.password)
    .then((result: firebase.auth.UserCredential) => {
      const userData = JSON.parse(JSON.stringify(result.user))
      result.user?.sendEmailVerification()
      return this.firebaseUserToUserModel(userData)
    }))
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return from(this.fbAuth.sendPasswordResetEmail(email).then(() => {
        return true
    }))
  }

  getUserByToken(token: string): Observable<UserModel| undefined> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    // Send request to backend to get UserModel

    /*
    const localUser = localStorage.getItem(this.authLocalStorageToken)
    if(localUser == null) {
        return of(undefined)
    } else {
      return of(JSON.parse(localUser) as UserModel);
    }*/
    const userData = JSON.parse(localStorage.getItem('fire_user')!);
   
    return of(this.firebaseUserToUserModel(userData))
  }

  logout(): Promise<void> {
    return this.fbAuth.signOut()
  }

  firebaseUserToUserModel(userData: any): UserModel {
    const userModel = new UserModel()
    userModel.email = userData.email
    userModel.authToken = userData.stsTokenManager.accessToken
    userModel.fullname = userData.displayName
    userModel.pic = userData.photoURL
    userModel.expiresIn = userData.stsTokenManager.expirationTime
    userModel.id = userData.email
    return userModel
  }
  firebaseUserToAuthModel(userData: any): AuthModel{
    const authModel = new AuthModel()
    authModel.authToken = userData.stsTokenManager.accessToken
    authModel.expiresIn =  userData.stsTokenManager.expirationTime
    authModel.refreshToken =  userData.stsTokenManager.refreshToken
    return authModel
  }
}
