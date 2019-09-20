function main() {

    //------------------------ 用户修改内容 ------------------------//

    this.version = "1.4.2"; // 游戏版本号；如果更改了游戏内容建议修改此version以免造成缓存问题。

    this.useCompress = true; // 是否使用压缩文件
    // 当你即将发布你的塔时，请使用“JS代码压缩工具”将所有js代码进行压缩，然后将这里的useCompress改为true。
    // 请注意，只有useCompress是false时才会读取floors目录下的文件，为true时会直接读取libs目录下的floors.min.js文件。
    // 如果要进行剧本的修改请务必将其改成false。

    this.floorIds = [ // 在这里按顺序放所有的楼层；其顺序直接影响到楼层传送器的顺序和上楼器/下楼器的顺序
        "MT0", "MT1", "MT2", "MT3", "MT4", "MT5", "MT6", "MT7", "MT8", "MT9", "MT10", 
        "MT11", "MT12", "MT13", "MT14", "MT15", "MT16", "MT17", "MT18", "MT19", "MT20", "MT21",
        "MT22", "MT23D", "MT23L", "MT23R", "MT24"
    ];
    this.pngs = [ // 在此存放所有可能使用的图片，只能是png格式，可以不写后缀名
        // 图片可以被作为背景图（的一部分），也可以直接用自定义事件进行显示。
        // 图片名不能使用中文，不能带空格或特殊字符；可以直接改名拼音就好
        // 建议对于较大的图片，在网上使用在线的“图片压缩工具(http://compresspng.com/zh/)”来进行压缩，以节省流量
        "bg", // 依次向后添加
    ];
    this.animates = [ // 在此存放所有可能使用的动画，必须是animate格式，在这里不写后缀名
        // 动画必须放在animates目录下；文件名不能使用中文，不能带空格或特殊字符
        "hand", "sword", "zone", "yongchang", "levelup"// "jianji", "thunder" // 根据需求自行添加
    ];
    this.bgms = [ // 在此存放所有的bgm，和文件名一致。第一项为默认播放项
        // 音频名不能使用中文，不能带空格或特殊字符；可以直接改名拼音就好
        'bgm.mp3', 'qianjin.mid', 'star.mid',
    ];
    this.sounds = [ // 在此存放所有的SE，和文件名一致
        // 音频名不能使用中文，不能带空格或特殊字符；可以直接改名拼音就好
        'floor.mp3', 'attack.ogg', 'door.ogg', 'item.ogg', 'zone.ogg'
    ];

    //------------------------ 用户修改内容 END ------------------------//

    this.dom = {
        'body': document.body,
        'gameGroup': document.getElementById('gameGroup'),
        'mainTips': document.getElementById('mainTips'),
        'musicBtn': document.getElementById('musicBtn'),
        'startPanel': document.getElementById('startPanel'),
        'startTop': document.getElementById('startTop'),
        'startTopProgressBar': document.getElementById('startTopProgressBar'),
        'startTopProgress': document.getElementById('startTopProgress'),
        'startTopLoadTips': document.getElementById('startTopLoadTips'),
        'startBackground': document.getElementById('startBackground'),
        'startButtonGroup': document.getElementById('startButtonGroup'),
        'floorMsgGroup': document.getElementById('floorMsgGroup'),
        'logoLabel': document.getElementById('logoLabel'),
        'versionLabel': document.getElementById('versionLabel'),
        'floorNameLabel': document.getElementById('floorNameLabel'),
        'statusBar': document.getElementById('statusBar'),
        'status': document.getElementsByClassName('status'),
        'toolBar': document.getElementById('toolBar'),
        'tools': document.getElementsByClassName('tools'),
        'gameCanvas': document.getElementsByClassName('gameCanvas'),
        'curtain': document.getElementById('curtain'),
        'startButtons': document.getElementById('startButtons'),
        'playGame': document.getElementById('playGame'),
        'loadGame': document.getElementById('loadGame'),
        'replayGame': document.getElementById('replayGame'),
        'levelChooseButtons': document.getElementById('levelChooseButtons'),
        'easyLevel': document.getElementById('easyLevel'),
        'normalLevel': document.getElementById('normalLevel'),
        'hardLevel': document.getElementById('hardLevel'),
        'data': document.getElementById('data'),
        'statusLabels': document.getElementsByClassName('statusLabel'),
        'floorCol': document.getElementById('floorCol'),
        'lvCol': document.getElementById('lvCol'),
        'mdefCol': document.getElementById('mdefCol'),
        'moneyCol': document.getElementById('moneyCol'),
        'expCol': document.getElementById('expCol'),
        'upCol': document.getElementById('upCol'),
        'debuffCol': document.getElementById('debuffCol'),
        'hard': document.getElementById('hard'),
    };
    this.loadList = [
        'items', 'icons', 'maps', 'enemys', 'events', 'data', 'ui', 'core'
    ];
    this.images = [
        'animates', 'enemys', 'hero', 'items', 'npcs', 'terrains'
    ];

    this.statusBar = {
        'image': {
            'floor': document.getElementById('img-floor'),
            'lv': document.getElementById('img-lv'),
            'hp': document.getElementById("img-hp"),
            'atk': document.getElementById("img-atk"),
            'def': document.getElementById("img-def"),
            'mdef': document.getElementById("img-mdef"),
            'money': document.getElementById("img-money"),
            'experience': document.getElementById("img-experience"),
            'up': document.getElementById("img-up"),
            'book': document.getElementById("img-book"),
            'fly': document.getElementById("img-fly"),
            'toolbox': document.getElementById("img-toolbox"),
            'shop': document.getElementById("img-shop"),
            'save': document.getElementById("img-save"),
            'load': document.getElementById("img-load"),
            'settings': document.getElementById("img-settings")
        },
        'icons': {
            'book': null,
            'fly': null,
            'toolbox': null,
            'save': null,
            'load': null,
            'settings': null,
            'rewind': null, // 减速
            'forward': null, // 加速
            'play': null, // 播放
            'pause': null, // 暂停
            'stop': null, // 停止
        },
        'floor': document.getElementById('floor'),
        'lv': document.getElementById('lv'),
        'hp': document.getElementById('hp'),
        'atk': document.getElementById('atk'),
        'def': document.getElementById("def"),
        'mdef': document.getElementById('mdef'),
        'money': document.getElementById("money"),
        'experience': document.getElementById("experience"),
        'up': document.getElementById('up'),
        'yellowKey': document.getElementById("yellowKey"),
        'blueKey': document.getElementById("blueKey"),
        'redKey': document.getElementById("redKey"),
        'poison': document.getElementById('poison'),
        'weak':document.getElementById('weak'),
        'curse': document.getElementById('curse'),
        'hard': document.getElementById("hard")
    }
    this.floors = {}
    this.instance = {};
    this.canvas = {};
}

