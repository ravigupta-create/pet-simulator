// ============================================================
// PAW PALACE - Pet Simulator  |  game.js
// 30 features, 100% free, pure JS + Canvas + Web Audio
// ============================================================

(function () {
"use strict";

// ── AUDIO ENGINE (Web Audio API) ─────────────────────────────
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let actx = null;
function ensureAudio() { if (!actx) actx = new AudioCtx(); if (actx.state === 'suspended') actx.resume(); }

function playTone(freq, dur, type = 'triangle', vol = 0.15) {
    ensureAudio();
    const g = actx.createGain(), o = actx.createOscillator();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol * sfxVol(), actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + dur);
    o.connect(g); g.connect(actx.destination);
    o.start(); o.stop(actx.currentTime + dur);
}

function playNoise(dur, vol = 0.08) {
    ensureAudio();
    const buf = actx.createBuffer(1, actx.sampleRate * dur, actx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = actx.createBufferSource(), g = actx.createGain();
    src.buffer = buf;
    g.gain.setValueAtTime(vol * sfxVol(), actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + dur);
    src.connect(g); g.connect(actx.destination);
    src.start(); src.stop(actx.currentTime + dur);
}

const SFX = {
    bark() { playTone(300, 0.1, 'square', 0.2); setTimeout(() => playTone(350, 0.15, 'square', 0.18), 120); },
    whine() { ensureAudio(); const o = actx.createOscillator(), g = actx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(600, actx.currentTime); o.frequency.linearRampToValueAtTime(350, actx.currentTime + 0.5); g.gain.setValueAtTime(0.12 * sfxVol(), actx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.5); o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + 0.5); },
    pant() { for (let i = 0; i < 4; i++) setTimeout(() => playNoise(0.08, 0.1), i * 120); },
    happy() { playTone(400, 0.1, 'triangle'); setTimeout(() => playTone(500, 0.1, 'triangle'), 100); setTimeout(() => playTone(600, 0.15, 'triangle'), 200); },
    eat() { for (let i = 0; i < 3; i++) setTimeout(() => playNoise(0.06, 0.12), i * 150); },
    drink() { for (let i = 0; i < 5; i++) setTimeout(() => playNoise(0.04, 0.06), i * 80); },
    sleep() { ensureAudio(); const o = actx.createOscillator(), g = actx.createGain(); o.type = 'sine'; o.frequency.value = 120; g.gain.setValueAtTime(0, actx.currentTime); g.gain.linearRampToValueAtTime(0.06 * sfxVol(), actx.currentTime + 0.3); g.gain.linearRampToValueAtTime(0, actx.currentTime + 0.8); o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + 0.8); },
    coin() { playTone(800, 0.08, 'square', 0.1); setTimeout(() => playTone(1200, 0.12, 'square', 0.1), 80); },
    buy() { playTone(500, 0.06, 'triangle'); setTimeout(() => playTone(700, 0.06, 'triangle'), 60); setTimeout(() => playTone(900, 0.1, 'triangle'), 120); },
    achievement() { [523,659,784,1047].forEach((f,i) => setTimeout(() => playTone(f, 0.15, 'triangle', 0.12), i*120)); },
    splash() { playNoise(0.3, 0.15); playTone(200, 0.2, 'sine', 0.08); },
    trick() { playTone(600, 0.08, 'square', 0.1); setTimeout(() => playTone(800, 0.12, 'square', 0.1), 100); },
    walk() { for (let i = 0; i < 4; i++) setTimeout(() => playNoise(0.05, 0.04), i * 200); },
    fetch() { playTone(400, 0.05, 'sawtooth', 0.1); setTimeout(() => playTone(600, 0.1, 'triangle', 0.1), 200); },
    error() { playTone(200, 0.2, 'square', 0.15); },
    click() { playTone(1000, 0.03, 'sine', 0.08); },
    heal() { playTone(440, 0.1, 'sine'); setTimeout(() => playTone(550, 0.1, 'sine'), 100); setTimeout(() => playTone(660, 0.15, 'sine'), 200); },
    levelUp() { [523,659,784,1047,1318].forEach((f,i) => setTimeout(() => playTone(f, 0.2, 'triangle', 0.15), i*100)); },
    snore() { ensureAudio(); const o = actx.createOscillator(), g = actx.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(80, actx.currentTime); o.frequency.linearRampToValueAtTime(60, actx.currentTime + 0.6); g.gain.setValueAtTime(0.04*sfxVol(),actx.currentTime); g.gain.linearRampToValueAtTime(0,actx.currentTime+0.6); o.connect(g);g.connect(actx.destination); o.start(); o.stop(actx.currentTime+0.6);},
    photo() { playNoise(0.05, 0.2); playTone(1500, 0.05, 'sine', 0.1); },
    growl() { ensureAudio(); const o=actx.createOscillator(),g=actx.createGain();o.type='sawtooth';o.frequency.value=80;g.gain.setValueAtTime(0.1*sfxVol(),actx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,actx.currentTime+0.4);o.connect(g);g.connect(actx.destination);o.start();o.stop(actx.currentTime+0.4);},
    yip() { playTone(500, 0.05, 'square', 0.15); setTimeout(() => playTone(700, 0.08, 'square', 0.12), 60); },
};

function sfxVol() { return (parseInt(document.getElementById('sfx-vol')?.value || 70)) / 100; }
function musicVol() { return (parseInt(document.getElementById('music-vol')?.value || 30)) / 100; }

// ── MUSIC ENGINE (procedural lo-fi) ─────────────────────────
let musicPlaying = false, musicNodes = [];
function toggleMusic() {
    ensureAudio();
    if (musicPlaying) { stopMusic(); return; }
    musicPlaying = true;
    document.getElementById('music-toggle').classList.add('playing');
    playMusicLoop();
}
function stopMusic() {
    musicPlaying = false;
    document.getElementById('music-toggle').classList.remove('playing');
    musicNodes.forEach(n => { try { n.stop(); } catch(e){} });
    musicNodes = [];
}
function playMusicLoop() {
    if (!musicPlaying) return;
    const notes = [261,293,329,349,392,440,493,523];
    const scale = [0,2,4,5,7,4,2,0,3,5,7,5,3,0,2,4];
    let t = actx.currentTime;
    scale.forEach((n, i) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = 'sine'; o.frequency.value = notes[n];
        const v = musicVol() * 0.06;
        g.gain.setValueAtTime(v, t + i*0.4);
        g.gain.exponentialRampToValueAtTime(0.001, t + i*0.4 + 0.35);
        o.connect(g); g.connect(actx.destination);
        o.start(t + i*0.4); o.stop(t + i*0.4 + 0.38);
        musicNodes.push(o);
    });
    setTimeout(playMusicLoop, scale.length * 400);
}

// ── BREED DATA ───────────────────────────────────────────────
const BREEDS = [
    { id:'golden', name:'Golden Retriever', bodyColor:'#DAA520', earColor:'#C8911A', spotColor:null, earType:'floppy', size:1, tailType:'fluffy' },
    { id:'husky', name:'Husky', bodyColor:'#9CA3AF', earColor:'#6B7280', spotColor:'#F9FAFB', earType:'pointed', size:1, tailType:'curled' },
    { id:'corgi', name:'Corgi', bodyColor:'#F59E0B', earColor:'#D97706', spotColor:'#FEF3C7', earType:'big', size:0.85, tailType:'stub' },
    { id:'poodle', name:'Poodle', bodyColor:'#FDE8D8', earColor:'#FBBF80', spotColor:null, earType:'floppy', size:0.95, tailType:'pom' },
    { id:'dalmatian', name:'Dalmatian', bodyColor:'#F9FAFB', earColor:'#374151', spotColor:'#1F2937', earType:'floppy', size:1.05, tailType:'thin' },
    { id:'shepherd', name:'German Shepherd', bodyColor:'#92400E', earColor:'#78350F', spotColor:'#1F2937', earType:'pointed', size:1.1, tailType:'fluffy' },
    { id:'beagle', name:'Beagle', bodyColor:'#F5DEB3', earColor:'#8B4513', spotColor:'#D2691E', earType:'floppy', size:0.9, tailType:'thin' },
    { id:'bulldog', name:'Bulldog', bodyColor:'#D4A574', earColor:'#B8956A', spotColor:'#FEF3C7', earType:'small', size:0.9, tailType:'stub' },
];

// ── ACCESSORIES ──────────────────────────────────────────────
const ACCESSORIES = [
    { id:'sunglasses', name:'Sunglasses', price:50, slot:'eyes', desc:'Cool shades', color:'#1F2937' },
    { id:'tophat', name:'Top Hat', price:80, slot:'head', desc:'Fancy hat', color:'#1F2937' },
    { id:'crown', name:'Crown', price:200, slot:'head', desc:'Royal crown', color:'#F59E0B' },
    { id:'bandana', name:'Bandana', price:30, slot:'neck', desc:'Red bandana', color:'#EF4444' },
    { id:'bowtie', name:'Bow Tie', price:40, slot:'neck', desc:'Classy bow tie', color:'#6366F1' },
    { id:'collar_gold', name:'Gold Collar', price:120, slot:'neck', desc:'Shiny gold collar', color:'#F59E0B' },
    { id:'cape', name:'Super Cape', price:100, slot:'back', desc:'Hero cape', color:'#EF4444' },
    { id:'sweater', name:'Sweater', price:60, slot:'body', desc:'Cozy sweater', color:'#3B82F6' },
    { id:'shoes_red', name:'Red Shoes', price:70, slot:'feet', desc:'Tiny red kicks', color:'#EF4444' },
    { id:'shoes_blue', name:'Blue Sneakers', price:70, slot:'feet', desc:'Sporty sneakers', color:'#3B82F6' },
    { id:'boots', name:'Rain Boots', price:90, slot:'feet', desc:'Yellow rain boots', color:'#F59E0B' },
    { id:'party_hat', name:'Party Hat', price:45, slot:'head', desc:'Party time!', color:'#EC4899' },
    { id:'aviators', name:'Aviator Goggles', price:65, slot:'eyes', desc:'Pilot goggles', color:'#92400E' },
    { id:'scarf', name:'Winter Scarf', price:55, slot:'neck', desc:'Warm & cozy', color:'#22C55E' },
    { id:'tutu', name:'Tutu', price:75, slot:'body', desc:'Ballet tutu', color:'#EC4899' },
    { id:'wizard_hat', name:'Wizard Hat', price:150, slot:'head', desc:'Magical!', color:'#6D28D9' },
    { id:'angel_wings', name:'Angel Wings', price:180, slot:'back', desc:'Heavenly wings', color:'#FBBF24' },
    { id:'devil_horns', name:'Devil Horns', price:80, slot:'head', desc:'Mischievous!', color:'#DC2626' },
    { id:'socks', name:'Striped Socks', price:35, slot:'feet', desc:'Colorful socks', color:'#F97316' },
    { id:'monocle', name:'Monocle', price:95, slot:'eyes', desc:'Distinguished', color:'#D4AF37' },
];

// ── FOOD ─────────────────────────────────────────────────────
const FOODS = [
    { id:'kibble', name:'Kibble', icon:'🥣', hunger:15, happiness:2, cost:0 },
    { id:'bone', name:'Bone', icon:'🦴', hunger:20, happiness:8, cost:0 },
    { id:'steak', name:'Steak', icon:'🥩', hunger:35, happiness:15, cost:15 },
    { id:'treat', name:'Dog Treat', icon:'🦮', hunger:5, happiness:20, cost:10 },
    { id:'fish', name:'Salmon', icon:'🐟', hunger:30, happiness:10, cost:20, health:5 },
    { id:'cake', name:'Pupcake', icon:'🧁', hunger:10, happiness:25, cost:25 },
    { id:'water', name:'Fresh Water', icon:'💧', hunger:5, happiness:5, cost:0, hygiene:5 },
    { id:'icecream', name:'Dog Ice Cream', icon:'🍦', hunger:8, happiness:30, cost:30 },
];

