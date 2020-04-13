const Constants = require('../shared/constants');
const Player = require('./player');

class Dice {
    constructor() {
        this.dice1 = Math.floor( Math.random() * 6 ) +1;
        this.dice2 = Math.floor( Math.random() * 6 ) +1;
    }

    roll () {
        this.dice1 = Math.floor( Math.random() * 6 ) +1;
        this.dice2 = Math.floor( Math.random() * 6 ) +1;
    }

    serializeForUpdate(){
        return {
            dice1: this.dice1,
            dice2: this.dice2
        }
    }
}

const Rules = {
    sum: 1,
    pair: 2
}

class Rule {
    constructor (rule_type, number, string){
        this.rule_type = rule_type;
        this.number = number;
        this.string = string;
    }

    check_rule (dice) {
        if((this.rule_type == Rules.sum) &&(( dice.dice1 + dice.dice2 ) == this.number)){
            return true;
        }
        if((this.rule_type == Rules.pair) && (dice.dice1 == this.number) && (dice.dice2 == this.number)){
            return true;
        }
        return false;
    }
}

class Game {
  constructor() {
    this.sockets = {};
    this.playersByOrder = [];
    this.playersBySocket = {};
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    this.playerAtTurn = null;
    this.dices = new Dice();
    this.rules = [
        new Rule(Rules.pair, 1, "Einen verteilen"),
        new Rule(Rules.pair, 2, "Zwei verteilen"),
        new Rule(Rules.pair, 3, "Drei verteilen"),
        new Rule(Rules.pair, 4, "Vier verteilen"),
        new Rule(Rules.pair, 5, "Fünf verteilen"),
        new Rule(Rules.pair, 6, "Sechs verteilen"),
        new Rule(Rules.sum, 9, "Vorher trinkt"),
        new Rule(Rules.sum, 11, "Nachher trinkt"),
        new Rule(Rules.sum, 5, "Sachen holen")
    ]
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;
    this.playersBySocket[socket.id] = new Player(socket.id, username);
    this.playersByOrder.push(socket.id);
    if(this.playerAtTurn == null ){
        this.playerAtTurn = socket.id;
    }
    console.log("Player added: ", username);
    this.update()
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.playersBySocket[socket.id];
    this.playersByOrder = this.playersByOrder.filter(function(value, index, arr){ return value != socket.id;});
    this.update()
  }

  nextPlayer(){
      for(var i=0; i < this.playersByOrder.length; i++){
        if(this.playersByOrder[i] == this.playerAtTurn){
            if( i != (this.playersByOrder.length - 1)){
              this.playerAtTurn = this.playersByOrder[i + 1];
            } else {
              this.playerAtTurn = this.playersByOrder[0];
            }
            break;
        }
      }
  }

  handleInput(socket, dir) {
    console.log(socket.id);
    console.log(this.playerAtTurn);

    if(socket.id != this.playerAtTurn) return;

    if(dir.type == "diceroll"){
      this.dices.roll();
      this.rule_strings = [];
      for(var x = 0; x < this.rules.length; x++){
          if(this.rules[x].check_rule(this.dices)){
              this.rule_strings.push(this.rules[x].string);
          }
      }

      console.log(this.rule_strings);
      console.log(this.dices.dice1);
      console.log(this.dices.dice2);

      if(this.dices.dice1 + this.dices.dice2 == 7){
          for(var player=0; player < this.playersByOrder.length; player++){
              this.playersBySocket[this.playersByOrder[player]].injail = false;
          }
          this.playersBySocket[this.playerAtTurn].injail = true;
          this.nextPlayer();
          this.update();
          return;
      }

      if(this.rule_strings.length == 0){
          this.nextPlayer()
      }
      this.update();
    }
  }

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.playersBySocket[playerID];
      socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player));
    });
  }

  createUpdate(player, leaderboard) {

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      dice: this.dices.serializeForUpdate(),
      atturn : this.playerAtTurn,
      rules: this.rule_strings,
      others: this.playersByOrder.map(p => this.playersBySocket[p].serializeForUpdate())
    };
  }
}

module.exports = Game;