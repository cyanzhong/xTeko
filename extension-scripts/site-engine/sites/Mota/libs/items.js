function items() {

}

////// 初始化 //////
items.prototype.init = function () {
    this.items = {
        // 钥匙
        'yellowKey': {'cls': 'keys', 'name': '黄钥匙'},
        'blueKey': {'cls': 'keys', 'name': '蓝钥匙'},
        'redKey': {'cls': 'keys', 'name': '红钥匙'},

        // 宝石、血瓶
        'redJewel': {'cls': 'items', 'name': '红宝石'},
        'blueJewel': {'cls': 'items', 'name': '蓝宝石'},
        'greenJewel': {'cls': 'items', 'name': '绿宝石'},
        'yellowJewel': {'cls': 'items', 'name': '黄宝石'},
        'redPotion': {'cls': 'items', 'name': '红血瓶'},
        'bluePotion': {'cls': 'items', 'name': '蓝血瓶'},
        'yellowPotion': {'cls': 'items', 'name': '黄血瓶'},
        'greenPotion': {'cls': 'items', 'name': '绿血瓶'},
        'sword1': {'cls': 'items', 'name': '铁剑'},
        'sword2': {'cls': 'items', 'name': '银剑'},
        'sword3': {'cls': 'items', 'name': '骑士剑'},
        'sword4': {'cls': 'items', 'name': '圣剑'},
        'sword5': {'cls': 'items', 'name': '神圣剑'},
        'shield1': {'cls': 'items', 'name': '铁盾'},
        'shield2': {'cls': 'items', 'name': '银盾'},
        'shield3': {'cls': 'items', 'name': '骑士盾'},
        'shield4': {'cls': 'items', 'name': '圣盾'},
        'shield5': {'cls': 'items', 'name': '神圣盾'},
        'superPotion': {'cls': 'items', 'name': '圣水'},
        'moneyPocket': {'cls': 'items', 'name': '金钱袋'},

        // 物品
        'sword0': {'cls': 'constants', 'name': '折断的剑', 'text': '没有任何作用的剑，相当于脱掉装备。'},
        'shield0': {'cls': 'constants', 'name': '残破的盾', 'text': '没有任何作用的盾，相当于脱掉装备。'},
        'book': {'cls': 'constants', 'name': '怪物手册', 'text': '可以查看当前楼层各怪物属性'},
        'fly': {'cls': 'constants', 'name': '楼层传送器', 'text': '可以自由往来去过的楼层'},
        'coin': {'cls': 'items', 'name': '幸运金币'},
        'snow': {'cls': 'constants', 'name': '冰冻徽章', 'text': '可以将四周的熔岩变成平地'},
        'cross': {'cls': 'constants', 'name': '十字架', 'text': '仙子所需要的十字架'},
        'knife': {'cls': 'constants', 'name': '屠龙匕首', 'text': '该道具尚未被定义'},
        'shoes': {'cls': 'constants', 'name': '绿鞋', 'text': '持有时无视负面地形'},

        'wand1': {'cls': 'constants', 'name': '火之法杖', "text": "封印Boss需要的物品之一"},
        'wand2': {'cls': 'constants', 'name': '冰之法杖', "text": "封印Boss需要的物品之一"},

        // 道具
        'bigKey': {'cls': 'tools', 'name': '大黄门钥匙', 'text': '可以开启当前层所有黄门'},
        'greenKey': {'cls': 'tools', 'name': '绿钥匙', 'text': '可以打开一扇绿门'},
        'steelKey': {'cls': 'tools', 'name': '铁门钥匙', 'text': '可以打开一扇铁门'},
        'pickaxe': {'cls': 'tools', 'name': '破墙镐', 'text': '可以破坏勇士面前的墙'},
        'icePickaxe': {'cls': 'constants', 'name': '锄头', 'text': '小偷需要的锄头'},
        'bomb': {'cls': 'tools', 'name': '炸弹', 'text': '可以炸掉勇士面前的怪物'},
        'centerFly': {'cls': 'items', 'name': '小飞羽'},
        'bigFly': {'cls': 'items', 'name': '大飞羽'},
        'upFly': {'cls': 'tools', 'name': '上楼器', 'text': '可以飞往楼上的相同位置'},
        'downFly': {'cls': 'tools', 'name': '下楼器', 'text': '可以飞往楼下的相同位置'},
        'earthquake': {'cls': 'tools', 'name': '地震卷轴', 'text': '可以破坏当前层的所有墙'},
        'poisonWine': {'cls': 'tools', 'name': '解毒药水', 'text': '可以解除中毒状态'},
        'weakWine': {'cls': 'tools', 'name': '解衰药水', 'text': '可以解除衰弱状态'},
        'curseWine': {'cls': 'tools', 'name': '解咒药水', 'text': '可以解除诅咒状态'},
        'superWine': {'cls': 'tools', 'name': '万能药水', 'text': '可以解除所有不良状态'},
        'hammer': {'cls': 'tools', 'name': '圣锤', 'text': '可以炸掉勇士面前的怪物'}
    }
}

