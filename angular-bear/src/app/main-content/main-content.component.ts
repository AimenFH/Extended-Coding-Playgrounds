// main-content.component.ts
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
      this.getBearData();
    }
  }

  async fetchImageUrl(fileName: string) {
    const baseUrl = 'https://en.wikipedia.org/w/api.php';
    const params = {
      action: 'query',
      titles: `File:${fileName}`,
      prop: 'imageinfo',
      iiprop: 'url',
      format: 'json',
      origin: '*',
    };

    try {
      const response = await fetch(`${baseUrl}?${new URLSearchParams(params)}`);
      const data = await response.json();
      const pages = data.query.pages;
      const imageInfo = (Object.values(pages)[0] as any)?.imageinfo?.[0]?.url;

      return imageInfo && imageInfo.startsWith('http') ? imageInfo : 'placeholder-image-url.jpg';
    } catch (error) {
      console.error('Failed to fetch image URL:', error);
      return 'placeholder-image-url.jpg';
    }
  }

  async extractBears(wikitext: string) {
    const speciesTables = wikitext.split('{{Species table/end}}');
    const bears = [];

    for (const table of speciesTables) {
      const rows = table.split('{{Species table/row');
      for (const row of rows) {
        const nameMatch = row.match(/\|name=\[\[(.*?)\]\]/);
        const binomialMatch = row.match(/\|binomial=(.*?)\n/);
        const imageMatch = row.match(/\|image=(.*?)\n/);
        const rangeMatch = row.match(/\|range=(.*?)\n/);

        if (nameMatch && binomialMatch && imageMatch) {
          const fileName = imageMatch[1].trim().replace('File:', '');
          const imageUrl = await this.fetchImageUrl(fileName);

          bears.push({
            name: nameMatch[1],
            binomial: binomialMatch[1],
            image: imageUrl,
            range: rangeMatch ? rangeMatch[1].replace(/\[\[|\]\]/g, '') : 'Range data not available',
          });
        }
      }
    }

    const moreBearsSection = document.querySelector('.more_bears');
    if (moreBearsSection) {
      bears.forEach((bear) => {
        const bearElement = document.createElement('div');
        bearElement.innerHTML = `
          <h3>${bear.name} (${bear.binomial})</h3>
          <img src="${bear.image}" alt="${bear.name}" style="width:200px; height:auto;">
          <p><strong>Range:</strong> ${bear.range}</p>
        `;
        moreBearsSection.appendChild(bearElement);
      });
    }
  }

  async getBearData() {
    const baseUrl = 'http://localhost:3000/api/bear/List_of_ursids'; // Update to your backend API URL

    try {
      const response = await fetch(baseUrl);
      const data = await response.json();
      const wikitext = data.parse.wikitext['*'];
      await this.extractBears(wikitext);
    } catch (error) {
      console.error('Failed to fetch bear data:', error);
      alert('Failed to load bear data. Please try again later.');
    }
  }
}
