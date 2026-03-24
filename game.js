(function(){
"use strict";

// ═══════════════════════════════════════════════════════════════
// AUDIO ENGINE
// ═══════════════════════════════════════════════════════════════
const AC=window.AudioContext||window.webkitAudioContext;
let ac=null;
function ea(){if(!ac)ac=new AC();if(ac.state==='suspended')ac.resume()}
let sfxV=0.7, musV=0.3;

function tone(f,d,type='triangle',v=0.15){
    ea();const g=ac.createGain(),o=ac.createOscillator();
    o.type=type;o.frequency.value=f;
    g.gain.setValueAtTime(v*sfxV,ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+d);
    o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d);
}
function noise(d,v=0.08){
    ea();const b=ac.createBuffer(1,ac.sampleRate*d,ac.sampleRate);
    const ch=b.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1;
    const s=ac.createBufferSource(),g=ac.createGain();s.buffer=b;
    g.gain.setValueAtTime(v*sfxV,ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+d);
    s.connect(g);g.connect(ac.destination);s.start();s.stop(ac.currentTime+d);
}

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
};

// Music
let musicOn=false,mNodes=[];
function toggleMusic(){ea();if(musicOn){musicOn=false;mNodes.forEach(n=>{try{n.stop()}catch(e){}});mNodes=[];return}musicOn=true;playMLoop()}
function playMLoop(){if(!musicOn)return;const notes=[261,293,329,349,392,440,493,523];const seq=[0,2,4,5,7,4,2,0,3,5,7,5,3,0,2,4];let t=ac.currentTime;seq.forEach((n,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=notes[n];g.gain.setValueAtTime(musV*.06,t+i*.4);g.gain.exponentialRampToValueAtTime(.001,t+i*.4+.35);o.connect(g);g.connect(ac.destination);o.start(t+i*.4);o.stop(t+i*.4+.38);mNodes.push(o)});setTimeout(playMLoop,seq.length*400)}

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════
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
];

const TOYS=[
    {id:'ball',name:'Tennis Ball',price:20,icon:'🎾',happy:10},
    {id:'rope',name:'Rope Toy',price:25,icon:'🪢',happy:12},
    {id:'squeaky',name:'Squeaky Duck',price:30,icon:'🦆',happy:15},
    {id:'frisbee',name:'Frisbee',price:35,icon:'🥏',happy:14},
    {id:'plushie',name:'Plush Bear',price:40,icon:'🧸',happy:18},
    {id:'puzzle',name:'Puzzle Feeder',price:50,icon:'🧩',happy:20},
];

const TRICKS=[
    {id:'sit',name:'Sit',xp:5,coins:3,lvl:1},
    {id:'shake',name:'Shake Paw',xp:8,coins:5,lvl:2},
    {id:'roll',name:'Roll Over',xp:12,coins:8,lvl:3},
    {id:'speak',name:'Speak',xp:10,coins:6,lvl:4},
    {id:'dead',name:'Play Dead',xp:15,coins:10,lvl:5},
    {id:'spin',name:'Spin',xp:12,coins:8,lvl:6},
    {id:'hi5',name:'High Five',xp:18,coins:12,lvl:7},
    {id:'dance',name:'Dance',xp:25,coins:18,lvl:8},
    {id:'flip',name:'Backflip',xp:35,coins:25,lvl:10},
];

const ACHIEVEMENTS=[
    {id:'pet1',name:'First Touch',desc:'Pet your dog',icon:'🤍',ck:s=>s.pets>=1},
    {id:'pet100',name:'Pet Lover',desc:'Pet 100 times',icon:'💜',ck:s=>s.pets>=100},
    {id:'fed50',name:'Provider',desc:'Feed 50 times',icon:'🍖',ck:s=>s.feeds>=50},
    {id:'walk20',name:'Explorer',desc:'20 room visits',icon:'🗺️',ck:s=>s.roomVisits>=20},
    {id:'c500',name:'Coin Collector',desc:'Earn 500 coins',icon:'💰',ck:s=>s.coinsTotal>=500},
    {id:'c2000',name:'Rich Pup',desc:'Earn 2000 coins',icon:'💎',ck:s=>s.coinsTotal>=2000},
    {id:'lv5',name:'Growing Up',desc:'Reach level 5',icon:'📈',ck:s=>s.level>=5},
    {id:'lv10',name:'Top Dog',desc:'Reach level 10',icon:'🏆',ck:s=>s.level>=10},
    {id:'lv20',name:'Legendary',desc:'Reach level 20',icon:'👑',ck:s=>s.level>=20},
    {id:'tr3',name:'Smart Pup',desc:'Learn 3 tricks',icon:'🎓',ck:s=>s.tricks>=3},
    {id:'trAll',name:'Trick Master',desc:'All tricks',icon:'🌟',ck:s=>s.tricks>=TRICKS.length},
    {id:'ac5',name:'Fashionista',desc:'Own 5 accessories',icon:'👗',ck:s=>s.accs>=5},
    {id:'photo10',name:'Photographer',desc:'10 photos',icon:'📸',ck:s=>s.photos>=10},
    {id:'mg10',name:'Pro Gamer',desc:'10 interactions',icon:'🕹️',ck:s=>s.interactions>=10},
    {id:'d7',name:'Dedicated',desc:'7 day streak',icon:'📅',ck:s=>s.streak>=7},
    {id:'happy',name:'Pure Joy',desc:'Max happiness',icon:'😊',ck:s=>s.maxHappy},
    {id:'food',name:'Foodie',desc:'Try all foods',icon:'🍽️',ck:s=>s.foodsTried>=FOODS.length},
    {id:'groom20',name:'Clean Pup',desc:'Groom 20x',icon:'🛁',ck:s=>s.grooms>=20},
    {id:'vet10',name:'Healthy',desc:'10 vet visits',icon:'🩺',ck:s=>s.vets>=10},
    {id:'toys',name:'Toy Collector',desc:'All toys',icon:'🧸',ck:s=>s.toysN>=TOYS.length},
    {id:'mansion',name:'Home Owner',desc:'Visit all rooms',icon:'🏠',ck:s=>s.allRooms},
    {id:'switch50',name:'Shapeshifter',desc:'Switch 50 times',icon:'🔄',ck:s=>s.switches>=50},
    {id:'neg5',name:'Oops!',desc:'5 negative events',icon:'💥',ck:s=>s.negEvents>=5},
    {id:'pos20',name:'Lucky Dog',desc:'20 positive events',icon:'🍀',ck:s=>s.posEvents>=20},
    {id:'playtime',name:'Best Friends',desc:'Play 1 hour',icon:'⏰',ck:s=>s.playtime>=60},
];

// ═══════════════════════════════════════════════════════════════
// MANSION ROOMS
// ═══════════════════════════════════════════════════════════════
const RW=800, RH=600; // room pixel size

