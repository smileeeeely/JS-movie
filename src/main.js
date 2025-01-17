const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#search");
const resultUl = document.querySelector("#cards");
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".closeBtn");
const pageTitle = document.querySelector("#pageTitle");

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
// search 데이터로 다른 영화 리스트도 다 가져오기
// query,,,param,,

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
  let movieCards = "";

  for (let i = 0; i < list.length; i++) {
    movieCards += `<div id="${list[i].id}" class="card" >
    <img id="${list[i].id}" class="cardImg" src= "${list[i].poster_url}">
    <p id="${list[i].id}" class="cardTitle">제목 : ${list[i].title}</p>
    <p id="${list[i].id}" calss="cardVoteAverage">평점 : ${list[i].vote_average}</p> </div>`;
  }
  resultUl.innerHTML = movieCards;
}
//index값 보다는 data mdn로 id 값 주기

/** image의 base url 받아오기 */
async function getImageBaseUrl(size = 1) {
  const configuration = await getPosterImageBaseUrl();

  const baseUrl =
    configuration.images.base_url + configuration.images.poster_sizes[size];

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
// 엔터로 했을때도 검색이 되게

/** input으로 들어온 검색어가 들어가는 영화들만 리스트에 나타나게 한다 */
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
  if(newList.length === 0){
    location.reload(true);
    alert("검색어와 일치하는 영화가 없습니다.");
  }
  renderCardList(newList);
}

/** 영화 카드 클릭했을 때 상세 페이지 카드 팝업 */
resultUl.addEventListener("click", function (e) {
  if (e.target.id !== "cards") {
      modal.style.display = "block";
      getTargetCardData(e.target.id);
  }
});

/** 클릭한 영화 카드의 데이터 가져오기 */
async function getTargetCardData(targetId) {
  // console.log(targetId);
  const list = await makeDataToCardList();
  // console.log(list);
  const test = list.filter((el) => el.id == targetId);
  renderPopUpCardDetail(test[0]);
}

/** 모달 상세페이지에 나올 내용 붙이기 */
function renderPopUpCardDetail(data) {
  console.log(data);
  const modal_content = document.querySelector(".modal-content");
  let card = "";
  card = `
    <span class="closeBtn">&times;</span>
    <img class="cardImg" src= "${data.poster_url}">
    <h2 id="modal-title">${data.title}</h2>
    <p>${data.release_date} </p>
    <p id="modal-body">개봉일 : ${data.overview}</p>
    <p>평점 : ${data.vote_average}</p>
  `;
  modal_content.innerHTML = card;
}

/** 모달 닫기 버튼 동작 */
document.body.addEventListener("click", function (e) {
  if(e.target.classList.contains("closeBtn"))
  modal.style.display = "none";
});

/** 페이지 타이틀 클릭하면 메인 화면으로 돌아가기 */
pageTitle.addEventListener("click", function(){
  location.reload(true);
})

async function main() {
  const list = await makeDataToCardList();

  await renderCardList(list);
}

main();
