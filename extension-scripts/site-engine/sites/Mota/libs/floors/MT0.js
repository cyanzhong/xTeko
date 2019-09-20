// 这里需要改楼层名，请和文件名及下面的floorId保持完全一致
// 楼层唯一标识符仅能由字母、数字、下划线组成，且不能由数字开头
// 推荐用法：第20层就用MT20，第38层就用MT38，地下6层就用MT_6（用下划线代替负号），隐藏3层用MT3h（h表示隐藏），等等
main.floors.MT0 = {
    "floorId": "MT0", // 楼层唯一标识符，需要和名字完全一致
    "title": "主塔 0 层", // 楼层中文名
    "name": "0", // 显示在状态栏中的层数
    "canFlyTo": true, // 该楼能否被楼传器飞到（不能的话在该楼也不允许使用楼传器）
    "canUseQuickShop": true, // 该层是否允许使用快捷商店
    "defaultGround": "ground", // 默认地面的图块ID（terrains中）
    "png": [], // 该层默认显示的所有图片；详细用法请查看文档“自定义素材”中的说明。
    // "color": [0,0,0,0.3], // 该层的默认画面色调。本项可不写（代表无色调），如果写需要是一个RGBA数组。
    // "weather": ["snow",5], // 该层的默认天气。本项可忽略表示晴天，如果写则第一项为"rain"或"snow"代表雨雪，第二项为1-10之间的数代表强度。
    // "bgm": "bgm.mp3", // 到达该层后默认播放的BGM。本项可忽略。
    "map": [ // 地图数据，需要是13x13，建议使用地图生成器来生成
        [3,    3,    3,    3,    3,    3,    3,    3,    3,    3,    3,    3,    3],
        [3,    1,    4,    4,    4,    1,    87,   1,    4,    4,    4,    1,    3],
        [3,    1,    4,    4,    4,    1,    0,    1,    4,    4,    4,    1,    3],
        [3,    1,    4,    4,    4,    1,    0,    1,    4,    4,    4,    1,    3],
        [3,    1,    4,    4,    4,    1,    0,    1,    4,    4,    4,    1,    3],
        [3,    1,    4,    4,    4,    1,    0,    1,    4,    4,    4,    1,    3],
        [3,    1,    4,    4,    4,    1,    0,    1,    4,    4,    4,    1,    3],
        [3,    1,    1,    4,    4,    1,    0,    1,    4,    4,    1,    1,    3],
        [3,    1,    1,    1,    1,    1,    81,   1,    1,    1,    1,    1,    3],
        [3,    5,    1,    5,    1,    124,  124,  0,    1,    5,    1,    5,    3],
        [3,    5,    5,    5,    5,    5,    0,    5,    5,    5,    5,    5,    3],
        [3,    5,    5,    5,    5,    5,    0,    5,    5,    5,    5,    5,    3],
        [3,    3,    3,    3,    3,    3,    3,    3,    3,    3,    3,    3,    3],        
    ],
    "firstArrive": [ // 第一次到该楼层触发的事件
        "\t[hero]\b[up,hero]……",
        "\t[仙子,fairy]\b[up,6,9]你醒了！",
        "\t[hero]\b[up,hero]……\n你是谁，我在哪里？",
        "\t[仙子,fairy]\b[up,6,9]我是这里的仙子，刚才你被这里的小怪打昏了",
        "\t[hero]\b[up,hero]……\n剑，剑，我的剑呢？",
        "\t[仙子,fairy]\b[up,6,9]你的剑被他们抢走了，我只来得及将你救出来",
        "\t[hero]\b[up,hero]那，公主呢？我是来救公主的。",
        "\t[仙子,fairy]\b[up,6,9]公主还在里面，你这样进去是打不过里面的小怪的。",
        "\t[hero]\b[up,hero]那我怎么办，我答应了国王一定要把公主救出来的，仙子我应该怎么办呀？",
        "\t[仙子,fairy]\b[up,6,9]放心吧，我把我的力量借给你，你就可以打赢那些小怪了。不过，你得先帮我去找一样东西，找到了再来这里找我",
        "\t[hero]\b[up,hero]找东西？什么东西？",
        "\t[仙子,fairy]\b[up,6,9]一个十字架，中间有一颗红色的宝石。",
        "\t[hero]\b[up,hero]那个东西有什么用吗？",
        "\t[仙子,fairy]\b[up,6,9]我本是这塔的守护者，可不久前，从北方来了一批恶魔，他们占领了这座塔，并将我的魔力封在了这个十字架里面。如果你能将它带出来，那我的魔力便会慢慢的恢复，到那时我就可以把力量借给你去救出公主了。",
        "\t[仙子,fairy]\b[up,6,9]要记住，只有用我的魔力才可以打开21层的门。",
        "\t[hero]\b[up,hero]好吧，我试试看。",
        "\t[仙子,fairy]\b[up,6,9]我这里有三把钥匙，你先拿去。",
        {"type": "setValue", "name": "item:yellowKey", "value": "item:yellowKey+1"},
        {"type": "setValue", "name": "item:blueKey", "value": "item:blueKey+1"},
        {"type": "setValue", "name": "item:redKey", "value": "item:redKey+1"},
        "\t[仙子,fairy]\b[up,6,9]勇敢地去吧，勇士！",
        {"type": "move", "loc": [6,9], "steps": ["left"], "time": 750, "immediateHide": true},
        {"type": "show", "loc": [5,9]}
    ],
    "events": { // 该楼的所有可能事件列表
        "5,9": {
            "enable": false,
            "data": [
                {"type": "if", "condition": "item:cross>0",
                    "true": [
                        {"type": "setValue", "name": "flag:levelUp", "value": "true"},
                        "\t[仙子,fairy]\b[up]我现在将你的全属性提升1/3！\n妈咪妈咪哄！",
                        {"type": "animate", "name": "yongchang"},
                        {"type": "animate", "name": "levelup", "loc": "hero"},
                        {"type": "setValue", "name": "status:hp", "value": "status:hp*4/3"},
                        {"type": "setValue", "name": "status:atk", "value": "status:atk*4/3"},
                        {"type": "setValue", "name": "status:def", "value": "status:def*4/3"},
                        "\t[仙子,fairy]\b[up]20层的上楼梯已经为你打开",
                        {"type": "show", "loc": [6,8], "floorId": "MT20"},
                        {"type": "hide", "time": 500},
                    ],
                    "false": [
                        "\t[仙子,fairy]\b[up]十字架拿到了吗？",
                    ]
                }
            ]
        }
    },
    "changeFloor": { // 楼层转换事件；该事件不能和上面的events有冲突（同位置点），否则会被覆盖
        "6,1": {"floorId": "MT1", "stair": "downFloor"},
    },
    "afterBattle": { // 战斗后可能触发的事件列表

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

