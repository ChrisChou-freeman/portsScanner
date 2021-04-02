import {Socket} from 'net';

const findPortParms = {
  startPort: 0,
  endPort: 65535,
  host: '127.0.0.1',
  portList: [],
  opts: {}
};
const checkPortParms = {
  port: 0,
  host: '127.0.0.1',
  opts: {}
};

function isNumberLike(v=0){
  const result = parseInt(v);
  if(!isNaN(result)) return true;
  return false;
}

function checkPortStatus (params=checkPortParms) {
  return new Promise(resolve=>{
    const returnData = {error: null, data: null};
    const timeout = params.opts.timeout || 400;
    const socket = new Socket();
    let status = null;
    let error = null;
    let connectionRefused = false;
    if(!isNumberLike(params.port)){
      returnData.error = 'port is not number like';
      resolve(returnData);
      return;
    }

    socket.on('connect', ()=>{
      status = 'open';
      socket.destroy();
    });

    socket.setTimeout(timeout)
    socket.on('timeout', ()=>{
      status = 'closed';
      error = new Error(`Timeout(${timeout} ms)occurred waiting for ${params.host} : ${params.port} to be available`);
      socket.destroy();
    });

    socket.on('error', exception=>{
      if (exception.code !== 'ECONNREFUSED') {
        error = exception;
      } else {
        connectionRefused = true;
      }
      status = 'closed';
    });

    socket.on('close', exception=>{
      if (exception && !connectionRefused) {
        error = error || exception;
      } else {
        error = null;
      }
      returnData.error = error;
      returnData.data = status;
      resolve(returnData);
    });
    socket.connect(params.port, params.host);
  });
}

async function findAPortWithStatus (params=findPortParms) {
  const returnData = {error: null, port: null};
  const opts = params.opts  || {};
  const host = params.host || opts.host;
  const status = params.status;
  const portList = params.portList;
  let startPort = params.startPort;
  let endPort = params.endPort;

  if (startPort && endPort && endPort < startPort) {
    const tempStartPort = startPort;
    startPort = endPort;
    endPort = tempStartPort;
  }

  if(portList){
    for(let i=0;i<portList.length;i++){
      const port = portList[i];
      const {error, data: startusOfPorts} = await checkPortStatus({port, host, opts});
      if(error){
        returnData.error = error;
        return returnData;
      }
      if(startusOfPorts == status){
        returnData.port = port;
        return returnData;
      }
    }
  }else{
    for(let i=startPort;i<=endPort;i++){
      const port = i;
      const {error, data: startusOfPorts} = await checkPortStatus({port, host, opts});
      if(error){
        returnData.error = error;
        return returnData;
      }
      if(startusOfPorts == status){
        returnData.port = port;
        return returnData;
      }
    }
  }
  returnData.port = false;
  return returnData;
}

function findAPortInUse (params=findPortParms) {
  params.status = 'open';
  return findAPortWithStatus(params);
}

function findAPortNotInUse (params=findPortParms) {
  params.status = 'closed';
  return findAPortWithStatus(params);
}

export { findAPortInUse, findAPortNotInUse, checkPortStatus }
