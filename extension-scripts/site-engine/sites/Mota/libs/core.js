/**
 * 初始化 start
 */

function core() {
    this.material = {
        'animates': {},
        'images': {},
        'bgms': {},
        'sounds': {},
        'ground': null,
        'items': {},
        'enemys': {},
        'icons': {},
        'events': {}
    }
    this.timeout = {
        'getItemTipTimeout': null,
        'turnHeroTimeout': null,
    }
    this.interval = {
        'heroMoveInterval': null,
        "tipAnimate": null,
        'openDoorAnimate': null,
        'animateInterval': null,
    }
    this.animateFrame = {
        'background': null,
        'globalAnimate': false,
        'twoTime': null,
        'fourTime': null,
        'boxTime': null,
        'moveTime': null,
        'speed': null,
        'weather': {
            'time': null,
            'type': null,
            'level': 0,
            'nodes': [],
            'data': null,
        }
    }
    this.musicStatus = {
        'audioContext': null, // WebAudioContext
        'startDirectly': false, // 是否直接播放（加载）音乐
        'bgmStatus': false, // 是否播放BGM
        'soundStatus': true, // 是否播放SE
        'playingBgm': null, // 正在播放的BGM
        'isPlaying': false,
    }
    this.platform = {
        'isOnline': true, // 是否http
        'isPC': true, // 是否是PC
        'isAndroid': false, // 是否是Android
        'isIOS': false, // 是否是iOS
        'isWeChat': false, // 是否是微信
        'isQQ': false, // 是否是QQ
        'isChrome': false, // 是否是Chrome
        'supportCopy': false, // 是否支持复制到剪切板

        'fileInput': null, // FileInput
        'fileReader': null, // 是否支持FileReader
        'successCallback': null, // 读取成功
        'errorCallback': null, // 读取失败
    }
    // 样式
    this.domStyle = {
        styles: [],
        scale: 1.0,
    }
    this.initStatus = {
        'played': false,

        // 勇士属性
        'hero': {},

        // 当前地图
        'floorId': null,
        'thisMap': null,
        'maps': null,
        'checkBlock': {}, // 显伤伤害

        'lockControl': false,

        // 勇士移动状态
        'heroMoving': 0,
        'heroStop': true,

        // 自动寻路相关
        'automaticRoute': {
            'autoHeroMove': false,
            'autoStep': 0,
            'movedStep': 0,
            'destStep': 0,
            'destX': null,
            'destY': null,
            'autoStepRoutes': [],
            'moveStepBeforeStop': [],
            'lastDirection': null,
            'cursorX': null,
            'cursorY': null,
            "moveDirectly": false,
        },

        // 按下键的时间：为了判定双击
        'downTime': null,

        // 路线&回放
        'route': [],
        'replay': {
            'replaying': false,
            'pausing': false,
            'animate': false, // 正在某段动画中
            'toReplay': [],
            'totalList': [],
            'speed': 1.0
        },

        // event事件
        'saveIndex': null,
        'shops': {},
        'event': {
            'id': null,
            'data': null,
            'selection': null,
            'ui': null,
        },
        'textAttribute': {
            'position': "center",
            "title": [255,215,0,1],
            "background": [0,0,0,0.85],
            "text": [255,255,255,1],
            "bold": false,
        },
        'curtainColor': null,
        'usingCenterFly':false,
        'openingDoor': null,

        // 动画
        'twoAnimateObjs': [],
        'fourAnimateObjs': [],
        'boxAnimateObjs': [],
    };
    this.status = {};
}

/////////// 系统事件相关 ///////////

////// 初始化 //////
core.prototype.init = function (coreData) {
    for (var key in coreData) {
        core[key] = coreData[key];
    }
    core.flags = core.clone(core.data.flags);
    core.values = core.clone(core.data.values);
    core.firstData = core.data.getFirstData();

    if (!core.flags.enableExperience)
        core.flags.enableLevelUp = false;
    if (!core.flags.canOpenBattleAnimate) {
        core.flags.showBattleAnimateConfirm = false;
        core.flags.battleAnimate = false;
        core.setLocalStorage('battleAnimate', false);
    }
    
    // core.initStatus.shops = core.firstData.shops;
    core.firstData.shops.forEach(function (t) {
        core.initStatus.shops[t.id] = t;
    })

    core.dom.versionLabel.innerHTML = core.firstData.version;
    core.dom.logoLabel.innerHTML = core.firstData.title;
    document.title = core.firstData.title + " - HTML5魔塔";
    document.getElementById("startLogo").innerHTML = core.firstData.title;
    core.material.items = core.items.getItems();
    core.initStatus.maps = core.maps.initMaps(core.floorIds);
    core.material.enemys = core.clone(core.enemys.getEnemys());
    core.material.icons = core.icons.getIcons();
    core.material.events = core.events.getEvents();

    core.platform.isOnline = location.protocol.indexOf("http")==0;
    if (core.platform.isOnline) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
        try {
            core.musicStatus.audioContext = new window.AudioContext();
        } catch (e) {
            console.log("该浏览器不支持AudioContext");
            core.musicStatus.audioContext = null;
        }
    }

    ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"].forEach(function (t) {
        if (navigator.userAgent.indexOf(t)>=0) {
            if (t=='iPhone' || t=='iPad' || t=='iPod') core.platform.isIOS = true;
            if (t=='Android') core.platform.isAndroid=true;
            core.platform.isPC=false;
        }
    });

    try {
        core.platform.supportCopy = document.queryCommandSupported("copy");
    }
    catch (e) {
        core.platform.supportCopy = false;
    }

    var chrome=/Chrome\/(\d+)\./i.exec(navigator.userAgent);
    if (core.isset(chrome) && parseInt(chrome[1])>=50)
        core.platform.isChrome = true;
    core.platform.isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);
    core.platform.isQQ = /QQ/i.test(navigator.userAgent);
    core.platform.isWeChat = /MicroMessenger/i.test(navigator.userAgent);

    if (window.FileReader) {
        core.platform.fileReader = new FileReader();
        core.platform.fileReader.onload = function () {
            var content=core.platform.fileReader.result;
            var obj=null;
            try {
                obj=JSON.parse(content);
                if (core.isset(obj)) {
                    if (core.isset(core.platform.successCallback))
                        core.platform.successCallback(obj);
                    return;
                }
            }
            catch (e) {
                console.log(e);
            }
            alert("不是有效的JSON文件！");

            if (core.isset(core.platform.errorCallback))
                core.platform.errorCallback();

        };
        core.platform.fileReader.onerror = function () {
            if (core.isset(core.platform.errorCallback))
                core.platform.errorCallback();
        }
    }

    if (core.platform.isPC) {
        // 如果是PC端直接加载
        core.musicStatus.startDirectly = true;
    }
    else {
        var connection = navigator.connection;
        if (core.isset(connection) && connection.type=='wifi')
            core.musicStatus.startDirectly = true;
    }

    // 先从存储中读取BGM状态
    core.musicStatus.bgmStatus = core.getLocalStorage('bgmStatus', true);
    if (!core.musicStatus.startDirectly) // 如果当前网络环境不允许
        core.musicStatus.bgmStatus = false;
    core.setLocalStorage('bgmStatus', core.musicStatus.bgmStatus);

    core.musicStatus.soundStatus = core.getLocalStorage('soundStatus', true);
    core.setLocalStorage('soundStatus', core.musicStatus.soundStatus);

    // switchs
    core.flags.battleAnimate = core.getLocalStorage('battleAnimate', core.flags.battleAnimate);
    core.flags.displayEnemyDamage = core.getLocalStorage('enemyDamage', core.flags.displayEnemyDamage);
    core.flags.displayExtraDamage = core.getLocalStorage('extraDamage', core.flags.displayExtraDamage);

    core.material.ground = new Image();
    core.material.ground.src = "images/ground.png";

    core.loader(function () {
        console.log(core.material);

        // 设置勇士高度
        core.material.icons.hero.height = core.material.images.hero.height/4;

        core.setRequestAnimationFrame();

        core.showStartAnimate();
    });
}

////// 设置requestAnimationFrame //////
core.prototype.setRequestAnimationFrame = function () {

    (function() {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
                window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                var id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
    }());

    core.animateFrame.speed = core.values.animateSpeed;
    core.animateFrame.background = core.canvas.ui.createPattern(core.material.ground, "repeat");

    var scan = {
        'up': {'x': 0, 'y': -1},
        'left': {'x': -1, 'y': 0},
        'down': {'x': 0, 'y': 1},
        'right': {'x': 1, 'y': 0}
    };
    
    var draw = function(timestamp) {

        core.animateFrame.twoTime = core.animateFrame.twoTime||timestamp;
        core.animateFrame.fourTime = core.animateFrame.fourTime||timestamp;
        core.animateFrame.boxTime = core.animateFrame.boxTime||timestamp;
        core.animateFrame.moveTime = core.animateFrame.moveTime||timestamp;
        core.animateFrame.weather.time = core.animateFrame.weather.time||timestamp;

        // Global Animate
        if (core.animateFrame.globalAnimate && core.isPlaying()) {

            if (timestamp-core.animateFrame.twoTime>core.animateFrame.speed && core.isset(core.status.twoAnimateObjs)) {

                for (var a = 0; a < core.status.twoAnimateObjs.length; a++) {
                    var obj = core.status.twoAnimateObjs[a];
                    obj.status = (obj.status+1)%2;
                    core.canvas.event.clearRect(obj.x, obj.y, 32, 32);
                    core.canvas.event.drawImage(obj.image, obj.status * 32, obj.loc * 32, 32, 32, obj.x, obj.y, 32, 32);
                }

                core.animateFrame.twoTime = timestamp;
            }

            if (timestamp-core.animateFrame.fourTime>core.animateFrame.speed/2 && core.isset(core.status.fourAnimateObjs)) {
                for (var a = 0; a < core.status.fourAnimateObjs.length; a++) {
                    var obj=core.status.fourAnimateObjs[a];
                    obj.status = (obj.status+1)%4;
                    core.canvas.event.clearRect(obj.x, obj.y, 32, 32);
                    core.canvas.event.drawImage(obj.image, obj.status * 32, obj.loc * 32, 32, 32, obj.x, obj.y, 32, 32);
                }
                // fourtime = timestamp % fourDelta;
                core.animateFrame.fourTime = timestamp;
            }

        }

        // Box
        if (timestamp-core.animateFrame.boxTime>core.animateFrame.speed && core.isset(core.status.boxAnimateObjs) && core.status.boxAnimateObjs.length>0) {
            core.drawBoxAnimate();
            core.animateFrame.boxTime = timestamp;
        }

        // Hero move
        if (timestamp-core.animateFrame.moveTime>16 && core.isset(core.status.heroMoving) && core.status.heroMoving>0) {
            var x=core.getHeroLoc('x'), y=core.getHeroLoc('y'), direction = core.getHeroLoc('direction');
            if (core.status.heroMoving<=4) {
                core.drawHero(direction, x, y, 'leftFoot', 4*core.status.heroMoving*scan[direction].x, 4*core.status.heroMoving*scan[direction].y);
            }
            else if (core.status.heroMoving<=8) {
                core.drawHero(direction, x, y, 'rightFoot', 4*core.status.heroMoving*scan[direction].x, 4*core.status.heroMoving*scan[direction].y);
            }
            core.animateFrame.moveTime = timestamp;
        }

        // weather
        if (core.isPlaying() && timestamp-core.animateFrame.weather.time>30) {
            if (core.animateFrame.weather.type == 'rain' && core.animateFrame.weather.level > 0) {

                core.clearMap('weather', 0, 0, 416, 416);

                core.canvas.weather.strokeStyle = 'rgba(174,194,224,0.8)';
                core.canvas.weather.lineWidth = 1;
                core.canvas.weather.lineCap = 'round';

                core.animateFrame.weather.nodes.forEach(function (p) {
                    core.canvas.weather.beginPath();
                    core.canvas.weather.moveTo(p.x, p.y);
                    core.canvas.weather.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
                    core.canvas.weather.stroke();

                    p.x += p.xs;
                    p.y += p.ys;
                    if (p.x > 416 || p.y > 416) {
                        p.x = Math.random() * 416;
                        p.y = -10;
                    }

                })

                core.canvas.weather.fill();

            }
            else if (core.animateFrame.weather.type == 'snow' && core.animateFrame.weather.level > 0) {

                core.clearMap('weather', 0, 0, 416, 416);

                core.canvas.weather.fillStyle = "rgba(255, 255, 255, 0.8)";
                core.canvas.weather.beginPath();

                if (!core.isset(core.animateFrame.weather.data))
                    core.animateFrame.weather.data = 0;
                core.animateFrame.weather.data += 0.01;

                var angle = core.animateFrame.weather.data;
                core.animateFrame.weather.nodes.forEach(function (p) {
                    core.canvas.weather.moveTo(p.x, p.y);
                    core.canvas.weather.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);

                    // update
                    p.x += Math.sin(angle) * 2;
                    p.y += Math.cos(angle + p.d) + 1 + p.r / 2;

                    if (p.x > 416 + 5 || p.x < -5 || p.y > 416) {
                        if (Math.random() > 1 / 3) {
                            p.x = Math.random() * 416;
                            p.y = -10;
                        }
                        else {
                            if (Math.sin(angle) > 0) {
                                p.x = -5;
                                p.y = Math.random() * 416;
                            }
                            else {
                                p.x = 416 + 5;
                                p.y = Math.random() * 416;
                            }
                        }
                    }

                })

                core.canvas.weather.fill();

            }
            core.animateFrame.weather.time = timestamp;

        }
        window.requestAnimationFrame(draw);
    }
    window.requestAnimationFrame(draw);
}

////// 显示游戏开始界面 //////
core.prototype.showStartAnimate = function (callback) {
    core.dom.startPanel.style.opacity=1;
    core.dom.startPanel.style.display="block";
    core.dom.startTop.style.opacity=1;
    core.dom.startTop.style.display="block";
    core.dom.startButtonGroup.style.display = 'none';
    core.dom.startButtons.style.display = 'block';
    core.dom.levelChooseButtons.style.display = 'none';
    core.dom.curtain.style.background = "#000000";
    core.dom.curtain.style.opacity = 0;
    core.status.played = false;
    core.clearStatus();
    core.clearMap('all');

    var opacityVal = 1;
    var startAnimate = window.setInterval(function () {
        opacityVal -= 0.03;
        if (opacityVal < 0) {
            clearInterval(startAnimate);
            core.dom.startTop.style.display = 'none';
            // core.playGame();
            core.dom.startButtonGroup.style.display = 'block';
            if (core.isset(callback)) callback();
        }
        core.dom.startTop.style.opacity = opacityVal;
    }, 20);
}

////// 隐藏游戏开始界面 //////
core.prototype.hideStartAnimate = function (callback) {
    var opacityVal = 1;
    var startAnimate = window.setInterval(function () {
        opacityVal -= 0.03;
        if (opacityVal < 0) {
            clearInterval(startAnimate);
            core.dom.startPanel.style.display = 'none';
            if (core.isset(callback)) callback();
        }
        core.dom.startPanel.style.opacity = opacityVal;
    }, 20);
}

////// 设置加载进度条进度 //////
core.prototype.setStartProgressVal = function (val) {
    core.dom.startTopProgress.style.width = val + '%';
}

////// 设置加载进度条提示文字 //////
core.prototype.setStartLoadTipText = function (text) {
    core.dom.startTopLoadTips.innerHTML = text;
}

////// 加载图片和音频 //////
core.prototype.loader = function (callback) {
    var loadedImageNum = 0, allImageNum = 0, allSoundNum = 0;
    allImageNum = core.images.length;
    for (var key in core.sounds) {
        allSoundNum += core.sounds[key].length;
    }
    for (var i = 0; i < core.images.length; i++) {
        core.loadImage(core.images[i], function (imgName, image) {
            core.setStartLoadTipText('正在加载图片 ' + imgName + "...");
            core.material.images[imgName] = image;
            loadedImageNum++;
            core.setStartLoadTipText(imgName + ' 加载完毕...');
            core.setStartProgressVal(loadedImageNum * (100 / allImageNum));
            if (loadedImageNum == allImageNum) {

                // 加载pngs
                core.material.images.pngs = {};
                if (core.pngs.length==0) {
                    core.loadAutotile(callback);
                    return;
                }
                for (var x=0;x<core.pngs.length;x++) {
                    core.loadImage(core.pngs[x], function (pngId, image) {
                        core.material.images.pngs[pngId] = image;
                        if (Object.keys(core.material.images.pngs).length==core.pngs.length) {
                            core.loadAutotile(callback);
                        }
                    });
                }
            }
        });
    }
}

////// 加载Autotile //////
core.prototype.loadAutotile = function (callback) {
    core.material.images.autotile={};
    var autotileIds = Object.keys(core.material.icons.autotile);
    if (autotileIds.length==0) {
        core.loadAnimates(callback);
        return;
    }
    for (var x=0;x<autotileIds.length;x++) {
        core.loadImage(autotileIds[x], function (autotileId, image) {
            core.material.images.autotile[autotileId]=image;
            if (Object.keys(core.material.images.autotile).length==autotileIds.length) {

                // 加载动画
                core.loadAnimates(callback);
            }
        })
    }
}

////// 加载图片 //////
core.prototype.loadImage = function (imgName, callback) {
    try {
        core.setStartLoadTipText('加载图片 ' + imgName + ' 中...');
        var name=imgName;
        if (name.indexOf(".png")<0) // 不包含"png"
            name=name+".png";
        var image = new Image();
        image.src = 'images/' + name + "?v=" + main.version;
        if (image.complete) {
            callback(imgName, image);
            return;
        }
        image.onload = function () {
            callback(imgName, image);
        }
    }
    catch (e) {
        alert(e);
    }
}

////// 加载动画 //////
core.prototype.loadAnimates = function (callback) {
    core.animates.forEach(function (t) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'animates/' + t + ".animate", true);
        xhr.overrideMimeType("text/plain; charset=x-user-defined");
        xhr.onload = function (e) {
            var content = this.responseText;
            try {
                content = JSON.parse(content);
                var data = {};

                data.ratio = content.ratio;
                data.images = [];
                data.images_rev = [];
                content.bitmaps.forEach(function (t2) {
                    if (!core.isset(t2) || t2=="") {
                        data.images.push(null);
                    }
                    else {
                        try {
                            var image = new Image();
                            image.src = t2;
                            data.images.push(image);
                        } catch (e) {
                            data.images.push(null);
                        }
                    }
                })
                data.frame = content.frame_max;
                data.frames = [];
                content.frames.forEach(function (t2) {
                    var info = [];
                    t2.forEach(function (t3) {
                        info.push({
                            'index': t3[0],
                            'x': t3[1],
                            'y': t3[2],
                            'zoom': t3[3],
                            'opacity': t3[4],
                            'mirror': t3[5]||0,
                            'angle': t3[6]||0,
                        })
                    })
                    data.frames.push(info);
                })
                core.material.animates[t] = data;
            }
            catch (ee) {
                console.log(ee);
                core.material.animates[t]=null;
            }
        }
        xhr.ontimeout = function(e) {
            console.log(e);
            core.material.animates[t]=null;
        }
        xhr.onerror = function (e) {
            console.log(e);
            core.material.animates[t]=null;
        }
        xhr.send();
    })

    core.loadMusic(callback);
}

////// 加载音频 //////
core.prototype.loadMusic = function (callback) {

    core.bgms.forEach(function (t) {

        // 判断是不是mid
        if (/^.*\.mid$/i.test(t)) {

            if (core.musicStatus.audioContext!=null) {
                core.material.bgms[t] = 'loading';
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'sounds/'+t, true);
                xhr.overrideMimeType("text/plain; charset=x-user-defined");
                xhr.onload = function(e) { //下载完成
                    try {
                        var ff = [];
                        var mx = this.responseText.length;
                        for (var z = 0; z < mx; z++)
                            ff[z] = String.fromCharCode(this.responseText.charCodeAt(z) & 255);
                        var shouldStart = core.material.bgms[t] == 'starting';
                        core.material.bgms[t] = AudioPlayer(core.musicStatus.audioContext, Replayer(MidiFile(ff.join("")), Synth(44100)), true);

                        if (shouldStart)
                            core.playBgm(t);
                    }
                    catch (ee) {
                        console.log(ee);
                        core.material.bgms[t] = null;
                    }

                };
                xhr.ontimeout = function(e) {
                    console.log(e);
                    core.material.bgms[t] = null;
                }
                xhr.onerror = function(e) {
                    console.log(e);
                    core.material.bgms[t] = null;
                }
                xhr.send();
            }
            else {
                core.material.bgms[t] = null;
            }
        }
        else {
            var music = new Audio();
            music.preload = core.musicStatus.startDirectly?'auto':'none';
            music.src = 'sounds/'+t;
            music.loop = 'loop';
            core.material.bgms[t] = music;
        }
    });

    core.sounds.forEach(function (t) {

        if (core.musicStatus.audioContext != null) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'sounds/'+t, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function(e) { //下载完成
                try {
                    core.musicStatus.audioContext.decodeAudioData(this.response, function (buffer) {
                        core.material.sounds[t] = buffer;
                    }, function (e) {
                        console.log(e);
                        core.material.sounds[t] = null;
                    })
                }
                catch (ee) {
                    console.log(ee);
                    core.material.sounds[t] = null;
                }
            };

            xhr.ontimeout = function(e) {
                console.log(e);
                core.material.sounds[t] = null;
            }
            xhr.onerror = function(e) {
                console.log(e);
                core.material.sounds[t] = null;
            }
            xhr.send();
        }
        else {
            var music = new Audio();
            music.src = 'sounds/'+t;
            core.material.sounds[t] = music;
        }

    });

    // 直接开始播放
    if (core.musicStatus.startDirectly && core.bgms.length>0)
        core.playBgm(core.bgms[0]);

    callback();
}

////// 游戏是否已经开始 //////
core.prototype.isPlaying = function() {
    if (core.isset(core.status.played) && core.status.played)
        return true;
    return false;
}

////// 清除游戏状态和数据 //////
core.prototype.clearStatus = function() {
    // 停止各个Timeout和Interval
    for (var i in core.interval) {
        clearInterval(core.interval[i]);
    }
    core.status = {};
    core.clearStatusBar();
    core.resize(main.dom.body.clientWidth, main.dom.body.clientHeight);
}

////// 重置游戏状态和初始数据 //////
core.prototype.resetStatus = function(hero, hard, floorId, route, maps) {

    // 停止各个Timeout和Interval
    for (var i in core.interval) {
        clearInterval(core.interval[i]);
    }

    // 初始化status
    core.status = core.clone(core.initStatus);
    core.status.played = true;
    // 初始化maps
    core.status.floorId = floorId;
    core.status.maps = core.clone(maps);
    // 初始化怪物
    core.material.enemys = core.clone(core.enemys.getEnemys());
    // 初始化人物属性
    core.status.hero = core.clone(hero);
    core.status.hard = hard;
    // 初始化路线
    if (core.isset(route))
        core.status.route = route;
    // 保存的Index
    core.status.saveIndex = core.getLocalStorage('saveIndex2', 1);

    core.resize(main.dom.body.clientWidth, main.dom.body.clientHeight);
}

