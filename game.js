(function(){
"use strict";
// PAW PALACE v3 — MAXED OUT

// ═══ AUDIO ═══
const AC=window.AudioContext||window.webkitAudioContext;
let ac=null;
function ea(){if(!ac)ac=new AC();if(ac.state==='suspended')ac.resume()}
let sfxV=0.7,musV=0.3;
function tone(f,d,type='triangle',v=0.15){ea();const g=ac.createGain(),o=ac.createOscillator();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v*sfxV,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}
function noise(d,v=0.08){ea();const b=ac.createBuffer(1,ac.sampleRate*d,ac.sampleRate);const ch=b.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1;const s=ac.createBufferSource(),g=ac.createGain();s.buffer=b;g.gain.setValueAtTime(v*sfxV,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);s.connect(g);g.connect(ac.destination);s.start();s.stop(ac.currentTime+d)}
const SFX={
bark(){tone(300,.1,'square',.2);setTimeout(()=>tone(350,.15,'square',.18),120)},
whine(){ea();const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.setValueAtTime(600,ac.currentTime);o.frequency.linearRampToValueAtTime(350,ac.currentTime+.5);g.gain.setValueAtTime(.12*sfxV,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.5);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+.5)},
happy(){tone(400,.1);setTimeout(()=>tone(500,.1),100);setTimeout(()=>tone(600,.15),200)},
eat(){for(let i=0;i<3;i++)setTimeout(()=>noise(.06,.12),i*150)},
coin(){tone(800,.08,'square',.1);setTimeout(()=>tone(1200,.12,'square',.1),80)},
buy(){tone(500,.06);setTimeout(()=>tone(700,.06),60);setTimeout(()=>tone(900,.1),120)},
ach(){[523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,.15,'triangle',.12),i*120))},
splash(){noise(.3,.15);tone(200,.2,'sine',.08)},
trick(){tone(600,.08,'square',.1);setTimeout(()=>tone(800,.12,'square',.1),100)},
step(){noise(.03,.03)},
error(){tone(200,.2,'square',.15)},
click(){tone(1000,.03,'sine',.08)},
heal(){tone(440,.1,'sine');setTimeout(()=>tone(550,.1,'sine'),100);setTimeout(()=>tone(660,.15,'sine'),200)},
lvl(){[523,659,784,1047,1318].forEach((f,i)=>setTimeout(()=>tone(f,.2,'triangle',.15),i*100))},
snore(){ea();const o=ac.createOscillator(),g=ac.createGain();o.type='sawtooth';o.frequency.value=80;g.gain.setValueAtTime(.04*sfxV,ac.currentTime);g.gain.linearRampToValueAtTime(0,ac.currentTime+.6);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+.6)},
door(){tone(300,.05);setTimeout(()=>tone(250,.08),60)},
good(){tone(523,.1);setTimeout(()=>tone(659,.1),80);setTimeout(()=>tone(784,.15),160)},
bad(){tone(300,.15,'sawtooth',.12);setTimeout(()=>tone(200,.2,'sawtooth',.1),100)},
yip(){tone(500,.05,'square',.15);setTimeout(()=>tone(700,.08,'square',.12),60)},
photo(){noise(.05,.2);tone(1500,.05,'sine',.1)},
meow(){tone(700,.08,'sine',.12);setTimeout(()=>tone(900,.12,'sine',.1),100)},
plant(){tone(350,.1,'sine',.08);setTimeout(()=>tone(440,.1,'sine',.08),100)},
quest(){[440,554,659].forEach((f,i)=>setTimeout(()=>tone(f,.12,'triangle',.1),i*100))},
thunder(){noise(.5,.2);tone(60,.4,'sawtooth',.15)},
swim(){for(let i=0;i<4;i++)setTimeout(()=>noise(.05,.06),i*100)},
};
let musicOn=false,mNodes=[];
function toggleMusic(){ea();if(musicOn){musicOn=false;mNodes.forEach(n=>{try{n.stop()}catch(e){}});mNodes=[];return}musicOn=true;playML()}
function playML(){if(!musicOn)return;const n=[261,293,329,349,392,440,493,523],sq=[0,2,4,5,7,4,2,0,3,5,7,5,3,0,2,4];let t=ac.currentTime;sq.forEach((s,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=n[s];g.gain.setValueAtTime(musV*.06,t+i*.4);g.gain.exponentialRampToValueAtTime(.001,t+i*.4+.35);o.connect(g);g.connect(ac.destination);o.start(t+i*.4);o.stop(t+i*.4+.38);mNodes.push(o)});setTimeout(playML,sq.length*400)}

// ═══ DATA ═══
const BREEDS=[
{id:'golden',name:'Golden Retriever',body:'#DAA520',ear:'#C8911A',belly:'#F5DEB3',earType:'floppy',sz:1},
{id:'husky',name:'Husky',body:'#9CA3AF',ear:'#6B7280',belly:'#F9FAFB',earType:'pointed',sz:1},
{id:'corgi',name:'Corgi',body:'#F59E0B',ear:'#D97706',belly:'#FEF3C7',earType:'big',sz:.85},
{id:'poodle',name:'Poodle',body:'#FDE8D8',ear:'#FBBF80',belly:'#FFF',earType:'floppy',sz:.95},
{id:'dalmatian',name:'Dalmatian',body:'#F9FAFB',ear:'#374151',belly:'#FFF',earType:'floppy',sz:1,spots:true},
{id:'shepherd',name:'German Shepherd',body:'#92400E',ear:'#78350F',belly:'#1F2937',earType:'pointed',sz:1.1},
{id:'beagle',name:'Beagle',body:'#F5DEB3',ear:'#8B4513',belly:'#FFF',earType:'floppy',sz:.9},
{id:'bulldog',name:'Bulldog',body:'#D4A574',ear:'#B8956A',belly:'#FEF3C7',earType:'small',sz:.9},
];
const ACCESSORIES=[
{id:'sunglasses',name:'Sunglasses',price:50,slot:'eyes',icon:'🕶️',color:'#1F2937'},
{id:'tophat',name:'Top Hat',price:80,slot:'head',icon:'🎩',color:'#1F2937'},
{id:'crown',name:'Crown',price:200,slot:'head',icon:'👑',color:'#F59E0B'},
{id:'bandana',name:'Bandana',price:30,slot:'neck',icon:'🧣',color:'#EF4444'},
{id:'bowtie',name:'Bow Tie',price:40,slot:'neck',icon:'🎀',color:'#6366F1'},
{id:'collar',name:'Gold Collar',price:120,slot:'neck',icon:'⭕',color:'#F59E0B'},
{id:'cape',name:'Super Cape',price:100,slot:'back',icon:'🦸',color:'#EF4444'},
{id:'sweater',name:'Sweater',price:60,slot:'body',icon:'🧥',color:'#3B82F6'},
{id:'shoes_r',name:'Red Shoes',price:70,slot:'feet',icon:'👟',color:'#EF4444'},
{id:'shoes_b',name:'Blue Sneakers',price:70,slot:'feet',icon:'👟',color:'#3B82F6'},
{id:'boots',name:'Rain Boots',price:90,slot:'feet',icon:'🥾',color:'#F59E0B'},
{id:'party',name:'Party Hat',price:45,slot:'head',icon:'🥳',color:'#EC4899'},
{id:'aviators',name:'Aviator Goggles',price:65,slot:'eyes',icon:'🥽',color:'#92400E'},
{id:'scarf',name:'Winter Scarf',price:55,slot:'neck',icon:'🧣',color:'#22C55E'},
{id:'tutu',name:'Tutu',price:75,slot:'body',icon:'🩰',color:'#EC4899'},
{id:'wizard',name:'Wizard Hat',price:150,slot:'head',icon:'🧙',color:'#6D28D9'},
{id:'wings',name:'Angel Wings',price:180,slot:'back',icon:'👼',color:'#FBBF24'},
{id:'horns',name:'Devil Horns',price:80,slot:'head',icon:'😈',color:'#DC2626'},
{id:'socks',name:'Striped Socks',price:35,slot:'feet',icon:'🧦',color:'#F97316'},
{id:'monocle',name:'Monocle',price:95,slot:'eyes',icon:'🧐',color:'#D4AF37'},
{id:'helmet',name:'Space Helmet',price:160,slot:'head',icon:'🪖',color:'#6B7280'},
{id:'tux',name:'Tuxedo',price:140,slot:'body',icon:'🤵',color:'#1F2937'},
{id:'halo',name:'Halo',price:170,slot:'head',icon:'😇',color:'#FBBF24'},
{id:'chain',name:'Bling Chain',price:130,slot:'neck',icon:'⛓️',color:'#F59E0B'},
{id:'sneakers',name:'Gold Sneakers',price:150,slot:'feet',icon:'👟',color:'#D4AF37'},
];
const FOODS=[
{id:'kibble',name:'Kibble',icon:'🥣',hunger:15,happy:2,cost:0},
{id:'bone',name:'Bone',icon:'🦴',hunger:20,happy:8,cost:0},
{id:'steak',name:'Steak',icon:'🥩',hunger:35,happy:15,cost:15},
{id:'treat',name:'Treat',icon:'🍪',hunger:5,happy:20,cost:10},
{id:'fish',name:'Salmon',icon:'🐟',hunger:30,happy:10,cost:20,hp:5},
{id:'cake',name:'Pupcake',icon:'🧁',hunger:10,happy:25,cost:25},
{id:'water',name:'Water',icon:'💧',hunger:5,happy:5,cost:0,hyg:5},
{id:'icecream',name:'Ice Cream',icon:'🍦',hunger:8,happy:30,cost:30},
{id:'pizza',name:'Pizza Crust',icon:'🍕',hunger:25,happy:12,cost:12},
{id:'chicken',name:'Chicken',icon:'🍗',hunger:32,happy:14,cost:18},
];
const TOYS=[
{id:'ball',name:'Tennis Ball',price:20,icon:'🎾',happy:10},
{id:'rope',name:'Rope Toy',price:25,icon:'🪢',happy:12},
{id:'squeaky',name:'Squeaky Duck',price:30,icon:'🦆',happy:15},
{id:'frisbee',name:'Frisbee',price:35,icon:'🥏',happy:14},
{id:'plushie',name:'Plush Bear',price:40,icon:'🧸',happy:18},
{id:'puzzle',name:'Puzzle Feeder',price:50,icon:'🧩',happy:20},
{id:'laser',name:'Laser Pointer',price:45,icon:'🔴',happy:22},
{id:'tunnel',name:'Play Tunnel',price:55,icon:'🕳️',happy:16},
];
const TRICKS=[
{id:'sit',name:'Sit',xp:5,coins:3,lvl:1},{id:'shake',name:'Shake Paw',xp:8,coins:5,lvl:2},
{id:'roll',name:'Roll Over',xp:12,coins:8,lvl:3},{id:'speak',name:'Speak',xp:10,coins:6,lvl:4},
{id:'dead',name:'Play Dead',xp:15,coins:10,lvl:5},{id:'spin',name:'Spin',xp:12,coins:8,lvl:6},
{id:'hi5',name:'High Five',xp:18,coins:12,lvl:7},{id:'dance',name:'Dance',xp:25,coins:18,lvl:8},
{id:'flip',name:'Backflip',xp:35,coins:25,lvl:10},{id:'crawl',name:'Army Crawl',xp:20,coins:14,lvl:9},
{id:'hug',name:'Hug',xp:30,coins:20,lvl:12},{id:'sing',name:'Sing',xp:40,coins:30,lvl:15},
];
const COLLECTIBLES=[
{id:'gem_red',name:'Ruby',icon:'🔴',value:25},{id:'gem_blue',name:'Sapphire',icon:'🔵',value:30},
{id:'gem_green',name:'Emerald',icon:'🟢',value:28},{id:'coin_old',name:'Old Coin',icon:'🪙',value:15},
{id:'key_gold',name:'Gold Key',icon:'🔑',value:40},{id:'fossil',name:'Fossil',icon:'🦴',value:35},
{id:'crystal',name:'Crystal',icon:'💎',value:50},{id:'medal',name:'Old Medal',icon:'🏅',value:20},
{id:'pearl',name:'Pearl',icon:'⚪',value:45},{id:'ring',name:'Ring',icon:'💍',value:60},
];
const QUEST_TEMPLATES=[
{desc:'Pet your dog 5 times',check:(s,p)=>s.pets-p.pets>=5,reward:20,icon:'🤍'},
{desc:'Feed your dog 3 times',check:(s,p)=>s.feeds-p.feeds>=3,reward:15,icon:'🍖'},
{desc:'Visit 3 different rooms',check:(s,p)=>s.roomVisits-p.roomVisits>=3,reward:18,icon:'🚪'},
{desc:'Do 5 interactions',check:(s,p)=>s.interactions-p.interactions>=5,reward:22,icon:'👆'},
{desc:'Perform 2 tricks',check:(s,p)=>s.tricksDone-p.tricksDone>=2,reward:25,icon:'⭐'},
{desc:'Groom your dog',check:(s,p)=>s.grooms-p.grooms>=1,reward:12,icon:'🛁'},
{desc:'Find a collectible',check:(s,p)=>s.collectFound-p.collectFound>=1,reward:30,icon:'💎'},
{desc:'Switch characters 3 times',check:(s,p)=>s.switches-p.switches>=3,reward:10,icon:'🔄'},
{desc:'Earn 50 coins',check:(s,p)=>s.coinsTotal-p.coinsTotal>=50,reward:20,icon:'🪙'},
{desc:'Play a mini-game',check:(s,p)=>s.mgPlayed-p.mgPlayed>=1,reward:25,icon:'🎮'},
];
const NPC_TYPES=[
{id:'mailman',name:'Mailman',icon:'📬',emoji:'📦',msg:'Special delivery!',coins:10,xp:5},
{id:'neighbor',name:'Neighbor',icon:'👋',emoji:'🏠',msg:'Hi! Nice dog!',happy:8,xp:3},
{id:'vet_npc',name:'Vet',icon:'🩺',emoji:'💊',msg:'Free checkup!',hp:15,xp:5},
{id:'chef',name:'Chef',icon:'👨‍🍳',emoji:'🍖',msg:'Have some treats!',hunger:15,happy:5},
{id:'trainer',name:'Trainer',icon:'🏋️',emoji:'⭐',msg:'Training time!',xp:20},
{id:'photographer',name:'Photographer',icon:'📸',emoji:'📷',msg:'Say cheese!',happy:10,coins:8},
{id:'kid',name:'Kid',icon:'👧',emoji:'🎈',msg:'Can I pet your dog?',happy:15},
{id:'dogwalker',name:'Dog Walker',icon:'🚶',emoji:'🐕',msg:'Want to walk together?',happy:10,energy:-5},
];
const GARDEN_PLANTS=[
{id:'rose',name:'Rose',icon:'🌹',growTime:3,value:15},
{id:'sunflower',name:'Sunflower',icon:'🌻',growTime:4,value:20},
{id:'tulip',name:'Tulip',icon:'🌷',growTime:2,value:10},
{id:'cactus',name:'Cactus',icon:'🌵',growTime:5,value:25},
{id:'daisy',name:'Daisy',icon:'🌼',growTime:2,value:8},
{id:'herb',name:'Herb',icon:'🌿',growTime:3,value:12},
];

