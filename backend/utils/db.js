const { Pool } = require('pg');
const pool = new Pool({
    user: 'collections_postgre_user',
    host: 'dpg-cma4n2un7f5s73b4gbt0-a.frankfurt-postgres.render.com',
    database: 'collections_postgre',
    password: 'pyCOxAXEBcZG4grneK1ogn5tZqo9oQD9',
    port: 5432,
    ssl: true,
});

module.exports = pool;