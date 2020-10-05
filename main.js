"use strict"
const url = "https://games-app-siit.herokuapp.com/games/";
const allGamesContainer = document.getElementById("games-container");
const allGames = document.getElementById('game-collection');
const detailedSelected = document.getElementById('detailed-selected');
const selectedGame = document.getElementById('selected-game');
const preloader = document.getElementById('preloader');
const postLink = document.getElementById("postLink");
const postForm = document.getElementById("postForm");

const titleToPost = document.getElementById("title");
const genreToPost = document.getElementById("genre");
const publisherToPost = document.getElementById("publisher");
const imageUrlToPost = document.getElementById("imageUrl");
const descriptionToPost = document.getElementById("description");

getAllGames();

postLink.addEventListener("click", showTheForm);
postForm.addEventListener("submit", postAnItem);

function showTheForm(event){
    event.preventDefault();
    allGamesContainer.classList.add("hide");
    detailedSelected.classList.add("hide");
    postForm.classList.remove("hide");
}

function getAllGames() {
    preloader.classList.remove("hide");
    allGamesContainer.classList.add("hide");
    postForm.classList.add("hide");
    selectedGame.innerHTML = "";

    fetch(url)
    .then(request => request.json())
    .then(data => drawPresentationPage(data))
}

function drawPresentationPage(data) {
    data.forEach((element, index ) => {
        const gameContainer = document.createElement("article");
        gameContainer.setAttribute("id", element._id);
        gameContainer.classList.add("game-container");

        const aboutContainer = document.createElement("div");

        const articleTitle = document.createElement("h3");
        articleTitle.innerHTML = element.title;
        aboutContainer.append(articleTitle);
        
        const articleDescription = document.createElement("p");
        articleDescription.innerText = element.description;
        articleDescription.classList.add("article-description");
        aboutContainer.append(articleDescription);

        const articleImage = document.createElement("img");
        articleImage.setAttribute("src", element.imageUrl);
        articleImage.classList.add("article-image");
        gameContainer.append(articleImage);

        const articleSeeMore = document.createElement("p");
        articleSeeMore.innerText = "See More >>>";
        articleSeeMore.classList.add("float-right");
        aboutContainer.append(articleSeeMore);

        gameContainer.append(aboutContainer);

        allGames.append(gameContainer);

        gameContainer.addEventListener("click", () => getGameDetails(data, index));
        
        allGamesContainer.classList.remove("hide");
        preloader.classList.add("hide");
    });
}

function getGameDetails(arrData, i) {
    allGames.innerHTML = "";
    detailedSelected.classList.add("hide");
    preloader.classList.remove("hide");

    fetch(url + arrData[i]._id)
    .then(response => response.json())
    .then(data => drawChosenOption(data))
}

function drawChosenOption(selected) {
    const chosenGame = document.createElement("div");
    chosenGame.classList.add("row");

    const chosenGamePicture = document.createElement('img');
    chosenGamePicture.classList.add("col-lg-5", "col-md-10");
    chosenGamePicture.setAttribute('src', selected.imageUrl);
    chosenGame.append(chosenGamePicture);

    const datailedSection = document.createElement("div");
    datailedSection.classList.add("col-lg-7");

    const chosenGameTitle = document.createElement('h1');
    chosenGameTitle.innerText= selected.title;
    datailedSection.append(chosenGameTitle);

    const chosenGameReleaseDate = document.createElement('p');
    let date = new Date((selected.releaseDate)*1000);
    chosenGameReleaseDate.innerHTML =`<b>Release date: </b> <small>${date}</small>`;
    datailedSection.append(chosenGameReleaseDate);

    const chosenGameGenre = document.createElement('p');
    chosenGameGenre.innerHTML =`<b>Genre: </b> ${selected.genre}`;
    datailedSection.append(chosenGameGenre);
    
    const chosenGamePublisher = document.createElement('p');
    chosenGamePublisher.innerHTML =`<b>Publisher: </b> ${selected.publisher}`;
    datailedSection.append(chosenGamePublisher);
    
    const chosenGameDescription = document.createElement('p');
    chosenGameDescription.innerText = selected.description;
    datailedSection.append(chosenGameDescription);
    
    chosenGame.append(datailedSection);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-danger","btn-block", "m-4");
    deleteButton.innerText = "Delete";
    deleteButton.setAttribute("data-remove", selected._id);
    chosenGame.append(deleteButton);

    deleteButton.addEventListener("click", removeTheGame);
    
    const updateLink = document.createElement("button");
    updateLink.classList.add("float-right", "btn", "btn-warning", "mt-2");
    updateLink.innerText = "Edit";
    datailedSection.prepend(updateLink);

    updateLink.addEventListener("click", () => setUpdateFields(selected, updateLink, deleteButton));
    
    selectedGame.append(chosenGame);

    detailedSelected.classList.remove("hide");
    preloader.classList.add("hide");
}

function setUpdateFields(selected, updateLink, deleteButton) {
    const postTitle = document.getElementById("postTitle");
    const updateButton = document.createElement("button");

    titleToPost.value = selected.title;
    genreToPost.value = selected.genre;
    publisherToPost.value = selected.publisher;
    imageUrlToPost.value = selected.imageUrl;
    descriptionToPost.value = selected.description;
    
    showTheForm(event);
    
    postTitle.classList.add("hide");
    updateLink.classList.add("hide");   
    deleteButton.classList.add("hide");
    postLink.classList.add("hide");
    postButton.style.display = "none";

    updateButton.innerText = "Update";
    updateButton.setAttribute("data-update", selected._id);
    updateButton.classList.add("btn", "btn-warning", "btn-lg", "btn-block", "mt-3", "mb-5");

    postForm.append(updateButton);
    updateButton.addEventListener("click", updateTheGame);
}

function removeTheGame(event) {
    let removableId = event.target.dataset.remove; 

    fetch(url+removableId, 
        {method:'DELETE'})
    .then(response => response.json())
    .then(res => console.log(res))
    setTimeout(() => location.reload(),1000);
}

function postAnItem(event) {
    event.preventDefault();

    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            title : titleToPost.value,
            releaseDate : parseInt(Date.now()/1000),
            genre : genreToPost.value,
            publisher : publisherToPost.value,
            imageUrl : imageUrlToPost.value,
            description : descriptionToPost.value
        }),
        headers:{
            "Content-Type":"application/json"
        }
    })
    .then(response => response.json())
    .then(resp => console.log(resp))
}

function updateTheGame(event) {
    event.preventDefault();
    let updateId = event.target.dataset.update; 

    fetch(url + updateId, {
        method: 'PUT',
        body: JSON.stringify({
            title : titleToPost.value,
            genre : genreToPost.value,
            publisher : publisherToPost.value,
            imageUrl : imageUrlToPost.value,
            description : descriptionToPost.value
        }),
        headers:{
            "Content-Type":"application/json"
        }
    })
    .then(response => response.json())
    .then(resp => console.log(resp))
}