// ═══ ACHIEVEMENTS ═══
const ACHIEVEMENTS=[
{id:'pet1',name:'First Touch',desc:'Pet your dog',icon:'🤍',ck:s=>s.pets>=1},
{id:'pet100',name:'Pet Lover',desc:'Pet 100 times',icon:'💜',ck:s=>s.pets>=100},
{id:'fed50',name:'Provider',desc:'Feed 50 times',icon:'🍖',ck:s=>s.feeds>=50},
{id:'walk20',name:'Explorer',desc:'20 room visits',icon:'🗺️',ck:s=>s.roomVisits>=20},
{id:'c500',name:'Coin Collector',desc:'Earn 500 coins',icon:'💰',ck:s=>s.coinsTotal>=500},
{id:'c2000',name:'Rich Pup',desc:'Earn 2000 coins',icon:'💎',ck:s=>s.coinsTotal>=2000},
{id:'c5000',name:'Millionaire Mutt',desc:'Earn 5000 coins',icon:'🤑',ck:s=>s.coinsTotal>=5000},
{id:'lv5',name:'Growing Up',desc:'Reach level 5',icon:'📈',ck:s=>s.level>=5},
{id:'lv10',name:'Top Dog',desc:'Reach level 10',icon:'🏆',ck:s=>s.level>=10},
{id:'lv20',name:'Legendary',desc:'Reach level 20',icon:'👑',ck:s=>s.level>=20},
{id:'tr3',name:'Smart Pup',desc:'Learn 3 tricks',icon:'🎓',ck:s=>s.tricks>=3},
{id:'trAll',name:'Trick Master',desc:'All tricks',icon:'🌟',ck:s=>s.tricks>=TRICKS.length},
{id:'ac5',name:'Fashionista',desc:'Own 5 accessories',icon:'👗',ck:s=>s.accs>=5},
{id:'acAll',name:'Full Wardrobe',desc:'All accessories',icon:'🎭',ck:s=>s.accs>=ACCESSORIES.length},
{id:'photo10',name:'Photographer',desc:'10 photos',icon:'📸',ck:s=>s.photos>=10},
{id:'int50',name:'Social Butterfly',desc:'50 interactions',icon:'🦋',ck:s=>s.interactions>=50},
{id:'d7',name:'Dedicated',desc:'7 day streak',icon:'📅',ck:s=>s.streak>=7},
{id:'happy',name:'Pure Joy',desc:'Max happiness',icon:'😊',ck:s=>s.maxHappy},
{id:'food',name:'Foodie',desc:'Try all foods',icon:'🍽️',ck:s=>s.foodsTried>=FOODS.length},
{id:'groom20',name:'Clean Pup',desc:'Groom 20x',icon:'🛁',ck:s=>s.grooms>=20},
{id:'vet10',name:'Healthy',desc:'10 vet visits',icon:'🩺',ck:s=>s.vets>=10},
{id:'toys',name:'Toy Collector',desc:'All toys',icon:'🧸',ck:s=>s.toysN>=TOYS.length},
{id:'mansion',name:'Home Owner',desc:'Visit all rooms',icon:'🏠',ck:s=>s.allRooms},
{id:'switch50',name:'Shapeshifter',desc:'Switch 50x',icon:'🔄',ck:s=>s.switches>=50},
{id:'neg5',name:'Oops!',desc:'5 negative events',icon:'💥',ck:s=>s.negEvents>=5},
{id:'pos20',name:'Lucky Dog',desc:'20 positive events',icon:'🍀',ck:s=>s.posEvents>=20},
{id:'playtime',name:'Best Friends',desc:'Play 1 hour',icon:'⏰',ck:s=>s.playtime>=60},
{id:'collect5',name:'Treasure Hunter',desc:'Find 5 collectibles',icon:'🗝️',ck:s=>s.collectFound>=5},
{id:'collect20',name:'Archaeologist',desc:'Find 20 collectibles',icon:'🏺',ck:s=>s.collectFound>=20},
{id:'garden5',name:'Green Thumb',desc:'Harvest 5 plants',icon:'🌱',ck:s=>s.plantsHarvested>=5},
{id:'quest10',name:'Questmaster',desc:'Complete 10 quests',icon:'📜',ck:s=>s.questsDone>=10},
{id:'cat',name:'Cat Person Too',desc:'Adopt a cat',icon:'🐱',ck:s=>s.hasCat},
{id:'npc10',name:'Popular',desc:'Meet 10 NPCs',icon:'👥',ck:s=>s.npcMet>=10},
{id:'mg5',name:'Gamer',desc:'Play 5 mini-games',icon:'🎮',ck:s=>s.mgPlayed>=5},
{id:'sprint',name:'Speed Demon',desc:'Sprint 100 times',icon:'💨',ck:s=>s.sprints>=100},
{id:'allWeather',name:'Storm Chaser',desc:'See all weather types',icon:'🌦️',ck:s=>s.weatherSeen>=5},
];