////// 开始游戏 //////
core.prototype.startGame = function (hard, callback) {
    console.log('开始游戏');

    core.resetStatus(core.firstData.hero, hard, core.firstData.floorId, null, core.initStatus.maps);

    core.changeFloor(core.status.floorId, null, core.firstData.hero.loc, null, function() {
        if (core.isset(callback)) callback();
    });


    setTimeout(function () {
        // Upload
        var formData = new FormData();
        formData.append('type', 'people');
        formData.append('name', core.firstData.name);
        formData.append('version', core.firstData.version);
        formData.append('platform', core.platform.isPC?"PC":core.platform.isAndroid?"Android":core.platform.isIOS?"iOS":"");
        formData.append('hard', hard);
        formData.append('hardCode', core.getFlag('hard', 0));

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/games/upload.php");
        xhr.send(formData);

    })

}

////// 重新开始游戏；此函数将回到标题页面 //////
core.prototype.restart = function() {
    core.showStartAnimate();
}

/////////// 系统事件相关 END ///////////




/////////// 键盘、鼠标事件相关 ///////////

////// 按下某个键时 //////
core.prototype.onkeyDown = function(e) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;
    if (!core.isset(core.status.holdingKeys))core.status.holdingKeys=[];
    var isArrow={37:true,38:true,39:true,40:true}[e.keyCode]
    if(isArrow && !core.status.lockControl){
        for(var ii =0;ii<core.status.holdingKeys.length;ii++){
            if (core.status.holdingKeys[ii]===e.keyCode){
                return;
            }
        }
        core.status.holdingKeys.push(e.keyCode);
        core.pressKey(e.keyCode);
    } else {
        core.keyDown(e.keyCode);
    }
}

////// 放开某个键时 //////
core.prototype.onkeyUp = function(e) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) {
        if (e.keyCode==27) // ESCAPE
            core.stopReplay();
        else if (e.keyCode==90) // Z
            core.rewindReplay();
        else if (e.keyCode==88) // X
            core.forwardReplay();
        else if (e.keyCode==32) // SPACE
            core.triggerReplay();
        return;
    }

    var isArrow={37:true,38:true,39:true,40:true}[e.keyCode]
    if(isArrow && !core.status.lockControl){
        for(var ii =0;ii<core.status.holdingKeys.length;ii++){
            if (core.status.holdingKeys[ii]===e.keyCode){
                core.status.holdingKeys= core.status.holdingKeys.slice(0,ii).concat(core.status.holdingKeys.slice(ii+1));
                if (ii === core.status.holdingKeys.length && core.status.holdingKeys.length!==0)core.pressKey(core.status.holdingKeys.slice(-1)[0]);
                break;
            }
        }
        //core.stopHero();
        core.keyUp(e.keyCode);
    } else {
        core.keyUp(e.keyCode);
    }
}

////// 按住某个键时 //////
core.prototype.pressKey = function (keyCode) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;
    if (keyCode === core.status.holdingKeys.slice(-1)[0]) {
        core.keyDown(keyCode);
        window.setTimeout(function(){core.pressKey(keyCode);},30);
    }
}

////// 根据按下键的code来执行一系列操作 //////
core.prototype.keyDown = function(keyCode) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;
    /*
    if (core.isset(core.status.automaticRoute)&&core.status.automaticRoute.autoHeroMove) {
        core.stopAutomaticRoute();
    }
    */
    if (core.status.lockControl) {
        // Ctrl跳过对话
        if (keyCode==17) {
            core.events.keyDownCtrl();
            return;
        }
        if (core.status.event.id == 'action') {
            core.events.keyDownAction(keyCode);
            return;
        }
        if (core.status.event.id == 'book') {
            core.events.keyDownBook(keyCode);
            return;
        }
        if (core.status.event.id == 'fly') {
            core.events.keyDownFly(keyCode);
            return;
        }
        if (core.status.event.id == 'viewMaps') {
            core.events.keyDownViewMaps(keyCode);
            return;
        }
        if (core.status.event.id=='shop') {
            core.events.keyDownShop(keyCode);
            return;
        }
        if (core.status.event.id=='selectShop') {
            core.events.keyDownQuickShop(keyCode);
            return;
        }
        if (core.status.event.id=='toolbox') {
            core.events.keyDownToolbox(keyCode);
            return;
        }
        if (core.status.event.id=='save' || core.status.event.id=='load') {
            core.events.keyDownSL(keyCode);
            return;
        }
        if (core.status.event.id=='switchs') {
            core.events.keyDownSwitchs(keyCode);
            return;
        }
        if (core.status.event.id=='settings') {
            core.events.keyDownSettings(keyCode);
            return;
        }
        if (core.status.event.id=='syncSave') {
            core.events.keyDownSyncSave(keyCode);
            return;
        }
        if (core.status.event.id=='syncSelect') {
            core.events.keyDownSyncSelect(keyCode);
            return;
        }
        if (core.status.event.id=='localSaveSelect') {
            core.events.keyDownLocalSaveSelect(keyCode);
            return;
        }
        if (core.status.event.id=='cursor') {
            core.events.keyDownCursor(keyCode);
            return;
        }
        return;
    }
    if(!core.status.played) {
        return;
    }
    switch(keyCode) {
        case 37:
            core.moveHero('left');
        break;
        case 38:
            core.moveHero('up');
        break;
        case 39:
            core.moveHero('right');
        break;
        case 40:
            core.moveHero('down');
        break;
        case 13: case 32: case 67: case 51: // 快捷键3：飞
            // 因为加入了两次的检测机制,从keydown转移到keyup,同时保证位置信息正确,但以下情况会触发作图的bug:
            // 在鼠标的路线移动中使用飞,绿块会滞后一格,显示的位置不对,同时也不会倍以下的代码清除
            if (core.status.heroStop && core.hasItem('centerFly')) {
                if (core.status.usingCenterFly) {
                    if (core.canUseItem('centerFly')) {
                        core.useItem('centerFly');
                        core.clearMap('ui', core.getHeroLoc('x')*32,core.getHeroLoc('y')*32,32,32);
                    }
                    else {
                        core.drawTip('当前不能使用中心对称飞行器');
                        core.clearMap('ui', (12-core.getHeroLoc('x'))*32,(12-core.getHeroLoc('y'))*32,32,32);
                    }
                    core.status.usingCenterFly = false;
                } else if (keyCode==51) {
                    core.status.usingCenterFly = true;
                    core.setAlpha('ui', 0.5);
                    core.fillRect('ui',(12-core.getHeroLoc('x'))*32,(12-core.getHeroLoc('y'))*32,32,32,core.canUseItem('centerFly')?'#00FF00':'#FF0000');
                    core.setAlpha('ui', 1);
                    core.drawTip("请确认当前中心对称飞行器的位置");
                }
            }
            break;
    }
    if (core.status.usingCenterFly && keyCode!=51) {
        core.clearMap('ui', (12-core.getHeroLoc('x'))*32,(12-core.getHeroLoc('y'))*32,32,32);
        core.status.usingCenterFly= false;
    }
}

////// 根据放开键的code来执行一系列操作 //////
core.prototype.keyUp = function(keyCode) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;

    if (core.status.lockControl) {
        core.status.holdingKeys = [];
        // 全键盘操作部分
        if (core.status.event.id == 'text' && (keyCode==13 || keyCode==32 || keyCode==67)) {
            core.drawText();
            return;
        }
        if (core.status.event.id=='confirmBox') {
            core.events.keyUpConfirmBox(keyCode);
            return;
        }
        if (core.status.event.id == 'action') {
            core.events.keyUpAction(keyCode);
            return;
        }
        if (core.status.event.id=='about' && (keyCode==13 || keyCode==32 || keyCode==67)) {
            core.events.clickAbout();
            return;
        }
        if (core.status.event.id=='book') {
            core.events.keyUpBook(keyCode);
            return;
        }
        if (core.status.event.id=='book-detail' && (keyCode==13 || keyCode==32 || keyCode==67)) {
            core.events.clickBookDetail();
            return;
        }
        if (core.status.event.id=='fly') {
            core.events.keyUpFly(keyCode);
            return;
        }
        if (core.status.event.id == 'viewMaps') {
            core.events.keyUpViewMaps(keyCode);
            return;
        }
        if (core.status.event.id=='shop') {
            core.events.keyUpShop(keyCode);
            return;
        }
        if (core.status.event.id=='selectShop') {
            core.events.keyUpQuickShop(keyCode);
            return;
        }
        if (core.status.event.id=='toolbox') {
            core.events.keyUpToolbox(keyCode);
            return;
        }
        if (core.status.event.id=='save' || core.status.event.id=='load') {
            core.events.keyUpSL(keyCode);
            return;
        }
        if (core.status.event.id=='switchs') {
            core.events.keyUpSwitchs(keyCode);
            return;
        }
        if (core.status.event.id=='settings') {
            core.events.keyUpSettings(keyCode);
            return;
        }
        if (core.status.event.id=='syncSave') {
            core.events.keyUpSyncSave(keyCode);
            return;
        }
        if (core.status.event.id=='syncSelect') {
            core.events.keyUpSyncSelect(keyCode);
            return;
        }
        if (core.status.event.id=='localSaveSelect') {
            core.events.keyUpLocalSaveSelect(keyCode);
            return;
        }

        if (core.status.event.id=='cursor') {
            core.events.keyUpCursor(keyCode);
            return;
        }
        return;
    }

    if(!core.status.played)
        return;

    switch (keyCode) {
        case 27: // ESC
            if (core.status.heroStop)
                core.openSettings(true);
            break;
        case 71: // G
            if (core.status.heroStop)
                core.useFly(true);
            break;
        case 88: // X
            if (core.status.heroStop)
                core.openBook(true);
            break;
        case 65: // A
            core.doSL("autoSave", "load");
            break;
        case 83: // S
            if (core.status.heroStop)
                core.save(true);
            break;
        case 68: // D
            if (core.status.heroStop)
                core.load(true);
            break;
        case 69: // E
            if (core.status.heroStop)
                core.ui.drawCursor();
            break;
        case 84: // T
            if (core.status.heroStop)
                core.openToolbox(true);
            break;
        case 90: // Z
            if (core.status.heroStop)
                core.turnHero();
            break;
        case 75: // K
            if (core.status.heroStop)
                core.openQuickShop(true);
            break;
        case 32: // SPACE
            if (!core.status.lockControl && core.status.heroStop)
                core.getNextItem();
            break;
        case 72: // H
            if (!core.status.lockControl && core.status.heroStop)
                core.ui.drawHelp();
            break;
        case 82: // R
            if (!core.status.lockControl && core.status.heroStop) {
                core.ui.drawConfirmBox("确定要回放录像吗？", function () {
                    core.ui.closePanel();
                    var hard=core.status.hard, route=core.clone(core.status.route);
                    core.resetStatus(core.firstData.hero, hard, core.firstData.floorId, null, core.initStatus.maps);
                    core.events.setInitData(hard);
                    core.changeFloor(core.status.floorId, null, core.firstData.hero.loc, null, function() {
                        core.startReplay(route);
                    });
                }, function () {
                    core.ui.closePanel();
                });
            }
            break;
        case 33: case 34: // PAGEUP/PAGEDOWN
            if (core.status.heroStop) {
                if (core.flags.enableViewMaps) {
                    core.ui.drawMaps(core.floorIds.indexOf(core.status.floorId));
                }
                else {
                    core.drawTip("本塔不允许浏览地图！");
                }
            }
            break;
        case 37: // UP
            break;
        case 38: // DOWN
            break;
        case 39: // RIGHT
            break;
        case 40: // DOWN
            break;
        case 49: // 快捷键1：破
            if (core.status.heroStop && core.hasItem('pickaxe')) {
                if (core.canUseItem('pickaxe')) {
                    core.useItem('pickaxe');
                }
                else {
                    core.drawTip('当前不能使用破墙镐');
                }
            }
            break;
        case 50: // 快捷键2：炸
            if (core.status.heroStop) {
                if (core.hasItem('bomb')) {
                    if (core.canUseItem('bomb')) {
                        core.useItem('bomb');
                    }
                    else {
                        core.drawTip('当前不能使用炸弹');
                    }
                }
                else if (core.hasItem('hammer')) {
                    if (core.canUseItem('hammer')) {
                        core.useItem('hammer');
                    }
                    else {
                        core.drawTip('当前不能使用圣锤');
                    }

                }
            }
            break;
        
    }

    if (core.isset(core.status.automaticRoute)&&core.status.automaticRoute.autoHeroMove) {
        core.stopAutomaticRoute();
    }

    core.stopHero();

}

////// 点击（触摸）事件按下时 //////
core.prototype.ondown = function (x ,y) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;
    if (!core.status.played || core.status.lockControl) {
        core.onclick(x, y, []);
        return;
    }

    core.status.downTime = new Date();
    // core.status.holdingPath=1;
    //core.status.mouseOutCheck =1;
    // window.setTimeout(core.clearStepPostfix);
    core.saveCanvas('ui');
    core.clearMap('ui', 0, 0, 416,416);
    var pos={'x':x,'y':y}
    core.status.stepPostfix=[];
    core.status.stepPostfix.push(pos);
    core.fillPosWithPoint(pos);
}

////// 当在触摸屏上滑动时 //////
core.prototype.onmove = function (x ,y) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;
    // if (core.status.holdingPath==0){return;}
    //core.status.mouseOutCheck =1;
    var pos={'x':x,'y':y};
    var pos0=core.status.stepPostfix[core.status.stepPostfix.length-1];
    var directionDistance=[pos.y-pos0.y,pos0.x-pos.x,pos0.y-pos.y,pos.x-pos0.x];
    var max=0,index=4;
    for(var ii=0;ii<4;ii++){
        if(directionDistance[ii]>max){
            index=ii;
            max=directionDistance[ii];
        }
    }
    pos=[{'x':0,'y':1},{'x':-1,'y':0},{'x':0,'y':-1},{'x':1,'y':0},false][index]
    if(pos){
        pos.x+=pos0.x;
        pos.y+=pos0.y;
        core.status.stepPostfix.push(pos);
        core.fillPosWithPoint(pos);
    }
}

////// 当点击（触摸）事件放开时 //////
core.prototype.onup = function () {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;
    // core.status.holdingPath=0;
    if(core.status.stepPostfix.length>0){
        var stepPostfix = [];
        var direction={'0':{'1':'down','-1':'up'},'-1':{'0':'left'},'1':{'0':'right'}};
        for(var ii=1;ii<core.status.stepPostfix.length;ii++){
            var pos0 = core.status.stepPostfix[ii-1];
            var pos = core.status.stepPostfix[ii];
            stepPostfix.push({'direction': direction[pos.x-pos0.x][pos.y-pos0.y], 'x': pos.x, 'y': pos.y});
        }
        var posx=core.status.stepPostfix[0].x;
        var posy=core.status.stepPostfix[0].y;
        core.status.stepPostfix=[];
        if (!core.status.lockControl) {
            core.canvas.ui.clearRect(0, 0, 416,416);
            core.canvas.ui.restore();
        }

        // 长按
        if (!core.status.lockControl && stepPostfix.length==0 && core.status.downTime!=null && new Date()-core.status.downTime>=1000) {
            core.events.longClick();
        }
        else {
            //posx,posy是寻路的目标点,stepPostfix是后续的移动
            core.onclick(posx,posy,stepPostfix);
        }
        core.status.downTime=null;
    }
}

////// 获得点击事件相对左上角的坐标（0到12之间） //////
core.prototype.getClickLoc = function (x, y) {
    
    var statusBar = {'x': 0, 'y': 0};
    var size = 32;
    size = size * core.domStyle.scale;

    switch (core.domStyle.screenMode) {// 这里的3是指statusBar和游戏画布之间的白线宽度
        case 'vertical':
            statusBar.x = 0;
            statusBar.y = core.dom.statusBar.offsetHeight + 3;
            break;
        case 'horizontal':
        case 'bigScreen':
            statusBar.x = core.dom.statusBar.offsetWidth + 3;
            statusBar.y = 0;
            break;
    }
    
    var left = core.dom.gameGroup.offsetLeft + statusBar.x;
    var top = core.dom.gameGroup.offsetTop + statusBar.y;
    var loc={'x': x - left, 'y': y - top, 'size': size};
    return loc;
}

////// 具体点击屏幕上(x,y)点时，执行的操作 //////
core.prototype.onclick = function (x, y, stepPostfix) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;
    // console.log("Click: (" + x + "," + y + ")");

    stepPostfix=stepPostfix||[];

    // 非游戏屏幕内
    if (x<0 || y<0 || x>12 || y>12) return;

    // 中心对称飞行器
    if (core.status.usingCenterFly) {
        if (x!=12-core.getHeroLoc('x') || y!=12-core.getHeroLoc('y')) {
            core.clearMap('ui', (12-core.getHeroLoc('x'))*32,(12-core.getHeroLoc('y'))*32,32,32);
        } else {
            if (core.canUseItem('centerFly')) {
                core.useItem('centerFly');
                core.clearMap('ui', core.getHeroLoc('x')*32,core.getHeroLoc('y')*32,32,32);
                return;
            }
            else {
                core.drawTip('当前不能使用中心对称飞行器');
                core.clearMap('ui', (12-core.getHeroLoc('x'))*32,(12-core.getHeroLoc('y'))*32,32,32);
            }
        }
        core.status.usingCenterFly= false;
    }

    // 寻路
    if (!core.status.lockControl) {
        core.setAutomaticRoute(x, y, stepPostfix);
        return;
    }

    // 怪物手册
    if (core.status.event.id == 'book') {
        core.events.clickBook(x,y);
        return;
    }

    // 怪物详细信息
    if (core.status.event.id == 'book-detail') {
        core.events.clickBookDetail(x,y);
        return;
    }

    // 楼层飞行器
    if (core.status.event.id == 'fly') {
        core.events.clickFly(x,y);
        return;
    }

    // 查看地图
    if (core.status.event.id == 'viewMaps') {
        core.events.clickViewMaps(x,y);
        return;
    }

    // 开关
    if (core.status.event.id == 'switchs') {
        core.events.clickSwitchs(x,y);
        return;
    }

    // 设置
    if (core.status.event.id == 'settings') {
        core.events.clickSettings(x,y);
        return;
    }

    // 商店
    if (core.status.event.id == 'shop') {
        core.events.clickShop(x,y);
        return;
    }

    // 快捷商店
    if (core.status.event.id == 'selectShop') {
        core.events.clickQuickShop(x,y);
        return;
    }

    // 工具栏
    if (core.status.event.id == 'toolbox') {
        core.events.clickToolbox(x,y);
        return;
    }

    // 存读档
    if (core.status.event.id == 'save' || core.status.event.id == 'load') {
        core.events.clickSL(x,y);
        return;
    }

    // 选项
    if (core.status.event.id == 'confirmBox') {
        core.events.clickConfirmBox(x,y);
        return;
    }

    if (core.status.event.id == 'keyBoard') {
        core.events.clickKeyBoard(x,y);
        return;
    }

    // 关于
    if (core.status.event.id == 'about') {
        core.events.clickAbout(x,y);
        return;
    }

    if (core.status.event.id == 'action') {
        core.events.clickAction(x,y);
        return;
    }

    // 纯文本
    if (core.status.event.id == 'text') {
        core.drawText();
        return;
    }

    // 同步存档
    if (core.status.event.id == 'syncSave') {
        core.events.clickSyncSave(x,y);
        return;
    }

    if (core.status.event.id == 'syncSelect') {
        core.events.clickSyncSelect(x,y);
        return;
    }

    if (core.status.event.id == 'localSaveSelect') {
        core.events.clickLocalSaveSelect(x,y);
        return;
    }

    if (core.status.event.id == 'cursor') {
        core.events.clickCursor(x,y);
        return;
    }

}

////// 滑动鼠标滚轮时的操作 //////
core.prototype.onmousewheel = function (direct) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;
    // 向下滚动是 -1 ,向上是 1

    // 楼层飞行器
    if (core.status.lockControl && core.status.event.id == 'fly') {
        if (direct==1) core.ui.drawFly(core.status.event.data+1);
        if (direct==-1) core.ui.drawFly(core.status.event.data-1);
        return;
    }

    // 怪物手册
    if (core.status.lockControl && core.status.event.id == 'book') {
        if (direct==1) core.ui.drawBook(core.status.event.data - 6);
        if (direct==-1) core.ui.drawBook(core.status.event.data + 6);
        return;
    }

    // 存读档
    if (core.status.lockControl && (core.status.event.id == 'save' || core.status.event.id == 'load')) {
        if (direct==1) core.ui.drawSLPanel(core.status.event.data - 10);
        if (direct==-1) core.ui.drawSLPanel(core.status.event.data + 10);
        return;
    }

    // 浏览地图
    if (core.status.lockControl && core.status.event.id == 'viewMaps') {
        if (direct==1) core.ui.drawMaps(core.status.event.data+1);
        if (direct==-1) core.ui.drawMaps(core.status.event.data-1);
        return;
    }
}

/////////// 键盘、鼠标事件相关 END ///////////




/////////// 寻路代码相关 ///////////

////// 清除自动寻路路线 //////
core.prototype.clearAutomaticRouteNode = function (x, y) {
    if (core.status.event.id==null)
        core.canvas.ui.clearRect(x * 32 + 5, y * 32 + 5, 27, 27);
}

////// 停止自动寻路操作 //////
core.prototype.stopAutomaticRoute = function () {
    if (!core.status.played) {
        return;
    }
    core.status.automaticRoute.autoHeroMove = false;
    core.status.automaticRoute.autoStep = 0;
    core.status.automaticRoute.destStep = 0;
    core.status.automaticRoute.movedStep = 0;
    core.status.automaticRoute.autoStepRoutes = [];
    core.status.automaticRoute.destX=null;
    core.status.automaticRoute.destY=null;
    core.status.automaticRoute.lastDirection = null;
    core.stopHero();
    if (core.status.automaticRoute.moveStepBeforeStop.length==0)
        core.canvas.ui.clearRect(0, 0, 416, 416);
}

////// 继续剩下的自动寻路操作 //////
core.prototype.continueAutomaticRoute = function () {
    // 此函数只应由events.afterOpenDoor和events.afterBattle调用
    var moveStep = core.status.automaticRoute.moveStepBeforeStop;
    //core.status.automaticRoute.moveStepBeforeStop = [];
    if(moveStep.length===0 || (moveStep.length===1 && moveStep[0].step===1)) {
        core.status.automaticRoute.moveStepBeforeStop = [];
    }
    else {
        core.setAutoHeroMove(moveStep);
    }
}

////// 清空剩下的自动寻路列表 //////
core.prototype.clearContinueAutomaticRoute = function () {
    core.canvas.ui.clearRect(0, 0, 416, 416);
    core.status.automaticRoute.moveStepBeforeStop=[];
}