////// 初始化 //////
main.prototype.init = function () {
    for (var i = 0; i < main.dom.gameCanvas.length; i++) {
        main.canvas[main.dom.gameCanvas[i].id] = main.dom.gameCanvas[i].getContext('2d');
    }
    Object.keys(this.statusBar.icons).forEach(function (t) {
        var image=new Image();
        image.src="images/"+t+".png";
        main.statusBar.icons[t] = image;
    })
    main.loaderJs(function () {
        var coreData = {};
        for (i = 0; i < main.loadList.length; i++) {
            var name = main.loadList[i];
            if (name === 'core') continue;
            main[name].init(main.dom);
            coreData[name] = main[name];
        }
        main.loaderFloors(function() {
            ["dom", "statusBar", "canvas", "images", "pngs",
                "animates", "bgms", "sounds", "floorIds", "floors"].forEach(function (t) {
                    coreData[t] = main[t];
            })
            main.core.init(coreData);
            main.core.resize(main.dom.body.clientWidth, main.dom.body.clientHeight);
        })
    });
}

////// 动态加载所有核心JS文件 //////
main.prototype.loaderJs = function (callback) {
    var instanceNum = 0;
    // 加载js
    main.setMainTipsText('正在加载核心js文件...')
    for (var i = 0; i < main.loadList.length; i++) {
        main.loadMod(main.loadList[i], function (modName) {
            instanceNum = 0;
            main.setMainTipsText(modName + '.js 加载完毕');
            for (var key in main.instance) {
                instanceNum++;
            }
            if (instanceNum === main.loadList.length) {
                delete main.instance;
                // main.dom.mainTips.style.display = 'none';
                callback();
            }
        });
    }
}

