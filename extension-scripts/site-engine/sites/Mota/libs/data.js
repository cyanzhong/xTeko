function data() {

}

data.prototype.init = function() {
    this.firstData = {
        "title": "24层魔塔", // 游戏名，将显示在标题页面以及切换楼层的界面中
        "name": "24", // 游戏的唯一英文标识符。由英文、数字、下划线组成，不能超过20个字符。
        "version": "Ver 1.4.2", // 当前游戏版本；版本不一致的存档不能通用。
        "floorId": "MT0", // 初始楼层ID
        "hero": { // 勇士初始数据
            "name": "勇士", // 勇士名；可以改成喜欢的
            'lv': 1, // 初始等级，该项必须为正整数
            "hp": 1000, // 初始生命值
            "atk": 10, // 初始攻击
            "def": 10, // 初始防御
            "mdef": 0, // 初始魔防
            "money": 0, // 初始金币
            "experience": 0, // 初始经验
            "items": { // 初始道具个数
                "keys": {
                    "yellowKey": 0,
                    "blueKey": 0,
                    "redKey": 0
                },
                "constants": {},
                "tools": {}
            },
            "flyRange": [], // 初始可飞的楼层；一般留空数组即可
            "loc": {"direction": "up", "x": 6, "y": 10}, // 勇士初始位置
            "flags": { // 游戏过程中的变量或flags
                "poison": false, // 毒
                "weak": false, // 衰
                "curse": false, // 咒
            },
            "steps": 0, // 行走步数统计
        },
        "startText": [ // 游戏开始前剧情。如果无剧情直接留一个空数组即可。
            "本塔为经典胖老鼠24层的HTML5复刻版，尽量保留了原版的原汁原味。",
            "和flash版本相比，区别主要有：\n - 取消了25分钟上16层的限制\n - 开局提供怪物手册\n - 增加了快捷商店\n - 增加真结局：200级通关可达成",
            "本塔使用HTML5魔塔样板制作，可在全平台上进行游戏。如对H5魔塔感兴趣者，欢迎加群539113091交流。"
        ],
        "shops": [ // 定义全局商店（即快捷商店）
            {
                "id": "moneyShop1", // 商店唯一ID
                "name": "贪婪之神", // 商店名称（标题）
                "icon": "blueShop", // 商店图标，在icons.js中的npc一项定义
                "textInList": "3F金币商店", // 在快捷商店栏中显示的名称
                "use": "money", // 商店所要使用的。只能是"money"或"experience"。
                "need": "25",  // 商店需要的金币/经验数值；可以是一个表达式，以times作为参数计算。
                // 这里用到的times为该商店的已经的访问次数。首次访问该商店时times的值为0。
                // 上面的例子是50层商店的计算公式。你也可以写任意其他的计算公式，只要以times作为参数即可。
                // 例如： "need": "25" 就是恒定需要25金币的商店； "need": "20+2*times" 就是第一次访问要20金币，以后每次递增2金币的商店。
                // 如果是对于每个选项有不同的计算公式，写 "need": "-1" 即可。可参见下面的经验商店。
                "text": "勇敢的武士啊，给我${need}金币就可以：", // 显示的文字，需手动加换行符。可以使用${need}表示上面的need值。
                "choices": [ // 商店的选项
                    {"text": "生命+800", "effect": "status:hp+=800"},
                    // 如果有多个effect以分号分开，参见下面的经验商店
                    {"text": "攻击+4", "effect": "status:atk+=4"},
                    {"text": "防御+4", "effect": "status:def+=4"},
                    // effect只能对status和item进行操作，不能修改flag值。
                    // 必须是X+=Y的形式，其中Y可以是一个表达式，以status:xxx或item:xxx为参数
                    // 其他effect样例：
                    // "item:yellowKey+=1" 黄钥匙+1
                    // "item:pickaxe+=3" 破墙镐+3
                    // "status:hp+=2*(status:atk+status:def)" 将生命提升攻防和的数值的两倍
                ]
            },
            {
                "id": "expShop1", // 商店唯一ID
                "name": "神秘老人",
                "icon": "man",
                "textInList": "5F经验商店",
                "use": "experience", // 该商店使用的是经验进行计算
                "need": "-1", // 如果是对于每个选项所需要的数值不同，这里直接写-1，然后下面选项里给定具体数值
                "text": "勇敢的武士啊，给我若干经验就可以：",
                "choices": [
                    // 在choices中写need，可以针对每个选项都有不同的需求。
                    // 这里的need同样可以以times作为参数，比如 "need": "100+20*times"
                    // 多个effect直接以分号分开即可。如上面的意思是生命+1000，攻击+7，防御+7。
                    {"text": "等级+1", "need": "100", "effect": "status:lv+=1;status:hp+=1000;status:atk+=7;status:def+=7"},
                    {"text": "攻击+5", "need": "30", "effect": "status:atk+=5"},
                    {"text": "防御+5", "need": "30", "effect": "status:def+=5"},
                    
                ]
            },
            {
                "id": "keyShop", // 商店唯一ID
                "name": "神秘老人", // 商店名称（标题）
                "icon": "woman", // 商店图标，在icons.js中的npc一项定义
                "textInList": "5F钥匙商人", // 在快捷商店栏中显示的名称
                "use": "money", // 商店所要使用的。只能是"money"或"experience"。
                "need": "-1",  // 商店需要的金币/经验数值；可以是一个表达式，以times作为参数计算。
                // 这里用到的times为该商店的已经的访问次数。首次访问该商店时times的值为0。
                // 上面的例子是50层商店的计算公式。你也可以写任意其他的计算公式，只要以times作为参数即可。
                // 例如： "need": "25" 就是恒定需要25金币的商店； "need": "20+2*times" 就是第一次访问要20金币，以后每次递增2金币的商店。
                // 如果是对于每个选项有不同的计算公式，写 "need": "-1" 即可。可参见下面的经验商店。
                "text": "勇敢的武士啊，给我若干金币就可以：", // 显示的文字，需手动加换行符。可以使用${need}表示上面的need值。
                "choices": [ // 商店的选项
                    {"text": "黄钥匙", "need": "10", "effect": "item:yellowKey+=1"},
                    // 如果有多个effect以分号分开，参见下面的经验商店
                    {"text": "蓝钥匙", "need": "50", "effect": "item:blueKey+=1"},
                    {"text": "红钥匙", "need": "100", "effect": "item:redKey+=1"},
                    // effect只能对status和item进行操作，不能修改flag值。
                    // 必须是X+=Y的形式，其中Y可以是一个表达式，以status:xxx或item:xxx为参数
                    // 其他effect样例：
                    // "item:yellowKey+=1" 黄钥匙+1
                    // "item:pickaxe+=3" 破墙镐+3
                    // "status:hp+=2*(status:atk+status:def)" 将生命提升攻防和的数值的两倍
                ]
            },
            {
                "id": "moneyShop2", // 商店唯一ID
                "name": "贪婪之神", // 商店名称（标题）
                "icon": "blueShop", // 商店图标，在icons.js中的npc一项定义
                "textInList": "11F金币商店", // 在快捷商店栏中显示的名称
                "use": "money", // 商店所要使用的。只能是"money"或"experience"。
                "need": "100",  // 商店需要的金币/经验数值；可以是一个表达式，以times作为参数计算。
                // 这里用到的times为该商店的已经的访问次数。首次访问该商店时times的值为0。
                // 上面的例子是50层商店的计算公式。你也可以写任意其他的计算公式，只要以times作为参数即可。
                // 例如： "need": "25" 就是恒定需要25金币的商店； "need": "20+2*times" 就是第一次访问要20金币，以后每次递增2金币的商店。
                // 如果是对于每个选项有不同的计算公式，写 "need": "-1" 即可。可参见下面的经验商店。
                "text": "勇敢的武士啊，给我${need}金币就可以：", // 显示的文字，需手动加换行符。可以使用${need}表示上面的need值。
                "choices": [ // 商店的选项
                    {"text": "生命+4000", "effect": "status:hp+=4000"},
                    // 如果有多个effect以分号分开，参见下面的经验商店
                    {"text": "攻击+20", "effect": "status:atk+=20"},
                    {"text": "防御+20", "effect": "status:def+=20"},
                    // effect只能对status和item进行操作，不能修改flag值。
                    // 必须是X+=Y的形式，其中Y可以是一个表达式，以status:xxx或item:xxx为参数
                    // 其他effect样例：
                    // "item:yellowKey+=1" 黄钥匙+1
                    // "item:pickaxe+=3" 破墙镐+3
                    // "status:hp+=2*(status:atk+status:def)" 将生命提升攻防和的数值的两倍
                ]
            },
            {
                "id": "expShop2", // 商店唯一ID
                "name": "神秘老人",
                "icon": "man",
                "textInList": "13F经验商店",
                "use": "experience", // 该商店使用的是经验进行计算
                "need": "-1", // 如果是对于每个选项所需要的数值不同，这里直接写-1，然后下面选项里给定具体数值
                "text": "勇敢的武士啊，给我若干经验就可以：",
                "choices": [
                    // 在choices中写need，可以针对每个选项都有不同的需求。
                    // 这里的need同样可以以times作为参数，比如 "need": "100+20*times"
                    // 多个effect直接以分号分开即可。如上面的意思是生命+1000，攻击+7，防御+7。
                    {"text": "等级+3", "need": "270", "effect": "status:lv+=3;status:hp+=3000;status:atk+=20;status:def+=20"},
                    {"text": "攻击+17", "need": "95", "effect": "status:atk+=17"},
                    {"text": "防御+17", "need": "95", "effect": "status:def+=17"},
                    
                ]
            },
        ],
        "levelUp": [ // 经验升级所需要的数值，是一个数组
        ]
    }
    // 各种数值；一些数值可以在这里设置
    this.values = {
        /****** 角色相关 ******/
        "HPMAX": -1, // HP上限；-1则无上限
        "lavaDamage": 100, // 经过血网受到的伤害
        "poisonDamage": 10, // 中毒后每步受到的伤害
        "weakValue": 20, // 衰弱状态下攻防减少的数值
        /****** 道具相关 ******/
        "redJewel": 3, // 红宝石加攻击的数值
        "blueJewel": 3, // 蓝宝石加防御的数值
        "greenJewel": 5, // 绿宝石加魔防的数值
        "redPotion": 200, // 红血瓶加血数值
        "bluePotion": 500, // 蓝血瓶加血数值
        "yellowPotion": 500, // 黄血瓶加血数值
        "greenPotion": 800, // 绿血瓶加血数值
        "sword0": 0, // 默认装备折断的剑的攻击力
        "shield0": 0, // 默认装备残破的盾的防御力
        "sword1": 10, // 铁剑加攻数值
        "shield1": 10, // 铁盾加防数值
        "sword2": 20, // 银剑加攻数值
        "shield2": 20, // 银盾加防数值
        "sword3": 70, // 骑士剑加攻数值
        "shield3": 85, // 骑士盾加防数值
        "sword4": 80, // 圣剑加攻数值
        "shield4": 80, // 圣盾加防数值
        "sword5": 150, // 神圣剑加攻数值
        "shield5": 190, // 神圣盾加防数值
        "moneyPocket": 300, // 金钱袋加金币的数值
        /****** 怪物相关 ******/
        'breakArmor': 0.9, // 破甲的比例（战斗前，怪物附加角色防御的x%作为伤害）
        'counterAttack': 0.1, // 反击的比例（战斗时，怪物每回合附加角色攻击的x%作为伤害，无视角色防御）
        'purify': 3, // 净化的比例（战斗前，怪物附加勇士魔防的x倍作为伤害）
        'hatred': 2, // 仇恨属性中，每杀死一个怪物获得的仇恨值
        /****** 系统相关 ******/
        'animateSpeed': 500, // 动画时间
    }
    // 系统FLAG，在游戏运行中中请不要修改它。
    this.flags = {
        /****** 状态栏相关 ******/
        "enableFloor": true, // 是否在状态栏显示当前楼层
        "enableLv": true, // 是否在状态栏显示当前等级
        "enableMDef": false, // 是否在状态栏及战斗界面显示魔防（护盾）
        "enableMoney": true, // 是否在状态栏、怪物手册及战斗界面显示金币
        "enableExperience": true, // 是否在状态栏、怪物手册及战斗界面显示经验
        "enableLevelUp": false, // 是否允许等级提升（进阶）；如果上面enableExperience为false，则此项恒视为false
        "enableDebuff": false, // 是否涉及毒衰咒；如果此项为false则不会在状态栏中显示毒衰咒的debuff
        ////// 上述的几个开关将直接影响状态栏的显示效果 //////
        /****** 道具相关 ******/
        "flyNearStair": false, // 是否需要在楼梯边使用传送器
        "pickaxeFourDirections": false, // 使用破墙镐是否四个方向都破坏；如果false则只破坏面前的墙壁
        "bombFourDirections": false, // 使用炸弹是否四个方向都会炸；如果false则只炸面前的怪物（即和圣锤等价）
        "bigKeyIsBox": true, // 如果此项为true，则视为钥匙盒，红黄蓝钥匙+1；若为false，则视为大黄门钥匙
        "equipment": false, // 剑和盾是否直接作为装备。如果此项为true，则作为装备，需要在道具栏使用，否则将直接加属性。
        "enableDeleteItem": false, // 是否允许删除（丢弃）道具
        /****** 怪物相关 ******/
        "enableNegativeDamage": false, // 是否支持负伤害（回血）
        "hatredDecrease": true, // 是否在和仇恨怪战斗后减一半的仇恨值，此项为false则和仇恨怪不会扣减仇恨值。
        "betweenAttackCeil": false, // 夹击方式是向上取整还是向下取整。如果此项为true则为向上取整，为false则为向下取整
        /****** 系统相关 ******/
        "startDirectly": true, // 点击“开始游戏”后是否立刻开始游戏而不显示难度选择界面
        "canOpenBattleAnimate": true, // 是否允许用户开启战斗过程；如果此项为false，则下面两项均强制视为false
        "showBattleAnimateConfirm": true, // 是否在游戏开始时提供“是否开启战斗动画”的选项
        "battleAnimate": true, // 是否默认显示战斗动画；用户可以手动在菜单栏中开关
        "displayEnemyDamage": true, // 是否地图怪物显伤；用户可以手动在菜单栏中开关
        "displayExtraDamage": false, // 是否地图高级显伤（领域、夹击等）；用户可以手动在菜单栏中开关
        "enableGentleClick": true, // 是否允许轻触（获得面前物品）
        "potionWhileRouting": false, // 寻路算法是否经过血瓶；如果该项为false，则寻路算法会自动尽量绕过血瓶
        "enableViewMaps": true, // 是否支持在菜单栏中查看所有楼层的地图
        "portalWithoutTrigger": true, // 是否支持穿透。所谓穿透，即当自动寻路经过楼梯时，不触发楼层转换事件而是穿过它。
        "enableMoveDirectly": true, // 是否允许瞬间移动
    }
}

data.prototype.getFirstData = function() {
    return core.clone(this.firstData);
}

main.instance.data = new data();