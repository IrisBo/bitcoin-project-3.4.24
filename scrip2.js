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
    divDisplay.classList.add("card");
    let divDisplayBody = document.createElement("div");
    divDisplayBody.classList.add("card-body");

    for (const key in obj) {
      if (key !== "id") {
        const coinData = document.createElement("p");
        coinData.innerText = [key] + ": " + " " + obj[key];
        coinData.classList.add("card-title")
        divDisplayBody.appendChild(coinData);
      }
      divDisplay.appendChild(divDisplayBody);
    }
    const moreInfoButton = document.createElement("button");
    moreInfoButton.classList.add("more-info-btn");
    let index = obj.id;
    // console.log(index);
    moreInfoButton.classList.add(obj.id);
    moreInfoButton.innerHTML = "more info";
    divDisplay.appendChild(moreInfoButton);

    moreInfoButton.addEventListener("click", async function () {
      coinMoreInfoData = await getMoreCoinInfo(index);
      // let testDiv = document.createElement("div")
      // testDiv.innerText="this is test"
      // divDisplayMoreInfoCoin.appendChild(testDiv)
      // divDisplay.setAttribute("height", "400px");
      displayMoreInfoCoin(coinMoreInfoData, divDisplay);

      // console.log(coinMoreInfoData);
    });

    const selectButton = document.createElement("input");
    selectButton.type = "checkbox";
    selectButton.classList.add("toggle-switch-btn");

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

function displayMoreInfoCoin(coinObj, parameter2) {
  let divMoreInfoDisplay = document.createElement("div");
  divMoreInfoDisplay.classList.add("card");

  for (const key in coinObj) {
    if (key === "market_data") {
      const coinData = document.createElement("p");
      coinData.innerHTML = coinObj[key].current_price.usd + "$";
      divMoreInfoDisplay.appendChild(coinData);
    } else if (key === "image") {
      const coinImage = document.createElement("img");
      coinImage.classList.add("card-img-top");
      coinImage.src = coinObj[key].small;
      divMoreInfoDisplay.appendChild(coinImage);
    }
  }

  parameter2.appendChild(divMoreInfoDisplay);
}
