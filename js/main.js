"use strict";

const mainFragment = document.createDocumentFragment();
const elCardList = document.querySelector(".js-movie-list");
const elTemplateMovie = document.querySelector(".js-template").content;

// Use const for constant values
const MAX_MOVIES_TO_DISPLAY = 200;

let sliceMovie = movies.slice(0, MAX_MOVIES_TO_DISPLAY);

let getHoursAndMin = (data) => {
  const hours = Math.floor(data / 60);
  const min = data % 60;
  return `${hours} h ${min} min`;
};

let renderMovies = (arr, node) => {
  arr.forEach((movie) => {
    const cloneTemplate = elTemplateMovie.cloneNode(true);
    cloneTemplate.querySelector(".js-movie-image").src = movie.image_url;
    cloneTemplate.querySelector(".js-movie-name").textContent = String(
      movie.title
    ).substring(0, 15);
    cloneTemplate.querySelector(".js-movie-rating").textContent =
      movie.imdb_rating;
    cloneTemplate.querySelector(".js-movie-year").textContent =
      movie.movie_year;
    cloneTemplate.querySelector(".js-movie-watch-time").textContent =
      getHoursAndMin(movie.runtime);
    cloneTemplate.querySelector(".js-movie-genres").textContent =
      movie.categories.join(", ");
    cloneTemplate.querySelector(".js-modal-btn").dataset.imdbId = movie.imdb_id;

    mainFragment.appendChild(cloneTemplate);
  });

  node.appendChild(mainFragment);
};

renderMovies(sliceMovie, elCardList);

// Search functionality
const elFormSearch = document.querySelector(".js-form-search");
const elInput = document.querySelector(".js-input-search");

let searchedMovie = (evt) => {
  evt.preventDefault();
  elCardList.innerHTML = "";
  const inputValue = elInput.value.toLowerCase().trim();
  const matchingMovies = sliceMovie.filter((movie) =>
    String(movie.title).toLowerCase().includes(inputValue)
  );
  renderMovies(matchingMovies, elCardList);
};

elFormSearch.addEventListener("submit", searchedMovie);

// filter by categories
const handleFilterCategories = (arr) => {
  let result = [];
  for (const movie of arr) {
    const categories = movie.categories;
    for (const category of categories) {
      if (!result.includes(category.trim())) {
        result.push(category.trim());
      }
    }
  }
  return result;
};

const createCategories = () => {
  const elCategorySelect = document.querySelector(".js-category-select");
  const categories = handleFilterCategories(sliceMovie);
  const fragmentOptions = document.createDocumentFragment();

  categories.forEach((category) => {
    let option = document.createElement("option");
    option.classList.add("font-bold");
    option.value = category;
    option.textContent = category;
    fragmentOptions.appendChild(option);
  });

  elCategorySelect.appendChild(fragmentOptions);
};

createCategories();

const sortMovies = (arr, sortBy) => {
  return arr.sort((a, b) => {
    if (sortBy === "AtoZ") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "ZtoA") {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });
};

const elSelectcategoryForm = document.querySelector(".js-select-option-form");
const elSelectOptionInput = document.querySelector(".js-select-option-input");

const filterByCategoryAndYear = (evt) => {
  evt.preventDefault();
  elCardList.innerHTML = "";

  const selectedCategory = elSelectOptionInput.value.trim().toLowerCase();
  let moviesToDisplay = sliceMovie;

  // Filter by category
  if (selectedCategory !== "all") {
    moviesToDisplay = moviesToDisplay.filter((movie) =>
      movie.categories
        .map((category) => category.toLowerCase())
        .includes(selectedCategory)
    );
  }

  // Filter by year range
  const minYear = parseInt(document.getElementById("minYear").value) || 0;
  const maxYear =
    parseInt(document.getElementById("maxYear").value) ||
    new Date().getFullYear();

  if (!isNaN(minYear) && !isNaN(maxYear) && minYear <= maxYear) {
    moviesToDisplay = moviesToDisplay.filter(
      (movie) => movie.movie_year >= minYear && movie.movie_year <= maxYear
    );
  }

  // Sort and render
  const sortBy = document.getElementById("sort").value;
  moviesToDisplay = sortMovies(moviesToDisplay, sortBy);
  renderMovies(moviesToDisplay, elCardList);
};

elSelectcategoryForm.addEventListener("submit", filterByCategoryAndYear);

//!  modal
const elModal = document.querySelector(".js-modal");
const elCloseModal = document.querySelector(".js-modal-close");
const elframe = document.querySelector(".js-frame-modal");
const elModalTitle = document.querySelector(".js-movie-title-modal");
const elMovierating = document.querySelector(".js-movie-rating-modal");
const elMovieYear = document.querySelector(".js-movie-year-modal");
const elMovieRuntime = document.querySelector(".js-movie-watch-time-modal");
const elModalSummary = document.querySelector(".js-summary-modal");
const elMovieModalLink = document.querySelector(".js-movie-link-modal");

elCardList.addEventListener("click", (event) => {
  if (event.target.matches(".js-modal-btn")) {
    const imdbId = event.target.dataset.imdbId;
    const clickedMovie = sliceMovie.find((movie) => movie.imdb_id === imdbId);
    if (clickedMovie) {
      openModal(clickedMovie);
    }
  }
});

function openModal(movie) {
  elModal.classList.remove("hidden");
  elCloseModal.addEventListener("click", (evet) => {
    elModal.classList.add("hidden");
  });

  elframe.src = movie.movie_frame;
  elModalTitle.textContent = movie.full_title;
  elMovierating.textContent = movie.imdb_rating;
  elMovieYear.textContent = movie.movie_year;
  elMovieRuntime.textContent = getHoursAndMin(movie.runtime);
  elModalSummary.textContent = movie.summary.substring(0, 300);
  elMovieModalLink.href = movie.imdb_link;
}
