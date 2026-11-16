const crypto = require('crypto');
module.exports = {
    generateApiKey: (userId, username, email) => {
        const data = {
            userId,
            username,
            email,
            timestamp: Date.now()
        };
        
        const key = crypto.createHash('sha256')
            .update(JSON.stringify(data) + crypto.randomBytes(16).toString('hex'))
            .digest('hex');
        
        return key;
    }
};