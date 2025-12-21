import { Component } from '@angular/core';
import { HeaderComponent } from "./components/header/header";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  imports: [RouterOutlet, HeaderComponent]
})
export class AppComponent {
  title = 'pinterest-app';
}