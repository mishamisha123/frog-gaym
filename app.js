(() => {
  'use strict';

  const TEST_MODE = new URLSearchParams(location.search).has('selftest');
  const STORAGE_KEY = 'froggy-leap-deluxe-v3';

  const MULTIPLIERS = [1, 1.10, 1.25, 1.45, 1.72, 2.10, 2.70, 3.60, 5.20, 8.00, 12.00];
  const RISKS = [5, 10, 16, 24, 33, 45, 58, 70, 82, 90];
  const MIN_BET = 50;

  const FROGS = [
    { id:'classic', name:'Classic Frog', emoji:'🐸', rarity:'COMMON', cost:0, level:1, description:'Bright, bouncy, and born for lily pads.', colors:['#dbff7c','#66ce53'] },
    { id:'king', name:'King Frog', emoji:'👑', rarity:'ROYAL', cost:1200, level:3, description:'Every landing deserves a crown.', colors:['#fff07a','#dc9f39'] },
    { id:'robot', name:'Robot Frog', emoji:'🤖', rarity:'EPIC', cost:2500, level:5, description:'Calibrated for maximum ribbit velocity.', colors:['#b9f0ff','#6297ba'] },
    { id:'ghost', name:'Ghost Frog', emoji:'👻', rarity:'EPIC', cost:4000, level:7, description:'Spooky, floaty, and slightly transparent.', colors:['#e7dcff','#9a83d2'] },
    { id:'dragon', name:'Dragon Frog', emoji:'🐉', rarity:'LEGENDARY', cost:7000, level:10, description:'Tiny wings. Enormous confidence.', colors:['#ffcc6a','#eb6b47'] },
    { id:'dino', name:'Dino Frog', emoji:'🦖', rarity:'LEGENDARY', cost:9000, level:13, description:'Prehistoric hops with modern style.', colors:['#caff83','#49ad5e'] }
  ];

  const LAKES = [
    { id:'forest', name:'Forest Pond', emoji:'🌿', rarity:'COMMON', cost:0, level:1, description:'Sunlit reeds and crystal blue water.', a:'#bdf2f4', b:'#45bfd0', bank:'#55a94b', pad:'#5cc251', glow:'#dfff75' },
    { id:'swamp', name:'Mystic Swamp', emoji:'🌾', rarity:'RARE', cost:1500, level:3, description:'Emerald mist and ancient cypress trees.', a:'#b8e3ba', b:'#407f72', bank:'#3b7547', pad:'#62ac4c', glow:'#b9ff76' },
    { id:'cherry', name:'Cherry Blossom', emoji:'🌸', rarity:'EPIC', cost:2800, level:5, description:'Pink petals drift over a calm spring pond.', a:'#ffe3ec', b:'#75c9d4', bank:'#df8ead', pad:'#69c05a', glow:'#ffd0e3' },
    { id:'night', name:'Moonlit Pond', emoji:'🌙', rarity:'EPIC', cost:4200, level:7, description:'Fireflies sparkle beneath a silver moon.', a:'#172842', b:'#234b65', bank:'#1f513c', pad:'#4eaa68', glow:'#9fffe2' },
    { id:'volcano', name:'Volcano Lake', emoji:'🌋', rarity:'LEGENDARY', cost:6500, level:10, description:'Leap across obsidian pads above glowing lava.', a:'#3b1e2c', b:'#e5572f', bank:'#5c2f32', pad:'#423f42', glow:'#ffdd52' },
    { id:'frozen', name:'Frozen Lake', emoji:'❄️', rarity:'LEGENDARY', cost:8000, level:12, description:'Auroras dance above glassy blue ice.', a:'#cfefff', b:'#5aa7cd', bank:'#a3cce0', pad:'#8fd3d7', glow:'#f1ffff' },
    { id:'space', name:'Cosmic Pond', emoji:'🪐', rarity:'MYTHIC', cost:12000, level:15, description:'Zero-gravity lily pads under a galaxy sky.', a:'#130d31', b:'#31285b', bank:'#5c4b90', pad:'#6edb8c', glow:'#e8a7ff' }
  ];

  const DEFAULT_STATE = {
    balance: 1000,
    bet: 100,
    jump: 0,
    roundActive: false,
    animating: false,
    xp: 0,
    level: 1,
    sound: true,
    effects: true,
    selectedFrog: 'classic',
    selectedLake: 'forest',
    unlockedFrogs: ['classic'],
    unlockedLakes: ['forest'],
    totalJumps: 0,
    bestJump: 0,
    biggestWin: 0,
    rounds: 0,
    lastDaily: '',
    streak: 0,
    luckyCharges: 0,
    wheelRotation: 0,
    tutorialSeen: false
  };

  const $ = (id) => document.getElementById(id);
  const els = {
    app: $('app'), canvas: $('gameCanvas'), gameFrame: $('gameFrame'), status: $('statusToast'),
    balance: $('balanceLabel'), collectionBalance: $('collectionBalance'), level: $('levelLabel'), xp: $('xpLabel'), xpNext: $('xpNextLabel'), xpRing: $('xpRing'),
    jump: $('jumpLabel'), multiplier: $('multiplierLabel'), risk: $('riskLabel'), payout: $('payoutLabel'), danger: $('dangerLabel'), riskFill: $('riskFill'), riskMarker: $('riskMarker'),
    betDisplay: $('betDisplay'), start: $('startButton'), jumpButton: $('jumpButton'), cash: $('cashButton'), cashValue: $('cashButtonValue'), quickBets: $('quickBets'),
    sound: $('soundButton'), settingsSound: $('settingsSound'), settingsMotion: $('settingsMotion'), luckyBadge: $('luckyBadge'), luckyCount: $('luckyCount'),
    screens: { play:$('playScreen'), collection:$('collectionScreen'), rewards:$('rewardsScreen'), stats:$('statsScreen') },
    collectionGrid: $('collectionGrid'), spin: $('spinButton'), wheelDisc: $('wheelDisc'), rewardDot: $('rewardDot'), streakLabel: $('streakLabel'), streakDays: $('streakDays'),
    rewardHeadline: $('rewardHeadline'), rewardSubtext: $('rewardSubtext'), installButton: $('installButton'),
    modalBackdrop: $('modalBackdrop'), resultModal: $('resultModal'), howToModal: $('howToModal'), installModal: $('installModal'), rewardModal: $('rewardModal'),
    resultIcon: $('resultIcon'), resultKicker: $('resultKicker'), resultTitle: $('resultTitle'), resultAmount: $('resultAmount'), resultText: $('resultText'), resultButton: $('resultButton'),
    rewardResultTitle: $('rewardResultTitle'), rewardResultText: $('rewardResultText'),
    profileFrog: $('profileFrog'), bigProfileFrog: $('bigProfileFrog'), currentFrogName: $('currentFrogName'),
    totalJumpsStat: $('totalJumpsStat'), bestJumpStat: $('bestJumpStat'), biggestWinStat: $('biggestWinStat'), roundsStat: $('roundsStat'),
    confetti: $('confettiLayer'), flash: $('flashLayer'), selfTest: $('selfTestResult')
  };

  function deepClone(value) { return JSON.parse(JSON.stringify(value)); }
  function todayKey(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
  function yesterdayKey() { const d = new Date(); d.setDate(d.getDate()-1); return todayKey(d); }
  function clamp(n,min,max){ return Math.max(min,Math.min(max,n)); }
  function lerp(a,b,t){ return a+(b-a)*t; }
  function easeOutBack(t){ const c1=1.70158,c3=c1+1; return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2); }
  function money(n){ return Math.floor(n).toLocaleString(); }
  function currentPayout(){ return Math.floor(state.bet * MULTIPLIERS[state.jump]); }
  function nextXp(){ return 100 + (state.level-1)*50; }
  function selectedFrog(){ return FROGS.find(x=>x.id===state.selectedFrog) || FROGS[0]; }
  function selectedLake(){ return LAKES.find(x=>x.id===state.selectedLake) || LAKES[0]; }

  function loadState(){
    if (TEST_MODE) return deepClone(DEFAULT_STATE);
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const merged = Object.assign(deepClone(DEFAULT_STATE), raw);
      merged.roundActive = false;
      merged.animating = false;
      merged.jump = 0;
      merged.balance = Number.isFinite(merged.balance) ? Math.max(0, Math.floor(merged.balance)) : 1000;
      return merged;
    } catch { return deepClone(DEFAULT_STATE); }
  }

  let state = loadState();
  function saveState(){
    if (TEST_MODE) return;
    const stored = Object.assign({}, state, {roundActive:false, animating:false, jump:0});
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }

  class AudioEngine {
    constructor(){ this.ctx=null; this.enabled=true; this.ambientTimer=0; }
    unlock(){
      if (!this.enabled) return;
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') this.ctx.resume();
    }
    tone(freq=440,dur=.12,type='sine',volume=.08,slide=0,delay=0){
      if (!this.enabled) return;
      this.unlock();
      const ctx=this.ctx, now=ctx.currentTime+delay;
      const osc=ctx.createOscillator(), gain=ctx.createGain();
      osc.type=type; osc.frequency.setValueAtTime(freq,now); if(slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30,freq+slide),now+dur);
      gain.gain.setValueAtTime(.0001,now); gain.gain.exponentialRampToValueAtTime(volume,now+.012); gain.gain.exponentialRampToValueAtTime(.0001,now+dur);
      osc.connect(gain).connect(ctx.destination); osc.start(now); osc.stop(now+dur+.03);
    }
    noise(dur=.28,volume=.06){
      if(!this.enabled) return; this.unlock(); const ctx=this.ctx; const length=Math.floor(ctx.sampleRate*dur); const buffer=ctx.createBuffer(1,length,ctx.sampleRate); const data=buffer.getChannelData(0);
      for(let i=0;i<length;i++) data[i]=(Math.random()*2-1)*(1-i/length);
      const src=ctx.createBufferSource(), filter=ctx.createBiquadFilter(), gain=ctx.createGain(); filter.type='lowpass'; filter.frequency.value=1200; gain.gain.value=volume; src.buffer=buffer; src.connect(filter).connect(gain).connect(ctx.destination); src.start();
    }
    tap(){ this.tone(520,.055,'sine',.035,90); }
    start(){ this.tone(240,.13,'triangle',.07,130); this.tone(420,.14,'sine',.055,120,.09); }
    jump(){ this.tone(210,.22,'triangle',.08,430); this.tone(480,.16,'sine',.04,180,.1); }
    land(){ this.tone(330,.07,'triangle',.06,-70); this.tone(660,.12,'sine',.04,130,.035); }
    coin(){ [0,1,2].forEach(i=>this.tone(720+i*150,.11,'sine',.045,70,i*.055)); }
    splash(){ this.noise(.38,.12); this.tone(150,.3,'sine',.055,-60); }
    cash(){ [0,1,2,3].forEach(i=>this.tone(480*Math.pow(1.19,i),.15,'triangle',.06,60,i*.07)); }
    win(){ [0,1,2,3,4,5].forEach(i=>this.tone([392,494,587,784,988,1175][i],.24,'triangle',.065,80,i*.09)); }
    reward(){ [0,1,2,3].forEach(i=>this.tone(520+i*130,.18,'sine',.05,80,i*.09)); }
    croak(){ this.tone(105,.16,'sawtooth',.018,-30); this.tone(92,.22,'triangle',.018,-20,.13); }
  }
  const audio = new AudioEngine();

  function haptic(pattern=15){ try { if(navigator.vibrate) navigator.vibrate(pattern); } catch {} }

  class Scene {
    constructor(canvas){
      this.canvas=canvas; this.ctx=canvas.getContext('2d'); this.dpr=1; this.w=0; this.h=0; this.time=0; this.last=performance.now(); this.camera=0; this.cameraTarget=0; this.pads=[]; this.particles=[]; this.ripples=[]; this.confetti=[]; this.animation=null; this.frog={x:0,y:0,scaleX:1,scaleY:1,rotation:0,opacity:1}; this.failedPad=-1; this.flash=0; this.resize();
      new ResizeObserver(()=>this.resize()).observe(canvas.parentElement);
      requestAnimationFrame(t=>this.loop(t));
    }
    resize(){
      const r=this.canvas.parentElement.getBoundingClientRect(); this.dpr=Math.min(2,window.devicePixelRatio||1); this.w=Math.max(300,r.width); this.h=Math.max(300,r.height); this.canvas.width=this.w*this.dpr; this.canvas.height=this.h*this.dpr; this.canvas.style.width=this.w+'px'; this.canvas.style.height=this.h+'px'; this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0); this.buildPads();
    }
    buildPads(){
      const spacing=clamp(this.w*.24,118,188); const baseY=this.h*.59; this.pads=[];
      for(let i=0;i<MULTIPLIERS.length;i++) this.pads.push({x:90+i*spacing,y:baseY+Math.sin(i*1.31)*30,phase:i*1.7,crack:0,sink:0});
      if(!state.roundActive&&!this.animation){ this.frog.x=this.pads[0].x; this.frog.y=this.pads[0].y-36; }
    }
    reset(){ this.failedPad=-1; this.animation=null; this.particles=[]; this.ripples=[]; this.cameraTarget=0; this.frog={x:this.pads[0].x,y:this.pads[0].y-36,scaleX:1,scaleY:1,rotation:0,opacity:1}; this.pads.forEach(p=>{p.crack=0;p.sink=0;}); }
    worldToScreenX(x){ return x-this.camera; }
    emit(x,y,count,kind='spark'){
      if(!state.effects) count=Math.ceil(count*.35);
      for(let i=0;i<count;i++){
        const angle=Math.random()*Math.PI*2, speed=kind==='splash'?70+Math.random()*130:40+Math.random()*110;
        this.particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-(kind==='splash'?80:40),life:.5+Math.random()*.55,max:1,size:3+Math.random()*7,kind,color:kind==='coin'?'#ffd84f':kind==='splash'?'#d8ffff':['#e9ff76','#fff','#65e7d7','#ffdc58'][Math.floor(Math.random()*4)]});
      }
    }
    ripple(x,y){ this.ripples.push({x,y,r:10,life:1}); }
    jumpTo(index,failed,done){
      const from={x:this.frog.x,y:this.frog.y}; const pad=this.pads[index]; const to={x:pad.x,y:pad.y-36};
      this.cameraTarget=Math.max(0,pad.x-this.w*.48);
      this.animation={type:'crouch',t:0,index,failed,from,to,done};
    }
    update(dt){
      this.time+=dt; this.camera+=(this.cameraTarget-this.camera)*Math.min(1,dt*5.5);
      this.particles.forEach(p=>{ p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=190*dt; p.vx*=Math.pow(.985,dt*60); p.life-=dt; }); this.particles=this.particles.filter(p=>p.life>0);
      this.ripples.forEach(r=>{r.r+=65*dt;r.life-=dt*.9;}); this.ripples=this.ripples.filter(r=>r.life>0);
      if(!this.animation) return;
      const a=this.animation; a.t+=dt*(TEST_MODE?30:1);
      if(a.type==='crouch'){
        const t=clamp(a.t/.18,0,1); this.frog.scaleX=1+.22*Math.sin(t*Math.PI*.5); this.frog.scaleY=1-.3*Math.sin(t*Math.PI*.5); this.frog.y=a.from.y+8*t;
        if(t>=1){ a.type='flight'; a.t=0; audio.jump(); haptic(12); }
      } else if(a.type==='flight'){
        const t=clamp(a.t/.68,0,1); const e=t*t*(3-2*t); this.frog.x=lerp(a.from.x,a.to.x,e); this.frog.y=lerp(a.from.y,a.to.y,e)-Math.sin(Math.PI*t)*clamp(this.h*.24,78,145); this.frog.rotation=Math.sin(Math.PI*t)*-.16; this.frog.scaleX=1; this.frog.scaleY=1;
        if(t>=1){ this.frog.x=a.to.x; this.frog.y=a.to.y; this.frog.rotation=0; a.type=a.failed?'crack':'land'; a.t=0; if(a.failed){ this.pads[a.index].crack=1; audio.tone(110,.12,'square',.045,-30); } else { audio.land(); this.emit(a.to.x,a.to.y+28,15,'spark'); this.emit(a.to.x,a.to.y+10,10,'coin'); this.ripple(a.to.x,a.to.y+38); } }
      } else if(a.type==='land'){
        const t=clamp(a.t/.24,0,1); this.frog.scaleX=1+.24*Math.sin(t*Math.PI); this.frog.scaleY=1-.25*Math.sin(t*Math.PI); if(t>=1){this.frog.scaleX=this.frog.scaleY=1;const done=a.done;this.animation=null;done(false);}
      } else if(a.type==='crack'){
        const t=clamp(a.t/.25,0,1); this.frog.scaleY=1-.13*Math.sin(t*Math.PI*4); if(t>=1){a.type='sink';a.t=0;audio.splash();haptic([30,40,60]);this.emit(a.to.x,a.to.y+30,36,'splash');this.ripple(a.to.x,a.to.y+35);screenFeedback('lose');}
      } else if(a.type==='sink'){
        const t=clamp(a.t/.75,0,1); this.pads[a.index].sink=easeOutBack(t)*75; this.frog.y=a.to.y+t*125; this.frog.rotation=t*1.25; this.frog.opacity=1-t; if(t>=1){const done=a.done;this.animation=null;done(true);}
      }
    }
    loop(now){ const dt=Math.min(.034,(now-this.last)/1000||.016); this.last=now; this.update(dt); this.draw(); requestAnimationFrame(t=>this.loop(t)); }
    draw(){
      const c=this.ctx,w=this.w,h=this.h,lake=selectedLake(); c.clearRect(0,0,w,h);
      const sky=c.createLinearGradient(0,0,0,h*.43); sky.addColorStop(0,lake.a); sky.addColorStop(1,lake.b); c.fillStyle=sky;c.fillRect(0,0,w,h);
      this.drawAtmosphere(c,w,h,lake);
      const water=c.createLinearGradient(0,h*.31,0,h); water.addColorStop(0,lake.b); water.addColorStop(1,this.mix(lake.b,'#063c58',.18)); c.fillStyle=water;c.fillRect(0,h*.31,w,h*.69);
      this.drawWater(c,w,h,lake);
      this.ripples.forEach(r=>{ const x=this.worldToScreenX(r.x); c.strokeStyle=`rgba(225,255,255,${r.life*.7})`;c.lineWidth=3;c.beginPath();c.ellipse(x,r.y,r.r,r.r*.24,0,0,Math.PI*2);c.stroke(); });
      this.pads.forEach((pad,i)=>this.drawPad(c,pad,i,lake));
      this.drawFinish(c,lake);
      this.drawFrog(c,this.worldToScreenX(this.frog.x),this.frog.y,this.frog);
      this.particles.forEach(p=>this.drawParticle(c,p));
    }
    mix(a,b,t){
      const pa=a.match(/[a-f\d]{2}/gi).map(x=>parseInt(x,16)),pb=b.match(/[a-f\d]{2}/gi).map(x=>parseInt(x,16));return '#'+pa.map((v,i)=>Math.round(lerp(v,pb[i],t)).toString(16).padStart(2,'0')).join('');
    }
    drawAtmosphere(c,w,h,lake){
      if(lake.id==='night'||lake.id==='space'){
        c.fillStyle=lake.id==='space'?'#fff':'#f4f7d7';c.beginPath();c.arc(w*.82,h*.13,32,0,Math.PI*2);c.fill();
        for(let i=0;i<40;i++){const x=(Math.sin(i*73.1)*.5+.5)*w,y=(Math.sin(i*19.7)*.5+.5)*h*.33,tw=.4+.6*Math.sin(this.time*2+i);c.globalAlpha=.3+tw*.65;c.fillStyle=i%3?'#fff':'#dba7ff';c.fillRect(x,y,1.5+tw,1.5+tw);}c.globalAlpha=1;
      } else {
        c.globalAlpha=.85;c.fillStyle='#fffbe1';c.beginPath();c.arc(w*.83,h*.13,30,0,Math.PI*2);c.fill();c.globalAlpha=1;
        this.cloud(c,w*.18+Math.sin(this.time*.06)*18,h*.13,1);this.cloud(c,w*.62+Math.sin(this.time*.05+2)*23,h*.19,.7);
      }
      const bankY=h*.33; for(let i=-1;i<12;i++){const x=i*w/9+(this.camera*.05%120),r=45+(i%3)*9;c.fillStyle=i%2?lake.bank:this.mix(lake.bank,'#1e6949',.16);c.beginPath();c.ellipse(x,bankY,r*1.2,r*.55,0,0,Math.PI*2);c.fill();}
      if(lake.id==='cherry'){for(let i=0;i<22;i++){const x=(i*89+this.time*12)%(w+60)-30,y=(i*47+this.time*8)%(h*.5);c.fillStyle=`rgba(255,190,214,${.35+(i%3)*.2})`;c.beginPath();c.ellipse(x,y,4,2,Math.sin(i),0,Math.PI*2);c.fill();}}
      if(lake.id==='volcano'){c.globalAlpha=.5;c.fillStyle='#ffdc4d';for(let i=0;i<16;i++){const x=(i*83+this.time*18)%w,y=h*.36+(i%5)*18;c.beginPath();c.arc(x,y,2+(i%3),0,Math.PI*2);c.fill();}c.globalAlpha=1;}
    }
    cloud(c,x,y,s){c.fillStyle='rgba(255,255,255,.78)';[[0,0,35,16],[24,-13,29,22],[53,1,31,15]].forEach(q=>{c.beginPath();c.ellipse(x+q[0]*s,y+q[1]*s,q[2]*s,q[3]*s,0,0,Math.PI*2);c.fill();});}
    drawWater(c,w,h,lake){
      c.save();c.globalAlpha=.23;c.strokeStyle='#eaffff';c.lineWidth=2;for(let row=0;row<7;row++){const y=h*.39+row*54;for(let x=-80+((row%2)*70)-((this.time*11)%150);x<w+90;x+=150){c.beginPath();c.ellipse(x,y,42,7,0,0,Math.PI);c.stroke();}}c.restore();
      if(lake.id==='frozen'){c.globalAlpha=.3;c.strokeStyle='#fff';for(let i=0;i<8;i++){c.beginPath();c.moveTo(i*w/7,h*.34);c.lineTo(i*w/7+Math.sin(i)*75,h);c.stroke();}c.globalAlpha=1;}
    }
    drawPad(c,pad,i,lake){
      const x=this.worldToScreenX(pad.x),bob=Math.sin(this.time*1.7+pad.phase)*3,y=pad.y+bob+pad.sink;if(x<-90||x>this.w+90)return;
      c.save();c.translate(x,y);c.rotate(Math.sin(i*1.7)*.04);c.globalAlpha=pad.sink?clamp(1-pad.sink/90,.1,1):1;
      const active=state.roundActive&&i===state.jump&&!state.animating; if(active){c.shadowBlur=26;c.shadowColor=lake.glow;}
      c.fillStyle='rgba(0,54,67,.22)';c.beginPath();c.ellipse(0,15,53,21,0,0,Math.PI*2);c.fill();
      const grad=c.createLinearGradient(-45,-25,45,25);grad.addColorStop(0,this.mix(lake.pad,'#ffffff',.23));grad.addColorStop(1,this.mix(lake.pad,'#123f35',.15));c.fillStyle=grad;c.strokeStyle=active?lake.glow:this.mix(lake.pad,'#164f3a',.35);c.lineWidth=active?5:3;c.beginPath();c.ellipse(0,0,51,27,0,0,Math.PI*2);c.fill();c.stroke();
      c.fillStyle=lake.b;c.beginPath();c.moveTo(8,-27);c.lineTo(53,-5);c.lineTo(14,11);c.closePath();c.fill();
      c.shadowBlur=0;c.fillStyle='rgba(13,55,43,.67)';c.font='900 9px system-ui';c.textAlign='center';c.fillText(i===0?'START':String(i),-16,4);
      if(pad.crack){c.strokeStyle='#253c3d';c.lineWidth=3;c.beginPath();c.moveTo(-18,-7);c.lineTo(-4,3);c.lineTo(-13,14);c.moveTo(-4,3);c.lineTo(16,10);c.moveTo(-4,3);c.lineTo(9,-11);c.stroke();}
      c.restore();
    }
    drawFinish(c,lake){const p=this.pads[this.pads.length-1],x=this.worldToScreenX(p.x),y=p.y-115;if(x<-100||x>this.w+100)return;c.save();c.translate(x,y);c.rotate(.04);c.fillStyle='#8d6032';c.fillRect(-4,25,8,80);c.fillStyle='#fff2c8';c.strokeStyle='#8d6032';c.lineWidth=4;c.beginPath();c.roundRect(-50,-26,100,52,10);c.fill();c.stroke();c.fillStyle='#6a4627';c.textAlign='center';c.font='1000 12px system-ui';c.fillText('12.00×',0,-3);c.font='900 9px system-ui';c.fillText('LEGENDARY',0,13);c.restore();}
    drawFrog(c,x,y,f){
      if(f.opacity<=0||x<-100||x>this.w+100)return; const frog=selectedFrog(); c.save();c.translate(x,y);c.rotate(f.rotation);c.scale(f.scaleX,f.scaleY);c.globalAlpha=f.opacity;c.shadowColor='rgba(0,43,49,.35)';c.shadowBlur=12;c.shadowOffsetY=8;
      if(frog.id==='ghost') c.globalAlpha*=.72;
      c.fillStyle=frog.colors[1];c.strokeStyle=this.mix(frog.colors[1],'#143a30',.45);c.lineWidth=3;
      c.beginPath();c.ellipse(-21,24,18,10,-.2,0,Math.PI*2);c.ellipse(21,24,18,10,.2,0,Math.PI*2);c.fill();c.stroke();
      c.shadowBlur=0;c.fillStyle=frog.colors[1];c.beginPath();c.ellipse(0,11,25,28,0,0,Math.PI*2);c.fill();c.stroke();
      c.fillStyle=frog.colors[0];c.beginPath();c.ellipse(0,-9,30,25,0,0,Math.PI*2);c.fill();c.stroke();
      c.beginPath();c.ellipse(-18,-27,12,13,0,0,Math.PI*2);c.ellipse(18,-27,12,13,0,0,Math.PI*2);c.fill();c.stroke();
      c.fillStyle='#102a25';c.beginPath();c.arc(-18,-29,4.4,0,Math.PI*2);c.arc(18,-29,4.4,0,Math.PI*2);c.fill();
      c.strokeStyle='#235338';c.lineWidth=2;c.beginPath();c.arc(0,-7,12,8,.15,Math.PI-.15);c.stroke();
      c.textAlign='center';c.textBaseline='middle';c.font='24px system-ui'; if(frog.id!=='classic')c.fillText(frog.emoji,0,-51);
      c.restore();
    }
    drawParticle(c,p){const x=this.worldToScreenX(p.x),alpha=clamp(p.life/p.max,0,1);c.save();c.globalAlpha=alpha;c.fillStyle=p.color;if(p.kind==='coin'){c.beginPath();c.arc(x,p.y,p.size,0,Math.PI*2);c.fill();c.fillStyle='#986700';c.font=`900 ${Math.max(6,p.size)}px system-ui`;c.textAlign='center';c.fillText('F',x,p.y+2);}else{c.beginPath();c.arc(x,p.y,p.size,0,Math.PI*2);c.fill();}c.restore();}
  }

  const scene = new Scene(els.canvas);
  let forcedOutcome = null;
  let installPrompt = null;
  let collectionMode = 'frogs';

  function setStatus(text,kind=''){
    els.status.textContent=text; els.status.classList.remove('win','lose'); if(kind)els.status.classList.add(kind);
  }
  function dangerName(r){ return r<8?'Tiny ripple':r<18?'Wobbly':r<30?'Getting risky':r<45?'Slippery':r<60?'Dangerous':r<75?'Very dangerous':'Splash zone'; }
  function effectiveRisk(){ if(state.jump>=RISKS.length)return 0; return Math.max(1,RISKS[state.jump]-(state.luckyCharges>0?5:0)); }

  function refresh(){
    const payout=currentPayout(), risk=effectiveRisk(), xpNeeded=nextXp(), frog=selectedFrog(), lake=selectedLake();
    els.balance.textContent=money(state.balance); els.collectionBalance.textContent=money(state.balance); els.level.textContent=`Lv. ${state.level}`; els.xp.textContent=state.xp; els.xpNext.textContent=xpNeeded; els.xpRing.style.setProperty('--xp',`${clamp(state.xp/xpNeeded*100,0,100)}%`);
    els.jump.textContent=`${state.jump} / ${RISKS.length}`; els.multiplier.textContent=`${MULTIPLIERS[state.jump].toFixed(2)}×`; els.risk.textContent=state.jump>=RISKS.length?'—':`${risk}%`; els.payout.textContent=`${money(payout)} F`; els.cashValue.textContent=`${money(payout)} F`;
    els.betDisplay.textContent=money(state.bet); els.start.querySelector('small').textContent=`Bet ${money(state.bet)} F`; els.danger.textContent=state.jump>=RISKS.length?'Legendary leap':dangerName(risk); els.riskFill.style.width=`${risk}%`;els.riskMarker.style.left=`${risk}%`;els.riskMarker.style.background=risk<30?'#52c95a':risk<60?'#f3c442':'#eb506b';
    els.start.classList.toggle('hidden',state.roundActive); els.jumpButton.classList.toggle('hidden',!state.roundActive); els.cash.classList.toggle('hidden',!state.roundActive||state.jump===0); els.jumpButton.disabled=state.animating;els.cash.disabled=state.animating;
    els.quickBets.querySelectorAll('button').forEach(b=>{b.disabled=state.roundActive;b.classList.toggle('selected',(b.dataset.bet==='max'&&state.bet===Math.floor(state.balance/50)*50)||(Number(b.dataset.bet)===state.bet));});
    els.sound.textContent=state.sound?'🔊':'🔇';audio.enabled=state.sound;els.settingsSound.querySelector('b').textContent=state.sound?'On':'Off';els.settingsMotion.querySelector('b').textContent=state.effects?'On':'Reduced';
    els.luckyBadge.classList.toggle('hidden',state.luckyCharges<=0);els.luckyCount.textContent=state.luckyCharges;
    els.profileFrog.textContent=frog.emoji;els.bigProfileFrog.textContent=frog.emoji;els.currentFrogName.textContent=frog.name;els.app.dataset.theme=lake.id;
    els.totalJumpsStat.textContent=money(state.totalJumps);els.bestJumpStat.textContent=state.bestJump;els.biggestWinStat.textContent=`${money(state.biggestWin)} F`;els.roundsStat.textContent=money(state.rounds);
    refreshDaily(); saveState();
  }

  function addXp(amount){
    state.xp+=amount; let leveled=false;
    while(state.xp>=nextXp()){state.xp-=nextXp();state.level++;leveled=true;}
    if(leveled){setStatus(`Level up! You reached level ${state.level}.`,'win');screenFeedback('win');audio.reward();confettiBurst(45);}
  }

  function selectBet(value){
    if(state.roundActive)return; let bet=value==='max'?Math.floor(state.balance/50)*50:Number(value);bet=clamp(Math.floor(bet/50)*50,MIN_BET,Math.max(MIN_BET,state.balance));state.bet=bet;audio.tap();refresh();
  }

  function startRound(){
    audio.unlock(); if(state.roundActive||state.animating)return;
    if(state.balance<MIN_BET){state.balance+=500;setStatus('Pond rescue bonus: +500 Froggy!','win');audio.reward();confettiBurst(25);refresh();return;}
    if(state.bet>state.balance){state.bet=Math.floor(state.balance/50)*50;setStatus('Bet adjusted to your available Froggy.');refresh();return;}
    state.balance-=state.bet;state.jump=0;state.roundActive=true;state.animating=false;state.rounds++;scene.reset();setStatus(`${money(state.bet)} Froggy on the line. Make the first leap!`);audio.start();haptic(20);refresh();
  }

  function jump(){
    if(!state.roundActive||state.animating||state.jump>=RISKS.length)return;audio.unlock();state.animating=true;const next=state.jump+1;const risk=effectiveRisk();if(state.luckyCharges>0)state.luckyCharges--;
    const fail=forcedOutcome===null?Math.random()<risk/100:!forcedOutcome;forcedOutcome=null;setStatus(`Crouch… launch! Pad ${next} has ${risk}% failure risk.`);refresh();
    scene.jumpTo(next,fail,(didFail)=>{
      state.animating=false;state.totalJumps++;
      if(didFail){
        state.roundActive=false;state.bestJump=Math.max(state.bestJump,state.jump);setStatus('SPLASH! The lily pad broke.','lose');
        const lost=state.bet; refresh(); setTimeout(()=>showResult({icon:'💦',kicker:'ROUND OVER',title:'The pad cracked!',amount:`−${money(lost)} F`,text:`You reached jump ${state.jump}. The pond keeps this bet—but your next leap could be legendary.`,lose:true}),TEST_MODE?1:420);
      } else {
        state.jump=next;state.bestJump=Math.max(state.bestJump,state.jump);addXp(10+state.jump*2);audio.coin();haptic(15);screenFeedback('win');
        if(state.jump===RISKS.length){
          const payout=currentPayout();state.balance+=payout;state.biggestWin=Math.max(state.biggestWin,payout);state.roundActive=false;addXp(120);setStatus(`LEGENDARY LEAP! ${money(payout)} Froggy at 12.00×!`,'win');audio.win();confettiBurst(120);refresh();setTimeout(()=>showResult({icon:'🏆',kicker:'LEGENDARY LEAP',title:'Every pad cleared!',amount:`+${money(payout)} F`,text:'Golden lily pads, maximum multiplier, absolute frog glory.'}),TEST_MODE?1:500);
        } else {setStatus(`Perfect landing! ${MULTIPLIERS[state.jump].toFixed(2)}× — cash out or leap again.`,'win');refresh();}
      }
    });
  }

  function cashOut(){
    if(!state.roundActive||state.animating||state.jump===0)return;const payout=currentPayout(),profit=payout-state.bet;state.balance+=payout;state.biggestWin=Math.max(state.biggestWin,payout);state.roundActive=false;addXp(25+state.jump*4);audio.cash();haptic([15,35,20]);screenFeedback('win');confettiBurst(35+state.jump*3);setStatus(`Cashed out ${money(payout)} Froggy!`,'win');refresh();setTimeout(()=>showResult({icon:'🪙',kicker:'SMART CASH-OUT',title:`${MULTIPLIERS[state.jump].toFixed(2)}× secured!`,amount:`+${money(payout)} F`,text:`Profit: ${money(profit)} Froggy. Great timing.`}),TEST_MODE?1:220);
  }

  function showResult({icon,kicker,title,amount,text,lose=false}){
    els.resultIcon.textContent=icon;els.resultKicker.textContent=kicker;els.resultTitle.textContent=title;els.resultAmount.textContent=amount;els.resultAmount.style.color=lose?'#d6405d':'';els.resultText.textContent=text;openModal(els.resultModal);
  }
  function openModal(modal){els.modalBackdrop.classList.remove('hidden');[els.resultModal,els.howToModal,els.installModal,els.rewardModal].forEach(m=>m.classList.add('hidden'));modal.classList.remove('hidden');}
  function closeModal(){els.modalBackdrop.classList.add('hidden');[els.resultModal,els.howToModal,els.installModal,els.rewardModal].forEach(m=>m.classList.add('hidden'));}
  function screenFeedback(kind){if(!state.effects)return;els.flash.className=`flash-layer flash-${kind}`;els.gameFrame.classList.toggle('shake',kind==='lose');setTimeout(()=>{els.flash.className='flash-layer';els.gameFrame.classList.remove('shake');},500);}
  function confettiBurst(count=55){if(!state.effects)count=Math.ceil(count*.25);const colors=['#e9ff6a','#52d8d0','#ffcc4b','#fa6d8a','#aa82ec','#fff'];for(let i=0;i<count;i++){const d=document.createElement('i');d.className='confetti';d.style.left=`${Math.random()*100}%`;d.style.top=`${-10-Math.random()*30}px`;d.style.background=colors[i%colors.length];d.style.setProperty('--dx',`${(Math.random()-.5)*240}px`);d.style.setProperty('--spin',`${(Math.random()-.5)*1200}deg`);d.style.setProperty('--dur',`${1.5+Math.random()*1.8}s`);els.confetti.appendChild(d);setTimeout(()=>d.remove(),3600);}}

  function navigate(screen){
    Object.entries(els.screens).forEach(([key,node])=>node.classList.toggle('active',key===screen));document.querySelectorAll('.nav-button').forEach(b=>b.classList.toggle('active',b.dataset.screen===screen));audio.tap();if(screen==='collection')renderCollection();if(screen==='rewards')refreshDaily();if(screen==='stats')refresh();
  }

  function renderCollection(){
    const items=collectionMode==='frogs'?FROGS:LAKES, unlocked=collectionMode==='frogs'?state.unlockedFrogs:state.unlockedLakes, selected=collectionMode==='frogs'?state.selectedFrog:state.selectedLake;
    els.collectionGrid.innerHTML=items.map(item=>{
      const owned=unlocked.includes(item.id),equipped=selected===item.id,canLevel=state.level>=item.level;let action=equipped?'EQUIPPED':owned?'EQUIP':canLevel?`UNLOCK · ${money(item.cost)} F`:`LEVEL ${item.level} REQUIRED`;
      return `<article class="collection-card ${collectionMode==='lakes'?'lake':''} ${equipped?'selected':''}" data-item="${item.id}"><span class="rarity">${item.rarity}</span><div class="collection-art" style="--card-a:${item.colors?item.colors[0]:item.a};--card-b:${item.colors?item.colors[1]:item.b}">${item.emoji}</div><h3>${item.name}</h3><p>${item.description}</p><button class="collection-action pressable ${owned?'owned':'locked'}" data-collection-action="${item.id}" ${equipped?'disabled':''}>${action}</button></article>`;
    }).join('');
  }

  function collectionAction(id){
    const items=collectionMode==='frogs'?FROGS:LAKES,item=items.find(x=>x.id===id);if(!item)return;const unlockKey=collectionMode==='frogs'?'unlockedFrogs':'unlockedLakes',selectKey=collectionMode==='frogs'?'selectedFrog':'selectedLake';
    if(state[unlockKey].includes(id)){state[selectKey]=id;audio.reward();setStatus(`${item.name} equipped!`,'win');}
    else if(state.level<item.level){setStatus(`Reach level ${item.level} to unlock ${item.name}.`,'lose');haptic(20);}
    else if(state.balance<item.cost){setStatus(`You need ${money(item.cost-state.balance)} more Froggy.`,'lose');haptic(20);}
    else{state.balance-=item.cost;state[unlockKey].push(id);state[selectKey]=id;audio.reward();confettiBurst(28);setStatus(`${item.name} unlocked!`,'win');}
    refresh();renderCollection();scene.reset();
  }

  function dailyAvailable(){return state.lastDaily!==todayKey();}
  function refreshDaily(){
    const ready=dailyAvailable();els.rewardDot.classList.toggle('hidden',!ready);els.spin.disabled=!ready;els.spin.textContent=ready?'SPIN':'DONE';els.rewardHeadline.textContent=ready?'Your reward is ready!':'Come back tomorrow!';els.rewardSubtext.textContent=ready?'Spin once per day for Froggy, skins, or lucky charms.':`Day ${state.streak} claimed. Your streak is safe.`;els.streakLabel.textContent=Math.max(1,state.streak);
    els.streakDays.innerHTML=Array.from({length:7},(_,i)=>`<div class="streak-day ${i<Math.min(state.streak,7)?'claimed':''} ${i===Math.min(state.streak,7)-1?'today':''}">${i===6?'🎁':i+1}</div>`).join('');
  }

  function pickDailyReward(){
    const nextStreak=state.lastDaily===yesterdayKey()?state.streak+1:1;const lockedFrogs=FROGS.filter(f=>!state.unlockedFrogs.includes(f.id)&&state.level>=f.level);if(nextStreak%7===0&&lockedFrogs.length)return{type:'skin',item:lockedFrogs[Math.floor(Math.random()*lockedFrogs.length)]};
    const r=Math.random();if(r<.26)return{type:'froggy',amount:300};if(r<.48)return{type:'froggy',amount:500};if(r<.64)return{type:'lucky',amount:3};if(r<.78)return{type:'froggy',amount:750};if(r<.9&&lockedFrogs.length)return{type:'skin',item:lockedFrogs[Math.floor(Math.random()*lockedFrogs.length)]};return{type:'froggy',amount:1000};
  }

  function spinDaily(){
    if(!dailyAvailable())return;audio.unlock();els.spin.disabled=true;const reward=pickDailyReward();state.wheelRotation+=1440+Math.floor(Math.random()*8)*45;els.wheelDisc.style.transform=`rotate(${state.wheelRotation}deg)`;audio.reward();haptic([10,60,10]);setTimeout(()=>claimDaily(reward),TEST_MODE?1:4050);
  }
  function claimDaily(reward){
    const previous=state.lastDaily;state.streak=previous===yesterdayKey()?state.streak+1:1;state.lastDaily=todayKey();let title,text;
    if(reward.type==='froggy'){state.balance+=reward.amount;title=`${money(reward.amount)} Froggy!`;text='Added to your virtual balance.';}
    else if(reward.type==='lucky'){state.luckyCharges+=reward.amount;title='Lucky Charm!';text=`The next ${reward.amount} jumps each get 5% less risk.`;}
    else{if(!state.unlockedFrogs.includes(reward.item.id))state.unlockedFrogs.push(reward.item.id);title=`${reward.item.name} unlocked!`;text='Find it in your frog collection.';}
    addXp(30);audio.reward();confettiBurst(70);els.rewardResultTitle.textContent=title;els.rewardResultText.textContent=text;refresh();openModal(els.rewardModal);
  }

  function toggleSound(){state.sound=!state.sound;audio.enabled=state.sound;if(state.sound)audio.tap();refresh();}
  function resetProgress(){if(!confirm('Reset all Froggy, skins, lakes, stats, and daily progress?'))return;state=deepClone(DEFAULT_STATE);localStorage.removeItem(STORAGE_KEY);scene.reset();refresh();renderCollection();setStatus('Fresh pond, fresh start.');navigate('play');}

  function installGame(){
    if(installPrompt){installPrompt.prompt();installPrompt.userChoice.finally(()=>{installPrompt=null;els.installButton.classList.add('hidden');});}
    else openModal(els.installModal);
  }

  function bind(){
    document.addEventListener('pointerdown',()=>audio.unlock(),{once:true});
    els.quickBets.addEventListener('click',e=>{const b=e.target.closest('[data-bet]');if(b)selectBet(b.dataset.bet);});
    els.start.addEventListener('click',startRound);els.jumpButton.addEventListener('click',jump);els.cash.addEventListener('click',cashOut);els.resultButton.addEventListener('click',()=>{closeModal();state.jump=0;scene.reset();refresh();});
    els.sound.addEventListener('click',toggleSound);els.settingsSound.addEventListener('click',toggleSound);els.settingsMotion.addEventListener('click',()=>{state.effects=!state.effects;refresh();});
    $('howToButton').addEventListener('click',()=>openModal(els.howToModal));$('resetButton').addEventListener('click',resetProgress);$('profileButton').addEventListener('click',()=>navigate('stats'));
    document.querySelectorAll('.nav-button').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.screen)));
    document.querySelectorAll('.segment').forEach(b=>b.addEventListener('click',()=>{collectionMode=b.dataset.collection;document.querySelectorAll('.segment').forEach(x=>x.classList.toggle('active',x===b));renderCollection();audio.tap();}));
    els.collectionGrid.addEventListener('click',e=>{const b=e.target.closest('[data-collection-action]');if(b)collectionAction(b.dataset.collectionAction);});
    els.spin.addEventListener('click',spinDaily);els.installButton.addEventListener('click',installGame);
    document.querySelectorAll('[data-close-modal]').forEach(b=>b.addEventListener('click',closeModal));els.modalBackdrop.addEventListener('click',e=>{if(e.target===els.modalBackdrop)closeModal();});
    window.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();state.roundActive?jump():startRound();}if(e.code==='Escape')state.roundActive?cashOut():closeModal();});
    window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;els.installButton.classList.remove('hidden');});
    window.addEventListener('appinstalled',()=>els.installButton.classList.add('hidden'));
  }

  function setupInstall(){
    const ios=/iphone|ipad|ipod/i.test(navigator.userAgent),standalone=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone;if(ios&&!standalone)els.installButton.classList.remove('hidden');
    if('serviceWorker' in navigator&&!TEST_MODE)navigator.serviceWorker.register('./sw.js').catch(()=>{});
  }

  async function runSelfTest(){
    try{
      state=deepClone(DEFAULT_STATE);refresh();
      document.querySelector('[data-bet="250"]').click();if(state.bet!==250)throw new Error('bet button failed');
      els.start.click();if(!state.roundActive||state.balance!==750)throw new Error('start button failed');
      forcedOutcome=true;els.jumpButton.click();await new Promise(r=>setTimeout(r,80));if(state.jump!==1||!state.roundActive)throw new Error('jump button failed');
      els.cash.click();await new Promise(r=>setTimeout(r,20));if(state.roundActive||state.balance<=750)throw new Error('cash out failed');closeModal();
      const before=state.balance;claimDaily({type:'froggy',amount:500});if(state.balance!==before+500||dailyAvailable())throw new Error('daily reward failed');closeModal();
      state.level=3;state.balance=5000;collectionMode='frogs';collectionAction('king');if(state.selectedFrog!=='king'||!state.unlockedFrogs.includes('king'))throw new Error('collection failed');
      els.selfTest.hidden=false;els.selfTest.textContent='PASS: bet, start, jump, cash-out, rewards, and unlocks';document.documentElement.dataset.selftest='pass';console.log(els.selfTest.textContent);
    }catch(error){els.selfTest.hidden=false;els.selfTest.textContent='FAIL: '+error.message;document.documentElement.dataset.selftest='fail';console.error(error);}
  }

  bind();setupInstall();refresh();renderCollection();scene.reset();
  if(!state.tutorialSeen&&!TEST_MODE){state.tutorialSeen=true;saveState();setTimeout(()=>openModal(els.howToModal),600);}
  if(TEST_MODE)runSelfTest();

  window.FroggyGame={getState:()=>deepClone(state),selectBet,startRound,jump,cashOut,forceSuccess:()=>forcedOutcome=true,forceFail:()=>forcedOutcome=false,spinDaily,reset:()=>{state=deepClone(DEFAULT_STATE);scene.reset();refresh();}};
})();
