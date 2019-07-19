function events() {

}

////// 初始化 //////
events.prototype.init = function () {
    this.events = {
        'battle': function (data, core, callback) {
            //core.autosave(true);
            core.battle(data.event.id, data.x, data.y);
            if (core.isset(callback))
                callback();
        },
        'getItem': function (data, core, callback) {
            core.getItem(data.event.id, 1, data.x, data.y);
            if (core.isset(callback))
                callback();
        },
        'openDoor': function (data, core, callback) {
            //core.autosave(true);
            core.openDoor(data.event.id, data.x, data.y, true, function () {
                if (core.isset(callback)) callback();
                core.replay();
            });
        },
        'changeFloor': function (data, core, callback) {
            var heroLoc = {};
            if (core.isset(data.event.data.loc))
                heroLoc = {'x': data.event.data.loc[0], 'y': data.event.data.loc[1]};
            if (core.isset(data.event.data.direction))
                heroLoc.direction = data.event.data.direction;
            core.changeFloor(data.event.data.floorId, data.event.data.stair,
                heroLoc, data.event.data.time, function () {
                    if (core.isset(callback)) callback();
                    core.replay();
                });
        },
        'passNet': function (data, core, callback) {
            core.events.passNet(data);
            if (core.isset(callback))
                callback();
        },
        "changeLight": function (data, core, callback) {
            core.events.changeLight(data.x, data.y);
            if (core.isset(callback))
                callback();
        },
        "ski": function (data, core, callback) {
            core.events.ski();
            if (core.isset(callback))
                callback();
        },
        "pushBox": function (data, core, callback) {
            core.events.pushBox(data);
            if (core.isset(callback))
                callback();
        },
        'action': function (data, core, callback) {
            core.events.doEvents(data.event.data, data.x, data.y);
            if (core.isset(callback)) callback();
        }
    }
}

////// 获得一个或所有系统事件类型 //////
events.prototype.getEvents = function (eventName) {
    if (!core.isset(eventName)) {
        return this.events;
    }
    return this.events[eventName];
}

main.instance.events = new events();



////// 游戏开始事件 //////
events.prototype.startGame = function (hard) {

    if (core.status.isStarting) return;
    core.status.isStarting = true;

    core.hideStartAnimate(function() {
        core.drawText(core.clone(core.firstData.startText), function() {
            if (core.flags.showBattleAnimateConfirm) { // 是否提供“开启战斗动画”的选择项
                core.status.event.selection = core.flags.battleAnimate ? 0 : 1;
                core.ui.drawConfirmBox("你想开启战斗动画吗？\n之后可以在菜单栏中开启或关闭。\n（强烈建议新手开启此项）", function () {
                    core.flags.battleAnimate = true;
                    core.setLocalStorage('battleAnimate', true);
                    core.startGame(hard);
                    core.events.setInitData(hard);
                }, function () {
                    core.flags.battleAnimate = false;
                    core.setLocalStorage('battleAnimate', false);
                    core.startGame(hard);
                    core.events.setInitData(hard);
                });
            }
            else {
                core.startGame(hard);
                core.events.setInitData(hard);
            }
        });
    })
}

////// 不同难度分别设置初始属性 //////
events.prototype.setInitData = function (hard) {
    if (hard=='Easy') { // 简单难度
        core.setFlag('hard', 1); // 可以用flag:hard来获得当前难度
        // 可以在此设置一些初始福利，比如设置初始生命值可以调用：
        // core.setStatus("hp", 10000);
        // 赠送一把黄钥匙可以调用
        // core.setItem("yellowKey", 1);
    }
    if (hard=='Normal') { // 普通难度
        core.setFlag('hard', 2); // 可以用flag:hard来获得当前难度
    }
    if (hard=='Hard') { // 困难难度
        core.setFlag('hard', 3); // 可以用flag:hard来获得当前难度
    }
    this.afterLoadData();
}

////// 游戏获胜事件 //////
events.prototype.win = function(reason) {
    core.ui.closePanel();
    var replaying = core.status.replay.replaying;
    core.stopReplay();
    core.waitHeroToStop(function() {
        core.removeGlobalAnimate(0,0,true);
        core.clearMap('all'); // 清空全地图
        core.drawText([
            core.status.hero.lv>=200?
            "\t[True End]你的攻防和分数是${status:hp}。":
            "\t[Normal End]你的攻防和分数是${status:hp}。\n（只有不小于200级才能达成True End）"
        ], function () {
            core.events.gameOver(core.status.hero.lv>=200?"True End":"Normal End", replaying);
        })
    });
}

////// 游戏失败事件 //////
events.prototype.lose = function(reason) {
    core.ui.closePanel();
    var replaying = core.status.replay.replaying;
    core.stopReplay();
    core.waitHeroToStop(function() {
        core.drawText([
            "\t[结局1]你死了。\n如题。"
        ], function () {
            core.events.gameOver(null, replaying);
        });
    })
}

////// 游戏结束 //////
events.prototype.gameOver = function (ending, fromReplay) {

    // 上传成绩
    var confirmUpload = function () {

        if (!core.isset(ending)) {
            core.restart();
            return;
        }

        var doUpload = function(username) {
            if (username==null) username="";

            // upload
            var formData = new FormData();
            formData.append('type', 'score');
            formData.append('name', core.firstData.name);
            formData.append('version', core.firstData.version);
            formData.append('platform', core.platform.isPC?"PC":core.platform.isAndroid?"Android":core.platform.isIOS?"iOS":"");
            formData.append('hard', core.status.hard);
            formData.append('username', username);
            formData.append('ending', ending);
            formData.append('lv', core.status.hero.lv);
            formData.append('hp', core.status.hero.hp);
            formData.append('atk', core.status.hero.atk);
            formData.append('def', core.status.hero.def);
            formData.append('mdef', core.status.hero.mdef);
            formData.append('money', core.status.hero.money);
            formData.append('experience', core.status.hero.experience);
            formData.append('steps', core.status.hero.steps);
            formData.append('route', core.encodeRoute(core.status.route));

            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/games/upload.php");
            xhr.send(formData);

            core.restart();
        }

        core.ui.drawConfirmBox("你想记录你的ID和成绩吗？", function () {
            doUpload(prompt("请输入你的ID："));
        }, function () {
            doUpload("");
        })

        return;
    }

    // 下载录像
    var confirmDownload = function () {
        core.ui.closePanel();
        core.ui.drawConfirmBox("你想下载录像吗？", function () {
            var obj = {
                'name': core.firstData.name,
                'version': core.firstData.version,
                'hard': core.status.hard,
                'route': core.encodeRoute(core.status.route)
            }
            core.download(core.firstData.name+"_"+core.formatDate2(new Date())+".h5route", JSON.stringify(obj));
            confirmUpload();
        }, function () {
            confirmUpload();
        })
    }

    if (fromReplay) {
        core.drawText("录像回放完毕！", function () {
            core.restart();
        });
    }
    else {
        confirmDownload();
    }

}

////// 转换楼层结束的事件 //////
events.prototype.afterChangeFloor = function (floorId) {
    if (core.isset(core.status.event.id)) return; // 当前存在事件

    if (!core.hasFlag("visited_"+floorId)) {
        this.doEvents(core.floors[floorId].firstArrive, null, null, function () {
            //core.autosave();
        });
        core.setFlag("visited_"+floorId, true);
        return;
    }

    // 自动存档
    //core.autosave();
}

////// 开始执行一系列自定义事件 //////
events.prototype.doEvents = function (list, x, y, callback) {
    if (!core.isset(list)) return;
    if (!(list instanceof Array)) {
        list = [list];
    }

    // 停止勇士
    core.waitHeroToStop(function() {
        core.lockControl();
        core.status.event = {'id': 'action', 'data': {
            'list': core.clone(list), 'x': x, 'y': y, 'callback': callback
        }}
        core.events.doAction();
    });
}