////// 设置自动寻路路线 //////
core.prototype.setAutomaticRoute = function (destX, destY, stepPostfix) {
    if (!core.status.played || core.status.lockControl) {
        return;
    }
    // 正在寻路中
    if (core.status.automaticRoute.autoHeroMove) {
        var lastX = core.status.automaticRoute.destX, lastY=core.status.automaticRoute.destY;
        core.stopAutomaticRoute();
        if (lastX==destX && lastY==destY) {
            core.status.automaticRoute.moveDirectly = true;
            setTimeout(function () {
                if (core.status.automaticRoute.moveDirectly) {
                    if (core.canMoveDirectly(destX, destY)) {
                        core.clearMap('hero', 0, 0, 416, 416);
                        core.setHeroLoc('x', destX);
                        core.setHeroLoc('y', destY);
                        core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
                        core.status.route.push("move:"+destX+":"+destY);
                    }
                }
                core.status.automaticRoute.moveDirectly = false;
            }, 100);
        }
        return;
    }
    if (destX == core.status.hero.loc.x && destY == core.status.hero.loc.y && stepPostfix.length==0) {
        if (core.timeout.turnHeroTimeout==null) {
            core.timeout.turnHeroTimeout = setTimeout(function() {
                core.turnHero();
                clearTimeout(core.timeout.turnHeroTimeout);
                core.timeout.turnHeroTimeout = null;
            }, 250);
        }
        else {
            clearTimeout(core.timeout.turnHeroTimeout);
            core.timeout.turnHeroTimeout = null;
            core.getNextItem();
        }
        return;
    }
    var step = 0;
    var tempStep = null;
    var moveStep;
    if (!(moveStep = core.automaticRoute(destX, destY))) {
        if (destX == core.status.hero.loc.x && destY == core.status.hero.loc.y){
            moveStep=[];
        } else {
            core.canvas.ui.clearRect(0, 0, 416, 416);
            return;
        }
    }
    moveStep=moveStep.concat(stepPostfix);
    core.status.automaticRoute.destX=destX;
    core.status.automaticRoute.destY=destY;
    core.canvas.ui.save();
    core.canvas.ui.clearRect(0, 0, 416, 416);
    core.canvas.ui.fillStyle = '#bfbfbf';
    core.canvas.ui.strokeStyle = '#bfbfbf';
    core.canvas.ui.lineWidth = 8;
    for (var m = 0; m < moveStep.length; m++) {
        if (tempStep == null) {
            step++;
            tempStep = moveStep[m].direction;
        }
        else if (tempStep == moveStep[m].direction) {
            step++;
        }
        else {
            //core.status.automaticRoutingTemp.moveStep.push({'direction': tempStep, 'step': step});
            core.status.automaticRoute.autoStepRoutes.push({'direction': tempStep, 'step': step});
            step = 1;
            tempStep = moveStep[m].direction;
        }
        if (m == moveStep.length - 1) {
            // core.status.automaticRoutingTemp.moveStep.push({'direction': tempStep, 'step': step});
            core.status.automaticRoute.autoStepRoutes.push({'direction': tempStep, 'step': step});
            core.canvas.ui.fillRect(moveStep[m].x * 32 + 10, moveStep[m].y * 32 + 10, 12, 12);
        }
        else {
            core.canvas.ui.beginPath();
            if (core.isset(moveStep[m + 1]) && tempStep != moveStep[m + 1].direction) {
                if (tempStep == 'up' && moveStep[m + 1].direction == 'left' || tempStep == 'right' && moveStep[m + 1].direction == 'down') {
                    core.canvas.ui.moveTo(moveStep[m].x * 32 + 5, moveStep[m].y * 32 + 16);
                    core.canvas.ui.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 16);
                    core.canvas.ui.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 27);
                }
                else if (tempStep == 'up' && moveStep[m + 1].direction == 'right' || tempStep == 'left' && moveStep[m + 1].direction == 'down') {
                    core.canvas.ui.moveTo(moveStep[m].x * 32 + 27, moveStep[m].y * 32 + 16);
                    core.canvas.ui.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 16);
                    core.canvas.ui.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 27);
                }
                else if (tempStep == 'left' && moveStep[m + 1].direction == 'up' || tempStep == 'down' && moveStep[m + 1].direction == 'right') {
                    core.canvas.ui.moveTo(moveStep[m].x * 32 + 27, moveStep[m].y * 32 + 16);
                    core.canvas.ui.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 16);
                    core.canvas.ui.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 5);
                }
                else if (tempStep == 'right' && moveStep[m + 1].direction == 'up' || tempStep == 'down' && moveStep[m + 1].direction == 'left') {
                    core.canvas.ui.moveTo(moveStep[m].x * 32 + 5, moveStep[m].y * 32 + 16);
                    core.canvas.ui.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 16);
                    core.canvas.ui.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 5);
                }
                core.canvas.ui.stroke();
                continue;
            }
            switch (tempStep) {
                case 'up':
                case 'down':
                    core.canvas.ui.beginPath();
                    core.canvas.ui.moveTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 5);
                    core.canvas.ui.lineTo(moveStep[m].x * 32 + 16, moveStep[m].y * 32 + 27);
                    core.canvas.ui.stroke();
                    break;
                case 'left':
                case 'right':
                    core.canvas.ui.beginPath();
                    core.canvas.ui.moveTo(moveStep[m].x * 32 + 5, moveStep[m].y * 32 + 16);
                    core.canvas.ui.lineTo(moveStep[m].x * 32 + 27, moveStep[m].y * 32 + 16);
                    core.canvas.ui.stroke();
                    break;
            }
        }
    }
    core.canvas.ui.restore();

    // 立刻移动
    core.setAutoHeroMove();

}

////// 自动寻路算法，找寻最优路径 //////
core.prototype.automaticRoute = function (destX, destY) {
    var startX = core.getHeroLoc('x');
    var startY = core.getHeroLoc('y');
    var scan = {
        'up': {'x': 0, 'y': -1},
        'left': {'x': -1, 'y': 0},
        'down': {'x': 0, 'y': 1},
        'right': {'x': 1, 'y': 0}
    };
    var queue = [];
    var nowDeep = 0;
    var route = [];
    var ans = []
    
    if (destX == startX && destY == startY) return false;
    queue.push(13 * startX + startY);
    queue.push(-1);
    route[13 * startX + startY] = '';
    
    while (queue.length != 1) {
        var f = queue.shift();
        if (f===-1) {nowDeep+=1;queue.push(-1);continue;}
        var deep = ~~(f/169);
        if (deep!==nowDeep) {queue.push(f);continue;}
        f=f%169;
        var nowX = parseInt(f / 13), nowY = f % 13;
        var nowIsArrow = false, nowId, nowBlock = core.getBlock(nowX,nowY);
        /*
        if (nowBlock!=null){
            nowId = nowBlock.block.event.id;
            nowIsArrow = nowId.slice(0, 5).toLowerCase() == 'arrow';
        }
        */
        for (var direction in scan) {
            /*
            if(nowIsArrow){
                var nowArrow = nowId.slice(5).toLowerCase();
                if (direction != nowArrow) continue;
            }
            */
            if (!core.canMoveHero(nowX, nowY, direction))
                continue;
            
            var nx = nowX + scan[direction].x;
            var ny = nowY + scan[direction].y;

            if (nx<0 || nx>12 || ny<0 || ny>12) continue;

            var nid = 13 * nx + ny;
    
            if (core.isset(route[nid])) continue;

            var deepAdd=1;

            var nextId, nextBlock = core.getBlock(nx,ny);
            if (nextBlock!=null){
                nextId = nextBlock.block.event.id;
                /*
                // 遇到单向箭头处理
                var isArrow = nextId.slice(0, 5).toLowerCase() == 'arrow';
                if(isArrow){
                    var nextArrow = nextId.slice(5).toLowerCase();
                    if ( (scan[direction].x + scan[nextArrow].x) == 0 && (scan[direction].y + scan[nextArrow].y) == 0 ) continue;
                }
                */
                // 绕过亮灯（因为只有一次通行机会很宝贵）
                if(nextId == "light") deepAdd=100;
                // 绕过路障
                if (nextId.substring(nextId.length-3)=="Net") deepAdd=core.values.lavaDamage;
                // 绕过血瓶
                if (!core.flags.potionWhileRouting && nextId.substring(nextId.length-6)=="Potion") deepAdd=20;
                // 绕过传送点
                if  (nextBlock.block.event.trigger == 'changeFloor') deepAdd = 10;
            }
            if (core.status.checkBlock.damage[nid]>0)
                deepAdd = core.status.checkBlock.damage[nid];

            if (nx == destX && ny == destY) {
                route[nid] = direction;
                break;
            }
            if (core.noPassExists(nx, ny))
                continue;
            
            route[nid] = direction;
            queue.push(169*(nowDeep+deepAdd)+nid);
        }
        if (core.isset(route[13 * destX + destY])) break;
    }

    if (!core.isset(route[13 * destX + destY])) {
        return false;
    }

    var nowX = destX, nowY = destY;
    while (nowX != startX || nowY != startY) {
        var dir = route[13 * nowX + nowY];
        ans.push({'direction': dir, 'x': nowX, 'y': nowY});
        nowX -= scan[dir].x;
        nowY -= scan[dir].y;
    }

    ans.reverse();
    return ans;
}

////// 显示离散的寻路点 //////
core.prototype.fillPosWithPoint = function (pos) {
    core.fillRect('ui', pos.x*32+12,pos.y*32+12,8,8, '#bfbfbf');
}

/*
////// 清除已经寻路过的部分 //////
core.prototype.clearStepPostfix = function () {
    if(core.status.mouseOutCheck >0){
        core.status.mouseOutCheck--;
        window.setTimeout(core.clearStepPostfix,1000);
        return;
    }
    core.status.holdingPath=0;
    if(core.status.stepPostfix.length>0){
        core.status.stepPostfix=[];
        core.canvas.ui.clearRect(0, 0, 416,416);
        core.canvas.ui.restore();
    }
}
*/

/////////// 寻路代码相关 END ///////////



/////////// 自动行走 & 行走控制 ///////////

////// 设置勇士的自动行走路线 //////
core.prototype.setAutoHeroMove = function (steps) {
    steps=steps||core.status.automaticRoute.autoStepRoutes;
    if (steps.length == 0) {
        return;
    }
    core.status.automaticRoute.autoStepRoutes=steps;
    core.status.automaticRoute.autoHeroMove = true;
    core.status.automaticRoute.autoStep = 1;
    core.status.automaticRoute.destStep = steps[0].step;
    core.moveHero(steps[0].direction);
}

////// 设置行走的效果动画 //////
core.prototype.setHeroMoveInterval = function (direction, x, y, callback) {
    if (core.status.heroMoving>0) {
        return;
    }
    core.status.heroMoving=1;
    // core.status.heroMoving = true;
    // var moveStep = 0;
    var scan = {
        'up': {'x': 0, 'y': -1},
        'left': {'x': -1, 'y': 0},
        'down': {'x': 0, 'y': 1},
        'right': {'x': 1, 'y': 0}
    };
    core.interval.heroMoveInterval = window.setInterval(function () {
        core.status.heroMoving++;
        /*
        if (moveStep<=4) {
            core.drawHero(direction, x, y, 'leftFoot', 4*moveStep*scan[direction].x, 4*moveStep*scan[direction].y);
        }
        else if (moveStep<8) {
            core.drawHero(direction, x, y, 'rightFoot', 4*moveStep*scan[direction].x, 4*moveStep*scan[direction].y);
        }
        */
        if (core.status.heroMoving==8) {
            core.setHeroLoc('x', x+scan[direction].x);
            core.setHeroLoc('y', y+scan[direction].y);
            core.moveOneStep();
            core.clearMap('hero', 0, 0, 416, 416);
            core.drawHero(direction, core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
            //if (core.status.heroStop)
            //    core.drawHero(direction, core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
            clearInterval(core.interval.heroMoveInterval);
            core.status.heroMoving = 0;
            if (core.isset(callback)) callback();
        }
    }, 12.5 / core.status.replay.speed);
}

////// 实际每一步的行走过程 //////
core.prototype.moveAction = function (callback) {
    if (core.interval.openDoorAnimate!=null) return; // 开门判断
    if (core.status.heroMoving>0) return;
    var scan = {
        'up': {'x': 0, 'y': -1},
        'left': {'x': -1, 'y': 0},
        'down': {'x': 0, 'y': 1},
        'right': {'x': 1, 'y': 0}
    };
    var direction = core.getHeroLoc('direction');
    var x = core.getHeroLoc('x');
    var y = core.getHeroLoc('y');
    var noPass = core.noPass(x + scan[direction].x, y + scan[direction].y), canMove = core.canMoveHero();
    if (noPass || !canMove) {
        if (core.status.event.id!='ski')
            core.status.route.push(direction);
        core.status.automaticRoute.moveStepBeforeStop = [];
        if (canMove) // 非箭头：触发
            core.trigger(x + scan[direction].x, y + scan[direction].y);
        core.drawHero(direction, x, y, 'stop');

        // core.clearContinueAutomaticRoute();
        if (core.status.automaticRoute.moveStepBeforeStop.length==0) {
            core.clearContinueAutomaticRoute();
            core.stopAutomaticRoute();
        }

        /*
        if (core.status.automaticRoute.autoHeroMove) {

            core.status.automaticRoute.movedStep++;
            if (core.status.automaticRoute.destStep == core.status.automaticRoute.movedStep) {
                core.status.automaticRoute.autoHeroMove = false;
                core.status.automaticRoute.destStep = 0;
                core.status.automaticRoute.movedStep = 0;
                core.status.automaticRoute.moveStepBeforeStop=[];
                core.stopAutomaticRoute();
            }
        }
        else {
            // core.status.heroStop = true;
            core.stopHero();
        }
        */
        if (core.isset(callback))
            callback();
    }
    else {
        core.setHeroMoveInterval(direction, x, y, function () {
            if (core.status.automaticRoute.autoHeroMove) {
                core.status.automaticRoute.movedStep++;
                core.status.automaticRoute.lastDirection = core.getHeroLoc('direction');
                if (core.status.automaticRoute.destStep == core.status.automaticRoute.movedStep) {
                    if (core.status.automaticRoute.autoStep == core.status.automaticRoute.autoStepRoutes.length) {
                        core.clearContinueAutomaticRoute();
                        core.stopAutomaticRoute();
                    }
                    else {
                        core.status.automaticRoute.movedStep = 0;
                        core.status.automaticRoute.destStep = core.status.automaticRoute.autoStepRoutes[core.status.automaticRoute.autoStep].step;
                        core.setHeroLoc('direction', core.status.automaticRoute.autoStepRoutes[core.status.automaticRoute.autoStep].direction);
                        core.status.automaticRoute.autoStep++;
                    }
                }
            }
            else if (core.status.heroStop) {
                core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
            }
            if (core.status.event.id!='ski')
                core.status.route.push(direction);
            core.trigger(core.getHeroLoc('x'), core.getHeroLoc('y'));
            core.checkBlock();
            if (core.isset(callback)) callback();
        });
    }
}

////// 转向 //////
core.prototype.turnHero = function() {
    if (core.status.hero.loc.direction == 'up') core.status.hero.loc.direction = 'right';
    else if (core.status.hero.loc.direction == 'right') core.status.hero.loc.direction = 'down';
    else if (core.status.hero.loc.direction == 'down') core.status.hero.loc.direction = 'left';
    else if (core.status.hero.loc.direction == 'left') core.status.hero.loc.direction = 'up';
    core.drawHero(core.status.hero.loc.direction, core.status.hero.loc.x, core.status.hero.loc.y, 'stop', 0, 0);
    core.canvas.ui.clearRect(0, 0, 416, 416);
    core.status.route.push("turn");
}

////// 勇士能否前往某方向 //////
core.prototype.canMoveHero = function(x,y,direction,floorId) {
    if (!core.isset(x)) x=core.getHeroLoc('x');
    if (!core.isset(y)) y=core.getHeroLoc('y');
    if (!core.isset(direction)) direction=core.getHeroLoc('direction');
    if (!core.isset(floorId)) floorId=core.status.floorId;

    // 检查当前块的cannotMove
    if (core.isset(core.floors[floorId].cannotMove)) {
        var cannotMove = core.floors[floorId].cannotMove[x+","+y];
        if (core.isset(cannotMove) && cannotMove instanceof Array && cannotMove.indexOf(direction)>=0)
            return false;
    }

    var nowBlock = core.getBlock(x,y,floorId);
    if (nowBlock!=null){
        nowId = nowBlock.block.event.id;
        var nowIsArrow = nowId.slice(0, 5).toLowerCase() == 'arrow';
        if(nowIsArrow){
            var nowArrow = nowId.slice(5).toLowerCase();
            if (direction != nowArrow) {
                return false;
            }
        }
    }
    var scan = {
        'up': {'x': 0, 'y': -1},
        'left': {'x': -1, 'y': 0},
        'down': {'x': 0, 'y': 1},
        'right': {'x': 1, 'y': 0}
    };
    var nextBlock = core.getBlock(x+scan[direction].x,y+scan[direction].y,floorId);
    if (nextBlock!=null){
        nextId = nextBlock.block.event.id;
        // 遇到单向箭头处理
        var isArrow = nextId.slice(0, 5).toLowerCase() == 'arrow';
        if(isArrow){
            var nextArrow = nextId.slice(5).toLowerCase();
            if ( (scan[direction].x + scan[nextArrow].x) == 0 && (scan[direction].y + scan[nextArrow].y) == 0 ) {
                return false;
            }
        }
    }
    return true;
}

////// 能否瞬间移动 //////
core.prototype.canMoveDirectly = function (destX,destY) {
    if (!core.flags.enableMoveDirectly) return false;

    // 中毒状态：不能
    if (core.hasFlag('poison')) return false;

    var fromX = core.getHeroLoc('x'), fromY = core.getHeroLoc('y');
    if (fromX==destX&&fromY==destY) return false;

    if (core.getBlock(fromX,fromY)!=null||core.status.checkBlock.damage[13*fromX+fromY]>0)
        return false;

    // BFS
    var visited=[], queue=[];
    visited[13*fromX+fromY]=true;
    queue.push(13*fromX+fromY);

    var directions = [[-1,0],[1,0],[0,1],[0,-1]];
    while (queue.length>0) {
        var now=queue.shift(), nowX=parseInt(now/13), nowY=now%13;

        for (var dir in directions) {
            var nx=nowX+directions[dir][0], ny=nowY+directions[dir][1];
            if (nx<0||nx>=13||ny<0||ny>=13||visited[13*nx+ny]||core.getBlock(nx,ny)!=null||core.status.checkBlock.damage[13*nx+ny]>0) continue;
            if (nx==destX&&ny==destY) return true;
            visited[13*nx+ny]=true;
            queue.push(13*nx+ny);
        }
    }
    return false;
}

////// 让勇士开始移动 //////
core.prototype.moveHero = function (direction, callback) {
    // 如果正在移动，直接return
    if (core.status.heroMoving>0) return;
    if (core.isset(direction))
        core.setHeroLoc('direction', direction);
    if (!core.isset(callback)) { // 如果不存在回调函数，则使用heroMoveTrigger
        core.status.heroStop = false;
        core.status.automaticRoute.moveDirectly = false;

        var doAction = function () {
            if (!core.status.heroStop) {
                core.moveAction();
                setTimeout(doAction, 50);
            }
            else {
                core.stopHero();
            }
        }
        doAction();
    }
    else { // 否则，只向某个方向移动一步，然后调用callback
        core.moveAction(function () {
            callback();
        })
    }
}

/////// 使用事件让勇士移动。这个函数将不会触发任何事件 //////
core.prototype.eventMoveHero = function(steps, time, callback) {

    time = time || 100;

    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 1.0);

    // 要运行的轨迹：将steps展开
    var moveSteps=[];
    steps.forEach(function (e) {
        if (typeof e=="string") {
            moveSteps.push(e);
        }
        else {
            if (!core.isset(e.value)) {
                moveSteps.push(e.direction)
            }
            else {
                for (var i=0;i<e.value;i++) {
                    moveSteps.push(e.direction);
                }
            }
        }
    });

    var step=0;
    var scan = {
        'up': {'x': 0, 'y': -1},
        'left': {'x': -1, 'y': 0},
        'down': {'x': 0, 'y': 1},
        'right': {'x': 1, 'y': 0}
    };

    core.status.replay.animate=true;

    var animate=window.setInterval(function() {
        var x=core.getHeroLoc('x'), y=core.getHeroLoc('y');
        if (moveSteps.length==0) {
            clearInterval(animate);
            core.drawHero(core.getHeroLoc('direction'), x, y, 'stop');
            core.status.replay.animate=false;
            if (core.isset(callback)) callback();
        }
        else {
            var direction = moveSteps[0];
            core.setHeroLoc('direction', direction);
            step++;
            if (step <= 4) {
                core.drawHero(direction, x, y, 'leftFoot', 4 * step * scan[direction].x, 4 * step * scan[direction].y);
            }
            else if (step <= 8) {
                core.drawHero(direction, x, y, 'rightFoot', 4 * step * scan[direction].x, 4 * step * scan[direction].y);
            }
            if (step == 8) {
                step = 0;
                core.setHeroLoc('x', x + scan[direction].x);
                core.setHeroLoc('y', y + scan[direction].y);
                moveSteps.shift();
            }
        }
    }, time / 8 / core.status.replay.speed)
}

////// 每移动一格后执行的事件 //////
core.prototype.moveOneStep = function() {
    core.status.hero.steps++;
    // 中毒状态
    if (core.hasFlag('poison')) {
        core.status.hero.hp -= core.values.poisonDamage;
        if (core.status.hero.hp<=0) {
            core.status.hero.hp=0;
            core.updateStatusBar();
            core.events.lose('poison');
            return;
        }
        core.updateStatusBar();
    }
}

////// 停止勇士的一切行动，等待勇士行动结束后，再执行callback //////
core.prototype.waitHeroToStop = function(callback) {
    core.stopAutomaticRoute();
    core.clearContinueAutomaticRoute();
    if (core.isset(callback)) {
        core.status.replay.animate=true;
        core.lockControl();
        core.status.automaticRoute.moveDirectly = false;
        setTimeout(function(){
            core.status.replay.animate=false;
            core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
            callback();
        }, 30);
    }
}

////// 停止勇士的移动状态 //////
core.prototype.stopHero = function () {
    core.status.heroStop = true;
}

////// 绘制勇士 //////
core.prototype.drawHero = function (direction, x, y, status, offsetX, offsetY) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    var dx=offsetX==0?0:offsetX/Math.abs(offsetX), dy=offsetY==0?0:offsetY/Math.abs(offsetY);
    core.clearAutomaticRouteNode(x+dx, y+dy);
    var heroIcon = core.material.icons.hero[direction];
    x = x * 32;
    y = y * 32;
    core.canvas.hero.clearRect(x - 32, y - 32, 96, 96);
    var height=core.material.icons.hero.height;
    core.canvas.hero.drawImage(core.material.images.hero, heroIcon[status] * 32, heroIcon.loc * height, 32, height, x + offsetX, y + offsetY + 32-height, 32, height);
}

////// 设置勇士的位置 //////
core.prototype.setHeroLoc = function (itemName, itemVal) {
    if (itemVal == '++') {
        core.status.hero.loc[itemName]++;
        return;
    }
    else if (itemVal == '--') {
        core.status.hero.loc[itemName]--;
        return;
    }
    core.status.hero.loc[itemName] = itemVal;
}