// ═══ ROOMS ═══
const RW=800,RH=600;
const ROOMS={
living:{name:'Living Room',floor:'#C4A882',walls:'#E8DCC8',accent:'#8B7355',
furniture:[
{id:'couch',name:'Couch',x:150,y:200,w:140,h:60,color:'#6366F1',icon:'🛋️'},
{id:'tv',name:'TV',x:400,y:80,w:80,h:20,color:'#1F2937',icon:'📺'},
{id:'bookshelf',name:'Bookshelf',x:600,y:100,w:60,h:120,color:'#92400E',icon:'📚'},
{id:'fireplace',name:'Fireplace',x:100,y:80,w:80,h:70,color:'#7C2D12',icon:'🔥'},
{id:'rug',name:'Rug',x:350,y:350,w:150,h:100,color:'#DC2626'},
{id:'lamp',name:'Lamp',x:680,y:300,w:30,h:50,color:'#FBBF24',icon:'💡'},
],doors:[
{x:370,y:0,w:60,h:12,to:'hallway',sx:370,sy:540},
{x:0,y:250,w:12,h:60,to:'kitchen',sx:750,sy:250},
{x:788,y:250,w:12,h:60,to:'gameroom',sx:30,sy:250},
],interactions:{
couch:[{text:'Relaxed on the couch.',icon:'😌',pos:true,stat:'energy',amt:10},{text:'Dog jumped up and got comfy!',icon:'🐕',pos:true,stat:'happy',amt:8},{text:'Found coins in cushions!',icon:'🪙',pos:true,coins:10},{text:'Dog knocked a pillow off!',icon:'😅',pos:false,stat:'happy',amt:-3}],
tv:[{text:'Watched a nature doc together!',icon:'📺',pos:true,stat:'happy',amt:10},{text:'Dog barked at TV animals!',icon:'🐕',pos:true,stat:'happy',amt:5,sound:'bark'},{text:'Remote is missing...',icon:'😐',pos:false,stat:'happy',amt:-2},{text:'Found a fun dog show! +XP',icon:'⭐',pos:true,xp:10}],
bookshelf:[{text:'Read a dog training book! +XP',icon:'📖',pos:true,xp:15},{text:'Dog knocked books off!',icon:'📚',pos:false,stat:'hygiene',amt:-5},{text:'Found $20 in a book!',icon:'💵',pos:true,coins:20},{text:'Learned something new!',icon:'🧠',pos:true,xp:8}],
fireplace:[{text:'Sat by the warm fire.',icon:'🔥',pos:true,stat:'happy',amt:12},{text:'Dog got too close! Careful!',icon:'⚠️',pos:false,stat:'health',amt:-5},{text:'Roasted marshmallows!',icon:'😋',pos:true,stat:'hunger',amt:5,stat2:'happy',amt2:10}],
lamp:[{text:'Cozy lighting on.',icon:'💡',pos:true,stat:'happy',amt:3},{text:'Dog bumped the lamp!',icon:'😬',pos:false,coins:-5}],
}},
kitchen:{name:'Kitchen',floor:'#F5F0E6',walls:'#E5DDD0',accent:'#D4C5A9',
furniture:[
{id:'fridge',name:'Fridge',x:100,y:80,w:70,h:80,color:'#D1D5DB',icon:'🧊'},
{id:'stove',name:'Stove',x:300,y:80,w:80,h:50,color:'#374151',icon:'🍳'},
{id:'counter',name:'Counter',x:500,y:80,w:120,h:40,color:'#92400E'},
{id:'foodbowl',name:'Food Bowl',x:600,y:400,w:40,h:30,color:'#EF4444',icon:'🥣'},
{id:'waterbowl',name:'Water Bowl',x:660,y:400,w:40,h:30,color:'#3B82F6',icon:'💧'},
{id:'table',name:'Table',x:300,y:350,w:120,h:80,color:'#92400E'},
],doors:[
{x:788,y:250,w:12,h:60,to:'living',sx:30,sy:250},
{x:370,y:0,w:60,h:12,to:'yard',sx:370,sy:540},
],interactions:{
fridge:[{text:'Found leftover steak!',icon:'🥩',pos:true,stat:'hunger',amt:20,stat2:'happy',amt2:10},{text:'Fridge is almost empty...',icon:'😕',pos:false,stat:'happy',amt:-3},{text:'Healthy snack!',icon:'🥕',pos:true,stat:'hunger',amt:10,stat2:'health',amt2:5},{text:'Dog stole food!',icon:'🐕',pos:true,stat:'hunger',amt:15,sound:'eat'}],
stove:[{text:'Cooked a delicious meal!',icon:'👨‍🍳',pos:true,stat:'hunger',amt:30,coins:5},{text:'Burnt the food!',icon:'🔥',pos:false,stat:'hygiene',amt:-8},{text:'Made dog treats!',icon:'🍪',pos:true,stat:'happy',amt:15,xp:5}],
foodbowl:[{text:'Filled the food bowl!',icon:'🥣',pos:true,stat:'hunger',amt:20,sound:'eat'},{text:'Dog made a mess eating!',icon:'😅',pos:false,stat:'hygiene',amt:-5,stat2:'hunger',amt2:15}],
waterbowl:[{text:'Fresh water!',icon:'💧',pos:true,stat:'hunger',amt:5,stat2:'hygiene',amt2:5},{text:'Dog splashed water everywhere!',icon:'💦',pos:false,stat:'hygiene',amt:-8,stat2:'happy',amt2:5}],
counter:[{text:'Found coins!',icon:'🪙',pos:true,coins:8},{text:'Dog jumped on counter!',icon:'🐕',pos:false,stat:'happy',amt:-5}],
}},
hallway:{name:'Hallway',floor:'#D4C5A9',walls:'#E8DCC8',accent:'#8B7355',
furniture:[
{id:'mirror',name:'Mirror',x:200,y:80,w:60,h:80,color:'#93C5FD',icon:'🪞'},
{id:'shoes_rack',name:'Shoe Rack',x:500,y:80,w:80,h:50,color:'#78350F',icon:'👟'},
{id:'coat_rack',name:'Coat Rack',x:650,y:150,w:30,h:70,color:'#92400E',icon:'🧥'},
{id:'stairs',name:'Stairs',x:350,y:200,w:100,h:120,color:'#A78B6E',icon:'🪜'},
],doors:[
{x:370,y:588,w:60,h:12,to:'living',sx:370,sy:30},
{x:0,y:250,w:12,h:60,to:'bathroom',sx:750,sy:250},
{x:788,y:250,w:12,h:60,to:'bedroom',sx:30,sy:250},
{x:370,y:0,w:60,h:12,to:'study',sx:370,sy:540},
{x:0,y:100,w:12,h:60,to:'attic',sx:750,sy:300},
{x:788,y:100,w:12,h:60,to:'basement',sx:30,sy:300},
],interactions:{
mirror:[{text:'Looking good! Confidence boost!',icon:'😎',pos:true,stat:'happy',amt:8},{text:'Dog barked at its reflection!',icon:'🐕',pos:true,stat:'happy',amt:5,sound:'bark'}],
shoes_rack:[{text:'Dog chewed a shoe!',icon:'👟',pos:false,coins:-10},{text:'Found a coin in a shoe!',icon:'🪙',pos:true,coins:5}],
coat_rack:[{text:'Dog pulled a coat down!',icon:'🧥',pos:true,stat:'happy',amt:10},{text:'Everything fell off!',icon:'💥',pos:false,stat:'hygiene',amt:-3}],
stairs:[{text:'Raced up the stairs!',icon:'🏃',pos:true,stat:'energy',amt:-10,stat2:'happy',amt2:8,xp:5},{text:'Dog slid down the banister!',icon:'😂',pos:true,stat:'happy',amt:12}],
}},
bedroom:{name:'Bedroom',floor:'#E8D5E0',walls:'#F3E8EE',accent:'#C084A0',
furniture:[
{id:'bed',name:'Bed',x:150,y:150,w:160,h:120,color:'#6366F1',icon:'🛏️'},
{id:'dresser',name:'Dresser',x:500,y:100,w:80,h:60,color:'#92400E',icon:'🗄️'},
{id:'toybox',name:'Toy Box',x:600,y:350,w:60,h:50,color:'#EF4444',icon:'🧸'},
{id:'window_b',name:'Window',x:350,y:70,w:80,h:60,color:'#93C5FD',icon:'🪟'},
{id:'dogbed',name:'Dog Bed',x:150,y:420,w:80,h:50,color:'#F59E0B',icon:'🐕'},
],doors:[{x:0,y:250,w:12,h:60,to:'hallway',sx:750,sy:250}],
interactions:{
bed:[{text:'Took a nap. Refreshed!',icon:'😴',pos:true,stat:'energy',amt:30},{text:'Cuddle time!',icon:'🥰',pos:true,stat:'happy',amt:15,stat2:'energy',amt2:10},{text:'Treat under the pillow!',icon:'🍪',pos:true,stat:'hunger',amt:5,coins:5}],
dresser:[{text:'Opens wardrobe!',icon:'👔',pos:true,panel:'wardrobe'},{text:'Found coins!',icon:'🪙',pos:true,coins:15},{text:'Dog pulled out socks!',icon:'🧦',pos:false,stat:'hygiene',amt:-5}],
toybox:[{text:'New toy! Dog is thrilled!',icon:'🧸',pos:true,stat:'happy',amt:20},{text:'Tug of war!',icon:'🪢',pos:true,stat:'happy',amt:12,stat2:'energy',amt2:-5},{text:'Toys spilled out!',icon:'😅',pos:false,stat:'hygiene',amt:-5,stat2:'happy',amt2:8}],
window_b:[{text:'Watched birds outside.',icon:'🐦',pos:true,stat:'happy',amt:8},{text:'Dog spotted a squirrel!',icon:'🐿️',pos:true,stat:'happy',amt:5,sound:'bark'}],
dogbed:[{text:'Dog curled up. So cute!',icon:'🐕',pos:true,stat:'energy',amt:15,stat2:'happy',amt2:5},{text:'Tucked the dog in!',icon:'🥰',pos:true,stat:'happy',amt:10}],
}},
bathroom:{name:'Bathroom',floor:'#E0F2FE',walls:'#BFDBFE',accent:'#60A5FA',
furniture:[
{id:'bathtub',name:'Bathtub',x:150,y:150,w:140,h:100,color:'#FFF',icon:'🛁'},
{id:'sink',name:'Sink',x:450,y:100,w:60,h:40,color:'#FFF',icon:'🚰'},
{id:'toilet',name:'Toilet',x:600,y:150,w:50,h:50,color:'#FFF',icon:'🚽'},
{id:'towels',name:'Towel Rack',x:550,y:350,w:50,h:60,color:'#EC4899',icon:'🧴'},
],doors:[{x:788,y:250,w:12,h:60,to:'hallway',sx:30,sy:250}],
interactions:{
bathtub:[{text:'Bath time! Squeaky clean!',icon:'🛁',pos:true,stat:'hygiene',amt:35,sound:'splash'},{text:'Dog splashed EVERYWHERE!',icon:'💦',pos:false,stat:'hygiene',amt:20,stat2:'happy',amt2:-5},{text:'Bubble bath party!',icon:'🫧',pos:true,stat:'hygiene',amt:30,stat2:'happy',amt2:10}],
sink:[{text:'Washed up nicely.',icon:'🚰',pos:true,stat:'hygiene',amt:10},{text:'Dog drank from the faucet!',icon:'💧',pos:true,stat:'hunger',amt:5}],
toilet:[{text:'Dog drank from the toilet!',icon:'🤢',pos:false,stat:'hygiene',amt:-10,stat2:'health',amt2:-3},{text:'Lid was down. Safe!',icon:'😅',pos:true,stat:'hygiene',amt:2}],
towels:[{text:'Fluffy towel!',icon:'🧴',pos:true,stat:'hygiene',amt:10,stat2:'happy',amt2:5},{text:'Dog shredded a towel!',icon:'💥',pos:false,coins:-8,stat:'happy',amt:5}],
}},
yard:{name:'Yard',floor:'#86C46D',walls:'#5BA347',accent:'#3B7A2B',outdoor:true,
furniture:[
{id:'tree',name:'Big Tree',x:150,y:150,w:80,h:100,color:'#15803D',icon:'🌳'},
{id:'garden_plot',name:'Garden',x:500,y:130,w:100,h:80,color:'#65A30D',icon:'🌻'},
{id:'pond',name:'Pond',x:350,y:350,w:120,h:80,color:'#38BDF8',icon:'🏞️'},
{id:'hydrant',name:'Fire Hydrant',x:650,y:350,w:30,h:40,color:'#EF4444',icon:'🧯'},
{id:'ball_y',name:'Tennis Ball',x:200,y:400,w:25,h:25,color:'#84CC16',icon:'🎾'},
{id:'doghouse',name:'Dog House',x:600,y:150,w:80,h:70,color:'#92400E',icon:'🏠'},
],doors:[{x:370,y:588,w:60,h:12,to:'kitchen',sx:370,sy:30},{x:788,y:250,w:12,h:60,to:'pool',sx:30,sy:250}],
interactions:{
tree:[{text:'Dog marked its territory!',icon:'🌳',pos:true,stat:'happy',amt:8},{text:'Found a stick!',icon:'🪵',pos:true,stat:'happy',amt:12,stat2:'energy',amt2:-5},{text:'Bird pooped on you!',icon:'💩',pos:false,stat:'hygiene',amt:-10},{text:'Relaxed in the shade.',icon:'😌',pos:true,stat:'energy',amt:8}],
garden_plot:[{text:'Smelled beautiful flowers!',icon:'🌻',pos:true,stat:'happy',amt:10},{text:'Dog dug up the garden!',icon:'🐕',pos:false,stat:'hygiene',amt:-10,coins:15},{text:'Found buried treasure!',icon:'💎',pos:true,coins:25,collectible:true},{text:'Planted a flower!',icon:'🌷',pos:true,xp:10}],
pond:[{text:'Splashed in the pond!',icon:'💦',pos:true,stat:'happy',amt:15,stat2:'hygiene',amt2:-10,sound:'splash'},{text:'Dog caught a frog!',icon:'🐸',pos:true,stat:'happy',amt:12},{text:'Slipped and fell in!',icon:'😱',pos:false,stat:'hygiene',amt:-15,stat2:'happy',amt2:-5},{text:'Found a shiny coin!',icon:'🪙',pos:true,coins:12}],
hydrant:[{text:'Dog did its thing...',icon:'🚿',pos:true,stat:'happy',amt:8},{text:'Hydrant burst! Water everywhere!',icon:'💦',pos:false,stat:'hygiene',amt:-15,stat2:'happy',amt2:10}],
ball_y:[{text:'Played fetch! SO happy!',icon:'🎾',pos:true,stat:'happy',amt:20,stat2:'energy',amt2:-10,sound:'bark'},{text:'Amazing catch!',icon:'⭐',pos:true,xp:15,stat:'happy',amt:15},{text:'Ball went over the fence...',icon:'😢',pos:false,stat:'happy',amt:-8}],
doghouse:[{text:'Dog retreated. Cozy!',icon:'🏠',pos:true,stat:'energy',amt:15},{text:'Found hidden treats!',icon:'🍖',pos:true,stat:'hunger',amt:15,coins:5}],
}},
gameroom:{name:'Game Room',floor:'#1E293B',walls:'#334155',accent:'#475569',
furniture:[
{id:'arcade',name:'Arcade',x:150,y:120,w:70,h:90,color:'#7C3AED',icon:'🕹️'},
{id:'pool_t',name:'Pool Table',x:400,y:200,w:160,h:100,color:'#15803D',icon:'🎱'},
{id:'darts',name:'Dart Board',x:650,y:120,w:50,h:50,color:'#DC2626',icon:'🎯'},
{id:'jukebox',name:'Jukebox',x:100,y:350,w:60,h:80,color:'#F59E0B',icon:'🎵'},
{id:'beanbag',name:'Bean Bag',x:550,y:400,w:70,h:50,color:'#EC4899',icon:'💺'},
],doors:[{x:0,y:250,w:12,h:60,to:'living',sx:750,sy:250},{x:788,y:250,w:12,h:60,to:'study',sx:30,sy:250}],
interactions:{
arcade:[{text:'Beat the high score!',icon:'🕹️',pos:true,coins:20,xp:10},{text:'Game Over... lost coins.',icon:'💀',pos:false,coins:-10},{text:'Dog pressed buttons!',icon:'🐕',pos:true,stat:'happy',amt:10},{text:'Bonus round!',icon:'⭐',pos:true,coins:30,xp:15,minigame:'memory'}],
pool_t:[{text:'Won at pool!',icon:'🎱',pos:true,coins:15,xp:8},{text:'Dog stole the cue ball!',icon:'🐕',pos:false,stat:'happy',amt:8,coins:-5},{text:'Perfect trick shot!',icon:'✨',pos:true,coins:25}],
darts:[{text:'Bullseye!',icon:'🎯',pos:true,coins:15,xp:10},{text:'Missed the board!',icon:'😬',pos:false,stat:'happy',amt:-3},{text:'Dog fetched the darts!',icon:'🐕',pos:true,stat:'happy',amt:8}],
jukebox:[{text:'Dance party!',icon:'🎵',pos:true,stat:'happy',amt:15},{text:'Dog started howling!',icon:'🐺',pos:true,stat:'happy',amt:10,sound:'bark'},{text:'Jukebox ate your coin!',icon:'😤',pos:false,coins:-5}],
beanbag:[{text:'Sank in. Ahhhh.',icon:'😌',pos:true,stat:'energy',amt:12},{text:'Dog claimed it first!',icon:'🐕',pos:true,stat:'happy',amt:8}],
}},
study:{name:'Study',floor:'#3C2415',walls:'#5C3D2E',accent:'#8B6914',
furniture:[
{id:'desk',name:'Desk',x:300,y:120,w:140,h:60,color:'#78350F',icon:'🖥️'},
{id:'computer',name:'Computer',x:340,y:100,w:60,h:40,color:'#1F2937',icon:'💻'},
{id:'globe',name:'Globe',x:600,y:200,w:40,h:50,color:'#3B82F6',icon:'🌍'},
{id:'books',name:'Library Wall',x:100,y:100,w:60,h:200,color:'#92400E',icon:'📚'},
{id:'armchair',name:'Armchair',x:500,y:380,w:70,h:60,color:'#7C2D12',icon:'💺'},
{id:'safe',name:'Safe',x:650,y:400,w:50,h:50,color:'#4B5563',icon:'🔐'},
],doors:[{x:370,y:588,w:60,h:12,to:'hallway',sx:370,sy:30},{x:0,y:250,w:12,h:60,to:'gameroom',sx:750,sy:250}],
interactions:{
desk:[{text:'Productive work!',icon:'📝',pos:true,coins:20,xp:10},{text:'Dog knocked papers off!',icon:'📄',pos:false,stat:'hygiene',amt:-3},{text:'Important documents! +XP',icon:'📋',pos:true,xp:20}],
computer:[{text:'Online shopping!',icon:'🛒',pos:true,panel:'shop'},{text:'Funny dog videos!',icon:'📱',pos:true,stat:'happy',amt:12},{text:'Computer crashed!',icon:'💥',pos:false,stat:'happy',amt:-5}],
globe:[{text:'Planned a trip!',icon:'🌍',pos:true,stat:'happy',amt:8,xp:5},{text:'Dog spun the globe!',icon:'🐾',pos:true,stat:'happy',amt:6}],
books:[{text:'Read an encyclopedia! +XP',icon:'📖',pos:true,xp:25},{text:'Dog chewed a rare book!',icon:'📕',pos:false,coins:-15},{text:'Found a secret note!',icon:'🔍',pos:true,coins:30,collectible:true}],
armchair:[{text:'Read by firelight. Cozy!',icon:'📖',pos:true,stat:'energy',amt:10,stat2:'happy',amt2:8},{text:'Dog curled on your lap!',icon:'🥰',pos:true,stat:'happy',amt:15}],
safe:[{text:'Cracked the safe! Jackpot!',icon:'💰',pos:true,coins:50},{text:'Wrong combination...',icon:'🔐',pos:false,stat:'happy',amt:-2},{text:'Dog sniffed out the code!',icon:'🐕',pos:true,coins:30,xp:10}],
}},
attic:{name:'Attic',floor:'#8B7355',walls:'#A08060',accent:'#6B5545',
furniture:[
{id:'chest',name:'Old Chest',x:200,y:200,w:80,h:60,color:'#78350F',icon:'📦'},
{id:'cobwebs',name:'Cobwebs',x:500,y:100,w:60,h:60,color:'#D1D5DB',icon:'🕸️'},
{id:'telescope',name:'Telescope',x:600,y:200,w:40,h:80,color:'#4B5563',icon:'🔭'},
{id:'paintings',name:'Old Paintings',x:150,y:80,w:80,h:60,color:'#92400E',icon:'🖼️'},
{id:'rocking',name:'Rocking Chair',x:400,y:350,w:60,h:70,color:'#78350F',icon:'🪑'},
],doors:[{x:788,y:300,w:12,h:60,to:'hallway',sx:30,sy:100}],
interactions:{
chest:[{text:'Found ancient treasure!',icon:'💎',pos:true,coins:40,collectible:true},{text:'Just old clothes...',icon:'👕',pos:false,stat:'happy',amt:-2},{text:'A rare collectible!',icon:'🏆',pos:true,coins:25,xp:15,collectible:true},{text:'Spider jumped out!',icon:'🕷️',pos:false,stat:'happy',amt:-8}],
cobwebs:[{text:'Cleaned the cobwebs!',icon:'🧹',pos:true,stat:'hygiene',amt:5,xp:3},{text:'Spider!',icon:'🕷️',pos:false,stat:'happy',amt:-10}],
telescope:[{text:'Stargazing! Beautiful!',icon:'🌟',pos:true,stat:'happy',amt:15,xp:8},{text:'Saw a shooting star!',icon:'⭐',pos:true,coins:20,stat:'happy',amt:20},{text:'It\'s cloudy...',icon:'☁️',pos:false,stat:'happy',amt:-2}],
paintings:[{text:'A masterpiece! +XP',icon:'🎨',pos:true,xp:12},{text:'Dog knocked a painting!',icon:'🖼️',pos:false,coins:-10},{text:'Found a hidden safe!',icon:'🔐',pos:true,coins:35}],
rocking:[{text:'Rocked peacefully.',icon:'🪑',pos:true,stat:'energy',amt:12,stat2:'happy',amt2:8},{text:'Dog got dizzy watching!',icon:'😵',pos:false,stat:'happy',amt:-3}],
}},
basement:{name:'Basement',floor:'#374151',walls:'#4B5563',accent:'#6B7280',
furniture:[
{id:'washer',name:'Washer',x:150,y:150,w:70,h:60,color:'#D1D5DB',icon:'🫧'},
{id:'workbench',name:'Workbench',x:400,y:120,w:120,h:60,color:'#78350F',icon:'🔧'},
{id:'wine',name:'Wine Rack',x:600,y:150,w:60,h:100,color:'#7C2D12',icon:'🍷'},
{id:'freezer',name:'Freezer',x:200,y:350,w:80,h:60,color:'#D1D5DB',icon:'🧊'},
{id:'boxes',name:'Storage Boxes',x:500,y:380,w:100,h:60,color:'#92400E',icon:'📦'},
],doors:[{x:0,y:300,w:12,h:60,to:'hallway',sx:750,sy:100}],
interactions:{
washer:[{text:'Did the laundry! Clean!',icon:'🫧',pos:true,stat:'hygiene',amt:20},{text:'Dog jumped in the washer!',icon:'🐕',pos:false,stat:'hygiene',amt:15,stat2:'happy',amt2:-5}],
workbench:[{text:'Built a dog toy!',icon:'🔧',pos:true,stat:'happy',amt:15,xp:10},{text:'Ouch! Stubbed your toe!',icon:'🤕',pos:false,stat:'health',amt:-5},{text:'Made something cool!',icon:'⚙️',pos:true,coins:15,xp:8}],
wine:[{text:'Found a vintage bottle! Sold it!',icon:'🍷',pos:true,coins:30},{text:'Dog knocked bottles over!',icon:'💥',pos:false,coins:-20},{text:'Nice collection!',icon:'👀',pos:true,xp:5}],
freezer:[{text:'Found frozen treats!',icon:'🍦',pos:true,stat:'hunger',amt:15,stat2:'happy',amt2:10},{text:'Brain freeze!',icon:'🥶',pos:false,stat:'health',amt:-3}],
boxes:[{text:'Found old toys!',icon:'🧸',pos:true,stat:'happy',amt:12,collectible:true},{text:'Just junk...',icon:'📦',pos:false,stat:'happy',amt:-2},{text:'Hidden coins!',icon:'🪙',pos:true,coins:20}],
}},
pool:{name:'Pool Area',floor:'#C4E0F5',walls:'#87CEEB',accent:'#60A5FA',outdoor:true,
furniture:[
{id:'pool_w',name:'Swimming Pool',x:200,y:180,w:200,h:150,color:'#38BDF8',icon:'🏊'},
{id:'lounger',name:'Sun Lounger',x:500,y:200,w:80,h:40,color:'#F59E0B',icon:'🛏️'},
{id:'umbrella',name:'Umbrella',x:550,y:350,w:60,h:60,color:'#EF4444',icon:'⛱️'},
{id:'bbq',name:'BBQ Grill',x:650,y:150,w:50,h:60,color:'#1F2937',icon:'🍖'},
{id:'diving',name:'Diving Board',x:150,y:150,w:50,h:20,color:'#FFF',icon:'🏊'},
],doors:[{x:0,y:250,w:12,h:60,to:'yard',sx:750,sy:250},{x:370,y:0,w:60,h:12,to:'garage',sx:370,sy:540}],
interactions:{
pool_w:[{text:'Went swimming! Refreshing!',icon:'🏊',pos:true,stat:'happy',amt:20,stat2:'energy',amt2:-10,stat3:'hygiene',amt3:10,sound:'swim'},{text:'Dog did a belly flop!',icon:'💦',pos:true,stat:'happy',amt:15,sound:'splash'},{text:'Got water in your ear!',icon:'😖',pos:false,stat:'health',amt:-3}],
lounger:[{text:'Sunbathing. Relaxed!',icon:'😎',pos:true,stat:'energy',amt:15,stat2:'happy',amt2:10},{text:'Got sunburned!',icon:'🥵',pos:false,stat:'health',amt:-5}],
umbrella:[{text:'Nice shade!',icon:'⛱️',pos:true,stat:'energy',amt:8},{text:'Wind blew it away!',icon:'💨',pos:false,stat:'happy',amt:-3}],
bbq:[{text:'Grilled burgers!',icon:'🍔',pos:true,stat:'hunger',amt:30,stat2:'happy',amt2:12},{text:'Dog stole a burger!',icon:'🐕',pos:true,stat:'hunger',amt:20},{text:'Burnt the burgers!',icon:'🔥',pos:false,stat:'hunger',amt:5}],
diving:[{text:'Cannonball!',icon:'💦',pos:true,stat:'happy',amt:18,stat2:'energy',amt2:-8,sound:'splash'},{text:'Dog jumped after you!',icon:'🐕',pos:true,stat:'happy',amt:15,sound:'bark'},{text:'Belly flop! Ouch!',icon:'😵',pos:false,stat:'health',amt:-5,stat2:'happy',amt2:5}],
}},
garage:{name:'Garage',floor:'#6B7280',walls:'#9CA3AF',accent:'#4B5563',
furniture:[
{id:'car',name:'Car',x:200,y:150,w:200,h:120,color:'#EF4444',icon:'🚗'},
{id:'tools',name:'Tool Wall',x:550,y:100,w:80,h:120,color:'#78350F',icon:'🔧'},
{id:'bike',name:'Bicycle',x:650,y:300,w:50,h:60,color:'#3B82F6',icon:'🚲'},
{id:'shelves',name:'Shelves',x:100,y:100,w:60,h:100,color:'#92400E',icon:'📦'},
{id:'trampoline',name:'Trampoline',x:400,y:380,w:100,h:60,color:'#22C55E',icon:'🤸'},
],doors:[{x:370,y:588,w:60,h:12,to:'pool',sx:370,sy:30}],
interactions:{
car:[{text:'Pretend road trip! Beep beep!',icon:'🚗',pos:true,stat:'happy',amt:15,xp:5},{text:'Dog jumped in the front seat!',icon:'🐕',pos:true,stat:'happy',amt:12},{text:'Found coins in the cup holder!',icon:'🪙',pos:true,coins:15},{text:'Oops, honked the horn!',icon:'📯',pos:false,stat:'happy',amt:-3,sound:'bark'}],
tools:[{text:'Fixed something! +XP',icon:'🔧',pos:true,xp:15,coins:10},{text:'Dropped a wrench!',icon:'🔧',pos:false,stat:'health',amt:-3},{text:'Built a cool shelf!',icon:'🪚',pos:true,xp:12}],
bike:[{text:'Went for a bike ride!',icon:'🚲',pos:true,stat:'energy',amt:-10,stat2:'happy',amt2:15,xp:8},{text:'Dog ran alongside!',icon:'🐕',pos:true,stat:'happy',amt:10,stat2:'energy',amt2:-5}],
shelves:[{text:'Organized the shelves!',icon:'📦',pos:true,xp:5,coins:8},{text:'Found a rare collectible!',icon:'🏆',pos:true,coins:35,collectible:true},{text:'Everything fell off!',icon:'💥',pos:false,stat:'hygiene',amt:-5}],
trampoline:[{text:'Bouncing! Wheee!',icon:'🤸',pos:true,stat:'happy',amt:20,stat2:'energy',amt2:-10},{text:'Dog tried to bounce too!',icon:'🐕',pos:true,stat:'happy',amt:15,sound:'yip'},{text:'Fell off! Ouch!',icon:'🤕',pos:false,stat:'health',amt:-8,stat2:'happy',amt2:5}],
}},
};
const ROOM_ORDER=['living','kitchen','hallway','bedroom','bathroom','yard','gameroom','study','attic','basement','pool','garage'];