// ── TOYS ─────────────────────────────────────────────────────
const TOYS = [
    { id:'ball', name:'Tennis Ball', price:20, desc:'Classic fetch toy', happiness:10, icon:'🎾' },
    { id:'rope', name:'Rope Toy', price:25, desc:'Great for tug', happiness:12, icon:'🪢' },
    { id:'squeaky', name:'Squeaky Duck', price:30, desc:'Squeaky!', happiness:15, icon:'🦆' },
    { id:'frisbee', name:'Frisbee', price:35, desc:'Flying disc', happiness:14, icon:'🥏' },
    { id:'plushie', name:'Plush Bear', price:40, desc:'Cuddly friend', happiness:18, icon:'🧸' },
    { id:'puzzle', name:'Puzzle Feeder', price:50, desc:'Brain games', happiness:20, icon:'🧩' },
];

// ── ROOMS ────────────────────────────────────────────────────
const ROOMS = [
    { id:'default', name:'Living Room', price:0, bg1:'#87CEEB', bg2:'#90EE90', floor:'#8B7355' },
    { id:'beach', name:'Beach', price:100, bg1:'#00BFFF', bg2:'#FFD700', floor:'#F4A460' },
    { id:'forest', name:'Forest', price:120, bg1:'#228B22', bg2:'#006400', floor:'#654321' },
    { id:'space', name:'Space Station', price:200, bg1:'#0B0B3B', bg2:'#1B1B4B', floor:'#333' },
    { id:'castle', name:'Castle', price:250, bg1:'#DDD', bg2:'#AAA', floor:'#888' },
    { id:'snow', name:'Snowy Cabin', price:150, bg1:'#B0E0E6', bg2:'#FFF', floor:'#8B6914' },
];

// ── WALK LOCATIONS ───────────────────────────────────────────
const WALK_LOCS = [
    { id:'park', name:'Dog Park', icon:'🌳', cost:0, energyCost:15, finds:['stick','leaf','coin'], happiness:15 },
    { id:'beach_w', name:'Beach', icon:'🏖️', cost:10, energyCost:20, finds:['shell','crab','coin','pearl'], happiness:20 },
    { id:'mountain', name:'Mountain Trail', icon:'⛰️', cost:15, energyCost:25, finds:['rock','feather','coin','gem'], happiness:25 },
    { id:'city', name:'City Walk', icon:'🏙️', cost:5, energyCost:10, finds:['newspaper','coin','hotdog'], happiness:10 },
    { id:'forest_w', name:'Forest Path', icon:'🌲', cost:10, energyCost:20, finds:['mushroom','butterfly','coin','acorn'], happiness:18 },
    { id:'lake', name:'Lake', icon:'🏞️', cost:15, energyCost:20, finds:['fish','frog','coin','driftwood'], happiness:22 },
];

// ── TRICKS ───────────────────────────────────────────────────
const TRICKS = [
    { id:'sit', name:'Sit', xp:5, coins:3, unlockLevel:1 },
    { id:'shake', name:'Shake Paw', xp:8, coins:5, unlockLevel:2 },
    { id:'rollover', name:'Roll Over', xp:12, coins:8, unlockLevel:3 },
    { id:'speak', name:'Speak', xp:10, coins:6, unlockLevel:4 },
    { id:'playdead', name:'Play Dead', xp:15, coins:10, unlockLevel:5 },
    { id:'spin', name:'Spin', xp:12, coins:8, unlockLevel:6 },
    { id:'highfive', name:'High Five', xp:18, coins:12, unlockLevel:7 },
    { id:'dance', name:'Dance', xp:25, coins:18, unlockLevel:8 },
    { id:'backflip', name:'Backflip', xp:35, coins:25, unlockLevel:10 },
];

// ── ACHIEVEMENTS ─────────────────────────────────────────────
const ACHIEVEMENTS = [
    { id:'first_pet', name:'First Touch', desc:'Pet your dog for the first time', icon:'🤍', check: s => s.totalPets >= 1 },
    { id:'pet100', name:'Pet Lover', desc:'Pet your dog 100 times', icon:'💜', check: s => s.totalPets >= 100 },
    { id:'fed50', name:'Good Provider', desc:'Feed your dog 50 times', icon:'🍖', check: s => s.totalFeedings >= 50 },
    { id:'walk20', name:'Explorer', desc:'Go on 20 walks', icon:'🗺️', check: s => s.totalWalks >= 20 },
    { id:'coins500', name:'Coin Collector', desc:'Earn 500 coins total', icon:'💰', check: s => s.totalCoinsEarned >= 500 },
    { id:'coins2000', name:'Rich Pup', desc:'Earn 2000 coins total', icon:'💎', check: s => s.totalCoinsEarned >= 2000 },
    { id:'level5', name:'Growing Up', desc:'Reach level 5', icon:'📈', check: s => s.level >= 5 },
    { id:'level10', name:'Top Dog', desc:'Reach level 10', icon:'🏆', check: s => s.level >= 10 },
    { id:'level20', name:'Legendary', desc:'Reach level 20', icon:'👑', check: s => s.level >= 20 },
    { id:'tricks3', name:'Smart Pup', desc:'Learn 3 tricks', icon:'🎓', check: s => s.tricksLearned >= 3 },
    { id:'tricks_all', name:'Trick Master', desc:'Learn all tricks', icon:'🌟', check: s => s.tricksLearned >= TRICKS.length },
    { id:'accessories5', name:'Fashionista', desc:'Own 5 accessories', icon:'👗', check: s => s.accessoriesOwned >= 5 },
    { id:'accessories_all', name:'Full Wardrobe', desc:'Own all accessories', icon:'🎭', check: s => s.accessoriesOwned >= ACCESSORIES.length },
    { id:'all_rooms', name:'Interior Designer', desc:'Own all rooms', icon:'🏠', check: s => s.roomsOwned >= ROOMS.length },
    { id:'photo10', name:'Photographer', desc:'Take 10 photos', icon:'📸', check: s => s.photosTaken >= 10 },
    { id:'minigame_win', name:'Game Winner', desc:'Win a mini-game', icon:'🎮', check: s => s.minigamesWon >= 1 },
    { id:'minigame10', name:'Pro Gamer', desc:'Win 10 mini-games', icon:'🕹️', check: s => s.minigamesWon >= 10 },
    { id:'daily7', name:'Dedicated Owner', desc:'Log in 7 days in a row', icon:'📅', check: s => s.loginStreak >= 7 },
    { id:'play_time', name:'Best Friends', desc:'Play for 1 hour total', icon:'⏰', check: s => s.totalPlaytimeMin >= 60 },
    { id:'happiness_max', name:'Pure Joy', desc:'Max out happiness', icon:'😊', check: s => s.maxedHappiness },
    { id:'all_walks', name:'World Traveler', desc:'Visit all walk locations', icon:'🌍', check: s => s.locationsVisited >= WALK_LOCS.length },
    { id:'all_foods', name:'Foodie', desc:'Try all foods', icon:'🍽️', check: s => s.foodsTried >= FOODS.length },
    { id:'groom20', name:'Clean Pup', desc:'Groom 20 times', icon:'🛁', check: s => s.totalGrooms >= 20 },
    { id:'vet10', name:'Healthy Boy', desc:'Visit vet 10 times', icon:'🩺', check: s => s.vetVisits >= 10 },
    { id:'toys_all', name:'Toy Collector', desc:'Own all toys', icon:'🧸', check: s => s.toysOwned >= TOYS.length },
];

// ── GAME STATE ───────────────────────────────────────────────
let state = defaultState();

function defaultState() {
    return {
        dogName: 'Buddy',
        breedId: 'golden',
        hunger: 80, happiness: 80, energy: 80, hygiene: 80, health: 100,
        coins: 50, xp: 0, level: 1,
        ownedAccessories: [], equippedAccessories: [],
        ownedToys: ['ball'], ownedFoods: ['kibble','bone','water'],
        ownedRooms: ['default'], currentRoom: 'default',
        tricksLearned: [],
        // Stats
        totalPets: 0, totalFeedings: 0, totalWalks: 0, totalGrooms: 0,
        totalCoinsEarned: 0, totalXpEarned: 0, vetVisits: 0,
        photosTaken: 0, minigamesWon: 0, minigamesPlayed: 0,
        loginStreak: 0, lastLoginDate: null,
        totalPlaytimeMin: 0, maxedHappiness: false,
        locationsVisited: [], foodsTried: [],
        achievementsUnlocked: [],
        createdAt: Date.now(), sessionStart: Date.now(),
        // Animation
        mood: 'happy', isSleeping: false, walkingAt: null,
        tailWag: 0, blinkTimer: 0, breathe: 0, actionAnim: null, actionAnimTimer: 0,
        // Weather & time
        weather: 'sunny', dayPhase: 'day',
    };
}

// ── DOM REFS ─────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const canvas = $('dog-canvas');
const ctx = canvas.getContext('2d');

// ── BREED SELECTION ──────────────────────────────────────────
function initBreedSelect() {
    const grid = $('breed-grid');
    BREEDS.forEach((b, i) => {
        const card = document.createElement('div');
        card.className = 'breed-card' + (i === 0 ? ' selected' : '');
        card.dataset.breed = b.id;
        const c = document.createElement('canvas');
        c.width = 60; c.height = 50;
        drawDogMini(c.getContext('2d'), b, 30, 30, 0.35);
        card.appendChild(c);
        card.innerHTML += `<div>${b.name}</div>`;
        card.addEventListener('click', () => {
            grid.querySelectorAll('.breed-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            state.breedId = b.id;
        });
        grid.appendChild(card);
    });
}

// ── START GAME ───────────────────────────────────────────────
function startGame() {
    const name = $('dog-name').value.trim() || 'Buddy';
    state.dogName = name;
    $('intro-screen').classList.add('hidden');
    $('game-screen').classList.remove('hidden');
    updateUI();
    checkDailyReward();
    requestAnimationFrame(gameLoop);
    setInterval(tickStats, 5000); // stat decay
    setInterval(() => { state.totalPlaytimeMin += 1; autoSave(); }, 60000);
    log(`${state.dogName} is so happy to meet you! 🐾`);
}

// ── MAIN RENDER LOOP ─────────────────────────────────────────
let lastTime = 0;
function gameLoop(t) {
    const dt = (t - lastTime) / 1000;
    lastTime = t;
    // Animation updates
    state.tailWag += dt * 5;
    state.breathe += dt * 2;
    state.blinkTimer += dt;
    if (state.blinkTimer > 3 + Math.random() * 2) state.blinkTimer = -0.15;
    if (state.actionAnimTimer > 0) state.actionAnimTimer -= dt;
    else state.actionAnim = null;

    renderDog();
    requestAnimationFrame(gameLoop);
}

// ── DOG RENDERER ─────────────────────────────────────────────
function getBreed() { return BREEDS.find(b => b.id === state.breedId) || BREEDS[0]; }
function getRoom() { return ROOMS.find(r => r.id === state.currentRoom) || ROOMS[0]; }

function renderDog() {
    const W = canvas.width, H = canvas.height;
    const breed = getBreed();
    const room = getRoom();
    const s = breed.size;
    const cx = W / 2, cy = H / 2 + 20;

    ctx.clearRect(0, 0, W, H);

    // Background (room + weather + day/night)
    drawBackground(W, H, room);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 80 * s, 70 * s, 12 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    const breathOff = Math.sin(state.breathe) * 2;
    const sleeping = state.isSleeping;

    ctx.save();
    ctx.translate(cx, cy + breathOff);

    // Cape (back accessory) - draw before body
    if (state.equippedAccessories.includes('cape') || state.equippedAccessories.includes('angel_wings')) {
        drawBackAccessory(s);
    }

    // Body
    drawBody(breed, s, sleeping);

    // Accessories on body
    drawBodyAccessories(s);

    // Legs & feet
    drawLegs(breed, s, sleeping);

    // Feet accessories
    drawFeetAccessories(s);

    // Head
    drawHead(breed, s, sleeping);

    // Ears
    drawEars(breed, s);

    // Face
    drawFace(breed, s, sleeping);

    // Head accessories
    drawHeadAccessories(s);

    // Eye accessories
    drawEyeAccessories(s);

    // Neck accessories
    drawNeckAccessories(breed, s);

    // Tail
    drawTail(breed, s);

    // Action animation overlay
    if (state.actionAnim) drawActionAnim(s);

    // Sleeping Z's
    if (sleeping) drawZzz(s);

    // Mood indicator
    drawMoodBubble(s);

    ctx.restore();
}

function drawBackground(W, H, room) {
    // Sky
    const grd = ctx.createLinearGradient(0, 0, 0, H * 0.65);
    let sky1 = room.bg1, sky2 = room.bg2;
    if (state.dayPhase === 'night') { sky1 = '#0a0a2e'; sky2 = '#1a1a4e'; }
    else if (state.dayPhase === 'sunset') { sky1 = '#ff7e5f'; sky2 = '#feb47b'; }
    grd.addColorStop(0, sky1); grd.addColorStop(1, sky2);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H * 0.65);

    // Weather
    if (state.weather === 'rain') {
        for (let i = 0; i < 30; i++) {
            const rx = Math.random() * W, ry = Math.random() * H * 0.6;
            ctx.strokeStyle = 'rgba(100,150,255,0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 2, ry + 10); ctx.stroke();
        }
    } else if (state.weather === 'snow') {
        for (let i = 0; i < 20; i++) {
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.beginPath();
            ctx.arc(Math.random() * W, Math.random() * H * 0.6, 2 + Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }
    } else if (state.weather === 'sunny' && state.dayPhase === 'day') {
        // Sun
        ctx.fillStyle = '#FFD700';
        ctx.beginPath(); ctx.arc(W - 60, 50, 25, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,215,0,0.2)';
        ctx.beginPath(); ctx.arc(W - 60, 50, 40, 0, Math.PI * 2); ctx.fill();
    }
    if (state.dayPhase === 'night') {
        // Stars
        for (let i = 0; i < 15; i++) {
            ctx.fillStyle = `rgba(255,255,255,${0.4+Math.random()*0.6})`;
            ctx.beginPath(); ctx.arc(30+Math.random()*(W-60), 10+Math.random()*100, 1, 0, Math.PI*2); ctx.fill();
        }
    }

    // Clouds (if not space)
    if (room.id !== 'space' && state.weather !== 'rain') {
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        [[80,40],[250,55],[400,30]].forEach(([x,y]) => {
            ctx.beginPath();
            ctx.ellipse(x,y,35,15,0,0,Math.PI*2); ctx.fill();
            ctx.beginPath();
            ctx.ellipse(x+20,y-8,20,12,0,0,Math.PI*2); ctx.fill();
        });
    }

    // Floor
    ctx.fillStyle = room.floor;
    ctx.fillRect(0, H * 0.65, W, H * 0.35);

    // Floor detail
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    for (let i = 0; i < W; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, H * 0.65); ctx.lineTo(i, H); ctx.stroke();
    }
}