////// 获得勇士的位置 //////
core.prototype.getHeroLoc = function (itemName) {
    if (!core.isset(itemName)) return core.status.hero.loc;
    return core.status.hero.loc[itemName];
}

////// 获得勇士面对位置的x坐标 //////
core.prototype.nextX = function() {
    var scan = {
        'up': {'x': 0, 'y': -1},
        'left': {'x': -1, 'y': 0},
        'down': {'x': 0, 'y': 1},
        'right': {'x': 1, 'y': 0}
    };
    return core.getHeroLoc('x')+scan[core.getHeroLoc('direction')].x;
}

////// 获得勇士面对位置的y坐标 //////
core.prototype.nextY = function () {
    var scan = {
        'up': {'x': 0, 'y': -1},
        'left': {'x': -1, 'y': 0},
        'down': {'x': 0, 'y': 1},
        'right': {'x': 1, 'y': 0}
    };
    return core.getHeroLoc('y')+scan[core.getHeroLoc('direction')].y;
}

/////////// 自动行走 & 行走控制 END ///////////



/////////// 地图处理 ///////////

////// 开门 //////
core.prototype.openDoor = function (id, x, y, needKey, callback) {

    if (core.interval.openDoorAnimate!=null) return;

    // 是否存在门
    if (!core.terrainExists(x, y, id)) {
        if (core.isset(callback)) callback();
        return;
    }
    if (core.status.automaticRoute.moveStepBeforeStop.length==0) {
        core.status.automaticRoute.moveStepBeforeStop=core.status.automaticRoute.autoStepRoutes.slice(core.status.automaticRoute.autoStep-1,core.status.automaticRoute.autoStepRoutes.length);
        if (core.status.automaticRoute.moveStepBeforeStop.length>=1)core.status.automaticRoute.moveStepBeforeStop[0].step-=core.status.automaticRoute.movedStep;
    }

    core.stopAutomaticRoute();
    var speed=30;
    if (needKey) {
        var key = id.replace("Door", "Key");
        if (!core.hasItem(key)) {
            if (key != "specialKey")
                core.drawTip("你没有" + core.material.items[key].name);
            else core.drawTip("无法开启此门");
            core.clearContinueAutomaticRoute();
            return;
        }
        core.autosave(true);
        core.removeItem(key);
    }

    // open
    core.playSound("door.ogg");
    var state = 0;
    var doorId = id;
    if (!(doorId.substring(doorId.length-4)=="Door")) {
        doorId=doorId+"Door";
        speed=100;
    }
    var door = core.material.icons.animates[doorId];
    core.status.replay.animate=true;
    core.interval.openDoorAnimate = window.setInterval(function () {
        state++;
        if (state == 4) {
            clearInterval(core.interval.openDoorAnimate);
            core.interval.openDoorAnimate=null;
            core.removeBlock(x, y);
            core.status.replay.animate=false;
            core.events.afterOpenDoor(id,x,y,callback);
            return;
        }
        core.canvas.event.clearRect(32 * x, 32 * y, 32, 32);
        core.canvas.event.drawImage(core.material.images.animates, 32 * state, 32 * door, 32, 32, 32 * x, 32 * y, 32, 32);
    }, speed)
}

////// 战斗 //////
core.prototype.battle = function (id, x, y, force, callback) {
    if (core.status.automaticRoute.moveStepBeforeStop.length==0) {
        core.status.automaticRoute.moveStepBeforeStop=core.status.automaticRoute.autoStepRoutes.slice(core.status.automaticRoute.autoStep-1,core.status.automaticRoute.autoStepRoutes.length);
        if (core.status.automaticRoute.moveStepBeforeStop.length>=1)core.status.automaticRoute.moveStepBeforeStop[0].step-=core.status.automaticRoute.movedStep;
    }
    core.stopHero();
    core.stopAutomaticRoute();

    var damage = core.enemys.getDamage(id);
    // 非强制战斗
    if (damage >= core.status.hero.hp && !force) {
        core.drawTip("你打不过此怪物！");
        core.clearContinueAutomaticRoute();
        return;
    }

    if (!core.isset(core.status.event.id)) // 自动存档
        core.autosave(true);

    if (core.flags.battleAnimate&&!core.status.replay.replaying) {
        core.waitHeroToStop(function() {
            core.ui.drawBattleAnimate(id, function() {
                core.afterBattle(id, x, y, callback);
            });
        });
    }
    else {

        if (core.flags.equipment && core.getFlag('sword', 'sword0')!='sword0') {
            core.playSound('zone.ogg');
            core.drawAnimate('sword', x, y);
        }
        else {
            core.playSound('attack.ogg');
            core.drawAnimate('hand', x, y);
        }

        core.afterBattle(id, x, y, callback);
    }
}

////// 战斗完毕 //////
core.prototype.afterBattle = function(id, x, y, callback) {
    core.status.hero.hp -= core.enemys.getDamage(id);
    if (core.status.hero.hp<=0) {
        core.status.hero.hp=0;
        core.updateStatusBar();
        core.events.lose('battle');
        return;
    }
    var money = core.material.enemys[id].money;
    if (core.hasItem('coin')) money *= 2;
    if (core.hasFlag('curse')) money=0;
    core.status.hero.money += money;
    var experience = core.material.enemys[id].experience;
    if (core.hasFlag('curse')) experience=0;
    core.status.hero.experience += experience;
    if (core.isset(x) && core.isset(y)) {
        core.removeBlock(x, y);
        core.canvas.event.clearRect(32 * x, 32 * y, 32, 32);
    }
    // core.updateStatusBar();
    var hint = "打败 " + core.material.enemys[id].name;
    if (core.flags.enableMoney)
        hint += "，金币+" + money;
    if (core.flags.enableExperience)
        hint += "，经验+" + experience;
    core.drawTip(hint);

    // 打完怪物，触发事件
    core.events.afterBattle(id,x,y,callback);

}

////// 触发(x,y)点的事件 //////
core.prototype.trigger = function (x, y) {
    var mapBlocks = core.status.thisMap.blocks;
    var noPass;
    for (var b = 0; b < mapBlocks.length; b++) {
        if (mapBlocks[b].x == x && mapBlocks[b].y == y && !(core.isset(mapBlocks[b].enable) && !mapBlocks[b].enable)) { // 启用事件
            noPass = mapBlocks[b].event && mapBlocks[b].event.noPass;
            if (noPass) {
                core.clearAutomaticRouteNode(x, y);
            }
            if (core.isset(mapBlocks[b].event) && core.isset(mapBlocks[b].event.trigger)) {
                var trigger = mapBlocks[b].event.trigger;

                // 转换楼层能否穿透
                if (trigger=='changeFloor' && !noPass) {
                    var canCross = core.flags.portalWithoutTrigger;
                    if (core.isset(mapBlocks[b].event.data) && core.isset(mapBlocks[b].event.data.portalWithoutTrigger))
                        canCross=mapBlocks[b].event.data.portalWithoutTrigger;
                    if (canCross) {
                        if (core.status.replay.replaying) {
                            if (core.status.replay.toReplay[0]=='no') {
                                core.status.replay.toReplay.shift();
                                core.status.route.push("no");
                                continue;
                            }
                        }
                        else if (core.status.automaticRoute.autoHeroMove || core.status.automaticRoute.autoStep<core.status.automaticRoute.autoStepRoutes.length) {
                            core.status.route.push("no");
                            continue;
                        }
                    }
                }
                core.status.automaticRoute.moveDirectly = false;
                core.material.events[trigger](mapBlocks[b], core, function (data) {

                });
            }
        }
    }
}

////// 楼层切换 //////
core.prototype.changeFloor = function (floorId, stair, heroLoc, time, callback) {

    var displayAnimate=!(time==0) && !core.status.replay.replaying;

    time = time || 800;
    time /= 20;
    core.lockControl();
    core.stopHero();
    core.stopAutomaticRoute();
    core.clearContinueAutomaticRoute();
    core.status.replay.animate=true;
    core.dom.floorNameLabel.innerHTML = core.status.maps[floorId].title;
    if (!core.isset(stair) && !core.isset(heroLoc))
        heroLoc = core.status.hero.loc;
    if (core.isset(stair)) {
        if (!core.isset(heroLoc)) heroLoc={};
        var blocks = core.status.maps[floorId].blocks;
        for (var i in blocks) {
            if (core.isset(blocks[i].event) && !(core.isset(blocks[i].enable) && !blocks[i].enable) && blocks[i].event.id === stair) {
                heroLoc.x = blocks[i].x;
                heroLoc.y = blocks[i].y;
                break;
            }
        }
        if (!core.isset(heroLoc.x)) {
            heroLoc.x=core.status.hero.loc.x;
            heroLoc.y=core.status.hero.loc.y;
        }
    }
    if (core.status.maps[floorId].canFlyTo && core.status.hero.flyRange.indexOf(floorId)<0) {
        if (core.floorIds.indexOf(floorId)>core.floorIds.indexOf(core.status.floorId))
            core.status.hero.flyRange.push(floorId);
        else
            core.status.hero.flyRange.unshift(floorId);
    }

    window.setTimeout(function () {

        var changing = function () {

            // 根据文字判断是否斜体
            var floorName = core.status.maps[floorId].name;
            if (!core.isset(floorName) || floorName=="") floorName="&nbsp;"
            core.statusBar.floor.innerHTML = floorName;
            if (/^[+-]?\d+$/.test(floorName))
                core.statusBar.floor.style.fontStyle = 'italic';
            else core.statusBar.floor.style.fontStyle = 'normal';

            // 更改BGM
            if (core.isset(core.floors[floorId].bgm)) {
                core.playBgm(core.floors[floorId].bgm);
            }

            // 不存在事件时，更改画面色调
            if (core.status.event.id == null) {
                // 默认画面色调
                if (core.isset(core.floors[floorId].color)) {
                    var color = core.floors[floorId].color;

                    // 直接变色
                    core.dom.curtain.style.background = core.arrayToRGB(color);
                    if (core.isset(color[3]))
                        core.dom.curtain.style.opacity = color[3];
                    else core.dom.curtain.style.opacity=1;
                    core.status.curtainColor = color;
                }
                else {
                    core.dom.curtain.style.background = "#000000";
                    core.dom.curtain.style.opacity = 0;
                }
            }

            // 更改天气
            if (core.isset(core.floors[floorId].weather)) {
                core.setWeather(core.floors[floorId].weather[0], core.floors[floorId].weather[1])
            }
            else core.setWeather();

            core.drawMap(floorId, function () {
                setTimeout(function() {
                    if (core.isset(heroLoc.direction))
                        core.setHeroLoc('direction', heroLoc.direction);
                    core.setHeroLoc('x', heroLoc.x);
                    core.setHeroLoc('y', heroLoc.y);
                    core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
                    core.updateStatusBar();

                    var changed = function () {
                        core.unLockControl();
                        core.status.replay.animate=false;
                        core.events.afterChangeFloor(floorId);
                        if (core.isset(callback)) callback();
                    }
                    if (displayAnimate) {
                        core.mapChangeAnimate('hide', time/4, function () {
                            changed();
                        });
                    }
                    else {
                        changed();
                    }
                }, 25)
            });
        }
        core.playSound('floor.mp3');
        if (displayAnimate) {
            core.mapChangeAnimate('show', time/2, function () {
                changing();
            });
        }
        else {
            changing();
        }
    }, 25);
}

////// 地图切换动画效果 //////
core.prototype.mapChangeAnimate = function (mode, time, callback) {
    if (mode == 'show') {
        core.show(core.dom.floorMsgGroup, time, function () {
            callback();
        });
    }
    else {
        core.hide(core.dom.floorMsgGroup, time, function () {
            callback();
        });
    }
}

////// 清除地图 //////
core.prototype.clearMap = function (map, x, y, width, height) {
    if (map == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].clearRect(0, 0, 416, 416);
        }
    }
    else {
        core.canvas[map].clearRect(x, y, width, height);
    }
}

////// 在某个canvas上绘制一段文字 //////
core.prototype.fillText = function (map, text, x, y, style, font) {
    if (core.isset(style)) {
        core.setFillStyle(map, style);
    }
    if (core.isset(font)) {
        core.setFont(map, font);
    }
    core.canvas[map].fillText(text, x, y);
}

////// 在某个canvas上绘制一个矩形 //////
core.prototype.fillRect = function (map, x, y, width, height, style) {
    if (core.isset(style)) {
        core.setFillStyle(map, style);
    }
    core.canvas[map].fillRect(x, y, width, height);
}

////// 在某个canvas上绘制一个矩形的边框 //////
core.prototype.strokeRect = function (map, x, y, width, height, style, lineWidth) {
    if (core.isset(style)) {
        core.setStrokeStyle(map, style);
    }
    if (core.isset(lineWidth)) {
        core.setLineWidth(map, lineWidth);
    }
    core.canvas[map].strokeRect(x, y, width, height);
}

////// 在某个canvas上绘制一条线 //////
core.prototype.drawLine = function (map, x1, y1, x2, y2, style, lineWidth) {
    if (core.isset(style)) {
        core.setStrokeStyle(map, style);
    }
    if (core.isset(lineWidth)) {
        core.setLineWidth(map, lineWidth);
    }
    core.canvas[map].beginPath();
    core.canvas[map].moveTo(x1, y1);
    core.canvas[map].lineTo(x2, y2);
    core.canvas[map].closePath();
    core.canvas[map].stroke();
}

////// 设置某个canvas的文字字体 //////
core.prototype.setFont = function (map, font) {
    core.canvas[map].font = font;
}

////// 设置某个canvas的线宽度 //////
core.prototype.setLineWidth = function (map, lineWidth) {
    if (map == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].lineWidth = lineWidth;
        }
    }
    core.canvas[map].lineWidth = lineWidth;
}

////// 保存某个canvas状态 //////
core.prototype.saveCanvas = function (map) {
    core.canvas[map].save();
}

////// 加载某个canvas状态 //////
core.prototype.loadCanvas = function (map) {
    core.canvas[map].restore();
}

////// 设置某个canvas边框属性 //////
core.prototype.setStrokeStyle = function (map, style) {
    if (map == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].strokeStyle = style;
        }
    }
    else {
        core.canvas[map].strokeStyle = style;
    }
}

////// 设置某个canvas的alpha值 //////
core.prototype.setAlpha = function (map, alpha) {
    if (map == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].globalAlpha = alpha;
        }
    }
    else core.canvas[map].globalAlpha = alpha;
}

////// 设置某个canvas的透明度 //////
core.prototype.setOpacity = function (map, opacity) {
    if (map == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].canvas.style.opacity = opacity;
        }
    }
    else core.canvas[map].canvas.style.opacity = opacity;
}

////// 设置某个canvas的绘制属性（如颜色等） //////
core.prototype.setFillStyle = function (map, style) {
    if (map == 'all') {
        for (var m in core.canvas) {
            core.canvas[m].fillStyle = style;
        }
    }
    else {
        core.canvas[map].fillStyle = style;
    }
}

////// 绘制某张地图 //////
core.prototype.drawMap = function (mapName, callback) {
    var mapData = core.status.maps[mapName];
    var mapBlocks = mapData.blocks;
    core.status.floorId = mapName;
    core.status.thisMap = mapData;
    core.clearMap('all');
    core.removeGlobalAnimate(null, null, true);
    var groundId = core.floors[mapName].defaultGround || "ground";
    var blockIcon = core.material.icons.terrains[groundId];
    var blockImage = core.material.images.terrains;
    for (var x = 0; x < 13; x++) {
        for (var y = 0; y < 13; y++) {
            core.canvas.bg.drawImage(blockImage, 0, blockIcon * 32, 32, 32, x * 32, y * 32, 32, 32);
        }
    }

    // 如果存在png
    if (core.isset(core.floors[mapName].png)) {

        var x=0, y=0, size=416;

        var png = core.floors[mapName].png;

        var ratio = size/416;

        if (typeof png == 'string') {
            if (core.isset(core.material.images.pngs[png])) {
                core.canvas.bg.drawImage(core.material.images.pngs[png], x, y, size, size);
            }
        }
        else if (png instanceof Array) {
            png.forEach(function (t) {
                if (t.length!=3) return;
                var dx=parseInt(t[0]), dy=parseInt(t[1]), p=t[2];
                if (core.isset(dx) && core.isset(dy) && core.isset(core.material.images.pngs[p])) {
                    dx*=32; dy*=32;
                    var image = core.material.images.pngs[p];
                    core.canvas.bg.drawImage(image, x+dx*ratio, y+dy*ratio, Math.min(size-dx*ratio, ratio*image.width), Math.min(size-dy*ratio, ratio*image.height));
                }
            })
        }
    }

    var mapArray = core.maps.getMapArray(mapBlocks);
    for (var b = 0; b < mapBlocks.length; b++) {
        // 事件启用
        var block = mapBlocks[b];
        if (core.isset(block.event) && !(core.isset(block.enable) && !block.enable)) {
            if (block.event.cls == 'autotile') {
                core.drawAutotile(core.canvas.event, mapArray, block, 32, 0, 0);
            }
            else {
                if (block.event.id!='none') {
                    blockIcon = core.material.icons[block.event.cls][block.event.id];
                    blockImage = core.material.images[block.event.cls];
                    core.canvas.event.drawImage(core.material.images[block.event.cls], 0, blockIcon * 32, 32, 32, block.x * 32, block.y * 32, 32, 32);
                    core.addGlobalAnimate(block.event.animate, block.x * 32, block.y * 32, blockIcon, blockImage);
                }
            }
        }
    }
    core.setGlobalAnimate(core.values.animateSpeed);
    if (core.isset(callback))
        callback();
}

////// 绘制Autotile //////
core.prototype.drawAutotile = function(ctx, mapArr, block, size, left, top){
    var indexArrs = [ //16种组合的图块索引数组; // 将autotile分割成48块16*16的小块; 数组索引即对应各个小块
    //                                       +----+----+----+----+----+----+
        [10,  9,  4, 3 ],  //0   bin:0000      | 1  | 2  | 3  | 4  | 5  | 6  |
        [10,  9,  4, 13],  //1   bin:0001      +----+----+----+----+----+----+
        [10,  9, 18, 3 ],  //2   bin:0010      | 7  | 8  | 9  | 10 | 11 | 12 |
        [10,  9, 16, 15],  //3   bin:0011      +----+----+----+----+----+----+
        [10, 43,  4, 3 ],  //4   bin:0100      | 13 | 14 | 15 | 16 | 17 | 18 |
        [10, 31,  4, 25],  //5   bin:0101      +----+----+----+----+----+----+
        [10,  7,  2, 3 ],  //6   bin:0110      | 19 | 20 | 21 | 22 | 23 | 24 |
        [10, 31, 16, 5 ],  //7   bin:0111      +----+----+----+----+----+----+
        [48,  9,  4, 3 ],  //8   bin:1000      | 25 | 26 | 27 | 28 | 29 | 30 |
        [ 8,  9,  4, 1 ],  //9   bin:1001      +----+----+----+----+----+----+
        [36,  9, 30, 3 ],  //10  bin:1010      | 31 | 32 | 33 | 34 | 35 | 36 |
        [36,  9,  6, 15],  //11  bin:1011      +----+----+----+----+----+----+
        [46, 45,  4, 3 ],  //12  bin:1100      | 37 | 38 | 39 | 40 | 41 | 42 |
        [46, 11,  4, 25],  //13  bin:1101      +----+----+----+----+----+----+
        [12, 45, 30, 3 ],  //14  bin:1110      | 43 | 44 | 45 | 46 | 47 | 48 |
        [34, 33, 28, 27]   //15  bin:1111      +----+----+----+----+----+----+
    ];
    
    var drawBlockByIndex = function(ctx, dx, dy, autotileImg, index, size){ //index为autotile的图块索引1-48
        var sx = 16*((index-1)%6), sy = 16*(~~((index-1)/6));
        ctx.drawImage(autotileImg, sx, sy, 16, 16, dx, dy, size/2, size/2);
    }
    var getAutotileAroundId = function(currId, x, y){
        if(x<0 || y<0 || x>12 || y>12) return 1;
        else return mapArr[y][x]==currId ? 1:0;
    }
    var checkAround = function(x, y){ // 得到周围四个32*32块（周围每块都包含当前块的1/4，不清楚的话画下图你就明白）的数组索引
        var currId = mapArr[y][x];
        var pointBlock = [];
        for(var i=0; i<4; i++){
            var bsum = 0;
            var offsetx = i%2, offsety = ~~(i/2);
            for(var j=0; j<4; j++){
            var mx = j%2, my = ~~(j/2);
            var b = getAutotileAroundId(currId, x+offsetx+mx-1, y+offsety+my-1);
            bsum += b*(Math.pow(2, 3-j));
            }
            pointBlock.push(bsum);
        }
        return pointBlock;
    }
    var getAutotileIndexs = function(x, y){
        var indexArr = [];
        var pointBlocks = checkAround(x, y);
        for(var i=0; i<4; i++){
            var arr = indexArrs[pointBlocks[i]]
            indexArr.push(arr[3-i]);
        }
        return indexArr;
    }
    // 开始绘制autotile
    var x = block.x, y = block.y;
    var pieceIndexs = getAutotileIndexs(x, y);

    //修正四个边角的固定搭配
    if(pieceIndexs[0] == 13){
      if(pieceIndexs[1] == 16) pieceIndexs[1] = 14;
      if(pieceIndexs[2] == 31) pieceIndexs[2] = 19;
    }
    if(pieceIndexs[1] == 18){
      if(pieceIndexs[0] == 15) pieceIndexs[0] = 17;
      if(pieceIndexs[3] == 36) pieceIndexs[3] = 24;
    }
    if(pieceIndexs[2] == 43){
      if(pieceIndexs[0] == 25) pieceIndexs[0] = 37;
      if(pieceIndexs[3] == 46) pieceIndexs[3] = 44;
    }
    if(pieceIndexs[3] == 48){
      if(pieceIndexs[1] == 30) pieceIndexs[1] = 42;
      if(pieceIndexs[2] == 45) pieceIndexs[2] = 47;
    }
    for(var i=0; i<4; i++){
      var index = pieceIndexs[i];
      var dx = x*size + size/2*(i%2), dy = y*size + size/2*(~~(i/2));
      drawBlockByIndex(ctx, dx+left, dy+top, core.material.images['autotile'][block.event.id], index, size);
    }
}

////// 某个点是否不可通行 //////
core.prototype.noPassExists = function (x, y, floorId) {
    var block = core.getBlock(x,y,floorId);
    if (block==null) return false;
    return core.isset(block.block.event.noPass) && block.block.event.noPass;
}

////// 某个点是否在区域内且不可通行 //////
core.prototype.noPass = function (x, y) {
    return x<0 || x>12 || y<0 || y>12 || core.noPassExists(x,y);
}

////// 某个点是否存在NPC //////
core.prototype.npcExists = function (x, y, floorId) {
    var block = core.getBlock(x,y,floorId);
    if (block==null) return false;
    return block.block.event.cls == 'npcs';
}

////// 某个点是否存在（指定的）地形 //////
core.prototype.terrainExists = function (x, y, id, floorId) {
    var block = core.getBlock(x,y,floorId);
    if (block==null) return false;
    return block.block.event.cls=='terrains' && (core.isset(id)?block.block.event.id==id:true);
}