////// 动态加载所有楼层（剧本） //////
main.prototype.loaderFloors = function (callback) {

    // 加载js
    main.setMainTipsText('正在加载楼层文件...')
    if (this.useCompress) { // 读取压缩文件
        var script = document.createElement('script');
        script.src = 'libs/floors.min.js?v=' + this.version;
        main.dom.body.appendChild(script);
        script.onload = function () {
            main.dom.mainTips.style.display = 'none';
            callback();
        }
    }
    else {
        for (var i = 0; i < main.floorIds.length; i++) {
            main.loadFloor(main.floorIds[i], function (modName) {
                main.setMainTipsText("楼层 " + modName + '.js 加载完毕');
                if (Object.keys(main.floors).length === main.floorIds.length) {
                    main.dom.mainTips.style.display = 'none';
                    callback();
                }
            });
        }
    }
}

////// 加载某一个JS文件 //////
main.prototype.loadMod = function (modName, callback) {
    var script = document.createElement('script');
    var name = modName;
    script.src = 'libs/' + modName + (this.useCompress?".min":"") + '.js?v=' + this.version;
    main.dom.body.appendChild(script);
    script.onload = function () {
        main[name] = main.instance[name];
        callback(name);
    }
}

////// 加载某一个楼层 //////
main.prototype.loadFloor = function(floorId, callback) {
    var script = document.createElement('script');
    script.src = 'libs/floors/' + floorId +'.js?v=' + this.version;
    main.dom.body.appendChild(script);
    script.onload = function () {
        callback(floorId);
    }
}

////// 加载过程提示 //////
main.prototype.setMainTipsText = function (text) {
    main.dom.mainTips.innerHTML = text;
}

var main = new main();
main.init();

////// 窗口大小变化时 //////
window.onresize = function () {
    try {
        main.core.resize(main.dom.body.clientWidth, main.dom.body.clientHeight);
    }catch (e) {}
}

////// 在界面上按下某按键时 //////
main.dom.body.onkeydown = function(e) {
    try {
        if (main.core.isPlaying() || main.core.status.lockControl)
            main.core.onkeyDown(e);
    } catch (ee) {}
}

////// 在界面上放开某按键时 //////
main.dom.body.onkeyup = function(e) {
    try {
        if (main.core.isPlaying() || main.core.status.lockControl)
            main.core.onkeyUp(e);
    } catch (ee) {}
}

////// 开始选择时 //////
main.dom.body.onselectstart = function () {
    return false;
}

////// 鼠标按下时 //////
main.dom.data.onmousedown = function (e) {
    try {
        e.stopPropagation();
        if(e.button==1){// 把鼠标中键绑定为ESC
            core.keyUp(27);
            return;
        }
        var loc = main.core.getClickLoc(e.clientX, e.clientY);
        if (loc == null) return;
        var x = parseInt(loc.x / loc.size), y = parseInt(loc.y / loc.size);
        main.core.ondown(x, y);
    } catch (ee) {}
}

////// 鼠标移动时 //////
main.dom.data.onmousemove = function (e) {
    try {
        e.stopPropagation();
        var loc = main.core.getClickLoc(e.clientX, e.clientY);
        if (loc == null) return;
        var x = parseInt(loc.x / loc.size), y = parseInt(loc.y / loc.size);
        main.core.onmove(x, y);
    }catch (ee) {}
}

////// 鼠标放开时 //////
main.dom.data.onmouseup = function () {
    try {
        main.core.onup();
    }catch (e) {}
}

////// 鼠标滑轮滚动时 //////
main.dom.data.onmousewheel = function(e) {
    try {
        if (e.wheelDelta)
            main.core.onmousewheel(Math.sign(e.wheelDelta))
        else if (e.detail)
            main.core.onmousewheel(Math.sign(e.detail));
    } catch (ee) {}
}

