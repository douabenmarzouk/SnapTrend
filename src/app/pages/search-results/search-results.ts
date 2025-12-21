import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PinterestService } from '../../services/pinterest.service';
import { Pin } from '../../models/pin.model';
import { PinCard} from '../../components/pin-card/pin-card';  // nom exact

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, PinCard],  // <- composant enfant importé
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.scss'],
})
export class SearchResultsComponent implements OnInit {  // <- ajouter "Component" au nom
  searchQuery: string = '';
  pins: Pin[] = [];
  loading = false;

  constructor(private route: ActivatedRoute, private pinterestService: PinterestService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      if (this.searchQuery) {
        this.searchPins();
      }
    });
  }

  searchPins(): void {
    this.loading = true;
    this.pinterestService.searchPins(this.searchQuery).subscribe(
      pins => { 
        this.pins = pins; 
        this.loading = false; 
      },
      error => { 
        console.error(error); 
        this.loading = false; 
      }
    );
  }
}
