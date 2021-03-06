# portscanner

Zero dependence

## require

node >= 14

## Install

```bash
npm install async-portscanner 
```

## Usage

A brief example:

```javascript
// using in ES module
import {findAPortInUse, findAPortNotInUse} from 'async-portsscanner';

findAPortInUse({startPort: 2999, endPort: 3002, host: '127.0.0.1'})
  .then(data=>{
    const {error, port} = data;
    console.log(error, port);
  });

findAPortNotInUse({portList: [2999, 3000, 3001]})
  .then(data=>{
    const {error, port} = data;
    console.log(error, port);
  })
```

```javascript
// using in commonJS
import('async-portsscanner')
  .then(data=>{
    const {findAPortInUse, findAPortNotInUse} = data;
    findAPortInUse({startPort: 2999, endPort: 3002, host: '127.0.0.1'})
      .then(data=>{
        const {error, port} = data;
        console.log(error, port);
      });

    findAPortNotInUse({portList: [2999, 3000, 3001]})
      .then(data=>{
        const {error, port} = data;
        console.log(error, port);
      })
  })

```

## Test

```sh
npm test
```
