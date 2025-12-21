import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinCard } from '../../components/pin-card/pin-card'; 
import { AuthService } from '../../services/auth.service';
import { PinterestService } from '../../services/pinterest.service';
import { User } from '../../models/user.model';
import { Pin } from '../../models/pin.model';

@Component({
  selector: 'app-profile',
  standalone: true,         
  imports: [CommonModule, PinCard], 
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class Profile implements OnInit {
  user: User | null = null;
  userPins: Pin[] = [];
  activeTab: 'created' | 'saved' = 'created';
  loading = true;

  constructor(
    private authService: AuthService,
    private pinterestService: PinterestService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      if (user) {
        this.loadUserPins();
      }
    });
  }

  loadUserPins(): void {
    this.loading = true;
    this.pinterestService.getPins(1, 20).subscribe(pins => {
      this.userPins = pins.slice(0, 15);
      this.loading = false;
    });
  }

  switchTab(tab: 'created' | 'saved'): void {
    this.activeTab = tab;
  }

  onEditProfile(): void {
    console.log('Éditer le profil');
  }

  onShareProfile(): void {
    console.log('Partager le profil');
  }
}
