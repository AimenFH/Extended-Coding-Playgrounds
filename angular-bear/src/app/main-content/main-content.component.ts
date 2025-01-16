import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css'],
})
export class MainContentComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.getBearData('Polar_bear'); // Example bear name, replace as needed
    }
  }

  async getBearData(bearName: string) {
    const baseUrl = `http://localhost:3000/api/bear/${bearName}`;

    try {
      const response = await fetch(baseUrl);

      if (!response.ok) {
        console.error(`API Error: ${response.status} - ${response.statusText}`);
        // Handle the error in the UI if needed
        return;
      }

      const data = await response.json();
      console.log('Bear Data:', data);

      // Render the bear information
      this.renderBear(data);
    } catch (error) {
      console.error('Failed to fetch bear data:', error);
    }
  }

  renderBear(bear: any) {
    const moreBearsSection = document.querySelector('.more_bears');

    if (moreBearsSection) {
      const bearElement = document.createElement('div');
      bearElement.innerHTML = `
        <h3>${bear.title}</h3>
        <img src="${bear.thumbnail?.source || 'placeholder-image-url.jpg'}" alt="${bear.title}" style="width:200px; height:auto;">
        <p><strong>Description:</strong> ${bear.extract}</p>
      `;
      moreBearsSection.appendChild(bearElement);
    }
  }
}