const ROOMS={
    living:{
        name:'Living Room', floor:'#C4A882', walls:'#E8DCC8', accent:'#8B7355',
        furniture:[
            {id:'couch',name:'Couch',x:150,y:200,w:140,h:60,color:'#6366F1',icon:'🛋️'},
            {id:'tv',name:'TV',x:400,y:80,w:80,h:20,color:'#1F2937',icon:'📺'},
            {id:'bookshelf',name:'Bookshelf',x:600,y:100,w:60,h:120,color:'#92400E',icon:'📚'},
            {id:'fireplace',name:'Fireplace',x:100,y:80,w:80,h:70,color:'#7C2D12',icon:'🔥'},
            {id:'rug',name:'Rug',x:350,y:350,w:150,h:100,color:'#DC2626',icon:''},
            {id:'lamp',name:'Lamp',x:680,y:300,w:30,h:50,color:'#FBBF24',icon:'💡'},
        ],
        doors:[
            {x:370,y:0,w:60,h:12,to:'hallway',sx:370,sy:540},
            {x:0,y:250,w:12,h:60,to:'kitchen',sx:750,sy:250},
            {x:788,y:250,w:12,h:60,to:'gameroom',sx:30,sy:250},
        ],
        interactions:{
            couch:[
                {text:'You relaxed on the couch.',icon:'😌',pos:true,stat:'energy',amt:10},
                {text:'Dog jumped on the couch and got comfy!',icon:'🐕',pos:true,stat:'happy',amt:8},
                {text:'Found a coin between the cushions!',icon:'🪙',pos:true,coins:10},
                {text:'Dog knocked a pillow off the couch!',icon:'😅',pos:false,stat:'happy',amt:-3},
            ],
            tv:[
                {text:'Watched a nature documentary together!',icon:'📺',pos:true,stat:'happy',amt:10},
                {text:'Dog barked at the TV animals!',icon:'🐕',pos:true,stat:'happy',amt:5,sound:'bark'},
                {text:'The remote is missing...',icon:'😐',pos:false,stat:'happy',amt:-2},
                {text:'Found a fun dog show! +XP',icon:'⭐',pos:true,xp:10},
            ],
            bookshelf:[
                {text:'Read a dog training book! +XP',icon:'📖',pos:true,xp:15},
                {text:'Dog knocked books off the shelf!',icon:'📚',pos:false,stat:'hygiene',amt:-5},
                {text:'Found a $20 bill in a book!',icon:'💵',pos:true,coins:20},
                {text:'Learned something new!',icon:'🧠',pos:true,xp:8},
            ],
            fireplace:[
                {text:'Sat by the warm fire together.',icon:'🔥',pos:true,stat:'happy',amt:12},
                {text:'Dog got too close! Careful!',icon:'⚠️',pos:false,stat:'health',amt:-5},
                {text:'Roasted marshmallows!',icon:'😋',pos:true,stat:'hunger',amt:5,stat2:'happy',amt2:10},
            ],
            lamp:[
                {text:'Turned on cozy lighting.',icon:'💡',pos:true,stat:'happy',amt:3},
                {text:'Dog bumped the lamp! It wobbled.',icon:'😬',pos:false,coins:-5},
            ],
        }
    },
    kitchen:{
        name:'Kitchen', floor:'#F5F0E6', walls:'#E5DDD0', accent:'#D4C5A9',
        furniture:[
            {id:'fridge',name:'Fridge',x:100,y:80,w:70,h:80,color:'#D1D5DB',icon:'🧊'},
            {id:'stove',name:'Stove',x:300,y:80,w:80,h:50,color:'#374151',icon:'🍳'},
            {id:'counter',name:'Counter',x:500,y:80,w:120,h:40,color:'#92400E',icon:''},
            {id:'foodbowl',name:'Food Bowl',x:600,y:400,w:40,h:30,color:'#EF4444',icon:'🥣'},
            {id:'waterbowl',name:'Water Bowl',x:660,y:400,w:40,h:30,color:'#3B82F6',icon:'💧'},
            {id:'table',name:'Table',x:300,y:350,w:120,h:80,color:'#92400E',icon:''},
        ],
        doors:[
            {x:788,y:250,w:12,h:60,to:'living',sx:30,sy:250},
            {x:370,y:0,w:60,h:12,to:'yard',sx:370,sy:540},
        ],
        interactions:{
            fridge:[
                {text:'Found leftover steak! Dog is excited!',icon:'🥩',pos:true,stat:'hunger',amt:20,stat2:'happy',amt2:10},
                {text:'The fridge is almost empty...',icon:'😕',pos:false,stat:'happy',amt:-3},
                {text:'Grabbed a healthy snack!',icon:'🥕',pos:true,stat:'hunger',amt:10,stat2:'health',amt2:5},
                {text:'Dog stole food from the fridge!',icon:'🐕',pos:true,stat:'hunger',amt:15,sound:'eat'},
            ],
            stove:[
                {text:'Cooked a delicious meal!',icon:'👨‍🍳',pos:true,stat:'hunger',amt:30,coins:5},
                {text:'Burnt the food! Smoke everywhere.',icon:'🔥',pos:false,stat:'hygiene',amt:-8},
                {text:'Made dog treats from scratch!',icon:'🍪',pos:true,stat:'happy',amt:15,xp:5},
                {text:'Dog almost touched the hot stove!',icon:'⚠️',pos:false,stat:'health',amt:-3},
            ],
            foodbowl:[
                {text:'Filled the food bowl! Dog is eating.',icon:'🥣',pos:true,stat:'hunger',amt:20,sound:'eat'},
                {text:'Dog made a mess eating!',icon:'😅',pos:false,stat:'hygiene',amt:-5,stat2:'hunger',amt2:15},
            ],
            waterbowl:[
                {text:'Fresh water for the pup!',icon:'💧',pos:true,stat:'hunger',amt:5,stat2:'hygiene',amt2:5},
                {text:'Dog splashed water everywhere!',icon:'💦',pos:false,stat:'hygiene',amt:-8,stat2:'happy',amt2:5},
            ],
            counter:[
                {text:'Found some coins on the counter!',icon:'🪙',pos:true,coins:8},
                {text:'Dog jumped on the counter! Bad dog!',icon:'🐕',pos:false,stat:'happy',amt:-5},
            ],
        }
    },
    hallway:{
        name:'Hallway', floor:'#D4C5A9', walls:'#E8DCC8', accent:'#8B7355',
        furniture:[
            {id:'mirror',name:'Mirror',x:200,y:80,w:60,h:80,color:'#93C5FD',icon:'🪞'},
            {id:'shoes_rack',name:'Shoe Rack',x:500,y:80,w:80,h:50,color:'#78350F',icon:'👟'},
            {id:'coat_rack',name:'Coat Rack',x:650,y:150,w:30,h:70,color:'#92400E',icon:'🧥'},
            {id:'stairs',name:'Stairs',x:350,y:200,w:100,h:120,color:'#A78B6E',icon:'🪜'},
        ],
        doors:[
            {x:370,y:588,w:60,h:12,to:'living',sx:370,sy:30},
            {x:0,y:250,w:12,h:60,to:'bathroom',sx:750,sy:250},
            {x:788,y:250,w:12,h:60,to:'bedroom',sx:30,sy:250},
            {x:370,y:0,w:60,h:12,to:'study',sx:370,sy:540},
        ],
        interactions:{
            mirror:[
                {text:'Looking good! Confidence boost!',icon:'😎',pos:true,stat:'happy',amt:8},
                {text:'Dog barked at its reflection!',icon:'🐕',pos:true,stat:'happy',amt:5,sound:'bark'},
                {text:'The mirror needs cleaning.',icon:'🪞',pos:false,stat:'hygiene',amt:-2},
            ],
            shoes_rack:[
                {text:'Dog chewed on a shoe!',icon:'👟',pos:false,coins:-10},
                {text:'Found a coin in a shoe!',icon:'🪙',pos:true,coins:5},
                {text:'Put on walking shoes. Ready for adventure!',icon:'🚶',pos:true,stat:'energy',amt:5},
            ],
            coat_rack:[
                {text:'Dog pulled a coat down and wore it!',icon:'🧥',pos:true,stat:'happy',amt:10},
                {text:'Everything fell off the rack!',icon:'💥',pos:false,stat:'hygiene',amt:-3},
            ],
            stairs:[
                {text:'Raced up and down the stairs!',icon:'🏃',pos:true,stat:'energy',amt:-10,stat2:'happy',amt2:8,xp:5},
                {text:'Dog slid down the banister!',icon:'😂',pos:true,stat:'happy',amt:12},
                {text:'Careful on those stairs!',icon:'⚠️',pos:false,stat:'health',amt:-3},
            ],
        }
    },
    bedroom:{
        name:'Bedroom', floor:'#E8D5E0', walls:'#F3E8EE', accent:'#C084A0',
        furniture:[
            {id:'bed',name:'Bed',x:150,y:150,w:160,h:120,color:'#6366F1',icon:'🛏️'},
            {id:'dresser',name:'Dresser',x:500,y:100,w:80,h:60,color:'#92400E',icon:'🗄️'},
            {id:'toybox',name:'Toy Box',x:600,y:350,w:60,h:50,color:'#EF4444',icon:'🧸'},
            {id:'window_b',name:'Window',x:350,y:70,w:80,h:60,color:'#93C5FD',icon:'🪟'},
            {id:'dogbed',name:'Dog Bed',x:150,y:420,w:80,h:50,color:'#F59E0B',icon:'🐕'},
        ],
        doors:[
            {x:0,y:250,w:12,h:60,to:'hallway',sx:750,sy:250},
        ],
        interactions:{
            bed:[
                {text:'Took a nap. Feeling refreshed!',icon:'😴',pos:true,stat:'energy',amt:30},
                {text:'Dog jumped on the bed! Cuddle time!',icon:'🥰',pos:true,stat:'happy',amt:15,stat2:'energy',amt2:10},
                {text:'Found a treat under the pillow!',icon:'🍪',pos:true,stat:'hunger',amt:5,coins:5},
            ],
            dresser:[
                {text:'Changed outfits — opens wardrobe!',icon:'👔',pos:true,panel:'wardrobe'},
                {text:'Found coins in a drawer!',icon:'🪙',pos:true,coins:15},
                {text:'Dog pulled out all the socks!',icon:'🧦',pos:false,stat:'hygiene',amt:-5},
            ],
            toybox:[
                {text:'Found a new toy! Dog is thrilled!',icon:'🧸',pos:true,stat:'happy',amt:20},
                {text:'Played tug of war with a toy!',icon:'🪢',pos:true,stat:'happy',amt:12,stat2:'energy',amt2:-5},
                {text:'All the toys spilled out!',icon:'😅',pos:false,stat:'hygiene',amt:-5,stat2:'happy',amt2:8},
            ],
            window_b:[
                {text:'Watched birds outside. Peaceful.',icon:'🐦',pos:true,stat:'happy',amt:8},
                {text:'Dog spotted a squirrel! BARK BARK!',icon:'🐿️',pos:true,stat:'happy',amt:5,sound:'bark'},
            ],
            dogbed:[
                {text:'Dog curled up in its bed. So cute!',icon:'🐕',pos:true,stat:'energy',amt:15,stat2:'happy',amt2:5},
                {text:'You tucked the dog in. Adorable!',icon:'🥰',pos:true,stat:'happy',amt:10},
            ],
        }
    },
    bathroom:{
        name:'Bathroom', floor:'#E0F2FE', walls:'#BFDBFE', accent:'#60A5FA',
        furniture:[
            {id:'bathtub',name:'Bathtub',x:150,y:150,w:140,h:100,color:'#FFF',icon:'🛁'},
            {id:'sink',name:'Sink',x:450,y:100,w:60,h:40,color:'#FFF',icon:'🚰'},
            {id:'toilet',name:'Toilet',x:600,y:150,w:50,h:50,color:'#FFF',icon:'🚽'},
            {id:'towels',name:'Towel Rack',x:550,y:350,w:50,h:60,color:'#EC4899',icon:'🧴'},
        ],
        doors:[
            {x:788,y:250,w:12,h:60,to:'hallway',sx:30,sy:250},
        ],
        interactions:{
            bathtub:[
                {text:'Bath time! Dog is squeaky clean!',icon:'🛁',pos:true,stat:'hygiene',amt:35,sound:'splash'},
                {text:'Dog splashed water EVERYWHERE!',icon:'💦',pos:false,stat:'hygiene',amt:20,stat2:'happy',amt2:-5},
                {text:'Bubble bath party!',icon:'🫧',pos:true,stat:'hygiene',amt:30,stat2:'happy',amt2:10},
            ],
            sink:[
                {text:'Washed up nicely.',icon:'🚰',pos:true,stat:'hygiene',amt:10},
                {text:'Dog tried to drink from the faucet!',icon:'💧',pos:true,stat:'hunger',amt:5},
            ],
            toilet:[
                {text:'Dog drank from the toilet... gross!',icon:'🤢',pos:false,stat:'hygiene',amt:-10,stat2:'health',amt2:-3},
                {text:'Good thing the lid was down.',icon:'😅',pos:true,stat:'hygiene',amt:2},
            ],
            towels:[
                {text:'Dried off with a fluffy towel!',icon:'🧴',pos:true,stat:'hygiene',amt:10,stat2:'happy',amt2:5},
                {text:'Dog shredded a towel!',icon:'💥',pos:false,coins:-8,stat:'happy',amt:5},
            ],
        }
    },
    yard:{
        name:'Yard', floor:'#86C46D', walls:'#5BA347', accent:'#3B7A2B',
        outdoor:true,
        furniture:[
            {id:'tree',name:'Big Tree',x:150,y:150,w:80,h:100,color:'#15803D',icon:'🌳'},
            {id:'garden',name:'Garden',x:500,y:130,w:100,h:80,color:'#65A30D',icon:'🌻'},
            {id:'pond',name:'Pond',x:350,y:350,w:120,h:80,color:'#38BDF8',icon:'🏞️'},
            {id:'hydrant',name:'Fire Hydrant',x:650,y:350,w:30,h:40,color:'#EF4444',icon:'🧯'},
            {id:'ball_y',name:'Tennis Ball',x:200,y:400,w:25,h:25,color:'#84CC16',icon:'🎾'},
            {id:'doghouse',name:'Dog House',x:600,y:150,w:80,h:70,color:'#92400E',icon:'🏠'},
        ],
        doors:[
            {x:370,y:588,w:60,h:12,to:'kitchen',sx:370,sy:30},
        ],
        interactions:{
            tree:[
                {text:'Dog marked its territory!',icon:'🌳',pos:true,stat:'happy',amt:8},
                {text:'Found a stick! Dog wants to play!',icon:'🪵',pos:true,stat:'happy',amt:12,stat2:'energy',amt2:-5},
                {text:'A bird pooped on you!',icon:'💩',pos:false,stat:'hygiene',amt:-10},
                {text:'Relaxed in the shade.',icon:'😌',pos:true,stat:'energy',amt:8},
            ],
            garden:[
                {text:'Smelled the beautiful flowers!',icon:'🌻',pos:true,stat:'happy',amt:10},
                {text:'Dog dug up the garden!',icon:'🐕',pos:false,stat:'hygiene',amt:-10,coins:15},
                {text:'Found buried treasure!',icon:'💎',pos:true,coins:25},
                {text:'Planted a new flower!',icon:'🌷',pos:true,xp:10},
            ],
            pond:[
                {text:'Splashed in the pond! Fun!',icon:'💦',pos:true,stat:'happy',amt:15,stat2:'hygiene',amt2:-10,sound:'splash'},
                {text:'Dog caught a frog!',icon:'🐸',pos:true,stat:'happy',amt:12},
                {text:'Slipped and fell in!',icon:'😱',pos:false,stat:'hygiene',amt:-15,stat2:'happy',amt2:-5},
                {text:'Found a shiny coin in the water!',icon:'🪙',pos:true,coins:12},
            ],
            hydrant:[
                {text:'Dog did its thing...',icon:'🚿',pos:true,stat:'happy',amt:8},
                {text:'Turned on the hydrant! Water everywhere!',icon:'💦',pos:false,stat:'hygiene',amt:-15,stat2:'happy',amt2:10},
            ],
            ball_y:[
                {text:'Played fetch! Dog is SO happy!',icon:'🎾',pos:true,stat:'happy',amt:20,stat2:'energy',amt2:-10,sound:'bark'},
                {text:'Dog caught a fly ball! Amazing!',icon:'⭐',pos:true,xp:15,stat:'happy',amt:15},
                {text:'Ball went over the fence...',icon:'😢',pos:false,stat:'happy',amt:-8},
            ],
            doghouse:[
                {text:'Dog retreated to its house. Cozy!',icon:'🏠',pos:true,stat:'energy',amt:15},
                {text:'Found hidden treats in the doghouse!',icon:'🍖',pos:true,stat:'hunger',amt:15,coins:5},
            ],
        }
    },
    gameroom:{
        name:'Game Room', floor:'#1E293B', walls:'#334155', accent:'#475569',
        furniture:[
            {id:'arcade',name:'Arcade Machine',x:150,y:120,w:70,h:90,color:'#7C3AED',icon:'🕹️'},
            {id:'pool',name:'Pool Table',x:400,y:200,w:160,h:100,color:'#15803D',icon:'🎱'},
            {id:'darts',name:'Dart Board',x:650,y:120,w:50,h:50,color:'#DC2626',icon:'🎯'},
            {id:'jukebox',name:'Jukebox',x:100,y:350,w:60,h:80,color:'#F59E0B',icon:'🎵'},
            {id:'beanbag',name:'Bean Bag',x:550,y:400,w:70,h:50,color:'#EC4899',icon:'💺'},
        ],
        doors:[
            {x:0,y:250,w:12,h:60,to:'living',sx:750,sy:250},
            {x:788,y:250,w:12,h:60,to:'study',sx:30,sy:250},
        ],
        interactions:{
            arcade:[
                {text:'Beat the high score! Won coins!',icon:'🕹️',pos:true,coins:20,xp:10},
                {text:'Game Over... lost some coins.',icon:'💀',pos:false,coins:-10},
                {text:'Dog pressed buttons with its nose!',icon:'🐕',pos:true,stat:'happy',amt:10},
                {text:'Unlocked a bonus round!',icon:'⭐',pos:true,coins:30,xp:15},
            ],
            pool:[
                {text:'Won a game of pool! Nice shot!',icon:'🎱',pos:true,coins:15,xp:8},
                {text:'Dog stole the cue ball!',icon:'🐕',pos:false,stat:'happy',amt:8,coins:-5},
                {text:'Perfect trick shot!',icon:'✨',pos:true,coins:25},
            ],
            darts:[
                {text:'Bullseye! What a throw!',icon:'🎯',pos:true,coins:15,xp:10},
                {text:'Missed the board entirely...',icon:'😬',pos:false,stat:'happy',amt:-3},
                {text:'Dog fetched the darts!',icon:'🐕',pos:true,stat:'happy',amt:8},
            ],
            jukebox:[
                {text:'Put on some tunes! Dance party!',icon:'🎵',pos:true,stat:'happy',amt:15},
                {text:'Dog started howling along!',icon:'🐺',pos:true,stat:'happy',amt:10,sound:'bark'},
                {text:'The jukebox ate your coin...',icon:'😤',pos:false,coins:-5},
            ],
            beanbag:[
                {text:'Sank into the bean bag. Ahhhh.',icon:'😌',pos:true,stat:'energy',amt:12},
                {text:'Dog claimed the bean bag first!',icon:'🐕',pos:true,stat:'happy',amt:8},
            ],
        }
    },
    study:{
        name:'Study', floor:'#3C2415', walls:'#5C3D2E', accent:'#8B6914',
        furniture:[
            {id:'desk',name:'Desk',x:300,y:120,w:140,h:60,color:'#78350F',icon:'🖥️'},
            {id:'computer',name:'Computer',x:340,y:100,w:60,h:40,color:'#1F2937',icon:'💻'},
            {id:'globe',name:'Globe',x:600,y:200,w:40,h:50,color:'#3B82F6',icon:'🌍'},
            {id:'books',name:'Library Wall',x:100,y:100,w:60,h:200,color:'#92400E',icon:'📚'},
            {id:'armchair',name:'Armchair',x:500,y:380,w:70,h:60,color:'#7C2D12',icon:'💺'},
            {id:'safe',name:'Safe',x:650,y:400,w:50,h:50,color:'#4B5563',icon:'🔐'},
        ],
        doors:[
            {x:370,y:588,w:60,h:12,to:'hallway',sx:370,sy:30},
            {x:0,y:250,w:12,h:60,to:'gameroom',sx:750,sy:250},
        ],
        interactions:{
            desk:[
                {text:'Did some productive work! Earned coins.',icon:'📝',pos:true,coins:20,xp:10},
                {text:'Dog knocked papers off the desk!',icon:'📄',pos:false,stat:'hygiene',amt:-3},
                {text:'Found important documents... +XP!',icon:'📋',pos:true,xp:20},
            ],
            computer:[
                {text:'Shopped online — opens shop!',icon:'🛒',pos:true,panel:'shop'},
                {text:'Watched funny dog videos together!',icon:'📱',pos:true,stat:'happy',amt:12},
                {text:'Computer crashed...',icon:'💥',pos:false,stat:'happy',amt:-5},
            ],
            globe:[
                {text:'Planned a virtual trip! How exciting!',icon:'🌍',pos:true,stat:'happy',amt:8,xp:5},
                {text:'Dog spun the globe with its paw!',icon:'🐾',pos:true,stat:'happy',amt:6},
            ],
            books:[
                {text:'Read an encyclopedia. +Big XP!',icon:'📖',pos:true,xp:25},
                {text:'Dog chewed on a rare first edition!',icon:'📕',pos:false,coins:-15},
                {text:'Found a secret note with a code!',icon:'🔍',pos:true,coins:30},
            ],
            armchair:[
                {text:'Read by the firelight. Cozy!',icon:'📖',pos:true,stat:'energy',amt:10,stat2:'happy',amt2:8},
                {text:'Dog curled up on your lap!',icon:'🥰',pos:true,stat:'happy',amt:15},
            ],
            safe:[
                {text:'Cracked the safe! Jackpot!',icon:'💰',pos:true,coins:50},
                {text:'Wrong combination... try again.',icon:'🔐',pos:false,stat:'happy',amt:-2},
                {text:'Dog sniffed out the code!',icon:'🐕',pos:true,coins:30,xp:10},
            ],
        }
    },
};

