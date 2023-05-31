import View from './View';
import { State } from '../model';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  protected data = {} as State;
  protected readonly parentElement: HTMLDivElement =
    document.querySelector('.pagination')!;
  protected readonly errorMessage: string = '';
  protected readonly message: string = '';

  public addHandlerPagination(handler: Function) {
    this.parentElement.addEventListener('click', function (ev) {
      ev.preventDefault();
      const btn = (ev.target as HTMLElement).closest(
        '.btn--inline'
      )! as HTMLButtonElement;
      if (!btn) return;
      const goToPage = +btn.dataset.goto!;
      handler(goToPage);
    });
  }

  protected generateMarkup() {
    const currentPage = this.data.search.page;
    const numPages = Math.ceil(
      this.data.search.results.length / this.data.search.resPerPage
    );

    // case page 1 and more pages present
    if (currentPage === 1 && numPages > 1) {
      return this.generateButtonMarkup('next');
    }
    // case last page
    if (currentPage === numPages && numPages > 1) {
      return this.generateButtonMarkup('prev');
    }
    // case other page
    if (currentPage < numPages) {
      return (
        this.generateButtonMarkup('prev') + this.generateButtonMarkup('next')
      );
    }
    // case page 1 and no more pages
    return ``;
  }
  private generateButtonMarkup(type: 'prev' | 'next'): string {
    const currentPage = this.data.search.page;

    return `<button data-goto='${
      type === 'prev' ? currentPage - 1 : currentPage + 1
    }'class='btn--inline pagination__btn--${type}'>
            <svg class='search__icon'>
              <use href='${icons}#icon-arrow-${
      type === 'prev' ? 'left' : 'right'
    }'></use>
            </svg>
            <span>Page ${
              type === 'prev' ? currentPage - 1 : currentPage + 1
            }</span>
          </button>`;
  }
}

export default new PaginationView();
