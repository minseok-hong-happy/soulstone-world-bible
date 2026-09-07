// Publish only complete redraw episodes; keep the existing edition for the rest.
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const {edition,legacyStory,jobs}=require('./webtoon-production.cjs');
const updated=[];
for(const [number,episode] of Object.entries(edition.episodes)){
  episode.updated=episode.pages.every(page=>fs.existsSync(path.join(root,'site',page.image)));
  if(episode.updated)updated.push(Number(number));
  else{
    episode.legacy=legacyStory[number].strips;
    episode.pages=[];
  }
  episode.thumbnail=episode.updated?episode.pages[0].image:episode.legacy[0].image.replace(/^strips\//,'assets/webtoon/').replace(/\.png$/i,'.jpg');
}
edition.updatedEpisodes=updated;
edition.checkpointDate=new Date().toISOString().slice(0,10);
fs.writeFileSync(path.join(root,'site/data/webtoon-v2.js'),'/* Generated checkpoint: complete new episodes + intact legacy fallback. */\nconst SOULSTONE_WEBTOON_V2 = '+JSON.stringify(edition,null,2)+';\n');
// Mechanical preservation of the previous speech-overlay styling, scoped to legacy art.
const previous=execFileSync('git',['show','9844f70:site/webtoon.css'],{cwd:root,encoding:'utf8'});
const legacyCss=previous.slice(previous.indexOf('.strip {'),previous.indexOf('.episode-end {')).replace(/\.strip\b/g,'.legacy-strip').replace(/\.bubble\b/g,'.legacy-bubble');
fs.writeFileSync(path.join(root,'site/webtoon-legacy.css'),'/* Preserved overlay layout for episodes not redrawn yet. */\n'+legacyCss);
const completed=jobs.filter(j=>fs.existsSync(path.join(root,'site',j.output))).map(j=>j.id);
const pending=jobs.filter(j=>!fs.existsSync(path.join(root,'site',j.output))).map(j=>j.id);
fs.writeFileSync(path.join(root,'docs/webtoon-progress.json'),JSON.stringify({date:edition.checkpointDate,updatedEpisodes:updated,completedAssets:completed,pendingAssets:pending},null,2));
console.log(JSON.stringify({updatedEpisodes:updated,newAssets:completed.length,pendingAssets:pending.length,legacyEpisodes:60-updated.length}));
