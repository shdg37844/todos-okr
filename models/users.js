const Base = require('./base.js');

class User extends Base {
    constructor(props = 'users') {
        super(props);
    }
}

module.exports = User