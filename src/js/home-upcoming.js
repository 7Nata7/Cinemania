const KEY = 'f1a48bce74b470ddc6475541cec139b4';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = `https://image.tmdb.org/t/p`;
const UPCOMING_URL = `${BASE_URL}/movie/upcoming`;
const IMG_W400 = `/w400`;

const upcomingContainer = document.querySelector('.upcoming__container');

function fetchUpcomingMovies() {
  return fetch(`${UPCOMING_URL}?api_key=${KEY}&language=en-US&page=1`).then(
    movieData => {
      if (!movieData.ok) {
        throw new Error(movieData.status);
      }
      return movieData.json();
    }
  );
}

// add function onClickRemind

async function getFetchedMovies() {
  try {
    const data = await fetchUpcomingMovies();
    const returnedResult = data.results;
    //   console.log(data.results);
    if (returnedResult.length >= 1) {
      const randomMovie =
        returnedResult[Math.floor(Math.random() * returnedResult.length)];
      const genreNames = await getGenresById(randomMovie.genre_ids);
      const createdMarkup = await renderMarkup({ ...randomMovie, genreNames });
      upcomingContainer.insertAdjacentHTML('beforeend', createdMarkup);
      document
        .querySelector('.upcoming__remindme-btn')
        .addEventListener('click', onClickRemind);
    }
  } catch (error) {
    console.log(error);
  }
}
getFetchedMovies();

async function renderMarkup({
  id,
  poster_path,
  backdrop_path,
  title,
  overview,
  popularity,
  vote_average,
  vote_count,
  release_date,
  genre_ids,
}) {
  const genreNames = await getGenresById(genre_ids);


    return `
    <div class="upcoming__card">
        <div class="upcoming__thumb">
            <picture class='upcoming__poster'>
            <source srcset="https://image.tmdb.org/t/p/original/${backdrop_path}" media="(min-width: 1200px)" class='upcoming__poster-desktop'/>
            <source srcset="https://image.tmdb.org/t/p/original/${backdrop_path}" media="(min-width: 768px)" class='upcoming__poster-tablet'/>
            <source srcset="https://image.tmdb.org/t/p/original/${poster_path}" media="(min-width: 320px)"/>
            <img src="https://image.tmdb.org/t/p/original/${poster_path}" alt="Movie Poster" style='width: 805px'/>
            </picture>
        </div>
    </div>
    <div class="upcoming__info">
        <h2 class="upcoming__info-title">${title}</h2>
        <div class="upcoming__movie">
            <div class="upcoming__info-left">
                <div class="upcoming__info-release">
                    <p class="upcoming__text"> <span class ="upcoming__light-black">Release date</span> </p>
                    <div class="upcoming__info-release-date">${release_date}</div>
                </div>
                <div class="upcoming__info-vote">
                    <p class="upcoming__text"><span class ="upcoming__light-black">Vote/Votes</span></p>
                     <div class="upcoming__info-votes"><span class="upcoming__info-white">${vote_average}</span> <span class="slash"> / </span><span class="upcoming__info-white"> ${vote_count}</span></div>                    </div>
                <div class="upcoming__info-pop">
                    <p class="upcoming__text"> <span class ="upcoming__light-black">Popularity</span> </p>
                    <div class="upcoming__info-pop-range">${popularity}</div>
                </div>
                <div class="upcoming__info-genre">
                    <p class="upcoming__text"><span class ="upcoming__light-black">Genre</span></p>
                    <div class="upcoming__info-genre-kind">${genreNames}</div>
                </div>
            </div>
        </div>
        <h2 class="upcoming__info-about">ABOUT</h2>

        <p class="upcoming__info-description">${overview}</p>
        <button class="upcoming__remindme-btn" data-movieid=${id}  type="button">Add to Library</button>
    </div>
     `;
}



async function getGenresById(genreIds) {
  const BASE_URL = `https://api.themoviedb.org/3/genre/movie/list`;
  const response = await fetch(`${BASE_URL}?api_key=${KEY}&language=en-US`);
  const data = await response.json();

  const genreNames = genreIds.map(genreId => {
    const genre = data.genres.find(genre => genre.id === genreId);
    return genre.name;
  });

  return genreNames.join(', ');
}