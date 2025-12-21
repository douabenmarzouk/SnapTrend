import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Pin } from '../../models/pin.model';
import { PinterestService } from '../../services/pinterest.service';

@Component({
  selector: 'app-pin-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pin-card.html',
  styleUrls: ['./pin-card.scss']
})
export class PinCard {
  @Input() pin!: Pin;
  @Output() pinClicked = new EventEmitter<Pin>();
  @Output() pinSaved = new EventEmitter<string>();

  isHovered = false;
  isSaving = false;

  constructor(private router: Router, private pinterestService: PinterestService) {}

  onPinClick(): void {
    this.pinClicked.emit(this.pin);
  }

  onSavePin(event: Event): void {
    event.stopPropagation();
    this.isSaving = true;
    this.pinterestService.savePinForUser('current-user', this.pin).subscribe(() => {
      this.isSaving = false;
      this.pinSaved.emit(this.pin.id);
      console.log('Pin sauvegardé dans votre compte !');
    });
  }

  onVisitLink(event: Event): void {
    event.stopPropagation();
    if (this.pin.link) {
      window.open(this.pin.link, '_blank');
    }
  }

  onMoreOptions(event: Event): void {
    event.stopPropagation();
    console.log('Plus d\'options pour le pin:', this.pin.id);
  }
}
