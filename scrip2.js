// *document connections
const myDisplayArea = document.getElementById("display-area");
const mySearchButton = document.querySelector(".search-button");
const mySearchInput = document.querySelector(".search-input");
const myDisplayChartsArea= document.querySelector("#coinChart");


// *define parameters
let allCoinsArray = [];
let coinsDataFromStorage = ``;
let allCoinsArrayFromStorage = [];
let coinMoreInfoData = {};

let selectedCoins = [];
const maxSelections = 5




mySearchButton.addEventListener("click", function () {
  filterCards(mySearchInput.value);
});

// *main async function when loading page

document.addEventListener("DOMContentLoaded", async function () {
  allCoinsArray = getCoinsDataFromStorage("allCoins");

  if (!allCoinsArray || !allCoinsArray.length) {
    allCoinsArray = await getAllCoinsData();
    keepCoinDataLocalStorage("allCoins",allCoinsArray);
  }

  createCoinCard(allCoinsArray, myDisplayArea);
});

// *function to save to local storage and one to retrieve

function keepCoinDataLocalStorage(arrayName,array) {
  const myCoinsToString = JSON.stringify(array);
  localStorage.setItem(arrayName, myCoinsToString);
}
function getCoinsDataFromStorage(arrayName) {
  coinsDataFromStorage = localStorage.getItem(arrayName);
  let coinDataBack = [];
  coinDataBack = JSON.parse(coinsDataFromStorage);
  return coinDataBack;
}

// *function to create a coin card  and button

function createCoinCard(coinArray, parameter) {
  coinArray.forEach((obj) => {
    let divDisplay = document.createElement("div");
    divDisplay.classList.add("card");
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

    let index = obj.id;
    let coinName= obj.symbol;

    const moreInfoButton = createButton(index, divDisplay);
    moreInfoButton.addEventListener("click", async function () {
      const coinMoreInfoData = await getMoreCoinInfo(index);

      displayMoreInfoCoin(coinMoreInfoData, divDisplayBody, moreInfoButton);
      moreInfoButton.style.display = "none";
    });  
   
    let isSelected = false;

    const selectButtonDiv = createSelectButton(index, divDisplay);
    selectButtonDiv.addEventListener("click", function () {
      
      isSelected = !isSelected; // Toggle the state

      if (isSelected) {
        if (selectedCoins.length >= maxSelections) {
          isSelected=false;
          alert("No more selections allowed. " + maxSelections + " coins.")
        }
          else{
        selectedCoins.push(coinName);
          }
      } else {
        const coinIndex = selectedCoins.indexOf(coinName);
        if (coinIndex > -1) {
          selectedCoins.splice(coinIndex, 1); // Remove index from the global array
        }
      }

      if (selectedCoins.length === maxSelections) {
        displaySelectedCoins(selectedCoins);
      }
    });
    
    parameter.appendChild(divDisplay);
  });
}


// Function to display selected coins in the modal
function displaySelectedCoins(coins) {
  const selectedCoinsList = document.getElementById('selectedCoinsList');
  
  // Create a list element to display selected coins
  const list = document.createElement('ul');
  selectedCoinsList.innerHTML = "";
  selectedCoinsList.innerHTML = "<h3>Selected Coins:</h3>";
  
  coins.forEach(coin => {
      const listItem = document.createElement('li');
      listItem.textContent = `Coin ${coin}`;
      const removeButton = document.createElement('button');
      removeButton.textContent = 'X';
      removeButton.classList.add("remove-from-list");

    removeButton.addEventListener('click', function() {
      const coinIndex = selectedCoins.indexOf(coin);
      if (coinIndex > -1) {
        selectedCoins.splice(coinIndex, 1); // Remove the coin from the global array
      }
      displaySelectedCoins(selectedCoins); // Update the display
    }
  )
  listItem.appendChild(removeButton);
    list.appendChild(listItem);
  });
  
  // Append the list to the display area
  selectedCoinsList.appendChild(list);

  // Create and append the save button below the list

  // const saveButton = document.createElement('button');
  // saveButton.textContent = 'Save Selection';
  // saveButton.classList.add("save-button");
  // saveButton.addEventListener('click', function() {
  //   // promptRetrieveSavedData()
  //   // keepCoinDataLocalStorage("selectedCoins",selectedCoins);
  //   // alert("Selections saved!");
  // });
 
  const displayCoinsToChartsButton= document.createElement('button');
  displayCoinsToChartsButton.textContent= "Display in charts";
  displayCoinsToChartsButton.classList.add("display-in-chart-button");

  // creating the display chart functions and buttons
  displayCoinsToChartsButton.addEventListener('click',async function() { 
    keepCoinDataLocalStorage("selectedCoins",selectedCoins);

    if (fetchInterval) {
      clearInterval(fetchInterval);
  }
    let selectedCoinsData = await getAllCoinsForCharts(selectedCoins);
    updateChartData(selectedCoinsData);
    displayCoinDataInChart();

  fetchInterval = setInterval(async function() {
    const selectedCoinsData = await getAllCoinsForCharts(selectedCoins);
    updateChartData(selectedCoinsData);
    displayCoinDataInChart();
}, 2000);

const modal = document.getElementById("myModal");
if (modal) {
  modal.style.display = "none";
}

// Switch to the charts tab
const chartsTabButton = document.getElementById("contact-tab");
  if (chartsTabButton) {
    chartsTabButton.click(); // Trigger the tab switch programmatically
  }
});

  selectedCoinsList.appendChild(displayCoinsToChartsButton);
  // selectedCoinsList.appendChild(saveButton);

  // Show the coins modal
  const modal = document.getElementById("myModal");
  modal.style.display = "block";
}

