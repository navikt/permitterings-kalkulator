const VAULT_PATH = '/var/run/secrets/nais.io/vault/environment.env';
const path = require('path');
require('dotenv').config({
    path:
        process.env.NODE_ENV === 'production'
            ? VAULT_PATH
            : path.join(__dirname, './../.env'),
});