////// 获得所有道具 //////
items.prototype.getItems = function () {
    // 大黄门钥匙？钥匙盒？
    if (core.flags.bigKeyIsBox)
        this.items['bigKey'] = {'cls': 'items', 'name': '钥匙盒'};
    // 面前的墙？四周的墙？
    if (core.flags.pickaxeFourDirections)
        this.items.pickaxe.text = "可以破坏勇士四周的墙";
    if (core.flags.bombFourDirections)
        this.items.bomb.text = "可以炸掉勇士四周的怪物";
    if (core.flags.equipment) {
        this.items.sword1 = {'cls': 'constants', 'name': '铁剑', 'text': '一把很普通的铁剑，攻击+'+core.values.sword1};
        this.items.sword2 = {'cls': 'constants', 'name': '银剑', 'text': '一把很普通的银剑，攻击+'+core.values.sword2};
        this.items.sword3 = {'cls': 'constants', 'name': '骑士剑', 'text': '一把很普通的骑士剑，攻击+'+core.values.sword3};
        this.items.sword4 = {'cls': 'constants', 'name': '圣剑', 'text': '一把很普通的圣剑，攻击+'+core.values.sword4};
        this.items.sword5 = {'cls': 'constants', 'name': '神圣剑', 'text': '一把很普通的神圣剑，攻击+'+core.values.sword5};
        this.items.shield1 = {'cls': 'constants', 'name': '铁盾', 'text': '一个很普通的铁盾，防御+'+core.values.shield1};
        this.items.shield2 = {'cls': 'constants', 'name': '银盾', 'text': '一个很普通的银盾，防御+'+core.values.shield2};
        this.items.shield3 = {'cls': 'constants', 'name': '骑士盾', 'text': '一个很普通的骑士盾，防御+'+core.values.shield3};
        this.items.shield4 = {'cls': 'constants', 'name': '圣盾', 'text': '一个很普通的圣盾，防御+'+core.values.shield4};
        this.items.shield5 = {'cls': 'constants', 'name': '神圣盾', 'text': '一个很普通的神圣盾，防御+'+core.values.shield5};
    }

    return this.items;
}

main.instance.items = new items();

////// “即捡即用类”道具的使用效果 //////
items.prototype.getItemEffect = function(itemId, itemNum) {
    var itemCls = core.material.items[itemId].cls;
    // 消耗品
    if (itemCls === 'items') {
        if (itemId === 'redJewel') core.status.hero.atk += core.values.redJewel;
        if (itemId === 'blueJewel') core.status.hero.def += core.values.blueJewel;
        if (itemId === 'greenJewel') core.status.hero.mdef += core.values.greenJewel;
        if (itemId == 'yellowJewel') { // 黄宝石属性：需自己定义
            core.status.hero.hp+=1000;
            core.status.hero.atk+=6;
            core.status.hero.def+=6;
            core.status.hero.mdef+=10;
        }
        if (itemId === 'redPotion') core.status.hero.hp += core.values.redPotion;
        if (itemId === 'bluePotion') core.status.hero.hp += core.values.bluePotion;
        if (itemId === 'yellowPotion') core.status.hero.hp += core.values.yellowPotion;
        if (itemId === 'greenPotion') core.status.hero.hp += core.values.greenPotion;
        if (itemId === 'sword1') core.status.hero.atk += core.values.sword1;
        if (itemId === 'sword2') core.status.hero.atk += core.values.sword2;
        if (itemId == 'sword3') core.status.hero.atk += core.values.sword3;
        if (itemId == 'sword4') core.status.hero.atk += core.values.sword4;
        if (itemId === 'sword5') core.status.hero.atk += core.values.sword5;
        if (itemId === 'shield1') core.status.hero.def += core.values.shield1;
        if (itemId === 'shield2') core.status.hero.def += core.values.shield2;
        if (itemId === 'shield3') core.status.hero.def += core.values.shield3;
        if (itemId === 'shield4') core.status.hero.def += core.values.shield4;
        if (itemId === 'shield5') core.status.hero.def += core.values.shield5;
        if (itemId == 'centerFly') {
            core.status.hero.lv++;
            core.status.hero.hp+=1000;
            core.status.hero.atk+=10;
            core.status.hero.def+=10;
        }
        if (itemId == 'bigFly') {
            core.status.hero.lv+=3;
            core.status.hero.hp+=3000;
            core.status.hero.atk+=30;
            core.status.hero.def+=30;
        }
        if (itemId === 'bigKey') { // 只有是钥匙盒才会执行这一步
            core.status.hero.items.keys.yellowKey++;
            core.status.hero.items.keys.blueKey++;
            core.status.hero.items.keys.redKey++;
        }
        if (itemId == 'superPotion') core.status.hero.hp *= 2;
        if (itemId == 'coin') core.status.hero.money += core.values.moneyPocket;
    }
    else {
        core.addItem(itemId, itemNum);
    }
}