////// 执行当前自定义事件列表中的下一个事件 //////
events.prototype.doAction = function() {
    // 清空boxAnimate和UI层
    core.status.boxAnimateObjs = [];
    core.clearMap('ui', 0, 0, 416, 416);
    core.setAlpha('ui', 1.0);

    // 事件处理完毕
    if (core.status.event.data.list.length==0) {
        if (core.isset(core.status.event.data.callback))
            core.status.event.data.callback();
        core.ui.closePanel();
        core.replay();
        return;
    }

    var data = core.status.event.data.list.shift();
    core.status.event.data.current = data;

    var x=core.status.event.data.x, y=core.status.event.data.y;

    // 不同种类的事件

    // 如果是文字：显示
    if (typeof data == "string") {
        core.status.event.data.type='text';
        // 如果是正在回放中，不显示
        if (core.status.replay.replaying)
            core.events.doAction();
        else
            core.ui.drawTextBox(data);
        return;
    }
    core.status.event.data.type=data.type;
    switch (data.type) {
        case "text": // 文字/对话
            if (core.status.replay.replaying)
                core.events.doAction();
            else
                core.ui.drawTextBox(data.data);
            break;
        case "setText": // 设置文本状态
            if (data.position=='up'||data.position=='down'||data.position=='center') {
                core.status.textAttribute.position=data.position;
            }
            ["background", "title", "text"].forEach(function (t) {
                if (core.isset(data[t]) && (data[t] instanceof Array) && data[t].length>=3) {
                    if (data[t].length==3) data[t].push(1);
                    core.status.textAttribute[t]=data[t];
                }
            })
            core.events.doAction();
            break;
        case "tip":
            core.drawTip(core.replaceText(data.text));
            core.events.doAction();
            break;
        case "show": // 显示
            if (typeof data.loc[0] == 'number' && typeof data.loc[1] == 'number')
                data.loc = [data.loc];
            if (core.isset(data.time) && data.time>0 && (!core.isset(data.floorId) || data.floorId==core.status.floorId)) {
                core.animateBlock(data.loc,'show', data.time, function () {
                    data.loc.forEach(function (t) {
                        core.showBlock(t[0],t[1],data.floorId)
                    })
                    core.events.doAction();
                });
            }
            else {
                data.loc.forEach(function (t) {
                    core.showBlock(t[0],t[1],data.floorId)
                })
                this.doAction();
            }
            break;
        case "hide": // 消失
            if (!core.isset(data.loc))
                data.loc = [x,y];
            if (typeof data.loc[0] == 'number' && typeof data.loc[1] == 'number')
                data.loc = [data.loc];
            data.loc.forEach(function (t) {
                core.removeBlock(t[0],t[1],data.floorId);
            })
            if (core.isset(data.time) && data.time>0 && (!core.isset(data.floorId) || data.floorId==core.status.floorId)) {
                core.animateBlock(data.loc,'hide',data.time, function () {
                    core.events.doAction();
                });
            }
            else this.doAction();
            break;
        case "setBlock": // 设置某图块
            {
                if (core.isset(data.loc)) {
                    x=data.loc[0];
                    y=data.loc[1];
                }
                var floorId = data.floorId||core.status.floorId;
                var originBlock=core.getBlock(x,y,floorId,false);
                var block = core.maps.getBlock(x,y,data.number);
                core.maps.addInfo(block);
                core.maps.addEvent(block,x,y,core.floors[floorId].events[x+","+y]);
                core.maps.addChangeFloor(block,x,y,core.floors[floorId].changeFloor[x+","+y]);
                if (core.isset(block.event)) {
                    if (originBlock==null) {
                        core.status.maps[floorId].blocks.push(block);
                    }
                    else {
                        originBlock.block.id = data.number;
                        originBlock.block.event = block.event;
                    }
                    if (floorId==core.status.floorId) {
                        core.drawMap(floorId);
                        core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
                        core.updateStatusBar();
                    }
                }
                this.doAction();
                break;
            }
        case "animate": // 显示动画
            if (core.isset(data.loc)) {
                if (data.loc == 'hero') {
                    x=core.getHeroLoc('x');
                    y=core.getHeroLoc('y');
                }
                else if (data.loc instanceof Array) {
                    x=data.loc[0];
                    y=data.loc[1];
                }
            }
            core.drawAnimate(data.name, x, y, function () {
                core.events.doAction();
            })
            break;
        case "move": // 移动事件
            if (core.isset(data.loc)) {
                x=data.loc[0];
                y=data.loc[1];
            }
            core.moveBlock(x,y,data.steps,data.time,data.immediateHide,function() {
                core.events.doAction();
            })
            break;
        case "moveHero":
            core.eventMoveHero(data.steps,data.time,function() {
                core.events.doAction();
            });
            break;
        case "changeFloor": // 楼层转换
            var heroLoc = {"x": data.loc[0], "y": data.loc[1]};
            if (core.isset(data.direction)) heroLoc.direction=data.direction;
            core.changeFloor(data.floorId||core.status.floorId, null, heroLoc, data.time, function() {
                core.lockControl();
                core.events.doAction();
            });
            break;
        case "changePos": // 直接更换勇士位置，不切换楼层
            core.clearMap('hero', 0, 0, 416, 416);
            if (core.isset(data.loc)) {
                core.setHeroLoc('x', data.loc[0]);
                core.setHeroLoc('y', data.loc[1]);
            }
            if (core.isset(data.direction)) core.setHeroLoc('direction', data.direction);
            core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
            this.doAction();
            break;
        case "showImage": // 显示图片
            if (core.isset(data.loc) && core.isset(core.material.images.pngs[data.name])) {
                core.canvas.animate.drawImage(core.material.images.pngs[data.name], data.loc[0], data.loc[1]);
            }
            else core.clearMap('animate', 0, 0, 416, 416);
            this.doAction();
            break;
        case "setFg": // 颜色渐变
            core.setFg(data.color, data.time, function() {
                core.events.doAction();
            });
            break;
        case "setWeather": // 更改天气
            core.setWeather(data.name, data.level);
            this.doAction();
            break;
        case "openDoor": // 开一个门，包括暗墙
            var floorId=data.floorId || core.status.floorId;
            var block=core.getBlock(data.loc[0], data.loc[1], floorId);
            if (block!=null) {
                if (floorId==core.status.floorId)
                    core.openDoor(block.block.event.id, block.block.x, block.block.y, false, function() {
                        core.events.doAction();
                    })
                else {
                    core.removeBlock(block.block.x,block.block.y,floorId);
                    this.doAction();
                }
                break;
            }
            this.doAction();
            break;
        case "openShop": // 打开一个全局商店
            if (core.status.replay.replaying) { // 正在播放录像，简单将visited置为true
                core.status.shops[data.id].visited=true;
                core.status.event.data.list = [];
                this.doAction();
            }
            else
                core.events.openShop(data.id);
            break;
        case "disableShop": // 禁用一个全局商店
            core.events.disableQuickShop(data.id);
            this.doAction();
            break;
        case "battle": // 强制战斗
            core.battle(data.id,null,null,true,function() {
                core.events.doAction();
            })
            break;
        case "trigger": // 触发另一个事件；当前事件会被立刻结束。需要另一个地点的事件是有效的
            var toX=data.loc[0], toY=data.loc[1];
            var block=core.getBlock(toX, toY);
            if (block!=null) {
                block = block.block;
                if (core.isset(block.event) && block.event.trigger=='action') {
                    // 触发
                    core.status.event.data.list = core.clone(block.event.data);
                    core.status.event.data.x=block.x;
                    core.status.event.data.y=block.y;
                }
            }
            this.doAction();
            break;
        case "playSound":
            core.playSound(data.name);
            this.doAction();
            break;
        case "playBgm":
            core.playBgm(data.name);
            this.doAction();
            break
        case "pauseBgm":
            core.pauseBgm();
            this.doAction();
            break
        case "resumeBgm":
            core.resumeBgm();
            this.doAction();
            break
        case "setValue":
            try {
                var value=core.calValue(data.value);
                // 属性
                if (data.name.indexOf("status:")==0) {
                    value=parseInt(value);
                    core.setStatus(data.name.substring(7), value);
                }
                // 道具
                if (data.name.indexOf("item:")==0) {
                    value=parseInt(value);
                    var itemId=data.name.substring(5);
                    if (value>core.itemCount(itemId)) // 效果
                        core.getItem(itemId,value-core.itemCount(itemId));
                    else core.setItem(itemId, value);
                }
                // flag
                if (data.name.indexOf("flag:")==0) {
                    core.setFlag(data.name.substring(5), value);
                }
            }
            catch (e) {console.log(e)}
            if (core.status.hero.hp<=0) {
                core.status.hero.hp=0;
                core.updateStatusBar();
                core.events.lose('damage');
            }
            else {
                core.updateStatusBar();
                this.doAction();
            }
            break;
        case "input":
            {
                var value;
                if (core.status.replay.replaying) {
                    var action = core.status.replay.toReplay.shift();
                    if (action.indexOf("input:")==0 ) {
                        value=parseInt(action.substring(6));
                    }
                    else {
                        core.stopReplay();
                        core.drawTip("录像文件出错");
                        return;
                    }

                }
                else {
                    value = prompt(core.replaceText(data.text));
                }
                value = Math.abs(parseInt(value)||0);
                core.status.route.push("input:"+value);
                core.setFlag("input", value);
                this.doAction();
            }
            break;
        case "if": // 条件判断
            if (core.calValue(data.condition))
                core.events.insertAction(data["true"])
            else
                core.events.insertAction(data["false"])
            this.doAction();
            break;
        case "choices": // 提供选项
            if (core.status.replay.replaying) {
                if (core.status.replay.toReplay.length==0) { // 回放完毕
                    core.status.replay.replaying=false;
                    core.drawTip("录像回放完毕");
                }
                else {
                    var action = core.status.replay.toReplay.shift(), index;
                    if (action.indexOf("choices:")==0 && ((index=parseInt(action.substring(8)))>=0) && index<data.choices.length) {
                            core.status.event.selection=index;
                            setTimeout(function () {
                                core.status.route.push("choices:"+index);
                                core.events.insertAction(data.choices[index].action);
                                core.events.doAction();
                            }, 750)
                    }
                    else {
                        core.stopReplay();
                        core.drawTip("录像文件出错");
                    }
                }
            }
            core.ui.drawChoices(data.text, data.choices);
            break;
        case "win":
            core.events.win(data.reason, function () {
                core.events.doAction();
            });
            break;
        case "lose":
            core.events.lose(data.reason, function () {
                core.events.doAction();
            });
            break;
        case "function":
            var func = data["function"];
            if (core.isset(func)) {
                if ((typeof func == "string") && func.indexOf("function")==0) {
                    eval('('+func+')()');
                }
                else if (func instanceof Function)
                    func();
            }
            this.doAction();
            break;
        case "update":
            core.updateStatusBar();
            this.doAction();
            break;
        case "sleep": // 等待多少毫秒
            setTimeout(function () {
                core.events.doAction();
            }, data.time);
            break;
        case "revisit": // 立刻重新执行该事件
            var block=core.getBlock(x,y); // 重新获得事件
            if (block!=null) {
                block = block.block;
                if (core.isset(block.event) && block.event.trigger=='action') {
                    core.status.event.data.list = core.clone(block.event.data);
                }
            }
            this.doAction();
            break;
        case "exit": // 立刻结束事件
            core.status.event.data.list = [];
            core.events.doAction();
            break;
        default:
            core.status.event.data.type='text';
            core.ui.drawTextBox("\t[警告]出错啦！\n"+data.type+" 事件不被支持...");
    }
    return;
}

