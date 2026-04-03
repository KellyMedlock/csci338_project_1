//global elements
let playerSum = 0; 
let dealerSum = 0;

let playerIn = true;

let dealerAceCount = 0;
let playerAceCount = 0;

let deck; 
let hidden;

window.onload = function() {
    startGame();
};

function buildDeck(){
    let values = [
        2, 3, 4, 5, 6, 7, 8, 9, 10,
        'J', 'Q', 'K', 'A']
    let types = ["C", "D", "H", "S"]
    deck = [];

    for (let i = 0; i < types.length; i++){
        for (let j = 0; j < values.length; j++){
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

function shuffleDeck(){
    for (let i = 0; i < deck.length; i++){
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;        
    }
}

//game starts 
function startGame(){
    // Reset UI
    document.getElementById("dealer-hand").innerHTML = "";
    document.getElementById("player-hand").innerHTML = "";
    document.getElementById("results").innerText = "";
    document.getElementById("player-hand-current-sum").innerText = "";
    //reset 
    dealerSum = 0;
    playerSum = 0;
    dealerAceCount = 0;
    playerAceCount = 0;
    playerIn = true; 
    //build deck 
    buildDeck();
    shuffleDeck();
    //hidden card 
    hidden = deck.pop();
    let hiddenImg = document.createElement("img");
    hiddenImg.id = "hidden";
    hiddenImg.src = "./cards/BACK.png";
    document.getElementById("dealer-hand").append(hiddenImg);
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    //dealer draws
    while (dealerSum <= 17){
        let card = deck.pop();
        let cardImg = document.createElement("img");
        cardImg.src = "./cards/" + card + ".png";

        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);

        document.getElementById("dealer-hand").append(cardImg);
    }

    for (let i = 0; i < 2; i++){
        let card = deck.pop();
        let cardImg = document.createElement("img");
        cardImg.src = "./cards/" + card + ".png"; 

        playerSum += getValue(card);
        playerAceCount += checkAce(card);

        document.getElementById("player-hand").append(cardImg);
    }

    updateSums();
    //buttons
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("new-game").addEventListener("click", startGame);
}

//deal card 
function hit(){
    if (!playerIn){
        return;
    }

    let card = deck.pop();
    let cardImg = document.createElement("img");
    cardImg.src = "./cards/" + card + ".png";

    playerSum += getValue(card);
    playerAceCount += checkAce(card);

    document.getElementById("player-hand").append(cardImg);

    if (reduceAce(playerSum, playerAceCount) > 21){
        if (playerSum > 21){
            stay();
        }
        playerIn = false;
    }

    updateSums();

}

//stay
function stay(){
    playerIn = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    dealerSum = reduceAce(dealerSum, dealerAceCount);
    playerSum = reduceAce(playerSum, playerAceCount);

    let results = "";
    if (playerSum > 21){
        results = `You bust with ${playerSum}. Dealer has ${dealerSum}. Dealer wins.`;
    }
    else if (dealerSum > 21){
        results = `You win with ${playerSum}. Dealer busts with ${dealerSum}.`;
    }
    else if (playerAceCount == dealerSum){
        results = `Tie! You both have ${playerSum}.`;
    }
    else if (playerSum > dealerSum){
        results = `You win with ${playerSum}. Dealer has ${dealerSum}.`;
    }
    else if (playerSum < dealerSum){
        results = `Dealer wins with ${dealerSum}. You have ${playerSum}.`;
    }

    document.getElementById("results").innerText = results;
} 

//calculate current hand 
function updateSums(){
    document.getElementById("player-hand-current-sum").innerText = reduceAce(playerSum, playerAceCount);
}

function getValue(card){
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)){
        if (value == "A"){
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A"){
        return 1;
    }
    return 0;
}

function reduceAce(sum, aceCount) {
    while (sum > 21 && aceCount > 0) {
        sum -= 10;
        aceCount--;
    }
    return sum;
}

function popup(){

}
