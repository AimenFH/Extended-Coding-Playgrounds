import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.setupCommentToggle();
    this.setupCommentForm();
    this.getBearData();
  }

  // Toggle Comments Section
  setupCommentToggle() {
    const showHideBtn = document.querySelector('.show-hide');
    const commentWrapper = document.querySelector('#comments-wrapper');

    if (!showHideBtn || !commentWrapper) {
      console.error('Required elements not found in the DOM');
      return;
    }

    const toggleCommentsVisibility = () => {
      const isVisible = commentWrapper.hasAttribute('hidden');
      if (isVisible) {
        commentWrapper.removeAttribute('hidden');
        showHideBtn.textContent = 'Hide comments';
      } else {
        commentWrapper.setAttribute('hidden', '');
        showHideBtn.textContent = 'Show comments';
      }
    };

    showHideBtn.addEventListener('click', toggleCommentsVisibility);
    showHideBtn.addEventListener('keydown', (event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key === 'Enter') {
        toggleCommentsVisibility();
      }
    });
  }

  // Add Comment Functionality
  setupCommentForm() {
    const form = document.querySelector('form');
    const nameField = document.querySelector('#name') as HTMLInputElement;
    const commentField = document.querySelector('#comment') as HTMLInputElement;
    const list = document.querySelector('ul');

    if (!form || !nameField || !commentField || !list) {
      console.error('Required form elements are missing from the DOM.');
      return;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const nameValue = nameField.value.trim();
      const commentValue = commentField.value.trim();

      if (!nameValue || !commentValue) {
        alert('Please fill out both name and comment fields.');
        return;
      }

      const listItem = document.createElement('li');
      listItem.innerHTML = `<strong>${nameValue}:</strong> ${commentValue}`;
      list.appendChild(listItem);

      nameField.value = '';
      commentField.value = '';
    });
  }

  // Fetch Image URL
  async fetchImageUrl(fileName: string): Promise<string> {
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

  // Extract and Display Bear Data
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

  // Fetch Bear Data
  async getBearData() {
    const baseUrl = 'https://en.wikipedia.org/w/api.php';
    const params = {
      action: 'parse',
      page: 'List_of_ursids',
      prop: 'wikitext',
      section: '3',
      format: 'json',
      origin: '*',
    };

    try {
      const response = await fetch(`${baseUrl}?${new URLSearchParams(params)}`);
      const data = await response.json();
      const wikitext = data.parse.wikitext['*'];
      await this.extractBears(wikitext);
    } catch (error) {
      console.error('Failed to fetch bear data:', error);
      alert('Failed to load bear data. Please try again later.');
    }
  }
}
