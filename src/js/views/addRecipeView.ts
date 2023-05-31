import View from './View';
import { Recipe } from '../model';

class AddRecipeView extends View {
  formHTML:string;
  parentElement: HTMLFormElement = document.querySelector('.upload')!;
  errorMessage = 'Wrong ingredient format! Please use the correct format!';
  message = 'Recipe was successfully uploaded :) ';
  data = {} as Recipe;
  private window = document.querySelector(
    '.add-recipe-window'
  ) as HTMLDivElement;
  private overlay = document.querySelector('.overlay') as HTMLDivElement;
  private btnOpen = document.querySelector(
    '.nav__btn--add-recipe'
  ) as HTMLButtonElement;
  private btnClose = document.querySelector(
    '.btn--close-modal'
  ) as HTMLButtonElement;

  constructor() {
    super();
    this.addHandlerShowWindow();
    this.addHandlerHideWindow();
    this.formHTML = this.parentElement.innerHTML;
  }

  public restoreForm(){
    this.parentElement.innerHTML = this.formHTML;
  }


  protected generateMarkup(): string {
    return '';
  }
  public toggleWindow() {
    this.window.classList.toggle('hidden');
    this.overlay.classList.toggle('hidden');
  }

  public addHandlerShowWindow() {
    this.btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

   public addHandlerHideWindow() {
    this.btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this.overlay.addEventListener('click', this.toggleWindow.bind(this));
  }
  public addHandlerUpload(handler:Function){
    this.parentElement.addEventListener('submit',function(ev){
      ev.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    })
  }
}

export default new AddRecipeView();