////// 某个点是否存在楼梯 //////
core.prototype.stairExists = function (x, y, floorId) {
    var block = core.getBlock(x,y,floorId);
    if (block==null) return false;
    return block.block.event.cls=='terrains' && (block.block.event.id=='upFloor' || block.block.event.id=='downFloor');
}

////// 当前位置是否在楼梯边 //////
core.prototype.nearStair = function() {
    var x=core.getHeroLoc('x'), y=core.getHeroLoc('y');
    return core.stairExists(x,y) || core.stairExists(x-1,y) || core.stairExists(x,y-1) || core.stairExists(x+1,y) || core.stairExists(x,y+1);
}

////// 某个点是否存在（指定的）怪物 //////
core.prototype.enemyExists = function (x, y, id,floorId) {
    var block = core.getBlock(x,y,floorId);
    if (block==null) return false;
    return block.block.event.cls=='enemys' && (core.isset(id)?block.block.event.id==id:true);
}

////// 获得某个点的block //////
core.prototype.getBlock = function (x, y, floorId, needEnable) {
    if (!core.isset(floorId)) floorId=core.status.floorId;
    if (!core.isset(needEnable)) needEnable=true;
    var blocks = core.status.maps[floorId].blocks;
    for (var n=0;n<blocks.length;n++) {
        if (blocks[n].x==x && blocks[n].y==y && core.isset(blocks[n].event)) {
            if (needEnable && core.isset(blocks[n].enable) && !blocks[n].enable) return null;
            return {"index": n, "block": blocks[n]};
        }
    }
    return null;
}

////// 显示移动某块的动画，达到{“type”:”move”}的效果 //////
core.prototype.moveBlock = function(x,y,steps,time,immediateHide,callback) {
    time = time || 500;
    core.status.replay.animate=true;

    //clearInterval(core.interval.tipAnimate);
    core.saveCanvas('animate');
    core.clearMap('animate', 0, 0, 416, 416);

    var block = core.getBlock(x,y,core.status.floorId,false);
    if (block==null) {// 不存在
        if (core.isset(callback)) callback();
        return;
    }

    // 需要删除该块
    core.removeBlock(x,y);

    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 1.0);

    block=block.block;
    blockIcon = core.material.icons[block.event.cls][block.event.id];
    blockImage = core.material.images[block.event.cls];

    var opacityVal = 1;
    core.setOpacity('animate', opacityVal);
    core.canvas.animate.drawImage(blockImage, 0, blockIcon * 32, 32, 32, block.x * 32, block.y * 32, 32, 32);

    // 要运行的轨迹：将steps展开
    var moveSteps=[];
    steps.forEach(function (e) {
        if (typeof e=="string") {
            moveSteps.push(e);
        }
        else {
            if (!core.isset(e.value)) {
                moveSteps.push(e.direction)
            }
            else {
                for (var i=0;i<e.value;i++) {
                    moveSteps.push(e.direction);
                }
            }
        }
    });

    var nowX=32*x, nowY=32*y, step=0;
    var scan = {
        'up': {'x': 0, 'y': -1},
        'left': {'x': -1, 'y': 0},
        'down': {'x': 0, 'y': 1},
        'right': {'x': 1, 'y': 0}
    };

    var animateValue = block.event.animate || 1;
    var animateCurrent = 0;
    var animateTime = 0;

    var animate=window.setInterval(function() {

        animateTime += time / 16 / core.status.replay.speed;
        if (animateTime >= core.values.animateSpeed * 2 / animateValue) {
            animateCurrent++;
            animateTime = 0;
            if (animateCurrent>=animateValue) animateCurrent=0;
        }

        // 已经移动完毕，消失
        if (moveSteps.length==0) {
            if (immediateHide) opacityVal=0;
            else opacityVal -= 0.06;
            core.setOpacity('animate', opacityVal);
            core.clearMap('animate', nowX, nowY, 32, 32);
            core.canvas.animate.drawImage(blockImage, animateCurrent * 32, blockIcon * 32, 32, 32, nowX, nowY, 32, 32);
            if (opacityVal<=0) {
                clearInterval(animate);
                core.loadCanvas('animate');
                core.clearMap('animate', 0, 0, 416, 416);
                core.setOpacity('animate', 1);
                core.status.replay.animate=false;
                if (core.isset(callback)) callback();
            }
        }
        else {
            // 移动中
            step++;
            nowX+=scan[moveSteps[0]].x*2;
            nowY+=scan[moveSteps[0]].y*2;
            core.clearMap('animate', nowX-32, nowY-32, 96, 96);
            // 绘制
            core.canvas.animate.drawImage(blockImage, animateCurrent * 32, blockIcon * 32, 32, 32, nowX, nowY, 32, 32);
            if (step==16) {
                // 该移动完毕，继续
                step=0;
                moveSteps.shift();
            }
        }
    }, time / 16 / core.status.replay.speed);
}

////// 显示/隐藏某个块时的动画效果 //////
core.prototype.animateBlock = function (loc,type,time,callback) {
    if (type!='hide') type='show';
    core.status.replay.animate=true;

    //clearInterval(core.interval.tipAnimate);
    core.saveCanvas('animate');
    core.clearMap('animate', 0, 0, 416, 416);

    if (typeof loc[0] == 'number' && typeof loc[1] == 'number')
        loc = [loc];

    var list = [];
    loc.forEach(function (t) {
        var block = core.getBlock(t[0],t[1],core.status.floorId,false);
        if (block==null) return;
        block=block.block;
        list.push({
            'x': t[0], 'y': t[1],
            'blockIcon': core.material.icons[block.event.cls][block.event.id],
            'blockImage': core.material.images[block.event.cls]
        })
    })

    if (list.length==0) {
        if (core.isset(callback)) callback();
        return;
    }

    var draw = function () {
        list.forEach(function (t) {
            core.canvas.animate.drawImage(t.blockImage, 0, t.blockIcon * 32, 32, 32, t.x * 32, t.y * 32, 32, 32);
        })
    }

    var opacityVal = 0;
    if (type=='hide') opacityVal=1;

    core.setOpacity('animate', opacityVal);
    draw();

    var animate = window.setInterval(function () {
        if (type=='show') opacityVal += 0.1;
        else opacityVal -= 0.1;
        core.setOpacity('animate', opacityVal);
        core.clearMap('animate',0,0,416,416);

        // core.canvas.animate.drawImage(blockImage, 0, blockIcon * 32, 32, 32, block.x * 32, block.y * 32, 32, 32);
        draw();
        if (opacityVal >=1 || opacityVal<=0) {
            clearInterval(animate);
            core.loadCanvas('animate');
            core.clearMap('animate', 0, 0, 416, 416);
            core.setOpacity('animate', 1);
            core.status.replay.animate=false;
            if (core.isset(callback)) callback();
        }
    }, time / 10 / core.status.replay.speed);
}

////// 将某个块从禁用变成启用状态 //////
core.prototype.showBlock = function(x, y, floodId) {
    floodId = floodId || core.status.floorId;
    var block = core.getBlock(x,y,floodId,false);
    if (block==null) return; // 不存在
    block=block.block;
    // 本身是禁用事件，启用之
    if (core.isset(block.enable) && !block.enable) {
        block.enable = true;
        // 在本层，添加动画
        if (floodId == core.status.floorId && core.isset(block.event)) {
            blockIcon = core.material.icons[block.event.cls][block.event.id];
            blockImage = core.material.images[block.event.cls];
            core.canvas.event.drawImage(core.material.images[block.event.cls], 0, blockIcon * 32, 32, 32, block.x * 32, block.y * 32, 32, 32);
            core.addGlobalAnimate(block.event.animate, block.x * 32, block.y * 32, blockIcon, blockImage);
            // core.setGlobalAnimate(core.values.animateSpeed);
            core.syncGlobalAnimate();
        }
        core.updateStatusBar();
    }
}

////// 将某个块从启用变成禁用状态 //////
core.prototype.removeBlock = function (x, y, floorId) {
    floorId = floorId || core.status.floorId;

    var block = core.getBlock(x,y,floorId,false);
    if (block==null) return; // 不存在

    var index=block.index;

    // 删除动画，清除地图
    if (floorId==core.status.floorId) {
        core.removeGlobalAnimate(x, y);
        core.canvas.event.clearRect(x * 32, y * 32, 32, 32);
    }

    // 删除Index
    core.removeBlockById(index, floorId);
    core.updateFg();
}

////// 根据block的索引删除该块 //////
core.prototype.removeBlockById = function (index, floorId) {

    var blocks = core.status.maps[floorId].blocks;
    var x=blocks[index].x, y=blocks[index].y;

    // 检查该点是否存在事件
    var event = core.floors[floorId].events[x+","+y];
    if (!core.isset(event))
        event = core.floors[floorId].changeFloor[x+","+y];

    // 不存在事件，直接删除
    if (!core.isset(event)) {
        blocks.splice(index,1);
        return;
    }
    blocks[index].enable = false;
}

////// 一次性删除多个block //////
core.prototype.removeBlockByIds = function (floorId, ids) {
    ids.sort(function (a,b) {return b-a}).forEach(function (id) {
        core.removeBlockById(id, floorId);
    });
}

////// 添加一个全局动画 //////
core.prototype.addGlobalAnimate = function (animateMore, x, y, loc, image) {
    if (animateMore == 2) {
        core.status.twoAnimateObjs.push({
            'x': x,
            'y': y,
            'status': 0,
            'loc': loc,
            'image': image
        });
    }
    else if (animateMore == 4) {
        core.status.fourAnimateObjs.push({
            'x': x,
            'y': y,
            'status': 0,
            'loc': loc,
            'image': image
        });
    }
}

////// 删除一个或所有全局动画 //////
core.prototype.removeGlobalAnimate = function (x, y, all) {
    if (all == true) {
        core.status.twoAnimateObjs = [];
        core.status.fourAnimateObjs = [];
    }
    for (var t = 0; t < core.status.twoAnimateObjs.length; t++) {
        if (core.status.twoAnimateObjs[t].x == x * 32 && core.status.twoAnimateObjs[t].y == y * 32) {
            core.status.twoAnimateObjs.splice(t, 1);
            return;
        }
    }
    for (var f = 0; f < core.status.fourAnimateObjs.length; f++) {
        if (core.status.fourAnimateObjs[f].x == x * 32 && core.status.fourAnimateObjs[f].y == y * 32) {
            core.status.fourAnimateObjs.splice(f, 1);
            return;
        }
    }
}

////// 设置全局动画的显示效果 //////
core.prototype.setGlobalAnimate = function (speed) {
    /*
    clearInterval(core.interval.twoAnimate);
    clearInterval(core.interval.fourAnimate);
    var animateClose = false;
    core.interval.twoAnimate = window.setInterval(function () {
        for (var a = 0; a < core.status.twoAnimateObjs.length; a++) {
            var obj = core.status.twoAnimateObjs[a];
            obj.status = (obj.status+1)%2;
            core.canvas.event.clearRect(obj.x, obj.y, 32, 32);
            if (!animateClose) {
                core.canvas.event.drawImage(obj.image, obj.status * 32, obj.loc * 32, 32, 32, obj.x, obj.y, 32, 32);
            }
            animateClose = false;
        }
    }, speed);
    core.interval.fourAnimate = window.setInterval(function () {
        for (var a = 0; a < core.status.fourAnimateObjs.length; a++) {
            var obj=core.status.fourAnimateObjs[a];
            obj.status = (obj.status+1)%4;
            core.canvas.event.clearRect(obj.x, obj.y, 32, 32);
            if (!animateClose) {
                core.canvas.event.drawImage(obj.image, obj.status * 32, obj.loc * 32, 32, 32, obj.x, obj.y, 32, 32);
            }
            animateClose = false;
        }
    }, speed / 2);
    */
    core.syncGlobalAnimate();
    core.animateFrame.speed = speed;
    core.animateFrame.globalAnimate = true;
}

////// 同步所有的全局动画效果 //////
core.prototype.syncGlobalAnimate = function () {
    core.status.twoAnimateObjs.forEach(function (t) {
        t.status=0;
    })
    core.status.fourAnimateObjs.forEach(function (t) {
        t.status=0;
    })
}

////// 绘制UI层的box动画 //////
core.prototype.drawBoxAnimate = function () {
    for (var a = 0; a < core.status.boxAnimateObjs.length; a++) {
        var obj = core.status.boxAnimateObjs[a];
        obj.status = ((obj.status||0)+1)%2;
        core.clearMap('ui', obj.bgx, obj.bgy, obj.bgsize, obj.bgsize);
        core.fillRect('ui', obj.bgx, obj.bgy, obj.bgsize, obj.bgsize, core.animateFrame.background);
        core.canvas.ui.drawImage(obj.image, obj.status * 32, obj.icon * 32,
            32, 32, obj.x, obj.y, 32, 32);
    }
}

////// 绘制动画 //////
core.prototype.drawAnimate = function (name, x, y, callback) {

    // 正在播放录像：不显示动画
    if (core.isset(core.status.replay) && core.status.replay.replaying) {
        if (core.isset(callback)) callback();
        return;
    }

    // 检测动画是否存在
    if (!core.isset(core.material.animates[name]) || !core.isset(x) || !core.isset(y)) {
        if (core.isset(callback)) callback();
        return;
    }

    // 清空animate层
    clearInterval(core.interval.animateInterval);
    core.clearMap('animate', 0, 0, 416, 416);

    // 开始绘制
    var animate = core.material.animates[name];
    var ratio = animate.ratio;
    var centerX = 32*x+16, centerY = 32*y+16;
    var index=0;

    var draw = function (index) {
        core.clearMap('animate', 0, 0, 416, 416);

        var frame = animate.frames[index];
        frame.forEach(function (t) {
            var image = animate.images[t.index];
            if (!core.isset(image)) return;
            var realWidth = image.width * ratio * t.zoom / 100;
            var realHeight = image.height * ratio * t.zoom / 100;
            core.setAlpha('animate', t.opacity / 255);

            var cx = centerX+t.x, cy=centerY+t.y;

            if (!t.mirror && !t.angle) {
                core.canvas.animate.drawImage(image, cx-realWidth/2, cy-realHeight/2, realWidth, realHeight);
            }
            else {
                core.saveCanvas('animate');
                core.canvas.animate.translate(cx,cy);
                if (t.angle)
                    core.canvas.animate.rotate(-t.angle*Math.PI/180);
                if (t.mirror)
                    core.canvas.animate.scale(-1,1);
                core.canvas.animate.drawImage(image, -realWidth/2, -realHeight/2, realWidth, realHeight);
                core.loadCanvas('animate');
            }
        })
    }

    draw(index++);

    core.interval.animateInterval = setInterval(function (t) {
        if (index == animate.frames.length) {
            clearInterval(core.interval.animateInterval);
            core.clearMap('animate', 0, 0, 416, 416);
            core.setAlpha('animate', 1);
            if (core.isset(callback)) callback();
            return;
        }
        draw(index++);
    }, 50);
}

////// 更新领域、夹击、阻击的伤害地图 //////
core.prototype.updateCheckBlock = function() {
    core.status.checkBlock = {};
    if (!core.isset(core.status.thisMap)) return;
    var blocks = core.status.thisMap.blocks;

    // Step1: 更新怪物地图
    core.status.checkBlock.map = []; // 记录怪物地图
    for (var n=0;n<blocks.length;n++) {
        var block = blocks[n];
        if (core.isset(block.event) && !(core.isset(block.enable) && !block.enable) && block.event.cls=='enemys') {
            var id = block.event.id, enemy = core.enemys.getEnemys(id);
            if (core.isset(enemy)) {
                 core.status.checkBlock.map[13*block.x+block.y]=id;
            }
        }
    }

    // Step2: 更新领域、阻击伤害
    core.status.checkBlock.damage = []; // 记录(x,y)点的伤害
    for (var x=0;x<13*13;x++) core.status.checkBlock.damage[x]=0;

    for (var x=0;x<13;x++) {
        for (var y=0;y<13;y++) {
            var id = core.status.checkBlock.map[13*x+y];
            if (core.isset(id)) {
                var enemy = core.enemys.getEnemys(id);
                // 存在领域
                if (core.enemys.hasSpecial(enemy.special, 15)) {
                    var range = enemy.range || 1;
                    var zoneSquare = false;
                    if (core.isset(enemy.zoneSquare)) zoneSquare=enemy.zoneSquare;
                    for (var dx=-range;dx<=range;dx++) {
                        for (var dy=-range;dy<=range;dy++) {
                            if (dx==0 && dy==0) continue;
                            var nx=x+dx, ny=y+dy;
                            if (nx<0 || nx>12 || ny<0 || ny>12) continue;
                            if (!zoneSquare && Math.abs(dx)+Math.abs(dy)>range) continue;
                            core.status.checkBlock.damage[13*nx+ny]+=enemy.value;
                        }
                    }
                }
                // 存在阻击
                if (core.enemys.hasSpecial(enemy.special, 18)) {
                    for (var dx=-1;dx<=1;dx++) {
                        for (var dy=-1;dy<=1;dy++) {
                            if (dx==0 && dy==0) continue;
                            var nx=x+dx, ny=y+dy;
                            if (nx<0 || nx>12 || ny<0 || ny>12 || Math.abs(dx)+Math.abs(dy)>1) continue;
                            core.status.checkBlock.damage[13*nx+ny]+=enemy.value;
                        }
                    }
                }
            }
        }
    }


    // Step3: 更新夹击点坐标，并将夹击伤害加入到damage中
    core.status.checkBlock.betweenAttack = []; // 记录(x,y)点是否有夹击
    for (var x=0;x<13;x++) {
        for (var y=0;y<13;y++) {
            var has=false;
            if (x>0 && x<12) {
                var id1=core.status.checkBlock.map[13*(x-1)+y],
                    id2=core.status.checkBlock.map[13*(x+1)+y];
                if (core.isset(id1) && core.isset(id2) && id1==id2) {
                    var enemy = core.enemys.getEnemys(id1);
                    if (core.enemys.hasSpecial(enemy.special, 16)) {
                        has = true;
                    }
                }
            }
            if (y>0 && y<12) {
                var id1=core.status.checkBlock.map[13*x+y-1],
                    id2=core.status.checkBlock.map[13*x+y+1];
                if (core.isset(id1) && core.isset(id2) && id1==id2) {
                    var enemy = core.enemys.getEnemys(id1);
                    if (core.enemys.hasSpecial(enemy.special, 16)) {
                        has = true;
                    }
                }
            }
            // 存在夹击
            if (has) {
                core.status.checkBlock.betweenAttack[13*x+y]=true;
                var leftHp = core.status.hero.hp - core.status.checkBlock.damage[13*x+y];
                if (leftHp>1)
                    core.status.checkBlock.damage[13*x+y] += parseInt((leftHp+(core.flags.betweenAttackCeil?0:1))/2);
            }
        }
    }
}

////// 检查并执行领域、夹击、阻击事件 //////
core.prototype.checkBlock = function () {
    var x=core.getHeroLoc('x'), y=core.getHeroLoc('y');
    var damage = core.status.checkBlock.damage[13*x+y];
    if (damage>0) {
        core.status.hero.hp -= damage;

        // 检查阻击事件
        var snipe = [];
        var scan = {
            'up': {'x': 0, 'y': -1},
            'left': {'x': -1, 'y': 0},
            'down': {'x': 0, 'y': 1},
            'right': {'x': 1, 'y': 0}
        }
        for (var direction in scan) {
            var nx = x+scan[direction].x, ny=y+scan[direction].y;
            if (nx<0 || nx>12 || ny<0 || ny>12) continue;
            var id=core.status.checkBlock.map[13*nx+ny];
            if (core.isset(id)) {
                var enemy = core.enemys.getEnemys(id);
                if (core.isset(enemy) && core.enemys.hasSpecial(enemy.special, 18)) {
                    snipe.push({'direction': direction, 'x': nx, 'y': ny});
                }
            }
        }

        if (core.status.checkBlock.betweenAttack[13*x+y] && damage>0) {
            core.drawTip('受到夹击，生命变成一半');
        }
        // 阻击
        else if (snipe.length>0 && damage>0) {
            core.drawTip('受到阻击伤害'+damage+'点');
        }
        else if (damage>0) {
            core.drawTip('受到领域伤害'+damage+'点');
        }

        core.playSound('zone.ogg');
        core.drawAnimate("zone", x, y);

        if (core.status.hero.hp<=0) {
            core.status.hero.hp=0;
            core.updateStatusBar();
            core.events.lose('zone');
            return;
        }
        snipe = snipe.filter(function (t) {
            var x=t.x, y=t.y, direction = t.direction;
            var nx = x+scan[direction].x, ny=y+scan[direction].y;

            return nx>=0 && nx<=12 && ny>=0 && ny<=12 && core.getBlock(nx, ny, core.status.floorId, false)==null;
        });
        core.updateStatusBar();
        if (snipe.length>0)
            core.snipe(snipe);
    }
}

////// 阻击事件（动画效果） //////
core.prototype.snipe = function (snipes) {

    var scan = {
        'up': {'x': 0, 'y': -1},
        'left': {'x': -1, 'y': 0},
        'down': {'x': 0, 'y': 1},
        'right': {'x': 1, 'y': 0}
    };

    snipes.forEach(function (snipe) {
        var x=snipe.x, y=snipe.y, direction = snipe.direction;
        snipe.nx = x+scan[snipe.direction].x;
        snipe.ny = y+scan[snipe.direction].y;

        core.removeGlobalAnimate(x, y);

        var block = core.getBlock(x,y).block;

        snipe.blockIcon = core.material.icons[block.event.cls][block.event.id];
        snipe.blockImage = core.material.images[block.event.cls];
        var damage = core.enemys.getDamage(block.event.id);

        var color = "#000000";
        if (damage <= 0) color = '#00FF00';
        else if (damage < core.status.hero.hp / 3) color = '#FFFFFF';
        else if (damage < core.status.hero.hp * 2 / 3) color = '#FFFF00';
        else if (damage < core.status.hero.hp) color = '#FF7F00';
        else color = '#FF0000';

        if (damage >= 999999999) damage = "???";
        else if (damage > 100000) damage = (damage / 10000).toFixed(1) + "w";

        snipe.damage = damage;
        snipe.color = color;
        snipe.block = core.clone(block);
    })

    var finishSnipe = function () {
        snipes.forEach(function (t) {
            core.removeBlock(t.x, t.y);
            var nBlock = core.clone(t.block);
            nBlock.x = t.nx; nBlock.y = t.ny;
            core.status.thisMap.blocks.push(nBlock);
            core.addGlobalAnimate(2, 32*t.nx, 32*t.ny, t.blockIcon, t.blockImage);
            core.canvas.event.drawImage(t.blockImage, 0, t.blockIcon*32, 32, 32, 32*t.nx, 32*t.ny, 32, 32);
        });
        core.syncGlobalAnimate();
        core.updateStatusBar();
        return;
    }

    if (core.status.replay.replaying) {
        finishSnipe();
    }
    else {
        core.waitHeroToStop(function() {

            core.lockControl();

            var time = 500, step = 0;

            var animateValue = 2;
            var animateCurrent = 0;
            var animateTime = 0;

            core.canvas.fg.textAlign = 'left';

            var animate=window.setInterval(function() {

                step++;
                animateTime += time / 16;
                if (animateTime >= core.values.animateSpeed * 2 / animateValue) {
                    animateCurrent++;
                    animateTime = 0;
                    if (animateCurrent>=animateValue) animateCurrent=0;
                }

                snipes.forEach(function (snipe) {
                    var x=snipe.x, y=snipe.y, direction = snipe.direction;

                    var nowX=32*x+scan[direction].x*2*step, nowY=32*y+scan[direction].y*2*step;

                    // 清空上一次
                    core.clearMap('event', nowX-2*scan[direction].x, nowY-2*scan[direction].y, 32, 32);
                    core.clearMap('fg', nowX-2*scan[direction].x, nowY-2*scan[direction].y, 32, 32);

                    core.canvas.event.drawImage(snipe.blockImage, animateCurrent*32, snipe.blockIcon*32, 32, 32, nowX, nowY, 32, 32);

                    if (core.hasItem('book')) {
                        // drawFG
                        core.setFillStyle('fg', '#000000');
                        core.canvas.fg.fillText(snipe.damage, nowX + 2, nowY + 30);
                        core.canvas.fg.fillText(snipe.damage, nowX, nowY + 30);
                        core.canvas.fg.fillText(snipe.damage, nowX + 2, nowY + 32);
                        core.canvas.fg.fillText(snipe.damage, nowX, nowY + 32);

                        core.setFillStyle('fg', snipe.color);
                        core.canvas.fg.fillText(snipe.damage, nowX + 1, nowY + 31);
                    }

                })

                if (step==16) { // 移动完毕
                    clearInterval(animate);
                    finishSnipe();
                    // 不存在自定义事件
                    if (core.status.event.id==null)
                        core.unLockControl();
                }
            }, time/16);
        });
    }


}

