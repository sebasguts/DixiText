const ObjectClass = require('./object');

class Player extends ObjectClass {
  constructor(id, username) {
    super(id);
    this.username = username;
    this.injail = false
  }

  update(dt) {
    super.update(dt);
    return null;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      username: this.username,
      injail: this.injail
    };
  }
}

module.exports = Player;