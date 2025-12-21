import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PinterestService } from '../../services/pinterest.service';
import { Pin } from '../../models/pin.model';

@Component({
  selector: 'app-pin-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pin-detail.html',
  styleUrls: ['./pin-detail.scss']
})
export class PinDetailComponent implements OnInit {
  @Input() pin: Pin | null = null;
  @Output() closeModal = new EventEmitter<void>();
  
  relatedPins: Pin[] = [];
  comment: string = '';
  currentUserId = 'current-user';
  savedPins: Pin[] = [];
  isSaved = false;

  constructor(private pinterestService: PinterestService) {}

  ngOnInit(): void {
    if (this.pin) {
      this.loadRelatedPins();
      this.loadSavedPins();
      this.checkIfSaved();
    }
  }

  loadRelatedPins(): void {
    this.pinterestService.getPins(1, 10).subscribe(pins => {
      this.relatedPins = pins.filter(p => p.id !== this.pin?.id).slice(0, 6);
    });
  }

  loadSavedPins(): void {
    this.savedPins = this.pinterestService.getSavedPins(this.currentUserId);
  }

  checkIfSaved(): void {
    if (this.pin) {
      this.isSaved = this.savedPins.some(p => p.id === this.pin!.id);
    }
  }
 

  onSavePin(): void {
    if (this.pin) {
      this.pinterestService.savePinForUser(this.currentUserId, this.pin).subscribe(() => {
        console.log('Pin sauvegardé !');
        this.isSaved = true;
        this.loadSavedPins();
      });
    }
  }

  onSharePin(): void {
    if (this.pin) {
      // Copier le lien dans le presse-papier
      const url = window.location.origin + '/pin/' + this.pin.id;
      navigator.clipboard.writeText(url).then(() => {
        console.log('Lien copié !');
        alert('Lien copié dans le presse-papier !');
      });
    }
  }

  onDownloadImage(): void {
    if (this.pin) {
      window.open(this.pin.image, '_blank');
    }
  }

  onVisitLink(): void {
    if (this.pin?.link) {
      window.open(this.pin.link, '_blank');
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onSubmitComment(): void {
    if (this.comment.trim()) {
      console.log('Nouveau commentaire:', this.comment);
      // Ici vous pouvez ajouter la logique pour sauvegarder le commentaire
      this.comment = '';
    }
  }

  onRelatedPinClick(pin: Pin): void {
    // Charger le nouveau pin dans le modal
    this.pin = pin;
    this.ngOnInit();
  }
}