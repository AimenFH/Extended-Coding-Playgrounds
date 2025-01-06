import { TestBed } from '@angular/core/testing';

describe('Main functionality', () => {
  let showHideBtn: HTMLButtonElement;
  let commentWrapper: HTMLDivElement;
  let form: HTMLFormElement;
  let nameField: HTMLInputElement;
  let commentField: HTMLTextAreaElement;
  let list: HTMLUListElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <button class="show-hide">Show comments</button>
      <div class="comment-wrapper" style="display: none;"></div>
      <form class="comment-form">
        <input id="name" type="text" />
        <textarea id="comment"></textarea>
        <button type="submit">Submit</button>
      </form>
      <ul class="comment-container"></ul>
      <div class="more_bears"></div>
    `;

    showHideBtn = document.querySelector('.show-hide') as HTMLButtonElement;
    commentWrapper = document.querySelector('.comment-wrapper') as HTMLDivElement;
    form = document.querySelector('.comment-form') as HTMLFormElement;
    nameField = document.querySelector('#name') as HTMLInputElement;
    commentField = document.querySelector('#comment') as HTMLTextAreaElement;
    list = document.querySelector('.comment-container') as HTMLUListElement;

    // Add event listener to toggle comments visibility
    showHideBtn.addEventListener('click', () => {
      if (commentWrapper.style.display === 'none') {
        commentWrapper.style.display = 'block';
        showHideBtn.textContent = 'Hide comments';
      } else {
        commentWrapper.style.display = 'none';
        showHideBtn.textContent = 'Show comments';
      }
    });

    // Add event listener to handle form submission
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const listItem = document.createElement('li');
      listItem.innerHTML = `<p>${nameField.value}</p><p>${commentField.value}</p>`;
      list.appendChild(listItem);
    });

    // Mock window.alert
    spyOn(window, 'alert');
  });

  it('should toggle comments visibility', () => {
    showHideBtn.click();
    expect(showHideBtn.textContent).toBe('Hide comments');
    expect(commentWrapper.style.display).toBe('block');

    showHideBtn.click();
    expect(showHideBtn.textContent).toBe('Show comments');
    expect(commentWrapper.style.display).toBe('none');
  });

  it('should add a new comment to the list', () => {
    nameField.value = 'John Doe';
    commentField.value = 'This is a comment';

    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    const listItem = list.querySelector('li');
    expect(listItem).not.toBeNull();
    expect(listItem?.querySelector('p:nth-child(1)')?.textContent).toBe('John Doe');
    expect(listItem?.querySelector('p:nth-child(2)')?.textContent).toBe('This is a comment');
  });
});