////// 往当前事件列表之前添加一个或多个事件 //////
events.prototype.insertAction = function (action, x, y, callback) {
    if (core.status.event.id == null) {
        this.doEvents(action, x, y, callback);
    }
    else {
        core.unshift(core.status.event.data.list, action)
        if (core.isset(x)) core.status.event.data.x=x;
        if (core.isset(y)) core.status.event.data.y=y;
        if (core.isset(callback)) core.status.event.data.callback=callback;
    }
}

////// 打开一个全局商店 //////
events.prototype.openShop = function(shopId, needVisited) {
    var shop = core.status.shops[shopId];
    shop.times = shop.times || 0;
    shop.visited = shop.visited || false;
    if (needVisited && !shop.visited) {
        if (shop.times==0) core.drawTip("该商店尚未开启");
        else core.drawTip("该商店已失效");
        return;
    }
    shop.visited = true;

    var selection = core.status.event.selection;
    var actions = [];
    if (core.isset(core.status.event.data) && core.isset(core.status.event.data.actions))
        actions=core.status.event.data.actions;
    var fromList;
    if (core.isset(core.status.event.data) && core.isset(core.status.event.data.fromList))
        fromList = core.status.event.data.fromList;

    core.ui.closePanel();
    core.lockControl();
    // core.status.event = {'id': 'shop', 'data': {'id': shopId, 'shop': shop}};
    core.status.event.id = 'shop';
    core.status.event.data = {'id': shopId, 'shop': shop, 'actions': actions, 'fromList': fromList};
    core.status.event.selection = selection;

    // 拼词
    var content = "\t["+shop.name+","+shop.icon+"]";
    var times = shop.times, need=eval(shop.need);

    content = content + shop.text.replace(/\${([^}]+)}/g, function (word, value) {
        return eval(value);
    });

    var use = shop.use=='experience'?'经验':'金币';

    var choices = [];
    for (var i=0;i<shop.choices.length;i++) {
        var choice = shop.choices[i];
        var text = choice.text;
        if (core.isset(choice.need))
            text += "（"+eval(choice.need)+use+"）"
        choices.push(text);
    }
    choices.push("离开");
    core.ui.drawChoices(content, choices);
}

////// 禁用一个全局商店 //////
events.prototype.disableQuickShop = function (shopId) {
    core.status.shops[shopId].visited = false;
}

////// 能否使用快捷商店 //////
events.prototype.canUseQuickShop = function(shopId) {
    if (core.isset(core.floors[core.status.floorId].canUseQuickShop) && !core.floors[core.status.floorId].canUseQuickShop)
        return '当前不能使用快捷商店。';

    return null;
}

////// 检查升级事件 //////
events.prototype.checkLvUp = function () {
    if (!core.flags.enableLevelUp || core.status.hero.lv>=core.firstData.levelUp.length) return;
    // 计算下一个所需要的数值
    var need=core.firstData.levelUp[core.status.hero.lv].need;
    if (!core.isset(need)) return;
    if (core.status.hero.experience>=need) {
        // 升级
        core.status.hero.lv++;
        var effect = core.firstData.levelUp[core.status.hero.lv-1].effect;
        if (typeof effect == "string") {
            if (effect.indexOf("function")==0) {
                eval("("+effect+")()");
            }
            else {
                effect.split(";").forEach(function (t) {
                    core.doEffect(t);
                });
            }
        }
        else if (effect instanceof Function) {
            effect();
        }
        this.checkLvUp();
    }
}

////// 尝试使用道具 //////
events.prototype.useItem = function(itemId) {
    core.ui.closePanel();

    if (itemId=='book') {
        core.openBook(false);
        return;
    }
    if (itemId=='fly') {
        core.useFly(false);
        return;
    }
    if (itemId=='centerFly') {
        core.status.usingCenterFly= true;
        var fillstyle = 'rgba(255,0,0,0.5)';
        if (core.canUseItem('centerFly')) fillstyle = 'rgba(0,255,0,0.5)';
        core.fillRect('ui',(12-core.getHeroLoc('x'))*32,(12-core.getHeroLoc('y'))*32,32,32,fillstyle);
        core.drawTip("请确认当前中心对称飞行器的位置");
        return;
    }

    if (core.canUseItem(itemId))core.useItem(itemId);
    else core.drawTip("当前无法使用"+core.material.items[itemId].name);
}

////// 加点事件 //////
events.prototype.addPoint = function (enemy) {
    var point = enemy.point;
    if (!core.isset(point) || point<=0) return [];

    // 加点，返回一个choices事件
    return [
        {"type": "choices",
            "choices": [
                {"text": "攻击+"+(1*point), "action": [
                    {"type": "setValue", "name": "status:atk", "value": "status:atk+"+(1*point)}
                ]},
                {"text": "防御+"+(2*point), "action": [
                    {"type": "setValue", "name": "status:def", "value": "status:def+"+(2*point)}
                ]},
                {"text": "生命+"+(200*point), "action": [
                    {"type": "setValue", "name": "status:hp", "value": "status:hp+"+(200*point)}
                ]},
            ]
        }
    ];
}

////// 战斗结束后触发的事件 //////
events.prototype.afterBattle = function(enemyId,x,y,callback) {

    var enemy = core.material.enemys[enemyId];

    // 毒衰咒的处理
    var special = enemy.special;
    // 中毒
    if (core.enemys.hasSpecial(special, 12) && !core.hasFlag('poison')) {
        core.setFlag('poison', true);
    }
    // 衰弱
    if (core.enemys.hasSpecial(special, 13) && !core.hasFlag('weak')) {
        core.setFlag('weak', true);
        core.status.hero.atk-=core.values.weakValue;
        core.status.hero.def-=core.values.weakValue;
    }
    // 诅咒
    if (core.enemys.hasSpecial(special, 14) && !core.hasFlag('curse')) {
        core.setFlag('curse', true);
    }
    // 仇恨属性：减半
    if (core.flags.hatredDecrease && core.enemys.hasSpecial(special, 17)) {
        core.setFlag('hatred', parseInt(core.getFlag('hatred', 0)/2));
    }
    // 自爆
    if (core.enemys.hasSpecial(special, 19)) {
        core.status.hero.hp = 1;
    }
    // 退化
    if (core.enemys.hasSpecial(special, 21)) {
        core.status.hero.atk -= (enemy.atkValue||0);
        core.status.hero.def -= (enemy.defValue||0);
        if (core.status.hero.atk<0) core.status.hero.atk=0;
        if (core.status.hero.def<0) core.status.hero.def=0;
    }
    // 增加仇恨值
    core.setFlag('hatred', core.getFlag('hatred',0)+core.values.hatred);
    core.updateStatusBar();


    // 事件的处理
    var todo = [];
    // 如果不为阻击，且该点存在，且有事件
    if (!core.enemys.hasSpecial(special, 18) && core.isset(x) && core.isset(y)) {
        var event = core.floors[core.status.floorId].afterBattle[x+","+y];
        if (core.isset(event)) {
            // 插入事件
            core.unshift(todo, event);
        }
    }
    // 如果有加点
    var point = core.material.enemys[enemyId].point;
    if (core.isset(point) && point>0) {
        core.unshift(todo, core.events.addPoint(core.material.enemys[enemyId]));
    }

    // 如果事件不为空，将其插入
    if (todo.length>0) {
        this.insertAction(todo,x,y);
    }

    // 如果已有事件正在处理中
    if (core.status.event.id == null) {
        core.continueAutomaticRoute();
    }
    else {
        core.clearContinueAutomaticRoute();
    }
    if (core.isset(callback)) callback();

}

