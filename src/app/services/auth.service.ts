import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  private mockUser: User = {
    id: 'user-1',
    name: 'Ben Marzouk',
    username: 'doua Ben Marzouk',
    email: 'benmarzoukdoua@example.com',
    avatar: '',
    bio: 'Passionnée de design et photographie 📸',
    followers: 1250,
    following: 832,
    pins: 456,
    createdAt: new Date('2025-01-15')
  };

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.mockUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }


  logout(): void {
    this.currentUserSubject.next(null);
  }
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

}