////// 手指在触摸屏开始触摸时 //////
main.dom.data.ontouchstart = function (e) {
    try {
        e.preventDefault();
        var loc = main.core.getClickLoc(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        if (loc == null) return;
        var x = parseInt(loc.x / loc.size), y = parseInt(loc.y / loc.size);
        //main.core.onclick(x, y, []);
        main.core.ondown(x, y);
    }catch (ee) {}
}

////// 手指在触摸屏上移动时 //////
main.dom.data.ontouchmove = function (e) {
    try {
        e.preventDefault();
        var loc = main.core.getClickLoc(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        if (loc == null) return;
        var x = parseInt(loc.x / loc.size), y = parseInt(loc.y / loc.size);
        main.core.onmove(x, y);
    }catch (ee) {}
}

////// 手指离开触摸屏时 //////
main.dom.data.ontouchend = function () {
    try {
        main.core.onup();
    } catch (e) {
    }
}

////// 点击状态栏中的怪物手册时 //////
main.statusBar.image.book.onclick = function () {
    if (core.isset(core.status.replay) && core.status.replay.replaying) {
        core.triggerReplay();
        return;
    }

    if (main.core.isPlaying())
        main.core.openBook(true);
}

////// 点击状态栏中的楼层传送器时 //////
main.statusBar.image.fly.onclick = function () {

    if (core.isset(core.status.replay) && core.status.replay.replaying) {
        core.stopReplay();
        return;
    }

    if (main.core.isPlaying())
        main.core.useFly(true);
}

////// 点击状态栏中的工具箱时 //////
main.statusBar.image.toolbox.onclick = function () {
    if (main.core.isPlaying())
        main.core.openToolbox(true);
}

////// 点击状态栏中的快捷商店时 //////
main.statusBar.image.shop.onclick = function () {
    if (main.core.isPlaying())
        main.core.openQuickShop(true);
}

////// 点击状态栏中的存档按钮时 //////
main.statusBar.image.save.onclick = function () {

    if (core.isset(core.status.replay) && core.status.replay.replaying) {
        core.rewindReplay();
        return;
    }

    if (main.core.isPlaying())
        main.core.save(true);
}

////// 点击状态栏中的读档按钮时 //////
main.statusBar.image.load.onclick = function () {

    if (core.isset(core.status.replay) && core.status.replay.replaying) {
        core.forwardReplay();
        return;
    }

    if (main.core.isPlaying())
        main.core.load(true);
}

////// 点击状态栏中的系统菜单时 //////
main.statusBar.image.settings.onclick = function () {
    if (main.core.isPlaying())
        main.core.openSettings(true);
}

////// 点击“开始游戏”时 //////
main.dom.playGame.onclick = function () {
    main.dom.startButtons.style.display='none';

    if (main.core.isset(main.core.flags.startDirectly) && main.core.flags.startDirectly) {
        core.events.startGame("");
    }
    else {
        main.dom.levelChooseButtons.style.display='block';
    }
}

////// 点击“载入游戏”时 //////
main.dom.loadGame.onclick = function() {
    main.core.load();
}

////// 点击“录像回放”时 //////
main.dom.replayGame.onclick = function () {

    core.readFile(function (obj) {
        if (obj.name!=core.firstData.name) {
            alert("存档和游戏不一致！");
            return;
        }
        if (core.isset(obj.version) && obj.version!=core.firstData.version) {
            alert("游戏版本不一致！");
            return;
        }
        if (!core.isset(obj.route) || !core.isset(obj.hard)) {
            alert("无效的录像！");
            return;
        }

        core.dom.startPanel.style.display = 'none';
        core.resetStatus(core.firstData.hero, obj.hard, core.firstData.floorId, null, core.initStatus.maps);
        core.events.setInitData(obj.hard);
        core.changeFloor(core.status.floorId, null, core.firstData.hero.loc, null, function() {
            //core.setHeroMoveTriggerInterval();
            core.startReplay(core.decodeRoute(obj.route));
        });
    }, function () {

    })
}

////// 点击“简单难度”时 //////
main.dom.easyLevel.onclick = function() {
    core.events.startGame('Easy');
}

////// 点击“普通难度”时 //////
main.dom.normalLevel.onclick = function () {
    core.events.startGame('Normal');
}

////// 点击“困难难度”时 //////
main.dom.hardLevel.onclick = function () {
    core.events.startGame('Hard');
}
