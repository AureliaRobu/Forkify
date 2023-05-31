import View from './View';
import { RecipeShort } from '../model';
import icons from 'url:../../img/icons.svg';
class PreviewView extends View {
  protected parentElement: HTMLDivElement;
  protected errorMessage: string =
    'No bookmarks yet. Find a nice recipe and bookmark it ;)';
  protected message: string = '';
  protected data: RecipeShort[] = [];
  constructor(parentEl: string, errorMsg: string) {
    super();
    this.parentElement = document.querySelector(parentEl)!;
    this.errorMessage = errorMsg;
  }

  public addHandlerRender(handler: EventListener) {
    window.addEventListener('load', handler);
  }

  protected generateMarkup(): string {
    return this.data.map(rec => this.generateMarkupPreview(rec)).join('');
  }
  private generateMarkupPreview(result: RecipeShort) {
    const id = window.location.hash.slice(1);
    return `<li class='preview'>
            <a class='preview__link ${
      result.id === id ? 'preview__link--active' : ''
    }' href='#${result.id}'>
              <figure class='preview__fig'>
                <img src='${result.image}' alt='${result.title}' />
              </figure>
              <div class='preview__data'>
                <h4 class='preview__title'>${result.title}</h4>
                <p class='preview__publisher'>${result.publisher}</p>
              
              <div class='preview__user-generated ${
      result.key ? '' : 'hidden'
    }'>
            <svg>
              <use href='${icons}#icon-user'></use>
            </svg>
          </div>
          </div>
            </a>
          </li>`;
  }
}
export const resultsView = new PreviewView(
  '.results',
  'No recipes found for your query! Please try again ;)'
);
export const bookmarksView = new PreviewView(
  '.bookmarks__list',
  'No bookmarks yet. Find a nice recipe and bookmark it ;)'
);
