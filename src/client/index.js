// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#3-client-entrypoints
import { connect, play, rollDice } from './networking';
import { startRendering, stopRendering } from './render';
import { initState } from './state';

// I'm using Bootstrap here for convenience, but I wouldn't recommend actually doing this for a real
// site. It's heavy and will slow down your site - either only use a subset of Bootstrap, or just
// write your own CSS.
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/main.css';

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');
const dicerollbutton = document.getElementById('diceroll');

const headerClass = document.getElementById('headerclass');
const dicesClass = document.getElementById('dicesclass');
const playersClass = document.getElementById('playersclass');
const rulesClass = document.getElementById('rulesclass');


Promise.all([
  connect(onGameOver)
]).then(() => {
  playMenu.classList.remove('hidden');
  headerClass.classList.add('hidden');
  dicesClass.classList.add('hidden');
  playersClass.classList.add('hidden');
  rulesClass.classList.add('hidden');
  usernameInput.focus();
  playButton.onclick = () => {
    // Play!
    play(usernameInput.value);
    playMenu.classList.add('hidden');
    headerClass.classList.remove('hidden');
    dicesClass.classList.remove('hidden');
    playersClass.classList.remove('hidden');
    rulesClass.classList.remove('hidden');
    initState();
    startRendering();
  };
  dicerollbutton.onclick = rollDice;
}).catch(console.error);

function onGameOver() {
  stopCapturingInput();
  stopRendering();
  playMenu.classList.remove('hidden');
  headerClass.classList.add('hidden');
  dicesClass.classList.add('hidden');
  playersClass.classList.add('hidden');
  rulesClass.classList.add('hidden');
}