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

## Script setup - initialize database 
```
    npm run setup
```
or automatic initialization
```
    npm run setup -- --yes
```

## examples
the examples are
```
    ./examples/index
```
execute exaples
```
    node examples/index.js
```