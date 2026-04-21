const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const fs  = require('fs');

const pkg   = protoLoader.loadSync(path.join(__dirname,'bench.proto'),{});
const proto = grpc.loadPackageDefinition(pkg).bench;
const ADDR  = 'localhost:50505';

const server = new grpc.Server({
  'grpc.max_receive_message_length': 22*1024*1024,
  'grpc.max_send_message_length':    22*1024*1024,
});
server.addService(proto.BenchService.service,{Echo:(c,cb)=>cb(null,{data:c.request.data})});

server.bindAsync(ADDR, grpc.ServerCredentials.createInsecure(), async (err)=>{
  if(err){console.error(err);process.exit(1);}

  const call = (client, buf) => new Promise((res,rej)=>{
    const t = process.hrtime.bigint();
    client.Echo({data:buf},(e)=>{ if(e) return rej(e); res(Number(process.hrtime.bigint()-t)/1e6); });
  });

  const bench = async (limitMB, label, sizeName, sizeBytes, n) => {
    const lim = limitMB * 1024 * 1024;
    const c = new proto.BenchService(ADDR, grpc.credentials.createInsecure(),{
      'grpc.max_send_message_length': lim,
      'grpc.max_receive_message_length': lim,
    });
    const buf = Buffer.alloc(sizeBytes, 0x61);
    // warmup
    for(let i=0;i<3;i++) await call(c,buf).catch(()=>{});
    const lats=[];
    for(let i=0;i<n;i++){
      try{ lats.push(await call(c,buf)); }
      catch(e){ lats.push(null); }
    }
    c.close();
    const ok = lats.filter(x=>x!==null).sort((a,b)=>a-b);
    if(ok.length===0) return {label,sizeName,'status':'FAIL',mean:'',p95:'',p99:'',tput:''};
    const sum  = ok.reduce((a,b)=>a+b,0);
    const mean = (sum/ok.length).toFixed(2);
    const p95  = ok[Math.floor(ok.length*0.95)].toFixed(2);
    const p99  = ok[Math.floor(ok.length*0.99)].toFixed(2);
    const tput = (ok.length/(sum/1000)).toFixed(1);
    console.log(`  [${label}] ${sizeName.padEnd(8)} mean=${mean}ms p95=${p95}ms p99=${p99}ms tput=${tput}rps`);
    return {label,sizeName,status:'ok',mean,p95,p99,tput};
  };

  const plan = [
    // [limitMB, label, sizeName, sizeBytes, iterations]
    [4,  '4MB_limit',  '128KB', 128*1024,         25],
    [4,  '4MB_limit',  '512KB', 512*1024,          20],
    [4,  '4MB_limit',  '1MB',   1*1024*1024,       15],
    [4,  '4MB_limit',  '3.9MB', 3.9*1024*1024,     10],
    [4,  '4MB_limit',  '4MB',   4*1024*1024,       10], // expect fail
    [4,  '4MB_limit',  '8MB',   8*1024*1024,        5], // expect fail
    [20, '20MB_limit', '128KB', 128*1024,           25],
    [20, '20MB_limit', '512KB', 512*1024,           20],
    [20, '20MB_limit', '1MB',   1*1024*1024,        15],
    [20, '20MB_limit', '3.9MB', 3.9*1024*1024,      10],
    [20, '20MB_limit', '4MB',   4*1024*1024,        10], // now succeeds
    [20, '20MB_limit', '8MB',   8*1024*1024,         8],
    [20, '20MB_limit', '16MB',  16*1024*1024,        5],
    [20, '20MB_limit', '20MB',  20*1024*1024,        5],
    [20, '20MB_limit', '21MB',  21*1024*1024,        3], // expect fail (over limit)
  ];

  const header = ['config','payload','status','mean_ms','p95_ms','p99_ms','throughput_rps'];
  const rows   = [header];

  console.log('\nRunning benchmarks...\n');
  for(const [lim,lbl,szName,szBytes,n] of plan){
    const r = await bench(lim,lbl,szName,szBytes,n);
    rows.push([r.label,r.sizeName,r.status,r.mean,r.p95,r.p99,r.tput]);
  }

  const csv = rows.map(r=>r.join(',')).join('\n');
  fs.writeFileSync(path.join(__dirname,'results.csv'), csv);
  console.log('\nDone. Results saved to results.csv');
  server.forceShutdown();
  process.exit(0);
});
