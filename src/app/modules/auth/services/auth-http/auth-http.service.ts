import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel} from '../../models/auth.model';
const API_USERS_URL = `${environment.apiUrl}/auth`;
import { AngularFireAuth } from '@angular/fire/compat/auth';



// https://medium.com/@sanjaytoge/firebase-authentication-with-angular-2235783956f7

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;  
  constructor(
    private http: HttpClient,
    public fbAuth: AngularFireAuth,
    ) {}

  // public methods
  login(email: string, password: string): Observable<any> {
    return this.http.post<AuthModel>(`${API_USERS_URL}/login`, {
      email,
      password,
    });
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_USERS_URL}/forgot-password`, {
      email,
    });
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
    const userModel = new UserModel()
    userModel.email = userData.email
    userModel.authToken = userData.stsTokenManager.accessToken
    userModel.fullname = userData.displayName
    userModel.pic = userData.photoURL
    userModel.expiresIn = userData.stsTokenManager.expirationTime
    userModel.id = userData.email
    return of(userModel)
  }

  logout(): Promise<void> {
    return this.fbAuth.signOut()
  }
}