////// 更改天气效果 //////
core.prototype.setWeather = function (type, level) {

    // 非雨雪
    if (type!='rain' && type!='snow') {
        core.clearMap('weather', 0, 0, 416, 416)
        core.animateFrame.weather.type = null;
        core.animateFrame.weather.level = 0;
        core.animateFrame.weather.nodes = [];
        return;
    }

    level = parseInt(level);

    // 当前天气：则忽略
    if (type==core.animateFrame.weather.type &&
        (!core.isset(level) || 20*level==core.animateFrame.weather.level)) {
        return;
    }

    if (!core.isset(level)) level=5;
    if (level<1) level=1; if (level>10) level=10;
    level *= 20;

    core.clearMap('weather', 0, 0, 416, 416)
    core.animateFrame.weather.type = type;
    core.animateFrame.weather.level = level;

    core.animateFrame.weather.nodes = [];

    if (type == 'rain') {
        for (var a=0;a<level;a++) {
            core.animateFrame.weather.nodes.push({
                'x': Math.random()*416,
                'y': Math.random()*416,
                'l': Math.random() * 2.5,
                'xs': -4 + Math.random() * 4 + 2,
                'ys': Math.random() * 10 + 10
            })
        }
    }
    else if (type=='snow') {
        for (var a=0;a<level;a++) {
            core.animateFrame.weather.nodes.push({
                'x': Math.random()*416,
                'y': Math.random()*416,
                'r': Math.random() * 5 + 1,
                'd': Math.random() * level,
            })
        }
    }
}

////// 更改画面色调 //////
core.prototype.setFg = function(color, time, callback) {
    if (!core.isset(time)) time=750;
    if (time<=0) time=0;

    if (!core.isset(core.status.curtainColor)) {
        core.status.curtainColor = [0,0,0,0];
    }

    var fromColor = core.status.curtainColor;

    if (!core.isset(color))
        color = [0,0,0,0];
    if (color.length==3)
        color.push(1);
    if (color[3]<0) color[3]=0;
    if (color[3]>1) color[3]=1;

    if (time==0) {
        // 直接变色
        core.dom.curtain.style.background = core.arrayToRGB(color);
        core.dom.curtain.style.opacity = color[3];
        core.status.curtainColor = color;
        if (core.isset(callback)) callback();
        return;
    }

    var step=0;
    core.status.replay.animate=true;
    var changeAnimate = setInterval(function() {
        step++;

        var nowAlpha = fromColor[3]+(color[3]-fromColor[3])*step/25;
        var nowR = parseInt(fromColor[0]+(color[0]-fromColor[0])*step/25);
        var nowG = parseInt(fromColor[1]+(color[1]-fromColor[1])*step/25);
        var nowB = parseInt(fromColor[2]+(color[2]-fromColor[2])*step/25);
        core.dom.curtain.style.background = core.arrayToRGB([nowR,nowG,nowB]);
        core.dom.curtain.style.opacity = nowAlpha;

        if (step>=25) {
            clearInterval(changeAnimate);
            core.status.curtainColor = color;
            core.status.replay.animate=false;
            if (core.isset(callback)) callback();
        }
    }, time/25);

}

////// 更新全地图显伤 //////
core.prototype.updateFg = function () {

    if (!core.isset(core.status.thisMap) || !core.isset(core.status.thisMap.blocks)) return;
    // 更新显伤
    var mapBlocks = core.status.thisMap.blocks;
    core.clearMap('fg', 0, 0, 416, 416);
    // 没有怪物手册
    if (!core.hasItem('book')) return;
    core.setFont('fg', "bold 11px Arial");
    var hero_hp = core.status.hero.hp;
    if (core.flags.displayEnemyDamage) {
        core.canvas.fg.textAlign = 'left';
        for (var b = 0; b < mapBlocks.length; b++) {
            var x = mapBlocks[b].x, y = mapBlocks[b].y;
            if (core.isset(mapBlocks[b].event) && mapBlocks[b].event.cls == 'enemys'
                && !(core.isset(mapBlocks[b].enable) && !mapBlocks[b].enable)) {

                // 非系统默认的战斗事件（被覆盖）
                if (mapBlocks[b].event.trigger != 'battle') {
                    // 判断显伤
                    var event = core.floors[core.status.floorId].events[x+","+y];
                    if (core.isset(event) && !(event instanceof Array)) {
                        if (core.isset(event.displayDamage) && !event.displayDamage)
                            continue;
                    }
                }

                var id = mapBlocks[b].event.id;

                var damage = core.enemys.getDamage(id);
                var color = "#000000";
                if (damage <= 0) color = '#00FF00';
                else if (damage < hero_hp / 3) color = '#FFFFFF';
                else if (damage < hero_hp * 2 / 3) color = '#FFFF00';
                else if (damage < hero_hp) color = '#FF7F00';
                else color = '#FF0000';

                if (damage >= 999999999) damage = "???";
                else if (damage > 100000) damage = (damage / 10000).toFixed(1) + "w";

                core.setFillStyle('fg', '#000000');
                core.canvas.fg.fillText(damage, 32 * x + 2, 32 * (y + 1) - 2);
                core.canvas.fg.fillText(damage, 32 * x, 32 * (y + 1) - 2);
                core.canvas.fg.fillText(damage, 32 * x + 2, 32 * (y + 1));
                core.canvas.fg.fillText(damage, 32 * x, 32 * (y + 1));

                core.setFillStyle('fg', color);
                core.canvas.fg.fillText(damage, 32 * x + 1, 32 * (y + 1) - 1);

            }
        }
    }
    // 如果是领域&夹击
    if (core.flags.displayExtraDamage) {
        core.canvas.fg.textAlign = 'center';
        for (var x=0;x<13;x++) {
            for (var y=0;y<13;y++) {
                var damage = core.status.checkBlock.damage[13*x+y];
                if (damage>0) {
                    core.setFillStyle('fg', '#000000');
                    core.canvas.fg.fillText(damage, 32 * x + 17, 32 * (y + 1) - 13);
                    core.canvas.fg.fillText(damage, 32 * x + 15, 32 * (y + 1) - 15);
                    core.canvas.fg.fillText(damage, 32 * x + 17, 32 * (y + 1) - 15);
                    core.canvas.fg.fillText(damage, 32 * x + 15, 32 * (y + 1) - 13);

                    core.setFillStyle('fg', '#FF7F00');
                    core.canvas.fg.fillText(damage, 32 * x + 16, 32 * (y + 1) - 14);
                }
            }
        }
    }
}

////// 获得某个物品的个数 //////
core.prototype.itemCount = function (itemId) {
    if (!core.isset(itemId) || !core.isset(core.material.items[itemId])) return 0;
    var itemCls = core.material.items[itemId].cls;
    if (itemCls=="items") return 0;
    return core.isset(core.status.hero.items[itemCls][itemId]) ? core.status.hero.items[itemCls][itemId] : 0;
}

////// 是否存在某个物品 //////
core.prototype.hasItem = function (itemId) {
    return core.itemCount(itemId) > 0;
}

////// 设置某个物品的个数 //////
core.prototype.setItem = function (itemId, itemNum) {
    var itemCls = core.material.items[itemId].cls;
    if (itemCls == 'items') return;
    if (!core.isset(core.status.hero.items[itemCls])) {
        core.status.hero.items[itemCls] = {};
    }
    core.status.hero.items[itemCls][itemId] = itemNum;
    if (itemCls!='keys' && itemNum==0) {
        delete core.status.hero.items[itemCls][itemId];
    }
}

////// 删除某个物品 //////
core.prototype.removeItem = function (itemId) {
    if (!core.hasItem(itemId)) return false;
    var itemCls = core.material.items[itemId].cls;
    core.status.hero.items[itemCls][itemId]--;
    if (itemCls!='keys' && core.status.hero.items[itemCls][itemId]==0) {
        delete core.status.hero.items[itemCls][itemId];
    }
    core.updateStatusBar();
    return true;
}

////// 使用某个物品 //////
core.prototype.useItem = function (itemId, callback) {
    core.items.useItem(itemId, callback);
    return;
}

////// 能否使用某个物品 //////
core.prototype.canUseItem = function (itemId) {
    return core.items.canUseItem(itemId);
}

////// 增加某个物品的个数 //////
core.prototype.addItem = function (itemId, itemNum) {
    var itemData = core.material.items[itemId];
    var itemCls = itemData.cls;
    if (itemCls == 'items') return;
    if (!core.isset(core.status.hero.items[itemCls])) {
        core.status.hero.items[itemCls] = {};
        core.status.hero.items[itemCls][itemId] = 0;
    }
    else if (!core.isset(core.status.hero.items[itemCls][itemId])) {
        core.status.hero.items[itemCls][itemId] = 0;
    }
    core.status.hero.items[itemCls][itemId] += itemNum;
}

////// 获得面前的物品（轻按） //////
core.prototype.getNextItem = function() {
    if (!core.status.heroStop || !core.flags.enableGentleClick) return;
    var nextX = core.nextX(), nextY = core.nextY();
    var block = core.getBlock(nextX, nextY);
    if (block==null) return;
    if (block.block.event.trigger=='getItem') {
        core.getItem(block.block.event.id, 1, nextX, nextY);
        core.status.route.push("getNext");
    }
}

////// 获得某个物品 //////
core.prototype.getItem = function (itemId, itemNum, itemX, itemY, callback) {
    // core.getItemAnimate(itemId, itemNum, itemX, itemY);
    core.playSound('item.ogg');
    var itemCls = core.material.items[itemId].cls;
    core.items.getItemEffect(itemId, itemNum);
    core.removeBlock(itemX, itemY);
    var text = '获得 ' + core.material.items[itemId].name;
    if (itemNum > 1) text += "x" + itemNum;
    if (itemCls === 'items') text += core.items.getItemEffectTip(itemId);
    core.drawTip(text, core.material.icons.items[itemId]);
    core.canvas.event.clearRect(itemX * 32, itemY * 32, 32, 32);
    core.updateStatusBar();

    // 检查处理后的事件。
    var event = core.floors[core.status.floorId].afterGetItem[itemX+","+itemY];
    if (core.isset(event)) {
        core.events.doEvents(event, itemX, itemY, callback);
    }
    else if (core.isset(callback)) callback();
}

////// 左上角绘制一段提示 //////
core.prototype.drawTip = function (text, itemIcon) {
    var textX, textY, width, height, hide = false, opacityVal = 0;
    clearInterval(core.interval.tipAnimate);
    core.setFont('data', "16px Arial");
    core.saveCanvas('data');
    core.setOpacity('data', 0);
    core.canvas.data.textAlign = 'left';
    if (!core.isset(itemIcon)) {
        textX = 16;
        textY = 18;
        width = textX + core.canvas.data.measureText(text).width + 16;
        height = 42;
    }
    else {
        textX = 44;
        textY = 18;
        width = textX + core.canvas.data.measureText(text).width + 8;
        height = 42;
    }
    core.interval.tipAnimate = window.setInterval(function () {
        if (hide) {
            opacityVal -= 0.1;
        }
        else {
            opacityVal += 0.1;
        }
        core.setOpacity('data', opacityVal);
        core.clearMap('data', 5, 5, 400, height);
        core.fillRect('data', 5, 5, width, height, '#000');
        if (core.isset(itemIcon)) {
            core.canvas.data.drawImage(core.material.images.items, 0, itemIcon * 32, 32, 32, 10, 8, 32, 32);
        }
        core.fillText('data', text, textX + 5, textY + 15, '#fff');
        if (opacityVal > 0.6 || opacityVal < 0) {
            if (hide) {
                core.loadCanvas('data');
                core.clearMap('data', 5, 5, 400, height);
                core.setOpacity('data', 1);
                clearInterval(core.interval.tipAnimate);
                return;
            }
            else {
                if (!core.isset(core.timeout.getItemTipTimeout)) {
                    core.timeout.getItemTipTimeout = window.setTimeout(function () {
                        hide = true;
                        core.timeout.getItemTipTimeout = null;
                    }, 750);
                }
                opacityVal = 0.6;
                core.setOpacity('data', opacityVal);
            }
        }
    }, 30);
}

////// 地图中间绘制一段文字 //////
core.prototype.drawText = function (contents, callback) {
    if (core.isset(contents)) {

        // 合并
        if (core.isset(core.status.event)&&core.status.event.id=='action') {
            core.insertAction(contents,null,null,callback);
            return;
        }

        if (typeof contents == 'string') {
            contents = [{'content': contents}];
        }
        else if (contents instanceof Object && core.isset(contents.content)) {
            contents = [contents];
        }
        else if (!(contents instanceof Array)) {
            core.drawTip("出错了");
            console.log(contents);
            return;
        }

        core.status.event = {'id': 'text', 'data': {'list': contents, 'callback': callback}};
        core.lockControl();

        // wait the hero to stop
        core.stopAutomaticRoute();
        setTimeout(function() {
            core.drawText();
        }, 30);
        return;
    }

    if (core.status.event.data.list.length==0) {
        var callback = core.status.event.data.callback;
        core.ui.closePanel(false);
        if (core.isset(callback)) callback();
        return;
    }

    var data=core.status.event.data.list.shift();
    if (typeof data == 'string')
        core.ui.drawTextBox(data);
    else
        core.ui.drawTextBox(data.content, data.id);
    // core.drawTextBox(content);
}

/////////// 地图相关 END ///////////




/////////// 系统机制 ///////////

////// 将文字中的${和}（表达式）进行替换 //////
core.prototype.replaceText = function (text) {
    return text.replace(/\${([^}]+)}/g, function (word, value) {
        return core.calValue(value);
    });
}

////// 计算表达式的值 //////
core.prototype.calValue = function (value) {
    value=value.replace(/status:([\w\d_]+)/g, "core.getStatus('$1')");
    value=value.replace(/item:([\w\d_]+)/g, "core.itemCount('$1')");
    value=value.replace(/flag:([\w\d_]+)/g, "core.getFlag('$1', false)");
    return eval(value);
}

////// 执行一个表达式的effect操作 //////
core.prototype.doEffect = function (expression) {
    // 必须使用"+="
    var arr = expression.split("+=");
    if (arr.length!=2) return;
    var name=arr[0], value=core.calValue(arr[1]);
    if (name.indexOf("status:")==0) {
        var status=name.substring(7);
        core.setStatus(status, core.getStatus(status)+value);
    }
    else if (name.indexOf("item:")==0) {
        var itemId=name.substring(5);
        core.setItem(itemId, core.itemCount(itemId)+value);
    }
}

////// 字符串自动换行的分割 //////
core.prototype.splitLines = function(canvas, text, maxLength, font) {
    if (core.isset(font)) core.setFont(canvas, font);

    var contents = [];
    var last = 0;
    for (var i=0;i<text.length;i++) {

        if (text.charAt(i)=='\n') {
            contents.push(text.substring(last, i));
            last=i+1;
        }
        else if (text.charAt(i)=='\\' && text.charAt(i+1)=='n') {
            contents.push(text.substring(last, i));
            last=i+2;
        }
        else {
            var toAdd = text.substring(last, i+1);
            var width = core.canvas[canvas].measureText(toAdd).width;
            if (width>maxLength) {
                contents.push(text.substring(last, i));
                last=i;
            }
        }
    }
    contents.push(text.substring(last));
    return contents;
}

////// 向某个数组前插入另一个数组或元素 //////
core.prototype.unshift = function (a,b) {
    if (!(a instanceof Array) || !core.isset(b)) return;
    if (b instanceof Array) {
        core.clone(b).reverse().forEach(function (e) {
            a.unshift(e);
        });
    }
    else a.unshift(b);
    return a;
}

////// 设置本地存储 //////
core.prototype.setLocalStorage = function(key, value) {
    try {
        localStorage.setItem(core.firstData.name + "_" + key, JSON.stringify(value));
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

////// 获得本地存储 //////
core.prototype.getLocalStorage = function(key, defaultValue) {
    var value = localStorage.getItem(core.firstData.name+"_"+key);
    if (core.isset(value)) return JSON.parse(value);
    return defaultValue;
}

////// 移除本地存储 //////
core.prototype.removeLocalStorage = function (key) {
    localStorage.removeItem(core.firstData.name+"_"+key);
}

////// 深拷贝一个对象 //////
core.prototype.clone = function (data) {
    if (!core.isset(data)) return data;
    // date
    if (data instanceof Date) {
        var copy=new Date();
        copy.setTime(data.getTime());
        return copy;
    }
    // array
    if (data instanceof Array) {
        var copy=[];
        // for (var i=0;i<data.length;i++) {
        for (var i in data) {
            // copy.push(core.clone(data[i]));
            copy[i] = core.clone(data[i]);
        }
        return copy;
    }
    // 函数
    if (data instanceof Function) {
        return data;
    }
    // object
    if (data instanceof Object) {
        var copy={};
        for (var i in data) {
            if (data.hasOwnProperty(i))
                copy[i]=core.clone(data[i]);
        }
        return copy;
    }
    return data;
}

////// 格式化时间为字符串 //////
core.prototype.formatDate = function(date) {
    if (!core.isset(date)) return "";
    return date.getFullYear()+"-"+core.setTwoDigits(date.getMonth()+1)+"-"+core.setTwoDigits(date.getDate())+" "
        +core.setTwoDigits(date.getHours())+":"+core.setTwoDigits(date.getMinutes())+":"+core.setTwoDigits(date.getSeconds());
}

////// 格式化时间为最简字符串 //////
core.prototype.formatDate2 = function (date) {
    if (!core.isset(date)) return "";
    return date.getFullYear()+core.setTwoDigits(date.getMonth()+1)+core.setTwoDigits(date.getDate())
        +core.setTwoDigits(date.getHours())+core.setTwoDigits(date.getMinutes())+core.setTwoDigits(date.getSeconds());
}

////// 两位数显示 //////
core.prototype.setTwoDigits = function (x) {
    return parseInt(x)<10?"0"+x:x;
}

////// 数组转RGB //////
core.prototype.arrayToRGB = function (color) {
    var nowR = parseInt(color[0])||0, nowG = parseInt(color[1])||0, nowB = parseInt(color[2])||0;
    if (nowR<0) nowR=0; if (nowB<0) nowB=0;if (nowG<0) nowG=0;
    if (nowR>255) nowR=255; if (nowB>255) nowB=255; if (nowG>255) nowG=255;
    return "#"+((1<<24)+(nowR<<16)+(nowG<<8)+nowB).toString(16).slice(1);
}

////// 作弊 //////
core.prototype.debug = function() {
    core.setStatus('hp', 999999);
    core.setStatus('atk', 10000);
    core.setStatus('def', 10000);
    core.setStatus('mdef', 10000);
    core.setStatus('money', 10000);
    core.setStatus('experience', 10000);
    core.setItem('yellowKey', 50);
    core.setItem('blueKey', 50);
    core.setItem('redKey', 50);
    core.setItem('book', 1);
    core.setItem('fly', 1);
    for (var i in core.status.maps)
        if (core.status.maps[i].canFlyTo && core.status.hero.flyRange.indexOf(i)<0)
            core.status.hero.flyRange.push(i);
    core.updateStatusBar();
    core.drawTip("作弊成功");
}

////// 开始播放 //////
core.prototype.startReplay = function (list) {
    core.status.replay.replaying=true;
    core.status.replay.pausing=false;
    core.status.replay.speed=1.0;
    core.status.replay.toReplay = core.clone(list);
    core.status.replay.totalList = core.clone(list);
    core.updateStatusBar();
    core.drawTip("开始播放");
    this.replay();
    return;
}

////// 更改播放状态 //////
core.prototype.triggerReplay = function () {
    if (core.status.replay.pausing) this.resumeReplay();
    else this.pauseReplay();
}

////// 暂停播放 //////
core.prototype.pauseReplay = function () {
    if (!core.status.replay.replaying) return;
    core.status.replay.pausing = true;
    core.updateStatusBar();
    core.drawTip("暂停播放");
}

////// 恢复播放 //////
core.prototype.resumeReplay = function () {
    if (!core.status.replay.replaying) return;
    core.status.replay.pausing = false;
    core.updateStatusBar();
    core.drawTip("恢复播放");
    core.replay();
}

////// 加速播放 //////
core.prototype.forwardReplay = function () {
    if (!core.status.replay.replaying) return;
    core.status.replay.speed = parseInt(10*core.status.replay.speed + 1)/10;
    if (core.status.replay.speed>2.5) core.status.replay.speed=2.5;
    core.drawTip("x"+core.status.replay.speed+"倍");
}

////// 减速播放 //////
core.prototype.rewindReplay = function () {
    if (!core.status.replay.replaying) return;
    core.status.replay.speed = parseInt(10*core.status.replay.speed - 1)/10;
    if (core.status.replay.speed<0.3) core.status.replay.speed=0.3;
    core.drawTip("x"+core.status.replay.speed+"倍");
}

////// 停止播放 //////
core.prototype.stopReplay = function () {
    if (!core.status.replay.replaying) return;
    core.status.replay.toReplay = [];
    core.status.replay.totalList = [];
    core.status.replay.replaying=false;
    core.status.replay.pausing=false;
    core.status.replay.speed=1.0;
    core.updateStatusBar();
    core.drawTip("停止播放并恢复游戏");
}

////// 回放 //////
core.prototype.replay = function () {

    if (!core.status.replay.replaying) return; // 没有回放
    if (core.status.replay.pausing) return; // 暂停状态
    if (core.status.replay.animate) return; // 正在某段动画中

    if (core.status.replay.toReplay.length==0) { // 回放完毕
        core.stopReplay();
        core.insertAction("录像回放完毕！");
        return;
    }

    var action=core.status.replay.toReplay.shift();

    if (action=='up' || action=='down' || action=='left' || action=='right') {
        core.moveHero(action, function () {
            core.replay();
        });
        return;
    }
    else if (action.indexOf("item:")==0) {
        var itemId = action.substring(5);
        if (core.canUseItem(itemId)) {
            var tools = Object.keys(core.status.hero.items.tools).sort();
            var constants = Object.keys(core.status.hero.items.constants).sort();
            var index;
            if ((index=tools.indexOf(itemId))>=0 || (index=constants.indexOf(itemId)+100)>=100) {
                core.ui.drawToolbox(index);
                setTimeout(function () {
                    core.ui.closePanel();
                    core.useItem(itemId, function () {
                        core.replay();
                    });
                }, 750);
            }
            return;
        }
    }
    else if (action.indexOf("fly:")==0) {
        var floorId=action.substring(4);
        var toIndex=core.status.hero.flyRange.indexOf(floorId);
        var nowIndex=core.status.hero.flyRange.indexOf(core.status.floorId);
        if (core.hasItem('fly') && toIndex>=0 && nowIndex>=0) {
            core.ui.drawFly(toIndex);
            setTimeout(function () {
                core.ui.closePanel();
                var stair=toIndex<nowIndex?"upFloor":"downFloor";
                core.status.route.push("fly:"+floorId);
                core.changeFloor(floorId, stair, null, null, function () {
                    core.replay();
                });
            }, 750);
            return;
        }
    }
    else if (action.indexOf("shop:")==0) {
        var sps=action.substring(5).split(":");
        var shopId=sps[0], selections=sps[1].split("");

        if (selections.length>0) {
            var shop=core.status.shops[shopId];
            if (core.isset(shop) && shop.visited) { // 商店可用
                var choices = shop.choices;
                var topIndex = 6 - parseInt(choices.length / 2);

                core.status.event.selection = parseInt(selections.shift());

                core.events.openShop(shopId, false);
                var shopInterval = setInterval(function () {
                    if (!core.events.clickShop(6, topIndex+core.status.event.selection)) {
                        clearInterval(shopInterval);
                        core.stopReplay();
                        core.drawTip("录像文件出错");
                        return;
                    }
                    if (selections.length==0) {
                        clearInterval(shopInterval);
                        core.events.clickShop(6, topIndex+choices.length);
                        core.replay();
                        return;
                    }
                    core.status.event.selection = parseInt(selections.shift());
                    core.events.openShop(shopId, false);

                }, 750);
                return;
            }
        }
    }
    else if (action=='turn') {
        core.turnHero();
        core.replay();
        return;
    }
    else if (action=='getNext') {
        if (core.flags.enableGentleClick && core.getBlock(core.nextX(), core.nextY())!=null) {
            var nextX = core.nextX(), nextY = core.nextY();
            var block = core.getBlock(nextX, nextY);
            if (block!=null && block.block.event.trigger=='getItem') {
                core.getItem(block.block.event.id, 1, nextX, nextY);
                core.status.route.push("getNext");
                core.replay();
                return;
            }
        }
    }
    else if (action.indexOf('move:')==0) {
        var pos=action.substring(5).split(":");
        var x=parseInt(pos[0]), y=parseInt(pos[1]);
        if (core.canMoveDirectly(x,y)) {
            core.clearMap('hero', 0, 0, 416, 416);
            core.setHeroLoc('x', x);
            core.setHeroLoc('y', y);
            core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
            core.status.route.push("move:"+x+":"+y);
            core.replay();
            return;
        }
    }

    core.stopReplay();
    core.insertAction("录像文件出错");

}

////// 判断当前能否进入某个事件 //////
core.prototype.checkStatus = function (name, need, item) {
    if (need && core.status.event.id == name) {
        core.ui.closePanel();
        return false;
    }

    if (need && core.status.lockControl) return false;
    if (core.isset(item) && item && !core.hasItem(name)) {
        core.drawTip("你没有" + core.material.items[name].name);
        return false;
    }
    if (!core.status.heroStop) {
        core.drawTip("请先停止勇士行动");
        return false;
    }

    core.lockControl();
    core.status.event.id = name;
    return true;
}

////// 点击怪物手册时的打开操作 //////
core.prototype.openBook = function (need) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;

    // 当前是book，且从“浏览地图”打开
    if (core.status.event.id == 'book' && core.isset(core.status.event.selection)) {
        core.status.boxAnimateObjs = [];
        core.ui.drawMaps(core.status.event.selection);
        return;
    }

    // 从“浏览地图”页面打开
    if (core.status.event.id=='viewMaps') {
        need=false;
        core.status.event.selection = core.status.event.data;
    }

    if (!core.checkStatus('book', need, true))
        return;
    core.useItem('book');
}

////// 点击楼层传送器时的打开操作 //////
core.prototype.useFly = function (need) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;
    if (!core.checkStatus('fly', need, true))
        return;
    if (core.flags.flyNearStair && !core.nearStair()) {
        core.drawTip("只有在楼梯边才能使用传送器");
        core.unLockControl();
        core.status.event.data = null;
        core.status.event.id = null;
        return;
    }
    if (!core.canUseItem('fly')) {
        core.drawTip("楼层传送器好像失效了");
        core.unLockControl();
        core.status.event.data = null;
        core.status.event.id = null;
        return;
    }
    core.useItem('fly');
    return;
}