// ═══ STATE ═══
let S=defState();
function defState(){return{
name:'Buddy',breedId:'golden',
hunger:80,happy:80,energy:80,hygiene:80,health:100,
coins:50,xp:0,level:1,room:'living',
humanX:400,humanY:400,dogX:350,dogY:420,
controlling:'human',
ownedAcc:[],equippedAcc:[],ownedToys:['ball'],
tricksLearned:[],
pets:0,feeds:0,grooms:0,vets:0,roomVisits:0,tricksDone:0,
coinsTotal:0,interactions:0,switches:0,sprints:0,
photos:0,negEvents:0,posEvents:0,mgPlayed:0,
streak:0,lastLogin:null,playtime:0,
foodsTried:[],visitedRooms:['living'],
maxHappy:false,achUnlocked:[],
collectibles:[],collectFound:0,
// Garden
garden:[],plantsHarvested:0,
// Quests
quests:[],questsDone:0,questDate:null,questSnap:null,
// Cat
hasCat:false,catX:0,catY:0,catRoom:'',
// NPC
npcMet:0,activeNPC:null,npcTimer:0,
// Weather
weather:'sunny',weatherSeen:['sunny'],dayPhase:'day',
// Mini-game
inMinigame:false,
created:Date.now(),session:Date.now(),sleeping:false,
}}

// ═══ CANVAS ═══
const canvas=document.getElementById('game-canvas');
const ctx=canvas.getContext('2d');
function resize(){canvas.width=window.innerWidth*devicePixelRatio;canvas.height=window.innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
resize();window.addEventListener('resize',resize);
const $=id=>document.getElementById(id);

// ═══ PARTICLES ═══
let particles=[];
function spawnP(x,y,emoji,count=3){for(let i=0;i<count;i++)particles.push({x,y,emoji,vx:(Math.random()-.5)*60,vy:-40-Math.random()*40,life:1})}
function updateParticles(dt){particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=50*dt;p.life-=dt});particles=particles.filter(p=>p.life>0)}
function drawParticles(scale){particles.forEach(p=>{ctx.globalAlpha=p.life;ctx.font='14px sans-serif';ctx.fillText(p.emoji,p.x,p.y);ctx.globalAlpha=1})}

// ═══ BREED SELECT ═══
function initBreeds(){
const grid=$('breed-grid');
BREEDS.forEach((b,i)=>{
const card=document.createElement('div');card.className='breed-card'+(i===0?' selected':'');card.dataset.breed=b.id;
const c=document.createElement('canvas');c.width=80;c.height=70;
drawBreedPreview(c.getContext('2d'),b,40,38);
card.appendChild(c);
const label=document.createElement('div');label.className='breed-label';label.textContent=b.name;card.appendChild(label);
card.onclick=()=>{grid.querySelectorAll('.breed-card').forEach(c=>c.classList.remove('selected'));card.classList.add('selected');S.breedId=b.id};
grid.appendChild(card);
})}
function drawBreedPreview(c,b,cx,cy){
const s=1.8;
c.fillStyle=b.body;c.beginPath();c.ellipse(cx,cy+4,18*s,14*s,0,0,Math.PI*2);c.fill();
c.fillStyle=b.belly;c.beginPath();c.ellipse(cx,cy+8,12*s,8*s,0,0,Math.PI*2);c.fill();
c.fillStyle=b.body;c.beginPath();c.arc(cx,cy-14*s,12*s,0,Math.PI*2);c.fill();
c.fillStyle=b.ear;
if(b.earType==='pointed'){[[-10,-12],[10,-12]].forEach(([ox,oy])=>{c.beginPath();c.moveTo(cx+(ox-4)*s,cy+oy*s);c.lineTo(cx+ox*s,cy+(oy-10)*s);c.lineTo(cx+(ox+4)*s,cy+oy*s);c.closePath();c.fill()})}
else if(b.earType==='big'){[[-11,-8],[11,-8]].forEach(([ox,oy])=>{c.beginPath();c.ellipse(cx+ox*s,cy+oy*s,5*s,10*s,ox<0?-.3:.3,0,Math.PI*2);c.fill()})}
else if(b.earType==='small'){[[-9,-12],[9,-12]].forEach(([ox,oy])=>{c.beginPath();c.ellipse(cx+ox*s,cy+oy*s,4*s,5*s,ox<0?-.2:.2,0,Math.PI*2);c.fill()})}
else{[[-10,-10],[10,-10]].forEach(([ox,oy])=>{c.beginPath();c.ellipse(cx+ox*s,cy+oy*s,5*s,9*s,ox<0?-.3:.3,0,Math.PI*2);c.fill()})}
if(b.spots){c.fillStyle='#1F2937';[[-6,0,3],[5,-3,2],[8,6,2.5],[-4,8,2],[-9,4,2]].forEach(([x,y,r])=>{c.beginPath();c.arc(cx+x*s,cy+y*s,r*s,0,Math.PI*2);c.fill()})}
c.fillStyle=b.belly;c.beginPath();c.ellipse(cx,cy-10*s,7*s,5*s,0,0,Math.PI*2);c.fill();
c.fillStyle='#FFF';[[-4,-16],[4,-16]].forEach(([ox,oy])=>{c.beginPath();c.arc(cx+ox*s,cy+oy*s,3*s,0,Math.PI*2);c.fill()});
c.fillStyle='#1F2937';[[-4,-16],[4,-16]].forEach(([ox,oy])=>{c.beginPath();c.arc(cx+ox*s+.5,cy+oy*s+.5,1.8*s,0,Math.PI*2);c.fill()});
c.fillStyle='#1F2937';c.beginPath();c.ellipse(cx,cy-8*s,2.5*s,1.5*s,0,0,Math.PI*2);c.fill();
c.strokeStyle='#1F2937';c.lineWidth=1;c.lineCap='round';c.beginPath();c.moveTo(cx-3*s,cy-6*s);c.quadraticCurveTo(cx,cy-4*s,cx+3*s,cy-6*s);c.stroke();
c.fillStyle=b.body;[[-8,16],[-3,17],[3,17],[8,16]].forEach(([ox,oy])=>{c.beginPath();c.roundRect(cx+ox*s-3*s,cy+oy*s-2,6*s,10*s,[0,0,2,2]);c.fill()});
c.fillStyle=darken(b.body,.15);[[-8,25],[-3,26],[3,26],[8,25]].forEach(([ox,oy])=>{c.beginPath();c.ellipse(cx+ox*s,cy+oy*s,3.5*s,2*s,0,0,Math.PI*2);c.fill()});
c.strokeStyle=b.body;c.lineWidth=3*s;c.lineCap='round';c.beginPath();c.moveTo(cx-16*s,cy);c.quadraticCurveTo(cx-22*s,cy-10*s,cx-18*s,cy-16*s);c.stroke();
}

// ═══ START ═══
function applyCheat(){
S.coins=99999;S.coinsTotal=99999;S.level=20;S.xp=0;
S.hunger=100;S.happy=100;S.energy=100;S.hygiene=100;S.health=100;
S.maxHappy=true;
S.ownedAcc=ACCESSORIES.map(a=>a.id);S.ownedToys=TOYS.map(t=>t.id);
S.tricksLearned=TRICKS.map(t=>t.id);
S.hasCat=true;S.catRoom='living';S.catX=430;S.catY=420;
S.visitedRooms=[...ROOM_ORDER];
S.foodsTried=FOODS.map(f=>f.id);
S.collectibles=COLLECTIBLES.map(c=>c.id);S.collectFound=COLLECTIBLES.length;
S.weatherSeen=[...WEATHERS];
}
function startGame(){
S.name=$('dog-name').value.trim()||'Buddy';
const cheat=($('cheat-code')?.value||'').trim().toLowerCase();
if(cheat==='srg2')applyCheat();
$('intro-screen').classList.add('hidden');$('game-screen').classList.remove('hidden');resize();updateHUD();checkDaily();generateQuests();requestAnimationFrame(loop);setInterval(tickStats,5000);setInterval(()=>{S.playtime++;autoSave()},60000);setInterval(tickWeather,30000);setInterval(tickNPC,20000);setInterval(tickGarden,10000);toast('WASD to move, E to interact, Tab to switch, Shift to sprint!')}

// ═══ INPUT ═══
const keys={};
document.addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key==='e'||e.key==='E'){if(S.inMinigame)return;tryInteract()}if(e.key==='Tab'){e.preventDefault();switchControl()}if(e.key==='f'||e.key==='F')tryPetDog()});
document.addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});
document.querySelectorAll('.dpad-btn').forEach(b=>{const dir=b.dataset.dir;if(dir==='interact'){b.onclick=()=>tryInteract();return}const km={up:'w',down:'s',left:'a',right:'d'};b.addEventListener('touchstart',e=>{e.preventDefault();keys[km[dir]]=true});b.addEventListener('touchend',e=>{e.preventDefault();keys[km[dir]]=false});b.addEventListener('mousedown',()=>{keys[km[dir]]=true});b.addEventListener('mouseup',()=>{keys[km[dir]]=false})});
let tapTarget=null;
canvas.addEventListener('click',e=>{ea();if(S.inMinigame)return;const r=canvas.getBoundingClientRect();const scaleX=window.innerWidth/RW,scaleY=window.innerHeight/RH,scale=Math.max(scaleX,scaleY);const offX=(window.innerWidth-RW*scale)/2,offY=(window.innerHeight-RH*scale)/2;const wx=(e.clientX-offX)/scale,wy=(e.clientY-offY)/scale;const room=ROOMS[S.room];for(const f of room.furniture){if(wx>f.x&&wx<f.x+f.w&&wy>f.y&&wy<f.y+f.h){tapTarget={x:f.x+f.w/2,y:f.y+f.h/2+30,obj:f.id};return}}tapTarget={x:wx,y:wy,obj:null}});
function switchControl(){S.controlling=S.controlling==='human'?'dog':'human';S.switches++;$('control-icon').textContent=S.controlling==='human'?'🧑':'🐕';$('control-label').textContent=S.controlling==='human'?'You':S.name;SFX.click();checkAch()}
function tryPetDog(){if(S.controlling!=='human')return;const dx=S.humanX-S.dogX,dy=S.humanY-S.dogY;if(Math.sqrt(dx*dx+dy*dy)<60){S.pets++;modStat('happy',5);addXp(2);addCoins(1);SFX.happy();spawnP(S.dogX,S.dogY-20,'❤️',3);toast('Petted '+S.name+'!');checkAch()}}