////// “即捡即用类”道具的文字提示 //////
items.prototype.getItemEffectTip = function(itemId) {
    if (itemId == 'redJewel') return "，攻击+"+core.values.redJewel;
    if (itemId == 'blueJewel') return "，防御+"+core.values.blueJewel;
    if (itemId == 'greenJewel') return "，魔防+"+core.values.greenJewel;
    if (itemId == 'yellowJewel') return "，全属性提升";
    if (itemId == 'redPotion') return "，生命+"+core.values.redPotion;
    if (itemId == 'bluePotion') return "，生命+"+core.values.bluePotion;
    if (itemId == 'yellowPotion') return "，生命+"+core.values.yellowPotion;
    if (itemId == 'greenPotion') return "，生命+"+core.values.greenPotion;
    if (itemId == 'centerFly') return "，等级+1";
    if (itemId == 'bigFly') return "，等级+3";
    if (!core.flags.equipment && itemId == 'sword1') return "，攻击+"+core.values.sword1;
    if (!core.flags.equipment && itemId == 'sword2') return "，攻击+"+core.values.sword2;
    if (!core.flags.equipment && itemId == 'sword3') return "，攻击+"+core.values.sword3;
    if (!core.flags.equipment && itemId == 'sword4') return "，攻击+"+core.values.sword4;
    if (!core.flags.equipment && itemId == 'sword5') return "，攻击+"+core.values.sword5;
    if (!core.flags.equipment && itemId == 'shield1') return "，防御+"+core.values.shield1;
    if (!core.flags.equipment && itemId == 'shield2') return "，防御+"+core.values.shield2;
    if (!core.flags.equipment && itemId == 'shield3') return "，防御+"+core.values.shield3;
    if (!core.flags.equipment && itemId == 'shield4') return "，防御+"+core.values.shield4;
    if (!core.flags.equipment && itemId == 'shield5') return "，防御+"+core.values.shield5;
    if (itemId === 'bigKey') return "，全钥匙+1";
    if (itemId === 'superPotion') return "，生命值翻倍";
    if (itemId == 'coin') return "，金币+"+core.values.moneyPocket;
    return "";
}