function drawBody(breed, s, sleeping) {
    ctx.fillStyle = breed.bodyColor;
    if (sleeping) {
        // Lying down body
        ctx.beginPath();
        ctx.ellipse(0, 30 * s, 80 * s, 35 * s, 0, 0, Math.PI * 2);
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.ellipse(0, 20 * s, 55 * s, 45 * s, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    // Belly highlight
    if (breed.spotColor && breed.id !== 'dalmatian') {
        ctx.fillStyle = breed.spotColor;
        ctx.beginPath();
        ctx.ellipse(0, 35 * s, 35 * s, 20 * s, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    // Dalmatian spots
    if (breed.id === 'dalmatian') {
        ctx.fillStyle = breed.spotColor;
        [[-20,-5,6],[-5,15,5],[25,0,7],[10,-20,4],[-30,10,5],[15,25,4],[-10,30,3],[30,20,5]].forEach(([x,y,r]) => {
            ctx.beginPath(); ctx.arc(x*s, y*s, r*s, 0, Math.PI*2); ctx.fill();
        });
    }
}

function drawLegs(breed, s, sleeping) {
    ctx.fillStyle = breed.bodyColor;
    if (sleeping) {
        // Tucked legs
        [[-40,45],[-20,50],[20,50],[40,45]].forEach(([x,y]) => {
            ctx.beginPath();
            ctx.ellipse(x*s, y*s, 10*s, 8*s, 0, 0, Math.PI*2);
            ctx.fill();
        });
    } else {
        // Standing legs
        const legW = 12*s, legH = 30*s;
        [[-28,50],[-10,52],[10,52],[28,50]].forEach(([x,y],i) => {
            // Walk animation
            let off = 0;
            if (state.actionAnim === 'walk') off = Math.sin(state.tailWag * 3 + i * Math.PI/2) * 5;
            ctx.fillStyle = breed.bodyColor;
            ctx.beginPath();
            ctx.roundRect((x-legW/2)*s, (y+off)*s, legW, legH, [0,0,4*s,4*s]);
            ctx.fill();
            // Paw
            ctx.fillStyle = darken(breed.bodyColor, 0.15);
            ctx.beginPath();
            ctx.ellipse(x*s, (y+legH/s+off)*s, 8*s, 5*s, 0, 0, Math.PI*2);
            ctx.fill();
        });
    }
}

function drawHead(breed, s, sleeping) {
    const headY = sleeping ? -10*s : -50*s;
    const headX = sleeping ? 50*s : 0;
    ctx.fillStyle = breed.bodyColor;
    ctx.beginPath();
    ctx.ellipse(headX, headY, 35*s, 32*s, 0, 0, Math.PI*2);
    ctx.fill();
    // Snout
    ctx.fillStyle = breed.spotColor || lighten(breed.bodyColor, 0.2);
    ctx.beginPath();
    ctx.ellipse(headX, headY + 12*s, 18*s, 14*s, 0, 0, Math.PI*2);
    ctx.fill();
}

function drawEars(breed, s) {
    const sleeping = state.isSleeping;
    const headY = sleeping ? -10*s : -50*s;
    const headX = sleeping ? 50*s : 0;
    ctx.fillStyle = breed.earColor;

    if (breed.earType === 'floppy') {
        [[-25,-8],[25,-8]].forEach(([ox,oy]) => {
            ctx.beginPath();
            ctx.ellipse(headX+ox*s, headY+oy*s, 12*s, 22*s, ox<0?-0.3:0.3, 0, Math.PI*2);
            ctx.fill();
        });
    } else if (breed.earType === 'pointed') {
        [[-22,-20],[22,-20]].forEach(([ox,oy]) => {
            ctx.beginPath();
            ctx.moveTo(headX+(ox-10)*s, headY+oy*s+10*s);
            ctx.lineTo(headX+ox*s, headY+(oy-20)*s);
            ctx.lineTo(headX+(ox+10)*s, headY+oy*s+10*s);
            ctx.closePath();
            ctx.fill();
        });
    } else if (breed.earType === 'big') {
        [[-28,-5],[28,-5]].forEach(([ox,oy]) => {
            ctx.beginPath();
            ctx.ellipse(headX+ox*s, headY+oy*s, 16*s, 25*s, ox<0?-0.4:0.4, 0, Math.PI*2);
            ctx.fill();
        });
    } else if (breed.earType === 'small') {
        [[-22,-18],[22,-18]].forEach(([ox,oy]) => {
            ctx.beginPath();
            ctx.ellipse(headX+ox*s, headY+oy*s, 10*s, 12*s, ox<0?-0.2:0.2, 0, Math.PI*2);
            ctx.fill();
        });
    }
}

function drawFace(breed, s, sleeping) {
    const headY = sleeping ? -10*s : -50*s;
    const headX = sleeping ? 50*s : 0;
    const blinking = state.blinkTimer < 0;

    // Eyes
    if (sleeping || blinking) {
        // Closed eyes
        ctx.strokeStyle = '#1F2937';
        ctx.lineWidth = 2*s;
        ctx.lineCap = 'round';
        [[-12,-5],[12,-5]].forEach(([ox,oy]) => {
            ctx.beginPath();
            ctx.arc(headX+ox*s, headY+oy*s, 5*s, 0, Math.PI);
            ctx.stroke();
        });
    } else {
        // Open eyes
        [[-12,-5],[12,-5]].forEach(([ox,oy]) => {
            ctx.fillStyle = '#FFF';
            ctx.beginPath(); ctx.arc(headX+ox*s, headY+oy*s, 7*s, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#1F2937';
            ctx.beginPath(); ctx.arc(headX+ox*s+1*s, headY+oy*s+1*s, 4*s, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#FFF';
            ctx.beginPath(); ctx.arc(headX+ox*s+3*s, headY+oy*s-1*s, 1.5*s, 0, Math.PI*2); ctx.fill();
        });
    }

    // Nose
    ctx.fillStyle = '#1F2937';
    ctx.beginPath();
    ctx.ellipse(headX, headY+15*s, 6*s, 4*s, 0, 0, Math.PI*2);
    ctx.fill();

    // Mouth
    ctx.strokeStyle = '#1F2937';
    ctx.lineWidth = 1.5*s;
    ctx.lineCap = 'round';
    const moodMouth = state.happiness > 60 ? 1 : state.happiness > 30 ? 0 : -1;
    ctx.beginPath();
    ctx.moveTo(headX-8*s, headY+20*s);
    ctx.quadraticCurveTo(headX, headY+(20+5*moodMouth)*s, headX+8*s, headY+20*s);
    ctx.stroke();

    // Tongue (if happy and not sleeping)
    if (!sleeping && state.happiness > 50 && state.mood === 'happy') {
        ctx.fillStyle = '#FF6B8A';
        ctx.beginPath();
        ctx.ellipse(headX+3*s, headY+25*s, 5*s, 7*s, 0.1, 0, Math.PI*2);
        ctx.fill();
    }

    // Blush (if very happy)
    if (state.happiness > 80) {
        ctx.fillStyle = 'rgba(255,100,150,0.2)';
        [[-18,8],[18,8]].forEach(([ox,oy]) => {
            ctx.beginPath();
            ctx.ellipse(headX+ox*s, headY+oy*s, 6*s, 4*s, 0, 0, Math.PI*2);
            ctx.fill();
        });
    }
}

function drawTail(breed, s) {
    if (state.isSleeping) return;
    const wagAngle = Math.sin(state.tailWag) * 0.4 * (state.happiness/100);
    ctx.save();
    ctx.translate(-45*s, -10*s);
    ctx.rotate(-0.8 + wagAngle);
    ctx.fillStyle = breed.bodyColor;

    if (breed.tailType === 'fluffy') {
        ctx.beginPath();
        ctx.ellipse(0, -20*s, 8*s, 25*s, 0, 0, Math.PI*2);
        ctx.fill();
    } else if (breed.tailType === 'curled') {
        ctx.lineWidth = 6*s;
        ctx.strokeStyle = breed.bodyColor;
        ctx.beginPath();
        ctx.arc(0, -15*s, 12*s, Math.PI*0.5, Math.PI*2);
        ctx.stroke();
    } else if (breed.tailType === 'thin') {
        ctx.lineWidth = 4*s;
        ctx.strokeStyle = breed.bodyColor;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(-5*s, -30*s);
        ctx.stroke();
    } else if (breed.tailType === 'stub') {
        ctx.beginPath();
        ctx.ellipse(0, -5*s, 6*s, 6*s, 0, 0, Math.PI*2);
        ctx.fill();
    } else if (breed.tailType === 'pom') {
        ctx.lineWidth = 3*s; ctx.strokeStyle = breed.bodyColor;
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-20*s); ctx.stroke();
        ctx.beginPath(); ctx.arc(0,-22*s,7*s,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
}

// ── ACCESSORY RENDERERS ──────────────────────────────────────
function drawHeadAccessories(s) {
    const sleeping = state.isSleeping;
    const headY = sleeping ? -10*s : -50*s;
    const headX = sleeping ? 50*s : 0;

    state.equippedAccessories.forEach(id => {
        const acc = ACCESSORIES.find(a => a.id === id);
        if (!acc || acc.slot !== 'head') return;

        if (id === 'tophat') {
            ctx.fillStyle = acc.color;
            ctx.fillRect(headX-18*s, headY-42*s, 36*s, 6*s);
            ctx.fillRect(headX-12*s, headY-70*s, 24*s, 30*s);
            ctx.fillStyle = darken(acc.color, 0.2);
            ctx.fillRect(headX-12*s, headY-45*s, 24*s, 5*s);
        } else if (id === 'crown') {
            ctx.fillStyle = acc.color;
            ctx.beginPath();
            ctx.moveTo(headX-18*s, headY-28*s);
            ctx.lineTo(headX-18*s, headY-48*s);
            ctx.lineTo(headX-10*s, headY-38*s);
            ctx.lineTo(headX, headY-52*s);
            ctx.lineTo(headX+10*s, headY-38*s);
            ctx.lineTo(headX+18*s, headY-48*s);
            ctx.lineTo(headX+18*s, headY-28*s);
            ctx.closePath(); ctx.fill();
            // Gems
            ctx.fillStyle = '#EF4444';
            ctx.beginPath(); ctx.arc(headX, headY-38*s, 3*s, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#3B82F6';
            [[-10,-35],[10,-35]].forEach(([ox,oy]) => {
                ctx.beginPath(); ctx.arc(headX+ox*s, headY+oy*s, 2*s, 0, Math.PI*2); ctx.fill();
            });
        } else if (id === 'party_hat') {
            ctx.fillStyle = acc.color;
            ctx.beginPath();
            ctx.moveTo(headX, headY-55*s);
            ctx.lineTo(headX-16*s, headY-25*s);
            ctx.lineTo(headX+16*s, headY-25*s);
            ctx.closePath(); ctx.fill();
            // Stripes
            ctx.strokeStyle = '#FDE047';
            ctx.lineWidth = 2*s;
            for (let i = 0; i < 3; i++) {
                const y = headY + (-45 + i*8)*s;
                const w = 4 + i*4;
                ctx.beginPath(); ctx.moveTo(headX-w*s, y); ctx.lineTo(headX+w*s, y); ctx.stroke();
            }
            // Pom
            ctx.fillStyle = '#FDE047';
            ctx.beginPath(); ctx.arc(headX, headY-56*s, 4*s, 0, Math.PI*2); ctx.fill();
        } else if (id === 'wizard_hat') {
            ctx.fillStyle = acc.color;
            ctx.beginPath();
            ctx.moveTo(headX+5*s, headY-65*s);
            ctx.lineTo(headX-20*s, headY-25*s);
            ctx.lineTo(headX+20*s, headY-25*s);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#F59E0B';
            ctx.beginPath();
            ctx.ellipse(headX, headY-25*s, 22*s, 5*s, 0, 0, Math.PI*2);
            ctx.fill();
            // Stars
            ctx.fillStyle = '#FDE047';
            ctx.font = `${8*s}px serif`;
            ctx.fillText('★', headX-5*s, headY-40*s);
            ctx.fillText('★', headX+5*s, headY-50*s);
        } else if (id === 'devil_horns') {
            ctx.fillStyle = acc.color;
            [[-15,-30],[15,-30]].forEach(([ox,oy]) => {
                ctx.beginPath();
                ctx.moveTo(headX+ox*s, headY+oy*s);
                ctx.lineTo(headX+(ox+5)*s, headY+(oy-18)*s);
                ctx.lineTo(headX+(ox-5)*s, headY+(oy-2)*s);
                ctx.closePath(); ctx.fill();
            });
        }
    });
}

function drawEyeAccessories(s) {
    const sleeping = state.isSleeping;
    const headY = sleeping ? -10*s : -50*s;
    const headX = sleeping ? 50*s : 0;

    state.equippedAccessories.forEach(id => {
        const acc = ACCESSORIES.find(a => a.id === id);
        if (!acc || acc.slot !== 'eyes') return;

        if (id === 'sunglasses') {
            ctx.fillStyle = 'rgba(30,30,30,0.85)';
            [[-12,-5],[12,-5]].forEach(([ox,oy]) => {
                ctx.beginPath();
                ctx.roundRect(headX+(ox-8)*s, headY+(oy-5)*s, 16*s, 10*s, 3*s);
                ctx.fill();
            });
            ctx.strokeStyle = acc.color;
            ctx.lineWidth = 2*s;
            ctx.beginPath();
            ctx.moveTo(headX-4*s, headY-5*s);
            ctx.lineTo(headX+4*s, headY-5*s);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(headX-20*s, headY-5*s);
            ctx.lineTo(headX-26*s, headY-8*s);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(headX+20*s, headY-5*s);
            ctx.lineTo(headX+26*s, headY-8*s);
            ctx.stroke();
        } else if (id === 'aviators') {
            ctx.strokeStyle = acc.color;
            ctx.lineWidth = 2*s;
            [[-12,-5],[12,-5]].forEach(([ox,oy]) => {
                ctx.beginPath();
                ctx.ellipse(headX+ox*s, headY+oy*s, 10*s, 8*s, 0, 0, Math.PI*2);
                ctx.stroke();
                ctx.fillStyle = 'rgba(150,100,50,0.4)';
                ctx.fill();
            });
            ctx.beginPath();
            ctx.moveTo(headX-2*s, headY-5*s); ctx.lineTo(headX+2*s, headY-5*s); ctx.stroke();
        } else if (id === 'monocle') {
            ctx.strokeStyle = acc.color;
            ctx.lineWidth = 2*s;
            ctx.beginPath();
            ctx.arc(headX+12*s, headY-5*s, 9*s, 0, Math.PI*2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.fill();
            // Chain
            ctx.beginPath();
            ctx.moveTo(headX+21*s, headY-2*s);
            ctx.quadraticCurveTo(headX+30*s, headY+20*s, headX+15*s, headY+30*s);
            ctx.stroke();
        }
    });
}

function drawNeckAccessories(breed, s) {
    const sleeping = state.isSleeping;
    const neckY = sleeping ? 5*s : -20*s;
    const neckX = sleeping ? 30*s : 0;

    state.equippedAccessories.forEach(id => {
        const acc = ACCESSORIES.find(a => a.id === id);
        if (!acc || acc.slot !== 'neck') return;

        if (id === 'bandana') {
            ctx.fillStyle = acc.color;
            ctx.beginPath();
            ctx.moveTo(neckX-25*s, neckY);
            ctx.lineTo(neckX+25*s, neckY);
            ctx.lineTo(neckX, neckY+20*s);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = darken(acc.color, 0.15);
            ctx.beginPath();
            ctx.moveTo(neckX-20*s, neckY+3*s);
            ctx.lineTo(neckX+20*s, neckY+3*s);
            ctx.lineTo(neckX, neckY+15*s);
            ctx.closePath(); ctx.fill();
        } else if (id === 'bowtie') {
            ctx.fillStyle = acc.color;
            // Left wing
            ctx.beginPath();
            ctx.moveTo(neckX, neckY+5*s);
            ctx.lineTo(neckX-15*s, neckY);
            ctx.lineTo(neckX-15*s, neckY+10*s);
            ctx.closePath(); ctx.fill();
            // Right wing
            ctx.beginPath();
            ctx.moveTo(neckX, neckY+5*s);
            ctx.lineTo(neckX+15*s, neckY);
            ctx.lineTo(neckX+15*s, neckY+10*s);
            ctx.closePath(); ctx.fill();
            // Center
            ctx.fillStyle = darken(acc.color, 0.2);
            ctx.beginPath(); ctx.arc(neckX, neckY+5*s, 3*s, 0, Math.PI*2); ctx.fill();
        } else if (id === 'collar_gold') {
            ctx.strokeStyle = acc.color;
            ctx.lineWidth = 4*s;
            ctx.beginPath();
            ctx.ellipse(neckX, neckY+3*s, 28*s, 8*s, 0, 0, Math.PI);
            ctx.stroke();
            // Tag
            ctx.fillStyle = acc.color;
            ctx.beginPath(); ctx.arc(neckX, neckY+12*s, 5*s, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#FFF';
            ctx.font = `${5*s}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('♥', neckX, neckY+14*s);
        } else if (id === 'scarf') {
            ctx.fillStyle = acc.color;
            ctx.beginPath();
            ctx.ellipse(neckX, neckY+3*s, 30*s, 10*s, 0, 0, Math.PI*2);
            ctx.fill();
            // Hanging part
            ctx.fillRect(neckX+15*s, neckY+3*s, 8*s, 25*s);
            ctx.fillStyle = lighten(acc.color, 0.2);
            // Stripes
            for (let i = 0; i < 3; i++) {
                ctx.fillRect(neckX+15*s, neckY+(8+i*8)*s, 8*s, 3*s);
            }
        }
    });
}

function drawBodyAccessories(s) {
    state.equippedAccessories.forEach(id => {
        const acc = ACCESSORIES.find(a => a.id === id);
        if (!acc || acc.slot !== 'body') return;

        if (id === 'sweater') {
            ctx.fillStyle = acc.color;
            ctx.beginPath();
            ctx.ellipse(0, 20*s, 56*s, 42*s, 0, 0, Math.PI*2);
            ctx.fill();
            // Pattern
            ctx.strokeStyle = lighten(acc.color, 0.3);
            ctx.lineWidth = 2*s;
            for (let i = -2; i <= 2; i++) {
                ctx.beginPath();
                ctx.moveTo(-50*s, (20+i*12)*s);
                ctx.lineTo(50*s, (20+i*12)*s);
                ctx.stroke();
            }
        } else if (id === 'tutu') {
            ctx.fillStyle = acc.color;
            for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * Math.PI * 2;
                ctx.beginPath();
                ctx.ellipse(
                    Math.cos(angle) * 35 * s,
                    40*s + Math.sin(angle) * 10 * s,
                    15*s, 8*s, angle, 0, Math.PI
                );
                ctx.fill();
            }
        }
    });
}

function drawFeetAccessories(s) {
    if (state.isSleeping) return;
    state.equippedAccessories.forEach(id => {
        const acc = ACCESSORIES.find(a => a.id === id);
        if (!acc || acc.slot !== 'feet') return;

        [[-28,80],[-10,82],[10,82],[28,80]].forEach(([x,y], i) => {
            let off = 0;
            if (state.actionAnim === 'walk') off = Math.sin(state.tailWag * 3 + i * Math.PI/2) * 5;

            if (id === 'shoes_red' || id === 'shoes_blue') {
                ctx.fillStyle = acc.color;
                ctx.beginPath();
                ctx.ellipse(x*s, (y+off)*s, 10*s, 6*s, 0, 0, Math.PI*2);
                ctx.fill();
                ctx.fillStyle = '#FFF';
                ctx.beginPath();
                ctx.ellipse((x+4)*s, (y+off)*s, 4*s, 3*s, 0, 0, Math.PI*2);
                ctx.fill();
            } else if (id === 'boots') {
                ctx.fillStyle = acc.color;
                ctx.beginPath();
                ctx.roundRect((x-7)*s, (y-10+off)*s, 14*s, 16*s, [0,0,3*s,3*s]);
                ctx.fill();
                ctx.fillStyle = darken(acc.color, 0.15);
                ctx.fillRect((x-7)*s, (y-2+off)*s, 14*s, 3*s);
            } else if (id === 'socks') {
                ctx.fillStyle = acc.color;
                ctx.beginPath();
                ctx.roundRect((x-6)*s, (y-15+off)*s, 12*s, 20*s, 3*s);
                ctx.fill();
                ctx.fillStyle = '#FFF';
                for (let j = 0; j < 3; j++) {
                    ctx.fillRect((x-6)*s, (y-13+j*6+off)*s, 12*s, 2*s);
                }
            }
        });
    });
}

function drawBackAccessory(s) {
    state.equippedAccessories.forEach(id => {
        if (id === 'cape') {
            const acc = ACCESSORIES.find(a => a.id === id);
            ctx.fillStyle = acc.color;
            ctx.beginPath();
            ctx.moveTo(-30*s, -15*s);
            ctx.quadraticCurveTo(-50*s, 30*s, -35*s, 70*s);
            ctx.lineTo(35*s, 70*s);
            ctx.quadraticCurveTo(50*s, 30*s, 30*s, -15*s);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = darken(acc.color, 0.2);
            ctx.beginPath();
            ctx.moveTo(-25*s, -10*s);
            ctx.quadraticCurveTo(-40*s, 25*s, -28*s, 55*s);
            ctx.lineTo(28*s, 55*s);
            ctx.quadraticCurveTo(40*s, 25*s, 25*s, -10*s);
            ctx.closePath(); ctx.fill();
        } else if (id === 'angel_wings') {
            const acc = ACCESSORIES.find(a => a.id === id);
            ctx.fillStyle = '#FFF';
            ctx.globalAlpha = 0.8;
            // Left wing
            ctx.beginPath();
            ctx.moveTo(-20*s, -10*s);
            ctx.quadraticCurveTo(-70*s, -40*s, -55*s, 10*s);
            ctx.quadraticCurveTo(-40*s, 30*s, -20*s, 10*s);
            ctx.closePath(); ctx.fill();
            // Right wing
            ctx.beginPath();
            ctx.moveTo(20*s, -10*s);
            ctx.quadraticCurveTo(70*s, -40*s, 55*s, 10*s);
            ctx.quadraticCurveTo(40*s, 30*s, 20*s, 10*s);
            ctx.closePath(); ctx.fill();
            ctx.globalAlpha = 1;
            // Feather detail
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.lineWidth = 1;
            [[-45,-15,-35,5],[45,-15,35,5],[-55,0,-30,15],[55,0,30,15]].forEach(([x1,y1,x2,y2]) => {
                ctx.beginPath(); ctx.moveTo(x1*s,y1*s); ctx.lineTo(x2*s,y2*s); ctx.stroke();
            });
        }
    });
}

function drawActionAnim(s) {
    if (state.actionAnim === 'heart') {
        const t = 1 - state.actionAnimTimer / 1.5;
        ctx.fillStyle = `rgba(255,100,150,${1-t})`;
        ctx.font = `${(20+t*15)*s}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText('❤️', 20*s, (-70 - t*30)*s);
    } else if (state.actionAnim === 'star') {
        const t = 1 - state.actionAnimTimer / 1;
        ctx.font = `${(15+t*10)*s}px serif`;
        ctx.textAlign = 'center';
        ctx.globalAlpha = 1-t;
        ctx.fillText('⭐', 25*s, (-60 - t*25)*s);
        ctx.globalAlpha = 1;
    } else if (state.actionAnim === 'note') {
        const t = 1 - state.actionAnimTimer / 1;
        ctx.font = `${(14+t*8)*s}px serif`;
        ctx.textAlign = 'center';
        ctx.globalAlpha = 1-t;
        ctx.fillText('🎵', 30*s, (-65 - t*20)*s);
        ctx.globalAlpha = 1;
    } else if (state.actionAnim === 'splash') {
        const t = 1 - state.actionAnimTimer / 1;
        ctx.fillStyle = `rgba(100,200,255,${0.5-t*0.5})`;
        for (let i = 0; i < 6; i++) {
            const angle = (i/6)*Math.PI*2 + t*2;
            const r = (20+t*30)*s;
            ctx.beginPath();
            ctx.arc(Math.cos(angle)*r, 20*s+Math.sin(angle)*r*0.5, 4*s, 0, Math.PI*2);
            ctx.fill();
        }
    }
}

function drawZzz(s) {
    const t = (Date.now() / 1000) % 3;
    ctx.font = `${12*s}px sans-serif`;
    ctx.fillStyle = 'rgba(100,100,200,0.6)';
    ctx.textAlign = 'center';
    for (let i = 0; i < 3; i++) {
        const off = ((t + i*0.8) % 3) / 3;
        ctx.globalAlpha = 1 - off;
        ctx.fillText('Z', (60 + i*12)*s, (-30 - off*40)*s);
    }
    ctx.globalAlpha = 1;
}

function drawMoodBubble(s) {
    if (state.isSleeping || state.actionAnim) return;
    // Small mood emoji near head
    const headY = -50*s;
    let emoji = '';
    if (state.happiness > 80) emoji = '';
    else if (state.happiness > 50) emoji = '';
    else if (state.happiness > 25) emoji = '';
    else emoji = '';
    // Don't show if there's no meaningful mood to display
}

// ── MINI DOG (for breed select & shop) ──────────────────────
function drawDogMini(ctx, breed, cx, cy, s) {
    ctx.fillStyle = breed.bodyColor;
    // Body
    ctx.beginPath(); ctx.ellipse(cx, cy+5*s*100, 20*s*100, 16*s*100, 0, 0, Math.PI*2); ctx.fill();
    // Head
    ctx.beginPath(); ctx.ellipse(cx, cy-12*s*100, 14*s*100, 13*s*100, 0, 0, Math.PI*2); ctx.fill();
    // Ears
    ctx.fillStyle = breed.earColor;
    if (breed.earType === 'pointed') {
        [[-10,-20],[10,-20]].forEach(([ox,oy]) => {
            ctx.beginPath();
            ctx.moveTo(cx+(ox-4)*s*100, cy+(oy+8)*s*100);
            ctx.lineTo(cx+ox*s*100, cy+(oy-8)*s*100);
            ctx.lineTo(cx+(ox+4)*s*100, cy+(oy+8)*s*100);
            ctx.closePath(); ctx.fill();
        });
    } else {
        [[-12,-8],[12,-8]].forEach(([ox,oy]) => {
            ctx.beginPath();
            ctx.ellipse(cx+ox*s*100, cy+oy*s*100, 5*s*100, 9*s*100, ox<0?-0.3:0.3, 0, Math.PI*2);
            ctx.fill();
        });
    }
    // Eyes
    ctx.fillStyle = '#1F2937';
    [[-5,-14],[5,-14]].forEach(([ox,oy]) => {
        ctx.beginPath(); ctx.arc(cx+ox*s*100, cy+oy*s*100, 2*s*100, 0, Math.PI*2); ctx.fill();
    });
    // Nose
    ctx.beginPath(); ctx.ellipse(cx, cy-7*s*100, 3*s*100, 2*s*100, 0, 0, Math.PI*2); ctx.fill();
}

// ── COLOR UTILS ──────────────────────────────────────────────
function darken(hex, amt) {
    let r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    r = Math.max(0, Math.floor(r*(1-amt))); g = Math.max(0, Math.floor(g*(1-amt))); b = Math.max(0, Math.floor(b*(1-amt)));
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}
function lighten(hex, amt) {
    let r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    r = Math.min(255, Math.floor(r+(255-r)*amt)); g = Math.min(255, Math.floor(g+(255-g)*amt)); b = Math.min(255, Math.floor(b+(255-b)*amt));
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

// ── STAT MANAGEMENT ──────────────────────────────────────────
function clamp(v, min=0, max=100) { return Math.max(min, Math.min(max, v)); }

function modStat(stat, amt) {
    state[stat] = clamp(state[stat] + amt);
    if (stat === 'happiness' && state.happiness >= 100) state.maxedHappiness = true;
    updateMood();
    updateStatBars();
}

function updateMood() {
    const avg = (state.hunger + state.happiness + state.energy + state.hygiene + state.health) / 5;
    if (avg > 70) state.mood = 'happy';
    else if (avg > 40) state.mood = 'neutral';
    else state.mood = 'sad';
}

function tickStats() {
    if (state.isSleeping) {
        modStat('energy', 5);
        modStat('hunger', -1);
        if (state.energy >= 100) {
            state.isSleeping = false;
            log(`${state.dogName} woke up feeling refreshed!`);
            SFX.happy();
        } else {
            if (Math.random() < 0.3) SFX.snore();
        }
    } else {
        modStat('hunger', -2);
        modStat('happiness', -1);
        modStat('energy', -1.5);
        modStat('hygiene', -0.5);
    }
    // Health effects
    if (state.hunger < 15) modStat('health', -2);
    if (state.hygiene < 15) modStat('health', -1);
    if (state.hunger > 50 && state.hygiene > 50) modStat('health', 0.5);

    // Random weather change
    if (Math.random() < 0.05) {
        state.weather = ['sunny','sunny','sunny','cloudy','rain','snow'][Math.floor(Math.random()*6)];
    }
    // Day phase
    const h = new Date().getHours();
    if (h >= 6 && h < 17) state.dayPhase = 'day';
    else if (h >= 17 && h < 20) state.dayPhase = 'sunset';
    else state.dayPhase = 'night';

    checkAchievements();
    updateStatBars();
}

function addCoins(amt) {
    state.coins += amt;
    state.totalCoinsEarned += amt;
    updateUI();
}

function addXp(amt) {
    state.xp += amt;
    state.totalXpEarned += amt;
    const needed = xpForLevel(state.level);
    if (state.xp >= needed) {
        state.xp -= needed;
        state.level++;
        SFX.levelUp();
        showToast(`Level Up! ${state.dogName} is now level ${state.level}!`);
        log(`🎉 ${state.dogName} reached level ${state.level}!`);
    }
    updateUI();
}

function xpForLevel(lv) { return 20 + lv * 15; }

// ── INTERACTIONS ─────────────────────────────────────────────
function doPet() {
    if (state.isSleeping) { showToast(`${state.dogName} is sleeping...`); return; }
    modStat('happiness', 5);
    addXp(2);
    addCoins(1);
    state.totalPets++;
    state.actionAnim = 'heart'; state.actionAnimTimer = 1.5;
    SFX.happy();
    spawnParticles('❤️', 3);
    log(`You petted ${state.dogName}!`);
    showReaction(['Woof!','*happy panting*','*tail wagging*','*licks your hand*','So happy!'][Math.floor(Math.random()*5)]);
}

function doFeed() {
    if (state.isSleeping) { showToast(`${state.dogName} is sleeping...`); return; }
    // Show feed menu
    $('feed-dog-name').textContent = state.dogName;
    renderFoodMenu();
    $('feed-menu').classList.remove('hidden');
}

function feedFood(foodId) {
    const food = FOODS.find(f => f.id === foodId);
    if (!food) return;
    if (food.cost > state.coins) { showToast('Not enough coins!'); SFX.error(); return; }
    if (food.cost > 0) state.coins -= food.cost;
    modStat('hunger', food.hunger);
    modStat('happiness', food.happiness);
    if (food.health) modStat('health', food.health);
    if (food.hygiene) modStat('hygiene', food.hygiene);
    addXp(3);
    state.totalFeedings++;
    if (!state.foodsTried.includes(foodId)) state.foodsTried.push(foodId);
    SFX.eat();
    log(`${state.dogName} ate ${food.name}! ${food.icon}`);
    showReaction('Yum!');
    $('feed-menu').classList.add('hidden');
    updateUI();
}

function doPlay() {
    if (state.isSleeping) { showToast(`${state.dogName} is sleeping...`); return; }
    if (state.energy < 10) { showToast(`${state.dogName} is too tired!`); SFX.whine(); return; }
    modStat('happiness', 12);
    modStat('energy', -10);
    modStat('hunger', -5);
    addXp(5);
    addCoins(3);
    SFX.bark();
    state.actionAnim = 'note'; state.actionAnimTimer = 1;
    spawnParticles('🎾', 2);
    log(`You played with ${state.dogName}!`);
    showReaction(['*zooming around*','Woof woof!','*playful bark*','So fun!','Play more!'][Math.floor(Math.random()*5)]);
}

function doWalk() {
    if (state.isSleeping) { showToast(`${state.dogName} is sleeping...`); return; }
    switchTab('walks');
}

function doGroom() {
    if (state.isSleeping) { showToast(`${state.dogName} is sleeping...`); return; }
    modStat('hygiene', 30);
    modStat('happiness', 5);
    modStat('health', 3);
    addXp(4);
    addCoins(2);
    state.totalGrooms++;
    state.actionAnim = 'splash'; state.actionAnimTimer = 1;
    SFX.splash();
    log(`You groomed ${state.dogName}! Squeaky clean!`);
    showReaction('*shakes off water*');
}

function doTricks() {
    if (state.isSleeping) { showToast(`${state.dogName} is sleeping...`); return; }
    renderTricks();
    $('tricks-panel').classList.remove('hidden');
}

function doSleep() {
    if (state.isSleeping) {
        state.isSleeping = false;
        log(`${state.dogName} woke up!`);
        SFX.yip();
        return;
    }
    state.isSleeping = true;
    SFX.sleep();
    log(`${state.dogName} is taking a nap... 💤`);
    showReaction('Zzz...');
}

function doVet() {
    if (state.coins < 20) { showToast('Vet costs 20 coins!'); SFX.error(); return; }
    state.coins -= 20;
    modStat('health', 40);
    modStat('happiness', -5); // Dogs don't love the vet
    state.vetVisits++;
    addXp(5);
    SFX.heal();
    log(`${state.dogName} visited the vet! Health restored.`);
    showReaction('*nervous but brave*');
    updateUI();
}

// ── ACTION DISPATCH ──────────────────────────────────────────
const ACTIONS = { pet: doPet, feed: doFeed, play: doPlay, walk: doWalk, groom: doGroom, tricks: doTricks, sleep: doSleep, vet: doVet };

// ── SHOP ─────────────────────────────────────────────────────
let shopCategory = 'accessories';

function renderShop() {
    const container = $('shop-items');
    container.innerHTML = '';

    let items = [];
    if (shopCategory === 'accessories') items = ACCESSORIES.map(a => ({ ...a, type: 'accessory' }));
    else if (shopCategory === 'food') items = FOODS.filter(f => f.cost > 0).map(f => ({ ...f, type: 'food', price: f.cost }));
    else if (shopCategory === 'toys') items = TOYS.map(t => ({ ...t, type: 'toy' }));
    else if (shopCategory === 'rooms') items = ROOMS.filter(r => r.price > 0).map(r => ({ ...r, type: 'room' }));

    items.forEach(item => {
        const owned = isOwned(item);
        const div = document.createElement('div');
        div.className = 'shop-item' + (owned ? ' owned' : '');

        let preview = '';
        if (item.type === 'food') preview = `<div style="font-size:2em">${item.icon}</div>`;
        else if (item.type === 'toy') preview = `<div style="font-size:2em">${item.icon}</div>`;
        else if (item.type === 'room') preview = `<div style="width:60px;height:40px;border-radius:8px;margin:0 auto;background:linear-gradient(${item.bg1},${item.bg2})"></div>`;
        else {
            const c = document.createElement('canvas');
            c.width = 60; c.height = 40;
            drawAccessoryPreview(c.getContext('2d'), item);
            preview = c.outerHTML;
        }

        div.innerHTML = `${preview}<div class="item-name">${item.name}</div><div class="item-price">🪙 ${item.price}</div>${item.desc ? `<div class="item-desc">${item.desc}</div>` : ''}`;

        if (!owned) {
            div.addEventListener('click', () => buyItem(item));
        }
        container.appendChild(div);
    });
}

function isOwned(item) {
    if (item.type === 'accessory') return state.ownedAccessories.includes(item.id);
    if (item.type === 'toy') return state.ownedToys.includes(item.id);
    if (item.type === 'room') return state.ownedRooms.includes(item.id);
    return false;
}

function buyItem(item) {
    if (state.coins < item.price) { showToast('Not enough coins!'); SFX.error(); return; }
    state.coins -= item.price;
    if (item.type === 'accessory') { state.ownedAccessories.push(item.id); }
    else if (item.type === 'toy') { state.ownedToys.push(item.id); modStat('happiness', item.happiness || 10); }
    else if (item.type === 'room') { state.ownedRooms.push(item.id); state.currentRoom = item.id; }
    SFX.buy();
    showToast(`Bought ${item.name}!`);
    log(`Bought ${item.name}!`);
    renderShop();
    updateUI();
    checkAchievements();
}

function drawAccessoryPreview(ctx, acc) {
    ctx.fillStyle = acc.color;
    if (acc.slot === 'eyes') {
        ctx.fillStyle = 'rgba(30,30,30,0.85)';
        ctx.fillRect(8, 14, 18, 12);
        ctx.fillRect(34, 14, 18, 12);
        ctx.strokeStyle = acc.color; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(26, 20); ctx.lineTo(34, 20); ctx.stroke();
    } else if (acc.slot === 'head') {
        if (acc.id === 'crown') {
            ctx.beginPath();
            ctx.moveTo(15,30); ctx.lineTo(15,12); ctx.lineTo(22,22); ctx.lineTo(30,8);
            ctx.lineTo(38,22); ctx.lineTo(45,12); ctx.lineTo(45,30); ctx.closePath(); ctx.fill();
        } else {
            ctx.beginPath(); ctx.roundRect(15, 8, 30, 28, 4); ctx.fill();
        }
    } else if (acc.slot === 'neck') {
        ctx.beginPath(); ctx.ellipse(30, 20, 25, 8, 0, 0, Math.PI*2); ctx.fill();
    } else if (acc.slot === 'feet') {
        [12,28,44].forEach(x => { ctx.beginPath(); ctx.ellipse(x, 28, 7, 5, 0, 0, Math.PI*2); ctx.fill(); });
    } else if (acc.slot === 'body') {
        ctx.beginPath(); ctx.ellipse(30, 20, 25, 16, 0, 0, Math.PI*2); ctx.fill();
    } else if (acc.slot === 'back') {
        ctx.beginPath();
        ctx.moveTo(10,10); ctx.quadraticCurveTo(5,30,15,35);
        ctx.lineTo(45,35); ctx.quadraticCurveTo(55,30,50,10);
        ctx.closePath(); ctx.fill();
    }
}

// ── WARDROBE ─────────────────────────────────────────────────
function renderWardrobe() {
    const container = $('wardrobe-items');
    container.innerHTML = '';
    if (state.ownedAccessories.length === 0) {
        container.innerHTML = '<p class="hint">No accessories yet! Visit the shop.</p>';
        return;
    }
    state.ownedAccessories.forEach(id => {
        const acc = ACCESSORIES.find(a => a.id === id);
        if (!acc) return;
        const equipped = state.equippedAccessories.includes(id);
        const div = document.createElement('div');
        div.className = 'wardrobe-item' + (equipped ? ' equipped' : '');
        const c = document.createElement('canvas');
        c.width = 50; c.height = 36;
        drawAccessoryPreview(c.getContext('2d'), acc);
        div.appendChild(c);
        div.innerHTML += `<div class="wi-name">${acc.name}</div>`;
        div.addEventListener('click', () => toggleEquip(id));
        container.appendChild(div);
    });
}

function toggleEquip(id) {
    const acc = ACCESSORIES.find(a => a.id === id);
    if (!acc) return;
    const idx = state.equippedAccessories.indexOf(id);
    if (idx >= 0) {
        state.equippedAccessories.splice(idx, 1);
        showToast(`Unequipped ${acc.name}`);
    } else {
        // Remove any existing item in same slot
        state.equippedAccessories = state.equippedAccessories.filter(eid => {
            const a = ACCESSORIES.find(x => x.id === eid);
            return a && a.slot !== acc.slot;
        });
        state.equippedAccessories.push(id);
        showToast(`Equipped ${acc.name}!`);
        SFX.click();
    }
    renderWardrobe();
}

// ── FOOD MENU ────────────────────────────────────────────────
function renderFoodMenu() {
    const container = $('food-list');
    container.innerHTML = '';
    FOODS.forEach(food => {
        const canAfford = food.cost <= state.coins;
        const div = document.createElement('div');
        div.className = 'food-item' + (!canAfford && food.cost > 0 ? ' locked' : '');
        div.innerHTML = `<div class="fi-icon">${food.icon}</div><div class="fi-name">${food.name}</div><div class="fi-info">+${food.hunger} hunger, +${food.happiness} happy${food.cost > 0 ? ` | 🪙${food.cost}` : ' | Free'}</div>`;
        div.addEventListener('click', () => feedFood(food.id));
        container.appendChild(div);
    });
}

// ── TRICKS ───────────────────────────────────────────────────
function renderTricks() {
    const container = $('tricks-list');
    container.innerHTML = '';
    TRICKS.forEach(trick => {
        const learned = state.tricksLearned.includes(trick.id);
        const canLearn = state.level >= trick.unlockLevel;
        const div = document.createElement('div');
        div.className = 'trick-item';
        div.innerHTML = `
            <div><div class="trick-name">${trick.name}</div><div class="trick-level">${learned ? 'Learned!' : `Unlocks at Lv ${trick.unlockLevel}`}</div></div>
            <button class="trick-btn ${learned ? 'learned' : ''}" ${!canLearn && !learned ? 'disabled' : ''}>${learned ? 'Perform' : 'Learn (free)'}</button>
        `;
        div.querySelector('button').addEventListener('click', () => {
            if (learned) performTrick(trick);
            else if (canLearn) learnTrick(trick);
        });
        container.appendChild(div);
    });
}

function learnTrick(trick) {
    state.tricksLearned.push(trick.id);
    SFX.trick();
    showToast(`${state.dogName} learned ${trick.name}!`);
    log(`${state.dogName} learned ${trick.name}! ⭐`);
    addXp(trick.xp);
    renderTricks();
    checkAchievements();
}

function performTrick(trick) {
    if (state.energy < 5) { showToast('Too tired!'); return; }
    modStat('energy', -5);
    modStat('happiness', 8);
    addXp(trick.xp);
    addCoins(trick.coins);
    state.actionAnim = 'star'; state.actionAnimTimer = 1;

    if (trick.id === 'speak') SFX.bark();
    else if (trick.id === 'dance') SFX.happy();
    else SFX.trick();

    log(`${state.dogName} performed ${trick.name}! +${trick.coins} coins`);
    showReaction(`*does ${trick.name}*`);
    $('tricks-panel').classList.add('hidden');
}

// ── WALKS / EXPLORE ──────────────────────────────────────────
function renderWalkLocations() {
    const container = $('walk-locations');
    container.innerHTML = '';
    WALK_LOCS.forEach(loc => {
        const div = document.createElement('div');
        div.className = 'walk-loc';
        div.innerHTML = `<div class="loc-icon">${loc.icon}</div><div class="loc-name">${loc.name}</div><div class="loc-cost">${loc.cost > 0 ? `🪙 ${loc.cost}` : 'Free'} | -${loc.energyCost} energy</div>`;
        div.addEventListener('click', () => goForWalk(loc));
        container.appendChild(div);
    });
}

function goForWalk(loc) {
    if (state.isSleeping) { showToast(`${state.dogName} is sleeping!`); return; }
    if (state.energy < loc.energyCost) { showToast('Not enough energy!'); SFX.whine(); return; }
    if (state.coins < loc.cost) { showToast('Not enough coins!'); SFX.error(); return; }

    state.coins -= loc.cost;
    modStat('energy', -loc.energyCost);
    modStat('happiness', loc.happiness);
    modStat('hygiene', -5);
    state.totalWalks++;
    if (!state.locationsVisited.includes(loc.id)) state.locationsVisited.push(loc.id);
    addXp(10);

    SFX.walk();
    state.actionAnim = 'walk'; state.actionAnimTimer = 3;

    // Find items
    const finds = [];
    loc.finds.forEach(f => {
        if (Math.random() < 0.4) {
            if (f === 'coin') { addCoins(5 + Math.floor(Math.random()*10)); finds.push('some coins'); }
            else if (f === 'gem') { addCoins(25); finds.push('a shiny gem (25 coins!)'); }
            else if (f === 'pearl') { addCoins(20); finds.push('a pearl (20 coins!)'); }
            else { addCoins(2); finds.push(`a ${f}`); }
        }
    });

    // Random encounter
    const encounters = [
        `${state.dogName} met another dog and they played!`,
        `${state.dogName} chased a butterfly!`,
        `${state.dogName} rolled in the grass!`,
        `${state.dogName} splashed in a puddle!`,
        `${state.dogName} found a great stick!`,
        `A kid asked to pet ${state.dogName}!`,
    ];

    const encounter = encounters[Math.floor(Math.random()*encounters.length)];
    log(`🚶 Walked to ${loc.name}!`);
    log(encounter);
    if (finds.length > 0) log(`Found: ${finds.join(', ')}!`);
    showReaction('*sniff sniff*');

    updateUI();
    checkAchievements();
}

// ── MINI-GAMES ───────────────────────────────────────────────
let currentMinigame = null;
let mgCanvas, mgCtx, mgAnimId;

function startMinigame(gameId) {
    if (state.isSleeping) { showToast(`${state.dogName} is sleeping!`); return; }
    if (state.energy < 10) { showToast('Not enough energy!'); SFX.whine(); return; }

    document.querySelector('.minigame-list').classList.add('hidden');
    $('minigame-area').classList.remove('hidden');
    mgCanvas = $('minigame-canvas');
    mgCtx = mgCanvas.getContext('2d');
    currentMinigame = gameId;
    state.minigamesPlayed++;

    if (gameId === 'fetch') startFetch();
    else if (gameId === 'agility') startAgility();
    else if (gameId === 'treat-catch') startTreatCatch();
    else if (gameId === 'memory') startMemory();
    else if (gameId === 'tug') startTug();
}

function endMinigame(won, coins) {
    cancelAnimationFrame(mgAnimId);
    currentMinigame = null;
    modStat('energy', -10);
    if (won) {
        state.minigamesWon++;
        addCoins(coins);
        addXp(15);
        modStat('happiness', 15);
        SFX.coin();
        showToast(`You won! +${coins} coins!`);
        log(`Won a mini-game! +${coins} coins`);
    } else {
        addCoins(Math.floor(coins/3));
        addXp(5);
        showToast(`Game over! +${Math.floor(coins/3)} coins`);
    }
    checkAchievements();
}

function closeMinigame() {
    cancelAnimationFrame(mgAnimId);
    currentMinigame = null;
    $('minigame-area').classList.add('hidden');
    document.querySelector('.minigame-list').classList.remove('hidden');
}

// -- Fetch Game --
function startFetch() {
    let ball = { x: 250, y: 260, vx: 0, vy: 0, thrown: false, caught: false };
    let dog = { x: 100, y: 240 };
    let power = 0, charging = false, score = 0, throws = 0, maxThrows = 5;
    let phase = 'aim'; // aim, fly, fetch

    function draw() {
        mgCtx.fillStyle = '#87CEEB';
        mgCtx.fillRect(0, 0, 500, 200);
        mgCtx.fillStyle = '#90EE90';
        mgCtx.fillRect(0, 200, 500, 100);

        // Dog
        mgCtx.fillStyle = getBreed().bodyColor;
        mgCtx.beginPath(); mgCtx.ellipse(dog.x, dog.y, 20, 15, 0, 0, Math.PI*2); mgCtx.fill();
        mgCtx.beginPath(); mgCtx.arc(dog.x+15, dog.y-12, 12, 0, Math.PI*2); mgCtx.fill();

        // Ball
        mgCtx.fillStyle = '#CDDC39';
        mgCtx.beginPath(); mgCtx.arc(ball.x, ball.y, 8, 0, Math.PI*2); mgCtx.fill();

        // Power bar
        if (phase === 'aim') {
            mgCtx.fillStyle = '#333'; mgCtx.fillRect(20, 20, 104, 14);
            mgCtx.fillStyle = power > 70 ? '#EF4444' : power > 40 ? '#F59E0B' : '#22C55E';
            mgCtx.fillRect(22, 22, power, 10);
        }

        // Score
        mgCtx.fillStyle = '#FFF'; mgCtx.font = '16px sans-serif';
        mgCtx.fillText(`Throws: ${throws}/${maxThrows}  Score: ${score}`, 300, 32);

        if (phase === 'fly') {
            ball.x += ball.vx; ball.y += ball.vy; ball.vy += 0.3;
            if (ball.y > 260) { phase = 'fetch'; }
        }
        if (phase === 'fetch') {
            const dx = ball.x - dog.x, dy = ball.y - dog.y;
            const dist = Math.sqrt(dx*dx+dy*dy);
            if (dist > 5) {
                dog.x += dx/dist * 4; dog.y += dy/dist * 2;
            } else {
                const distance = Math.abs(ball.x - 100);
                const points = Math.floor(distance / 10);
                score += points;
                throws++;
                SFX.bark();
                if (throws >= maxThrows) {
                    endMinigame(score > 30, score);
                    return;
                }
                ball = { x: 100, y: 260, vx: 0, vy: 0 };
                dog = { x: 100, y: 240 };
                phase = 'aim'; power = 0;
            }
        }
        if (phase === 'aim' && charging) {
            power = Math.min(100, power + 2);
        }

        mgAnimId = requestAnimationFrame(draw);
    }

    mgCanvas.onmousedown = mgCanvas.ontouchstart = (e) => {
        e.preventDefault();
        if (phase === 'aim') { charging = true; }
    };
    mgCanvas.onmouseup = mgCanvas.ontouchend = (e) => {
        e.preventDefault();
        if (phase === 'aim' && charging) {
            charging = false;
            ball.vx = power * 0.08;
            ball.vy = -power * 0.06;
            phase = 'fly';
            SFX.fetch();
        }
    };
    draw();
}

// -- Agility Game --
function startAgility() {
    let dog = { x: 50, y: 200, vy: 0, jumping: false };
    let obstacles = []; let spawnTimer = 0; let score = 0; let speed = 3; let gameOver = false;

    function draw() {
        if (gameOver) return;
        mgCtx.fillStyle = '#87CEEB'; mgCtx.fillRect(0,0,500,200);
        mgCtx.fillStyle = '#90EE90'; mgCtx.fillRect(0,200,500,100);
        mgCtx.fillStyle = '#8B7355'; mgCtx.fillRect(0,258,500,42);

        // Dog
        mgCtx.fillStyle = getBreed().bodyColor;
        mgCtx.beginPath(); mgCtx.ellipse(dog.x, dog.y, 18, 14, 0, 0, Math.PI*2); mgCtx.fill();
        mgCtx.beginPath(); mgCtx.arc(dog.x+14, dog.y-10, 10, 0, Math.PI*2); mgCtx.fill();

        // Physics
        if (dog.jumping) { dog.vy += 0.5; dog.y += dog.vy; if (dog.y >= 240) { dog.y = 240; dog.jumping = false; dog.vy = 0; } }

        // Obstacles
        spawnTimer++;
        if (spawnTimer > 60 + Math.random()*40) { obstacles.push({ x: 520, w: 20, h: 30+Math.random()*30 }); spawnTimer = 0; }
        obstacles.forEach(o => {
            o.x -= speed;
            mgCtx.fillStyle = '#8B4513';
            mgCtx.fillRect(o.x, 260-o.h, o.w, o.h);
            // Collision
            if (dog.x+15 > o.x && dog.x-15 < o.x+o.w && dog.y+14 > 260-o.h) {
                gameOver = true;
                endMinigame(score > 15, score * 2);
                return;
            }
        });
        obstacles = obstacles.filter(o => o.x > -30);
        score++;
        speed = 3 + score/200;

        mgCtx.fillStyle = '#FFF'; mgCtx.font = '16px sans-serif';
        mgCtx.fillText(`Score: ${Math.floor(score/10)}`, 400, 30);

        if (!gameOver) mgAnimId = requestAnimationFrame(draw);
    }

    const jump = (e) => { e.preventDefault(); if (!dog.jumping && !gameOver) { dog.jumping = true; dog.vy = -10; SFX.yip(); } };
    mgCanvas.onmousedown = mgCanvas.ontouchstart = jump;
    dog.y = 240;
    draw();
}

// -- Treat Catch --
function startTreatCatch() {
    let dog = { x: 250, w: 50 };
    let treats = []; let score = 0; let missed = 0; let spawnT = 0; let gameOver = false;

    function draw() {
        if (gameOver) return;
        mgCtx.fillStyle = '#FDF2F8'; mgCtx.fillRect(0,0,500,300);

        // Dog (mouth)
        mgCtx.fillStyle = getBreed().bodyColor;
        mgCtx.beginPath(); mgCtx.ellipse(dog.x, 270, 25, 20, 0, 0, Math.PI*2); mgCtx.fill();
        mgCtx.fillStyle = '#1F2937';
        mgCtx.beginPath(); mgCtx.arc(dog.x, 265, 3, 0, Math.PI*2); mgCtx.fill();
        mgCtx.fillStyle = '#FF6B8A';
        mgCtx.beginPath(); mgCtx.ellipse(dog.x, 278, 10, 5, 0, 0, Math.PI); mgCtx.fill();

        spawnT++;
        if (spawnT > 30) { treats.push({ x: 50+Math.random()*400, y: -10, s: 1+Math.random()*1.5 }); spawnT = 0; }

        treats.forEach(t => {
            t.y += t.s;
            mgCtx.font = '20px serif'; mgCtx.fillText('🦴', t.x-10, t.y);
            if (t.y > 260 && Math.abs(t.x - dog.x) < 30) {
                t.caught = true; score++; SFX.eat();
            } else if (t.y > 300) { t.caught = true; missed++; }
        });
        treats = treats.filter(t => !t.caught);

        if (missed >= 5) { gameOver = true; endMinigame(score > 10, score * 3); return; }

        mgCtx.fillStyle = '#333'; mgCtx.font = '16px sans-serif';
        mgCtx.fillText(`Caught: ${score}  Missed: ${missed}/5`, 20, 25);

        mgAnimId = requestAnimationFrame(draw);
    }

    mgCanvas.onmousemove = (e) => { const r = mgCanvas.getBoundingClientRect(); dog.x = clamp((e.clientX-r.left)*(500/r.width), 25, 475); };
    mgCanvas.ontouchmove = (e) => { e.preventDefault(); const r = mgCanvas.getBoundingClientRect(); dog.x = clamp((e.touches[0].clientX-r.left)*(500/r.width), 25, 475); };
    draw();
}

// -- Memory Match --
function startMemory() {
    const emojis = ['🐕','🦴','🐾','🎾','🏠','❤️','⭐','🌟'];
    const cards = [...emojis, ...emojis].sort(() => Math.random()-0.5);
    let revealed = new Array(16).fill(false);
    let matched = new Array(16).fill(false);
    let first = -1, second = -1, locked = false, pairs = 0, moves = 0;

    function draw() {
        mgCtx.fillStyle = '#1E293B'; mgCtx.fillRect(0,0,500,300);
        mgCtx.fillStyle = '#FFF'; mgCtx.font = '14px sans-serif';
        mgCtx.fillText(`Pairs: ${pairs}/8  Moves: ${moves}`, 20, 25);

        for (let i = 0; i < 16; i++) {
            const col = i % 4, row = Math.floor(i/4);
            const x = 100 + col * 80, y = 45 + row * 62;
            if (matched[i]) {
                mgCtx.fillStyle = 'rgba(34,197,94,0.3)';
                mgCtx.fillRect(x, y, 65, 50);
                mgCtx.font = '24px serif'; mgCtx.fillText(cards[i], x+20, y+35);
            } else if (revealed[i]) {
                mgCtx.fillStyle = '#FFF';
                mgCtx.fillRect(x, y, 65, 50);
                mgCtx.font = '24px serif'; mgCtx.fillText(cards[i], x+20, y+35);
            } else {
                mgCtx.fillStyle = '#6366F1';
                mgCtx.beginPath(); mgCtx.roundRect(x, y, 65, 50, 8); mgCtx.fill();
                mgCtx.fillStyle = '#FFF'; mgCtx.font = '18px sans-serif';
                mgCtx.fillText('?', x+28, y+33);
            }
        }
    }

    mgCanvas.onclick = (e) => {
        if (locked) return;
        const r = mgCanvas.getBoundingClientRect();
        const mx = (e.clientX-r.left)*(500/r.width), my = (e.clientY-r.top)*(300/r.height);
        for (let i = 0; i < 16; i++) {
            const col = i%4, row = Math.floor(i/4);
            const x = 100+col*80, y = 45+row*62;
            if (mx > x && mx < x+65 && my > y && my < y+50 && !revealed[i] && !matched[i]) {
                revealed[i] = true; SFX.click();
                if (first < 0) { first = i; }
                else {
                    second = i; locked = true; moves++;
                    setTimeout(() => {
                        if (cards[first] === cards[second]) {
                            matched[first] = matched[second] = true;
                            pairs++; SFX.coin();
                            if (pairs >= 8) { endMinigame(true, 30 - moves); return; }
                        }
                        revealed[first] = revealed[second] = false;
                        first = -1; second = -1; locked = false;
                        draw();
                    }, 700);
                }
                draw();
                return;
            }
        }
    };
    draw();
}

// -- Tug of War --
function startTug() {
    let pos = 50; // 0=dog wins, 100=you win, 50=center
    let clicks = 0; let timer = 10; let gameOver = false;
    const interval = setInterval(() => {
        if (gameOver) { clearInterval(interval); return; }
        timer--;
        pos -= 2 + Math.random()*2; // dog pulls
        if (pos <= 0 || timer <= 0) {
            gameOver = true; clearInterval(interval);
            endMinigame(pos > 50, Math.floor(pos/2));
        }
    }, 500);

    function draw() {
        if (gameOver) return;
        mgCtx.fillStyle = '#FDF2F8'; mgCtx.fillRect(0,0,500,300);

        // Rope
        mgCtx.strokeStyle = '#8B6914'; mgCtx.lineWidth = 8;
        mgCtx.beginPath(); mgCtx.moveTo(50, 150); mgCtx.lineTo(450, 150); mgCtx.stroke();

        // Marker
        const mx = 50 + pos * 4;
        mgCtx.fillStyle = '#EF4444'; mgCtx.beginPath(); mgCtx.arc(mx, 150, 12, 0, Math.PI*2); mgCtx.fill();

        // Center line
        mgCtx.strokeStyle = '#999'; mgCtx.lineWidth = 2;
        mgCtx.beginPath(); mgCtx.moveTo(250, 130); mgCtx.lineTo(250, 170); mgCtx.stroke();

        // Dog side
        mgCtx.fillStyle = getBreed().bodyColor;
        mgCtx.beginPath(); mgCtx.ellipse(30, 150, 20, 15, 0, 0, Math.PI*2); mgCtx.fill();

        // You side
        mgCtx.fillStyle = '#6366F1'; mgCtx.font = '30px serif'; mgCtx.fillText('🤛', 440, 160);

        mgCtx.fillStyle = '#333'; mgCtx.font = '16px sans-serif';
        mgCtx.fillText(`Tap fast! Time: ${timer}s`, 180, 30);
        mgCtx.fillText('TAP TO PULL!', 200, 280);

        mgAnimId = requestAnimationFrame(draw);
    }

    mgCanvas.onmousedown = mgCanvas.ontouchstart = (e) => {
        e.preventDefault();
        if (!gameOver) { pos += 3; clicks++; SFX.click(); }
    };
    draw();
}

// ── ACHIEVEMENTS ─────────────────────────────────────────────
function checkAchievements() {
    const achStats = {
        totalPets: state.totalPets, totalFeedings: state.totalFeedings,
        totalWalks: state.totalWalks, totalCoinsEarned: state.totalCoinsEarned,
        level: state.level, tricksLearned: state.tricksLearned.length,
        accessoriesOwned: state.ownedAccessories.length,
        roomsOwned: state.ownedRooms.length, photosTaken: state.photosTaken,
        minigamesWon: state.minigamesWon, loginStreak: state.loginStreak,
        totalPlaytimeMin: state.totalPlaytimeMin, maxedHappiness: state.maxedHappiness,
        locationsVisited: state.locationsVisited.length,
        foodsTried: state.foodsTried.length, totalGrooms: state.totalGrooms,
        vetVisits: state.vetVisits, toysOwned: state.ownedToys.length,
    };

    ACHIEVEMENTS.forEach(ach => {
        if (!state.achievementsUnlocked.includes(ach.id) && ach.check(achStats)) {
            state.achievementsUnlocked.push(ach.id);
            SFX.achievement();
            showToast(`🏆 Achievement: ${ach.name}!`);
            log(`🏆 Achievement unlocked: ${ach.name}!`);
            addCoins(15);
        }
    });
}

function renderAchievements() {
    const container = $('achievement-list');
    container.innerHTML = '';
    ACHIEVEMENTS.forEach(ach => {
        const unlocked = state.achievementsUnlocked.includes(ach.id);
        const div = document.createElement('div');
        div.className = 'ach-item' + (unlocked ? '' : ' locked');
        div.innerHTML = `<div class="ach-icon">${ach.icon}</div><div class="ach-info"><div class="ach-name">${ach.name}</div><div class="ach-desc">${ach.desc}</div></div>${unlocked ? '<div class="ach-check">✓</div>' : ''}`;
        container.appendChild(div);
    });
}

// ── STATS DASHBOARD ──────────────────────────────────────────
function renderStats() {
    const container = $('stats-content');
    const age = Math.floor((Date.now() - state.createdAt) / 86400000);
    const stats = [
        ['Level', state.level], ['Total XP', state.totalXpEarned],
        ['Age', `${age} day${age!==1?'s':''}`], ['Coins Earned', state.totalCoinsEarned],
        ['Times Petted', state.totalPets], ['Feedings', state.totalFeedings],
        ['Walks', state.totalWalks], ['Grooms', state.totalGrooms],
        ['Vet Visits', state.vetVisits], ['Tricks Known', `${state.tricksLearned.length}/${TRICKS.length}`],
        ['Accessories', `${state.ownedAccessories.length}/${ACCESSORIES.length}`],
        ['Achievements', `${state.achievementsUnlocked.length}/${ACHIEVEMENTS.length}`],
        ['Games Won', state.minigamesWon], ['Photos Taken', state.photosTaken],
        ['Play Time', `${state.totalPlaytimeMin}m`], ['Login Streak', `${state.loginStreak} days`],
    ];
    container.innerHTML = stats.map(([label, val]) =>
        `<div class="stat-card"><div class="sc-value">${val}</div><div class="sc-label">${label}</div></div>`
    ).join('');
}

// ── DAILY REWARD ─────────────────────────────────────────────
function checkDailyReward() {
    const today = new Date().toDateString();
    if (state.lastLoginDate === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (state.lastLoginDate === yesterday) state.loginStreak++;
    else state.loginStreak = 1;
    state.lastLoginDate = today;

    const reward = 10 + state.loginStreak * 5;
    $('daily-reward-text').textContent = `Day ${state.loginStreak} streak! Claim ${reward} coins!`;
    $('daily-reward').classList.remove('hidden');
    $('claim-daily').onclick = () => {
        addCoins(reward);
        SFX.coin();
        $('daily-reward').classList.add('hidden');
        showToast(`Claimed ${reward} coins!`);
        checkAchievements();
    };
}

// ── PHOTO MODE ───────────────────────────────────────────────
function enterPhotoMode() {
    $('photo-overlay').classList.remove('hidden');
}
function exitPhotoMode() {
    $('photo-overlay').classList.add('hidden');
    canvas.style.filter = '';
}
function snapPhoto() {
    SFX.photo();
    state.photosTaken++;
    const filter = $('photo-filter').value;
    const link = document.createElement('a');
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width; tempCanvas.height = canvas.height;
    const tctx = tempCanvas.getContext('2d');
    if (filter === 'sepia') tctx.filter = 'sepia(1)';
    else if (filter === 'grayscale') tctx.filter = 'grayscale(1)';
    else if (filter === 'warm') tctx.filter = 'saturate(1.5) hue-rotate(-10deg)';
    else if (filter === 'cool') tctx.filter = 'saturate(0.8) hue-rotate(30deg)';
    else if (filter === 'vintage') tctx.filter = 'sepia(0.5) contrast(1.2)';
    tctx.drawImage(canvas, 0, 0);
    link.download = `${state.dogName}_photo_${state.photosTaken}.png`;
    link.href = tempCanvas.toDataURL();
    link.click();
    showToast('Photo saved!');
    addCoins(2);
    checkAchievements();
}

$('photo-filter').addEventListener('change', (e) => {
    const f = e.target.value;
    if (f === 'none') canvas.style.filter = '';
    else if (f === 'sepia') canvas.style.filter = 'sepia(1)';
    else if (f === 'grayscale') canvas.style.filter = 'grayscale(1)';
    else if (f === 'warm') canvas.style.filter = 'saturate(1.5) hue-rotate(-10deg)';
    else if (f === 'cool') canvas.style.filter = 'saturate(0.8) hue-rotate(30deg)';
    else if (f === 'vintage') canvas.style.filter = 'sepia(0.5) contrast(1.2)';
});

// ── CANVAS CLICK INTERACTION ─────────────────────────────────
canvas.addEventListener('click', (e) => {
    if (state.isSleeping) { doSleep(); return; } // wake up
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) * (canvas.width / r.width);
    const y = (e.clientY - r.top) * (canvas.height / r.height);
    // Check if clicked on dog area (center of canvas)
    const dx = x - canvas.width/2, dy = y - canvas.height/2;
    if (Math.abs(dx) < 100 && Math.abs(dy) < 120) {
        doPet();
    }
});

// Touch support for canvas
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const r = canvas.getBoundingClientRect();
    const x = (touch.clientX - r.left) * (canvas.width / r.width);
    const y = (touch.clientY - r.top) * (canvas.height / r.height);
    const dx = x - canvas.width/2, dy = y - canvas.height/2;
    if (Math.abs(dx) < 100 && Math.abs(dy) < 120) {
        doPet();
    }
});

// ── UI HELPERS ───────────────────────────────────────────────
function updateUI() {
    $('dog-name-display').textContent = state.dogName;
    $('dog-breed-display').textContent = getBreed().name;
    $('dog-level-display').textContent = `Lv ${state.level}`;
    $('coins-display').textContent = state.coins;
    $('xp-bar').style.width = `${(state.xp / xpForLevel(state.level)) * 100}%`;
    updateStatBars();
}

function updateStatBars() {
    $('bar-hunger').style.width = state.hunger + '%';
    $('bar-happiness').style.width = state.happiness + '%';
    $('bar-energy').style.width = state.energy + '%';
    $('bar-hygiene').style.width = state.hygiene + '%';
    $('bar-health').style.width = state.health + '%';
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    const panel = $(`panel-${tabId}`);
    if (panel) panel.classList.add('active');

    if (tabId === 'shop') renderShop();
    else if (tabId === 'wardrobe') renderWardrobe();
    else if (tabId === 'walks') renderWalkLocations();
    else if (tabId === 'achievements') renderAchievements();
    else if (tabId === 'stats') renderStats();
}

function log(msg) {
    const logEl = $('interact-log');
    const t = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    logEl.innerHTML = `<div class="log-entry"><span class="time">${t}</span>${msg}</div>` + logEl.innerHTML;
    if (logEl.children.length > 50) logEl.lastChild.remove();
}

function showToast(msg) {
    const toast = $('toast');
    toast.textContent = msg;
    toast.classList.remove('hidden');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.add('hidden'), 2500);
}

function showReaction(text) {
    const bubble = $('reaction-bubble');
    bubble.textContent = text;
    bubble.classList.remove('hidden');
    clearTimeout(bubble._timer);
    bubble._timer = setTimeout(() => bubble.classList.add('hidden'), 2000);
}

function spawnParticles(emoji, count) {
    const container = $('click-particles');
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.textContent = emoji;
        p.style.left = `${40 + Math.random()*20}%`;
        p.style.top = `${30 + Math.random()*20}%`;
        p.style.setProperty('--dx', `${(Math.random()-0.5)*80}px`);
        p.style.setProperty('--dy', `${-30 - Math.random()*60}px`);
        container.appendChild(p);
        setTimeout(() => p.remove(), 1000);
    }
}

function showModal(title, body) {
    $('modal-title').textContent = title;
    $('modal-body').innerHTML = body;
    $('modal').classList.remove('hidden');
}

// ── SAVE / LOAD ──────────────────────────────────────────────
function autoSave() {
    try { localStorage.setItem('pawpalace_save', JSON.stringify(state)); } catch(e) {}
}

function loadGame() {
    try {
        const saved = localStorage.getItem('pawpalace_save');
        if (saved) {
            const loaded = JSON.parse(saved);
            state = { ...defaultState(), ...loaded, sessionStart: Date.now() };
            return true;
        }
    } catch(e) {}
    return false;
}

function resetGame() {
    if (confirm('Reset all progress? This cannot be undone!')) {
        localStorage.removeItem('pawpalace_save');
        state = defaultState();
        $('game-screen').classList.add('hidden');
        $('intro-screen').classList.remove('hidden');
        showToast('Game reset!');
    }
}

// ── SETTINGS ─────────────────────────────────────────────────
$('theme-select').addEventListener('change', (e) => {
    document.body.dataset.theme = e.target.value;
});

// ── EVENT WIRING ─────────────────────────────────────────────
$('start-btn').addEventListener('click', startGame);

document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (ACTIONS[action]) ACTIONS[action]();
    });
});

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

document.querySelectorAll('.shop-cat').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.shop-cat').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        shopCategory = btn.dataset.cat;
        renderShop();
    });
});

document.querySelectorAll('.minigame-btn').forEach(btn => {
    btn.addEventListener('click', () => startMinigame(btn.dataset.game));
});

$('minigame-close').addEventListener('click', closeMinigame);
$('modal-close').addEventListener('click', () => $('modal').classList.add('hidden'));
$('photo-btn').addEventListener('click', enterPhotoMode);
$('photo-snap').addEventListener('click', snapPhoto);
$('photo-exit').addEventListener('click', exitPhotoMode);
$('music-toggle').addEventListener('click', toggleMusic);
$('save-btn').addEventListener('click', () => { autoSave(); showToast('Game saved!'); });
$('reset-btn').addEventListener('click', resetGame);

// ── INIT ─────────────────────────────────────────────────────
function init() {
    initBreedSelect();
    if (loadGame()) {
        $('intro-screen').classList.add('hidden');
        $('game-screen').classList.remove('hidden');
        updateUI();
        checkDailyReward();
        requestAnimationFrame(gameLoop);
        setInterval(tickStats, 5000);
        setInterval(() => { state.totalPlaytimeMin += 1; autoSave(); }, 60000);
        log(`Welcome back! ${state.dogName} missed you!`);
        SFX.happy();
    }
}

init();

})();
