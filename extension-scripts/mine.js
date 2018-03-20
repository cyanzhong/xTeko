"use strict";

// please feel free to modify these values
let mapWidth = 20;
let mapHeight = 20;
let mineCount = 20;

// modify anything below this line at your own risk
const Mine = "💥";
const Mark = "🚩";
const Unknown = "";

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getFontColor(x) {
    switch (x) {
        case 1:
            return $color("blue");
        case 2:
            return $color("green");
        case 3:
            return $color("red");
        case 4:
            return $color("purple");
        case 5:
            return $color("brown");
        case 6:
            return $color("magenta");
        case 7:
            return $color("orange");
        case 8:
            return $color("yellow");
        default:
            return $color("tint");
    }
}

function getBgColor(x) {
    switch(x) {
        case Mine:
            return $color("red");
        case Unknown:
        case Mark:
            return $color("lightGray");
        default:
            return $color("gray");
    }
}

function locationToIndex(sender, mapWidth) {
    let contentSize = sender.sender.contentSize;
    let cellSize = contentSize.width / mapWidth;  // assume it's a square
    // cast NSConcreteValue to NSPoint
    let point = sender.location.runtimeValue().invoke("pointValue").rawValue();
    return Math.floor(point.y / cellSize) * mapWidth + Math.floor(point.x / cellSize);
}


class MineMap {
    constructor(width=10, height=10, mineCount=10) {
        this.width = width;
        this.height = height;
        this.mineCount = mineCount;
        this.maskData = new Array(this.width * this.height);
        this.marked = 0;

        this.newGame();
    }

    toString() {
        let chars = new Array();
        for (let y = 0; y < this.height; y ++) {
            for (let x = 0; x < this.width; x ++) {
                chars.push(this._mineData[y * this.width + x]);
                chars.push(" ");
            }
            chars.push("\n");
        }
        return chars.join("");
    }

    _updateView() {
        $("label").text = this.mineCount - this.marked;
        $("matrix").data = this.viewData;
    }

    newGame() {
        this._mineData = MineMap.generateMap(this.width, this.height, this.mineCount);
        this.maskData.fill(Unknown);
        this.marked = 0;
    }

    sweep(index) {
        if (this.maskData[index] === Unknown) {
            let cell = this._mineData[index];
            this.maskData[index] = cell;

            if (cell === Mine) {
                this.gameOver(true);
            } else if (cell === 0) {
                this._openCell(index);
            }

            this._updateView();            
        }
    }

    mark(index) {
        if (this.maskData[index] === Unknown) {
            this.maskData[index] = Mark;
            this.marked ++;

            this._updateView();

            if (this.isAllMineMarked()) {
                this.gameOver();
            }
        } else if (this.maskData[index] === Mark) {
            this.maskData[index] = Unknown;
            this.marked --;

            this._updateView();
        }
    }

    isAllMineMarked() {
        return this._mineData.every((x, index) => {
            if (x === Mine) {
                return this.maskData[index] === Mark;
            } else {
                return true;
            }
        }, this);
    }

    gameOver(blowUp=false) {
        $ui.alert({
            title: "Have Fun",
            message: blowUp ? "Do not give up!" : "Good job!",
            actions: [
                {
                    title: "I'm done",
                    handler: function() {
                        $app.close();
                    },
                },
                {
                    title: "One more time!",
                    handler: () => {
                        this.newGame();
                        this._updateView();
                    },
                },
            ],
        });
    }

    _openCell(index) {
        let x = index % this.width;
        let y = Math.floor(index / this.width);

        let cells = [];
        if (y > 0) {
            cells.push(index - this.width);
        }
        if (x > 0) {
            cells.push(index - 1);
        }
        if (y < this.height - 1) {
            cells.push(index + this.width);
        }
        if (x < this.width - 1) {
            cells.push(index + 1);
        }
        
        for (let i of cells) {
            if (this.maskData[i] === Unknown) {
                this.maskData[i] = this._mineData[i];
                if (this.maskData[i] === 0) {
                    this._openCell(i);
                }
            }
        }
    }

    get viewData() {
        return this.maskData.map((x) => {
            return {
                cell: {
                    text: x === 0 ? "" : x.toString(),
                    bgcolor: getBgColor(x),
                    textColor: getFontColor(x),
                }
            };
        });
    }

    static generateMap(width, height, mineCount) {
        let mineData = new Array(width * height);
        mineData.fill(0);

        mineCount = Math.min(Math.floor(width * height / 2), mineCount);

        let allCells = new Array(width * height);
        for (let i = 0; i < width * height; i ++) {
            allCells[i] = i;
        }
        shuffle(allCells);

        for (let i = 0; i < mineCount; i ++) {
            mineData[allCells.pop()] = Mine;
        }

        mineData.map((x, i, arr) => {
            if (x === Mine) {
                let noL = i % width !== 0;  // not at left-most
                let noR = i % width !== width - 1;  // not at rigth-most
                let noT = i > width;  // not at top-most
                let noB = i < (width - 1) * height;  // not at bottom-most

                let conditions = [
                    noL && noT, noT, noR && noT,
                    noL, false, noR,
                    noL && noB, noB, noR && noB
                ]

                let offset = [
                    i - width - 1, i - width, i - width + 1,
                    i - 1, i, i + 1,
                    i + width - 1, i + width, i + width + 1
                ];

                offset.map((o, oi) => {
                    if (conditions[oi]) {
                        if (arr[o] !== Mine) arr[o] += 1;
                    }
                });
            }
        });

        return mineData;
    }
}

let mineMap = new MineMap(mapWidth, mapHeight, mineCount);

$ui.render({
    props: {
        title: "Mine"
    },
    views: [
        {
            type: "label",
            props: {
                align: $align.center,
                font: $font(18),
                lines: 1,
                autoFontSize: true,
            },
            layout: function(make, view) {
                make.top.left.right.equalTo(0);
                make.width.equalTo(view.super);
                make.height.equalTo(24);
            },
        },
        {
            type: "matrix",
            props: {
                columns: mineMap.width,
                square: true,
                selectable: true,
                spacing: 1,
                data: mineMap.viewData,
                template: {
                    views: [{
                        type: "label",
                        props: {
                            id: "cell",
                            bgcolor: $color("lightGray"),
                            align: $align.center,
                            font: $font("blod", 14),
                        },
                        layout: $layout.fill,
                    }],
                },
            },
            layout: function(make, view) {
                make.left.bottom.right.equalTo(0);
                make.top.equalTo($("label").bottom);
            },
            events: {
                didSelect: function(sender, indexPath, data) {
                    mineMap.sweep(indexPath.item);
                },
                longPressed: function(sender) {
                    let index = locationToIndex(sender, mineMap.width);
                    mineMap.mark(index);
                },
            },
        }
    ],
});