////// 使用道具 //////
items.prototype.useItem = function (itemId, callback) {
    if (!this.canUseItem(itemId)) {
        if (core.isset(callback)) callback();
        return;
    }
    var itemCls = core.material.items[itemId].cls;

    if (itemId=='book') core.ui.drawBook(0);
    if (itemId=='fly') core.ui.drawFly(core.status.hero.flyRange.indexOf(core.status.floorId));
    if (itemId == 'earthquake' || itemId == 'bomb' || itemId == 'pickaxe' || itemId=='icePickaxe'
        || itemId == 'snow' || itemId == 'hammer' || itemId=='bigKey') {
        // 消除当前层的某些块
        core.removeBlockByIds(core.status.floorId, core.status.event.data);
        core.drawMap(core.status.floorId, function () {
            core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
            core.updateFg();
            core.drawTip(core.material.items[itemId].name + "使用成功");

            if (itemId == 'bomb' || itemId == 'hammer')
                core.events.afterUseBomb();
        });
    }
    if (itemId == 'centerFly') {
        // 对称飞
        core.clearMap('hero', 0, 0, 416, 416);
        core.setHeroLoc('x', core.status.event.data.x);
        core.setHeroLoc('y', core.status.event.data.y);
        core.drawHero(core.getHeroLoc('direction'), core.getHeroLoc('x'), core.getHeroLoc('y'), 'stop');
        core.drawTip(core.material.items[itemId].name + "使用成功");
    }
    if (itemId == 'upFly' || itemId == 'downFly') {
        // 上楼器/下楼器
        core.changeFloor(core.status.event.data.id, null, {'direction': core.status.hero.loc.direction, 'x': core.status.event.data.x, 'y': core.status.event.data.y}, null, function (){
            core.drawTip(core.material.items[itemId].name + "使用成功");
            core.replay();
        });
    }
    if (itemId == 'poisonWine') core.setFlag('poison', false);
    if (itemId == 'weakWine') {
        core.setFlag('weak', false);
        core.status.hero.atk += core.values.weakValue;
        core.status.hero.def += core.values.weakValue;
    }
    if (itemId == 'curseWine') core.setFlag('curse', false);
    if (itemId == 'superWine') {
        core.setFlag('poison', false);
        if (core.hasFlag('weak')) {
            core.setFlag('weak', false);
            core.status.hero.atk += core.values.weakValue;
            core.status.hero.def += core.values.weakValue;
        }
        core.setFlag('curse', false);
    }

    // 剑
    if (itemId.indexOf("sword")==0) {
        var now=core.getFlag('sword', 'sword0'); // 当前装备剑的ID
        core.status.hero.atk -= core.values[now];
        core.setItem(now, 1);
        core.status.hero.atk += core.values[itemId];
        core.setItem(itemId, 0);
        core.setFlag('sword', itemId);
        core.drawTip("已装备"+core.material.items[itemId].name);
    }
    // 盾
    if (itemId.indexOf("shield")==0) {
        var now=core.getFlag('shield', 'shield0');
        core.status.hero.def -= core.values[now];
        core.setItem(now, 1);
        core.status.hero.def += core.values[itemId];
        core.setItem(itemId, 0);
        core.setFlag('shield', itemId);
        core.drawTip("已装备"+core.material.items[itemId].name);
    }

    core.updateStatusBar();

    // 记录路线
    if (itemId!='book' && itemId!='fly') {
        core.status.route.push("item:"+itemId);
    }

    // 道具使用完毕：删除
    if (itemCls=='tools')
        core.status.hero.items[itemCls][itemId]--;
    if (core.status.hero.items[itemCls][itemId]==0)
        delete core.status.hero.items[itemCls][itemId];

    if (core.isset(callback)) callback();
}