// ═══ WEATHER ═══
const WEATHERS=['sunny','cloudy','rain','snow','storm'];
function tickWeather(){const w=WEATHERS[Math.floor(Math.random()*WEATHERS.length)];S.weather=w;if(!S.weatherSeen.includes(w))S.weatherSeen.push(w);if(w==='storm'&&Math.random()<.3)SFX.thunder();const h=new Date().getHours();S.dayPhase=h>=6&&h<17?'day':h>=17&&h<20?'sunset':'night';checkAch()}

// ═══ NPC VISITORS ═══
function tickNPC(){if(S.activeNPC||Math.random()>.2)return;const npc=NPC_TYPES[Math.floor(Math.random()*NPC_TYPES.length)];S.activeNPC={...npc,x:100+Math.random()*600,y:200+Math.random()*300,room:S.room,timer:30};toast(`${npc.name} is visiting! ${npc.emoji}`)}

// ═══ GARDEN ═══
function tickGarden(){S.garden.forEach(p=>{if(!p.ready){p.progress++;if(p.progress>=p.growTime){p.ready=true;toast(`Your ${p.name} is ready to harvest! 🌱`)}}})}

// ═══ QUESTS ═══
function generateQuests(){const today=new Date().toDateString();if(S.questDate===today)return;S.questDate=today;const shuffled=[...QUEST_TEMPLATES].sort(()=>Math.random()-.5);S.quests=shuffled.slice(0,3).map(q=>({...q,done:false}));S.questSnap={pets:S.pets,feeds:S.feeds,roomVisits:S.roomVisits,interactions:S.interactions,tricksDone:S.tricksDone,grooms:S.grooms,collectFound:S.collectFound,switches:S.switches,coinsTotal:S.coinsTotal,mgPlayed:S.mgPlayed}}
function checkQuests(){if(!S.questSnap)return;S.quests.forEach(q=>{if(!q.done&&q.check(S,S.questSnap)){q.done=true;S.questsDone++;addCoins(q.reward);SFX.quest();toast(`Quest complete! +${q.reward} coins`);checkAch()}})}

// ═══ GAME LOOP ═══
let lastT=0,animT=0,dogWagT=0,dogBreathT=0;
let nearObj=null,stepTimer=0,resultPopup=null;
function loop(t){
const dt=Math.min((t-lastT)/1000,.05);lastT=t;animT+=dt;dogWagT+=dt*5;dogBreathT+=dt*2;
if(S.inMinigame){requestAnimationFrame(loop);return}
const spd=(keys.shift?220:150)*dt;
if(keys.shift&&(keys.w||keys.a||keys.s||keys.d))S.sprints++;
let ax=S.controlling==='human'?'humanX':'dogX',ay=S.controlling==='human'?'humanY':'dogY';
let moved=false;
if(tapTarget){const dx=tapTarget.x-S[ax],dy=tapTarget.y-S[ay],dist=Math.sqrt(dx*dx+dy*dy);if(dist>8){S[ax]+=dx/dist*spd*1.2;S[ay]+=dy/dist*spd*1.2;moved=true}else{if(tapTarget.obj)tryInteract(tapTarget.obj);tapTarget=null}}
if(keys.w||keys.arrowup){S[ay]-=spd;moved=true}if(keys.s||keys.arrowdown){S[ay]+=spd;moved=true}
if(keys.a||keys.arrowleft){S[ax]-=spd;moved=true}if(keys.d||keys.arrowright){S[ax]+=spd;moved=true}
S[ax]=clamp(S[ax],20,RW-20);S[ay]=clamp(S[ay],20,RH-20);
if(moved){stepTimer+=dt;if(stepTimer>.3){SFX.step();stepTimer=0}}
if(S.controlling==='human'&&!S.sleeping){const dx=S.humanX-S.dogX,dy=S.humanY-S.dogY,dist=Math.sqrt(dx*dx+dy*dy);if(dist>50){S.dogX+=dx/dist*spd*.7;S.dogY+=dy/dist*spd*.7}}
// Cat follows loosely
if(S.hasCat&&S.catRoom===S.room){const dx=S.humanX-S.catX+50,dy=S.humanY-S.catY;const dist=Math.sqrt(dx*dx+dy*dy);if(dist>80){S.catX+=dx/dist*spd*.4;S.catY+=dy/dist*spd*.4}}
// Furniture collision
const room=ROOMS[S.room];
room.furniture.forEach(f=>{[['humanX','humanY'],['dogX','dogY']].forEach(([px,py])=>{if(S[px]>f.x-10&&S[px]<f.x+f.w+10&&S[py]>f.y-10&&S[py]<f.y+f.h+10){const esc=[{d:S[px]-(f.x-10),dx:-1,dy:0},{d:(f.x+f.w+10)-S[px],dx:1,dy:0},{d:S[py]-(f.y-10),dx:0,dy:-1},{d:(f.y+f.h+10)-S[py],dx:0,dy:1}];esc.sort((a,b)=>a.d-b.d);const e=esc[0];if(e.d<12){S[px]+=e.dx*2;S[py]+=e.dy*2}}})});
// Door transitions
const cx=S[ax],cy=S[ay];room.doors.forEach(d=>{if(cx>d.x&&cx<d.x+d.w+20&&cy>d.y&&cy<d.y+d.h+20)changeRoom(d.to,d.sx,d.sy)});
// Near object
nearObj=null;const pcx=S.controlling==='human'?S.humanX:S.dogX,pcy=S.controlling==='human'?S.humanY:S.dogY;
room.furniture.forEach(f=>{const fx=f.x+f.w/2,fy=f.y+f.h/2;if(Math.sqrt((pcx-fx)**2+(pcy-fy)**2)<70)nearObj=f.id});
// NPC proximity
if(S.activeNPC&&S.activeNPC.room===S.room){const dx=pcx-S.activeNPC.x,dy=pcy-S.activeNPC.y;if(Math.sqrt(dx*dx+dy*dy)<60&&!S.activeNPC.met){S.activeNPC.met=true;S.npcMet++;const n=S.activeNPC;if(n.coins)addCoins(n.coins);if(n.happy)modStat('happy',n.happy);if(n.hunger)modStat('hunger',n.hunger);if(n.hp)modStat('health',n.hp);if(n.energy)modStat('energy',n.energy);if(n.xp)addXp(n.xp);SFX.good();showResult(n.emoji,n.msg,true);checkAch()}}
if(S.activeNPC){S.activeNPC.timer-=dt;if(S.activeNPC.timer<=0)S.activeNPC=null}
// Prompt
const prompt=$('interact-prompt');
if(nearObj&&!resultPopup){prompt.classList.remove('hidden');const furn=room.furniture.find(f=>f.id===nearObj);$('interact-text').textContent=`Press E — ${furn?.name||nearObj}`}else prompt.classList.add('hidden');
if(resultPopup){resultPopup.timer-=dt;if(resultPopup.timer<=0){resultPopup=null;$('result-popup').classList.add('hidden')}}
updateParticles(dt);
render(window.innerWidth,window.innerHeight);
checkQuests();
requestAnimationFrame(loop)}

// ═══ RENDER ═══
function render(vw,vh){
const scaleX=vw/RW,scaleY=vh/RH,scale=Math.max(scaleX,scaleY);
ctx.save();ctx.clearRect(0,0,vw,vh);
const offX=(vw-RW*scale)/2,offY=(vh-RH*scale)/2;
ctx.translate(offX,offY);ctx.scale(scale,scale);
const room=ROOMS[S.room];
drawRoom(room);
room.doors.forEach(d=>{ctx.fillStyle='rgba(99,102,241,0.3)';ctx.fillRect(d.x,d.y,d.w<15?15:d.w,d.h<15?15:d.h);ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='12px sans-serif';ctx.textAlign='center';if(d.y<=5)ctx.fillText('▲',d.x+(d.w<15?7:d.w/2),d.y+12);else if(d.y>500)ctx.fillText('▼',d.x+d.w/2,d.y-2);else if(d.x<=5)ctx.fillText('◀',d.x+10,d.y+d.h/2+4);else ctx.fillText('▶',d.x-2,d.y+d.h/2+4)});
room.furniture.forEach(f=>drawFurniture(f,f.id===nearObj,room));
// Draw garden plants
if(S.room==='yard')drawGardenPlants();
// Sort entities by Y for proper layering
const ents=[{t:'human',x:S.humanX,y:S.humanY},{t:'dog',x:S.dogX,y:S.dogY}];
if(S.hasCat&&S.catRoom===S.room)ents.push({t:'cat',x:S.catX,y:S.catY});
if(S.activeNPC&&S.activeNPC.room===S.room)ents.push({t:'npc',x:S.activeNPC.x,y:S.activeNPC.y});
ents.sort((a,b)=>a.y-b.y);
ents.forEach(e=>{if(e.t==='human')drawHuman(e.x,e.y);else if(e.t==='dog')drawDog(e.x,e.y);else if(e.t==='cat')drawCat(e.x,e.y);else if(e.t==='npc')drawNPC(e.x,e.y)});
// Weather overlay
drawWeather();
drawParticles();
// Dog emotion
drawDogEmotion();
ctx.restore()}

function drawRoom(room){
ctx.fillStyle=room.floor;ctx.fillRect(0,0,RW,RH);
if(!room.outdoor){ctx.strokeStyle='rgba(0,0,0,0.03)';ctx.lineWidth=1;for(let x=0;x<RW;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,RH);ctx.stroke()}for(let y=0;y<RH;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(RW,y);ctx.stroke()}ctx.fillStyle=room.walls;ctx.fillRect(0,0,RW,70);ctx.fillStyle=room.accent;ctx.fillRect(0,65,RW,5);ctx.fillStyle='rgba(0,0,0,0.03)';ctx.fillRect(0,0,8,RH);ctx.fillRect(RW-8,0,8,RH)}
else{const grd=ctx.createLinearGradient(0,0,0,70);const sky1=S.dayPhase==='night'?'#0a0a2e':S.dayPhase==='sunset'?'#ff7e5f':'#87CEEB';const sky2=S.dayPhase==='night'?'#1a1a4e':S.dayPhase==='sunset'?'#feb47b':room.walls;grd.addColorStop(0,sky1);grd.addColorStop(1,sky2);ctx.fillStyle=grd;ctx.fillRect(0,0,RW,80);
if(S.dayPhase==='day'&&S.weather==='sunny'){ctx.fillStyle='#FFD700';ctx.beginPath();ctx.arc(RW-60,35,18,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(255,215,0,0.15)';ctx.beginPath();ctx.arc(RW-60,35,30,0,Math.PI*2);ctx.fill()}
if(S.dayPhase==='night'){for(let i=0;i<12;i++){ctx.fillStyle=`rgba(255,255,255,${.4+Math.random()*.6})`;ctx.beginPath();ctx.arc(30+Math.random()*(RW-60),10+Math.random()*50,1,0,Math.PI*2);ctx.fill()}}
ctx.fillStyle='#D4A574';for(let x=0;x<RW;x+=50)ctx.fillRect(x,60,8,30);ctx.fillRect(0,65,RW,5);ctx.fillRect(0,85,RW,3);
ctx.fillStyle='rgba(0,100,0,0.06)';for(let i=0;i<40;i++){const gx=Math.sin(i*73.7)*400+400,gy=Math.cos(i*127.3)*250+350;ctx.fillRect(gx,gy,2,6)}
}}

function drawWeather(){
if(S.weather==='rain'){ctx.strokeStyle='rgba(100,150,255,0.4)';ctx.lineWidth=1;for(let i=0;i<40;i++){const rx=(Math.random()*RW+animT*80)%RW,ry=Math.random()*RH;ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-2,ry+8);ctx.stroke()}}
else if(S.weather==='snow'){ctx.fillStyle='rgba(255,255,255,0.7)';for(let i=0;i<25;i++){const sx=(Math.sin(i*37+animT)*200+400)%RW,sy=(i*43+animT*30)%RH;ctx.beginPath();ctx.arc(sx,sy,1.5+Math.random(),0,Math.PI*2);ctx.fill()}}
else if(S.weather==='storm'){ctx.fillStyle=`rgba(0,0,0,${.05+Math.sin(animT*8)*.03})`;ctx.fillRect(0,0,RW,RH);ctx.strokeStyle='rgba(100,150,255,0.5)';ctx.lineWidth=1.5;for(let i=0;i<50;i++){const rx=(Math.random()*RW+animT*120)%RW,ry=Math.random()*RH;ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-3,ry+12);ctx.stroke()}
if(Math.random()<.002){ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fillRect(0,0,RW,RH)}}
if(S.dayPhase==='night'){ctx.fillStyle='rgba(0,0,30,0.25)';ctx.fillRect(0,0,RW,RH)}
else if(S.dayPhase==='sunset'){ctx.fillStyle='rgba(255,100,50,0.06)';ctx.fillRect(0,0,RW,RH)}
}

function drawDogEmotion(){
if(S.sleeping)return;
let emoji='';
if(S.happy>85)emoji='😍';else if(S.happy>60)emoji='😊';else if(S.happy>35)emoji='😐';else if(S.happy>15)emoji='😢';else emoji='😭';
if(S.hunger<20)emoji='🤤';if(S.energy<15)emoji='😴';if(S.health<20)emoji='🤒';
const bobY=Math.sin(animT*2)*3;
ctx.font='12px sans-serif';ctx.textAlign='center';
ctx.fillText(emoji,S.dogX,S.dogY-25+bobY);
}

