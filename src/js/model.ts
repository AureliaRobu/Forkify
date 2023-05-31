import { API_URL, RES_PER_PAGE ,KEY} from './config';
import { AJAX } from './helpers';

export interface RecipeUpload {
  title: string;
  publisher: string;
  image_url: string;
  source_url: string;
  cooking_time: number;
  ingredients: Ingredient[];
  servings: number;
}
export interface Recipe extends RecipeShort {
  sourceUrl: string;
  cookingTime: number;
  ingredients: Ingredient[];
  servings: number;
  bookmarked?: boolean;
}
export interface Ingredient {
  quantity: number;
  unit: string;
  description: string;
}

export interface RecipeShort {
  id: string;
  title: string;
  publisher: string;
  image: string;
  key? :string;
}
export interface State {
  recipe: Recipe;
  search: {
    page: number;
    query: string;
    results: RecipeShort[];
    resPerPage: number;
  };
  bookmarks: Recipe[];
}

export const state: State = {
  recipe: {} as Recipe,
  search: {
    page: 1 as number,
    query: '' as string,
    results: [] as RecipeShort[],
    resPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function(data:any):Recipe{
  const { recipe } = data.data ;
  return  {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    ...(recipe.key && {key:recipe.key})
  };
}
export const loadRecipe = async function (id: string) {
  try {
    const data:RecipeUpload = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);


    state.recipe.bookmarked = state.bookmarks.some(
      bookmark => bookmark.id === id
    );
  } catch (err) {
    console.error(`${err} 💥💥💥💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query: string) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map((rec: any) => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && {key:rec.key})
      } as RecipeShort;
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥💥💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (
  page: number = state.search.page
): RecipeShort[] {
  state.search.page = page;
  const start: number = (page - 1) * RES_PER_PAGE;
  const end: number = page * RES_PER_PAGE;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings: number) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe: Recipe) {
  //   Add bookmark
  state.bookmarks.push(recipe);
  //   Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistBookmark();
};

export const deleteBookmark = function (id: string) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
  persistBookmark();
};
export const uploadRecipe = async function (newRecipe: any) {
  try {
    console.log(newRecipe);
    const ingredients: Ingredient[] = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = (ing[1] as string).replaceAll(' ', '').split(',');
        const ingArr = (ing[1] as string).split(',').map(ing =>ing.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format!'
          );
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        } as Ingredient;
      });
    const recipe :RecipeUpload= {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,

    };
   const data = await AJAX(`${API_URL}?key=${KEY}`,recipe);
   state.recipe = createRecipeObject(data);
   addBookmark(state.recipe);
    console.log(data);
  } catch (err) {
    throw err;
  }
};
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
};
init();
