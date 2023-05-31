import { Ingredient, Recipe } from '../model';
import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';
import View from './View';

class RecipeView extends View {
  protected readonly parentElement: HTMLDivElement =
    document.querySelector('.recipe')!;
  protected readonly errorMessage: string =
    'We could not find that recipe, please try another one!';
  protected readonly message: string = '';
  protected data = {} as Recipe;

  public addHandlerRender(handler: EventListener) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }
  public addHandlerServings(handler: Function) {
    this.parentElement.addEventListener('click', function (ev) {
      const btn = (ev.target as HTMLElement).closest(
        '.btn--update-servings'
      )! as HTMLButtonElement;
      if (!btn) return;
      const updateTo = +btn.dataset.updateTo!;
      if (updateTo > 0 ) {
        handler(updateTo);
      }
    });
  }
  public addHandlerBookmarks(handler:Function){
    this.parentElement.addEventListener('click',function(ev){
      const btn = (ev.target as HTMLElement).closest('.btn--bookmark');
      if (!btn) return;
      handler();
    })
  }

  protected generateMarkup(): string {
    return `<figure class="recipe__fig">
          <img src="${this.data.image}" alt="Tomato" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this.data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this.data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="src/.svg#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this.data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to = '${
                this.data.servings - 1
              }'>
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to = '${
                this.data.servings + 1
              }'>
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this.data.key? '': 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${this.data.bookmarked? '-fill':''}"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${this.data.ingredients
            .map(ing => this.generateIngredientMarkup(ing))
            .join(' ')}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this.data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this.data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </>
        </div>`;
  }
  private generateIngredientMarkup(ing: Ingredient): string {
    return ` <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${
                ing.quantity ? new Fraction(ing.quantity).toString() : ''
              }</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing.unit ? ing.unit : ''}</span>
                ${ing.description}
              </div>
            </li>`;
  }
}

export default new RecipeView();
