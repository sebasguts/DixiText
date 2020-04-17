import { debounce } from 'throttle-debounce';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');

// Get the canvas graphics context
const dicesField = document.getElementById('dices');
const playersField = document.getElementById('players');
const rulesField = document.getElementById('rules')

const diceEmojis = [ "", "⚀","⚁","⚂","⚃","⚄","⚅" ]

function renderRest() {
  const { t, me, dice, atturn, rules, others } = getCurrentState();
  var player_text = '<table border=0>';
  for(var i = 0; i < others.length; i++){
    player_text = player_text + "<tr>";
    if(others[i].id == atturn){
      player_text = player_text + "<td>🎲</td>";
    } else {
      player_text = player_text + "<td></td>";
    }
    player_text = player_text + "<td>" + others[i].username + "</td>";
    if(others[i].injail){
      player_text = player_text + "<td>👮</td>";
    } else {
      player_text = player_text + "<td></td>";
    }
    player_text = player_text + "</tr>";
  }
  player_text = player_text + "</table>";
  playersField.innerHTML = player_text;

  var rules_text = "<ul>";
  for(var i = 0; i < rules.length; i++){
    rules_text = rules_text + "<li>" + rules[i] +"</li>";
  }
  rules_text = rules_text + "</ul>";
  rulesField.innerHTML = rules_text;
  dicesField.innerText = diceEmojis[dice.dice1] + "   " + diceEmojis[dice.dice2];
}

function dicesRoll (i) {          
  setTimeout(function () {   
    dicesField.innerText = diceEmojis[Math.floor( Math.random() * 6 ) +1] + "   " + diceEmojis[Math.floor( Math.random() * 6 ) +1];
     if (--i){dicesRoll(i)} else {renderRest();};
  }, 60)
}    

export function render() {

  const { t, me, dice, atturn, rules, others, onlyNewPlayer } = getCurrentState();
  if (!me) {
    return;
  }
 // rule_text = rule_test.join(", ");
 // rules.innerText = rule_text;
 if(onlyNewPlayer){
   renderRest();
 } else {
    dicesRoll(50);
 }
}



//let renderInterval = setInterval(render, 1000);

// Replaces main menu rendering with game rendering.
export function startRendering() {
  render();
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(renderMainMenu, 1000);
}