const ROOM_ORDER=['living','kitchen','hallway','bedroom','bathroom','yard','gameroom','study'];

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════
let S=defState();
function defState(){
    return{
        name:'Buddy',breedId:'golden',
        hunger:80,happy:80,energy:80,hygiene:80,health:100,
        coins:50,xp:0,level:1,
        room:'living',
        humanX:400,humanY:400,dogX:350,dogY:420,
        controlling:'human', // 'human' or 'dog'
        ownedAcc:[],equippedAcc:[],ownedToys:['ball'],
        tricksLearned:[],
        pets:0,feeds:0,grooms:0,vets:0,roomVisits:0,
        coinsTotal:0,interactions:0,switches:0,
        photos:0,negEvents:0,posEvents:0,
        streak:0,lastLogin:null,playtime:0,
        foodsTried:[],visitedRooms:['living'],
        maxHappy:false,achUnlocked:[],
        created:Date.now(),session:Date.now(),
        sleeping:false,
    }
}

// ═══════════════════════════════════════════════════════════════
// CANVAS SETUP
// ═══════════════════════════════════════════════════════════════
const canvas=document.getElementById('game-canvas');
const ctx=canvas.getContext('2d');
function resize(){canvas.width=window.innerWidth*devicePixelRatio;canvas.height=window.innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
resize(); window.addEventListener('resize',resize);

const $=id=>document.getElementById(id);

// ═══════════════════════════════════════════════════════════════
// BREED SELECT
// ═══════════════════════════════════════════════════════════════
function initBreeds(){
    const grid=$('breed-grid');
    BREEDS.forEach((b,i)=>{
        const card=document.createElement('div');
        card.className='breed-card'+(i===0?' selected':'');
        card.dataset.breed=b.id;
        const c=document.createElement('canvas');
        c.width=80;c.height=70;
        drawBreedPreview(c.getContext('2d'),b,40,38);
        card.appendChild(c);
        const label=document.createElement('div');
        label.className='breed-label';
        label.textContent=b.name;
        card.appendChild(label);
        card.onclick=()=>{
            grid.querySelectorAll('.breed-card').forEach(c=>c.classList.remove('selected'));
            card.classList.add('selected');
            S.breedId=b.id;
        };
        grid.appendChild(card);
    });
}

function drawBreedPreview(c,b,cx,cy){
    const s=1.8;
    // Body
    c.fillStyle=b.body;
    c.beginPath();c.ellipse(cx,cy+4,18*s,14*s,0,0,Math.PI*2);c.fill();
    // Belly
    c.fillStyle=b.belly;
    c.beginPath();c.ellipse(cx,cy+8,12*s,8*s,0,0,Math.PI*2);c.fill();
    // Head
    c.fillStyle=b.body;
    c.beginPath();c.arc(cx,cy-14*s,12*s,0,Math.PI*2);c.fill();
    // Ears
    c.fillStyle=b.ear;
    if(b.earType==='pointed'){
        [[-10,-12],[10,-12]].forEach(([ox,oy])=>{
            c.beginPath();c.moveTo(cx+(ox-4)*s,cy+oy*s);c.lineTo(cx+ox*s,cy+(oy-10)*s);c.lineTo(cx+(ox+4)*s,cy+oy*s);c.closePath();c.fill()
        })
    }else if(b.earType==='big'){
        [[-11,-8],[11,-8]].forEach(([ox,oy])=>{
            c.beginPath();c.ellipse(cx+ox*s,cy+oy*s,5*s,10*s,ox<0?-0.3:0.3,0,Math.PI*2);c.fill()
        })
    }else if(b.earType==='small'){
        [[-9,-12],[9,-12]].forEach(([ox,oy])=>{
            c.beginPath();c.ellipse(cx+ox*s,cy+oy*s,4*s,5*s,ox<0?-0.2:0.2,0,Math.PI*2);c.fill()
        })
    }else{
        [[-10,-10],[10,-10]].forEach(([ox,oy])=>{
            c.beginPath();c.ellipse(cx+ox*s,cy+oy*s,5*s,9*s,ox<0?-0.3:0.3,0,Math.PI*2);c.fill()
        })
    }
    // Spots
    if(b.spots){
        c.fillStyle='#1F2937';
        [[-6,0,3],[5,-3,2],[8,6,2.5],[-4,8,2],[-9,4,2],[3,10,1.5]].forEach(([x,y,r])=>{
            c.beginPath();c.arc(cx+x*s,cy+y*s,r*s,0,Math.PI*2);c.fill()
        })
    }
    // Snout
    c.fillStyle=b.belly;
    c.beginPath();c.ellipse(cx,cy-10*s,7*s,5*s,0,0,Math.PI*2);c.fill();
    // Eyes
    c.fillStyle='#FFF';
    [[-4,-16],[4,-16]].forEach(([ox,oy])=>{c.beginPath();c.arc(cx+ox*s,cy+oy*s,3*s,0,Math.PI*2);c.fill()});
    c.fillStyle='#1F2937';
    [[-4,-16],[4,-16]].forEach(([ox,oy])=>{c.beginPath();c.arc(cx+ox*s+.5,cy+oy*s+.5,1.8*s,0,Math.PI*2);c.fill()});
    // Nose
    c.fillStyle='#1F2937';
    c.beginPath();c.ellipse(cx,cy-8*s,2.5*s,1.5*s,0,0,Math.PI*2);c.fill();
    // Mouth
    c.strokeStyle='#1F2937';c.lineWidth=1;c.lineCap='round';
    c.beginPath();c.moveTo(cx-3*s,cy-6*s);c.quadraticCurveTo(cx,cy-4*s,cx+3*s,cy-6*s);c.stroke();
    // Legs
    c.fillStyle=b.body;
    [[-8,16],[-3,17],[3,17],[8,16]].forEach(([ox,oy])=>{
        c.beginPath();c.roundRect(cx+ox*s-3*s,cy+oy*s-2,6*s,10*s,[0,0,2,2]);c.fill()
    });
    // Paws
    c.fillStyle=darken(b.body,.15);
    [[-8,25],[-3,26],[3,26],[8,25]].forEach(([ox,oy])=>{
        c.beginPath();c.ellipse(cx+ox*s,cy+oy*s,3.5*s,2*s,0,0,Math.PI*2);c.fill()
    });
    // Tail
    c.strokeStyle=b.body;c.lineWidth=3*s;c.lineCap='round';
    c.beginPath();c.moveTo(cx-16*s,cy);c.quadraticCurveTo(cx-22*s,cy-10*s,cx-18*s,cy-16*s);c.stroke();
}

// ═══════════════════════════════════════════════════════════════
// GAME START
// ═══════════════════════════════════════════════════════════════
function startGame(){
    S.name=$('dog-name').value.trim()||'Buddy';
    $('intro-screen').classList.add('hidden');
    $('game-screen').classList.remove('hidden');
    resize();
    updateHUD();
    checkDaily();
    requestAnimationFrame(loop);
    setInterval(tickStats,5000);
    setInterval(()=>{S.playtime++;autoSave()},60000);
    toast(`Welcome to Paw Palace! Use WASD to move, E to interact, Tab to switch.`);
}

// ═══════════════════════════════════════════════════════════════
// INPUT
// ═══════════════════════════════════════════════════════════════
const keys={};
document.addEventListener('keydown',e=>{
    keys[e.key.toLowerCase()]=true;
    if(e.key==='e'||e.key==='E')tryInteract();
    if(e.key==='Tab'){e.preventDefault();switchControl()}
});
document.addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});