////// 开一个门后触发的事件 //////
events.prototype.afterOpenDoor = function(doorId,x,y,callback) {

    var todo = [];
    if (core.isset(x) && core.isset(y)) {
        var event = core.floors[core.status.floorId].afterOpenDoor[x+","+y];
        if (core.isset(event)) {
            core.unshift(todo, event);
        }
    }

    if (todo.length>0) {
        this.insertAction(todo,x,y);
    }

    if (core.status.event.id == null) {
        core.continueAutomaticRoute();
    }
    else {
        core.clearContinueAutomaticRoute();
    }
    if (core.isset(callback)) callback();
}

////// 经过一个路障 //////
events.prototype.passNet = function (data) {
    // 有鞋子
    if (core.hasItem('shoes')) return;
    if (data.event.id=='lavaNet') { // 血网
        core.status.hero.hp -= core.values.lavaDamage;
        if (core.status.hero.hp<=0) {
            core.status.hero.hp=0;
            core.updateStatusBar();
            core.events.lose('lava');
            return;
        }
        core.drawTip('经过血网，生命-'+core.values.lavaDamage);
    }
    if (data.event.id=='poisonNet') { // 毒网
        if (core.hasFlag('poison')) return;
        core.setFlag('poison', true);
    }
    if (data.event.id=='weakNet') { // 衰网
        if (core.hasFlag('weak')) return;
        core.setFlag('weak', true);
        core.status.hero.atk-=core.values.weakValue;
        core.status.hero.def-=core.values.weakValue;
    }
    if (data.event.id=='curseNet') { // 咒网
        if (core.hasFlag('curse')) return;
        core.setFlag('curse', true);
    }
    core.updateStatusBar();
}

////// 改变亮灯（感叹号）的事件 //////
events.prototype.changeLight = function(x, y) {
    var block = core.getBlock(x, y);
    if (block==null) return;
    var index = block.index;
    block = block.block;
    if (block.event.id != 'light') return;
    // 改变为dark
    block.id = 166;
    block.event = {'cls': 'terrains', 'id': 'darkLight', 'noPass': true};
    // 更新地图
    core.canvas.event.clearRect(x * 32, y * 32, 32, 32);
    var blockIcon = core.material.icons[block.event.cls][block.event.id];
    core.canvas.event.drawImage(core.material.images[block.event.cls], 0, blockIcon * 32, 32, 32, block.x * 32, block.y * 32, 32, 32);
    this.afterChangeLight(x,y);
}

////// 改变亮灯之后，可以触发的事件 //////
events.prototype.afterChangeLight = function(x,y) {

}

////// 滑冰 //////
events.prototype.ski = function (direction) {
    if (!core.isset(direction))
        direction = core.status.automaticRoute.lastDirection || core.getHeroLoc('direction');
    if (core.status.event.id!='ski') {
        core.waitHeroToStop(function () {
            core.status.event.id='ski';
            core.events.ski(direction);
        });
    }
    else {
        core.moveHero(direction, function () {
            if (core.status.event.id=='ski') {
                core.status.event.id=null;
                core.unLockControl();
                core.replay();
            }
        })
    }
}

////// 推箱子 //////
events.prototype.pushBox = function (data) {
    if (data.event.id!='box' && data.event.id!='boxed') return;

    // 判断还能否前进，看看是否存在事件
    var scan = {
        'up': {'x': 0, 'y': -1},
        'left': {'x': -1, 'y': 0},
        'down': {'x': 0, 'y': 1},
        'right': {'x': 1, 'y': 0}
    };

    var direction = core.getHeroLoc('direction'), nx=data.x+scan[direction].x, ny=data.y+scan[direction].y;

    if (nx<0||nx>12||ny<0||ny>12) return;

    var block = core.getBlock(nx, ny, null, false);
    if (block!=null && !(core.isset(block.block.event) && block.block.event.id=='flower'))
        return;

    var blockIcon;
    if (block==null) {
        core.status.thisMap.blocks.push(core.maps.getBlock(nx, ny, 169));
        blockIcon=core.material.icons.terrains.box;
    }
    else {
        block.block.id=170;
        block.block.event=core.maps.getBlock(null,null,170).event;
        blockIcon=core.material.icons.terrains.boxed;
    }
    core.canvas.event.clearRect(nx * 32, ny * 32, 32, 32);
    core.canvas.event.drawImage(core.material.images.terrains, 0, blockIcon * 32, 32, 32, nx * 32, ny * 32, 32, 32);

    if (data.event.id=='box') {
        core.removeBlock(data.x, data.y);
    }
    else {
        data.id=168;
        data.event=core.maps.getBlock(null,null,168).event;
        core.canvas.event.clearRect(data.x * 32, data.y * 32, 32, 32);
        core.canvas.event.drawImage(core.material.images.terrains, 0, core.material.icons.terrains.flower * 32, 32, 32, data.x * 32, data.y * 32, 32, 32);
    }

    core.updateStatusBar();
    core.lockControl();
    core.eventMoveHero([direction], null, function () {
        core.unLockControl();
        core.events.afterPushBox();
        core.replay();
    })

}

////// 推箱子后的事件 //////
events.prototype.afterPushBox = function () {

    var noBoxLeft = function () {
        // 地图上是否还存在未推到的箱子，如果不存在则返回true，存在则返回false
        for (var i=0;i<core.status.thisMap.blocks.length;i++) {
            var block=core.status.thisMap.blocks[i];
            if (core.isset(block.event) && block.event.id=='box') return false;
        }
        return true;
    }

    if (noBoxLeft()) {
        // 可以通过if语句来进行开门操作
        /*
        if (core.status.floorId=='xxx') { // 在某个楼层
            core.insertAction([ // 插入一条事件
                {"type": "openDoor", "loc": [x,y]} // 开门
            ])
        }
        */
    }
}

////// 使用炸弹/圣锤后的事件 //////
events.prototype.afterUseBomb = function () {

    // 这是一个使用炸弹也能开门的例子
    /*
    if (core.status.floorId=='xxx' && core.terrainExists(x0,y0,'specialDoor') // 某个楼层，该机关门存在
        && !core.enemyExists(x1,y1) && !core.enemyExists(x2,y2)) // 且守门的怪物都不存在
    {
        core.insertAction([ // 插入事件
            {"type": "openDoor", "loc": [x0,y0]} // 开门
        ])
    }
    */

}

////// 即将存档前可以执行的操作 //////
events.prototype.beforeSaveData = function(data) {

}

////// 读档事件后，载入事件前，可以执行的操作 //////
events.prototype.afterLoadData = function(data) {
    core.enemys.update();
}

/****************************************/
/********** 点击事件、键盘事件 ************/
/****************************************/

////// 长按 //////
events.prototype.longClick = function () {
    core.waitHeroToStop(function () {
        // 绘制快捷键
        core.ui.drawKeyBoard();
    });
}

////// 按下Ctrl键时（快捷跳过对话） //////
events.prototype.keyDownCtrl = function () {
    if (core.status.event.id=='text') {
        core.drawText();
        return;
    }
    if (core.status.event.id=='action' && core.status.event.data.type=='text') {
        this.doAction();
        return;
    }
}

////// 点击确认框时 //////
events.prototype.clickConfirmBox = function (x,y) {
    if ((x == 4 || x == 5) && y == 7 && core.isset(core.status.event.data.yes))
        core.status.event.data.yes();
    if ((x == 7 || x == 8) && y == 7 && core.isset(core.status.event.data.no))
        core.status.event.data.no();
}

////// 键盘操作确认框时 //////
events.prototype.keyUpConfirmBox = function (keycode) {
    if (keycode==37) {
        core.status.event.selection=0;
        core.ui.drawConfirmBox(core.status.event.ui, core.status.event.data.yes, core.status.event.data.no);
    }

    if (keycode==39) {
        core.status.event.selection=1;
        core.ui.drawConfirmBox(core.status.event.ui, core.status.event.data.yes, core.status.event.data.no);
    }

    if (keycode==13 || keycode==32 || keycode==67) {
        if (core.status.event.selection==0 && core.isset(core.status.event.data.yes)) {
            core.status.event.selection=null;
            core.status.event.data.yes();
        }
        if (core.status.event.selection==1 && core.isset(core.status.event.data.no)) {
            core.status.event.selection=null;
            core.status.event.data.no();
        }
    }
}

////// 自定义事件时的点击操作 //////
events.prototype.clickAction = function (x,y) {

    if (core.status.event.data.type=='text') {
        // 文字
        this.doAction();
        return;
    }
    if (core.status.event.data.type=='choices') {
        // 选项
        var data = core.status.event.data.current;
        var choices = data.choices;
        if (choices.length==0) return;
        if (x >= 5 && x <= 7) {
            var topIndex = 6 - parseInt((choices.length - 1) / 2);
            if (y>=topIndex && y<topIndex+choices.length) {
                // 选择
                core.status.route.push("choices:"+(y-topIndex));
                this.insertAction(choices[y-topIndex].action);
                this.doAction();
            }
        }
    }
}

