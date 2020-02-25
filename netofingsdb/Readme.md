# netofingsdb

## Usage

``` js
const setupDatabase = require('netofingsdb');

setupDatabase(config)
    .then(db => {
        const { Agent, Metric } = db
    })
    .catch(err => console.error(err));
```