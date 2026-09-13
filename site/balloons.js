(function (scope) {
  'use strict';
  var NS='http://www.w3.org/2000/svg';
  function clamp(n,min,max){return Math.max(min,Math.min(max,n));}
  function point(x,y){return x.toFixed(2)+' '+y.toFixed(2);}
  // One continuous outline joins the balloon and its tail: no pasted triangle seam.
  function outline(w,h,tx,ty,kind){
    var cx=w/2,cy=h/2,rx=Math.max(1,cx-2),ry=Math.max(1,cy-2);
    if(kind==='shout'){
      var points=[];
      for(var i=0;i<40;i++){var a=i*Math.PI/20,r=i%2?.92:1;points.push(point(cx+Math.cos(a)*rx*r,cy+Math.sin(a)*ry*r));}
      return 'M'+points.join('L')+'Z';
    }
    if(kind==='thought'||tx===null)return 'M'+point(2,cy)+'A'+rx+' '+ry+' 0 1 0 '+point(w-2,cy)+'A'+rx+' '+ry+' 0 1 0 '+point(2,cy)+'Z';
    var a=Math.atan2((ty-cy)/ry,(tx-cx)/rx),gap=.16;
    var x1=cx+rx*Math.cos(a-gap),y1=cy+ry*Math.sin(a-gap);
    var x2=cx+rx*Math.cos(a+gap),y2=cy+ry*Math.sin(a+gap);
    var bx=cx+rx*Math.cos(a),by=cy+ry*Math.sin(a);
    var dx=tx-bx,dy=ty-by,len=Math.hypot(dx,dy)||1,max=Math.min(65,w*.38);
    var reach=Math.min(max,len);tx=bx+dx/len*reach;ty=by+dy/len*reach;
    return 'M'+point(x1,y1)+'A'+rx+' '+ry+' 0 1 0 '+point(x2,y2)+
      'Q'+point(x2+(tx-x2)*.18,y2+(ty-y2)*.18)+' '+point(tx,ty)+
      'Q'+point(x1+(tx-x1)*.15,y1+(ty-y1)*.15)+' '+point(x1,y1)+'Z';
  }
  function parse(code,b,index,total){
    var m=String(code||'').match(/^(tl|tr|bl|br|ml|mr)(?:@(-?[\d.]+),(-?[\d.]+))?(?::([\d.]+))?$/);
    var pos=m?m[1]:(index===0?'t':'b')+(b.side==='right'?'r':'l');
    var width=m&&m[4]?Number(m[4]):clamp(32+b.text.length*.65,38,total>1?53:72);
    return {pos:pos,width:width,tx:m&&m[2]?Number(m[2]):(pos[1]==='l'?65:35),ty:m&&m[3]?Number(m[3]):(pos[0]==='b'?35:65)};
  }
  function overlap(a,b){return Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));}
  function layout(panel){
    var layer=panel.querySelector('.balloon-layer');if(!layer)return;
    var W=layer.clientWidth,H=layer.clientHeight;if(!W||!H)return;
    var nodes=Array.from(layer.querySelectorAll('.dialogue')),placed=[],pad=W*.035;
    var faces=nodes.filter(function(n){return n.querySelector('.balloon-outline');}).map(function(n){var p=JSON.parse(n.dataset.layout);return {x:p.tx/100*W,y:p.ty/100*H};});
    nodes.forEach(function(el,index){
      var cfg=JSON.parse(el.dataset.layout),isCaption=el.classList.contains('narration')||el.classList.contains('classified');
      el.style.width='max-content';el.style.maxWidth=clamp(cfg.width,20,92)+'%';
      var w=el.offsetWidth,h=el.offsetHeight;
      // Long dialogue wraps without shrinking Korean lettering below its readable size.
      if(h>H*.8){el.style.maxWidth=Math.min(92,Math.max(cfg.width,70))+'%';w=el.offsetWidth;h=el.offsetHeight;}
      var x=cfg.pos[1]==='r'?W-pad-w:pad;
      var y=cfg.pos[0]==='b'?H-pad-h:cfg.pos[0]==='m'?(H-h)/2:pad;
      var preferred={x:x,y:y,w:w,h:h};
      var candidates=[preferred];
      [pad,Math.max(pad,H-pad-h),(H-h)/2].forEach(function(yy){
        [x,W-pad-w,pad].forEach(function(xx){candidates.push({x:xx,y:yy,w:w,h:h});});
      });
      var chosen=candidates.reduce(function(best,c){
        c.x=clamp(c.x,pad,Math.max(pad,W-pad-w));c.y=clamp(c.y,2,Math.max(2,H-h-2));
        var score=placed.reduce(function(sum,r){return sum+overlap(c,{x:r.x-4,y:r.y-4,w:r.w+8,h:r.h+8})*100;},0);
        if(nodes.length===1)faces.forEach(function(f){score+=overlap(c,{x:f.x-W*.028,y:f.y-W*.028,w:W*.056,h:W*.056})*10;});
        score+=Math.hypot(c.x-preferred.x,c.y-preferred.y);
        if(placed.length&&c.y+8<placed[placed.length-1].y)score+=W*2;
        return !best||score<best.score?{box:c,score:score}:best;
      },null).box;
      placed.push(chosen);el.style.left=chosen.x+'px';el.style.top=chosen.y+'px';
      var svg=el.querySelector('.balloon-outline');if(!svg)return;
      svg.setAttribute('viewBox','0 0 '+w+' '+h);
      var tx=clamp(cfg.tx/100*W,3,W-3)-chosen.x,ty=clamp(cfg.ty/100*H,3,H-3)-chosen.y;
      var kind=el.classList.contains('thought')?'thought':el.classList.contains('shout')?'shout':'speech';
      svg.querySelector('path').setAttribute('d',outline(w,h,tx,ty,kind));
      svg.querySelectorAll('circle').forEach(function(c){c.remove();});
      if(kind==='thought'){
        var angle=Math.atan2(ty-h/2,tx-w/2),bx=w/2+Math.cos(angle)*(w/2-2),by=h/2+Math.sin(angle)*(h/2-2);
        [8,19].forEach(function(d,i){var c=document.createElementNS(NS,'circle');c.setAttribute('cx',bx+Math.cos(angle)*d);c.setAttribute('cy',by+Math.sin(angle)*d);c.setAttribute('r',i?2.3:3.5);svg.appendChild(c);});
      }
      if(isCaption)el.style.zIndex=6;
    });
  }
  function refresh(){document.querySelectorAll('.comic-panel').forEach(layout);}
  scope.SoulstoneBalloons={parse:parse,outline:outline,refresh:refresh};
  if(typeof module!=='undefined')module.exports=scope.SoulstoneBalloons;
})(typeof window==='undefined'?globalThis:window);
