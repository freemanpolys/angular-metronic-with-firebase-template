export class AuthModel {
  authToken: string;
  refreshToken: string;
  expiresIn: Date;

  setAuth(auth: AuthModel) {
    this.authToken = auth.authToken;
    this.refreshToken = auth.refreshToken;
    this.expiresIn = auth.expiresIn;
  }
}

export interface FbUser {
  uid: string
  email: string
  emailVerified: boolean
  displayName: string
  isAnonymous: boolean
  photoURL: string
  providerData: ProviderDaum[]
  stsTokenManager: StsTokenManager
  createdAt: string
  lastLoginAt: string
  apiKey: string
  appName: string
}

export interface ProviderDaum {
  providerId: string
  uid: string
  displayName: string
  email: string
  phoneNumber: any
  photoURL: string
}

export interface StsTokenManager {
  refreshToken: string
  accessToken: string
  expirationTime: number
}