function drawFurniture(f,highlight,room){
ctx.save();if(highlight){ctx.shadowColor='rgba(99,102,241,0.5)';ctx.shadowBlur=15}
ctx.fillStyle=f.color;
if(f.id==='rug'){ctx.fillStyle='rgba(220,38,38,0.3)';ctx.beginPath();ctx.ellipse(f.x+f.w/2,f.y+f.h/2,f.w/2,f.h/2,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(220,38,38,0.4)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(f.x+f.w/2,f.y+f.h/2,f.w/2-10,f.h/2-6,0,0,Math.PI*2);ctx.stroke()}
else if(f.id==='pond'){ctx.fillStyle='rgba(56,189,248,0.5)';ctx.beginPath();ctx.ellipse(f.x+f.w/2,f.y+f.h/2,f.w/2,f.h/2,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(f.x+f.w/2-10,f.y+f.h/2-5,15,8,.3,0,Math.PI*2);ctx.stroke()}
else if(f.id==='pool_w'){ctx.fillStyle='rgba(56,189,248,0.6)';ctx.beginPath();ctx.roundRect(f.x,f.y,f.w,f.h,12);ctx.fill();ctx.strokeStyle='#FFF';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(f.x+3,f.y+3,f.w-6,f.h-6,10);ctx.stroke();const waveY=Math.sin(animT*2)*3;ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=1;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(f.x+20,f.y+40+i*35+waveY);ctx.quadraticCurveTo(f.x+f.w/2,f.y+30+i*35-waveY,f.x+f.w-20,f.y+40+i*35+waveY);ctx.stroke()}}
else if(f.id==='tree'){ctx.fillStyle='#92400E';ctx.fillRect(f.x+f.w/2-8,f.y+f.h/2,16,f.h/2);ctx.fillStyle='#15803D';ctx.beginPath();ctx.arc(f.x+f.w/2,f.y+f.h/3,35,0,Math.PI*2);ctx.fill();ctx.fillStyle='#22C55E';ctx.beginPath();ctx.arc(f.x+f.w/2+10,f.y+f.h/3-8,22,0,Math.PI*2);ctx.fill()}
else if(f.id==='bed'){ctx.fillStyle='#8B9DC3';ctx.beginPath();ctx.roundRect(f.x,f.y,f.w,f.h,8);ctx.fill();ctx.fillStyle='#FFF';ctx.beginPath();ctx.roundRect(f.x+10,f.y+10,40,25,6);ctx.fill();ctx.beginPath();ctx.roundRect(f.x+60,f.y+10,40,25,6);ctx.fill();ctx.fillStyle=f.color;ctx.beginPath();ctx.roundRect(f.x+5,f.y+45,f.w-10,f.h-55,6);ctx.fill()}
else if(f.id==='bathtub'){ctx.fillStyle='#E5E7EB';ctx.beginPath();ctx.roundRect(f.x,f.y,f.w,f.h,12);ctx.fill();ctx.fillStyle='rgba(56,189,248,0.3)';ctx.beginPath();ctx.roundRect(f.x+8,f.y+8,f.w-16,f.h-16,8);ctx.fill()}
else if(f.id==='table'||f.id==='desk'||f.id==='counter'||f.id==='workbench'){ctx.beginPath();ctx.roundRect(f.x,f.y,f.w,f.h,4);ctx.fill();ctx.fillStyle=darken(f.color,.15);ctx.fillRect(f.x+5,f.y+f.h,4,15);ctx.fillRect(f.x+f.w-9,f.y+f.h,4,15)}
else if(f.id==='dogbed'){ctx.fillStyle=f.color;ctx.beginPath();ctx.ellipse(f.x+f.w/2,f.y+f.h/2,f.w/2,f.h/2,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=darken(f.color,.15);ctx.beginPath();ctx.ellipse(f.x+f.w/2,f.y+f.h/2,f.w/2-8,f.h/2-6,0,0,Math.PI*2);ctx.fill()}
else if(f.id==='doghouse'){ctx.fillStyle='#92400E';ctx.beginPath();ctx.roundRect(f.x,f.y+20,f.w,f.h-20,4);ctx.fill();ctx.fillStyle='#7C2D12';ctx.beginPath();ctx.moveTo(f.x-5,f.y+22);ctx.lineTo(f.x+f.w/2,f.y-5);ctx.lineTo(f.x+f.w+5,f.y+22);ctx.closePath();ctx.fill();ctx.fillStyle='#1F2937';ctx.beginPath();ctx.arc(f.x+f.w/2,f.y+f.h-12,12,0,Math.PI*2);ctx.fill()}
else if(f.id==='stairs'){for(let i=0;i<6;i++){ctx.fillStyle=i%2?'#A78B6E':'#C4A882';ctx.fillRect(f.x,f.y+i*(f.h/6),f.w,f.h/6)}}
else if(f.id==='arcade'){ctx.fillStyle='#7C3AED';ctx.beginPath();ctx.roundRect(f.x,f.y,f.w,f.h,6);ctx.fill();ctx.fillStyle='#1F2937';ctx.fillRect(f.x+8,f.y+8,f.w-16,f.h/2-8);ctx.fillStyle='#22C55E';if(Math.sin(animT*3)>.5)ctx.fillRect(f.x+15,f.y+15,f.w-30,f.h/2-22)}
else if(f.id==='ball_y'){ctx.fillStyle='#84CC16';ctx.beginPath();ctx.arc(f.x+f.w/2,f.y+f.h/2,f.w/2,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#FFF';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(f.x+f.w/2,f.y+f.h/2,f.w/2-3,.5,2.2);ctx.stroke()}
else if(f.id==='hydrant'){ctx.fillStyle='#EF4444';ctx.fillRect(f.x+5,f.y+10,f.w-10,f.h-10);ctx.fillRect(f.x,f.y+18,f.w,8);ctx.beginPath();ctx.arc(f.x+f.w/2,f.y+12,8,0,Math.PI*2);ctx.fill()}
else if(f.id==='car'){ctx.fillStyle=f.color;ctx.beginPath();ctx.roundRect(f.x,f.y+30,f.w,f.h-30,10);ctx.fill();ctx.fillStyle=darken(f.color,.15);ctx.beginPath();ctx.roundRect(f.x+20,f.y,f.w-40,50,8);ctx.fill();ctx.fillStyle='rgba(150,200,255,0.4)';ctx.beginPath();ctx.roundRect(f.x+25,f.y+5,f.w-50,35,6);ctx.fill();ctx.fillStyle='#1F2937';[[f.x+15,f.y+f.h-15],[f.x+f.w-25,f.y+f.h-15]].forEach(([wx,wy])=>{ctx.beginPath();ctx.arc(wx,wy,12,0,Math.PI*2);ctx.fill()})}
else if(f.id==='trampoline'){ctx.fillStyle='#1F2937';ctx.beginPath();ctx.ellipse(f.x+f.w/2,f.y+f.h,f.w/2,10,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=f.color;ctx.beginPath();ctx.ellipse(f.x+f.w/2,f.y+f.h/2,f.w/2,f.h/3,0,0,Math.PI*2);ctx.fill()}
else if(f.id==='pool_t'){ctx.fillStyle='#15803D';ctx.beginPath();ctx.roundRect(f.x,f.y,f.w,f.h,8);ctx.fill();ctx.fillStyle='#166534';ctx.beginPath();ctx.roundRect(f.x+6,f.y+6,f.w-12,f.h-12,6);ctx.fill();ctx.fillStyle='#DC2626';ctx.beginPath();ctx.arc(f.x+f.w/2,f.y+f.h/2,4,0,Math.PI*2);ctx.fill();ctx.fillStyle='#FFF';ctx.beginPath();ctx.arc(f.x+f.w/2+15,f.y+f.h/2+5,4,0,Math.PI*2);ctx.fill()}
else{ctx.beginPath();ctx.roundRect(f.x,f.y,f.w,f.h,6);ctx.fill()}
if(f.icon){ctx.font='16px sans-serif';ctx.textAlign='center';ctx.fillText(f.icon,f.x+f.w/2,f.y-4)}
if(highlight){ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillStyle='#FFF';ctx.fillText(f.name,f.x+f.w/2,f.y-16)}
ctx.restore()}

function drawGardenPlants(){
S.garden.forEach((p,i)=>{
const x=520+((i%3)*30),y=150+Math.floor(i/3)*25;
ctx.font=p.ready?'14px sans-serif':'10px sans-serif';ctx.textAlign='center';
ctx.fillText(p.ready?p.icon:'🌱',x,y);
})}

function drawHuman(x,y){
const active=S.controlling==='human';
ctx.save();ctx.translate(x,y);
ctx.fillStyle='rgba(0,0,0,0.1)';ctx.beginPath();ctx.ellipse(0,12,12,5,0,0,Math.PI*2);ctx.fill();
if(active){ctx.strokeStyle='rgba(99,102,241,0.5)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,20,0,Math.PI*2);ctx.stroke()}
ctx.fillStyle='#3B82F6';ctx.beginPath();ctx.roundRect(-8,-2,16,16,[0,0,3,3]);ctx.fill();
ctx.fillStyle='#1E3A5F';ctx.fillRect(-6,14,5,8);ctx.fillRect(1,14,5,8);
ctx.fillStyle='#F5D5C8';ctx.fillRect(-12,0,5,10);ctx.fillRect(7,0,5,10);
ctx.fillStyle='#F5D5C8';ctx.beginPath();ctx.arc(0,-10,9,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#4A2C17';ctx.beginPath();ctx.arc(0,-14,8,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(-8,-14,16,4);
ctx.fillStyle='#1F2937';ctx.fillRect(-4,-11,2,2);ctx.fillRect(2,-11,2,2);
ctx.strokeStyle='#1F2937';ctx.lineWidth=1;ctx.lineCap='round';ctx.beginPath();ctx.arc(0,-7,3,.1,Math.PI-.1);ctx.stroke();
ctx.restore()}

function drawDog(x,y){
const breed=BREEDS.find(b=>b.id===S.breedId)||BREEDS[0];const active=S.controlling==='dog';const sz=breed.sz;const bOff=Math.sin(dogBreathT)*1;
ctx.save();ctx.translate(x,y+bOff);
ctx.fillStyle='rgba(0,0,0,0.1)';ctx.beginPath();ctx.ellipse(0,14*sz,14*sz,5*sz,0,0,Math.PI*2);ctx.fill();
if(active){ctx.strokeStyle='rgba(236,72,153,0.5)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,22*sz,0,Math.PI*2);ctx.stroke()}
// Back acc
S.equippedAcc.forEach(id=>{const ac=ACCESSORIES.find(a=>a.id===id);if(!ac||ac.slot!=='back')return;ctx.fillStyle=ac.color;if(id==='cape'){ctx.beginPath();ctx.moveTo(-8*sz,-4*sz);ctx.quadraticCurveTo(-14*sz,10*sz,-10*sz,18*sz);ctx.lineTo(10*sz,18*sz);ctx.quadraticCurveTo(14*sz,10*sz,8*sz,-4*sz);ctx.closePath();ctx.fill()}else if(id==='wings'){ctx.fillStyle='rgba(255,255,255,0.7)';ctx.beginPath();ctx.moveTo(-6*sz,-2*sz);ctx.quadraticCurveTo(-22*sz,-12*sz,-18*sz,2*sz);ctx.quadraticCurveTo(-12*sz,8*sz,-6*sz,2*sz);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(6*sz,-2*sz);ctx.quadraticCurveTo(22*sz,-12*sz,18*sz,2*sz);ctx.quadraticCurveTo(12*sz,8*sz,6*sz,2*sz);ctx.closePath();ctx.fill()}});
// Tail
const wag=Math.sin(dogWagT)*.4*(S.happy/100);ctx.save();ctx.translate(-12*sz,-4*sz);ctx.rotate(-.6+wag);ctx.fillStyle=breed.body;ctx.beginPath();ctx.ellipse(0,-8*sz,3*sz,10*sz,0,0,Math.PI*2);ctx.fill();ctx.restore();
// Body
ctx.fillStyle=breed.body;ctx.beginPath();ctx.ellipse(0,4*sz,16*sz,12*sz,0,0,Math.PI*2);ctx.fill();
// Body acc
S.equippedAcc.forEach(id=>{const ac=ACCESSORIES.find(a=>a.id===id);if(!ac||ac.slot!=='body')return;ctx.fillStyle=ac.color;ctx.beginPath();ctx.ellipse(0,4*sz,16*sz,12*sz,0,0,Math.PI*2);ctx.fill();if(id==='sweater'){ctx.strokeStyle=lighten(ac.color,.3);ctx.lineWidth=1;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(-14*sz,(4+i*4)*sz);ctx.lineTo(14*sz,(4+i*4)*sz);ctx.stroke()}}});
ctx.fillStyle=breed.belly;ctx.beginPath();ctx.ellipse(0,8*sz,10*sz,6*sz,0,0,Math.PI*2);ctx.fill();
if(breed.spots){ctx.fillStyle='#1F2937';[[-5,0,2.5],[5,2,2],[8,6,1.5],[-7,5,2],[-2,8,1.5]].forEach(([ox,oy,r])=>{ctx.beginPath();ctx.arc(ox*sz,oy*sz,r*sz,0,Math.PI*2);ctx.fill()})}
// Legs
ctx.fillStyle=breed.body;[[-7,12],[-3,13],[3,13],[7,12]].forEach(([lx,ly])=>ctx.fillRect((lx-2)*sz,ly*sz,4*sz,6*sz));
// Feet acc
S.equippedAcc.forEach(id=>{const ac=ACCESSORIES.find(a=>a.id===id);if(!ac||ac.slot!=='feet')return;ctx.fillStyle=ac.color;[[-7,17],[-3,18],[3,18],[7,17]].forEach(([lx,ly])=>{ctx.beginPath();ctx.ellipse(lx*sz,ly*sz,3.5*sz,2.5*sz,0,0,Math.PI*2);ctx.fill()})});
// Head
ctx.fillStyle=breed.body;ctx.beginPath();ctx.arc(0,-10*sz,10*sz,0,Math.PI*2);ctx.fill();
// Ears
ctx.fillStyle=breed.ear;
if(breed.earType==='pointed'){[[-7,-14],[7,-14]].forEach(([ox,oy])=>{ctx.beginPath();ctx.moveTo((ox-3)*sz,oy*sz+4*sz);ctx.lineTo(ox*sz,(oy-7)*sz);ctx.lineTo((ox+3)*sz,oy*sz+4*sz);ctx.closePath();ctx.fill()})}
else if(breed.earType==='big'){[[-9,-6],[9,-6]].forEach(([ox,oy])=>{ctx.beginPath();ctx.ellipse(ox*sz,oy*sz,4*sz,8*sz,ox<0?-.3:.3,0,Math.PI*2);ctx.fill()})}
else if(breed.earType==='small'){[[-8,-12],[8,-12]].forEach(([ox,oy])=>{ctx.beginPath();ctx.ellipse(ox*sz,oy*sz,3*sz,4*sz,ox<0?-.2:.2,0,Math.PI*2);ctx.fill()})}
else{[[-8,-7],[8,-7]].forEach(([ox,oy])=>{ctx.beginPath();ctx.ellipse(ox*sz,oy*sz,4*sz,7*sz,ox<0?-.3:.3,0,Math.PI*2);ctx.fill()})}
// Head acc
S.equippedAcc.forEach(id=>{const ac=ACCESSORIES.find(a=>a.id===id);if(!ac||ac.slot!=='head')return;ctx.fillStyle=ac.color;if(id==='tophat'){ctx.fillRect(-7*sz,-25*sz,14*sz,4*sz);ctx.fillRect(-5*sz,-38*sz,10*sz,14*sz)}else if(id==='crown'){ctx.beginPath();ctx.moveTo(-7*sz,-18*sz);ctx.lineTo(-7*sz,-26*sz);ctx.lineTo(-3*sz,-22*sz);ctx.lineTo(0,-28*sz);ctx.lineTo(3*sz,-22*sz);ctx.lineTo(7*sz,-26*sz);ctx.lineTo(7*sz,-18*sz);ctx.closePath();ctx.fill()}else if(id==='party'){ctx.beginPath();ctx.moveTo(0,-30*sz);ctx.lineTo(-6*sz,-16*sz);ctx.lineTo(6*sz,-16*sz);ctx.closePath();ctx.fill()}else if(id==='wizard'){ctx.beginPath();ctx.moveTo(2*sz,-32*sz);ctx.lineTo(-8*sz,-16*sz);ctx.lineTo(8*sz,-16*sz);ctx.closePath();ctx.fill();ctx.fillStyle='#F59E0B';ctx.beginPath();ctx.ellipse(0,-16*sz,9*sz,3*sz,0,0,Math.PI*2);ctx.fill()}else if(id==='horns'){[[-5,-18],[5,-18]].forEach(([ox,oy])=>{ctx.beginPath();ctx.moveTo(ox*sz,oy*sz);ctx.lineTo((ox+2)*sz,(oy-8)*sz);ctx.lineTo((ox-2)*sz,(oy-1)*sz);ctx.closePath();ctx.fill()})}else if(id==='halo'){ctx.strokeStyle='#FBBF24';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-22*sz,8*sz,3*sz,0,0,Math.PI*2);ctx.stroke()}else if(id==='helmet'){ctx.fillStyle='#6B7280';ctx.beginPath();ctx.arc(0,-12*sz,11*sz,Math.PI,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(150,200,255,0.3)';ctx.beginPath();ctx.arc(0,-10*sz,8*sz,Math.PI+.3,-.3);ctx.fill()}});
// Snout
ctx.fillStyle=breed.belly;ctx.beginPath();ctx.ellipse(0,-6*sz,6*sz,4*sz,0,0,Math.PI*2);ctx.fill();
// Eye acc
S.equippedAcc.forEach(id=>{const ac=ACCESSORIES.find(a=>a.id===id);if(!ac||ac.slot!=='eyes')return;if(id==='sunglasses'){ctx.fillStyle='rgba(30,30,30,0.85)';[[-4,-12],[4,-12]].forEach(([ox,oy])=>{ctx.beginPath();ctx.roundRect((ox-3)*sz,(oy-2)*sz,6*sz,4*sz,1);ctx.fill()});ctx.strokeStyle='#1F2937';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-1*sz,-12*sz);ctx.lineTo(1*sz,-12*sz);ctx.stroke()}else if(id==='aviators'){ctx.strokeStyle=ac.color;ctx.lineWidth=1.5;[[-4,-12],[4,-12]].forEach(([ox,oy])=>{ctx.beginPath();ctx.ellipse(ox*sz,oy*sz,4*sz,3*sz,0,0,Math.PI*2);ctx.stroke();ctx.fillStyle='rgba(150,100,50,0.3)';ctx.fill()})}else if(id==='monocle'){ctx.strokeStyle=ac.color;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(4*sz,-12*sz,3.5*sz,0,Math.PI*2);ctx.stroke()}});
// Eyes
if(!S.equippedAcc.includes('sunglasses')){ctx.fillStyle='#FFF';[[-4,-12],[4,-12]].forEach(([ox,oy])=>{ctx.beginPath();ctx.arc(ox*sz,oy*sz,2.5*sz,0,Math.PI*2);ctx.fill()});ctx.fillStyle='#1F2937';[[-4,-12],[4,-12]].forEach(([ox,oy])=>{ctx.beginPath();ctx.arc(ox*sz+.3,oy*sz+.3,1.5*sz,0,Math.PI*2);ctx.fill()});ctx.fillStyle='#FFF';[[-3.5,-12.5],[4.5,-12.5]].forEach(([ox,oy])=>{ctx.beginPath();ctx.arc(ox*sz,oy*sz,.6*sz,0,Math.PI*2);ctx.fill()})}
ctx.fillStyle='#1F2937';ctx.beginPath();ctx.ellipse(0,-5*sz,2*sz,1.5*sz,0,0,Math.PI*2);ctx.fill();
ctx.strokeStyle='#1F2937';ctx.lineWidth=.8;ctx.lineCap='round';const smile=S.happy>60?1:S.happy>30?0:-1;ctx.beginPath();ctx.moveTo(-3*sz,-3*sz);ctx.quadraticCurveTo(0,(-3+2*smile)*sz,3*sz,-3*sz);ctx.stroke();
if(S.happy>50){ctx.fillStyle='#FF6B8A';ctx.beginPath();ctx.ellipse(1*sz,-1*sz,2*sz,3*sz,.1,0,Math.PI*2);ctx.fill()}
// Neck acc
S.equippedAcc.forEach(id=>{const ac=ACCESSORIES.find(a=>a.id===id);if(!ac||ac.slot!=='neck')return;ctx.fillStyle=ac.color;if(id==='bandana'){ctx.beginPath();ctx.moveTo(-8*sz,-1*sz);ctx.lineTo(8*sz,-1*sz);ctx.lineTo(0,6*sz);ctx.closePath();ctx.fill()}else if(id==='bowtie'){ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-5*sz,-2*sz);ctx.lineTo(-5*sz,2*sz);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(5*sz,-2*sz);ctx.lineTo(5*sz,2*sz);ctx.closePath();ctx.fill();ctx.fillStyle=darken(ac.color,.2);ctx.beginPath();ctx.arc(0,0,1.5*sz,0,Math.PI*2);ctx.fill()}else if(id==='collar'||id==='chain'){ctx.strokeStyle=ac.color;ctx.lineWidth=2*sz;ctx.beginPath();ctx.ellipse(0,0,10*sz,4*sz,0,0,Math.PI);ctx.stroke();ctx.fillStyle=ac.color;ctx.beginPath();ctx.arc(0,4*sz,2*sz,0,Math.PI*2);ctx.fill()}else if(id==='scarf'){ctx.beginPath();ctx.ellipse(0,0,10*sz,4*sz,0,0,Math.PI*2);ctx.fill();ctx.fillRect(6*sz,0,3*sz,10*sz)}});
if(S.sleeping){const t=(Date.now()/1000)%3;ctx.font=`${8*sz}px sans-serif`;ctx.fillStyle='rgba(100,100,200,0.7)';ctx.textAlign='center';for(let i=0;i<3;i++){const off=((t+i*.8)%3)/3;ctx.globalAlpha=1-off;ctx.fillText('Z',(8+i*5)*sz,(-18-off*20)*sz)}ctx.globalAlpha=1}
ctx.restore()}

function drawCat(x,y){
ctx.save();ctx.translate(x,y);
ctx.fillStyle='rgba(0,0,0,0.08)';ctx.beginPath();ctx.ellipse(0,10,8,3,0,0,Math.PI*2);ctx.fill();
// Body
ctx.fillStyle='#F97316';ctx.beginPath();ctx.ellipse(0,2,10,8,0,0,Math.PI*2);ctx.fill();
// Head
ctx.beginPath();ctx.arc(0,-8,7,0,Math.PI*2);ctx.fill();
// Ears
[[-5,-13],[5,-13]].forEach(([ox,oy])=>{ctx.beginPath();ctx.moveTo((ox-3),oy+4);ctx.lineTo(ox,oy-5);ctx.lineTo(ox+3,oy+4);ctx.closePath();ctx.fill()});
// Eyes
ctx.fillStyle='#22C55E';[[-3,-9],[3,-9]].forEach(([ox,oy])=>{ctx.beginPath();ctx.arc(ox,oy,2,0,Math.PI*2);ctx.fill()});
ctx.fillStyle='#1F2937';[[-3,-9],[3,-9]].forEach(([ox,oy])=>{ctx.beginPath();ctx.ellipse(ox,oy,1,.5,0,0,Math.PI*2);ctx.fill()});
// Nose
ctx.fillStyle='#EC4899';ctx.beginPath();ctx.ellipse(0,-5,1.5,1,0,0,Math.PI*2);ctx.fill();
// Tail
ctx.strokeStyle='#F97316';ctx.lineWidth=3;ctx.lineCap='round';
const tw=Math.sin(animT*3)*.3;
ctx.beginPath();ctx.moveTo(-8,0);ctx.quadraticCurveTo(-15,-8+tw*10,-12,-15);ctx.stroke();
// Whiskers
ctx.strokeStyle='#D1D5DB';ctx.lineWidth=.5;
[[-1,-5,1],[1,-5,-1]].forEach(([ox,oy,d])=>{ctx.beginPath();ctx.moveTo(ox*4,oy);ctx.lineTo(ox*10,oy-2);ctx.stroke();ctx.beginPath();ctx.moveTo(ox*4,oy+1);ctx.lineTo(ox*10,oy+2);ctx.stroke()});
ctx.restore()}

function drawNPC(x,y){
if(!S.activeNPC)return;const n=S.activeNPC;
ctx.save();ctx.translate(x,y);
ctx.fillStyle='rgba(0,0,0,0.1)';ctx.beginPath();ctx.ellipse(0,12,12,5,0,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#22C55E';ctx.beginPath();ctx.roundRect(-8,-2,16,16,[0,0,3,3]);ctx.fill();
ctx.fillStyle='#1E3A5F';ctx.fillRect(-6,14,5,8);ctx.fillRect(1,14,5,8);
ctx.fillStyle='#F5D5C8';ctx.beginPath();ctx.arc(0,-10,9,0,Math.PI*2);ctx.fill();
ctx.fillStyle='#1F2937';ctx.fillRect(-4,-11,2,2);ctx.fillRect(2,-11,2,2);
// NPC icon above head
ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText(n.icon,0,-24);
// Exclamation if not met
if(!n.met){const bob=Math.sin(animT*4)*3;ctx.fillStyle='#F59E0B';ctx.font='bold 14px sans-serif';ctx.fillText('!',0,-35+bob)}
ctx.restore()}

// ═══ ROOM TRANSITIONS ═══
function changeRoom(to,sx,sy){S.room=to;S.humanX=sx;S.humanY=sy;S.dogX=sx+(S.controlling==='human'?-30:0);S.dogY=sy+(S.controlling==='human'?10:0);if(S.hasCat){S.catRoom=to;S.catX=sx+40;S.catY=sy+20}S.roomVisits++;if(!S.visitedRooms.includes(to))S.visitedRooms.push(to);SFX.door();$('hud-room').textContent=ROOMS[to].name;tapTarget=null;checkAch()}

// ═══ INTERACTIONS ═══
let interactCD=0;
function tryInteract(objId){
if(Date.now()-interactCD<800)return;interactCD=Date.now();
const room=ROOMS[S.room];const target=objId||nearObj;
if(!target||!room.interactions||!room.interactions[target])return;
const opts=room.interactions[target];const ev=opts[Math.floor(Math.random()*opts.length)];
S.interactions++;
if(ev.stat)modStat(ev.stat,ev.amt);if(ev.stat2)modStat(ev.stat2,ev.amt2);if(ev.stat3)modStat(ev.stat3,ev.amt3);
if(ev.coins)addCoins(ev.coins);if(ev.xp)addXp(ev.xp);if(ev.sound)SFX[ev.sound]?.();if(ev.panel)openPanel(ev.panel);
if(ev.collectible){const c=COLLECTIBLES[Math.floor(Math.random()*COLLECTIBLES.length)];if(!S.collectibles.includes(c.id)){S.collectibles.push(c.id);S.collectFound++;addCoins(c.value);toast(`Found ${c.name}! ${c.icon} +${c.value} coins`)}}
if(ev.pos){S.posEvents++;SFX.good();spawnP(S[S.controlling==='human'?'humanX':'dogX'],S[S.controlling==='human'?'humanY':'dogY']-20,'✨',2)}
else{S.negEvents++;SFX.bad();spawnP(S[S.controlling==='human'?'humanX':'dogX'],S[S.controlling==='human'?'humanY':'dogY']-20,'💥',2)}
showResult(ev.icon,ev.text,ev.pos);checkAch();checkQuests();updateHUD()}

function showResult(icon,text,pos){resultPopup={icon,text,timer:2.5};const el=$('result-popup');el.classList.remove('hidden');$('result-icon').textContent=icon;$('result-text').innerHTML=text+'<br><span style="color:'+(pos?'#22C55E':'#EF4444')+'">'+(pos?'✓ Positive':'✗ Negative')+'</span>'}

// ═══ STATS ═══
function clamp(v,min=0,max=100){return Math.max(min,Math.min(max,v))}
function modStat(s,a){S[s]=clamp(S[s]+a);if(s==='happy'&&S.happy>=100)S.maxHappy=true;updateHUD()}
function addCoins(a){S.coins=Math.max(0,S.coins+a);S.coinsTotal+=Math.max(0,a);updateHUD()}
function addXp(a){S.xp+=a;const need=20+S.level*15;if(S.xp>=need){S.xp-=need;S.level++;SFX.lvl();toast(`Level Up! ${S.name} is now level ${S.level}!`)}updateHUD()}
function tickStats(){if(S.sleeping){modStat('energy',5);modStat('hunger',-1);if(S.energy>=100){S.sleeping=false;toast(`${S.name} woke up!`);SFX.happy()}else if(Math.random()<.3)SFX.snore()}else{modStat('hunger',-2);modStat('happy',-1);modStat('energy',-1.5);modStat('hygiene',-.5)}if(S.hunger<15)modStat('health',-2);if(S.hygiene<15)modStat('health',-1);if(S.hunger>50&&S.hygiene>50)modStat('health',.5);checkAch()}
function updateHUD(){$('hud-name').textContent=S.name;$('hud-level').textContent=`Lv ${S.level}`;$('hud-room').textContent=ROOMS[S.room]?.name||'';$('hud-coins').textContent=S.coins;$('hs-hunger').style.width=S.hunger+'%';$('hs-happy').style.width=S.happy+'%';$('hs-energy').style.width=S.energy+'%';$('hs-hygiene').style.width=S.hygiene+'%';$('hs-health').style.width=S.health+'%';$('hud-xp-fill').style.width=(S.xp/(20+S.level*15)*100)+'%'}

// ═══ PANELS ═══
function openPanel(id){
const body=$('panel-body');body.innerHTML='';let title='';
if(id==='shop'){
title='Pet Shop';body.innerHTML='<div class="shop-cats"><button class="shop-cat active" data-c="acc">Accessories</button><button class="shop-cat" data-c="food">Food</button><button class="shop-cat" data-c="toys">Toys</button><button class="shop-cat" data-c="special">Special</button></div><div id="shop-grid" class="shop-grid"></div>';
setTimeout(()=>{renderShopCat('acc');body.querySelectorAll('.shop-cat').forEach(b=>{b.onclick=()=>{body.querySelectorAll('.shop-cat').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderShopCat(b.dataset.c)}})},10);
}else if(id==='wardrobe'){
title='Wardrobe';
if(S.ownedAcc.length===0){body.innerHTML='<p style="color:#999;text-align:center">No accessories yet! Visit the shop.</p>'}
else{const g=document.createElement('div');g.className='wardrobe-grid';S.ownedAcc.forEach(id=>{const ac=ACCESSORIES.find(a=>a.id===id);if(!ac)return;const eq=S.equippedAcc.includes(id);const d=document.createElement('div');d.className='ward-item'+(eq?' equipped':'');d.innerHTML='<div class="wi-icon">'+ac.icon+'</div><div class="wi-name">'+ac.name+'</div>';d.onclick=()=>{const idx=S.equippedAcc.indexOf(id);if(idx>=0){S.equippedAcc.splice(idx,1);toast('Unequipped '+ac.name)}else{S.equippedAcc=S.equippedAcc.filter(eid=>{const a=ACCESSORIES.find(x=>x.id===eid);return a&&a.slot!==ac.slot});S.equippedAcc.push(id);toast('Equipped '+ac.name+'!');SFX.click()}openPanel('wardrobe')};g.appendChild(d)});body.appendChild(g);body.innerHTML+='<p style="color:#999;font-size:.7em;text-align:center;margin-top:8px">Tap to equip/unequip</p>'}
}else if(id==='tricks'){
title='Tricks';TRICKS.forEach(tr=>{const learned=S.tricksLearned.includes(tr.id);const canLearn=S.level>=tr.lvl;const d=document.createElement('div');d.className='trick-item';d.innerHTML='<div><div class="trick-name">'+tr.name+'</div><div class="trick-sub">'+(learned?'Learned! +'+tr.coins+' coins':'Unlock at Lv '+tr.lvl)+'</div></div><button class="trick-btn'+(learned?' done':'')+'" '+((!canLearn&&!learned)?'disabled':'')+'>'+(learned?'Perform':'Learn')+'</button>';d.querySelector('button').onclick=()=>{if(learned){if(S.energy<5){toast('Too tired!');return}modStat('energy',-5);modStat('happy',8);addXp(tr.xp);addCoins(tr.coins);S.tricksDone++;if(tr.id==='speak')SFX.bark();else SFX.trick();toast(S.name+' did '+tr.name+'! +'+tr.coins+' coins');checkAch();checkQuests()}else if(canLearn){S.tricksLearned.push(tr.id);SFX.trick();toast(S.name+' learned '+tr.name+'!');addXp(tr.xp);openPanel('tricks');checkAch()}};body.appendChild(d)});
}else if(id==='achievements'){
title='Achievements ('+S.achUnlocked.length+'/'+ACHIEVEMENTS.length+')';ACHIEVEMENTS.forEach(a=>{const u=S.achUnlocked.includes(a.id);const d=document.createElement('div');d.className='ach-item'+(u?'':' locked');d.innerHTML='<div class="ach-icon">'+a.icon+'</div><div class="ach-info"><div class="ach-name">'+a.name+'</div><div class="ach-desc">'+a.desc+'</div></div>'+(u?'<div class="ach-check">✓</div>':'');body.appendChild(d)});
}else if(id==='stats'){
title='Stats Dashboard';const age=Math.floor((Date.now()-S.created)/86400000);const stats=[['Level',S.level],['Coins Earned',S.coinsTotal],['Age',age+'d'],['Interactions',S.interactions],['Pets',S.pets],['Feeds',S.feeds],['Grooms',S.grooms],['Vet Visits',S.vets],['Tricks',S.tricksLearned.length+'/'+TRICKS.length],['Accessories',S.ownedAcc.length+'/'+ACCESSORIES.length],['Achievements',S.achUnlocked.length+'/'+ACHIEVEMENTS.length],['Rooms Found',S.visitedRooms.length+'/'+ROOM_ORDER.length],['Collectibles',S.collectFound],['Quests Done',S.questsDone],['Plants Harvested',S.plantsHarvested],['Switches',S.switches],['Sprints',S.sprints],['Play Time',S.playtime+'m'],['Positive Events',S.posEvents],['Negative Events',S.negEvents],['Weather Seen',S.weatherSeen.length+'/5'],['NPC Met',S.npcMet]];
const g=document.createElement('div');g.className='stat-grid';stats.forEach(([l,v])=>g.innerHTML+='<div class="stat-card"><div class="sc-val">'+v+'</div><div class="sc-label">'+l+'</div></div>');body.appendChild(g);
}else if(id==='map'){
title='Mansion Map';const icons={living:'🛋️',kitchen:'🍳',hallway:'🚪',bedroom:'🛏️',bathroom:'🛁',yard:'🌳',gameroom:'🕹️',study:'📚',attic:'🏚️',basement:'🔦',pool:'🏊',garage:'🚗'};
const g=document.createElement('div');g.className='map-grid';ROOM_ORDER.forEach(rid=>{const r=ROOMS[rid];const d=document.createElement('div');d.className='map-room'+(S.room===rid?' current':'');d.innerHTML='<span class="mr-icon">'+(icons[rid]||'🏠')+'</span>'+r.name;g.appendChild(d)});body.appendChild(g);body.innerHTML+='<p style="color:#999;font-size:.7em;text-align:center;margin-top:8px">Walk through doorways to explore rooms</p>';
}else if(id==='quests'){
title='Daily Quests';if(!S.quests.length){body.innerHTML='<p style="color:#999;text-align:center">No quests yet!</p>'}
else S.quests.forEach(q=>{const d=document.createElement('div');d.className='trick-item';d.innerHTML='<div><div class="trick-name">'+q.icon+' '+q.desc+'</div><div class="trick-sub">Reward: 🪙'+q.reward+'</div></div><span style="font-size:1.2em">'+(q.done?'✅':'⬜')+'</span>';body.appendChild(d)});
}else if(id==='garden'){
title='Garden';body.innerHTML='<p style="font-size:.8em;color:#666;margin-bottom:8px">Plant flowers in the yard! Each takes a few minutes to grow.</p>';
if(S.garden.length<6){const pb=document.createElement('button');pb.className='btn-primary';pb.textContent='🌱 Plant (10 coins)';pb.style.cssText='margin-bottom:10px;font-size:.85em';pb.onclick=()=>{if(S.coins<10){toast('Need 10 coins!');SFX.error();return}S.coins-=10;const p=GARDEN_PLANTS[Math.floor(Math.random()*GARDEN_PLANTS.length)];S.garden.push({...p,progress:0,ready:false});SFX.plant();toast('Planted '+p.name+'!');openPanel('garden');updateHUD()};body.appendChild(pb)}
S.garden.forEach((p,i)=>{const d=document.createElement('div');d.className='trick-item';d.innerHTML='<div><div class="trick-name">'+(p.ready?p.icon:'🌱')+' '+p.name+'</div><div class="trick-sub">'+(p.ready?'Ready to harvest!':'Growing... '+Math.min(100,Math.floor(p.progress/p.growTime*100))+'%')+'</div></div>';if(p.ready){const hb=document.createElement('button');hb.className='trick-btn done';hb.textContent='Harvest';hb.onclick=()=>{addCoins(p.value);S.plantsHarvested++;S.garden.splice(i,1);SFX.coin();toast('Harvested '+p.name+'! +'+p.value+' coins');openPanel('garden');checkAch()};d.appendChild(hb)}body.appendChild(d)});
}else if(id==='collectibles'){
title='Collectibles ('+S.collectibles.length+'/'+COLLECTIBLES.length+')';
COLLECTIBLES.forEach(c=>{const owned=S.collectibles.includes(c.id);const d=document.createElement('div');d.className='ach-item'+(owned?'':' locked');d.innerHTML='<div class="ach-icon">'+c.icon+'</div><div class="ach-info"><div class="ach-name">'+c.name+'</div><div class="ach-desc">Value: '+c.value+' coins</div></div>'+(owned?'<div class="ach-check">✓</div>':'');body.appendChild(d)});
}
$('panel-title').textContent=title;$('panel-overlay').classList.remove('hidden')}

function renderShopCat(cat){
const grid=document.getElementById('shop-grid');if(!grid)return;grid.innerHTML='';let items=[];
if(cat==='acc')items=ACCESSORIES.map(a=>({...a,type:'acc'}));
else if(cat==='food')items=FOODS.filter(f=>f.cost>0).map(f=>({...f,type:'food',price:f.cost}));
else if(cat==='toys')items=TOYS.map(t=>({...t,type:'toy'}));
else if(cat==='special'){
items=[{id:'cat_adopt',name:'Adopt Cat',price:200,icon:'🐱',type:'special',desc:'A feline friend!'},{id:'vet_pass',name:'Vet Visit',price:20,icon:'🩺',type:'special',desc:'Heal your dog'},{id:'energy_drink',name:'Energy Drink',price:15,icon:'⚡',type:'special',desc:'Restore energy'},{id:'grooming_kit',name:'Grooming Kit',price:12,icon:'🛁',type:'special',desc:'Clean your dog'},{id:'feast',name:'Grand Feast',price:40,icon:'🍽️',type:'special',desc:'Max hunger+happy'}]}
items.forEach(item=>{const owned=(item.type==='acc'&&S.ownedAcc.includes(item.id))||(item.type==='toy'&&S.ownedToys.includes(item.id))||(item.id==='cat_adopt'&&S.hasCat);
const d=document.createElement('div');d.className='shop-item'+(owned?' owned':'');d.innerHTML='<div class="si-icon">'+(item.icon||'🛍️')+'</div><div class="si-name">'+item.name+'</div><div class="si-price">🪙 '+item.price+'</div>'+(item.desc?'<div class="si-desc">'+item.desc+'</div>':'');
if(!owned)d.onclick=()=>{if(S.coins<item.price){toast('Not enough coins!');SFX.error();return}S.coins-=item.price;
if(item.type==='acc')S.ownedAcc.push(item.id);
else if(item.type==='toy'){S.ownedToys.push(item.id);modStat('happy',item.happy||10)}
else if(item.id==='cat_adopt'){S.hasCat=true;S.catRoom=S.room;S.catX=S.humanX+50;S.catY=S.humanY;SFX.meow();toast('You adopted a cat! 🐱')}
else if(item.id==='vet_pass'){modStat('health',40);S.vets++;SFX.heal();toast('Health restored!')}
else if(item.id==='energy_drink'){modStat('energy',40);toast('Energy restored!')}
else if(item.id==='grooming_kit'){modStat('hygiene',35);S.grooms++;SFX.splash();toast('Squeaky clean!')}
else if(item.id==='feast'){modStat('hunger',50);modStat('happy',30);S.feeds++;SFX.eat();toast('What a feast!')}
SFX.buy();renderShopCat(cat);updateHUD();checkAch()};
grid.appendChild(d)})}

function closePanel(){$('panel-overlay').classList.remove('hidden');$('panel-overlay').classList.add('hidden')}

// ═══ ACHIEVEMENTS ═══
function checkAch(){const s={pets:S.pets,feeds:S.feeds,grooms:S.grooms,vets:S.vets,roomVisits:S.roomVisits,coinsTotal:S.coinsTotal,level:S.level,tricks:S.tricksLearned.length,accs:S.ownedAcc.length,photos:S.photos,interactions:S.interactions,switches:S.switches,streak:S.streak,maxHappy:S.maxHappy,foodsTried:S.foodsTried.length,toysN:S.ownedToys.length,negEvents:S.negEvents,posEvents:S.posEvents,playtime:S.playtime,allRooms:S.visitedRooms.length>=ROOM_ORDER.length,collectFound:S.collectFound,plantsHarvested:S.plantsHarvested,questsDone:S.questsDone,hasCat:S.hasCat,npcMet:S.npcMet,mgPlayed:S.mgPlayed,sprints:S.sprints,weatherSeen:S.weatherSeen.length};
ACHIEVEMENTS.forEach(a=>{if(!S.achUnlocked.includes(a.id)&&a.ck(s)){S.achUnlocked.push(a.id);SFX.ach();toast('🏆 '+a.name+'!');addCoins(15)}})}

// ═══ DAILY ═══
function checkDaily(){const today=new Date().toDateString();if(S.lastLogin===today)return;const yest=new Date(Date.now()-86400000).toDateString();S.streak=S.lastLogin===yest?S.streak+1:1;S.lastLogin=today;const reward=10+S.streak*5;$('daily-reward-text').textContent='Day '+S.streak+' streak! Claim '+reward+' coins!';$('daily-reward').classList.remove('hidden');$('claim-daily').onclick=()=>{addCoins(reward);SFX.coin();$('daily-reward').classList.add('hidden');toast('+'+reward+' coins!');checkAch()}}

// ═══ SAVE/LOAD ═══
function autoSave(){try{localStorage.setItem('pawpalace3',JSON.stringify(S))}catch(e){}}
function loadGame(){try{const d=localStorage.getItem('pawpalace3');if(d){S={...defState(),...JSON.parse(d),session:Date.now()};return true}}catch(e){}return false}

// ═══ UTILS ═══
function darken(h,a){let r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return'#'+[r,g,b].map(c=>Math.max(0,Math.floor(c*(1-a))).toString(16).padStart(2,'0')).join('')}
function lighten(h,a){let r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return'#'+[r,g,b].map(c=>Math.min(255,Math.floor(c+(255-c)*a)).toString(16).padStart(2,'0')).join('')}
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.remove('hidden');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.add('hidden'),3000)}

// ═══ WIRING ═══
$('start-btn').onclick=startGame;$('hud-switch').onclick=switchControl;$('panel-close').onclick=closePanel;
$('photo-btn2').onclick=()=>{SFX.photo();S.photos++;const l=document.createElement('a');l.download=S.name+'_'+S.photos+'.png';l.href=canvas.toDataURL();l.click();toast('Photo saved!');addCoins(2);checkAch()};
$('music-btn2').onclick=()=>{toggleMusic();toast(musicOn?'Music on':'Music off')};
document.querySelectorAll('.bb-btn[data-panel]').forEach(b=>b.onclick=()=>openPanel(b.dataset.panel));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePanel()});

// ═══ INIT ═══
function init(){
initBreeds();
// Add extra bottom buttons
const bb=document.getElementById('bottom-bar');
['quests:📜:Daily Quests','garden:🌱:Garden','collectibles:💎:Collectibles'].forEach(s=>{const[p,i,t]=s.split(':');const b=document.createElement('button');b.className='bb-btn';b.dataset.panel=p;b.title=t;b.textContent=i;b.onclick=()=>openPanel(p);bb.insertBefore(b,bb.lastElementChild)});
if(loadGame()){$('intro-screen').classList.add('hidden');$('game-screen').classList.remove('hidden');resize();updateHUD();$('control-icon').textContent=S.controlling==='human'?'🧑':'🐕';$('control-label').textContent=S.controlling==='human'?'You':S.name;checkDaily();generateQuests();requestAnimationFrame(loop);setInterval(tickStats,5000);setInterval(()=>{S.playtime++;autoSave()},60000);setInterval(tickWeather,30000);setInterval(tickNPC,20000);setInterval(tickGarden,10000);toast('Welcome back! '+S.name+' missed you!');SFX.happy()}}
init();
})();