////// 当前能否使用道具 //////
items.prototype.canUseItem = function (itemId) {
    // 没有道具
    if (!core.hasItem(itemId)) return false;

    if (itemId == 'book') return true;
    if (itemId == 'fly') return core.status.hero.flyRange.indexOf(core.status.floorId)>=0;
    if (itemId == 'pickaxe') {
        // 破墙镐
        var ids = [];
        for (var i in core.status.thisMap.blocks) {
            var block = core.status.thisMap.blocks[i];
            if (core.isset(block.event) && !(core.isset(block.enable) && !block.enable) &&
                (block.event.id == 'yellowWall' || block.event.id=='whiteWall' || block.event.id=='blueWall')) // 能破哪些墙
            {
                // 四个方向
                if (core.flags.pickaxeFourDirections) {
                    if (Math.abs(block.x-core.status.hero.loc.x)+Math.abs(block.y-core.status.hero.loc.y)<=1) {
                        ids.push(i);
                    }
                }
                else {
                    if (block.x == core.nextX() && block.y == core.nextY()) {
                        ids.push(i);
                    }
                }
            }
        }
        if (ids.length>0) {
            core.status.event.data = ids;
            return true;
        }
        return false;
    }
    if (itemId == 'icePickaxe') {
        // 破冰镐
        for (var i in core.status.thisMap.blocks) {
            var block = core.status.thisMap.blocks[i];
            if (core.isset(block.event) && !(core.isset(block.enable) && !block.enable) && block.x==core.nextX() && block.y==core.nextY() && block.event.id=='ice') {
                core.status.event.data = [i];
                return true;
            }
        }
        return false;
    }
    if (itemId == 'bomb') {
        // 炸弹
        var ids = [];
        for (var i in core.status.thisMap.blocks) {
            var block = core.status.thisMap.blocks[i];
            if (core.isset(block.event) && !(core.isset(block.enable) && !block.enable) && block.event.cls == 'enemys' && Math.abs(block.x-core.status.hero.loc.x)+Math.abs(block.y-core.status.hero.loc.y)<=1) {
                var enemy = core.material.enemys[block.event.id];
                if (core.isset(enemy.bomb) && !enemy.bomb) continue;
                if (core.flags.bombFourDirections || (block.x==core.nextX() && block.y==core.nextY()))
                    ids.push(i);
            }
        }
        if (ids.length>0) {
            core.status.event.data = ids;
            return true;
        }
        return false;
    }
    if (itemId == 'hammer') {
        // 圣锤
        for (var i in core.status.thisMap.blocks) {
            var block = core.status.thisMap.blocks[i];
            if (core.isset(block.event) && !(core.isset(block.enable) && !block.enable) && block.event.cls == 'enemys' && block.x==core.nextX() && block.y==core.nextY()) {
                var enemy = core.material.enemys[block.event.id];
                if (core.isset(enemy.bomb) && !enemy.bomb) continue;
                core.status.event.data = [i];
                return true;
            }
        }
        return false;
    }
    if (itemId == 'earthquake') {
        var ids = []
        for (var i in core.status.thisMap.blocks) {
            var block = core.status.thisMap.blocks[i];
            if (core.isset(block.event) && !(core.isset(block.enable) && !block.enable) && (block.event.id == 'yellowWall' || block.event.id == 'blueWall' || block.event.id == 'whiteWall'))
                ids.push(i);
        }
        if (ids.length>0) {
            core.status.event.data = ids;
            return true;
        }
        return false;
    }
    if (itemId == 'centerFly') {
        // 中心对称
        var toX = 12 - core.getHeroLoc('x'), toY = 12-core.getHeroLoc('y');
        var block = core.getBlock(toX, toY);
        if (block==null) {
            core.status.event.data = {'x': toX, 'y': toY};
            return true;
        }
        return false;
    }
    if (itemId == 'upFly') {
        // 上楼器
        var floorId = core.status.floorId;
        var index = core.floorIds.indexOf(floorId);
        if (index==core.floorIds.length-1) return false;
        var toId = core.floorIds[index+1];
        var toX = core.getHeroLoc('x'), toY = core.getHeroLoc('y');

        var block = core.getBlock(toX, toY, toId);
        if (block==null) {
            core.status.event.data = {'id': toId, 'x': toX, 'y': toY};
            return true;
        }
        return false;
    }
    if (itemId == 'downFly') {
        // 下楼器
        var floorId = core.status.floorId;
        var index = core.floorIds.indexOf(floorId);
        if (index==0) return false;
        var toId = core.floorIds[index-1];
        var toX = core.getHeroLoc('x'), toY = core.getHeroLoc('y');

        var block = core.getBlock(toX, toY, toId);
        if (block==null) {
            core.status.event.data = {'id': toId, 'x': toX, 'y': toY};
            return true;
        }
        return false;
    }
    if (itemId=='snow') {
        // 冰冻徽章
        var ids = [];
        for (var i in core.status.thisMap.blocks) {
            var block = core.status.thisMap.blocks[i];
            if (core.isset(block.event) && !(core.isset(block.enable) && !block.enable) && block.event.id == 'lava' && Math.abs(block.x-core.status.hero.loc.x)+Math.abs(block.y-core.status.hero.loc.y)<=1) {
                ids.push(i);
            }
        }
        if (ids.length>0) {
            core.status.event.data = ids;
            return true;
        }
        return false;
    }
    if (itemId=='bigKey') {
        // 大黄门钥匙
        var ids = [];
        for (var i in core.status.thisMap.blocks) {
            var block = core.status.thisMap.blocks[i];
            if (core.isset(block.event) && !(core.isset(block.enable) && !block.enable) && block.event.id == 'yellowDoor') {
                ids.push(i);
            }
        }
        if (ids.length>0) {
            core.status.event.data = ids;
            return true;
        }
        return false;
    }
    if (itemId=='poisonWine') return core.hasFlag('poison');
    if (itemId=='weakWine') return core.hasFlag('weak');
    if (itemId=='curseWine') return core.hasFlag('curse');
    if (itemId=='superWine') return core.hasFlag('poison') || core.hasFlag('weak') || core.hasFlag('curse');

    // 剑盾
    if (itemId.indexOf("sword")==0 || itemId.indexOf("shield")==0) return true;

    return false;
}
