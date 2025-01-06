import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MainContentComponent } from './main-content/main-content.component';
import { FooterComponent } from './footer/footer.component';
import { CommentsComponent } from './comments/comments.component';
import { HeaderComponent } from '@app/header/header.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, NavigationComponent, MainContentComponent, FooterComponent, CommentsComponent],
  imports: [BrowserModule],
  providers: [provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
