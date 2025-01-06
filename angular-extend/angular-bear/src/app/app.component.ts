import { Component } from '@angular/core';
import { NavigationComponent } from './navigation/navigation.component';
import { CommentsComponent } from './comments/comments.component';
import { FooterComponent } from './footer/footer.component';
import { MainContentComponent } from '@app/main-content/main-content.component';
import {HeaderComponent} from "@app/header/header.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [NavigationComponent, HeaderComponent, MainContentComponent, CommentsComponent, FooterComponent],
})
export class AppComponent {}
