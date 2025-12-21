import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pin, CreatePinRequest } from '../models/pin.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PinterestService {
  getPinById(id: string): Observable<Pin> {
  const params = new HttpParams()
    .set('client_id', this.accessKey);

  return this.http.get<any>(`${this.apiUrl}/photos/${id}`, { params }).pipe(
    map(photo => this.transformToPin(photo))
  );
}
  private apiUrl = 'https://api.unsplash.com';
  private accessKey = '9o3Fk5JS0imoWiSj_MV14rWN7TZx3CEQw0wt-OQIjZE'; // Ta clé API Unsplash

  private savedPins: { [userId: string]: Pin[] } = {};

  constructor(private http: HttpClient) { }
  getPins(page: number = 1, perPage: number = 30): Observable<Pin[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString())
      .set('client_id', this.accessKey);

    return this.http.get<any[]>(`${this.apiUrl}/photos`, { params }).pipe(
      map(photos => photos.map(photo => this.transformToPin(photo)))
    );
  }

  // Rechercher des pins par mot-clé
  searchPins(query: string, page: number = 1): Observable<Pin[]> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('per_page', '30')
      .set('client_id', this.accessKey);

    return this.http.get<any>(`${this.apiUrl}/search/photos`, { params }).pipe(
      map(response => response.results.map((photo: any) => this.transformToPin(photo)))
    );
  }



  // Sauvegarder un pin pour l'utilisateur
 savePinForUser(userId: string, pin: Pin): Observable<boolean> {
  if (!this.savedPins) {
    this.savedPins = {};
  }
  if (!this.savedPins[userId]) {
    this.savedPins[userId] = [];
  }

  this.savedPins[userId].push(pin);

  return new Observable<boolean>(observer => {
    observer.next(true);
    observer.complete();
  });
}
  getSavedPins(userId: string): Pin[] {
    return this.savedPins[userId] || [];
  }

  // Transformer les données Unsplash en Pin
  private transformToPin(photo: any): Pin {
    return {
      id: photo.id,
      title: photo.description || photo.alt_description || 'Sans titre',
      description: photo.description || photo.alt_description || 'Pas de description',
      image: photo.urls?.regular || 'assets/default.jpg',
      link: photo.links?.html || '#',
      author: {
        id: photo.user?.id || 'unknown',
        name: photo.user?.name || 'Anonyme',
        avatar: photo.user?.profile_image?.medium || 'assets/default-avatar.png'
      },
      saves: photo.likes || 0,
      createdAt: new Date(photo.created_at || Date.now()),
      tags: photo.tags?.map((t: any) => t.title) || [],
      width: photo.width || 400,
      height: photo.height || 300
    };
  }
  getPopularCategories(): Observable<string[]> {
    return new Observable<string[]>(observer => {
      observer.next([
        'Nature', 'Architecture', 'Art', 'Food', 'Fashion', 
        'Travel', 'Technology', 'Design', 'Photography', 'Illustration'
      ]);
      observer.complete();
    });
  }
}
