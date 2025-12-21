// app/app-routing.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Profile } from './pages/profile/profile';
import { SearchResultsComponent } from './pages/search-results/search-results';
import { PinDetailComponent } from './components/pin-detail/pin-detail';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile', component: Profile },
  { path: 'search', component: SearchResultsComponent },
  { path: 'pin/:id', component: PinDetailComponent },
  { path: '**', redirectTo: '' }
];
