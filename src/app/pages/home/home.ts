import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinterestService } from '../../services/pinterest.service';
import { Pin } from '../../models/pin.model';
import { PinCard } from '../../components/pin-card/pin-card';
import { PinDetailComponent } from '../../components/pin-detail/pin-detail';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PinCard, PinDetailComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  pins: Pin[] = [];
  categories: string[] = [];
  selectedCategory: string = 'Tous';
  loading = false;
  page = 1;

  // Gestion du modal
  selectedPin: Pin | null = null;
  showModal = false;

  constructor(private pinterestService: PinterestService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadPins();
  }

  loadCategories(): void {
    this.pinterestService.getPopularCategories().subscribe(categories => {
      this.categories = ['Tous', ...categories];
    });
  }

  loadPins(): void {
    this.loading = true;
    this.pinterestService.getPins(this.page).subscribe(
      pins => {
        this.pins = [...this.pins, ...pins];
        this.loading = false;
      },
      error => {
        console.error('Erreur lors du chargement des pins:', error);
        this.loading = false;
      }
    );
  }

  onCategorySelect(category: string): void {
    this.selectedCategory = category;
    this.pins = [];
    this.page = 1;

    if (category === 'Tous') {
      this.loadPins();
    } else {
      this.searchByCategory(category);
    }
  }

  searchByCategory(category: string): void {
    this.loading = true;
    this.pinterestService.searchPins(category).subscribe(
      pins => {
        this.pins = pins;
        this.loading = false;
      },
      error => {
        console.error('Erreur lors de la recherche:', error);
        this.loading = false;
      }
    );
  }

  // Ouvrir le modal au clic sur une pin
  onPinClicked(pin: Pin): void {
    this.selectedPin = pin;
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  // Fermer le modal
  onCloseModal(): void {
    this.showModal = false;
    this.selectedPin = null;
    document.body.style.overflow = 'auto';
  }

  onPinSaved(pinId: string): void {
    console.log('Pin enregistré:', pinId);
  }

  // Correction : enlever ['$event'] car la méthode ne prend pas de paramètre
  @HostListener('window:scroll')
  onScroll(): void {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) 
      + document.documentElement.offsetHeight;
    const max = document.documentElement.scrollHeight;

    if (pos > max - 200 && !this.loading && this.selectedCategory === 'Tous') {
      this.page++;
      this.loadPins();
    }
  }

  // Fermer avec Escape
  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.showModal) {
      this.onCloseModal();
    }
  }
}