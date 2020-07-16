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

## Setup - initialize database 
```
npm run setup
```
or automatic initialization
```
npm run setup -- --yes
```

## Setup for run examples and tests

#### Intructions:
- Copy the file '.env.example'
- Change the name '.env.example' to '.env'
- open file and complete the variables

```
// Postgres
DB_NAME=
DB_USER=
DB_PASS=
DB_HOST= 
```

#### Examples
You can see more examples it is folder called `examples`.

Execute examples
```
npm run examples
```

#### Run tests
```
npm run test
```