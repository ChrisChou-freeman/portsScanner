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
## Test

```sh
npm test
```
