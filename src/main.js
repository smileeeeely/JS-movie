const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#search");

/** API 받아올 때 필요한 옵션 */
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNDFkNWQwOGYyNmI4MjdjZGIwMjI3NWI1YTA3ZGUyZSIsIm5iZiI6MTczNjMwMDc0OS4zODYsInN1YiI6IjY3N2RkOGNkNDRkNjQ5ZmZhZTdhZjY2YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6gZEJi3HSzTTOvQiIZbbaa1jV08jQS6xkAuBbUAgOMw",
  },
};

/** 영화 포스터 이미지 불러올 base URL 가져오기
https://developer.themoviedb.org/reference/configuration-details */
async function getPosterImageBaseUrl() {
  const response = await fetch(
    "https://api.themoviedb.org/3/configuration",
    options
  );
  return await response.json();
}

/**  TMDB API로 인기 영화 데이터 가져오기
https://developer.themoviedb.org/reference/movie-popular-list*/
async function getPopularMoviesData(page = 1) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?language=ko-KOR&page=${page}`,
    options
  );

  return await response.json();
}

/** 받아온 데이터 카드 리스트로 바꾸기 */
async function makeDataToCardList() {
  const movies = await getPopularMoviesData();
  const baseImageUrl = await getImageBaseUrl();
  const cardList = [];

  for (let i = 0; i < movies.results.length; i += 1) {
    const card = movies.results[i];
    card.poster_url = `${baseImageUrl}/${card.poster_path}`;

    cardList.push(card);
  }

  return cardList;
}

/** 카드리스트 화면에 띄우기 */
async function renderCardList(list) {
  const resultUl = document.querySelector("#cards");
  console.log(`search input list : `, list);
  let movieCards = "";

  for (let i = 0; i < list.length; i++) {
    movieCards += `<div class="card">
    <img class="cardImg" src= "${list[i].poster_url}">
    <p class="cardTitle">제목 : ${list[i].title}</p>
    <p calss="cardVoteAverage">평점 : ${list[i].vote_average}</p> </div>`;
  }
  resultUl.innerHTML = movieCards;
}

/** image의 base url 받아오기 */
async function getImageBaseUrl() {
  const configuration = await getPosterImageBaseUrl();

  const baseUrl =
    configuration.images.base_url + configuration.images.poster_sizes[1];

  return baseUrl;
}

/** 검색 value 받아오기 */
searchBtn.addEventListener("click", function () {
  let input = searchInput.value;
  if (input.length !== 0) {
    input = input.toUpperCase();
  } else {
    alert("검색 결과가 없습니다.");
  }
  getSearchInputList(input);
});

// input으로 들어온 검색어가 들어가는 영화들만 리스트에 나타나게 한다
async function getSearchInputList(input) {
  console.log(input);
  const list = await makeDataToCardList();

  const newList = list.filter(function (movie) {
    const originalTitle = movie.original_title.toUpperCase();
    if (originalTitle.includes(input)) {
      return input;
    }
    return movie.title.includes(input);
  });

  renderCardList(newList);
}

async function main() {
  const list = await makeDataToCardList();

  await renderCardList(list);
}

main();
