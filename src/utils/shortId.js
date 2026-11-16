const shortid = require('nanoid')
module.exports = {
    generate: () => {
        return shortid.nanoid();
    }
};
