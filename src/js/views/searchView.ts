class SearchView {
  private readonly parentEl:HTMLDivElement = document.querySelector('.search')!;
  get query(){
    return (this.parentEl.querySelector('.search__field')! as HTMLInputElement).value;
  }
public addHandlerSearch(handler:EventListener){
    this.parentEl.addEventListener('submit',function(ev){
      ev.preventDefault();
      handler(ev);
    })

}
public clearInput(){
    (this.parentEl.querySelector('.search__field')! as HTMLInputElement).value ='';
}
}

export default new SearchView();