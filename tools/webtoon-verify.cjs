const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),site=path.join(root,'site');
const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(site,'data/webtoon-v2.js'),'utf8')+'\nglobalThis.edition=SOULSTONE_WEBTOON_V2;',ctx);
const data=ctx.edition.episodes;
assert.equal(Object.keys(data).length,60);
const novelTitles=[...fs.readFileSync(path.join(site,'novel.md'),'utf8').matchAll(/^## \d+화\. (.+)$/gm)].map(m=>m[1].trim());
assert.equal(novelTitles.length,60);
let images=0;
for(let n=1;n<=60;n++){
 const e=data[n];assert.equal(e.title,novelTitles[n-1]);
 const refs=e.updated?e.pages.map(p=>p.image):e.legacy.map(s=>s.image.replace(/^strips\//,'assets/webtoon/').replace(/\.png$/i,'.jpg'));
 if(e.updated)assert.equal(e.pages.reduce((sum,p)=>sum+p.panels.length,0),18);
 for(const ref of [...refs,e.thumbnail]){assert.ok(fs.existsSync(path.join(site,ref.split('?')[0])),`Missing ${ref}`);images++;}
}
async function browserCheck(){
 const runtime=process.env.PLAYWRIGHT_PATH||'C:/Users/minse/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright';
 const {chromium}=require(runtime);
 const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.md':'text/plain','.jpg':'image/jpeg','.png':'image/png'};
 const server=http.createServer((req,res)=>{let file=path.resolve(site,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(site+path.sep)&&file!==site){res.writeHead(403).end();return;}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file)){res.writeHead(404).end();return;}res.setHeader('Content-Type',(mime[path.extname(file)]||'application/octet-stream')+'; charset=utf-8');fs.createReadStream(file).pipe(res);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 const url='http://127.0.0.1:'+server.address().port;
 const report=[];
 try{
  for(const n of [1,8,9,47,60]){
   await page.goto(url+'/webtoon.html?ep='+n);await page.locator('.reader').waitFor();
   assert.equal(await page.locator('option').count(),60);
   assert.equal(await page.locator(data[n].updated?'.comic-panel':'.legacy-strip').count(),data[n].updated?18:6);
   assert.ok(await page.locator('.reader img').first().evaluate(img=>img.complete&&img.naturalWidth>0));
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal overflow');
   await page.locator('#bubble-toggle').click();assert.ok(await page.locator('body').evaluate(el=>el.classList.contains('bubbles-hidden')));
   await page.locator('#bubble-toggle').click();
   report.push({episode:n,edition:data[n].updated?'new':'legacy'});
  }
  await page.goto(url+'/episodes.html');assert.equal(await page.locator('.episode-card').count(),60);
  await page.locator('#episode-search').fill('빙관');assert.ok(await page.locator('.episode-card').count()>0);
  await page.goto(url+'/novel.html#episode-35');await page.locator('#episode-35').waitFor();
  await page.waitForFunction(()=>document.getElementById('episode-35').getBoundingClientRect().top<200);
  fs.mkdirSync(path.join(root,'.review/webtoon-v2'),{recursive:true});
  await page.goto(url+'/webtoon.html?ep=1');await page.screenshot({path:path.join(root,'.review/webtoon-v2/reader-mobile.jpg')});
  await page.setViewportSize({width:1280,height:900});await page.screenshot({path:path.join(root,'.review/webtoon-v2/reader-desktop.jpg')});
  assert.deepEqual(errors,[]);console.log(JSON.stringify({episodes:60,imageReferences:images,browser:report,errors}));
 }finally{await browser.close();await new Promise(r=>server.close(r));}
}
browserCheck().catch(e=>{console.error(e);process.exitCode=1;});
