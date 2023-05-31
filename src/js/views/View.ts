import { Recipe, RecipeShort, State } from '../model';
import icons from 'url:../../img/icons.svg';

export default abstract class View {
  protected abstract data: Recipe|RecipeShort[]|State;
  protected abstract parentElement:HTMLDivElement|HTMLFormElement;
  protected abstract errorMessage:string;
  protected abstract message:string;
  public render(data: Recipe|RecipeShort[]|State) {
    this.data = data;
    if (!data || (Array.isArray(data) && data.length ===0)) return this.renderError();
    const markup: string = this.generateMarkup();
    this.clean();
    this.parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  public update(data: Recipe|RecipeShort[]|State) {
    this.data = data;
    const newMarkup: string = this.generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this.parentElement.querySelectorAll('*'));
    newElements.forEach((newEl,i)=>{
      const curEl = curElements[i];
      if (!newEl.isEqualNode(curEl)&& newEl.firstChild  && newEl.firstChild!.nodeValue!.trim() !=='') {
        curEl.textContent = newEl.textContent;
      }
      if (!newEl.isEqualNode(curEl)){
        Array.from(newEl.attributes).forEach(attr=>{
          curEl.setAttribute(attr.name,attr.value)
        })
      }
    })

  }
  public renderSpinner() {
    const markup = `<div class="spinner">
          <svg>
            <use href=${icons}#icon-loader"></use>
          </svg>
        </div>`;
    this.clean();
    this.parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  public renderError(message: string = this.errorMessage) {
    const markup = `<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this.clean();
    this.parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  public renderMessage(message: string = this.message) {
    const markup = `<div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this.clean();
    this.parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  public clean() {
    this.parentElement.innerHTML = '';
  }

  protected abstract generateMarkup():string;
}