////// 自定义事件时，按下某个键的操作 //////
events.prototype.keyDownAction = function (keycode) {
    if (core.status.event.data.type=='choices') {
        var data = core.status.event.data.current;
        var choices = data.choices;
        if (choices.length>0) {
            if (keycode==38) {
                core.status.event.selection--;
                core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
            }
            if (keycode==40) {
                core.status.event.selection++;
                core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
            }
        }
    }
}

////// 自定义事件时，放开某个键的操作 //////
events.prototype.keyUpAction = function (keycode) {
    if (core.status.event.data.type=='text' && (keycode==13 || keycode==32 || keycode==67)) {
        this.doAction();
        return;
    }
    if (core.status.event.data.type=='choices') {
        var data = core.status.event.data.current;
        var choices = data.choices;
        if (choices.length>0) {
            if (keycode==13 || keycode==32 || keycode==67) {
                core.status.route.push("choices:"+core.status.event.selection);
                this.insertAction(choices[core.status.event.selection].action);
                this.doAction();
            }
        }
    }
}

////// 怪物手册界面的点击操作 //////
events.prototype.clickBook = function(x,y) {
    // 上一页
    if ((x == 3 || x == 4) && y == 12) {
        core.ui.drawBook(core.status.event.data - 6);
        return;
    }
    // 下一页
    if ((x == 8 || x == 9) && y == 12) {
        core.ui.drawBook(core.status.event.data + 6);
        return;
    }
    // 返回
    if (x>=10 && x<=12 && y==12) {
        if (core.status.event.selection==null)
            core.ui.closePanel();
        else {
            core.status.boxAnimateObjs = [];
            core.ui.drawMaps(core.status.event.selection);
        }
        return;
    }
    // 怪物信息
    var data = core.status.event.data;
    if (core.isset(data) && y<12) {
        var page=parseInt(data/6);
        var index=6*page+parseInt(y/2);
        core.ui.drawBook(index);
        core.ui.drawBookDetail(index);
    }
    return;
}

////// 怪物手册界面时，按下某个键的操作 //////
events.prototype.keyDownBook = function (keycode) {
    if (keycode==37) core.ui.drawBook(core.status.event.data-6);
    if (keycode==38) core.ui.drawBook(core.status.event.data-1);
    if (keycode==39) core.ui.drawBook(core.status.event.data+6);
    if (keycode==40) core.ui.drawBook(core.status.event.data+1);
    if (keycode==33) core.ui.drawBook(core.status.event.data-6);
    if (keycode==34) core.ui.drawBook(core.status.event.data+6);
    return;
}

////// 怪物手册界面时，放开某个键的操作 //////
events.prototype.keyUpBook = function (keycode) {
    if (keycode==27 || keycode==88) {
        if (core.status.event.selection==null)
            core.ui.closePanel();
        else {
            core.status.boxAnimateObjs = [];
            core.ui.drawMaps(core.status.event.selection);
        }
        return;
    }
    if (keycode==13 || keycode==32 || keycode==67) {
        var data=core.status.event.data;
        if (core.isset(data)) {
            this.clickBook(6, 2*(data%6));
        }
        return;
    }
}

////// 怪物手册属性显示界面时的点击操作 //////
events.prototype.clickBookDetail = function () {
    core.clearMap('data', 0, 0, 416, 416);
    core.status.event.id = 'book';
}

////// 楼层传送器界面时的点击操作 //////
events.prototype.clickFly = function(x,y) {
    if ((x==10 || x==11) && y==9) core.ui.drawFly(core.status.event.data-1);
    if ((x==10 || x==11) && y==5) core.ui.drawFly(core.status.event.data+1);
    if (x>=5 && x<=7 && y==12) core.ui.closePanel();
    if (x>=0 && x<=9 && y>=3 && y<=11) {
        var index=core.status.hero.flyRange.indexOf(core.status.floorId);
        var stair=core.status.event.data<index?"upFloor":"downFloor";
        var floorId=core.status.event.data;
        var toFloor = core.status.hero.flyRange[floorId];
        core.status.route.push("fly:"+toFloor);
        core.ui.closePanel();
        core.changeFloor(toFloor, stair);
    }
    return;
}

////// 楼层传送器界面时，按下某个键的操作 //////
events.prototype.keyDownFly = function (keycode) {
    if (keycode==37 || keycode==38) core.ui.drawFly(core.status.event.data+1);
    else if (keycode==39 || keycode==40) core.ui.drawFly(core.status.event.data-1);
    return;
}

////// 楼层传送器界面时，放开某个键的操作 //////
events.prototype.keyUpFly = function (keycode) {
    if (keycode==71 || keycode==27 || keycode==88)
        core.ui.closePanel();
    if (keycode==13 || keycode==32 || keycode==67)
        this.clickFly(5,5);
    return;
}

////// 查看地图界面时的点击操作 //////
events.prototype.clickViewMaps = function (x,y) {
    if(y<=4) {
        core.ui.drawMaps(core.status.event.data+1);
    }
    else if (y>=8) {
        core.ui.drawMaps(core.status.event.data-1);
    }
    else {
        core.clearMap('data', 0, 0, 416, 416);
        core.setOpacity('data', 1);
        core.ui.closePanel();
    }
}

////// 查看地图界面时，按下某个键的操作 //////
events.prototype.keyDownViewMaps = function (keycode) {
    if (keycode==37 || keycode==38 || keycode==33) core.ui.drawMaps(core.status.event.data+1);
    else if (keycode==39 || keycode==40 || keycode==34) core.ui.drawMaps(core.status.event.data-1);
    return;
}

////// 查看地图界面时，放开某个键的操作 //////
events.prototype.keyUpViewMaps = function (keycode) {
    if (keycode==27 || keycode==13 || keycode==32 || keycode==67) {
        core.clearMap('data', 0, 0, 416, 416);
        core.setOpacity('data', 1);
        core.ui.closePanel();
    }
    if (keycode==88) {
        core.openBook(false);
    }
    return;
}

////// 商店界面时的点击操作 //////
events.prototype.clickShop = function(x,y) {
    var shop = core.status.event.data.shop;
    var choices = shop.choices;
    if (x >= 5 && x <= 7) {
        var topIndex = 6 - parseInt(choices.length / 2);
        if (y>=topIndex && y<topIndex+choices.length) {

            core.status.event.selection=y-topIndex;

            var money = core.getStatus('money'), experience = core.getStatus('experience');
            var times = shop.times, need = eval(shop.need);
            var use = shop.use;
            var use_text = use=='money'?"金币":"经验";

            var choice = choices[y-topIndex];
            if (core.isset(choice.need))
                need = eval(choice.need);

            if (need > eval(use)) {
                core.drawTip("你的"+use_text+"不足");
                return false;
            }

            core.status.event.data.actions.push(y-topIndex);

            eval(use+'-='+need);
            core.setStatus('money', money);
            core.setStatus('experience', experience);

            // 更新属性
            choice.effect.split(";").forEach(function (t) {
                core.doEffect(t);
            });
            core.updateStatusBar();
            shop.times++;
            this.openShop(core.status.event.data.id);
        }
        // 离开
        else if (y==topIndex+choices.length) {
            if (core.status.event.data.actions.length>0) {
                core.status.route.push("shop:"+core.status.event.data.id+":"+core.status.event.data.actions.join(""));
            }

            core.status.event.data.actions = [];
            core.status.boxAnimateObjs = [];
            if (core.status.event.data.fromList)
                core.ui.drawQuickShop();
            else core.ui.closePanel();
        }
        else return false;
    }
    return true;
}