////// 点击工具栏时的打开操作 //////
core.prototype.openToolbox = function (need) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;
    if (!core.checkStatus('toolbox', need))
        return;
    core.ui.drawToolbox();
}

////// 点击快捷商店按钮时的打开操作 //////
core.prototype.openQuickShop = function (need) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;
    if (!core.checkStatus('selectShop', need))
        return;
    core.ui.drawQuickShop();
}

////// 点击保存按钮时的打开操作 //////
core.prototype.save = function(need) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;
    if (!core.checkStatus('save', need))
        return;

    var saveIndex = core.status.saveIndex;
    var page=parseInt((saveIndex-1)/5), offset=saveIndex-5*page;

    core.ui.drawSLPanel(10*page+offset);
}

////// 点击读取按钮时的打开操作 //////
core.prototype.load = function (need) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;

    var saveIndex = core.getLocalStorage('saveIndex2', 1);
    var page=parseInt((saveIndex-1)/5), offset=saveIndex-5*page;

    // 游戏开始前读档
    if (!core.isPlaying()) {
        core.status.event = {'id': 'load', 'data': null};
        core.status.lockControl = true;
        core.dom.startPanel.style.display = 'none';
        core.ui.drawSLPanel(10*page+offset);
        return;
    }

    if (!core.checkStatus('load', need))
        return;
    core.ui.drawSLPanel(10*page+offset);
}

////// 点击设置按钮时的操作 //////
core.prototype.openSettings = function (need) {
    if (core.isset(core.status.replay)&&core.status.replay.replaying) return;
    if (!core.checkStatus('settings', need))
        return;
    core.ui.drawSettings();
}

////// 自动存档 //////
core.prototype.autosave = function (removeLast) {
    var x=null;
    if (removeLast)
        x=core.status.route.pop();
    core.saveData("autoSave");
    if (removeLast && core.isset(x))
        core.status.route.push(x);
}

////// 实际进行存读档事件 //////
core.prototype.doSL = function (id, type) {
    if (type=='save') {
        if (id=='autoSave') {
            core.drawTip('不能覆盖自动存档！');
            return;
        }
        if (core.saveData("save"+id)) {
            core.ui.closePanel();
            core.drawTip('存档成功！');
            if (id!="autoSave") {
                core.status.saveIndex=id;
                core.setLocalStorage('saveIndex2', core.status.saveIndex);
            }
        }
        else {
            core.drawTip('存储空间不足，请覆盖已有的存档或在菜单栏中进行清理');
        }
        return;
    }
    else if (type=='load') {
        var data = core.getLocalStorage(id=='autoSave'?id:"save"+id, null);
        if (!core.isset(data)) {
            core.drawTip("无效的存档");
            return;
        }
        if (data.version != core.firstData.version) {
            // core.drawTip("存档版本不匹配");
            if (confirm("存档版本不匹配！\n你想回放此存档的录像吗？")) {
                core.dom.startPanel.style.display = 'none';
                core.resetStatus(core.firstData.hero, data.hard, core.firstData.floorId, null, core.initStatus.maps);
                core.events.setInitData(data.hard);
                core.changeFloor(core.status.floorId, null, core.firstData.hero.loc, null, function() {
                    core.startReplay(core.decodeRoute(data.route));
                });
            }
            return;
        }
        core.ui.closePanel();
        core.loadData(data, function() {
            core.drawTip("读档成功");
            if (id!="autoSave") {
                core.status.saveIndex=id;
                core.setLocalStorage('saveIndex2', core.status.saveIndex);
            }
        });
        return;
    }
}

////// 同步存档到服务器 //////
core.prototype.syncSave = function (type) {
    var saves=null;
    // data
    if (type=='all') {
        saves=[];
        for (var i=1;i<=150;i++) {
            var data = core.getLocalStorage("save"+i, null);
            if (core.isset(data)) {
                saves.push(data);
            }
        }
    }
    else {
        for (var i=150;i>=1;i--) {
            saves=core.getLocalStorage("save"+i, null);
            if (core.isset(saves)) {
                break;
            }
        }
    }
    if (!core.isset(saves)) {
        core.drawText("没有要同步的存档");
        return;
    }
    core.ui.drawWaiting("正在同步，请稍后...");

    var formData = new FormData();
    formData.append('type', 'save');
    formData.append('name', core.firstData.name);
    var save_text = JSON.stringify(saves);
    formData.append('data', save_text);

    // send
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/games/sync.php");
    xhr.onload = function(e) {
        if (xhr.status==200) {
            // console.log("同步成功。");
            var response = JSON.parse(xhr.response);
            if (response.code<0) {
                core.drawText("出错啦！\n无法同步存档到服务器。\n错误原因："+response.msg);
            }
            else {
                core.drawText("同步成功！\n\n您的存档编号： "+response.code+"\n您的存档密码： "+response.msg+"\n\n请牢记以上两个信息（如截图等），在从服务器\n同步存档时使用。")
            }
        }
        else {
            core.drawText("出错啦！\n无法同步存档到服务器。\n错误原因：HTTP "+xhr.status);
        }
    };
    xhr.ontimeout = function() {
        core.drawText("出错啦！\n无法同步存档到服务器。\n错误原因：Timeout");
    }
    xhr.onerror = function() {
        core.drawText("出错啦！\n无法同步存档到服务器。\n错误原因：XHR Error");
    }
    xhr.send(formData);
}

////// 从服务器加载存档 //////
core.prototype.syncLoad = function () {
    var id = prompt("请输入存档编号：");
    if (id==null || id=="") {
        core.ui.drawSyncSave(); return;
    }
    var password = prompt("请输入存档密码：");
    if (password==null || password=="") {
        core.ui.drawSyncSave(); return;
    }
    core.ui.drawWaiting("正在同步，请稍后...");

    var formData = new FormData();
    formData.append('type', 'load');
    formData.append('name', core.firstData.name);
    formData.append('id', id);
    formData.append('password', password);

    // send
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/games/sync.php");
    xhr.onload = function(e) {
        if (xhr.status==200) {
            // console.log("同步成功。");
            var response = JSON.parse(xhr.response);
            switch (response.code) {
                case 0:
                    // 成功
                    var data=JSON.parse(response.msg);
                    // console.log(data);

                    if (data instanceof Array) {
                        core.status.event.selection=1;
                        core.ui.drawConfirmBox("所有本地存档都将被覆盖，确认？", function () {
                            for (var i=1;i<=150;i++) {
                                if (i<=data.length) {
                                    core.setLocalStorage("save"+i, data[i-1]);
                                }
                                else {
                                    core.removeLocalStorage("save"+i);
                                }
                            }
                            core.drawText("同步成功！\n你的本地所有存档均已被覆盖。");
                        }, function () {
                            core.status.event.selection=0;
                            core.ui.drawSyncSave();
                        })
                    }
                    else {
                        // 只覆盖单存档
                        var index=150;
                        for (var i=150;i>=1;i--) {
                            if (core.getLocalStorage("save"+i, null)==null)
                                index=i;
                            else break;
                        }
                        core.setLocalStorage("save"+index, data);
                        core.drawText("同步成功！\n单存档已覆盖至存档"+index);
                    }
                    break;
                case -1:
                    core.drawText("出错啦！\n存档编号"+id+"不存在！");
                    break;
                case -2:
                    core.drawText("出错啦！\n存档密码错误！");
                    break;
                default:
                    core.drawText("出错啦！\n无法从服务器同步存档。\n错误原因："+response.msg);
                    break;
            }
        }
        else {
            core.drawText("出错啦！\n无法从服务器同步存档。\n错误原因：HTTP "+xhr.status);
        }
    };
    xhr.ontimeout = function() {
        core.drawText("出错啦！\n无法从服务器同步存档。\n错误原因：Timeout");
    }
    xhr.onerror = function() {
        core.drawText("出错啦！\n无法从服务器同步存档。\n错误原因：XHR Error");
    }
    xhr.send(formData);
}
/*

////// 存档同步操作 //////
core.prototype.syncSave = function(type) {
    if (type=='save') {
        core.status.event.selection=1;
        core.ui.drawConfirmBox("你确定要将本地存档同步到服务器吗？", function(){
            // console.log("同步存档...");
            core.ui.drawWaiting("正在同步，请稍后...");

            var formData = new FormData();
            formData.append('type', 'save');
            formData.append('name', core.firstData.name);
            var saves = [];
            for (var i=1;i<=150;i++) {
                var data = core.getLocalStorage("save"+i, null);
                if (core.isset(data)) {
                    saves.push(data);
                }
            }
            var save_text = JSON.stringify(saves);
            formData.append('data', save_text);

            // send
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/games/sync.php");
            xhr.onload = function(e) {
                if (xhr.status==200) {
                    // console.log("同步成功。");
                    var response = JSON.parse(xhr.response);
                    if (response.code<0) {
                        core.drawText("出错啦！\n无法同步存档到服务器。\n错误原因："+response.msg);
                    }
                    else {
                        core.drawText("同步成功！\n\n您的存档编号： "+response.code+"\n您的存档密码： "+response.msg+"\n\n请牢记以上两个信息（如截图等），在从服务器\n同步存档时使用。")
                    }
                }
                else {
                    core.drawText("出错啦！\n无法同步存档到服务器。\n错误原因：HTTP "+xhr.status);
                }
            };
            xhr.ontimeout = function() {
                core.drawText("出错啦！\n无法同步存档到服务器。\n错误原因：Timeout");
            }
            xhr.onerror = function() {
                core.drawText("出错啦！\n无法同步存档到服务器。\n错误原因：XHR Error");
            }
            xhr.send(formData);
        }, function() {
            core.status.event.selection=0;
            core.ui.drawSyncSave();
        })
    }
    else if (type=='load') {
        core.status.event.selection=1;
        core.ui.drawConfirmBox("你确定要从服务器加载存档吗？\n该操作将覆盖所有本地存档且不可逆！", function(){
            var id = prompt("请输入存档编号：");
            if (id==null || id=="") {
                core.ui.drawSyncSave(); return;
            }
            var password = prompt("请输入存档密码：");
            if (password==null || password=="") {
                core.ui.drawSyncSave(); return;
            }
            core.ui.drawWaiting("正在同步，请稍后...");

            var formData = new FormData();
            formData.append('type', 'load');
            formData.append('name', core.firstData.name);
            formData.append('id', id);
            formData.append('password', password);

            // send
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/games/sync.php");
            xhr.onload = function(e) {
                if (xhr.status==200) {
                    // console.log("同步成功。");
                    var response = JSON.parse(xhr.response);
                    switch (response.code) {
                        case 0:
                            // 成功
                            var data=JSON.parse(response.msg);
                            // console.log(data);
                            for (var i=1;i<=150;i++) {
                                if (i<=data.length) {
                                    core.setLocalStorage("save"+i, data[i-1]);
                                }
                                else {
                                    core.removeLocalStorage("save"+i);
                                }
                            }
                            core.drawText("同步成功！\n你的本地所有存档均已被覆盖。");
                            break;
                        case -1:
                            core.drawText("出错啦！\n存档编号"+id+"不存在！");
                            break;
                        case -2:
                            core.drawText("出错啦！\n存档密码错误！");
                            break;
                        default:
                            core.drawText("出错啦！\n无法从服务器同步存档。\n错误原因："+response.msg);
                            break;
                    }
                }
                else {
                    core.drawText("出错啦！\n无法从服务器同步存档。\n错误原因：HTTP "+xhr.status);
                }
            };
            xhr.ontimeout = function() {
                core.drawText("出错啦！\n无法同步存档到服务器。\n错误原因：Timeout");
            }
            xhr.onerror = function() {
                core.drawText("出错啦！\n无法同步存档到服务器。\n错误原因：XHR Error");
            }
            xhr.send(formData);
        }, function() {
            core.status.event.selection=1;
            core.ui.drawSyncSave();
        })
    }

}
*/

////// 存档到本地 //////
core.prototype.saveData = function(dataId) {
    var data = {
        'floorId': core.status.floorId,
        'hero': core.clone(core.status.hero),
        'hard': core.status.hard,
        'maps': core.maps.save(core.status.maps),
        'route': core.encodeRoute(core.status.route),
        'shops': {},
        'version': core.firstData.version,
        "time": new Date().getTime()
    };
    // set shop times
    for (var shop in core.status.shops) {
        data.shops[shop]={
            'times': core.status.shops[shop].times || 0,
            'visited': core.status.shops[shop].visited || false
        }
    }
    core.events.beforeSaveData(data);

    return core.setLocalStorage(dataId, data);
}

////// 从本地读档 //////
core.prototype.loadData = function (data, callback) {

    core.resetStatus(data.hero, data.hard, data.floorId, core.decodeRoute(data.route), core.maps.load(data.maps));

    // load shop times
    for (var shop in core.status.shops) {
        if (core.isset(data.shops[shop])) {
            core.status.shops[shop].times = data.shops[shop].times;
            core.status.shops[shop].visited = data.shops[shop].visited;
        }
    }

    core.events.afterLoadData(data);

    core.changeFloor(data.floorId, null, data.hero.loc, 0, function() {
        if (core.isset(callback)) callback();
    });
}

////// 加密路线 //////
core.prototype.encodeRoute = function (route) {
    var ans="";
    var lastMove = "", cnt=0;

    var items=Object.keys(core.material.items).sort();
    var shops=Object.keys(core.initStatus.shops).sort();
    route.forEach(function (t) {
        if (t=='up' || t=='down' || t=='left' || t=='right') {
            if (t!=lastMove && cnt>0) {
                ans+=lastMove.substring(0,1).toUpperCase();
                if (cnt>1) ans+=cnt;
                cnt=0;
            }
            lastMove=t;
            cnt++;
        }
        else {
            if (cnt>0) {
                ans+=lastMove.substring(0,1).toUpperCase();
                if (cnt>1) ans+=cnt;
                cnt=0;
            }
            if (t.indexOf('item:')==0)
                ans+="I"+items.indexOf(t.substring(5));
            else if (t.indexOf('fly:')==0)
                ans+="F"+core.floorIds.indexOf(t.substring(4));
            else if (t.indexOf('choices:')==0)
                ans+="C"+t.substring(8);
            else if (t.indexOf('shop:')==0) {
                var sp=t.substring(5).split(":");
                ans+="S"+shops.indexOf(sp[0])+":"+sp[1];
            }
            else if (t=='turn')
                ans+='T';
            else if (t=='getNext')
                ans+='G';
            else if (t.indexOf('input:')==0)
                ans+="P"+t.substring(6);
            else if (t=='no')
                ans+='N';
            else if (t.indexOf('move:')==0) {
                ans+="M"+t.substring(5);
            }
        }
    });
    if (cnt>0) {
        ans+=lastMove.substring(0,1).toUpperCase();
        if (cnt>1) ans+=cnt;
    }
    return ans;
}

////// 解密路线 //////
core.prototype.decodeRoute = function (route) {

    if (!core.isset(route)) return route;

    var ans=[], index=0;

    var getNumber = function (noparse) {
        var num="";
        while (index<route.length && !isNaN(route.charAt(index))) {
            num+=route.charAt(index++);
        }
        if (num.length==0) num="1";
        return core.isset(noparse)?num:parseInt(num);
    }

    var items=Object.keys(core.material.items).sort();
    var shops=Object.keys(core.initStatus.shops).sort();
    while (index<route.length) {
        var c=route.charAt(index++);
        var number=getNumber();

        switch (c) {
            case "U": for (var i=0;i<number;i++) ans.push("up"); break;
            case "D": for (var i=0;i<number;i++) ans.push("down"); break;
            case "L": for (var i=0;i<number;i++) ans.push("left"); break;
            case "R": for (var i=0;i<number;i++) ans.push("right"); break;
            case "I": ans.push("item:"+items[number]); break;
            case "F": ans.push("fly:"+core.floorIds[number]); break;
            case "C": ans.push("choices:"+number); break;
            case "S": ++index; ans.push("shop:"+shops[number]+":"+getNumber(true)); break;
            case "T": ans.push("turn"); break;
            case "G": ans.push("getNext"); break;
            case "P": ans.push("input:"+number); break;
            case "N": ans.push("no"); break;
            case "M": ++index; ans.push("move:"+number+":"+getNumber()); break;
        }
    }
    return ans;
}

////// 设置勇士属性 //////
core.prototype.setStatus = function (statusName, statusVal) {
    core.status.hero[statusName] = statusVal;
}

////// 获得勇士属性 //////
core.prototype.getStatus = function (statusName) {
    return core.status.hero[statusName];
}

////// 获得某个等级的名称 //////
core.prototype.getLvName = function () {
    if (core.status.hero.lv>core.firstData.levelUp.length) return core.status.hero.lv;
    return core.firstData.levelUp[core.status.hero.lv-1].name || core.status.hero.lv;
}

////// 设置某个自定义变量或flag //////
core.prototype.setFlag = function(flag, value) {
    if (!core.isset(core.status.hero)) return;
    core.status.hero.flags[flag]=value;
}

////// 获得某个自定义变量或flag //////
core.prototype.getFlag = function(flag, defaultValue) {
    if (!core.isset(core.status.hero)) return defaultValue;
    var value = core.status.hero.flags[flag];
    if (core.isset(value)) return value;
    return defaultValue;
}

////// 是否存在某个自定义变量或flag，且值为true //////
core.prototype.hasFlag = function(flag) {
    if (core.getFlag(flag)) return true;
    return false;
}

////// 往当前事件列表之前插入一系列事件 //////
core.prototype.insertAction = function (list, x, y, callback) {
    core.events.insertAction(list, x, y, callback);
}

////// 锁定状态栏，常常用于事件处理 //////
core.prototype.lockControl = function () {
    core.status.lockControl = true;
}