// Mobile d-pad
document.querySelectorAll('.dpad-btn').forEach(b=>{
    const dir=b.dataset.dir;
    if(dir==='interact'){b.onclick=()=>tryInteract();return}
    const km={up:'w',down:'s',left:'a',right:'d'};
    b.addEventListener('touchstart',e=>{e.preventDefault();keys[km[dir]]=true});
    b.addEventListener('touchend',e=>{e.preventDefault();keys[km[dir]]=false});
    b.addEventListener('mousedown',e=>{keys[km[dir]]=true});
    b.addEventListener('mouseup',e=>{keys[km[dir]]=false});
});

// Click-to-move & interact on canvas
let tapTarget=null;
canvas.addEventListener('click',e=>{
    ea(); // ensure audio
    const r=canvas.getBoundingClientRect();
    const scaleX=(window.innerWidth)/camW;
    const scaleY=(window.innerHeight)/camH;
    const wx=(e.clientX/scaleX)+camX;
    const wy=(e.clientY/scaleY)+camY;
    // Check if clicked on furniture
    const room=ROOMS[S.room];
    for(const f of room.furniture){
        if(wx>f.x&&wx<f.x+f.w&&wy>f.y&&wy<f.y+f.h){
            tapTarget={x:f.x+f.w/2,y:f.y+f.h/2+30,obj:f.id};
            return;
        }
    }
    tapTarget={x:wx,y:wy,obj:null};
});

function switchControl(){
    S.controlling=S.controlling==='human'?'dog':'human';
    S.switches++;
    $('control-icon').textContent=S.controlling==='human'?'🧑':'🐕';
    $('control-label').textContent=S.controlling==='human'?'You':S.name;
    SFX.click();
    checkAch();
}

// ═══════════════════════════════════════════════════════════════
// GAME LOOP
// ═══════════════════════════════════════════════════════════════
let lastT=0, animT=0;
let camX=0,camY=0,camW=RW,camH=RH;
let nearObj=null;
let stepTimer=0;
let resultPopup=null; // {icon,text,timer}
let dogWagT=0, dogBreathT=0;

function loop(t){
    const dt=Math.min((t-lastT)/1000,.05);
    lastT=t; animT+=dt; dogWagT+=dt*5; dogBreathT+=dt*2;

    // Move active character
    const spd=150*dt;
    let ax=S.controlling==='human'?'humanX':'dogX';
    let ay=S.controlling==='human'?'humanY':'dogY';
    let moved=false;

    // Tap-to-move
    if(tapTarget){
        const dx=tapTarget.x-S[ax],dy=tapTarget.y-S[ay];
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist>8){
            S[ax]+=dx/dist*spd*1.2;
            S[ay]+=dy/dist*spd*1.2;
            moved=true;
        }else{
            if(tapTarget.obj)tryInteract(tapTarget.obj);
            tapTarget=null;
        }
    }

    if(keys.w||keys.arrowup){S[ay]-=spd;moved=true}
    if(keys.s||keys.arrowdown){S[ay]+=spd;moved=true}
    if(keys.a||keys.arrowleft){S[ax]-=spd;moved=true}
    if(keys.d||keys.arrowright){S[ax]+=spd;moved=true}

    // Clamp to room
    S[ax]=clamp(S[ax],20,RW-20);
    S[ay]=clamp(S[ay],20,RH-20);

    // Step sound
    if(moved){stepTimer+=dt;if(stepTimer>.3){SFX.step();stepTimer=0}}

    // Dog follows human (if human controlled)
    if(S.controlling==='human'&&!S.sleeping){
        const dx=S.humanX-S.dogX,dy=S.humanY-S.dogY;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist>50){S.dogX+=dx/dist*spd*.7;S.dogY+=dy/dist*spd*.7}
    }
    // Human stays put when dog is controlled (no following)

    // Collision with furniture
    const room=ROOMS[S.room];
    room.furniture.forEach(f=>{
        // Push character out of solid furniture
        [['humanX','humanY'],['dogX','dogY']].forEach(([px,py])=>{
            if(S[px]>f.x-10&&S[px]<f.x+f.w+10&&S[py]>f.y-10&&S[py]<f.y+f.h+10){
                // Find shortest escape
                const escapes=[
                    {d:S[px]-(f.x-10),dx:-1,dy:0},
                    {d:(f.x+f.w+10)-S[px],dx:1,dy:0},
                    {d:S[py]-(f.y-10),dx:0,dy:-1},
                    {d:(f.y+f.h+10)-S[py],dx:0,dy:1},
                ];
                escapes.sort((a,b)=>a.d-b.d);
                const e=escapes[0];
                if(e.d<12){S[px]+=e.dx*2;S[py]+=e.dy*2}
            }
        });
    });

    // Check door transitions
    const cx=S[ax],cy=S[ay];
    room.doors.forEach(d=>{
        if(cx>d.x&&cx<d.x+d.w+20&&cy>d.y&&cy<d.y+d.h+20){
            changeRoom(d.to,d.sx,d.sy);
        }
    });

    // Check proximity to furniture for interaction
    nearObj=null;
    const pcx=S.controlling==='human'?S.humanX:S.dogX;
    const pcy=S.controlling==='human'?S.humanY:S.dogY;
    room.furniture.forEach(f=>{
        const fx=f.x+f.w/2,fy=f.y+f.h/2;
        const dist=Math.sqrt((pcx-fx)**2+(pcy-fy)**2);
        if(dist<70){nearObj=f.id}
    });

    // Show/hide prompt
    const prompt=$('interact-prompt');
    if(nearObj&&!resultPopup){
        prompt.classList.remove('hidden');
        const furn=room.furniture.find(f=>f.id===nearObj);
        $('interact-text').textContent=`Press E — ${furn?.name||nearObj}`;
    }else{
        prompt.classList.add('hidden');
    }

    // Result popup timer
    if(resultPopup){resultPopup.timer-=dt;if(resultPopup.timer<=0){resultPopup=null;$('result-popup').classList.add('hidden')}}

    // Camera
    const vw=window.innerWidth,vh=window.innerHeight;
    camW=RW;camH=RH;
    camX=0;camY=0;

    // Render
    render(vw,vh);

    requestAnimationFrame(loop);
}