////// 商店界面时，按下某个键的操作 //////
events.prototype.keyDownShop = function (keycode) {
    if (keycode==38) {
        core.status.event.selection--;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
    if (keycode==40) {
        core.status.event.selection++;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
}

////// 商店界面时，放开某个键的操作 //////
events.prototype.keyUpShop = function (keycode) {
    if (keycode==27 || keycode==88) {
        if (core.status.event.data.actions.length>0) {
            core.status.route.push("shop:"+core.status.event.data.id+":"+core.status.event.data.actions.join(""));
        }

        core.status.event.data.actions = [];

        core.status.boxAnimateObjs = [];

        if (core.status.event.data.fromList)
            core.ui.drawQuickShop();
        else
            core.ui.closePanel();
        return;
    }
    var shop = core.status.event.data.shop;
    var choices = shop.choices;
    if (keycode==13 || keycode==32 || keycode==67) {
        var topIndex = 6 - parseInt(choices.length / 2);
        this.clickShop(6, topIndex+core.status.event.selection);
    }
    return;
}

////// 快捷商店界面时的点击操作 //////
events.prototype.clickQuickShop = function(x, y) {
    var shopList = core.status.shops, keys = Object.keys(shopList);
    if (x >= 5 && x <= 7) {
        var topIndex = 6 - parseInt(keys.length / 2);
        if (y>=topIndex && y<topIndex+keys.length) {
            var reason = core.events.canUseQuickShop(keys[y - topIndex]);
            if (core.isset(reason)) {
                core.drawText(reason);
                return;
            }
            this.openShop(keys[y - topIndex], true);
            if (core.status.event.id=='shop')
                core.status.event.data.fromList = true;
        }
        // 离开
        else if (y==topIndex+keys.length)
            core.ui.closePanel();
    }
}

////// 快捷商店界面时，按下某个键的操作 //////
events.prototype.keyDownQuickShop = function (keycode) {
    if (keycode==38) {
        core.status.event.selection--;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
    if (keycode==40) {
        core.status.event.selection++;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
}

////// 快捷商店界面时，放开某个键的操作 //////
events.prototype.keyUpQuickShop = function (keycode) {
    if (keycode==27 || keycode==75 || keycode==88) {
        core.ui.closePanel();
        return;
    }
    var shopList = core.status.shops, keys = Object.keys(shopList);
    if (keycode==13 || keycode==32 || keycode==67) {
        var topIndex = 6 - parseInt(keys.length / 2);
        this.clickQuickShop(6, topIndex+core.status.event.selection);
    }
    return;
}

////// 工具栏界面时的点击操作 //////
events.prototype.clickToolbox = function(x,y) {
    // 返回
    if (x>=10 && x<=12 && y==12) {
        core.ui.closePanel();
        return;
    }
    if (x>=10 && x<=12 && y<=1) {
        if (!core.isset(core.status.event.data)) return;
        if (!core.flags.enableDeleteItem) {
            core.drawTip("不支持删除道具！");
            return;
        }
        core.removeItem(core.status.event.data);
        core.status.event.data = null;
        core.ui.drawToolbox();
        return;
    }

    var index=0;
    if (y==4||y==5||y==9||y==10) index=parseInt(x/2);
    else index=6+parseInt(x/2);
    if (y>=9) index+=100;
    this.clickToolboxIndex(index);
}

////// 选择工具栏界面中某个Index后的操作 //////
events.prototype.clickToolboxIndex = function(index) {
    var items = null;
    var ii=index;
    if (ii<100)
        items = Object.keys(core.status.hero.items.tools).sort();
    else {
        ii-=100;
        items = Object.keys(core.status.hero.items.constants).sort();
    }
    if (items==null) return;
    if (ii>=items.length) return;
    var itemId=items[ii];
    if (itemId==core.status.event.data) {
        core.events.useItem(itemId);
    }
    else {
        core.ui.drawToolbox(index);
    }
}

////// 工具栏界面时，按下某个键的操作 //////
events.prototype.keyDownToolbox = function (keycode) {
    if (!core.isset(core.status.event.data)) return;

    var tools = Object.keys(core.status.hero.items.tools).sort();
    var constants = Object.keys(core.status.hero.items.constants).sort();
    var index=core.status.event.selection;

    if (keycode==37) { // left
        if ((index>0 && index<100) || index>100) {
            this.clickToolboxIndex(index-1);
            return;
        }
        if (index==100 && tools.length>0) {
            this.clickToolboxIndex(tools.length-1);
            return;
        }
    }
    if (keycode==38) { // up
        if ((index>5 && index<100) || index>105) {
            this.clickToolboxIndex(index-6);
            return;
        }
        if (index>=100 && index<=105) {
            if (tools.length>6) {
                this.clickToolboxIndex(Math.min(tools.length-1, index-100+6));
            }
            else if (tools.length>0) {
                this.clickToolboxIndex(Math.min(tools.length-1, index-100));
            }
            return;
        }
    }
    if (keycode==39) { // right
        if ((index<tools.length-1) || (index>=100 && index<constants.length+100)) {
            this.clickToolboxIndex(index+1);
            return;
        }
        if (index==tools.length-1 && constants.length>0) {
            this.clickToolboxIndex(100);
            return;
        }
    }
    if (keycode==40) { // down
        if (index<=5) {
            if (tools.length>6) {
                this.clickToolboxIndex(Math.min(tools.length-1, index+6));
            }
            else if (constants.length>0) {
                this.clickToolboxIndex(100+Math.min(constants.length-1, index));
            }
            return;
        }
        if (index>5 && index<100 && constants.length>0) {
            this.clickToolboxIndex(100+Math.min(constants.length-1, index-6));
            return;
        }
        if (index>=100 && index<=105 && constants.length>6) {
            this.clickToolboxIndex(Math.min(100+constants.length-1, index+6));
            return;
        }
    }
}

////// 工具栏界面时，放开某个键的操作 //////
events.prototype.keyUpToolbox = function (keycode) {
    if (keycode==84 || keycode==27 || keycode==88) {
        core.ui.closePanel();
        return;
    }
    if (!core.isset(core.status.event.data)) return;

    if (keycode==13 || keycode==32 || keycode==67) {
        this.clickToolboxIndex(core.status.event.selection);
        return;
    }

    if (keycode==46) { // delete
        if (!core.isset(core.status.event.data)) return;
        if (!core.flags.enableDeleteItem) {
            core.drawTip("不支持删除道具！");
            return;
        }
        core.removeItem(core.status.event.data);
        core.status.event.data = null;
        core.ui.drawToolbox();
        return;
    }

}

////// 存读档界面时的点击操作 //////
events.prototype.clickSL = function(x,y) {

    var index=core.status.event.data;
    var page = parseInt(index/10), offset=index%10;

    // 上一页
    if ((x == 3 || x == 4) && y == 12) {
        core.ui.drawSLPanel(10*(page-1)+offset);
    }
    // 下一页
    if ((x == 8 || x == 9) && y == 12) {
        core.ui.drawSLPanel(10*(page+1)+offset);
    }
    // 返回
    if (x>=10 && x<=12 && y==12) {
        core.ui.closePanel();
        if (!core.isPlaying()) {
            core.showStartAnimate();
        }
        return;
    }

    var index=6*page+1;
    if (y>=1 && y<=4) {
        if (x>=1 && x<=3) core.doSL("autoSave", core.status.event.id);
        if (x>=5 && x<=7) core.doSL(5*page+1, core.status.event.id);
        if (x>=9 && x<=11) core.doSL(5*page+2, core.status.event.id);
    }
    if (y>=7 && y<=10) {
        if (x>=1 && x<=3) core.doSL(5*page+3, core.status.event.id);
        if (x>=5 && x<=7) core.doSL(5*page+4, core.status.event.id);
        if (x>=9 && x<=11) core.doSL(5*page+5, core.status.event.id);
    }
}

////// 存读档界面时，按下某个键的操作 //////
events.prototype.keyDownSL = function(keycode) {

    var index=core.status.event.data;
    var page = parseInt(index/10), offset=index%10;

    if (keycode==37) { // left
        if (offset==0) {
            core.ui.drawSLPanel(10*(page-1) + 5);
        }
        else {
            core.ui.drawSLPanel(index - 1);
        }
        return;
    }
    if (keycode==38) { // up
        if (offset<3) {
            core.ui.drawSLPanel(10*(page-1) + offset + 3);
        }
        else {
            core.ui.drawSLPanel(index - 3);
        }
        return;
    }
    if (keycode==39) { // right
        if (offset==5) {
            core.ui.drawSLPanel(10*(page+1)+1);
        }
        else {
            core.ui.drawSLPanel(index + 1);
        }
        return;
    }
    if (keycode==40) { // down
        if (offset>=3) {
            core.ui.drawSLPanel(10*(page+1) + offset - 3);
        }
        else {
            core.ui.drawSLPanel(index + 3);
        }
        return;
    }
    if (keycode==33) { // PAGEUP
        core.ui.drawSLPanel(10*(page-1) + offset);
        return;
    }
    if (keycode==34) { // PAGEDOWN
        core.ui.drawSLPanel(10*(page+1) + offset);
        return;
    }
}

////// 存读档界面时，放开某个键的操作 //////
events.prototype.keyUpSL = function (keycode) {

    var index=core.status.event.data;
    var page = parseInt(index/10), offset=index%10;

    if (keycode==27 || keycode==88 || (core.status.event.id == 'save' && keycode==83) || (core.status.event.id == 'load' && keycode==68)) {
        core.ui.closePanel();
        if (!core.isPlaying()) {
            core.showStartAnimate();
        }
        return;
    }
    if (keycode==13 || keycode==32 || keycode==67) {
        if (offset==0) {
            core.doSL("autoSave", core.status.event.id);
        }
        else {
            core.doSL(5*page+offset, core.status.event.id);
        }
        return;
    }
}

////// 系统设置界面时的点击操作 //////
events.prototype.clickSwitchs = function (x,y) {
    if (x<5 || x>7) return;
    var choices = core.status.event.ui.choices;
    var topIndex = 6 - parseInt((choices.length - 1) / 2);
    if (y>=topIndex && y<topIndex+choices.length) {
        var selection = y-topIndex;
        switch (selection) {
            case 0:
                core.musicStatus.bgmStatus = !core.musicStatus.bgmStatus;
                if (core.musicStatus.bgmStatus)
                    core.resumeBgm();
                else
                    core.pauseBgm();
                core.setLocalStorage('bgmStatus', core.musicStatus.bgmStatus);
                core.ui.drawSwitchs();
                break;
            case 1:
                core.musicStatus.soundStatus = !core.musicStatus.soundStatus;
                core.setLocalStorage('soundStatus', core.musicStatus.soundStatus);
                core.ui.drawSwitchs();
                break;
            case 2:
                if (!core.flags.canOpenBattleAnimate) {
                    core.drawTip("本塔不能开启战斗动画！");
                }
                else {
                    core.flags.battleAnimate=!core.flags.battleAnimate;
                    core.setLocalStorage('battleAnimate', core.flags.battleAnimate);
                    core.ui.drawSwitchs();
                }
                break;
            case 3:
                core.flags.displayEnemyDamage=!core.flags.displayEnemyDamage;
                core.updateFg();
                core.setLocalStorage('enemyDamage', core.flags.displayEnemyDamage);
                core.ui.drawSwitchs();
                break;
            case 4:
                core.flags.displayExtraDamage=!core.flags.displayExtraDamage;
                core.updateFg();
                core.setLocalStorage('extraDamage', core.flags.displayExtraDamage);
                core.ui.drawSwitchs();
                break;
            case 5:
                window.open(core.firstData.name+".zip", "_blank");
                break;
            case 6:
                core.status.event.selection=0;
                core.ui.drawSettings();
                break;
        }
    }
}

////// 系统设置界面时，按下某个键的操作 //////
events.prototype.keyDownSwitchs = function (keycode) {
    if (keycode==38) {
        core.status.event.selection--;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
    if (keycode==40) {
        core.status.event.selection++;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
}

////// 系统设置界面时，放开某个键的操作 //////
events.prototype.keyUpSwitchs = function (keycode) {
    if (keycode==27 || keycode==88) {
        core.status.event.selection=0;
        core.ui.drawSettings();
        return;
    }
    var choices = core.status.event.ui.choices;
    if (keycode==13 || keycode==32 || keycode==67) {
        var topIndex = 6 - parseInt((choices.length - 1) / 2);
        this.clickSwitchs(6, topIndex+core.status.event.selection);
    }
}


////// 系统菜单栏界面时的点击事件 //////
events.prototype.clickSettings = function (x,y) {
    if (x<5 || x>7) return;
    var choices = core.status.event.ui.choices;
    var topIndex = 6 - parseInt((choices.length - 1) / 2);
    if (y>=topIndex && y<topIndex+choices.length) {
        var selection = y-topIndex;

        switch (selection) {
            case 0:
                core.status.event.selection=0;
                core.ui.drawSwitchs();
                break;
            case 1:
                core.status.event.selection=0;
                core.ui.drawQuickShop();
                break;
            case 2:
                if (!core.flags.enableViewMaps) {
                    core.drawTip("本塔不允许浏览地图！");
                }
                else {
                    core.drawText("\t[系统提示]即将进入浏览地图模式。\n\n点击地图上半部分，或按[↑]键可查看前一张地图\n点击地图下半部分，或按[↓]键可查看后一张地图\n点击地图中间，或按[ESC]键可离开浏览地图模式\n此模式下可以打开怪物手册以查看某层楼的怪物属性", function () {
                        core.ui.drawMaps(core.floorIds.indexOf(core.status.floorId));
                    })
                }
                break;
            case 3:
                core.status.event.selection=0;
                core.ui.drawSyncSave();
                break;
            case 4:
                core.status.event.selection=1;
                core.ui.drawConfirmBox("你确定要重新开始吗？", function () {
                    core.ui.closePanel();
                    core.restart();
                }, function () {
                    core.status.event.selection=3;
                    core.ui.drawSettings();
                });
                break;
            case 5:
                core.ui.drawWaiting("正在拉取统计信息，请稍后...");

                var formData = new FormData();
                formData.append('type', 'statistics');
                formData.append('name', core.firstData.name);
                formData.append('version', core.firstData.version);

                var xhr = new XMLHttpRequest();
                xhr.open("POST", "/games/upload.php");

                xhr.onload = function(e) {
                    if (xhr.status==200) {
                        var response = JSON.parse(xhr.response);
                        if (response.code<0) {
                            core.drawText("出错啦！\n无法拉取统计信息。\n错误原因："+response.msg);
                        }
                        else {
                            var text="\t[本塔统计信息]";
                            var toAdd=false;
                            response.data.forEach(function (t) {
                                if (toAdd) text+="\n\n";
                                toAdd=true;
                                if (t.hard!='') text+=t.hard+"难度： "
                                text+="已有"+t.people+"人次游戏，"+t.score+"人次通关。";
                                t.info.forEach(function(ending) {
                                    if (ending.ending!='') {
                                        text+="\n"+ending.ending+"： 已有"+ending.score+"人次通关。";
                                    }
                                    if (core.isset(ending.max) && ending.max>0) {
                                        text+="\n当前MAX为"+ending.max+"，最早由 "+(ending.username||"匿名")+" 于"+core.formatDate(new Date(1000*ending.timestamp))+"打出。";
                                    }
                                })
                            })
                            core.drawText(text);
                        }
                    }
                    else {
                        core.drawText("出错啦！\n无法拉取统计信息。\n错误原因：HTTP "+xhr.status);
                    }
                };
                xhr.ontimeout = function() {
                    core.drawText("出错啦！\n无法拉取统计信息。\n错误原因：Timeout");
                }
                xhr.onerror = function() {
                    core.drawText("出错啦！\n无法拉取统计信息。\n错误原因：XHR Error");
                }
                xhr.send(formData);
                break;
            case 6:
                core.ui.drawHelp();
                break;
            case 7:
                core.ui.drawAbout();
                break;
            case 8:
                core.ui.closePanel();
                break;
        }
    }
    return;
}

////// 系统菜单栏界面时，按下某个键的操作 //////
events.prototype.keyDownSettings = function (keycode) {
    if (keycode==38) {
        core.status.event.selection--;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
    if (keycode==40) {
        core.status.event.selection++;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
}

////// 系统菜单栏界面时，放开某个键的操作 //////
events.prototype.keyUpSettings = function (keycode) {
    if (keycode==27 || keycode==88) {
        core.ui.closePanel();
        return;
    }
    var choices = core.status.event.ui.choices;
    if (keycode==13 || keycode==32 || keycode==67) {
        var topIndex = 6 - parseInt((choices.length - 1) / 2);
        this.clickSettings(6, topIndex+core.status.event.selection);
    }
}

////// 同步存档界面时的点击操作 //////
events.prototype.clickSyncSave = function (x,y) {
    if (x<5 || x>7) return;
    var choices = core.status.event.ui.choices;
    var topIndex = 6 - parseInt((choices.length - 1) / 2);
    if (y>=topIndex && y<topIndex+choices.length) {
        var selection = y-topIndex;
        switch (selection) {
            case 0:
                // core.syncSave("save");
                core.status.event.selection=0;
                core.ui.drawSyncSelect();
                break;
            case 1:
                core.syncLoad();
                break;
            case 2:
                /*
                var saves = [];
                for (var i=1;i<=150;i++) {
                    var data = core.getLocalStorage("save"+i, null);
                    if (core.isset(data)) {
                        saves.push(data);
                    }
                }
                var content = {
                    "name": core.firstData.name,
                    "version": core.firstData.version,
                    "data": saves
                }
                core.download(core.firstData.name+"_"+core.formatDate2(new Date())+".h5save", JSON.stringify(content));
                */
                core.status.event.selection=0;
                core.ui.drawLocalSaveSelect();
                break;
            case 3:
                core.readFile(function (obj) {
                    if (obj.name!=core.firstData.name) {
                        alert("存档和游戏不一致！");
                        return;
                    }
                    if (obj.version!=core.firstData.version) {
                        alert("游戏版本不一致！");
                        return;
                    }
                    if (!core.isset(obj.data)) {
                        alert("无效的存档！");
                        return;
                    }
                    var data=obj.data;

                    if (data instanceof Array) {
                        core.ui.drawConfirmBox("所有本地存档都将被覆盖，确认？", function () {
                            for (var i=1;i<=150;i++) {
                                if (i<=data.length) {
                                    core.setLocalStorage("save"+i, data[i-1]);
                                }
                                else {
                                    core.removeLocalStorage("save"+i);
                                }
                            }
                            core.drawText("读取成功！\n你的本地所有存档均已被覆盖。");
                        }, function () {
                            core.status.event.selection=0;
                            core.ui.drawSyncSave();
                        })
                    }
                    else {
                        var index=150;
                        for (var i=150;i>=1;i--) {
                            if (core.getLocalStorage("save"+i, null)==null)
                                index=i;
                            else break;
                        }
                        core.setLocalStorage("save"+index, data);
                        core.drawText("同步成功！\n单存档已覆盖至存档"+index);
                    }
                }, function () {
                    
                });
                break;
            case 4:
                core.download(core.firstData.name+"_"+core.formatDate2(new Date())+".h5route", JSON.stringify({
                        'name': core.firstData.name,
                        'hard': core.status.hard,
                        'route': core.encodeRoute(core.status.route)
                    }));
                break;
            case 5:
                core.status.event.selection=1;
                core.ui.drawConfirmBox("你确定要清空所有存档吗？", function() {
                    localStorage.clear();
                    core.drawText("\t[操作成功]你的所有存档已被清空。");
                }, function() {
                    core.status.event.selection=5;
                    core.ui.drawSyncSave();
                })
                break;
            case 6:
                core.status.event.selection=3;
                core.ui.drawSettings();
                break;

        }
    }
    return;
}

////// 同步存档界面时，按下某个键的操作 //////
events.prototype.keyDownSyncSave = function (keycode) {
    if (keycode==38) {
        core.status.event.selection--;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
    if (keycode==40) {
        core.status.event.selection++;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
}

////// 同步存档界面时，放开某个键的操作 //////
events.prototype.keyUpSyncSave = function (keycode) {
    if (keycode==27 || keycode==88) {
        core.status.event.selection=2;
        core.ui.drawSettings();
        return;
    }
    var choices = core.status.event.ui.choices;
    if (keycode==13 || keycode==32 || keycode==67) {
        var topIndex = 6 - parseInt((choices.length - 1) / 2);
        this.clickSyncSave(6, topIndex+core.status.event.selection);
    }
}

////// 同步存档选择界面时的点击操作 //////
events.prototype.clickSyncSelect = function (x, y) {
    if (x<5 || x>7) return;
    var choices = core.status.event.ui.choices;

    var topIndex = 6 - parseInt((choices.length - 1) / 2);
    if (y>=topIndex && y<topIndex+choices.length) {
        var selection = y - topIndex;
        switch (selection) {
            case 0:
                core.syncSave('all');
                break;
            case 1:
                core.syncSave();
                break;
            case 2:
                core.status.event.selection=0;
                core.ui.drawSyncSave();
                break;
        }
    }
}

////// 同步存档选择界面时，按下某个键的操作 //////
events.prototype.keyDownSyncSelect = function (keycode) {
    if (keycode==38) {
        core.status.event.selection--;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
    if (keycode==40) {
        core.status.event.selection++;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
}

////// 同步存档选择界面时，放开某个键的操作 //////
events.prototype.keyUpSyncSelect = function (keycode) {
    if (keycode==27 || keycode==88) {
        core.status.event.selection=0;
        core.ui.drawSettings();
        return;
    }
    var choices = core.status.event.ui.choices;
    if (keycode==13 || keycode==32 || keycode==67) {
        var topIndex = 6 - parseInt((choices.length - 1) / 2);
        this.clickSyncSelect(6, topIndex+core.status.event.selection);
    }
}

////// 存档下载界面时的点击操作 //////
events.prototype.clickLocalSaveSelect = function (x,y) {
    if (x<5 || x>7) return;
    var choices = core.status.event.ui.choices;

    var topIndex = 6 - parseInt((choices.length - 1) / 2);

    var saves=null;

    if (y>=topIndex && y<topIndex+choices.length) {
        var selection = y - topIndex;
        switch (selection) {
            case 0:
                saves=[];
                for (var i=1;i<=150;i++) {
                    var data = core.getLocalStorage("save"+i, null);
                    if (core.isset(data)) {
                        saves.push(data);
                    }
                }
                break;
            case 1:
                for (var i=150;i>=1;i--) {
                    saves=core.getLocalStorage("save"+i, null);
                    if (core.isset(saves)) {
                        break;
                    }
                }
                break;
            case 2:
                break;
        }
    }
    if (core.isset(saves)) {
        var content = {
            "name": core.firstData.name,
            "version": core.firstData.version,
            "data": saves
        }
        core.download(core.firstData.name+"_"+core.formatDate2(new Date())+".h5save", JSON.stringify(content));
    }
    core.status.event.selection=2;
    core.ui.drawSyncSave();
}

////// 存档下载界面时，按下某个键的操作 //////
events.prototype.keyDownLocalSaveSelect = function (keycode) {
    if (keycode==38) {
        core.status.event.selection--;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
    if (keycode==40) {
        core.status.event.selection++;
        core.ui.drawChoices(core.status.event.ui.text, core.status.event.ui.choices);
    }
}

////// 存档下载界面时，放开某个键的操作 //////
events.prototype.keyUpLocalSaveSelect = function (keycode) {
    if (keycode==27 || keycode==88) {
        core.status.event.selection=0;
        core.ui.drawSettings();
        return;
    }
    var choices = core.status.event.ui.choices;
    if (keycode==13 || keycode==32 || keycode==67) {
        var topIndex = 6 - parseInt((choices.length - 1) / 2);
        this.clickLocalSaveSelect(6, topIndex+core.status.event.selection);
    }
}

////// “虚拟键盘”界面时的点击操作 //////
events.prototype.clickKeyBoard = function (x, y) {
    if (y==3 && x>=1 && x<=11) {
        core.ui.closePanel();
        core.keyUp(112+x-1); // F1-F12: 112-122
    }
    if (y==4 && x>=1 && x<=10) {
        core.ui.closePanel();
        core.keyUp(x==10?48:48+x); // 1-9: 49-57; 0: 48
    }
    // 字母
    var lines = [
        ["Q","W","E","R","T","Y","U","I","O","P"],
        ["A","S","D","F","G","H","J","K","L"],
        ["Z","X","C","V","B","N","M"],
    ];
    if (y==5 && x>=1 && x<=10) {
        core.ui.closePanel();
        core.keyUp(lines[0][x-1].charCodeAt(0));
    }
    if (y==6 && x>=1 && x<=9) {
        core.ui.closePanel();
        core.keyUp(lines[1][x-1].charCodeAt(0));
    }
    if (y==7 && x>=1 && x<=7) {
        core.ui.closePanel();
        core.keyUp(lines[2][x-1].charCodeAt(0));
    }
    if (y==8 && x>=1 && x<=11) {
        core.ui.closePanel();
        if (x==1) core.keyUp(189); // -
        if (x==2) core.keyUp(187); // =
        if (x==3) core.keyUp(219); // [
        if (x==4) core.keyUp(221); // ]
        if (x==5) core.keyUp(220); // \
        if (x==6) core.keyUp(186); // ;
        if (x==7) core.keyUp(222); // '
        if (x==8) core.keyUp(188); // ,
        if (x==9) core.keyUp(190); // .
        if (x==10) core.keyUp(191); // /
        if (x==11) core.keyUp(192); // `
    }
    if (y==9 && x>=1 && x<=10) {
        core.ui.closePanel();
        if (x==1) core.keyUp(27); // ESC
        if (x==2) core.keyUp(9); // TAB
        if (x==3) core.keyUp(20); // CAPS
        if (x==4) core.keyUp(16); // SHIFT
        if (x==5) core.keyUp(17); // CTRL
        if (x==6) core.keyUp(18); // ALT
        if (x==7) core.keyUp(32); // SPACE
        if (x==8) core.keyUp(8); // BACKSPACE
        if (x==9) core.keyUp(13); // ENTER
        if (x==10) core.keyUp(46); // DEL
    }
    if (y==10 && x>=9 && x<=11)
        core.ui.closePanel();
}

////// 光标界面时的点击操作 //////
events.prototype.clickCursor = function (x,y) {

    if (x==core.status.automaticRoute.cursorX && y==core.status.automaticRoute.cursorY) {
        core.ui.closePanel();
        core.onclick(x,y,[]);
        return;
    }
    core.status.automaticRoute.cursorX=x;
    core.status.automaticRoute.cursorY=y;
    core.ui.drawCursor();
}

////// 光标界面时，按下某个键的操作 //////
events.prototype.keyDownCursor = function (keycode) {
    if (keycode==37) { // left
        core.status.automaticRoute.cursorX--;
        core.ui.drawCursor();
        return;
    }
    if (keycode==38) { // up
        core.status.automaticRoute.cursorY--;
        core.ui.drawCursor();
        return;
    }
    if (keycode==39) { // right
        core.status.automaticRoute.cursorX++;
        core.ui.drawCursor();
        return;
    }
    if (keycode==40) { // down
        core.status.automaticRoute.cursorY++;
        core.ui.drawCursor();
        return;
    }
}

////// 光标界面时，放开某个键的操作 //////
events.prototype.keyUpCursor = function (keycode) {
    if (keycode==27 || keycode==88) {
        core.ui.closePanel();
        return;
    }
    if (keycode==13 || keycode==32 || keycode==67 || keycode==69) {
        core.ui.closePanel();
        core.onclick(core.status.automaticRoute.cursorX, core.status.automaticRoute.cursorY, []);
        return;
    }
}

////// “关于”界面时的点击操作 //////
events.prototype.clickAbout = function () {
    if (core.isPlaying())
        core.ui.closePanel();
    else
        core.showStartAnimate();
}

