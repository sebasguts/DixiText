import { debounce } from 'throttle-debounce';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');

// Get the canvas graphics context
const dicesField = document.getElementById('dices');
const playersField = document.getElementById('players');
const rulesField = document.getElementById('rules')

export function render() {
  const { t, me, dice, atturn, rules, others } = getCurrentState();
  if (!me) {
    return;
  }
  console.log(others);
  dicesField.innerText = dice.dice1 + "   " + dice.dice2;
 // rule_text = rule_test.join(", ");
 // rules.innerText = rule_text;
  var player_text = "";
  for(var i = 0; i < others.length; i++){
    player_text = player_text + others[i].username + " " + (others[i].id == atturn ? "ist and der Reihe, " : " ") + (others[i].injail ? "Gefängnis " : " ")+ "\n";
  }
  playersField.innerText = player_text;
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