// ═══════════════════════════════════════════════════════════════
// RENDERING
// ═══════════════════════════════════════════════════════════════
function render(vw,vh){
    const scaleX=vw/camW, scaleY=vh/camH;
    const scale=Math.max(scaleX,scaleY);

    ctx.save();
    ctx.clearRect(0,0,vw,vh);

    // Scale to fit room in viewport
    const offX=(vw-RW*scale)/2, offY=(vh-RH*scale)/2;
    ctx.translate(offX,offY);
    ctx.scale(scale,scale);

    const room=ROOMS[S.room];

    // Draw room
    drawRoom(room);

    // Draw doors
    room.doors.forEach(d=>{
        ctx.fillStyle='rgba(99,102,241,0.3)';
        ctx.fillRect(d.x,d.y,d.w<15?15:d.w,d.h<15?15:d.h);
        // Arrow
        ctx.fillStyle='rgba(255,255,255,0.6)';
        ctx.font='12px sans-serif';
        ctx.textAlign='center';
        if(d.y<=5)ctx.fillText('▲',d.x+(d.w<15?7:d.w/2),d.y+12);
        else if(d.y>500)ctx.fillText('▼',d.x+d.w/2,d.y-2);
        else if(d.x<=5)ctx.fillText('◀',d.x+10,d.y+d.h/2+4);
        else ctx.fillText('▶',d.x-2,d.y+d.h/2+4);
    });

    // Draw furniture
    room.furniture.forEach(f=>{
        const highlight=f.id===nearObj;
        drawFurniture(f,highlight,room);
    });

    // Draw characters (back one first based on Y)
    const chars=[
        {type:'human',x:S.humanX,y:S.humanY},
        {type:'dog',x:S.dogX,y:S.dogY},
    ].sort((a,b)=>a.y-b.y);

    chars.forEach(ch=>{
        if(ch.type==='human')drawHuman(ch.x,ch.y);
        else drawDog(ch.x,ch.y);
    });

    ctx.restore();
}

function drawRoom(room){
    // Floor
    ctx.fillStyle=room.floor;
    ctx.fillRect(0,0,RW,RH);

    // Floor pattern
    if(!room.outdoor){
        ctx.strokeStyle='rgba(0,0,0,0.03)';
        ctx.lineWidth=1;
        for(let x=0;x<RW;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,RH);ctx.stroke()}
        for(let y=0;y<RH;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(RW,y);ctx.stroke()}
    }else{
        // Grass texture
        ctx.fillStyle='rgba(0,100,0,0.08)';
        for(let i=0;i<60;i++){
            const gx=Math.sin(i*73.7)*400+400,gy=Math.cos(i*127.3)*300+300;
            ctx.fillRect(gx,gy,2,6);
        }
    }

    // Walls (top & sides)
    if(!room.outdoor){
        ctx.fillStyle=room.walls;
        ctx.fillRect(0,0,RW,70); // top wall
        ctx.fillStyle=room.accent;
        ctx.fillRect(0,65,RW,5); // baseboard top
        // Side walls (subtle)
        ctx.fillStyle='rgba(0,0,0,0.03)';
        ctx.fillRect(0,0,8,RH);
        ctx.fillRect(RW-8,0,8,RH);
    }else{
        // Sky
        const grd=ctx.createLinearGradient(0,0,0,70);
        grd.addColorStop(0,'#87CEEB');grd.addColorStop(1,room.walls);
        ctx.fillStyle=grd;ctx.fillRect(0,0,RW,80);
        // Fence
        ctx.fillStyle='#D4A574';
        for(let x=0;x<RW;x+=50){ctx.fillRect(x,60,8,30)}
        ctx.fillRect(0,65,RW,5);
        ctx.fillRect(0,85,RW,3);
    }
}

