import { MODAL_VIEW_SEC } from './config';
import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import { resultsView } from './views/PreviewView';
import paginationView from './views/paginationView';
import { bookmarksView } from './views/PreviewView';
import addRecipeView from './views/addRecipeView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { state } from './model';

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view with active selected recipe
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading recipe
    await model.loadRecipe(id);

    //  2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //  Get query
    const query = searchView.query;
    if (!query) return;
    // Load search results
    await model.loadSearchResults(query);
    // Render search results
    resultsView.render(model.getSearchResultsPage());
    // Render pagination
    paginationView.render(model.state);

    //Clear search input
    searchView.clearInput();
  } catch (err) {
    console.error(err);
  }
};
const controlPagination = function (goToPage: number) {
  // Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // Render NEW pagination
  paginationView.render(model.state);
};
const controlServings = function (newServings: number) {
  //   Update recipe servings (in state)
  model.updateServings(newServings);
  //   Update recipe view
  //   recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlBookmarks = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};
const controlRenderBookmarks = function () {
  bookmarksView.render(state.bookmarks);
};
const controlUploadRecipe = async function (newRecipe: any) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // Render recipe
    recipeView.render(model.state.recipe);
    // Success message
    addRecipeView.renderMessage();
    // Render bookmarks view
    bookmarksView.render(model.state.bookmarks);
    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(function () {
      addRecipeView.toggleWindow();
      addRecipeView.restoreForm();
    }, MODAL_VIEW_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError();
  }
};
const init = function () {
  // addRecipeView.addHandlerShowWindow();
  // addRecipeView.addHandlerHideWindow();
  addRecipeView.addHandlerUpload(controlUploadRecipe);
  bookmarksView.addHandlerRender(controlRenderBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmarks(controlBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
};
init();
