// 这里需要改楼层名，请和文件名及下面的floorId保持完全一致
// 楼层唯一标识符仅能由字母、数字、下划线组成，且不能由数字开头
// 推荐用法：第20层就用MT20，第38层就用MT38，地下6层就用MT_6（用下划线代替负号），隐藏3层用MT3h（h表示隐藏），等等
main.floors.sample2 = {
    "floorId": "sample2", // 楼层唯一标识符，需要和名字完全一致
    "title": "主塔 40 层", // 楼层中文名
    "name": "40", // 显示在状态栏中的层数
    "canFlyTo": false, // 该楼能否被楼传器飞到（不能的话在该楼也不允许使用楼传器）
    "canUseQuickShop": true, // 该层是否允许使用快捷商店
    "defaultGround": "snowGround", // 默认地面的图块ID（terrains中）
    "png": [], // // 该层默认显示的所有图片；详细用法请查看文档“自定义素材”中的说明。
    "color": [255,0,0,0.3], // 该层的默认画面色调。本项可不写（代表无色调），如果写需要是一个RGBA数组。
    "weather": ["rain",10], // 该层的默认天气。本项可忽略表示晴天，如果写则第一项为"rain"或"snow"代表雨雪，第二项为1-10之间的数代表强度。
    "bgm": "qianjin.mid", // 到达该层后默认播放的BGM。本项可忽略。
    "map": [ // 地图数据，需要是13x13，建议使用地图生成器来生成
        [5,    5,    5,    5,    5,    5,    87,   5,    5,    5,    5,    5,    5],
        [5,    4,    4,    4,    4,    1,    0,    1,    4,    4,    4,    4,    5],
        [5,    4,    4,    4,    4,    1,    85,   1,    4,    4,    4,    4,    5],
        [5,    4,    4,    4,    247,  1,    247,  1,    247,  4,    4,    4,    5],
        [5,    4,    4,    4,    1,    247,  247,  247,  1,    4,    4,    4,    5],
        [5,    4,    4,    4,    1,    247,  30,   247,  1,    4,    4,    4,    5],
        [5,    4,    4,    4,    247,  1,    124,  1,    247,  4,    4,    4,    5],
        [5,    4,    4,    4,    4,    1,    123,  1,    4,    4,    4,    4,    5],
        [5,    4,    4,    4,    4,    1,    0,    1,    4,    4,    4,    4,    5],
        [5,    4,    4,    4,    4,    1,    0,    1,    4,    4,    4,    4,    5],
        [5,    4,    4,    4,    4,    4,    0,    4,    4,    4,    4,    4,    5],
        [5,    4,    4,    4,    4,    4,    85,   4,    4,    4,    4,    4,    5],
        [5,    5,    5,    5,    5,    5,    88,   5,    5,    5,    5,    5,    5],
    ],
    "firstArrive": [ // 第一次到该楼层触发的事件
        "\t[实战！]本楼将尝试复刻《宿命的旋律》40F剧情。"
    ],
    "events": { // 该楼的所有可能事件列表

        "6,11": {"enable": false}, // 下楼梯口的机关门，初始处于关闭状态
        "6,10": [ // 进入陷阱后关门
            {"type": "playSound", "name": "door.ogg"},
            {"type": "show", "loc": [6,11]}, // 显示机关门
            {"type": "hide"}, // 隐藏该事件
            {"type": "trigger", "loc": [6,7]}, // 直接引发"6,7"处的事件，即下面的杰克
            // 请再次注意"trigger"会立刻结束当前事件，因此"type":"hide"需要在trigger前调用
        ],
        "6,7": [ // 杰克事件
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]杰克，你究竟是什么人？",
            {"type": "playSound", "name": "item.ogg"},
            "\t[杰克,thief]……",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]我们……是朋友对吧？\n是朋友就应该相互信任对吧？",
            {"type": "playSound", "name": "item.ogg"},
            "\t[杰克,thief]……事到如今也没有什么好隐瞒的了。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[杰克,thief]没错，我就是这一切的背后主谋。",
            {"type": "move", "steps": [ // 移动到黑暗大法师的位置；使用move会自动调用hide进行隐藏，无需再手动调用
                {"direction": "up", "value": 3}
            ], "time": 1000},
            {"type": "show", "loc": [6,4], "time": 1000}, // 显示黑暗大法师
            {"type": "sleep", "time": 500}, // 等待500毫秒
            // 下面是黑暗大法师的事件
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]我的真名为——黑暗大法师，第四区域的头目。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]呵呵，不知道为什么，我竟然对事情走到现在这一步毫不感觉意外。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]以杰克的名义利用了你这么久，真是抱歉啊。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]真正的杰克现在在哪里？",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]盗贼杰克这个人类从未存在过，他只是我用来接近你的一副皮囊而已。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]……这样啊，呵呵。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]为什么你看上去丝毫不生气？",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]多亏了鬼帝，我现在的脾气好得连我自己都害怕。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]说起来我还得好好感谢你呢，如果没有杰克……你的帮助，我早就死在第一区域了。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]不论你的目的如何，你的所作所为都是对我有利的。不是吗？",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]能够如此淡定的面对背叛，看来跟五年前相比，你确实成长了很多啊。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]五年前？……黑暗大法师，在这之前，我们好像素未谋面吧？",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]五年前那场屠城你应该这一生都不会忘记吧。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]很不巧，那场屠城的主谋，也是我。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]……",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]这么说，击中我双亲的那道紫色闪电，也就是你释放的吧……",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]你的双亲？这种事情我怎么可能会记得？\n你难道在踩死蚂蚁的时候还会一只只记下他们的样子吗？",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]老 子 要 你 的 命",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]你应该对我心怀感激才对，如果不是那时的我看出了你隐藏的稀有勇者体质，你绝对不可能活到今天。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]在暗中动手脚让你通过勇者选拔的人也是我，我一直一直在暗中引导你走到今天这一步。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]是我救赎了一无是处的你。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]为什么只有我一个人活了下来！！！！",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]为什么偏偏是我！！！！",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]我刚才不是说过了吗？因为我看出了你有稀有勇者体质啊。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]你刚刚跟鬼帝交过手，应该已经很清楚这稀有勇者体质意味着什么了吧？",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]……就因为我有这种体质，就不得不背负如此残酷的宿命吗？",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]愚蠢！这意味着只要我对你加以引导跟培养，你就能成为这世间实力最强的存在！",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]……所以，你究竟想利用我干什么？",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]我利用你干的事情，你不是已经完成了吗？",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]……你说什么？",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]不知不觉间，你已经在我的指引下跟鬼帝正面交手并且杀掉了他啊。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]就连我跟鬼帝的对决……也是被你安排好了的？",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]你们两个一个是人类勇者，一个是魔物勇者，迟早会有交手的一天。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]我只不过是操纵了一系列的连锁事件让这一天提早了数十年到来而已。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]……你这样做对谁有好处？他可是你们魔物世界的救世主啊。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]一个惧怕征战，爱好和平的懦夫，也配叫救世主？",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]获得了力量，却只会被动挨打而不主动向人类世界出击，龟缩在第二区域惶惶度日，他根本就不配拥有稀有勇者体质。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]为了不让这种人霸占着积累多年的庞大灵魂能量无作为，我设计让你杀掉了他。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]你没有辜负我的期待，成功战胜了那个废物，现在你体内累积的灵魂能量……也就是魔力，已经达到了能跟魔王匹敌的地步。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]……是吗？现在的我能与魔王匹敌？",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]不止如此，你现在的力量之强就算是统治世界也是绰绰有余！",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]怎么样？要不要加入我的麾下，跟随我去征战人类世界？",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]能与魔王匹敌的话，也就是说。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]我 现 在 对 付 你 这 种 杂 碎 也 绰 绰 有 余 吧 ？",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]……什么？！",
            {"type": "playSound", "name": "item.ogg"},
            "\t[blackMagician]等一下！别冲动！你先等我把这利害关系理一理——",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]你给老子闭嘴。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]老子什么都不想听。",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]老子现在想做的事情只有一件——",
            {"type": "playSound", "name": "item.ogg"},
            "\t[hero]剁掉你的头，把它放回我双亲的墓前。",
            {"type": "update"} // 本事件剧情结束，更新地图显伤
        ],
        "6,4": { // 黑暗大法师战斗事件
            "enable": false, // 初始时是禁用状态
            // 打败后将触发afterBattle事件
        },
        "5,4": {"enable":false}, // 大法师的分身们，初始时禁用状态
        "7,4": {"enable":false}, // 大法师的分身们，初始时禁用状态
        "5,5": {"enable":false}, // 大法师的分身们，初始时禁用状态
        "7,5": {"enable":false}, // 大法师的分身们，初始时禁用状态
        "6,3": { // 大法师本尊
            "trigger": "action", // 注意：这里要写 trigger:action ，来覆盖掉系统默认的battle事件。
            "enable":false,
            "data": [
                "\t[blackMagician]听不进去人话的蠢货，就要用疼痛来管教！",
                {"type": "changePos", "direction": "up"},
                {"type": "playSound", "name": "item.ogg"},
                "\t[blackMagician]出来吧！禁忌——紫电凶杀阵！",
                {"type": "show", "loc": [[4,3],[4,6],[8,6],[8,3]], "time": 500}, // 依次显示四个角的法师
                {"type": "sleep", "time": 500},
                "\t[blackMagician]感受绝望吧！冥顽不化的蠢货！",
                /*
                {"type": "hide", "loc": [4,3], "time": 150}, // 由于没有动画效果，暂时使用“闪一下”表示
                {"type": "show", "loc": [4,3], "time": 150},
                {"type": "hide", "loc": [4,6], "time": 150}, // 由于没有动画效果，暂时使用“闪一下”表示
                {"type": "show", "loc": [4,6], "time": 150},
                {"type": "hide", "loc": [8,6], "time": 150}, // 由于没有动画效果，暂时使用“闪一下”表示
                {"type": "show", "loc": [8,6], "time": 150},
                {"type": "hide", "loc": [8,3], "time": 150}, // 由于没有动画效果，暂时使用“闪一下”表示
                {"type": "show", "loc": [8,3], "time": 150},
                */
                {"type": "animate", "name": "yongchang", "loc": [4,3]},
                {"type": "animate", "name": "yongchang", "loc": [4,6]},
                {"type": "animate", "name": "yongchang", "loc": [8,6]},
                {"type": "animate", "name": "yongchang", "loc": [8,3]},
                {"type": "sleep", "time": 200},
                {"type": "playSound", "name": "attack.ogg"}, // 播放攻击音效
                {"type": "animate", "name": "thunder", "loc": "hero"},
                {"type": "sleep", "time": 200},
                "\t[hero]唔……！！（吐血）",
                {"type": "playSound", "name": "item.ogg"},
                "\t[blackMagician]我的魔力可是充足的很啊！我会一直折磨到你屈服于我为止！",
                {"type": "playSound", "name": "item.ogg"},
                "\t[blackMagician]人类！好好感受吧！当初你们施加于我的痛苦！如今我要百倍奉还！",
                {"type": "show", "loc": [6,6], "time": 1000}, // 显示妖精
                {"type": "sleep", "time": 700},
                {"type": "trigger", "loc": [6,6]} // 立刻触发妖精事件
            ]
        },
        "4,3": { // 四个角的大法师，
            "trigger": "action",
            "displayDamage": false,
            "enable":false
        },
        "8,3": { // 四个角的大法师，
            "trigger": "action",
            "displayDamage": false,
            "enable":false
        },
        "4,6": { // 四个角的大法师，
            "trigger": "action",
            "displayDamage": false,
            "enable":false
        },
        "8,6": { // 四个角的大法师，
            "trigger": "action",
            "displayDamage": false,
            "enable":false
        },

        "6,6": { // 妖精
            "enable":false, // 初始时禁用状态
            "data": [ // 妖精事件
                {"type": "playSound", "name": "item.ogg"},
                "\t[hero]…妖精…小姐……是你吗？",
                {"type": "playSound", "name": "item.ogg"},
                "\t[小妖精,fairy]不要绝望，也不要悲伤。",
                {"type": "playSound", "name": "item.ogg"},
                "\t[小妖精,fairy]你从来都不是独自一人在前进。",
                {"type": "playSound", "name": "item.ogg"},
                "\t[小妖精,fairy]咱一直，一直都在注视着你。",
                {"type": "playSound", "name": "item.ogg"},
                "\t[小妖精,fairy]耍小聪明的你、笨笨的你呆呆的你、胆小的你、勇敢的你帅气的你……全部全部都是你。",
                {"type": "playSound", "name": "item.ogg"},
                "\t[小妖精,fairy]所以放心吧，无论发生什么，咱都会陪伴在你身边的。",
                {"type": "playSound", "name": "item.ogg"},
                "\t[小妖精,fairy]因为你要是离开我的话，立刻就会死掉吧？",
                {"type": "playSound", "name": "item.ogg"},
                "\t[hero]…妖精…小姐……其实一直以来，我都非常感激你……",
                {"type": "playSound", "name": "item.ogg"},
                "\t[小妖精,fairy]笨蛋！都这种时候了就不要作出像是临终遗言的发言了啊！！",
                {"type": "playSound", "name": "item.ogg"},
                "\t[小妖精,fairy]喂！那边穿衣品味差到极点的黑暗大法师，别左顾右盼说的就是你！你应该知道咱的身份吧？\n还不速速退下！",
                {"type": "playSound", "name": "item.ogg"},
                "\t[blackMagician]可恶…多管闲事的妖精族…明明只要再让他承受一点疼痛来瓦解他的意志力，我的计划就成功了！",
                {"type": "playSound", "name": "item.ogg"},
                "\t[小妖精,fairy]哼哼哼~抱歉哦，这个笨蛋的意志力可不像你想象的那么薄弱哦！",
                {"type": "playSound", "name": "item.ogg"},
                "\t[blackMagician]不甘心！我不甘心！妖精公主又如何！\n只要是阻挡我的，不管是谁我都要铲除！",
                {"type": "playSound", "name": "item.ogg"},
                "\t[小妖精,fairy]终于露出狐狸尾巴了，其实咱早就看出你有谋反的念头。你的计划就是拉拢这家伙入伙然后推翻魔王对魔塔的统治对吧？",
                {"type": "playSound", "name": "item.ogg"},
                "\t[blackMagician]呵呵呵……那个昏庸的魔王，掌握着那么庞大的魔物军队却只知道固守魔塔，而不主动侵略人类世界扩张领土！",
                {"type": "playSound", "name": "item.ogg"},
                "\t[blackMagician]我实在是看不过眼，所以我才决定把这个具备稀有勇者体质的家伙培养成新一任魔王！\n来让这个世界的势力重新洗牌！",
                {"type": "playSound", "name": "item.ogg"},
                "\t[小妖精,fairy]你觉得一个满脑子想着回家种田的废柴勇者会成为改变世界的魔王？你晃晃脑袋试试，是不是能听到大海的声音？",
                {"type": "playSound", "name": "item.ogg"},
                "\t[blackMagician]恼人至极的妖精族！呵呵呵……我干脆一不做二不休，连你也一块收拾了吧！",
                {"type": "playSound", "name": "item.ogg"},
                "\t[小妖精,fairy]别小瞧咱！咱好歹也是妖精族里实力数一数二的存在！",
                {"type": "playSound", "name": "item.ogg"},
                "\t[blackMagician]只会耍嘴皮子的恼人苍蝇！我倒要看看一块焦炭会不会说话！\n——招雷弹！！",
                /*
                {"type": "hide", "loc": [4,3], "time": 150}, // 由于没有动画效果，暂时使用“闪一下”表示
                {"type": "show", "loc": [4,3], "time": 150},
                {"type": "hide", "loc": [4,6], "time": 150}, // 由于没有动画效果，暂时使用“闪一下”表示
                {"type": "show", "loc": [4,6], "time": 150},
                {"type": "hide", "loc": [8,6], "time": 150}, // 由于没有动画效果，暂时使用“闪一下”表示
                {"type": "show", "loc": [8,6], "time": 150},
                {"type": "hide", "loc": [8,3], "time": 150}, // 由于没有动画效果，暂时使用“闪一下”表示
                {"type": "show", "loc": [8,3], "time": 150},
                */
                {"type": "animate", "name": "yongchang", "loc": [4,3]},
                {"type": "animate", "name": "yongchang", "loc": [4,6]},
                {"type": "animate", "name": "yongchang", "loc": [8,6]},
                {"type": "animate", "name": "yongchang", "loc": [8,3]},
                {"type": "playSound", "name": "attack.ogg"}, // 播放攻击音效
                /*
                {"type": "hide", "loc": [6,6], "time": 150}, // 妖精也闪一下表示收到了伤害
                {"type": "show", "loc": [6,6], "time": 150}, // 妖精也闪一下表示收到了伤害
                */
                {"type": "animate", "name": "thunder", "loc": [6,6]},
                {"type": "sleep", "time": 500}, // 等待500毫秒
                "\t[小妖精,fairy]切，这点伤痛跟他刚才经历的身心地狱相比根本就不算什么。",
                {"type": "playSound", "name": "item.ogg"},
                "\t[blackMagician]哼！翅膀都被烧焦了还要嘴硬？你难不成真以为我不会对你动真格？",
                {"type": "playSound", "name": "item.ogg"},
                "\t[hero]……你这混蛋！给我离她远点！！",
                {"type": "playSound", "name": "item.ogg"},
                "\t[小妖精,fairy]！…你现在受了很严重的致命伤，乱动什么？\n乖。别怕，这里有咱顶着！",
                {"type": "playSound", "name": "item.ogg"},
                "\t[小妖精,fairy]对了，咱再问你一遍，你是很珍惜自己性命的对吧？",
                {"type": "playSound", "name": "item.ogg"},
                "\t[hero]！…等等…妖精小姐，你不会是……？",
                {"type": "playSound", "name": "item.ogg"},
                "\t[小妖精,fairy]喂，黑暗大法师，你作为魔塔里最博学多识的蠢货，应该对咱妖精族的特殊能力再清楚不过吧？",
                {"type": "playSound", "name": "item.ogg"},
                "\t[blackMagician]什么？！难不成你是想！！不可能……\n就为了一个渺小的人类，不可理喻！！",
                {"type": "playSound", "name": "item.ogg"},
                "\t[小妖精,fairy]哼哼哼！你害怕的表情可真美味！",
                {"type": "playSound", "name": "item.ogg"},
                "\t[小妖精,fairy]不过比起这个，咱更期待你吃到“妖精自灭冲击”之后的死状哦！~",
                {"type": "playSound", "name": "item.ogg"},
                "\t[blackMagician]不！！不应该是这样的！我完美的计划竟然会被一只小小的妖精破坏！",
                {"type": "playSound", "name": "item.ogg"},
                "\t[hero]不要！……千万不要！……为了我这种人……唔！",
                {"type": "playSound", "name": "item.ogg"},
                "\t[小妖精,fairy]笨蛋，动都动不了了就不要强撑着站起来了啊。",
                {"type": "playSound", "name": "item.ogg"},
                "\t[小妖精,fairy]真是的，都到最后一刻了，你这家伙好歹也让咱省点心吧。",
                {"type": "playSound", "name": "item.ogg"},
                "\t[小妖精,fairy]那么，再见了……我的勇者大人。",
                {"type": "move", "time": 700, "steps": [ // 向上移动三个，撞上黑暗大大法师；本事件的hide会自动被调用
                    {"direction": "up", "value": 3}
                ]},
                {"type": "playSound", "name": "attack.ogg"}, // 播放攻击音效
                {"type": "sleep", "time": 200},
                "\t[blackMagician]不可能！！！！！",
                {"type": "hide", "loc": [6,3]}, // 法师消失
                {"type": "hide", "loc": [4,3]}, // 四个分身消失
                {"type": "hide", "loc": [4,6]},
                {"type": "hide", "loc": [8,6]},
                {"type": "hide", "loc": [8,3]},
                {"type": "changeFloor", "floorId": "sample2", "loc": [6,6], "direction": "up", "time": 1000}, // 更换勇士地点，合计1秒
                {"type": "show", "loc": [6,5]}, // 显示黄宝石
                {"type": "sleep", "time": 200}, // 等待200毫秒
                {"type": "playSound", "name": "item.ogg"},
                {"type": "sleep", "time": 200}, // 等待200毫秒
                "\t[hero]…妖精…小姐……",
                {"type": "playSound", "name": "item.ogg"},
                "\t[hero]……妖精小姐！",
                {"type": "playSound", "name": "item.ogg"},
                "\t[hero]是梦吗？……不对，为什么我在流泪？",
                {"type": "playSound", "name": "item.ogg"},
                "\t[hero]这颗漂亮的宝石是……？",
                {"type": "playSound", "name": "item.ogg"},
                "\t[hero]我全都想起来了……妖精小姐为了我……\n牺牲了自己的性命。",
                {"type": "playSound", "name": "item.ogg"},
                "\t[hero]在这颗宝石上，我能感受到你的温度……\n熟悉而又令人安心，这就是你最后留给我的东西吗……",
                {"type": "playSound", "name": "item.ogg"},
                "\t[hero]好温暖……",
                {"type": "setValue", "name": "item:yellowJewel", "value": "1"}, // 获得1个黄宝石
                {"type": "hide", "loc": [6,5]}, // 隐藏黄宝石
                {"type": "playSound", "name": "item.ogg"},
                "\t[hero]……",
                {"type": "openDoor", "loc": [6,2]}, // 开门
                {"type": "openDoor", "loc": [6,11]}
            ]
        },
        "6,5": { // 黄宝石
            "enable": false
        }

    },
    "changeFloor": { // 楼层转换事件；该事件不能和上面的events有冲突（同位置点），否则会被覆盖
        "6,0": {"floorId": "sample2", "stair": "upFloor"},
        "6,12": {"floorId": "sample1", "stair": "upFloor"}
    },
    "afterBattle": { // 战斗后可能触发的事件列表
        "6,4": [ // 和黑暗大法师战斗结束
            "\t[blackMagician]天真！你以为这样就能战胜我吗？",
            {"type": "show", "loc": [7,5], "time": 500},
            {"type": "update"}, // 更新地图显伤
        ],
        "7,5": [ // 和分身1的战斗
            "\t[blackMagician]你打败的不过是我众多分身中的其中一个而已。",
            {"type": "show", "loc": [5,4], "time": 500},
            {"type": "update"}, // 更新地图显伤
        ],
        "5,4": [ // 和分身2的战斗
            "\t[blackMagician]你的身体已经伤痕累累了，可我还留有着九成多的魔力。",
            {"type": "show", "loc": [5,5], "time": 500},
            {"type": "update"}, // 更新地图显伤
        ],
        "5,5": [ // 和分身3的战斗
            "\t[blackMagician]顽固的家伙！放弃抵抗吧！",
            {"type": "show", "loc": [7,4], "time": 500},
            {"type": "update"}, // 更新地图显伤
        ],
        "7,4": [ // 和分身4的战斗
            "\t[blackMagician]哈哈哈哈！我的灵魂远比你想象的强大！\n我即是永恒！",
            {"type": "show", "loc": [6,3], "time": 500},
            {"type": "trigger", "loc": [6,3]} // 显示大法师本尊
        ],
    },
    "afterGetItem": { // 获得道具后可能触发的事件列表

    },
    "afterOpenDoor": { // 开完门后可能触发的事件列表

    },
    "cannotMove": { // 每个图块不可通行的方向
        // 可以在这里定义每个点不能前往哪个方向，例如悬崖边不能跳下去
        // "x,y": ["up", "left"], // (x,y)点不能往上和左走

    },
}