function drawFurniture(f,highlight,room){
    ctx.save();
    if(highlight){
        ctx.shadowColor='rgba(99,102,241,0.5)';
        ctx.shadowBlur=15;
    }

    // Draw based on furniture type
    ctx.fillStyle=f.color;

    // Special renders for certain furniture
    if(f.id==='rug'){
        ctx.fillStyle='rgba(220,38,38,0.3)';
        ctx.beginPath();ctx.ellipse(f.x+f.w/2,f.y+f.h/2,f.w/2,f.h/2,0,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='rgba(220,38,38,0.4)';ctx.lineWidth=2;
        ctx.beginPath();ctx.ellipse(f.x+f.w/2,f.y+f.h/2,f.w/2-10,f.h/2-6,0,0,Math.PI*2);ctx.stroke();
    }else if(f.id==='pond'){
        ctx.fillStyle='rgba(56,189,248,0.5)';
        ctx.beginPath();ctx.ellipse(f.x+f.w/2,f.y+f.h/2,f.w/2,f.h/2,0,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=1;
        ctx.beginPath();ctx.ellipse(f.x+f.w/2-10,f.y+f.h/2-5,15,8,0.3,0,Math.PI*2);ctx.stroke();
    }else if(f.id==='tree'){
        // Trunk
        ctx.fillStyle='#92400E';
        ctx.fillRect(f.x+f.w/2-8,f.y+f.h/2,16,f.h/2);
        // Foliage
        ctx.fillStyle='#15803D';
        ctx.beginPath();ctx.arc(f.x+f.w/2,f.y+f.h/3,35,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#22C55E';
        ctx.beginPath();ctx.arc(f.x+f.w/2+10,f.y+f.h/3-8,22,0,Math.PI*2);ctx.fill();
    }else if(f.id==='bed'){
        // Mattress
        ctx.fillStyle='#8B9DC3';
        ctx.beginPath();ctx.roundRect(f.x,f.y,f.w,f.h,8);ctx.fill();
        // Pillow
        ctx.fillStyle='#FFF';
        ctx.beginPath();ctx.roundRect(f.x+10,f.y+10,40,25,6);ctx.fill();
        ctx.beginPath();ctx.roundRect(f.x+60,f.y+10,40,25,6);ctx.fill();
        // Blanket
        ctx.fillStyle=f.color;
        ctx.beginPath();ctx.roundRect(f.x+5,f.y+45,f.w-10,f.h-55,6);ctx.fill();
    }else if(f.id==='bathtub'){
        ctx.fillStyle='#E5E7EB';
        ctx.beginPath();ctx.roundRect(f.x,f.y,f.w,f.h,12);ctx.fill();
        ctx.fillStyle='rgba(56,189,248,0.3)';
        ctx.beginPath();ctx.roundRect(f.x+8,f.y+8,f.w-16,f.h-16,8);ctx.fill();
    }else if(f.id==='table'||f.id==='desk'||f.id==='counter'){
        ctx.beginPath();ctx.roundRect(f.x,f.y,f.w,f.h,4);ctx.fill();
        ctx.fillStyle=darken(f.color,.15);
        ctx.fillRect(f.x+5,f.y+f.h,4,15);
        ctx.fillRect(f.x+f.w-9,f.y+f.h,4,15);
    }else if(f.id==='pool'){
        ctx.fillStyle='#15803D';
        ctx.beginPath();ctx.roundRect(f.x,f.y,f.w,f.h,8);ctx.fill();
        ctx.fillStyle='#166534';
        ctx.beginPath();ctx.roundRect(f.x+6,f.y+6,f.w-12,f.h-12,6);ctx.fill();
        // Balls
        ctx.fillStyle='#DC2626';ctx.beginPath();ctx.arc(f.x+f.w/2,f.y+f.h/2,4,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#FFF';ctx.beginPath();ctx.arc(f.x+f.w/2+15,f.y+f.h/2+5,4,0,Math.PI*2);ctx.fill();
    }else if(f.id==='dogbed'){
        ctx.fillStyle=f.color;
        ctx.beginPath();ctx.ellipse(f.x+f.w/2,f.y+f.h/2,f.w/2,f.h/2,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=darken(f.color,.15);
        ctx.beginPath();ctx.ellipse(f.x+f.w/2,f.y+f.h/2,f.w/2-8,f.h/2-6,0,0,Math.PI*2);ctx.fill();
    }else if(f.id==='doghouse'){
        ctx.fillStyle='#92400E';ctx.beginPath();ctx.roundRect(f.x,f.y+20,f.w,f.h-20,4);ctx.fill();
        ctx.fillStyle='#7C2D12';// Roof
        ctx.beginPath();ctx.moveTo(f.x-5,f.y+22);ctx.lineTo(f.x+f.w/2,f.y-5);ctx.lineTo(f.x+f.w+5,f.y+22);ctx.closePath();ctx.fill();
        ctx.fillStyle='#1F2937';ctx.beginPath();ctx.arc(f.x+f.w/2,f.y+f.h-12,12,0,Math.PI*2);ctx.fill();
    }else if(f.id==='stairs'){
        for(let i=0;i<6;i++){
            ctx.fillStyle=i%2?'#A78B6E':'#C4A882';
            ctx.fillRect(f.x,f.y+i*(f.h/6),f.w,f.h/6);
        }
    }else if(f.id==='arcade'){
        ctx.fillStyle='#7C3AED';ctx.beginPath();ctx.roundRect(f.x,f.y,f.w,f.h,6);ctx.fill();
        ctx.fillStyle='#1F2937';ctx.fillRect(f.x+8,f.y+8,f.w-16,f.h/2-8);
        ctx.fillStyle='#22C55E';
        const blink=Math.sin(animT*3)>.5;
        if(blink)ctx.fillRect(f.x+15,f.y+15,f.w-30,f.h/2-22);
    }else if(f.id==='ball_y'){
        ctx.fillStyle='#84CC16';
        ctx.beginPath();ctx.arc(f.x+f.w/2,f.y+f.h/2,f.w/2,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='#FFF';ctx.lineWidth=1.5;
        ctx.beginPath();ctx.arc(f.x+f.w/2,f.y+f.h/2,f.w/2-3,0.5,2.2);ctx.stroke();
    }else if(f.id==='hydrant'){
        ctx.fillStyle='#EF4444';
        ctx.fillRect(f.x+5,f.y+10,f.w-10,f.h-10);
        ctx.fillRect(f.x,f.y+18,f.w,8);
        ctx.beginPath();ctx.arc(f.x+f.w/2,f.y+12,8,0,Math.PI*2);ctx.fill();
    }else{
        ctx.beginPath();ctx.roundRect(f.x,f.y,f.w,f.h,6);ctx.fill();
    }

    // Icon label
    if(f.icon){
        ctx.font='16px sans-serif';ctx.textAlign='center';
        ctx.fillText(f.icon,f.x+f.w/2,f.y-4);
    }
    // Name on highlight
    if(highlight){
        ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillStyle='#FFF';
        ctx.fillText(f.name,f.x+f.w/2,f.y-16);
    }

    ctx.restore();
}

function drawHuman(x,y){
    const active=S.controlling==='human';
    ctx.save();ctx.translate(x,y);
    // Shadow
    ctx.fillStyle='rgba(0,0,0,0.1)';
    ctx.beginPath();ctx.ellipse(0,12,12,5,0,0,Math.PI*2);ctx.fill();
    // Indicator ring
    if(active){
        ctx.strokeStyle='rgba(99,102,241,0.5)';ctx.lineWidth=2;
        ctx.beginPath();ctx.arc(0,0,20,0,Math.PI*2);ctx.stroke();
    }
    // Body
    ctx.fillStyle='#3B82F6'; // shirt
    ctx.beginPath();ctx.roundRect(-8,-2,16,16,[0,0,3,3]);ctx.fill();
    // Legs
    ctx.fillStyle='#1E3A5F';
    ctx.fillRect(-6,14,5,8);ctx.fillRect(1,14,5,8);
    // Arms
    ctx.fillStyle='#F5D5C8';
    ctx.fillRect(-12,0,5,10);ctx.fillRect(7,0,5,10);
    // Head
    ctx.fillStyle='#F5D5C8';
    ctx.beginPath();ctx.arc(0,-10,9,0,Math.PI*2);ctx.fill();
    // Hair
    ctx.fillStyle='#4A2C17';
    ctx.beginPath();ctx.arc(0,-14,8,Math.PI,Math.PI*2);ctx.fill();
    ctx.fillRect(-8,-14,16,4);
    // Eyes
    ctx.fillStyle='#1F2937';
    ctx.fillRect(-4,-11,2,2);ctx.fillRect(2,-11,2,2);
    // Smile
    ctx.strokeStyle='#1F2937';ctx.lineWidth=1;ctx.lineCap='round';
    ctx.beginPath();ctx.arc(0,-7,3,0.1,Math.PI-0.1);ctx.stroke();
    ctx.restore();
}

function drawDog(x,y){
    const breed=BREEDS.find(b=>b.id===S.breedId)||BREEDS[0];
    const active=S.controlling==='dog';
    const sz=breed.sz;
    const breathOff=Math.sin(dogBreathT)*1;
    ctx.save();ctx.translate(x,y+breathOff);

    // Shadow
    ctx.fillStyle='rgba(0,0,0,0.1)';
    ctx.beginPath();ctx.ellipse(0,14*sz,14*sz,5*sz,0,0,Math.PI*2);ctx.fill();

    // Indicator ring
    if(active){
        ctx.strokeStyle='rgba(236,72,153,0.5)';ctx.lineWidth=2;
        ctx.beginPath();ctx.arc(0,0,22*sz,0,Math.PI*2);ctx.stroke();
    }

    // Cape/wings (back accessories)
    S.equippedAcc.forEach(id=>{
        const ac=ACCESSORIES.find(a=>a.id===id);
        if(!ac||ac.slot!=='back')return;
        ctx.fillStyle=ac.color;
        if(id==='cape'){
            ctx.beginPath();ctx.moveTo(-8*sz,-4*sz);ctx.quadraticCurveTo(-14*sz,10*sz,-10*sz,18*sz);
            ctx.lineTo(10*sz,18*sz);ctx.quadraticCurveTo(14*sz,10*sz,8*sz,-4*sz);ctx.closePath();ctx.fill();
        }else if(id==='wings'){
            ctx.fillStyle='rgba(255,255,255,0.7)';
            ctx.beginPath();ctx.moveTo(-6*sz,-2*sz);ctx.quadraticCurveTo(-22*sz,-12*sz,-18*sz,2*sz);ctx.quadraticCurveTo(-12*sz,8*sz,-6*sz,2*sz);ctx.closePath();ctx.fill();
            ctx.beginPath();ctx.moveTo(6*sz,-2*sz);ctx.quadraticCurveTo(22*sz,-12*sz,18*sz,2*sz);ctx.quadraticCurveTo(12*sz,8*sz,6*sz,2*sz);ctx.closePath();ctx.fill();
        }
    });

    // Tail
    const wagAngle=Math.sin(dogWagT)*.4*(S.happy/100);
    ctx.save();ctx.translate(-12*sz,-4*sz);ctx.rotate(-0.6+wagAngle);
    ctx.fillStyle=breed.body;
    ctx.beginPath();ctx.ellipse(0,-8*sz,3*sz,10*sz,0,0,Math.PI*2);ctx.fill();
    ctx.restore();

    // Body
    ctx.fillStyle=breed.body;
    ctx.beginPath();ctx.ellipse(0,4*sz,16*sz,12*sz,0,0,Math.PI*2);ctx.fill();

    // Sweater/tutu
    S.equippedAcc.forEach(id=>{
        const ac=ACCESSORIES.find(a=>a.id===id);
        if(!ac||ac.slot!=='body')return;
        ctx.fillStyle=ac.color;
        ctx.beginPath();ctx.ellipse(0,4*sz,16*sz,12*sz,0,0,Math.PI*2);ctx.fill();
        if(id==='sweater'){
            ctx.strokeStyle=lighten(ac.color,.3);ctx.lineWidth=1;
            for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(-14*sz,(4+i*4)*sz);ctx.lineTo(14*sz,(4+i*4)*sz);ctx.stroke()}
        }
    });

    // Belly
    ctx.fillStyle=breed.belly;
    ctx.beginPath();ctx.ellipse(0,8*sz,10*sz,6*sz,0,0,Math.PI*2);ctx.fill();

    // Spots
    if(breed.spots){
        ctx.fillStyle='#1F2937';
        [[-5,0,2.5],[5,2,2],[8,6,1.5],[-7,5,2],[-2,8,1.5]].forEach(([ox,oy,r])=>{
            ctx.beginPath();ctx.arc(ox*sz,oy*sz,r*sz,0,Math.PI*2);ctx.fill()
        });
    }

    // Legs
    ctx.fillStyle=breed.body;
    [[-7,12],[-3,13],[3,13],[7,12]].forEach(([lx,ly])=>{
        ctx.fillRect((lx-2)*sz,ly*sz,4*sz,6*sz);
    });

    // Shoes/boots/socks
    S.equippedAcc.forEach(id=>{
        const ac=ACCESSORIES.find(a=>a.id===id);
        if(!ac||ac.slot!=='feet')return;
        ctx.fillStyle=ac.color;
        [[-7,17],[-3,18],[3,18],[7,17]].forEach(([lx,ly])=>{
            ctx.beginPath();ctx.ellipse(lx*sz,ly*sz,3.5*sz,2.5*sz,0,0,Math.PI*2);ctx.fill();
        });
    });

    // Head
    ctx.fillStyle=breed.body;
    ctx.beginPath();ctx.arc(0,-10*sz,10*sz,0,Math.PI*2);ctx.fill();

    // Ears
    ctx.fillStyle=breed.ear;
    if(breed.earType==='pointed'){
        [[-7,-14],[7,-14]].forEach(([ox,oy])=>{
            ctx.beginPath();ctx.moveTo((ox-3)*sz,oy*sz+4*sz);ctx.lineTo(ox*sz,(oy-7)*sz);ctx.lineTo((ox+3)*sz,oy*sz+4*sz);ctx.closePath();ctx.fill()
        })
    }else if(breed.earType==='big'){
        [[-9,-6],[9,-6]].forEach(([ox,oy])=>{
            ctx.beginPath();ctx.ellipse(ox*sz,oy*sz,4*sz,8*sz,ox<0?-0.3:0.3,0,Math.PI*2);ctx.fill()
        })
    }else if(breed.earType==='small'){
        [[-8,-12],[8,-12]].forEach(([ox,oy])=>{
            ctx.beginPath();ctx.ellipse(ox*sz,oy*sz,3*sz,4*sz,ox<0?-0.2:0.2,0,Math.PI*2);ctx.fill()
        })
    }else{
        [[-8,-7],[8,-7]].forEach(([ox,oy])=>{
            ctx.beginPath();ctx.ellipse(ox*sz,oy*sz,4*sz,7*sz,ox<0?-0.3:0.3,0,Math.PI*2);ctx.fill()
        })
    }

    // Head accessories
    S.equippedAcc.forEach(id=>{
        const ac=ACCESSORIES.find(a=>a.id===id);
        if(!ac||ac.slot!=='head')return;
        ctx.fillStyle=ac.color;
        if(id==='tophat'){
            ctx.fillRect(-7*sz,-25*sz,14*sz,4*sz);
            ctx.fillRect(-5*sz,-38*sz,10*sz,14*sz);
        }else if(id==='crown'){
            ctx.beginPath();ctx.moveTo(-7*sz,-18*sz);ctx.lineTo(-7*sz,-26*sz);ctx.lineTo(-3*sz,-22*sz);ctx.lineTo(0,-28*sz);
            ctx.lineTo(3*sz,-22*sz);ctx.lineTo(7*sz,-26*sz);ctx.lineTo(7*sz,-18*sz);ctx.closePath();ctx.fill();
        }else if(id==='party'){
            ctx.beginPath();ctx.moveTo(0,-30*sz);ctx.lineTo(-6*sz,-16*sz);ctx.lineTo(6*sz,-16*sz);ctx.closePath();ctx.fill();
        }else if(id==='wizard'){
            ctx.beginPath();ctx.moveTo(2*sz,-32*sz);ctx.lineTo(-8*sz,-16*sz);ctx.lineTo(8*sz,-16*sz);ctx.closePath();ctx.fill();
            ctx.fillStyle='#F59E0B';ctx.beginPath();ctx.ellipse(0,-16*sz,9*sz,3*sz,0,0,Math.PI*2);ctx.fill();
        }else if(id==='horns'){
            [[-5,-18],[5,-18]].forEach(([ox,oy])=>{
                ctx.beginPath();ctx.moveTo(ox*sz,oy*sz);ctx.lineTo((ox+2)*sz,(oy-8)*sz);ctx.lineTo((ox-2)*sz,(oy-1)*sz);ctx.closePath();ctx.fill();
            });
        }
    });

    // Snout
    ctx.fillStyle=breed.belly;
    ctx.beginPath();ctx.ellipse(0,-6*sz,6*sz,4*sz,0,0,Math.PI*2);ctx.fill();

    // Eye accessories
    S.equippedAcc.forEach(id=>{
        const ac=ACCESSORIES.find(a=>a.id===id);
        if(!ac||ac.slot!=='eyes')return;
        if(id==='sunglasses'){
            ctx.fillStyle='rgba(30,30,30,0.85)';
            [[-4,-12],[4,-12]].forEach(([ox,oy])=>{
                ctx.beginPath();ctx.roundRect((ox-3)*sz,(oy-2)*sz,6*sz,4*sz,1);ctx.fill();
            });
            ctx.strokeStyle='#1F2937';ctx.lineWidth=1;
            ctx.beginPath();ctx.moveTo(-1*sz,-12*sz);ctx.lineTo(1*sz,-12*sz);ctx.stroke();
        }else if(id==='aviators'){
            ctx.strokeStyle=ac.color;ctx.lineWidth=1.5;
            [[-4,-12],[4,-12]].forEach(([ox,oy])=>{
                ctx.beginPath();ctx.ellipse(ox*sz,oy*sz,4*sz,3*sz,0,0,Math.PI*2);ctx.stroke();
                ctx.fillStyle='rgba(150,100,50,0.3)';ctx.fill();
            });
        }else if(id==='monocle'){
            ctx.strokeStyle=ac.color;ctx.lineWidth=1.5;
            ctx.beginPath();ctx.arc(4*sz,-12*sz,3.5*sz,0,Math.PI*2);ctx.stroke();
        }
    });

    // Eyes (skip if sunglasses)
    const hasSunglasses=S.equippedAcc.includes('sunglasses');
    if(!hasSunglasses){
        ctx.fillStyle='#FFF';
        [[-4,-12],[4,-12]].forEach(([ox,oy])=>{ctx.beginPath();ctx.arc(ox*sz,oy*sz,2.5*sz,0,Math.PI*2);ctx.fill()});
        ctx.fillStyle='#1F2937';
        [[-4,-12],[4,-12]].forEach(([ox,oy])=>{ctx.beginPath();ctx.arc(ox*sz+.3,oy*sz+.3,1.5*sz,0,Math.PI*2);ctx.fill()});
        ctx.fillStyle='#FFF';
        [[-3.5,-12.5],[4.5,-12.5]].forEach(([ox,oy])=>{ctx.beginPath();ctx.arc(ox*sz,oy*sz,.6*sz,0,Math.PI*2);ctx.fill()});
    }

    // Nose
    ctx.fillStyle='#1F2937';
    ctx.beginPath();ctx.ellipse(0,-5*sz,2*sz,1.5*sz,0,0,Math.PI*2);ctx.fill();

    // Mouth
    ctx.strokeStyle='#1F2937';ctx.lineWidth=.8;ctx.lineCap='round';
    const smile=S.happy>60?1:S.happy>30?0:-1;
    ctx.beginPath();ctx.moveTo(-3*sz,-3*sz);ctx.quadraticCurveTo(0,(-3+2*smile)*sz,3*sz,-3*sz);ctx.stroke();

    // Tongue
    if(S.happy>50){
        ctx.fillStyle='#FF6B8A';
        ctx.beginPath();ctx.ellipse(1*sz,-1*sz,2*sz,3*sz,0.1,0,Math.PI*2);ctx.fill();
    }

    // Neck accessories
    S.equippedAcc.forEach(id=>{
        const ac=ACCESSORIES.find(a=>a.id===id);
        if(!ac||ac.slot!=='neck')return;
        ctx.fillStyle=ac.color;
        if(id==='bandana'){
            ctx.beginPath();ctx.moveTo(-8*sz,-1*sz);ctx.lineTo(8*sz,-1*sz);ctx.lineTo(0,6*sz);ctx.closePath();ctx.fill();
        }else if(id==='bowtie'){
            ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-5*sz,-2*sz);ctx.lineTo(-5*sz,2*sz);ctx.closePath();ctx.fill();
            ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(5*sz,-2*sz);ctx.lineTo(5*sz,2*sz);ctx.closePath();ctx.fill();
            ctx.fillStyle=darken(ac.color,.2);ctx.beginPath();ctx.arc(0,0,1.5*sz,0,Math.PI*2);ctx.fill();
        }else if(id==='collar'){
            ctx.strokeStyle=ac.color;ctx.lineWidth=2*sz;
            ctx.beginPath();ctx.ellipse(0,0,10*sz,4*sz,0,0,Math.PI);ctx.stroke();
            ctx.fillStyle=ac.color;ctx.beginPath();ctx.arc(0,4*sz,2*sz,0,Math.PI*2);ctx.fill();
        }else if(id==='scarf'){
            ctx.beginPath();ctx.ellipse(0,0,10*sz,4*sz,0,0,Math.PI*2);ctx.fill();
            ctx.fillRect(6*sz,0,3*sz,10*sz);
        }
    });

    // Sleeping Z's
    if(S.sleeping){
        const t=(Date.now()/1000)%3;
        ctx.font=`${8*sz}px sans-serif`;ctx.fillStyle='rgba(100,100,200,0.7)';ctx.textAlign='center';
        for(let i=0;i<3;i++){
            const off=((t+i*.8)%3)/3;
            ctx.globalAlpha=1-off;
            ctx.fillText('Z',(8+i*5)*sz,(-18-off*20)*sz);
        }
        ctx.globalAlpha=1;
    }

    ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
// ROOM TRANSITIONS
// ═══════════════════════════════════════════════════════════════
function changeRoom(to,sx,sy){
    S.room=to;
    S.humanX=sx;S.humanY=sy;
    S.dogX=sx+(S.controlling==='human'?-30:0);
    S.dogY=sy+(S.controlling==='human'?10:0);
    S.roomVisits++;
    if(!S.visitedRooms.includes(to))S.visitedRooms.push(to);
    SFX.door();
    $('hud-room').textContent=ROOMS[to].name;
    tapTarget=null;
    checkAch();
}

// ═══════════════════════════════════════════════════════════════
// INTERACTIONS
// ═══════════════════════════════════════════════════════════════
let interactCooldown=0;
function tryInteract(objId){
    if(Date.now()-interactCooldown<800)return;
    interactCooldown=Date.now();

    const room=ROOMS[S.room];
    const target=objId||nearObj;
    if(!target||!room.interactions||!room.interactions[target])return;

    const options=room.interactions[target];
    const event=options[Math.floor(Math.random()*options.length)];

    S.interactions++;

    // Apply effects
    if(event.stat)modStat(event.stat,event.amt);
    if(event.stat2)modStat(event.stat2,event.amt2);
    if(event.coins){addCoins(event.coins)}
    if(event.xp)addXp(event.xp);
    if(event.sound)SFX[event.sound]?.();
    if(event.panel)openPanel(event.panel);

    // Track positive/negative
    if(event.pos){S.posEvents++;SFX.good()}
    else{S.negEvents++;SFX.bad()}

    // Show result popup
    showResult(event.icon,event.text,event.pos);
    checkAch();
    updateHUD();
}

function showResult(icon,text,positive){
    resultPopup={icon,text,timer:2.5};
    const el=$('result-popup');
    el.classList.remove('hidden');
    $('result-icon').textContent=icon;
    $('result-text').innerHTML=text+(positive?'<br><span style="color:#22C55E">✓ Positive</span>':'<br><span style="color:#EF4444">✗ Negative</span>');
    el.style.borderColor=positive?'#22C55E':'#EF4444';
}

// ═══════════════════════════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════════════════════════
function clamp(v,min=0,max=100){return Math.max(min,Math.min(max,v))}
function modStat(stat,amt){
    S[stat]=clamp(S[stat]+amt);
    if(stat==='happy'&&S.happy>=100)S.maxHappy=true;
    updateHUD();
}
function addCoins(a){S.coins=Math.max(0,S.coins+a);S.coinsTotal+=Math.max(0,a);updateHUD()}
function addXp(a){
    S.xp+=a;
    const need=20+S.level*15;
    if(S.xp>=need){S.xp-=need;S.level++;SFX.lvl();toast(`Level Up! ${S.name} is now level ${S.level}!`)}
    updateHUD();
}

function tickStats(){
    if(S.sleeping){
        modStat('energy',5);
        modStat('hunger',-1);
        if(S.energy>=100){S.sleeping=false;toast(`${S.name} woke up!`);SFX.happy()}
        else if(Math.random()<.3)SFX.snore();
    }else{
        modStat('hunger',-2);modStat('happy',-1);modStat('energy',-1.5);modStat('hygiene',-.5);
    }
    if(S.hunger<15)modStat('health',-2);
    if(S.hygiene<15)modStat('health',-1);
    if(S.hunger>50&&S.hygiene>50)modStat('health',.5);
    checkAch();
}

function updateHUD(){
    $('hud-name').textContent=S.name;
    $('hud-level').textContent=`Lv ${S.level}`;
    $('hud-room').textContent=ROOMS[S.room]?.name||'';
    $('hud-coins').textContent=S.coins;
    $('hs-hunger').style.width=S.hunger+'%';
    $('hs-happy').style.width=S.happy+'%';
    $('hs-energy').style.width=S.energy+'%';
    $('hs-hygiene').style.width=S.hygiene+'%';
    $('hs-health').style.width=S.health+'%';
    $('hud-xp-fill').style.width=(S.xp/(20+S.level*15)*100)+'%';
}

// ═══════════════════════════════════════════════════════════════
// PANELS (Shop, Wardrobe, Tricks, Achievements, Stats, Map)
// ═══════════════════════════════════════════════════════════════
function openPanel(id){
    const body=$('panel-body');
    body.innerHTML='';
    let title='';

    if(id==='shop'){
        title='Pet Shop';
        body.innerHTML=`<div class="shop-cats"><button class="shop-cat active" data-c="acc">Accessories</button><button class="shop-cat" data-c="food">Food</button><button class="shop-cat" data-c="toys">Toys</button></div><div id="shop-grid" class="shop-grid"></div>`;
        setTimeout(()=>{
            renderShopCat('acc');
            body.querySelectorAll('.shop-cat').forEach(b=>{
                b.onclick=()=>{body.querySelectorAll('.shop-cat').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderShopCat(b.dataset.c)}
            });
        },10);
    }else if(id==='wardrobe'){
        title='Wardrobe';
        if(S.ownedAcc.length===0){body.innerHTML='<p style="color:#999;text-align:center">No accessories yet! Visit the shop.</p>';
        }else{
            const grid=document.createElement('div');grid.className='wardrobe-grid';
            S.ownedAcc.forEach(id=>{
                const ac=ACCESSORIES.find(a=>a.id===id);if(!ac)return;
                const eq=S.equippedAcc.includes(id);
                const d=document.createElement('div');d.className='ward-item'+(eq?' equipped':'');
                d.innerHTML=`<div class="wi-icon">${ac.icon}</div><div class="wi-name">${ac.name}</div>`;
                d.onclick=()=>{
                    const idx=S.equippedAcc.indexOf(id);
                    if(idx>=0){S.equippedAcc.splice(idx,1);toast(`Unequipped ${ac.name}`)}
                    else{S.equippedAcc=S.equippedAcc.filter(eid=>{const a=ACCESSORIES.find(x=>x.id===eid);return a&&a.slot!==ac.slot});S.equippedAcc.push(id);toast(`Equipped ${ac.name}!`);SFX.click()}
                    openPanel('wardrobe');
                };
                grid.appendChild(d);
            });
            body.appendChild(grid);
            body.innerHTML+='<p style="color:#999;font-size:.7em;text-align:center;margin-top:8px">Tap to equip/unequip</p>';
        }
    }else if(id==='tricks'){
        title='Tricks';
        TRICKS.forEach(tr=>{
            const learned=S.tricksLearned.includes(tr.id);
            const canLearn=S.level>=tr.lvl;
            const d=document.createElement('div');d.className='trick-item';
            d.innerHTML=`<div><div class="trick-name">${tr.name}</div><div class="trick-sub">${learned?'Learned! +'+tr.coins+' coins':'Unlock at Lv '+tr.lvl}</div></div><button class="trick-btn${learned?' done':''}" ${!canLearn&&!learned?'disabled':''}>${learned?'Perform':'Learn'}</button>`;
            d.querySelector('button').onclick=()=>{
                if(learned){
                    if(S.energy<5){toast('Too tired!');return}
                    modStat('energy',-5);modStat('happy',8);addXp(tr.xp);addCoins(tr.coins);
                    if(tr.id==='speak')SFX.bark();else SFX.trick();
                    toast(`${S.name} did ${tr.name}! +${tr.coins} coins`);
                    S.pets++;checkAch();
                }else if(canLearn){
                    S.tricksLearned.push(tr.id);SFX.trick();
                    toast(`${S.name} learned ${tr.name}!`);addXp(tr.xp);
                    openPanel('tricks');checkAch();
                }
            };
            body.appendChild(d);
        });
    }else if(id==='achievements'){
        title='Achievements';
        ACHIEVEMENTS.forEach(a=>{
            const u=S.achUnlocked.includes(a.id);
            const d=document.createElement('div');d.className='ach-item'+(u?'':' locked');
            d.innerHTML=`<div class="ach-icon">${a.icon}</div><div class="ach-info"><div class="ach-name">${a.name}</div><div class="ach-desc">${a.desc}</div></div>${u?'<div class="ach-check">✓</div>':''}`;
            body.appendChild(d);
        });
    }else if(id==='stats'){
        title='Stats';
        const age=Math.floor((Date.now()-S.created)/86400000);
        const stats=[
            ['Level',S.level],['Coins Earned',S.coinsTotal],
            ['Age',age+'d'],['Interactions',S.interactions],
            ['Pets',S.pets],['Feeds',S.feeds],
            ['Grooms',S.grooms],['Vet Visits',S.vets],
            ['Tricks',S.tricksLearned.length+'/'+TRICKS.length],
            ['Accessories',S.ownedAcc.length+'/'+ACCESSORIES.length],
            ['Achievements',S.achUnlocked.length+'/'+ACHIEVEMENTS.length],
            ['Rooms Visited',S.visitedRooms.length+'/'+ROOM_ORDER.length],
            ['Switches',S.switches],['Play Time',S.playtime+'m'],
            ['Positive Events',S.posEvents],['Negative Events',S.negEvents],
        ];
        const grid=document.createElement('div');grid.className='stat-grid';
        stats.forEach(([l,v])=>{grid.innerHTML+=`<div class="stat-card"><div class="sc-val">${v}</div><div class="sc-label">${l}</div></div>`});
        body.appendChild(grid);
    }else if(id==='map'){
        title='Mansion Map';
        const grid=document.createElement('div');grid.className='map-grid';
        const icons={living:'🛋️',kitchen:'🍳',hallway:'🚪',bedroom:'🛏️',bathroom:'🛁',yard:'🌳',gameroom:'🕹️',study:'📚'};
        ROOM_ORDER.forEach(rid=>{
            const r=ROOMS[rid];
            const d=document.createElement('div');d.className='map-room'+(S.room===rid?' current':'');
            d.innerHTML=`<span class="mr-icon">${icons[rid]||'🏠'}</span>${r.name}`;
            grid.appendChild(d);
        });
        body.appendChild(grid);
        body.innerHTML+='<p style="color:#999;font-size:.7em;text-align:center;margin-top:8px">Walk through doorways to explore rooms</p>';
    }else if(id==='feed'){
        title='Feed '+S.name;
        const grid=document.createElement('div');grid.className='food-grid';
        FOODS.forEach(f=>{
            const canAfford=f.cost<=S.coins;
            const d=document.createElement('div');d.className='food-item'+((!canAfford&&f.cost>0)?' locked':'');
            d.innerHTML=`<div class="fi-icon">${f.icon}</div><div class="fi-name">${f.name}</div><div class="fi-info">+${f.hunger} hunger, +${f.happy} happy${f.cost>0?' | 🪙'+f.cost:' | Free'}</div>`;
            d.onclick=()=>{
                if(f.cost>S.coins){toast('Not enough coins!');SFX.error();return}
                if(f.cost>0)S.coins-=f.cost;
                modStat('hunger',f.hunger);modStat('happy',f.happy);
                if(f.hp)modStat('health',f.hp);if(f.hyg)modStat('hygiene',f.hyg);
                addXp(3);S.feeds++;
                if(!S.foodsTried.includes(f.id))S.foodsTried.push(f.id);
                SFX.eat();toast(`${S.name} ate ${f.name}!`);
                closePanel();checkAch();updateHUD();
            };
            grid.appendChild(d);
        });
        body.appendChild(grid);
    }

    $('panel-title').textContent=title;
    $('panel-overlay').classList.remove('hidden');
}

function renderShopCat(cat){
    const grid=document.getElementById('shop-grid');
    if(!grid)return;grid.innerHTML='';
    let items=[];
    if(cat==='acc')items=ACCESSORIES.map(a=>({...a,type:'acc'}));
    else if(cat==='food')items=FOODS.filter(f=>f.cost>0).map(f=>({...f,type:'food',price:f.cost}));
    else if(cat==='toys')items=TOYS.map(t=>({...t,type:'toy'}));

    items.forEach(item=>{
        const owned=(item.type==='acc'&&S.ownedAcc.includes(item.id))||(item.type==='toy'&&S.ownedToys.includes(item.id));
        const d=document.createElement('div');d.className='shop-item'+(owned?' owned':'');
        d.innerHTML=`<div class="si-icon">${item.icon||'🛍️'}</div><div class="si-name">${item.name}</div><div class="si-price">🪙 ${item.price}</div>${item.desc?'<div class="si-desc">'+item.desc+'</div>':''}`;
        if(!owned){d.onclick=()=>{
            if(S.coins<item.price){toast('Not enough coins!');SFX.error();return}
            S.coins-=item.price;
            if(item.type==='acc')S.ownedAcc.push(item.id);
            else if(item.type==='toy'){S.ownedToys.push(item.id);modStat('happy',item.happy||10)}
            SFX.buy();toast(`Bought ${item.name}!`);
            renderShopCat(cat);updateHUD();checkAch();
        }}
        grid.appendChild(d);
    });
}

function closePanel(){$('panel-overlay').classList.add('hidden')}

// ═══════════════════════════════════════════════════════════════
// ACHIEVEMENTS
// ═══════════════════════════════════════════════════════════════
function checkAch(){
    const s={
        pets:S.pets,feeds:S.feeds,grooms:S.grooms,vets:S.vets,
        roomVisits:S.roomVisits,coinsTotal:S.coinsTotal,level:S.level,
        tricks:S.tricksLearned.length,accs:S.ownedAcc.length,
        photos:S.photos,interactions:S.interactions,switches:S.switches,
        streak:S.streak,maxHappy:S.maxHappy,foodsTried:S.foodsTried.length,
        toysN:S.ownedToys.length,negEvents:S.negEvents,posEvents:S.posEvents,
        playtime:S.playtime,allRooms:S.visitedRooms.length>=ROOM_ORDER.length,
    };
    ACHIEVEMENTS.forEach(a=>{
        if(!S.achUnlocked.includes(a.id)&&a.ck(s)){
            S.achUnlocked.push(a.id);SFX.ach();
            toast(`🏆 ${a.name}!`);addCoins(15);
        }
    });
}

// ═══════════════════════════════════════════════════════════════
// DAILY REWARD
// ═══════════════════════════════════════════════════════════════
function checkDaily(){
    const today=new Date().toDateString();
    if(S.lastLogin===today)return;
    const yest=new Date(Date.now()-86400000).toDateString();
    S.streak=S.lastLogin===yest?S.streak+1:1;
    S.lastLogin=today;
    const reward=10+S.streak*5;
    $('daily-reward-text').textContent=`Day ${S.streak} streak! Claim ${reward} coins!`;
    $('daily-reward').classList.remove('hidden');
    $('claim-daily').onclick=()=>{addCoins(reward);SFX.coin();$('daily-reward').classList.add('hidden');toast(`+${reward} coins!`);checkAch()};
}

// ═══════════════════════════════════════════════════════════════
// PHOTO MODE
// ═══════════════════════════════════════════════════════════════
function takePhoto(){
    SFX.photo();S.photos++;
    const link=document.createElement('a');
    link.download=`${S.name}_${S.photos}.png`;
    link.href=canvas.toDataURL();
    link.click();
    toast('Photo saved!');addCoins(2);checkAch();
}

// ═══════════════════════════════════════════════════════════════
// SAVE/LOAD
// ═══════════════════════════════════════════════════════════════
function autoSave(){try{localStorage.setItem('pawpalace2',JSON.stringify(S))}catch(e){}}
function loadGame(){
    try{const d=localStorage.getItem('pawpalace2');if(d){S={...defState(),...JSON.parse(d),session:Date.now()};return true}}catch(e){}
    return false;
}

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════
function darken(h,a){let r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);r=Math.max(0,Math.floor(r*(1-a)));g=Math.max(0,Math.floor(g*(1-a)));b=Math.max(0,Math.floor(b*(1-a)));return`#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`}
function lighten(h,a){let r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);r=Math.min(255,Math.floor(r+(255-r)*a));g=Math.min(255,Math.floor(g+(255-g)*a));b=Math.min(255,Math.floor(b+(255-b)*a));return`#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`}

function toast(msg){const t=$('toast');t.textContent=msg;t.classList.remove('hidden');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.add('hidden'),3000)}

// ═══════════════════════════════════════════════════════════════
// EVENT WIRING
// ═══════════════════════════════════════════════════════════════
$('start-btn').onclick=startGame;
$('hud-switch').onclick=switchControl;
$('panel-close').onclick=closePanel;
$('photo-btn2').onclick=takePhoto;
$('music-btn2').onclick=()=>{toggleMusic();toast(musicOn?'Music on':'Music off')};

document.querySelectorAll('.bb-btn[data-panel]').forEach(b=>{
    b.onclick=()=>openPanel(b.dataset.panel);
});

// ESC to close panel
document.addEventListener('keydown',e=>{
    if(e.key==='Escape')closePanel();
});

// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════
function init(){
    initBreeds();
    if(loadGame()){
        $('intro-screen').classList.add('hidden');
        $('game-screen').classList.remove('hidden');
        resize();
        updateHUD();
        $('control-icon').textContent=S.controlling==='human'?'🧑':'🐕';
        $('control-label').textContent=S.controlling==='human'?'You':S.name;
        checkDaily();
        requestAnimationFrame(loop);
        setInterval(tickStats,5000);
        setInterval(()=>{S.playtime++;autoSave()},60000);
        toast(`Welcome back! ${S.name} missed you!`);
        SFX.happy();
    }
}
init();

})();
