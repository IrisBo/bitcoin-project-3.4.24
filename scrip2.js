// *document connections
let myDisplayArea = document.getElementById("display-area");
let mySearchButton = document.querySelector(".search-button");
// *צריכה להוסיף את הקישורים לטאבים בראש הדף

// *define parameters
let allCoinsArray = [];
let coinsDataFromStorage = ``;
let allCoinsArrayFromStorage = [];
let coinMoreInfoData = {};

// *main async function when loading page

document.addEventListener("DOMContentLoaded", async function () {
  allCoinsArray = getCoinsDataFromStorage();
  if (!allCoinsArray.length) {
    allCoinsArray = await getAllCoinsData();
    keepCoinDataLocalStorage(allCoinsArray);
  }

  createCoinCard(allCoinsArray, myDisplayArea);
});

// *function to save to local storage and one to retrieve

function keepCoinDataLocalStorage(array) {
  const myCoinsToString = JSON.stringify(array);
  localStorage.setItem("allCoins", myCoinsToString);
}
function getCoinsDataFromStorage() {
  coinsDataFromStorage = localStorage.getItem("allCoins");
  let coinDataBack = [];
  coinDataBack = JSON.parse(coinsDataFromStorage);
  return coinDataBack;
}

// *function to create a coin card  and button
// צריכה להפריד ולעשות פונקציה לכפתור בנפרד
// צריכה גם להפריד וליצור צקבוקס או טוגלה בנפרד

function createCoinCard(coinArray, parameter) {
  coinArray.forEach((obj) => {
    let divDisplay = document.createElement("div");
    divDisplay.classList.add("card","shadow-lg");
    let divDisplayBody = document.createElement("div");
    divDisplayBody.classList.add("card-body");

    for (const key in obj) {
      if (key !== "id") {
        const coinData = document.createElement("li");
        coinData.innerText = [key] + ": " + " " + obj[key];
        coinData.classList.add("card-text");
        divDisplayBody.appendChild(coinData);
      }
      divDisplay.appendChild(divDisplayBody);
    }
    const moreInfoButton = document.createElement("button");
    moreInfoButton.classList.add("more-info-btn");
    let index = obj.id;
    // console.log(index);
    moreInfoButton.classList.add(index);
    // moreInfoButton.setAttribute("type", "button");
    // moreInfoButton.setAttribute("data-bs-toggle", "collapse");
    // moreInfoButton.setAttribute("data-bs-target", `#collapse-${index}`);
    // moreInfoButton.setAttribute("aria-expanded", "false");
    // moreInfoButton.setAttribute("aria-controls", `collapse-${index}`);
    moreInfoButton.innerHTML = "more info";
    divDisplay.appendChild(moreInfoButton);

    moreInfoButton.addEventListener("click", async function () {
      const coinMoreInfoData = await getMoreCoinInfo(index);

      displayMoreInfoCoin(coinMoreInfoData, divDisplayBody, moreInfoButton);
      moreInfoButton.style.display = "none";
      // console.log(coinMoreInfoData);
    });

    const selectButton = document.createElement("input");
    selectButton.type = "checkbox";
    selectButton.classList.add("toggle-switch-btn");
    selectButton.classList.add(obj.id);
    selectButton.setAttribute("role", "switch");
    selectButton.setAttribute("id", "flexSwitchCheckDefault");
    divDisplay.appendChild(selectButton);

    parameter.appendChild(divDisplay);
  });
}

// *function fetch all coin data+function to fetch one coin more data

async function getAllCoinsData() {
  let response = await fetch("https://api.coingecko.com/api/v3/coins/list");
  let allCoinsData = await response.json();
  return allCoinsData.slice(0, 100);
}

async function getMoreCoinInfo(coinId) {
  let response = await fetch(
    "https://api.coingecko.com/api/v3/coins/" + coinId
  );
  let coinMoreData = await response.json();
  console.log(coinMoreData);
  return coinMoreData;
}

// *function for more info button

function displayMoreInfoCoin(coinObj, parameter2, button) {
  let divMoreInfoDisplay = document.createElement("div");
  divMoreInfoDisplay.classList.add("card-body");

  for (const key in coinObj) {
    if (key === "market_data") {
      const coinData = document.createElement("p");
      coinData.innerHTML = coinObj[key].current_price.usd + "$";
      divMoreInfoDisplay.appendChild(coinData);
      const coinDataEur = document.createElement("p");
      coinDataEur.innerHTML = coinObj[key].current_price.eur + "€";
      divMoreInfoDisplay.appendChild(coinDataEur);
    } else if (key === "image") {
      const coinImage = document.createElement("img");
      coinImage.classList.add("card-img-top");
      coinImage.src = coinObj[key].large;
      divMoreInfoDisplay.appendChild(coinImage);
    }
  }
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn", "btn-danger");
  deleteButton.innerHTML = "X";
  divMoreInfoDisplay.appendChild(deleteButton);

  // Add event listener to delete button
  deleteButton.addEventListener("click", function () {
    // Remove the additional info and the delete button
    divMoreInfoDisplay.remove();
    deleteButton.remove();
    button.style.display = "block";
  });

  parameter2.appendChild(divMoreInfoDisplay);
}
