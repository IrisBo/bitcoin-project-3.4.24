 - Do not commit the .vscode folder.
let coinsDataFromStorage = ``; (array?) not a string.

this function is wayyyyy to long.
function createCoinCard(coinArray, parameter) {

also this:
displaySelectedCoins(coins) {



You need to tery to avoig this king of if else
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

Other then that your code looks great! amazing work! loved the fact that you finished the graphes! 