// Handle closing the modal
const span = document.getElementsByClassName("close")[0];
span.onclick = function() {
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
}

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
  const modal = document.getElementById("myModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
}






// *function fetch all coin data+function to fetch one coin more data

async function getAllCoinsData() {
  let response = await fetch("https://api.coingecko.com/api/v3/coins/list");
  let allCoinsData = await response.json();
  return allCoinsData;
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
      const coinDataIls = document.createElement("p");
      coinDataIls.innerHTML = coinObj[key].current_price.ils + "₪";
      divMoreInfoDisplay.appendChild(coinDataIls);
    } else if (key === "image") {
      const coinImage = document.createElement("img");
      coinImage.classList.add("card-img-top");
      coinImage.src = coinObj[key].large;
      divMoreInfoDisplay.appendChild(coinImage);
    }
  }

  const deleteButton = createDeleteButton(divMoreInfoDisplay);
  deleteButton.addEventListener("click", function () {
    divMoreInfoDisplay.remove();
    deleteButton.remove();
    button.style.display = "block";
  });

  parameter2.appendChild(divMoreInfoDisplay);
}


//function for search button/filter
function filterCards(searchQuery) {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const cardContent = card.textContent.toLowerCase(); // Get the text content of the card and convert to lowercase
    const query = searchQuery.toLowerCase(); // Convert the search query to lowercase

    // Check if the card content contains the search query
    if (cardContent.includes(query)) {
      card.style.display = "block"; // Show the card
    } else {
      card.style.display = "none"; // Hide the card
    }
  });
}

function createButton(objData, divDisplayData) {
  const moreInfoButtonData = document.createElement("button");
  moreInfoButtonData.classList.add("more-info-btn", "btn", "btn-primary");
  let index = objData;
  // console.log(index);
  moreInfoButtonData.classList.add(index);
  moreInfoButtonData.setAttribute("type", "button");
  moreInfoButtonData.innerHTML = "Show more";
  divDisplayData.appendChild(moreInfoButtonData);
  return moreInfoButtonData;
}

function createDeleteButton(divDisplayData) {
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn", "btn-outline-primary", "delete-btn");
  deleteButton.innerHTML = "Show Less";
  divDisplayData.appendChild(deleteButton);
  return deleteButton;
}

function createSelectButton(objData, divDisplayData) {
  const selectButtonDiv = document.createElement("div");
  selectButtonDiv.classList.add("form-check", "form-switch");

  const selectButton = document.createElement("input");
  selectButton.type = "checkbox";
  selectButton.classList.add("form-check-input");
  selectButton.classList.add(objData);
  selectButton.setAttribute("role", "switch");
  selectButton.setAttribute("id", "flexSwitchCheckDefault");
  selectButtonDiv.appendChild(selectButton);
  divDisplayData.appendChild(selectButtonDiv);

  return selectButtonDiv;
}


function promptRetrieveSavedData() {
  const retrieveSavedData = confirm("Would you like to retrieve previously selected data?");
  if (retrieveSavedData) {
    let savedCoins = getCoinsDataFromStorage("selectedCoins");
    selectedCoins = savedCoins;
    return selectedCoins; // Update the global array with saved data

  }
}



// bonus


async function getAllCoinsForCharts(coinsArray) {
  coinsAllNamesString=coinsArray.join(',');
  console.log(coinsAllNamesString);
  let response = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinsAllNamesString}&tsyms=USD`);
  let selectedCoinsData = await response.json();
  console.log(selectedCoins);
  return selectedCoinsData;
}


let chart;
let fetchInterval;
const chartData = {};


function displayCoinDataInChart() {
  const ctx = document.getElementById('coinChart').getContext('2d');

  // Prepare datasets for each coin
  const datasets = Object.keys(chartData).map(coin => ({
      label: coin,
      data: chartData[coin].data,
      fill: false,
      borderColor: chartData[coin].borderColor,
      tension: 0.1
  }));

  // Destroy the existing chart instance if it exists
  if (chart) {
      chart.destroy();
  }

  // Create and render the multi-line chart
  chart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: Array.from({ length: datasets[0]?.data.length || 0 }, (_, i) => i + 1), // X-axis labels as numerical indices
          datasets: datasets // array of datasets for each coin
      },
      options: {
          scales: {
              x: {
                  title: {
                      display: true,
                      text: 'Time'
                  }
              },
              y: {
                  title: {
                      display: true,
                      text: 'Price (USD)'
                  }
              }
          },
          plugins: {
              legend: {
                  display: true,
                  position: 'top'
              }
          },
          maintainAspectRatio: false 
      }
  });
}


// Function to get a random color for the chart lines
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}





function updateChartData(newData) {
  Object.keys(newData).forEach(coin => {
      const coinData = newData[coin].USD;
      if (!chartData[coin]) {
          chartData[coin] = { data: [], borderColor: getRandomColor() };
      }
      chartData[coin].data.push(coinData);
  });
}


