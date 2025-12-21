// pin-list.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinCard } from '../pin-card/pin-card';
import { PinDetailComponent } from '../pin-detail/pin-detail';
import { PinterestService } from '../../services/pinterest.service';
import { Pin } from '../../models/pin.model';

@Component({
  selector: 'app-pin-list',
  standalone: true,
  imports: [CommonModule, PinCard, PinDetailComponent],
  templateUrl: './pin-list.html',
  styleUrls: ['./pin-list.scss']
})
export class PinListComponent {
  pins: Pin[] = [];
  selectedPin: Pin | null = null;

  constructor(private pinterestService: PinterestService) {}

  ngOnInit(): void {
    this.pinterestService.getPins().subscribe(pins => {
      this.pins = pins;
    });
  }

  openPinModal(pin: Pin): void {
    this.selectedPin = pin;
  }

  closeModal(): void {
    this.selectedPin = null;
  }
}
