let myDisplayArea = document.getElementById("display-area");
let mySearchButton = document.querySelector(".search-button");

let allCoinsArray = [];
let coinsDataFromStorage = ``;
let allCoinsArrayFromStorage = [];
let coinMoreInfoData = {};

async function getAllCoinsData() {
  let response = await fetch("https://api.coingecko.com/api/v3/coins/list");
  let allCoinsData = await response.json();
  return allCoinsData.slice(0, 100);
}

async function testing() {
  allCoinsArray = await getAllCoinsData();
  keepCoinDataLocalStorage(allCoinsArray);

  //   console.log(allCoinsArray);

  allCoinsArrayFromStorage = getCoinsDataFromStorage();

  createCoinCard(allCoinsArrayFromStorage, myDisplayArea);
}

testing();

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

function createCoinCard(coinArray, parameter) {
  coinArray.forEach((obj) => {
    let divDisplay = document.createElement("div");
    divDisplay.classList.add("coin-div-info");

    for (const key in obj) {
      if (key !== "id") {
        const coinData = document.createElement("p");
        coinData.innerText = obj[key];
        divDisplay.appendChild(coinData);
      }
    }
    const moreInfoButton = document.createElement("button");
    moreInfoButton.classList.add("more-info-btn");
    let index = obj.id;
    console.log(index);
    moreInfoButton.classList.add(obj.id);
    moreInfoButton.innerHTML = "more info";
    divDisplay.appendChild(moreInfoButton);
    moreInfoButton.addEventListener("click", function () {
      console.log(index);
      let moreCoinInfo = getMoreCoinInfo(index);
      console.log(moreCoinInfo);
    });

    const selectButton = document.createElement("input");
    selectButton.type = "checkbox";
    selectButton.classList.add("toggle-switch-btn");

    divDisplay.appendChild(selectButton);
    parameter.appendChild(divDisplay);
  });

  //  let myMoreCoinData=document.querySelector("."+ obj.id)
  //  myMoreCoinData.addEventListener("click",function () {
  //     console.log(obj.id)
  //  })

  //   let myMoreInfoButtons = document.querySelectorAll(".more-info-btn");
  //   myMoreInfoButtons.forEach((button) => {
  //     button.addEventListener("click", function () {
  //       console.log("11111");

  //   coinMoreInfoData = getMoreCoinInfo(obj.id);
  // });
  //   });
}

async function getMoreCoinInfo(coinId) {
  let response = await fetch(
    "https://api.coingecko.com/api/v3/coins/" + coinId
  );
  let coinMoreData = await response.json();
  console.log(coinMoreData);
  return coinMoreData;
}
// getMoreCoinInfo("0xaiswap")

function addEventListenerToButton(id) {
  let newbutton = document.querySelector("." + id);
  newbutton.addEventListener("click", function () {
    console.log(id);
  });
}
