const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),site=path.join(root,'site');
const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(site,'data/webtoon-v2.js'),'utf8')+'\nglobalThis.edition=SOULSTONE_WEBTOON_V2;',ctx);
const data=ctx.edition.episodes;
const frameMap=vm.runInNewContext(fs.readFileSync(path.join(site,'data/panel-frames.js'),'utf8')+';SOULSTONE_PANEL_FRAMES;');
assert.equal(Object.keys(data).length,60);
const novelTitles=[...fs.readFileSync(path.join(site,'novel.md'),'utf8').matchAll(/^## \d+화\. (.+)$/gm)].map(m=>m[1].trim());
assert.equal(novelTitles.length,60);
let images=0;
for(let n=1;n<=60;n++){
 const e=data[n];assert.equal(e.title,novelTitles[n-1]);
 const refs=e.updated?e.pages.map(p=>p.image):e.legacy.map(s=>s.image.replace(/^strips\//,'assets/webtoon/').replace(/\.png$/i,'.jpg'));
 if(e.updated){
  assert.equal(e.pages.reduce((sum,p)=>sum+p.panels.length,0),18);
  for(const p of e.pages){const f=frameMap[p.image.split('?')[0]];assert.equal(f.frames.length,6);f.frames.forEach((r,i)=>{assert.ok(r.height>f.height*.06);assert.ok(r.y+r.height<=f.height);if(i)assert.ok(r.y>=f.frames[i-1].y+f.frames[i-1].height);});}
 }
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
  const lettering=[];
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});
   for(const n of ctx.edition.updatedEpisodes){
    await page.goto(url+'/webtoon.html?ep='+n);await page.locator('.balloon-layer').first().waitFor();
    await page.evaluate(()=>SoulstoneBalloons.refresh());
    const issues=await page.evaluate(()=>Array.from(document.querySelectorAll('.comic-panel')).flatMap(panel=>{
     const art=panel.querySelector('.panel-art').getBoundingClientRect();
     const bubbles=Array.from(panel.querySelectorAll('.dialogue'));
     return bubbles.flatMap((b,i)=>{
      const r=b.getBoundingClientRect(),problems=[];
      if(r.left<art.left-1||r.right>art.right+1||r.top<art.top-1||r.bottom>art.bottom+1)problems.push('outside');
      if(b.scrollHeight>b.clientHeight+2||b.scrollWidth>b.clientWidth+2)problems.push('text-overflow');
      for(let j=0;j<i;j++){
       const s=bubbles[j].getBoundingClientRect();
       if(Math.min(r.right,s.right)-Math.max(r.left,s.left)>2&&Math.min(r.bottom,s.bottom)-Math.max(r.top,s.top)>2)problems.push('overlap');
      }
      return problems.length?[{panel:panel.id,bubble:i,problems}]:[];
     });
    }));
    if(issues.length)lettering.push({width,episode:n,issues});
    assert.equal(await page.locator('.dialogue-space').count(),0,'External caption strip returned');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Lettering horizontal overflow');
   }
  }
  for(const sample of [{e:1,p:7,w:390},{e:1,p:12,w:864},{e:4,p:13,w:390},{e:8,p:10,w:390}]){
   await page.setViewportSize({width:sample.w,height:900});
   await page.goto(url+'/webtoon.html?ep='+sample.e);await page.locator('#panel-'+sample.p).scrollIntoViewIfNeeded();
   await page.evaluate(p=>{window.scrollTo(0,document.getElementById('panel-'+p).offsetTop-108);SoulstoneBalloons.refresh();},sample.p);
   await page.waitForFunction(()=>Array.from(document.querySelectorAll('.panel-art img')).filter(img=>{
    const r=img.parentElement.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;
   }).every(img=>img.complete&&img.naturalWidth>0));
   await page.evaluate(async()=>{
    await Promise.all(Array.from(document.querySelectorAll('.panel-art img')).map(img=>img.decode()));
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   });
   await page.screenshot({path:path.join(root,'.review/webtoon-v2/balloons-ep'+sample.e+'-'+sample.w+'.jpg')});
  }
  console.log(JSON.stringify({lettering}));
  assert.deepEqual(lettering,[],'Speech balloons must not overlap or leave the panel');
  assert.deepEqual(errors,[]);console.log(JSON.stringify({episodes:60,imageReferences:images,browser:report,errors}));
 }finally{await browser.close();await new Promise(r=>server.close(r));}
}
browserCheck().catch(e=>{console.error(e);process.exitCode=1;});
