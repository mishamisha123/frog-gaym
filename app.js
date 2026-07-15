(() => {
  'use strict';

  const TEST_MODE = new URLSearchParams(location.search).has('selftest');
  const STORAGE_KEY = 'froggy-leap-deluxe-v3';
  const BUILD_VERSION = 'v12';
  console.info(`Froggy Leap ${BUILD_VERSION}: 20 jumps + promo pack loaded`);

  // Base-game economy: every ordinary cash-out point targets 96% RTP.
  // Lucky charms and promo protections are deliberate bonuses layered above this curve.
  const TARGET_RTP = 0.96;
  const RISKS = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 18, 20, 23, 26, 30, 34, 39, 45, 52];
  const MULTIPLIERS = (() => {
    const values = [1];
    let survivalProbability = 1;
    for (const risk of RISKS) {
      survivalProbability *= 1 - risk / 100;
      values.push(TARGET_RTP / survivalProbability);
    }
    return values;
  })();
  const MIN_BET = 50;
  const REPEATABLE_PROMOS = new Set(['5','10','50000']);
  const MAX_PROMO_LEVEL = 1000000000;

  const FROGS = [
    { id:'classic', name:'Classic Frog', rarity:'COMMON', cost:0, level:1, description:'The bright-eyed mascot with a perfect storybook hop.', colors:['#baff72','#4fb84d'], art:'characters/classic.svg' },
    { id:'king', name:'King Frog', rarity:'ROYAL', cost:1200, level:3, description:'A smug pond monarch in a jeweled crown and velvet cape.', colors:['#d6ef65','#70b944'], art:'characters/king.svg' },
    { id:'robot', name:'Robo Frog', rarity:'EPIC', cost:2500, level:5, description:'Polished alloy, cyan display eyes, and calibrated landing legs.', colors:['#dff6ff','#6d97b3'], art:'characters/robot.svg' },
    { id:'ghost', name:'Ghost Frog', rarity:'EPIC', cost:4000, level:7, description:'A translucent, grumpy little spirit that floats over the pond.', colors:['#b9f5ff','#6bc8e8'], art:'characters/ghost.svg' },
    { id:'dragon', name:'Dragon Frog', rarity:'LEGENDARY', cost:7000, level:10, description:'Tiny wings, bright scales, horns, and enormous confidence.', colors:['#ff9c42','#e75235'], art:'characters/dragon.svg' },
    { id:'dino', name:'Dino Frog', rarity:'LEGENDARY', cost:9000, level:13, description:'A chunky prehistoric hopper with spikes and a toothy grin.', colors:['#c8ff70','#4eb650'], art:'characters/dino.svg' },
    { id:'ninja', name:'Ninja Frog', rarity:'EPIC', cost:15000, level:20, description:'Masked, focused, and nearly silent until the landing splash.', colors:['#344348','#161f24'], art:'characters/ninja.svg' },
    { id:'alien', name:'Alien Frog', rarity:'MYTHIC', cost:30000, level:30, description:'Stalk eyes, cosmic curiosity, and suspiciously accurate jumps.', colors:['#b7ff67','#5dc84a'], art:'characters/alien.svg' },
    { id:'rockstar', name:'Rockstar Frog', rarity:'MYTHIC', cost:75000, level:50, description:'Spiky hair, reflective shades, and a stadium-sized landing pose.', colors:['#92e95c','#4ba848'], art:'characters/rockstar.svg' },
    { id:'owner', name:'Owner Frog', rarity:'ONE OF ONE', cost:1000000000, level:20000, description:'A photo-inspired pond boss with cropped dark hair, heavy-lidded brown eyes, stubble, and an unbreakable deadpan stare.', colors:['#8ad467','#4f9d50'], art:'characters/owner.svg' }
  ];

  const FROG_IMAGES = Object.fromEntries(FROGS.map(frog=>{
    const image=new Image(); image.decoding='async'; image.src=frog.art; return [frog.id,image];
  }));

  const LAKES = [
    { id:'forest', name:'Forest Pond', emoji:'🌿', rarity:'COMMON', cost:0, level:1, description:'Sunlit reeds and crystal blue water.', a:'#bdf2f4', b:'#45bfd0', bank:'#55a94b', pad:'#5cc251', glow:'#dfff75' },
    { id:'swamp', name:'Mystic Swamp', emoji:'🌾', rarity:'RARE', cost:1500, level:3, description:'Emerald mist and ancient cypress trees.', a:'#b8e3ba', b:'#407f72', bank:'#3b7547', pad:'#62ac4c', glow:'#b9ff76' },
    { id:'cherry', name:'Cherry Blossom', emoji:'🌸', rarity:'EPIC', cost:2800, level:5, description:'Pink petals drift over a calm spring pond.', a:'#ffe3ec', b:'#75c9d4', bank:'#df8ead', pad:'#69c05a', glow:'#ffd0e3' },
    { id:'night', name:'Moonlit Pond', emoji:'🌙', rarity:'EPIC', cost:4200, level:7, description:'Fireflies sparkle beneath a silver moon.', a:'#172842', b:'#234b65', bank:'#1f513c', pad:'#4eaa68', glow:'#9fffe2' },
    { id:'volcano', name:'Volcano Lake', emoji:'🌋', rarity:'LEGENDARY', cost:6500, level:10, description:'Leap across obsidian pads above glowing lava.', a:'#3b1e2c', b:'#e5572f', bank:'#5c2f32', pad:'#423f42', glow:'#ffdd52' },
    { id:'frozen', name:'Frozen Lake', emoji:'❄️', rarity:'LEGENDARY', cost:8000, level:12, description:'Auroras dance above glassy blue ice.', a:'#cfefff', b:'#5aa7cd', bank:'#a3cce0', pad:'#8fd3d7', glow:'#f1ffff' },
    { id:'space', name:'Cosmic Pond', emoji:'🪐', rarity:'MYTHIC', cost:12000, level:15, description:'Zero-gravity lily pads under a galaxy sky.', a:'#130d31', b:'#31285b', bank:'#5c4b90', pad:'#6edb8c', glow:'#e8a7ff' }
  ];


  const WHEEL_SEGMENTS = [
    { label:'300', sub:'FROGGY', color:'#ffca4b', kind:'froggy', amount:300 },
    { label:'×3', sub:'LUCKY', color:'#59cf92', kind:'lucky', amount:3 },
    { label:'500', sub:'FROGGY', color:'#4bcddd', kind:'froggy', amount:500 },
    { label:'750', sub:'FROGGY', color:'#ff788d', kind:'froggy', amount:750 },
    { label:'FROG', sub:'SKIN', color:'#9c7ee8', kind:'skin' },
    { label:'1,000', sub:'FROGGY', color:'#5fa7ee', kind:'froggy', amount:1000 },
    { label:'250', sub:'FROGGY', color:'#9bd94e', kind:'froggy', amount:250 },
    { label:'×5', sub:'LUCKY', color:'#ed83c4', kind:'lucky', amount:5 },
    { label:'1,500', sub:'FROGGY', color:'#f29b43', kind:'froggy', amount:1500 },
    { label:'50K', sub:'JACKPOT', color:'#ffe15d', kind:'jackpot', amount:50000 }
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
    tutorialSeen: false,
    redeemedCodes: [],
    safeRunCredits: 0,
    roundSafe: false,
    unlimitedSpins: false,
    freeSpins: 0,
    promoCoinClaimed: false,
    safeJumps: 0,
    bestCashMultiplier: 0,
    goalClaims: {safe25:false, cash5:false, rounds5:false},
    playReminders: true
  };

  const $ = (id) => document.getElementById(id);
  const els = {
    app: $('app'), canvas: $('gameCanvas'), gameFrame: $('gameFrame'), status: $('statusToast'),
    balance: $('balanceLabel'), collectionBalance: $('collectionBalance'), level: $('levelLabel'), xp: $('xpLabel'), xpNext: $('xpNextLabel'), xpRing: $('xpRing'),
    jump: $('jumpLabel'), multiplier: $('multiplierLabel'), risk: $('riskLabel'), payout: $('payoutLabel'), danger: $('dangerLabel'), riskFill: $('riskFill'), riskMarker: $('riskMarker'),
    betDisplay: $('betDisplay'), start: $('startButton'), jumpButton: $('jumpButton'), cash: $('cashButton'), cashValue: $('cashButtonValue'), quickBets: $('quickBets'), betAdjusters: $('betAdjusters'), customBetToggle: $('customBetToggle'), customBetRow: $('customBetRow'), customBetInput: $('customBetInput'), customBetError: $('customBetError'),
    sound: $('soundButton'), settingsSound: $('settingsSound'), settingsMotion: $('settingsMotion'), luckyBadge: $('luckyBadge'), luckyCount: $('luckyCount'),
    screens: { play:$('playScreen'), collection:$('collectionScreen'), rewards:$('rewardsScreen'), promo:$('promoScreen'), stats:$('statsScreen') },
    collectionGrid: $('collectionGrid'), spin: $('spinButton'), wheelDisc: $('wheelDisc'), rewardDot: $('rewardDot'), streakLabel: $('streakLabel'), streakDays: $('streakDays'),
    rewardHeadline: $('rewardHeadline'), rewardSubtext: $('rewardSubtext'), freeSpinCounter: $('freeSpinCounter'), installButton: $('installButton'),
    modalBackdrop: $('modalBackdrop'), resultModal: $('resultModal'), howToModal: $('howToModal'), installModal: $('installModal'), rewardModal: $('rewardModal'),
    resultIcon: $('resultIcon'), resultKicker: $('resultKicker'), resultTitle: $('resultTitle'), resultAmount: $('resultAmount'), resultText: $('resultText'), resultButton: $('resultButton'),
    rewardResultTitle: $('rewardResultTitle'), rewardResultText: $('rewardResultText'),
    profileFrog: $('profileFrog'), bigProfileFrog: $('bigProfileFrog'), currentFrogName: $('currentFrogName'),
    totalJumpsStat: $('totalJumpsStat'), bestJumpStat: $('bestJumpStat'), biggestWinStat: $('biggestWinStat'), roundsStat: $('roundsStat'), nextLevelBonusStat: $('nextLevelBonusStat'),
    levelToast: $('levelToast'), levelToastTitle: $('levelToastTitle'), levelToastBonus: $('levelToastBonus'),
    promoForm: $('promoForm'), promoInput: $('promoInput'), promoRedeem: $('promoRedeemButton'), promoMessage: $('promoMessage'), promoUsedCount: $('promoUsedCount'), promoSafeStatus: $('promoSafeStatus'), promoSpinStatus: $('promoSpinStatus'), promoFrogStatus: $('promoFrogStatus'), promoLakeStatus: $('promoLakeStatus'), promoCoinStatus: $('promoCoinStatus'),
    milestoneTrack: $('milestoneTrack'), milestoneFill: $('milestoneFill'), goalGrid: $('goalGrid'), goalSummary: $('goalSummary'),
    sessionRoundsStat: $('sessionRoundsStat'), sessionWinsStat: $('sessionWinsStat'), sessionNetStat: $('sessionNetStat'), sessionTimeStat: $('sessionTimeStat'), pondRankLabel: $('pondRankLabel'), achievementGrid: $('achievementGrid'), settingsReminders: $('settingsReminders'),
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

  function levelBonusFor(level){ return Math.round((250 + level * 150) / 50) * 50; }

  function frogSvg(frog){
    return `<img class="frog-avatar-img" src="${frog.art}" alt="${frog.name}" draggable="false" />`;
  }

  function renderWheel(){
    const size=WHEEL_SEGMENTS.length, step=360/size;
    els.wheelDisc.style.background=`conic-gradient(${WHEEL_SEGMENTS.map((seg,i)=>`${seg.color} ${i*step}deg ${(i+1)*step}deg`).join(',')})`;
    els.wheelDisc.innerHTML=WHEEL_SEGMENTS.map((seg,i)=>{
      const angle=(i*step+step/2)*Math.PI/180;
      const x=50+34*Math.sin(angle), y=50-34*Math.cos(angle);
      return `<span class="wheel-label ${seg.kind==='jackpot'?'jackpot':''}" style="--x:${x.toFixed(2)}%;--y:${y.toFixed(2)}%"><b>${seg.label}</b><small>${seg.sub}</small></span>`;
    }).join('');
    els.wheelDisc.style.transform=`rotate(${state.wheelRotation||0}deg)`;
  }

  function loadState(){
    if (TEST_MODE) return deepClone(DEFAULT_STATE);
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const merged = Object.assign(deepClone(DEFAULT_STATE), raw);
      merged.roundActive = false;
      merged.animating = false;
      merged.jump = 0;
      merged.roundSafe = false;
      merged.redeemedCodes = Array.isArray(merged.redeemedCodes) ? merged.redeemedCodes.map(String).filter(code=>!REPEATABLE_PROMOS.has(code)) : [];
      merged.safeRunCredits = Number.isFinite(merged.safeRunCredits) ? Math.max(0, Math.floor(merged.safeRunCredits)) : 0;
      merged.unlimitedSpins = Boolean(merged.unlimitedSpins);
      merged.freeSpins = Number.isFinite(merged.freeSpins) ? Math.max(0, Math.floor(merged.freeSpins)) : 0;
      merged.promoCoinClaimed = Boolean(merged.promoCoinClaimed);
      merged.safeJumps = Number.isFinite(merged.safeJumps) ? Math.max(0, Math.floor(merged.safeJumps)) : 0;
      merged.bestCashMultiplier = Number.isFinite(merged.bestCashMultiplier) ? Math.max(0, merged.bestCashMultiplier) : 0;
      merged.goalClaims = Object.assign({safe25:false,cash5:false,rounds5:false}, merged.goalClaims || {});
      merged.playReminders = merged.playReminders !== false;
      merged.balance = Number.isFinite(merged.balance) ? Math.max(0, Math.floor(merged.balance)) : 1000;
      return merged;
    } catch { return deepClone(DEFAULT_STATE); }
  }

  let state = loadState();
  function saveState(){
    if (TEST_MODE) return;
    const stored = Object.assign({}, state, {roundActive:false, animating:false, jump:0, roundSafe:false});
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
      this.drawNextArrow(c,lake);
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
      const x=this.worldToScreenX(pad.x),bob=Math.sin(this.time*1.7+pad.phase)*3,y=pad.y+bob+pad.sink;if(x<-100||x>this.w+100)return;
      c.save();c.translate(x,y);c.rotate(Math.sin(i*1.7)*.035);c.globalAlpha=pad.sink?clamp(1-pad.sink/90,.1,1):1;
      const active=state.roundActive&&i===state.jump&&!state.animating;
      const next=state.roundActive&&i===state.jump+1&&!state.animating;
      if(active||next){c.shadowBlur=next?30:24;c.shadowColor=next?'#ffe34f':lake.glow;}
      c.fillStyle='rgba(0,54,67,.24)';c.beginPath();c.ellipse(1,17,57,22,0,0,Math.PI*2);c.fill();
      const grad=c.createLinearGradient(-46,-26,45,29);grad.addColorStop(0,this.mix(lake.pad,'#ffffff',.34));grad.addColorStop(.55,lake.pad);grad.addColorStop(1,this.mix(lake.pad,'#123f35',.18));
      c.fillStyle=grad;c.strokeStyle=next?'#ffe34f':active?lake.glow:this.mix(lake.pad,'#164f3a',.38);c.lineWidth=next?6:active?5:3;
      c.beginPath();c.moveTo(-53,-4);c.bezierCurveTo(-48,-27,-19,-32,7,-27);c.bezierCurveTo(34,-33,56,-18,55,2);c.bezierCurveTo(55,22,30,30,2,27);c.bezierCurveTo(-27,32,-55,20,-53,-4);c.closePath();c.fill();c.stroke();
      c.shadowBlur=0;
      c.fillStyle=lake.b;c.beginPath();c.moveTo(9,-28);c.lineTo(56,-7);c.lineTo(16,12);c.bezierCurveTo(11,3,9,-8,9,-28);c.closePath();c.fill();
      c.strokeStyle='rgba(24,91,53,.28)';c.lineWidth=1.5;c.beginPath();c.moveTo(4,-2);c.lineTo(-33,-15);c.moveTo(4,-2);c.lineTo(-34,11);c.moveTo(4,-2);c.lineTo(23,21);c.stroke();
      c.fillStyle='rgba(255,255,255,.24)';c.beginPath();c.ellipse(-23,-13,14,5,-.25,0,Math.PI*2);c.fill();
      if(i%4===2&&!pad.crack){
        c.save();c.translate(-34,-18);for(let k=0;k<6;k++){c.rotate(Math.PI/3);c.fillStyle=k%2?'#ffd5ea':'#fff1f8';c.beginPath();c.ellipse(0,-7,4,9,0,0,Math.PI*2);c.fill();}c.fillStyle='#ffd147';c.beginPath();c.arc(0,0,4,0,Math.PI*2);c.fill();c.restore();
      }
      if(next){c.globalAlpha=.75+.25*Math.sin(this.time*6);c.strokeStyle='#fff7a2';c.lineWidth=3;c.beginPath();c.ellipse(0,0,64,35,0,0,Math.PI*2);c.stroke();c.globalAlpha=1;}
      if(pad.crack){c.strokeStyle='#253c3d';c.lineWidth=3.5;c.lineCap='round';c.beginPath();c.moveTo(-18,-7);c.lineTo(-4,3);c.lineTo(-13,14);c.moveTo(-4,3);c.lineTo(16,10);c.moveTo(-4,3);c.lineTo(9,-11);c.stroke();}
      c.restore();
    }
    drawNextArrow(c,lake){
      if(!state.roundActive||state.animating||state.jump>=this.pads.length-1)return;
      const from=this.pads[state.jump],to=this.pads[state.jump+1];
      const x1=this.worldToScreenX(from.x),x2=this.worldToScreenX(to.x),y1=from.y-3,y2=to.y-3;
      if(x2<-80||x1>this.w+80)return;
      const x=lerp(x1,x2,.53),y=lerp(y1,y2,.53)-50+Math.sin(this.time*5)*4,angle=Math.atan2(y2-y1,x2-x1),pulse=.94+Math.sin(this.time*6)*.06;
      c.save();c.translate(x,y);c.rotate(angle);c.scale(pulse,pulse);c.shadowColor='rgba(255,214,44,.85)';c.shadowBlur=18;
      const g=c.createLinearGradient(-45,0,45,0);g.addColorStop(0,'#fff37a');g.addColorStop(1,'#ffbd21');c.fillStyle=g;c.strokeStyle='#8e6200';c.lineWidth=2.5;c.lineJoin='round';
      c.beginPath();c.moveTo(-48,-8);c.lineTo(13,-8);c.lineTo(13,-18);c.lineTo(47,0);c.lineTo(13,18);c.lineTo(13,8);c.lineTo(-48,8);c.closePath();c.fill();c.stroke();
      c.shadowBlur=0;c.fillStyle='#6f4b00';c.textAlign='center';c.font='1000 10px system-ui';c.fillText('NEXT',-6,3);
      for(let i=0;i<3;i++){const sx=-62-i*14,alpha=.25+.25*Math.sin(this.time*6-i);c.globalAlpha=alpha;c.fillStyle='#fff36c';c.beginPath();c.arc(sx,0,3+i,0,Math.PI*2);c.fill();}
      c.restore();
    }
    drawFinish(c,lake){const p=this.pads[this.pads.length-1],x=this.worldToScreenX(p.x),y=p.y-115;if(x<-100||x>this.w+100)return;c.save();c.translate(x,y);c.rotate(.04);c.fillStyle='#8d6032';c.fillRect(-4,25,8,80);c.fillStyle='#fff2c8';c.strokeStyle='#8d6032';c.lineWidth=4;c.beginPath();c.roundRect(-50,-26,100,52,10);c.fill();c.stroke();c.fillStyle='#6a4627';c.textAlign='center';c.font='1000 12px system-ui';c.fillText(`${MULTIPLIERS[MULTIPLIERS.length-1].toFixed(2)}×`,0,-3);c.font='900 9px system-ui';c.fillText('LEGENDARY',0,13);c.restore();}
    drawFrog(c,x,y,f){
      if(f.opacity<=0||x<-120||x>this.w+120)return;const frog=selectedFrog(),main=frog.colors[0],shade=frog.colors[1],outline=this.mix(shade,'#0b3c2d',.62),blink=Math.sin(this.time*.9+1.8)>.985?.14:1;
      c.save();c.translate(x,y);c.rotate(f.rotation);c.scale(f.scaleX,f.scaleY);c.globalAlpha=f.opacity*(frog.id==='ghost'?.74:1);
      c.shadowColor='rgba(0,43,49,.34)';c.shadowBlur=13;c.shadowOffsetY=9;c.fillStyle='rgba(0,48,54,.28)';c.beginPath();c.ellipse(0,34,38,11,0,0,Math.PI*2);c.fill();c.shadowBlur=0;c.shadowOffsetY=0;
      const sprite=FROG_IMAGES[frog.id];
      if(sprite&&sprite.complete&&sprite.naturalWidth){
        if(frog.id==='ghost'){c.shadowColor='#d9cfff';c.shadowBlur=24;}
        c.drawImage(sprite,-62,-78,124,124);c.restore();return;
      }
      if(frog.id==='ghost'){c.shadowColor='#d9cfff';c.shadowBlur=24;}
      if(frog.id==='dragon'){
        c.fillStyle='#f1a048';c.strokeStyle='#833e2f';c.lineWidth=3;c.beginPath();c.moveTo(-25,2);c.quadraticCurveTo(-50,-14,-44,24);c.quadraticCurveTo(-34,16,-24,24);c.closePath();c.fill();c.stroke();c.beginPath();c.moveTo(25,2);c.quadraticCurveTo(50,-14,44,24);c.quadraticCurveTo(34,16,24,24);c.closePath();c.fill();c.stroke();
      }
      if(frog.id==='dino'){c.fillStyle='#efff70';c.strokeStyle=outline;c.lineWidth=2.5;c.beginPath();c.moveTo(-25,-24);c.lineTo(-18,-42);c.lineTo(-7,-29);c.lineTo(1,-48);c.lineTo(11,-29);c.lineTo(23,-41);c.lineTo(27,-20);c.closePath();c.fill();c.stroke();}
      c.fillStyle=shade;c.strokeStyle=outline;c.lineWidth=3;
      c.save();c.rotate(-.12);c.beginPath();c.ellipse(-24,23,24,12,0,0,Math.PI*2);c.fill();c.stroke();c.restore();c.save();c.rotate(.12);c.beginPath();c.ellipse(24,23,24,12,0,0,Math.PI*2);c.fill();c.stroke();c.restore();
      c.fillStyle=shade;[[-40,25],[-32,34],[-22,37],[40,25],[32,34],[22,37]].forEach(([tx,ty])=>{c.beginPath();c.ellipse(tx,ty,7,4,0,0,Math.PI*2);c.fill();});
      const body=c.createLinearGradient(0,-5,0,36);body.addColorStop(0,main);body.addColorStop(1,shade);c.fillStyle=body;c.beginPath();c.moveTo(-23,-2);c.bezierCurveTo(-31,8,-30,31,-17,39);c.bezierCurveTo(-7,45,7,45,17,39);c.bezierCurveTo(30,31,31,8,23,-2);c.closePath();c.fill();c.stroke();
      c.fillStyle='rgba(244,255,211,.72)';c.beginPath();c.ellipse(0,22,15,18,0,0,Math.PI*2);c.fill();
      c.strokeStyle=outline;c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(-21,5);c.quadraticCurveTo(-36,13,-31,28);c.moveTo(21,5);c.quadraticCurveTo(36,13,31,28);c.stroke();
      c.lineWidth=2.6;[[-34,29,-43,30],[-33,30,-40,37],[34,29,43,30],[33,30,40,37]].forEach(q=>{c.beginPath();c.moveTo(q[0],q[1]);c.lineTo(q[2],q[3]);c.stroke();});
      const head=c.createLinearGradient(0,-37,0,9);head.addColorStop(0,this.mix(main,'#ffffff',.12));head.addColorStop(1,main);c.fillStyle=head;c.lineWidth=3.2;c.beginPath();c.moveTo(-29,-21);c.bezierCurveTo(-27,-42,-10,-47,0,-42);c.bezierCurveTo(10,-47,27,-42,29,-21);c.bezierCurveTo(34,-2,21,10,0,12);c.bezierCurveTo(-21,10,-34,-2,-29,-21);c.closePath();c.fill();c.stroke();
      c.fillStyle=main;c.beginPath();c.ellipse(-18,-37,13,15,0,0,Math.PI*2);c.ellipse(18,-37,13,15,0,0,Math.PI*2);c.fill();c.stroke();
      c.save();c.translate(0,-37);c.scale(1,blink);c.fillStyle='#fff';c.beginPath();c.ellipse(-18,0,8.2,10,0,0,Math.PI*2);c.ellipse(18,0,8.2,10,0,0,Math.PI*2);c.fill();c.fillStyle='#e9c73c';c.beginPath();c.ellipse(-17,1,5.2,7,0,0,Math.PI*2);c.ellipse(17,1,5.2,7,0,0,Math.PI*2);c.fill();c.fillStyle='#102f29';c.beginPath();c.ellipse(-17,2,2.6,5.2,0,0,Math.PI*2);c.ellipse(17,2,2.6,5.2,0,0,Math.PI*2);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(-15,-2,1.7,0,Math.PI*2);c.arc(19,-2,1.7,0,Math.PI*2);c.fill();c.restore();
      c.shadowBlur=0;c.fillStyle='#275b40';c.beginPath();c.arc(-7,-18,1.7,0,Math.PI*2);c.arc(7,-18,1.7,0,Math.PI*2);c.fill();
      c.fillStyle='rgba(255,118,133,.24)';c.beginPath();c.arc(-22,-10,5,0,Math.PI*2);c.arc(22,-10,5,0,Math.PI*2);c.fill();
      c.strokeStyle='#275b40';c.lineWidth=2.5;c.beginPath();
      if(frog.id==='owner'){c.moveTo(-13,-8);c.quadraticCurveTo(0,-11,13,-8);}else{c.moveTo(-13,-9);c.quadraticCurveTo(0,3,13,-9);}c.stroke();
      if(frog.id==='owner'){
        c.fillStyle='#1a2025';c.strokeStyle='#0d1216';c.lineWidth=2.8;c.lineJoin='round';c.beginPath();c.moveTo(-29,-36);c.lineTo(-24,-51);c.lineTo(-16,-44);c.lineTo(-8,-59);c.lineTo(0,-47);c.lineTo(10,-61);c.lineTo(16,-46);c.lineTo(27,-54);c.lineTo(30,-34);c.quadraticCurveTo(12,-43,0,-39);c.quadraticCurveTo(-12,-44,-29,-36);c.closePath();c.fill();c.stroke();
        c.strokeStyle='#183f33';c.lineWidth=3;c.beginPath();c.moveTo(-25,-29);c.lineTo(-10,-31);c.moveTo(10,-31);c.lineTo(25,-29);c.stroke();
        c.fillStyle='#1c2328';c.beginPath();c.moveTo(-21,14);c.quadraticCurveTo(0,25,21,14);c.lineTo(17,38);c.quadraticCurveTo(0,46,-17,38);c.closePath();c.fill();
      }
      if(frog.id==='king'){
        c.fillStyle='#ffd84e';c.strokeStyle='#81551e';c.lineWidth=3;c.lineJoin='round';c.beginPath();c.moveTo(-25,-47);c.lineTo(-16,-65);c.lineTo(-3,-51);c.lineTo(12,-66);c.lineTo(24,-47);c.closePath();c.fill();c.stroke();c.fillStyle='#ff6d76';c.beginPath();c.arc(-16,-58,2.5,0,Math.PI*2);c.fill();c.fillStyle='#58bdff';c.beginPath();c.arc(12,-59,2.5,0,Math.PI*2);c.fill();
      } else if(frog.id==='robot'){
        c.strokeStyle='#3c596e';c.lineWidth=3;c.beginPath();c.moveTo(0,-50);c.lineTo(0,-63);c.stroke();c.fillStyle='#ff6d70';c.beginPath();c.arc(0,-66,4,0,Math.PI*2);c.fill();c.stroke();c.strokeStyle='#def8ff';c.lineWidth=2;c.beginPath();c.roundRect(-27,-31,54,35,12);c.stroke();
      } else if(frog.id==='dragon'){
        c.fillStyle='#fff1a2';c.strokeStyle='#833e2f';c.lineWidth=3;c.beginPath();c.moveTo(-24,-44);c.lineTo(-31,-60);c.lineTo(-14,-50);c.moveTo(24,-44);c.lineTo(31,-60);c.lineTo(14,-50);c.stroke();
      }
      c.restore();
    }
    drawParticle(c,p){const x=this.worldToScreenX(p.x),alpha=clamp(p.life/p.max,0,1);c.save();c.globalAlpha=alpha;c.fillStyle=p.color;if(p.kind==='coin'){c.beginPath();c.arc(x,p.y,p.size,0,Math.PI*2);c.fill();c.fillStyle='#986700';c.font=`900 ${Math.max(6,p.size)}px system-ui`;c.textAlign='center';c.fillText('F',x,p.y+2);}else{c.beginPath();c.arc(x,p.y,p.size,0,Math.PI*2);c.fill();}c.restore();}
  }

  const scene = new Scene(els.canvas);
  let forcedOutcome = null;
  let installPrompt = null;
  let collectionMode = 'frogs';
  let wheelSpinning = false;
  let currentSpinSource = null;
  const session = {startedAt:Date.now(), rounds:0, wins:0, losses:0, net:0, lossStreak:0, reminded:false};

  function setStatus(text,kind=''){
    els.status.textContent=text; els.status.classList.remove('win','lose'); if(kind)els.status.classList.add(kind);
  }
  function dangerName(r){ return r<8?'Tiny ripple':r<18?'Wobbly':r<30?'Getting risky':r<45?'Slippery':r<60?'Dangerous':r<75?'Very dangerous':'Splash zone'; }
  function effectiveRisk(){ if(state.jump>=RISKS.length)return 0; return Math.max(1,RISKS[state.jump]-(state.luckyCharges>0?5:0)); }

  const POND_GOALS = [
    {id:'safe25', icon:'🌿', title:'Sure-Footed', detail:'Land 25 safe jumps across all rounds.', target:25, reward:300, xp:50},
    {id:'cash5', icon:'🪙', title:'Smart Hopper', detail:'Cash out at 5.00× or higher.', target:5, reward:600, xp:80},
    {id:'rounds5', icon:'🎯', title:'Pond Regular', detail:'Complete 5 rounds.', target:5, reward:250, xp:40}
  ];

  function pondRank(){
    if(state.bestJump>=20)return 'Pond Legend';
    if(state.bestJump>=15)return 'Pond Master';
    if(state.bestJump>=10)return 'Deepwater Hopper';
    if(state.bestJump>=5)return 'Lily Scout';
    if(state.bestJump>=1)return 'Hopper';
    return 'Tadpole';
  }

  function goalValue(id){
    if(id==='safe25')return state.safeJumps;
    if(id==='cash5')return state.bestCashMultiplier;
    return state.rounds;
  }

  function refreshEngagement(){
    if(!els.milestoneFill)return;
    const progress=clamp(state.jump/RISKS.length*100,0,100);
    els.milestoneFill.style.width=`${progress}%`;
    els.milestoneTrack.querySelectorAll('[data-milestone]').forEach(node=>{
      const step=Number(node.dataset.milestone);
      node.classList.toggle('active',state.jump>=step);
      node.classList.toggle('current',state.roundActive&&state.jump<step&&step===Math.ceil((state.jump+1)/5)*5);
    });
    const unclaimed=POND_GOALS.filter(goal=>!state.goalClaims[goal.id]).length;
    els.goalSummary.textContent=unclaimed?`${unclaimed} goal${unclaimed===1?'':'s'} available`:'All goals claimed';
    els.goalGrid.innerHTML=POND_GOALS.map(goal=>{
      const value=goalValue(goal.id), completed=value>=goal.target, claimed=Boolean(state.goalClaims[goal.id]);
      const shown=Math.min(value,goal.target), pct=clamp(value/goal.target*100,0,100);
      return `<article class="goal-card ${claimed?'claimed':''}"><div class="goal-top"><span class="goal-icon">${goal.icon}</span><div class="goal-copy"><b>${goal.title}</b><small>${goal.detail}</small></div><span class="goal-reward">+${money(goal.reward)} F<br>+${goal.xp} XP</span></div><div class="goal-progress"><i style="width:${pct}%"></i></div><div class="goal-footer"><span>${idProgress(goal.id,shown,goal.target)}</span><button class="goal-claim pressable" data-goal-claim="${goal.id}" ${!completed||claimed?'disabled':''}>${claimed?'CLAIMED':completed?'CLAIM':'IN PROGRESS'}</button></div></article>`;
    }).join('');
    const minutes=Math.floor((Date.now()-session.startedAt)/60000);
    els.sessionRoundsStat.textContent=session.rounds;
    els.sessionWinsStat.textContent=session.wins;
    els.sessionNetStat.textContent=`${session.net>0?'+':''}${money(session.net)} F`;
    els.sessionNetStat.classList.toggle('positive',session.net>0);
    els.sessionNetStat.classList.toggle('negative',session.net<0);
    els.sessionTimeStat.textContent=`${minutes}m`;
    els.pondRankLabel.textContent=pondRank();
    const achievements=[
      ['🌱','First Hop','Land your first safe jump.',state.safeJumps>=1],
      ['🌊','Deep Pond','Reach jump 10.',state.bestJump>=10],
      ['🏆','Legendary Leap','Clear all 20 pads.',state.bestJump>=20],
      ['🐸','Collector','Own five frogs.',state.unlockedFrogs.length>=5],
      ['💰','Big Cash','Cash out at 10× or higher.',state.bestCashMultiplier>=10]
    ];
    els.achievementGrid.innerHTML=achievements.map(([icon,title,detail,unlocked])=>`<article class="achievement-card ${unlocked?'unlocked':''}"><span class="badge">${unlocked?icon:'🔒'}</span><div><b>${title}</b><small>${unlocked?detail:'Locked'}</small></div></article>`).join('');
    els.settingsReminders.querySelector('b').textContent=state.playReminders?'On':'Off';
    els.gameFrame.classList.toggle('deep-run',state.roundActive&&state.jump>=10);
  }

  function idProgress(id,value,target){
    if(id==='cash5')return `${Math.min(value,target).toFixed(2)}× / ${target.toFixed(2)}×`;
    return `${Math.floor(value)} / ${target}`;
  }

  function claimGoal(id){
    const goal=POND_GOALS.find(item=>item.id===id);
    if(!goal||state.goalClaims[id]||goalValue(id)<goal.target)return false;
    state.goalClaims[id]=true;
    state.balance+=goal.reward;
    addXp(goal.xp);
    audio.reward();haptic([12,35,22]);confettiBurst(55);screenFeedback('win');
    setStatus(`${goal.title} complete: +${money(goal.reward)} Froggy and +${goal.xp} XP!`,'win');
    refresh();
    return true;
  }

  function refresh(){
    const payout=currentPayout(), risk=effectiveRisk(), xpNeeded=nextXp(), frog=selectedFrog(), lake=selectedLake();
    els.balance.textContent=money(state.balance); els.collectionBalance.textContent=money(state.balance); els.level.textContent=`Lv. ${state.level}`; els.xp.textContent=state.xp; els.xpNext.textContent=xpNeeded; els.xpRing.style.setProperty('--xp',`${clamp(state.xp/xpNeeded*100,0,100)}%`);
    els.jump.textContent=`${state.jump} / ${RISKS.length}`; els.multiplier.textContent=`${MULTIPLIERS[state.jump].toFixed(2)}×`; els.risk.textContent=state.jump>=RISKS.length?'—':`${risk}%`; els.payout.textContent=`${money(payout)} F`; els.cashValue.textContent=`${money(payout)} F`;
    els.betDisplay.textContent=money(state.bet); els.start.querySelector('small').textContent=`Bet ${money(state.bet)} F`; els.danger.textContent=state.jump>=RISKS.length?'Legendary leap':dangerName(risk); els.riskFill.style.width=`${risk}%`;els.riskMarker.style.left=`${risk}%`;els.riskMarker.style.background=risk<30?'#52c95a':risk<60?'#f3c442':'#eb506b';
    els.start.classList.toggle('hidden',state.roundActive); els.jumpButton.classList.toggle('hidden',!state.roundActive); els.cash.classList.toggle('hidden',!state.roundActive||state.jump===0); els.jumpButton.disabled=state.animating;els.cash.disabled=state.animating;
    els.quickBets.querySelectorAll('button').forEach(b=>{b.disabled=state.roundActive;b.classList.toggle('selected',Number(b.dataset.bet)===state.bet);});els.betAdjusters.querySelectorAll('button').forEach(b=>b.disabled=state.roundActive);els.customBetInput.disabled=state.roundActive;
    els.sound.textContent=state.sound?'🔊':'🔇';audio.enabled=state.sound;els.settingsSound.querySelector('b').textContent=state.sound?'On':'Off';els.settingsMotion.querySelector('b').textContent=state.effects?'On':'Reduced';
    els.luckyBadge.classList.toggle('hidden',state.luckyCharges<=0);els.luckyCount.textContent=state.luckyCharges;
    els.profileFrog.innerHTML=frogSvg(frog);els.bigProfileFrog.innerHTML=frogSvg(frog);els.currentFrogName.textContent=frog.name;els.app.dataset.theme=lake.id;
    els.totalJumpsStat.textContent=money(state.totalJumps);els.bestJumpStat.textContent=state.bestJump;els.biggestWinStat.textContent=`${money(state.biggestWin)} F`;els.roundsStat.textContent=money(state.rounds);els.nextLevelBonusStat.textContent=`${money(levelBonusFor(state.level+1))} F`;
    refreshDaily(); refreshPromo(); refreshEngagement(); saveState();
  }

  let levelToastTimer=0;
  function showLevelBonus(level,bonus){
    clearTimeout(levelToastTimer);els.levelToastTitle.textContent=`Level ${level}`;els.levelToastBonus.textContent=`+${money(bonus)} F`;els.levelToast.classList.remove('show');void els.levelToast.offsetWidth;els.levelToast.classList.add('show');levelToastTimer=setTimeout(()=>els.levelToast.classList.remove('show'),3000);
  }

  function addXp(amount){
    state.xp+=amount;let totalBonus=0,lastLevel=state.level;
    while(state.xp>=nextXp()){
      const needed=nextXp();state.xp-=needed;state.level++;lastLevel=state.level;
      const bonus=levelBonusFor(state.level);state.balance+=bonus;totalBonus+=bonus;
    }
    if(totalBonus>0){setStatus(`Level ${lastLevel}! Bonus: +${money(totalBonus)} Froggy.`,'win');showLevelBonus(lastLevel,totalBonus);screenFeedback('win');audio.reward();confettiBurst(65);}
    return totalBonus;
  }

  function setBetAmount(rawValue,{quiet=false}={}){
    if(state.roundActive)return false;
    const bet=Math.floor(Number(rawValue));
    if(!Number.isFinite(bet)){els.customBetError.textContent='Enter a whole-number bet.';haptic(18);return false;}
    if(bet<MIN_BET){els.customBetError.textContent=`Minimum bet is ${MIN_BET} Froggy.`;haptic(18);return false;}
    if(bet>state.balance){els.customBetError.textContent=`You only have ${money(state.balance)} Froggy.`;haptic(18);return false;}
    state.bet=bet;els.customBetError.textContent='';if(!quiet)audio.tap();refresh();return true;
  }

  function selectBet(value){
    if(state.roundActive)return false;
    const bet=value==='max'?state.balance:Number(value);
    return setBetAmount(bet);
  }

  function adjustBet(action){
    if(state.roundActive)return;
    if(action==='half')setBetAmount(Math.max(MIN_BET,Math.floor(state.bet/2)));
    if(action==='double')setBetAmount(Math.min(state.balance,state.bet*2));
  }

  function applyCustomBet(){
    const applied=setBetAmount(els.customBetInput.value);
    if(applied){els.customBetInput.value='';els.customBetRow.classList.add('hidden');setStatus(`Custom bet set to ${money(state.bet)} Froggy.`,'win');}
    return applied;
  }

  function startRound(){
    audio.unlock(); if(state.roundActive||state.animating)return;
    if(state.balance<MIN_BET){state.balance+=500;setStatus('Pond rescue bonus: +500 Froggy!','win');audio.reward();confettiBurst(25);refresh();return;}
    if(state.bet>state.balance){state.bet=Math.floor(state.balance/50)*50;setStatus('Bet adjusted to your available Froggy.');refresh();return;}
    state.balance-=state.bet;session.rounds++;session.net-=state.bet;state.jump=0;state.roundActive=true;state.animating=false;state.roundSafe=state.safeRunCredits>0;if(state.roundSafe)state.safeRunCredits--;state.rounds++;scene.reset();setStatus(`${money(state.bet)} Froggy on the line. Make the first leap!`);audio.start();haptic(20);refresh();
  }

  function jump(){
    if(!state.roundActive||state.animating||state.jump>=RISKS.length)return;audio.unlock();state.animating=true;const next=state.jump+1;const risk=effectiveRisk();if(state.luckyCharges>0&&!state.roundSafe)state.luckyCharges--;
    const fail=state.roundSafe?false:(forcedOutcome===null?Math.random()<risk/100:!forcedOutcome);forcedOutcome=null;setStatus(`Crouch… launch! Pad ${next} has ${risk}% failure risk.`);refresh();
    scene.jumpTo(next,fail,(didFail)=>{
      state.animating=false;state.totalJumps++;
      if(didFail){
        state.roundActive=false;state.roundSafe=false;state.bestJump=Math.max(state.bestJump,state.jump);session.losses++;session.lossStreak++;setStatus('SPLASH! The lily pad broke.','lose');
        const lost=state.bet,careNote=session.lossStreak>=3?' Three losses in a row—consider taking a short break before another round.':''; refresh(); setTimeout(()=>showResult({icon:'💦',kicker:'ROUND OVER',title:'The pad cracked!',amount:`−${money(lost)} F`,text:`You reached jump ${state.jump}. The pond keeps this bet.${careNote}`,lose:true}),TEST_MODE?1:420);
      } else {
        state.jump=next;state.safeJumps++;state.bestJump=Math.max(state.bestJump,state.jump);addXp(10+state.jump*2);audio.coin();haptic(15);screenFeedback('win');
        if([5,10,15].includes(state.jump)){audio.reward();haptic([12,30,18]);confettiBurst(22+state.jump);}
        if(state.jump===RISKS.length){
          const payout=currentPayout();state.balance+=payout;session.net+=payout;session.wins++;session.lossStreak=0;state.bestCashMultiplier=Math.max(state.bestCashMultiplier,MULTIPLIERS[state.jump]);state.biggestWin=Math.max(state.biggestWin,payout);state.roundActive=false;state.roundSafe=false;addXp(120);setStatus(`LEGENDARY LEAP! ${money(payout)} Froggy at ${MULTIPLIERS[state.jump].toFixed(2)}×!`,'win');audio.win();confettiBurst(120);refresh();setTimeout(()=>showResult({icon:'🏆',kicker:'LEGENDARY LEAP',title:'Every pad cleared!',amount:`+${money(payout)} F`,text:`Twenty golden landings and a ${MULTIPLIERS[state.jump].toFixed(2)}× finish. Absolute frog glory.`}),TEST_MODE?1:500);
        } else {const milestoneName={5:'WARM-UP CLEARED',10:'DEEP WATER',15:'POND MASTER'}[state.jump];setStatus(milestoneName?`${milestoneName}! ${MULTIPLIERS[state.jump].toFixed(2)}× secured so far.`:`Perfect landing! ${MULTIPLIERS[state.jump].toFixed(2)}× — cash out or leap again.`,'win');refresh();}
      }
    });
  }

  function cashOut(){
    if(!state.roundActive||state.animating||state.jump===0)return;const payout=currentPayout(),profit=payout-state.bet;state.balance+=payout;session.net+=payout;session.wins++;session.lossStreak=0;state.bestCashMultiplier=Math.max(state.bestCashMultiplier,MULTIPLIERS[state.jump]);state.biggestWin=Math.max(state.biggestWin,payout);state.roundActive=false;state.roundSafe=false;addXp(25+state.jump*4);audio.cash();haptic([15,35,20]);screenFeedback('win');confettiBurst(35+state.jump*3);setStatus(`Cashed out ${money(payout)} Froggy!`,'win');refresh();setTimeout(()=>showResult({icon:'🪙',kicker:'SMART CASH-OUT',title:`${MULTIPLIERS[state.jump].toFixed(2)}× secured!`,amount:`+${money(payout)} F`,text:`Profit: ${money(profit)} Froggy. Great timing.`}),TEST_MODE?1:220);
  }

  function showResult({icon,kicker,title,amount,text,lose=false}){
    els.resultIcon.textContent=icon;els.resultKicker.textContent=kicker;els.resultTitle.textContent=title;els.resultAmount.textContent=amount;els.resultAmount.style.color=lose?'#d6405d':'';els.resultText.textContent=text;openModal(els.resultModal);
  }
  function openModal(modal){els.modalBackdrop.classList.remove('hidden');[els.resultModal,els.howToModal,els.installModal,els.rewardModal].forEach(m=>m.classList.add('hidden'));modal.classList.remove('hidden');}
  function closeModal(){els.modalBackdrop.classList.add('hidden');[els.resultModal,els.howToModal,els.installModal,els.rewardModal].forEach(m=>m.classList.add('hidden'));}
  function screenFeedback(kind){if(!state.effects)return;els.flash.className=`flash-layer flash-${kind}`;els.gameFrame.classList.toggle('shake',kind==='lose');setTimeout(()=>{els.flash.className='flash-layer';els.gameFrame.classList.remove('shake');},500);}
  function confettiBurst(count=55){if(!state.effects)count=Math.ceil(count*.25);const colors=['#e9ff6a','#52d8d0','#ffcc4b','#fa6d8a','#aa82ec','#fff'];for(let i=0;i<count;i++){const d=document.createElement('i');d.className='confetti';d.style.left=`${Math.random()*100}%`;d.style.top=`${-10-Math.random()*30}px`;d.style.background=colors[i%colors.length];d.style.setProperty('--dx',`${(Math.random()-.5)*240}px`);d.style.setProperty('--spin',`${(Math.random()-.5)*1200}deg`);d.style.setProperty('--dur',`${1.5+Math.random()*1.8}s`);els.confetti.appendChild(d);setTimeout(()=>d.remove(),3600);}}

  function navigate(screen){
    Object.entries(els.screens).forEach(([key,node])=>node.classList.toggle('active',key===screen));document.querySelectorAll('.nav-button').forEach(b=>b.classList.toggle('active',b.dataset.screen===screen));audio.tap();if(screen==='collection')renderCollection();if(screen==='rewards')refreshDaily();if(screen==='promo')refreshPromo();if(screen==='stats')refresh();
  }

  function renderCollection(){
    const items=collectionMode==='frogs'?FROGS:LAKES, unlocked=collectionMode==='frogs'?state.unlockedFrogs:state.unlockedLakes, selected=collectionMode==='frogs'?state.selectedFrog:state.selectedLake;
    els.collectionGrid.innerHTML=items.map(item=>{
      const owned=unlocked.includes(item.id),equipped=selected===item.id,canLevel=state.level>=item.level;let action=equipped?'EQUIPPED':owned?'EQUIP':canLevel?`UNLOCK · ${money(item.cost)} F`:`LEVEL ${item.level} REQUIRED`;
      const art=collectionMode==='frogs'?frogSvg(item):`<span class="lake-art-emoji">${item.emoji}</span><i class="lake-art-ripple"></i>`;
      const tier=String(item.rarity||'common').toLowerCase().replace(/[^a-z0-9]+/g,'-');
      return `<article class="collection-card ${collectionMode==='lakes'?'lake':''} tier-${tier} ${equipped?'selected':''}" data-item="${item.id}" style="--card-a:${item.colors?item.colors[0]:item.a};--card-b:${item.colors?item.colors[1]:item.b}"><span class="rarity">${item.rarity}</span><div class="collection-art">${art}<i class="portrait-spark s1"></i><i class="portrait-spark s2"></i></div><h3>${item.name}</h3><p>${item.description}</p><button class="collection-action pressable ${owned?'owned':'locked'}" data-collection-action="${item.id}" ${equipped?'disabled':''}>${action}</button></article>`;
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


  function setPromoMessage(text,kind=''){
    els.promoMessage.textContent=text;
    els.promoMessage.classList.remove('success','error');
    if(kind)els.promoMessage.classList.add(kind);
  }

  function refreshPromo(){
    if(!els.promoUsedCount)return;
    els.promoUsedCount.textContent=state.redeemedCodes.length;
    els.promoSafeStatus.textContent=state.safeRunCredits>0?`${state.safeRunCredits} protected round${state.safeRunCredits===1?'':'s'}`:state.roundSafe?'Active this round':'Not active';
    els.promoSpinStatus.textContent=state.unlimitedSpins?'unlimintos':`${state.freeSpins} free spin${state.freeSpins===1?'':'s'}`;
    els.promoFrogStatus.textContent=`${state.unlockedFrogs.length} / ${FROGS.length} frogs`;
    els.promoLakeStatus.textContent=`${state.unlockedLakes.length} / ${LAKES.length} lakes`;
    els.promoCoinStatus.textContent=state.promoCoinClaimed?'Reusable · 50K claimed':'Reusable 50K reward';
  }

  function redeemPromo(rawCode){
    const code=String(rawCode||'').trim().toLowerCase();
    const repeatable=REPEATABLE_PROMOS.has(code);
    if(!code){setPromoMessage('Type a promo code first.','error');haptic(18);return false;}
    if(!repeatable&&state.redeemedCodes.includes(code)){setPromoMessage('That one-time code has already been redeemed on this save.','error');haptic(20);return false;}

    let message='';
    let confettiCount=55;

    if(code==='imtheowner'){
      state.safeRunCredits+=1;
      message='Owner Pass armed. Your next complete round is protected while every displayed risk percentage stays normal.';
    }else if(code==='50000'){
      state.balance+=50000;
      state.promoCoinClaimed=true;
      confettiCount=120;
      message='Vault opened: +50,000 Froggy added. This code is reusable.';
    }else if(code==='unlockall'){
      state.unlockedFrogs=FROGS.map(f=>f.id);
      message='Character vault opened. Every frog is now unlocked!';
    }else if(code==='iwannaswim'){
      state.unlockedLakes=LAKES.map(lake=>lake.id);
      message='Every lake is unlocked. Pick a new pond in the Collection tab!';
    }else if(code==='spinall'){
      state.unlimitedSpins=true;
      message='Unlimited wheel mode activated. The counter now shows unlimintos!';
    }else if(code==='10'){
      state.freeSpins+=10;
      message=`Ten free spins added. You now have ${state.freeSpins} free spins. This code is reusable.`;
    }else if(code==='5'){
      const previousLevel=state.level;
      state.level=Math.min(MAX_PROMO_LEVEL,Math.max(1,Math.floor(state.level*5)));
      state.xp=0;
      message=state.level===previousLevel
        ? `Maximum promo level reached: ${money(state.level)}.`
        : `Level multiplied: ${money(previousLevel)} → ${money(state.level)}. This code is reusable.`;
    }else if(code==='luckylily'){
      state.luckyCharges+=25;
      message='Lucky Lily activated: +25 lucky jumps with reduced failure risk.';
    }else if(code==='pondparty'){
      state.balance+=2500;
      state.freeSpins+=3;
      message='Pond Party bundle: +2,500 Froggy and +3 free spins!';
    }else if(code==='xpfrog'){
      addXp(1000);
      message='XP Frog delivered +1,000 XP. Any earned level bonuses were added too!';
    }else if(code==='lifeguard'){
      state.safeRunCredits+=3;
      message='Lifeguard bundle added three protected rounds.';
    }else{
      setPromoMessage('That promo code was not recognized. Check the spelling and try again.','error');
      haptic([18,45,18]);
      return false;
    }

    if(!repeatable)state.redeemedCodes.push(code);
    els.promoInput.value='';
    setPromoMessage(message,'success');
    setStatus(message,'win');
    audio.reward();haptic([12,35,22]);confettiBurst(confettiCount);screenFeedback('win');
    refresh();renderCollection();
    return true;
  }

  function hasDailySpin(){return state.lastDaily!==todayKey();}
  function dailyAvailable(){return state.unlimitedSpins||state.freeSpins>0||hasDailySpin();}
  function freeSpinDisplay(){return state.unlimitedSpins?'unlimintos':String(state.freeSpins);}
  function refreshDaily(){
    const ready=dailyAvailable(),unlimited=state.unlimitedSpins,daily=hasDailySpin(),free=state.freeSpins;
    els.rewardDot.classList.toggle('hidden',!ready);els.spin.disabled=!ready||wheelSpinning;
    els.freeSpinCounter.textContent=freeSpinDisplay();
    els.spin.querySelector('span').textContent=wheelSpinning?'SPINNING':ready?'SPIN':'DONE';
    els.spin.querySelector('small').textContent=wheelSpinning?'GOOD LUCK':unlimited?'UNLIMITED':daily?'DAILY':free>0?`FREE ×${free}`:'TOMORROW';
    els.rewardHeadline.textContent=unlimited?'Unlimited spins unlocked!':daily?'Your daily reward is ready!':free>0?`${free} free spin${free===1?'':'s'} ready!`:'Come back tomorrow!';
    els.rewardSubtext.textContent=unlimited?'Spin as often as you like. The free-spin counter shows unlimintos.':daily?'Your daily spin is ready. Extra promo spins are shown in the counter above.':free>0?'Each tap consumes one free spin after your daily spin has been used.':`Day ${state.streak} claimed. Your streak is safe.`;
    els.streakLabel.textContent=Math.max(1,state.streak);
    els.streakDays.innerHTML=Array.from({length:7},(_,i)=>`<div class="streak-day ${i<Math.min(state.streak,7)?'claimed':''} ${i===Math.min(state.streak,7)-1?'today':''}">${i===6?'🎁':i+1}</div>`).join('');
  }

  function rewardFromSegment(index,lockedFrogs){
    const segment=WHEEL_SEGMENTS[index];
    if(segment.kind==='skin'){
      if(lockedFrogs.length)return{type:'skin',item:lockedFrogs[Math.floor(Math.random()*lockedFrogs.length)]};
      return{type:'froggy',amount:2000};
    }
    if(segment.kind==='lucky')return{type:'lucky',amount:segment.amount};
    return{type:'froggy',amount:segment.amount};
  }

  function pickDailyReward(){
    const nextStreak=state.unlimitedSpins?1:(state.lastDaily===yesterdayKey()?state.streak+1:1);
    const lockedFrogs=FROGS.filter(f=>!state.unlockedFrogs.includes(f.id)&&state.level>=f.level);
    if(nextStreak%7===0&&lockedFrogs.length)return{index:4,reward:{type:'skin',item:lockedFrogs[Math.floor(Math.random()*lockedFrogs.length)]}};
    const index=Math.floor(Math.random()*WHEEL_SEGMENTS.length);
    return{index,reward:rewardFromSegment(index,lockedFrogs)};
  }

  function spinDaily(){
    if(!dailyAvailable()||wheelSpinning)return;wheelSpinning=true;currentSpinSource=state.unlimitedSpins?'unlimited':hasDailySpin()?'daily':'free';audio.unlock();els.spin.disabled=true;els.spin.querySelector('span').textContent='SPINNING';els.spin.querySelector('small').textContent='GOOD LUCK';
    const result=pickDailyReward(),step=360/WHEEL_SEGMENTS.length,center=result.index*step+step/2,current=((state.wheelRotation%360)+360)%360,target=(360-center)%360,delta=(target-current+360)%360;
    state.wheelRotation+=1440+delta;els.wheelDisc.style.transform=`rotate(${state.wheelRotation}deg)`;audio.reward();haptic([10,60,10]);setTimeout(()=>claimDaily(result.reward),TEST_MODE?1:4050);
  }
  function claimDaily(reward){
    if(currentSpinSource===null)currentSpinSource=state.unlimitedSpins?'unlimited':hasDailySpin()?'daily':'free';
    wheelSpinning=false;const previous=state.lastDaily;if(currentSpinSource==='daily'){state.streak=previous===yesterdayKey()?state.streak+1:1;state.lastDaily=todayKey();}else if(currentSpinSource==='free'){state.freeSpins=Math.max(0,state.freeSpins-1);}currentSpinSource=null;let title,text;
    if(reward.type==='froggy'){state.balance+=reward.amount;title=reward.amount===50000?'JACKPOT — 50,000 Froggy!':`${money(reward.amount)} Froggy!`;text=reward.amount===50000?'You landed on the golden jackpot slice. Ribbit-rich!':'Added to your virtual balance.';}
    else if(reward.type==='lucky'){state.luckyCharges+=reward.amount;title='Lucky Charm!';text=`The next ${reward.amount} jumps each get 5% less risk.`;}
    else{if(!state.unlockedFrogs.includes(reward.item.id))state.unlockedFrogs.push(reward.item.id);title=`${reward.item.name} unlocked!`;text='Find it in your frog collection.';}
    addXp(30);audio.reward();confettiBurst(reward.type==='froggy'&&reward.amount===50000?180:70);if(reward.type==='froggy'&&reward.amount===50000){screenFeedback('win');haptic([30,40,30,40,80]);}els.rewardResultTitle.textContent=title;els.rewardResultText.textContent=text;refresh();openModal(els.rewardModal);
  }

  function toggleSound(){state.sound=!state.sound;audio.enabled=state.sound;if(state.sound)audio.tap();refresh();}
  function resetProgress(){if(!confirm('Reset all Froggy, skins, lakes, stats, and daily progress?'))return;wheelSpinning=false;currentSpinSource=null;state=deepClone(DEFAULT_STATE);localStorage.removeItem(STORAGE_KEY);scene.reset();renderWheel();refresh();renderCollection();setPromoMessage('Enter a valid code to reveal its reward.');setStatus('Fresh pond, fresh start.');navigate('play');}

  function installGame(){
    if(installPrompt){installPrompt.prompt();installPrompt.userChoice.finally(()=>{installPrompt=null;els.installButton.classList.add('hidden');});}
    else openModal(els.installModal);
  }

  function bind(){
    document.addEventListener('pointerdown',()=>audio.unlock(),{once:true});
    els.quickBets.addEventListener('click',e=>{const b=e.target.closest('[data-bet]');if(b)selectBet(b.dataset.bet);});els.betAdjusters.addEventListener('click',e=>{const betButton=e.target.closest('[data-bet]');if(betButton)selectBet(betButton.dataset.bet);const actionButton=e.target.closest('[data-bet-action]');if(actionButton)adjustBet(actionButton.dataset.betAction);});els.customBetToggle.addEventListener('click',()=>{if(state.roundActive)return;els.customBetRow.classList.toggle('hidden');if(!els.customBetRow.classList.contains('hidden'))setTimeout(()=>els.customBetInput.focus(),30);});els.customBetRow.addEventListener('submit',e=>{e.preventDefault();applyCustomBet();});
    els.start.addEventListener('click',startRound);els.jumpButton.addEventListener('click',jump);els.cash.addEventListener('click',cashOut);els.resultButton.addEventListener('click',()=>{closeModal();state.jump=0;scene.reset();refresh();});
    els.sound.addEventListener('click',toggleSound);els.settingsSound.addEventListener('click',toggleSound);els.settingsMotion.addEventListener('click',()=>{state.effects=!state.effects;refresh();});els.settingsReminders.addEventListener('click',()=>{state.playReminders=!state.playReminders;session.reminded=false;refresh();});els.goalGrid.addEventListener('click',e=>{const button=e.target.closest('[data-goal-claim]');if(button)claimGoal(button.dataset.goalClaim);});
    $('howToButton').addEventListener('click',()=>openModal(els.howToModal));$('resetButton').addEventListener('click',resetProgress);$('profileButton').addEventListener('click',()=>navigate('stats'));
    document.querySelectorAll('.nav-button').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.screen)));
    document.querySelectorAll('.segment').forEach(b=>b.addEventListener('click',()=>{collectionMode=b.dataset.collection;document.querySelectorAll('.segment').forEach(x=>x.classList.toggle('active',x===b));renderCollection();audio.tap();}));
    els.collectionGrid.addEventListener('click',e=>{const b=e.target.closest('[data-collection-action]');if(b)collectionAction(b.dataset.collectionAction);});
    els.spin.addEventListener('click',spinDaily);els.installButton.addEventListener('click',installGame);
    els.promoForm.addEventListener('submit',e=>{e.preventDefault();redeemPromo(els.promoInput.value);});
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
      document.querySelector('[data-bet-action="half"]').click();if(state.bet!==125)throw new Error('half bet failed');
      document.querySelector('[data-bet-action="double"]').click();if(state.bet!==250)throw new Error('double bet failed');
      els.customBetInput.value='333';if(!applyCustomBet()||state.bet!==333)throw new Error('custom bet failed');
      els.start.click();if(!state.roundActive||state.balance!==667)throw new Error('start button failed');
      forcedOutcome=true;els.jumpButton.click();await new Promise(r=>setTimeout(r,500));if(state.jump!==1||!state.roundActive)throw new Error('jump button failed');
      els.cash.click();await new Promise(r=>setTimeout(r,20));if(state.roundActive||state.balance<=667)throw new Error('cash out failed');closeModal();
      const before=state.balance;claimDaily({type:'froggy',amount:500});if(state.balance!==before+500||dailyAvailable())throw new Error('daily reward failed');closeModal();
      state.lastDaily='';state.xp=nextXp()-1;const beforeLevel=state.balance,expectedLevelBonus=levelBonusFor(state.level+1);addXp(1);if(state.balance!==beforeLevel+expectedLevelBonus)throw new Error('level bonus failed');
      state=deepClone(DEFAULT_STATE);refresh();const promoStart=state.balance;if(!redeemPromo('50000')||!redeemPromo('50000')||state.balance!==promoStart+100000)throw new Error('reusable 50000 promo failed');if(!redeemPromo('unlockall')||state.unlockedFrogs.length!==FROGS.length)throw new Error('unlockall promo failed');if(!redeemPromo('iwannaswim')||state.unlockedLakes.length!==LAKES.length)throw new Error('lake promo failed');if(!redeemPromo('10')||!redeemPromo('10')||state.freeSpins!==20)throw new Error('reusable 10 promo failed');const levelBeforeFive=state.level;if(!redeemPromo('5')||!redeemPromo('5')||state.level!==levelBeforeFive*25)throw new Error('reusable 5 promo failed');if(!redeemPromo('luckylily')||state.luckyCharges!==25)throw new Error('luckylily promo failed');const partyBalance=state.balance,partySpins=state.freeSpins;if(!redeemPromo('pondparty')||state.balance!==partyBalance+2500||state.freeSpins!==partySpins+3)throw new Error('pondparty promo failed');const safeBefore=state.safeRunCredits;if(!redeemPromo('lifeguard')||state.safeRunCredits!==safeBefore+3)throw new Error('lifeguard promo failed');if(!redeemPromo('spinall')||!state.unlimitedSpins||freeSpinDisplay()!=='unlimintos'||!dailyAvailable())throw new Error('spinall promo failed');if(!redeemPromo('imtheowner')||state.safeRunCredits!==safeBefore+4)throw new Error('owner promo failed');state.bet=100;startRound();forcedOutcome=false;jump();await new Promise(r=>setTimeout(r,500));if(state.jump!==1||!state.roundActive)throw new Error('owner safe round failed');state.roundActive=false;state.roundSafe=false;closeModal();
      if(MULTIPLIERS.length!==21||RISKS.length!==20||Math.abs(MULTIPLIERS[MULTIPLIERS.length-1]-112.07104101303273)>.000001)throw new Error('20-jump reward curve failed');let curveSurvival=1;for(let i=0;i<RISKS.length;i++){curveSurvival*=1-RISKS[i]/100;if(Math.abs(curveSurvival*MULTIPLIERS[i+1]-TARGET_RTP)>.000000001)throw new Error(`RTP mismatch at jump ${i+1}`);}if(WHEEL_SEGMENTS.length!==10||WHEEL_SEGMENTS.filter(x=>x.amount===50000).length!==1)throw new Error('wheel setup failed');if(FROGS[FROGS.length-1].id!=='owner'||FROGS[FROGS.length-1].cost!==1000000000||FROGS[FROGS.length-1].level!==20000)throw new Error('owner frog setup failed');
      state.level=3;state.balance=5000;collectionMode='frogs';collectionAction('king');if(state.selectedFrog!=='king'||!state.unlockedFrogs.includes('king'))throw new Error('collection failed');
      els.selfTest.hidden=false;els.selfTest.textContent='PASS: v12 gameplay, balanced curve, reusable promos, lake unlock, promo bundles, goals, bet tools, spins, characters, wheel, and unlocks';document.documentElement.dataset.selftest='pass';console.log(els.selfTest.textContent);
    }catch(error){els.selfTest.hidden=false;els.selfTest.textContent='FAIL: '+error.message;document.documentElement.dataset.selftest='fail';console.error(error);}
  }

  setInterval(()=>{if(!state.playReminders||session.reminded||state.roundActive)return;if(Date.now()-session.startedAt>=15*60*1000){session.reminded=true;setStatus('Pond check: you have been playing for 15 minutes. Take a break whenever you need one.');refreshEngagement();}},30000);
  renderWheel();bind();setupInstall();refresh();renderCollection();scene.reset();
  if(!state.tutorialSeen&&!TEST_MODE){state.tutorialSeen=true;saveState();setTimeout(()=>openModal(els.howToModal),600);}
  if(TEST_MODE)runSelfTest();

  window.FroggyGame={version:BUILD_VERSION,getState:()=>deepClone(state),selectBet,setBetAmount,adjustBet,applyCustomBet,startRound,jump,cashOut,forceSuccess:()=>forcedOutcome=true,forceFail:()=>forcedOutcome=false,spinDaily,redeemPromo,levelBonusFor,wheelSegments:deepClone(WHEEL_SEGMENTS),reset:()=>{state=deepClone(DEFAULT_STATE);scene.reset();renderWheel();refresh();}};
})();