////// 解锁状态栏 //////
core.prototype.unLockControl = function () {
    core.status.lockControl = false;
}

////// 判断某对象是否不为undefined也不会null //////
core.prototype.isset = function (val) {
    if (val == undefined || val == null || (typeof val=='number' && isNaN(val))) {
        return false;
    }
    return true
}

////// 读取一个本地文件内容 //////
core.prototype.readFile = function (success, error) {

    // step 0: 不为http/https，直接不支持
    if (!core.platform.isOnline) {
        alert("离线状态下不支持文件读取！");
        if (core.isset(error)) error();
        return;
    }

    // Step 1: 如果不支持FileReader，直接不支持
    if (core.platform.fileReader==null) {
        alert("当前浏览器不支持FileReader！");
        if (core.isset(error)) error();
        return;
    }

    if (core.platform.fileInput==null) {
        core.platform.fileInput = document.createElement("input");
        core.platform.fileInput.style.display = 'none';
        core.platform.fileInput.type = 'file';
        core.platform.fileInput.onchange = function () {
            var files = core.platform.fileInput.files;
            if (files.length==0) {
                if (core.isset(core.platform.errorCallback))
                    core.platform.errorCallback();
                return;
            }
            core.platform.fileReader.readAsText(core.platform.fileInput.files[0]);
            core.platform.fileInput.value = '';
        }
    }

    core.platform.successCallback = success;
    core.platform.errorCallback = error;
    core.platform.fileInput.click();
}

////// 下载文件到本地 //////
core.prototype.download = function (filename, content) {

    // Step 0: 不为http/https，直接不支持
    if (!core.platform.isOnline) {
        alert("离线状态下不支持下载操作！");
        return;
    }

    // Step 1: 如果是iOS平台，直接不支持
    if (core.platform.isIOS) {
        alert("iOS平台下不支持下载操作！");
        return;
    }

    // Step 2: 如果不是PC平台（Android），则只支持chrome
    if (!core.platform.isPC) {
        if (!core.platform.isChrome || core.platform.isQQ || core.platform.isWeChat) { // 检测chrome
            if (core.copy(content)) {
                alert("移动端只有Chrome浏览器支持直接下载文件！\n所有应下载内容已经复制到您的剪切板，请自行创建空白文件并粘贴。");
            }
            else {
                alert("该平台或浏览器暂不支持下载操作！");
            }
            return;
        }
    }

    // Step 3: 如果是Safari浏览器，则提示并打开新窗口
    if (core.platform.isSafari) {
        alert("你当前使用的是Safari浏览器，不支持直接下载文件。\n即将打开一个新窗口为应下载内容，请自行全选复制然后创建空白文件并粘贴。");
        var blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
        var href = window.URL.createObjectURL(blob);
        var opened=window.open(href, "_blank");
        // if (!opened) window.location.href=href;
        window.URL.revokeObjectURL(href);
        return;
    }

    // Step 4: 下载
    var blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else {
        var href = window.URL.createObjectURL(blob);
        var elem = window.document.createElement('a');
        elem.href = href;
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
        window.URL.revokeObjectURL(href);
    }
}

////// 复制一段内容到剪切板 //////
core.prototype.copy = function (data) {
    if (!core.platform.supportCopy) return false;

    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = data;
    document.body.appendChild(textArea);
    textArea.select();
    var successful = false;
    try {
        successful = document.execCommand('copy');
    } catch (err) {
        successful = false;
    }

    document.body.removeChild(textArea);
    return successful;
}

////// 播放背景音乐 //////
core.prototype.playBgm = function (bgm) {

    // 如果不允许播放
    if (!core.musicStatus.bgmStatus) return;
    // 音频不存在
    if (!core.isset(core.material.bgms[bgm])) return;

    // 延迟播放
    if (core.material.bgms[bgm] == 'loading') {
        core.material.bgms[bgm] = 'starting';
        return;
    }

    try {
        // 如果当前正在播放，且和本BGM相同，直接忽略
        if (core.musicStatus.playingBgm == bgm && core.musicStatus.isPlaying) {
            return;
        }
        // 如果正在播放中，暂停
        if (core.isset(core.musicStatus.playingBgm) && core.musicStatus.isPlaying) {
            core.material.bgms[core.musicStatus.playingBgm].pause();
        }
        // 播放当前BGM
        core.musicStatus.playingBgm = bgm;
        core.material.bgms[bgm].play();
        core.musicStatus.isPlaying = true;

    }
    catch (e) {
        console.log("无法播放BGM "+bgm);
        console.log(e);
        core.musicStatus.playingBgm = null;
    }
}

////// 暂停背景音乐的播放 //////
core.prototype.pauseBgm = function () {
    // 直接暂停播放
    try {
        if (core.isset(core.musicStatus.playingBgm)) {
            core.material.bgms[core.musicStatus.playingBgm].pause();
        }
        core.musicStatus.isPlaying = false;
    }
    catch (e) {
        console.log("无法暂停BGM "+bgm);
        console.log(e);
    }
}

////// 恢复背景音乐的播放 //////
core.prototype.resumeBgm = function () {

    // 如果不允许播放
    if (!core.musicStatus.bgmStatus) return;

    // 恢复BGM
    try {
        if (core.isset(core.musicStatus.playingBgm)) {
            core.material.bgms[core.musicStatus.playingBgm].play();
            core.musicStatus.isPlaying = true;
        }
        else {
            if (core.bgms.length>0) {
                core.playBgm(core.bgms[0]);
                core.musicStatus.isPlaying = true;
            }
        }
    }
    catch (e) {
        console.log("无法恢复BGM "+bgm);
        console.log(e);
    }
}

////// 播放音频 //////
core.prototype.playSound = function (sound) {

    // 如果不允许播放
    if (!core.musicStatus.soundStatus) return;
    // 音频不存在
    if (!core.isset(core.material.sounds[sound])) return;

    try {
        if (core.musicStatus.audioContext != null) {
            var source = core.musicStatus.audioContext.createBufferSource();
            source.buffer = core.material.sounds[sound];
            source.connect(core.musicStatus.audioContext.destination);
            try {
                source.start(0);
            }
            catch (e) {
                try {
                    source.noteOn(0);
                }
                catch (ee) {
                }
            }
        }
        else {
            core.material.sounds[sound].play();
        }
    }
    catch (eee) {
        console.log("无法播放SE "+bgm);
        console.log(eee);
    }
}

////// 动画显示某对象 //////
core.prototype.show = function (obj, speed, callback) {
    if (!core.isset(speed)) {
        obj.style.display = 'block';
        return;
    }
    obj.style.display = 'block';
    obj.style.opacity = 0;
    var opacityVal = 0;
    var showAnimate = window.setInterval(function () {
        opacityVal += 0.03;
        obj.style.opacity = opacityVal;
        if (opacityVal > 1) {
            clearInterval(showAnimate);
            if (core.isset(callback)) {
                callback();
            }
        }
    }, speed);
}

////// 动画使某对象消失 //////
core.prototype.hide = function (obj, speed, callback) {
    if (!core.isset(speed)) {
        obj.style.display = 'none';
        return;
    }
    var opacityVal = 1;
    var hideAnimate = window.setInterval(function () {
        opacityVal -= 0.03;
        obj.style.opacity = opacityVal;
        if (opacityVal < 0) {
            obj.style.display = 'none';
            clearInterval(hideAnimate);
            if (core.isset(callback)) {
                callback();
            }
        }
    }, speed);
}


////// 清空状态栏 //////
core.prototype.clearStatusBar = function() {
    var statusList = ['floor', 'lv', 'hp', 'atk', 'def', 'mdef', 'money', 'experience', 'up', 'yellowKey', 'blueKey', 'redKey', 'poison', 'weak', 'curse', 'hard'];
    statusList.forEach(function (e) {
        core.statusBar[e].innerHTML = "&nbsp;";
    });
    core.statusBar.image.book.style.opacity = 0.3;
    core.statusBar.image.fly.style.opacity = 0.3;
}

////// 更新状态栏 //////
core.prototype.updateStatusBar = function () {

    // 检查等级
    core.events.checkLvUp();

    // 检查HP上限
    if (core.values.HPMAX>0) {
        core.setStatus('hp', Math.min(core.values.HPMAX, core.getStatus('hp')));
    }

    // 更新领域、阻击、显伤
    core.updateCheckBlock();

    var lvName = core.getLvName();
    core.statusBar.lv.innerHTML = lvName;
    if (/^[+-]?\d+$/.test(lvName))
        core.statusBar.lv.style.fontStyle = 'italic';
    else core.statusBar.lv.style.fontStyle = 'normal';

    var statusList = ['hp', 'atk', 'def', 'mdef', 'money', 'experience'];
    statusList.forEach(function (item) {
        core.statusBar[item].innerHTML = core.getStatus(item);
    });
    // 进阶
    if (core.flags.enableLevelUp && core.status.hero.lv<core.firstData.levelUp.length) {
        core.statusBar.up.innerHTML = core.firstData.levelUp[core.status.hero.lv].need || "&nbsp;";
    }
    else core.statusBar.up.innerHTML = "&nbsp;";

    var keys = ['yellowKey', 'blueKey', 'redKey'];
    keys.forEach(function (key) {
        core.statusBar[key].innerHTML = core.setTwoDigits(core.status.hero.items.keys[key]);
    })
    if(core.flags.enableDebuff){
        core.statusBar.poison.innerHTML = core.hasFlag('poison')?"毒":"";
        core.statusBar.weak.innerHTML = core.hasFlag('weak')?"衰":"";
        core.statusBar.curse.innerHTML = core.hasFlag('curse')?"咒":"";
    }

    core.statusBar.hard.innerHTML = core.status.hard;


    // 回放
    if (core.status.replay.replaying) {
        core.statusBar.image.book.src = core.status.replay.pausing?core.statusBar.icons.play.src:core.statusBar.icons.pause.src;
        core.statusBar.image.book.style.opacity = 1;

        core.statusBar.image.fly.src = core.statusBar.icons.stop.src;
        core.statusBar.image.fly.style.opacity = 1;

        //core.statusBar.image.toolbox.src = core.statusBar.icons.forward.src;
        core.statusBar.image.toolbox.style.opacity = 0;

        core.statusBar.image.shop.style.opacity = 0;

        core.statusBar.image.save.src = core.statusBar.icons.rewind.src;
        core.statusBar.image.save.style.opacity = 1;

        core.statusBar.image.load.src = core.statusBar.icons.forward.src;
        core.statusBar.image.load.style.opacity = 1;

        core.statusBar.image.settings.style.opacity = 0;

    }
    else {
        core.statusBar.image.book.src = core.statusBar.icons.book.src;
        core.statusBar.image.book.style.opacity = core.hasItem('book')?1:0.3;

        core.statusBar.image.fly.src = core.statusBar.icons.fly.src;
        core.statusBar.image.fly.style.opacity = core.hasItem('fly')?1:0.3;

        core.statusBar.image.toolbox.src = core.statusBar.icons.toolbox.src;
        core.statusBar.image.toolbox.style.opacity = 1;

        core.statusBar.image.shop.style.opacity = 1;

        core.statusBar.image.save.src = core.statusBar.icons.save.src;
        core.statusBar.image.save.style.opacity = 1;

        core.statusBar.image.load.src = core.statusBar.icons.load.src;
        core.statusBar.image.load.style.opacity = 1;

        core.statusBar.image.settings.src = core.statusBar.icons.settings.src;
        core.statusBar.image.settings.style.opacity = 1;
    }

    core.updateFg();
}

////// 屏幕分辨率改变后重新自适应 //////
core.prototype.resize = function(clientWidth, clientHeight) {
    
    // 默认画布大小
    var DEFAULT_CANVAS_WIDTH = 422;
    // 默认边栏宽度
    var DEFAULT_BAR_WIDTH = 132;
    
    var BASE_LINEHEIGHT = 32;
    var SPACE = 3;
    var DEFAULT_FONT_SIZE = 16;
    //适配宽度 422
    var ADAPT_WIDTH = DEFAULT_CANVAS_WIDTH;
    var CHANGE_WIDTH = DEFAULT_CANVAS_WIDTH+DEFAULT_BAR_WIDTH;
    //判断横竖屏
    var width = clientWidth;
    var isHorizontal = false;
    if(clientWidth > clientHeight && clientHeight < ADAPT_WIDTH){
        isHorizontal = true;
        width = clientHeight;
    }
    // 各元素大小的变量声明
    var gameGroupWidth, gameGroupHeight, borderRight,
        canvasWidth, canvasTop, // canvasLeft,
        statusBarWidth, statusBarHeight, statusBarBorder,
        statusWidth, statusHeight, statusMaxWidth,statusLabelsLH,
        toolBarWidth, toolBarHeight, toolBarTop, toolBarBorder,
        toolsWidth, toolsHeight,toolsMargin,toolsPMaxwidth,
        fontSize, toolbarFontSize, margin;
        
    var count = 11;
    if (!core.flags.enableFloor) count--;
    if (!core.flags.enableLv) count--;
    if (!core.flags.enableMDef) count--;
    if (!core.flags.enableMoney) count--;
    if (!core.flags.enableExperience) count--;
    if (!core.flags.enableLevelUp) count--;
    if (!core.flags.enableDebuff) count--;

    var statusLineHeight = BASE_LINEHEIGHT * 9 / count;
    var statusLineFontSize = DEFAULT_FONT_SIZE;
    if (count>9) statusLineFontSize = statusLineFontSize * 9 / count;
    
    var shopDisplay;

    statusBarBorder = '3px #fff solid';
    toolBarBorder = '3px #fff solid';
    var zoom = (ADAPT_WIDTH - width) / 4.22;
    var aScale = 1 - zoom / 100;

    // 移动端
    if (width < CHANGE_WIDTH) {
        if(width < ADAPT_WIDTH){
            
            core.domStyle.scale = aScale;
            canvasWidth = width;
        }else{
            canvasWidth = DEFAULT_CANVAS_WIDTH;
            core.domStyle.scale = 1;
        }
        
        var scale = core.domStyle.scale
        var tempWidth = DEFAULT_CANVAS_WIDTH * scale;
        if(!isHorizontal){ //竖屏
            core.domStyle.screenMode = 'vertical';
            //显示快捷商店图标
            shopDisplay = 'block';
            //判断应该显示几行
            // var col = core.flags.enableMDef || core.flags.enableExperience || core.flags.enableDebuff ? 3 : 2;
            var col = parseInt((count-1)/3)+1;

            var tempTopBarH = scale * (BASE_LINEHEIGHT * col + SPACE * 2) + 6;
            var tempBotBarH = scale * (BASE_LINEHEIGHT + SPACE * 4) + 6;
            
            gameGroupHeight = tempWidth + tempTopBarH + tempBotBarH;
            
            gameGroupWidth = tempWidth
            canvasTop = tempTopBarH;
            // canvasLeft = 0;
            toolBarWidth = statusBarWidth = canvasWidth;
            statusBarHeight = tempTopBarH; 
            statusBarBorder = '3px #fff solid';

            statusHeight = scale*BASE_LINEHEIGHT * .8;
            statusLabelsLH = .8 * BASE_LINEHEIGHT *scale;
            statusMaxWidth = scale * DEFAULT_BAR_WIDTH * .95;
            toolBarHeight = tempBotBarH;

            toolBarTop = statusBarHeight + canvasWidth;
            toolBarBorder = '3px #fff solid';
            toolsHeight = scale * BASE_LINEHEIGHT;
            toolsPMaxwidth = scale * DEFAULT_BAR_WIDTH * .4;
            borderRight = '3px #fff solid';
            
            margin = scale * SPACE * 2;
            toolsMargin = scale * SPACE * 4;
            fontSize = DEFAULT_FONT_SIZE * scale;
            toolbarFontSize = DEFAULT_FONT_SIZE * scale;
        }else { //横屏
            core.domStyle.screenMode = 'horizontal';
            shopDisplay = 'none';
            gameGroupWidth = tempWidth + DEFAULT_BAR_WIDTH * scale;
            gameGroupHeight = tempWidth;
            canvasTop = 0;
            // canvasLeft = DEFAULT_BAR_WIDTH * scale;
            toolBarWidth = statusBarWidth = DEFAULT_BAR_WIDTH * scale;
            statusBarHeight = scale * statusLineHeight * count + SPACE * 2; //一共有9行加上两个padding空隙
            statusBarBorder = '3px #fff solid';

            statusHeight = scale*statusLineHeight * .8;
            statusLabelsLH = .8 * statusLineHeight *scale;
            toolBarHeight = canvasWidth - statusBarHeight;
            toolBarTop = scale*statusLineHeight * count + SPACE * 2;
            toolBarBorder = '3px #fff solid';
            toolsHeight = scale * BASE_LINEHEIGHT;
            fontSize = statusLineFontSize * scale;
            toolbarFontSize = DEFAULT_FONT_SIZE * scale;
            borderRight = '';
            statusMaxWidth = scale * DEFAULT_BAR_WIDTH;
            toolsPMaxwidth = scale * DEFAULT_BAR_WIDTH;

            margin = scale * SPACE * 2;
            toolsMargin = 2 * SPACE * scale;
        }
        
    }else { //大屏设备 pc端
        core.domStyle.scale = 1;
        core.domStyle.screenMode = 'bigScreen';
        shopDisplay = 'none';

        gameGroupWidth = DEFAULT_CANVAS_WIDTH + DEFAULT_BAR_WIDTH;
        gameGroupHeight = DEFAULT_CANVAS_WIDTH;
        canvasWidth = DEFAULT_CANVAS_WIDTH;
        canvasTop = 0;
        // canvasLeft = DEFAULT_BAR_WIDTH;

        toolBarWidth = statusBarWidth = DEFAULT_BAR_WIDTH;
        statusBarHeight = statusLineHeight * count + SPACE * 2; //一共有9行

        statusHeight = statusLineHeight * .8;
        statusLabelsLH = .8 * statusLineHeight;
        toolBarHeight = DEFAULT_CANVAS_WIDTH - statusBarHeight;
        toolBarTop = statusLineHeight * count + SPACE * 2;
        
        toolsHeight = BASE_LINEHEIGHT;
        borderRight = '';
        fontSize = statusLineFontSize;
        toolbarFontSize = DEFAULT_FONT_SIZE;
        statusMaxWidth = DEFAULT_BAR_WIDTH;
        toolsPMaxwidth = DEFAULT_BAR_WIDTH * .9;
        margin = SPACE * 2;
        toolsMargin = 2 * SPACE;
    }

    var unit = 'px'
    core.domStyle.styles = [
        {
            id: 'gameGroup',
            rules:{
                width: gameGroupWidth + unit,
                height: gameGroupHeight + unit,
                top: (clientHeight-gameGroupHeight)/2 + unit,
                left: (clientWidth-gameGroupWidth)/2 + unit,
            }
        },
        {
            className: 'gameCanvas',
            rules:{
                width: canvasWidth + unit, 
                height: canvasWidth + unit,
                top: canvasTop + unit,
                right: 0,
                border: '3px #fff solid',
            }
        },
        {
            id: 'curtain',
            rules: {
                width: (canvasWidth - SPACE*2) + unit,
                height:(canvasWidth - SPACE*2) + unit,
                top: (canvasTop + SPACE) + unit,
                right: SPACE + unit,
            }
        },
        {
            id: 'floorMsgGroup',
            rules:{
                width: (canvasWidth - SPACE*2) + unit,
                height: (gameGroupHeight - SPACE*2) + unit,
                top: SPACE + unit,
                right: SPACE + unit,
            }
        },
        {
            id: 'statusBar',
            rules:{
                width: statusBarWidth + unit,
                height: statusBarHeight + unit,
                top: 0,
                left: 0,
                padding: SPACE + unit,

                borderTop: statusBarBorder,
                borderLeft: statusBarBorder,
                borderRight: borderRight,
                fontSize: fontSize + unit
            }
        },
        {
            className: 'status',
            rules:{
                width: '100%',
                maxWidth: statusMaxWidth + unit,
                height: statusHeight + unit,
                margin: margin/2 + unit
            }
        },
        {
            className: 'statusLabels',
            rules:{
                marginLeft: margin + unit,
                lineHeight: statusLabelsLH + unit,
            }
        },
        {
            id: 'toolBar',
            rules:{
                width: toolBarWidth + unit,
                height: toolBarHeight + unit,
                top: toolBarTop +unit,
                left: 0,
                padding: SPACE + unit,
                borderBottom: toolBarBorder,
                borderLeft: toolBarBorder,
                borderRight: borderRight,
                fontSize: toolbarFontSize + unit
            }
        },
        {
            className: 'tools',
            rules:{
                height: toolsHeight + unit,
                maxWidth: toolsPMaxwidth + unit,
                marginLeft: toolsMargin + unit,
                marginTop: margin + unit,
            }
        },
        {
            imgId: 'shop',
            rules:{
                display: shopDisplay
            }
        },
        {
            id: 'floorCol',
            rules: {
                display: core.flags.enableFloor ? 'block': 'none'
            }
        },
        {
            id: 'lvCol',
            rules: {
                display: core.flags.enableLv ? 'block': 'none'
            }
        },
        {
            id: 'mdefCol',
            rules: {
                display: core.flags.enableMDef ? 'block': 'none'
            }
        },
        {
            id: 'moneyCol',
            rules: {
                display: core.flags.enableMoney ? 'block': 'none'
            }
        },
        {
            id: 'expCol',
            rules: {
                display: core.flags.enableExperience ? 'block': 'none'
            }
        },
        {
            id: 'upCol',
            rules: {
                display: core.flags.enableLevelUp ? 'block': 'none'
            }
        },
        {
            'id': 'debuffCol',
            rules: {
                display: core.flags.enableDebuff ? 'block': 'none'
            }
        },
        {
            id: 'hard',
            rules: {
                lineHeight: toolsHeight + unit
            }
        }
    ]
    core.domRenderer();
}

////// 渲染DOM //////
core.prototype.domRenderer = function(){

    core.dom.statusBar.style.display = 'block';
    core.dom.toolBar.style.display = 'block';

    var styles = core.domStyle.styles;

    for(var i=0; i<styles.length; i++){
        if(styles[i].hasOwnProperty('rules')){
            var rules = styles[i].rules;
            var rulesProp = Object.keys(rules);

            if(styles[i].hasOwnProperty('className')){
                var className = styles[i].className
                for(var j=0; j<core.dom[className].length; j++)
                    for(var k=0; k<rulesProp.length; k++)
                        core.dom[className][j].style[rulesProp[k]] = rules[rulesProp[k]];
            }
            if(styles[i].hasOwnProperty('id')){
                var id = styles[i].id;

                for(var j=0; j<rulesProp.length; j++)
                    core.dom[id].style[rulesProp[j]] = rules[rulesProp[j]];
            }
            if(styles[i].hasOwnProperty('imgId')){
                var imgId = styles[i].imgId;

                for(var j=0; j<rulesProp.length; j++)
                core.statusBar.image[imgId].style[rulesProp[j]] = rules[rulesProp[j]];
            }
        }
        
    }
}
    

/**
 * 系统机制 end
 */

var core = new core();
main.instance.core = core;
