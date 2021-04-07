import {test, expect} from '@jest/globals';
import {findAPortInUse, findAPortNotInUse, checkPortStatus} from './index.js';
import net from 'net';

async function usePort(port){
  return new Promise(resolve=>{
    const server = net.createServer();
    server.listen(port, '127.0.0.1', ()=>{
      resolve(server);
      return;
    });
  });
}

test('findAPortInUse', async ()=>{
  const server = await usePort(3000);
  const {error, port} = await findAPortInUse({startPort: 2999, endPort: 3002});
  if(error) throw error;
  expect(port).toBe(3000);
  server.close();
});

test('findAPortNotInUse', async ()=>{
  const server = await usePort(3000);
  const server2= await usePort(3001);
  const {error, port} = await findAPortNotInUse({portList: [3000, 3002, 3002]});
  if(error) throw error;
  expect(port).toBe(3002);
  server.close();
  server2.close();
});

test('checkPortStatusOpen', async ()=>{
  const server = await usePort(3000);
  const {error, data} = await checkPortStatus({port:3000});
  if(error) throw error;
  expect(data).toBe('open');
  server.close();
});

test('checkPortStatusClosed', async ()=>{
  const {error, data} = await checkPortStatus({port:3002});
  if(error) throw error;
  expect(data).toBe('closed');
});
