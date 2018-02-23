"use strict";

// util functions

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


// base classes

class Block {
    constructor(name, shape, color) {
        this.name = name;
        this.shape = shape;
        this.color = color;
    }

    toString() {
        return `<Block ${this.name}:${this.color}>`;
    }

    rotate() {
        let newShape = new Array();
        for (let c = 0; c < this.shape[0].length; c++) {
            let newRow = new Array();
            for (let r = this.shape.length - 1; r >= 0; r--) {
                newRow.push(this.shape[r][c]);
            }
            newShape.push(newRow);
        }
        this.shape = newShape;
    }

    randomRotate() {
        let times = getRandomInt(0, 4);
        for (let i = 0; i < times; i++) {
            this.rotate();
        }
    }

    get width() {
        return this.shape[0].length;
    }

    get height() {
        return this.shape.length;
    }

    clone() {
        let clonedShape = new Array();
        for (let y = 0; y < this.height; y++) {
            let clonedLine = new Array();
            for (let x = 0; x < this.width; x++) {
                clonedLine.push(this.shape[y][x]);
            }
            clonedShape.push(clonedLine);
        }
        return new Block(this.name, clonedShape, this.color);
    }

    tint() {
        let tintedShape = new Array();
        for (let y = 0; y < this.height; y++) {
            let tintedLine = new Array();
            for (let x = 0; x < this.width; x++) {
                if (this.shape[y][x] === 0) {
                    tintedLine.push(0);
                } else {
                    tintedLine.push(this.color);
                }
            }
            tintedShape.push(tintedLine);
        }
        return tintedShape;
    }
}

class Tetris {
    // the original point is at top-left
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this._matrix = new Array(width * height);
        this.clearMatrix();

        this._blocks = [
            [
                "I",
                [[1, 1, 1, 1]],
                "cyan"
            ],
            [
                "J",
                [[1, 1, 1], [0, 0, 1]],
                "blue"
            ],
            [
                "L",
                [[1, 1, 1], [1, 0, 0]],
                "orange"
            ],
            [
                "O",
                [[1, 1], [1, 1]],
                "yellow"
            ],
            [
                "S",
                [[0, 1, 1], [1, 1, 0]],
                "green"
            ],
            [
                "T",
                [[1, 1, 1], [0, 1, 0]],
                "purple"
            ],
            [
                "Z",
                [[1, 1, 0], [0, 1, 1]],
                "red"
            ]
        ].map((def) => {
            return new Block(def[0], def[1], def[2]);
        });

        this._currentBlock = null;
        this._nextBlock = null;

        this._currentBlockX = 0;
        this._currentBlockY = 0;
    }

    clearMatrix() {
        this._matrix.fill(0);
        this._currentBlock = null;
        this._nextBlock = null;
    }

    clearLine(line) {
        if (line >= 0 && line < this.height) {
            this._matrix.fill(
                0,
                this.width * line,
                this.width * (line + 1)
            );
        }
    }

    // make line downward (y ++)
    fallLine(line) {
        // the line at bottom can not be fall
        if (line >= 0 && line < this.height - 1) {
            for (let x = 0; x < this.width; x++) {
                this._matrix[this.width * (line + 1) + x] = this._matrix[this.width * line + x];
                this._matrix[this.width * line + x] = 0;
            }
        }
    }

    fallLinesFrom(line) {
        for (let y = line; y >= 0; y--) {
            this.fallLine(y);
        }
    }

    hasGap(line) {
        let offset = this.width * line;
        for (let x = 0; x < this.width; x++) {
            if (this._matrix[offset + x] === 0) {
                return true;
            }
        }

        return false;
    }

    checkLines() {
        for (let y = this.height - 1; y >= 0; y--) {
            if (this.hasGap(y)) {
                continue;
            }
            this.clearLine(y);
            this.fallLinesFrom(y - 1);
            y++; // check this line again
        }
    }

    randomPickBlock() {
        let i = getRandomInt(0, this._blocks.length);
        let block = this._blocks[i].clone();
        block.randomRotate();
        return block;
    }

    get nextBlock() {
        if (this._nextBlock === null) {
            this._nextBlock = this.randomPickBlock();
        }
        return this._nextBlock;
    }

    get currentBlock() {
        if (this._currentBlock === null) {
            this._currentBlock = this.nextBlock;
            this._currentBlockX = Math.floor((this.width - this._currentBlock.width) / 2);
            this._currentBlockY = 0;

            this._nextBlock = null;
            // make next block again
            this.nextBlock;
        }
        return this._currentBlock;
    }

    isLeftwardMovingOK() {
        if (this._currentBlockX <= 0) {
            return false;
        }
        for (let y = 0; y < this.currentBlock.height; y++) {
            let x = 0;
            while (this.currentBlock.shape[y][x] === 0) {
                x ++;
            }

            let leftOfBlock = this._matrix[(this._currentBlockY + y) * this.width + this._currentBlockX + x - 1];

            if (leftOfBlock !== 0) {
                return false;
            }
        }
        return true;
    }

    isRightwardMovingOK() {
        if (this._currentBlockX + this._currentBlock.width >= this.width) {
            return false;
        }
        for (let y = 0; y < this.currentBlock.height; y++) {
            let x = this.currentBlock.width - 1;

            while (this.currentBlock.shape[y][x] === 0) {
                x --;
            }

            let rightOfBlock = this._matrix[(this._currentBlockY + y) * this.width + this._currentBlockX + x + 1];

            if (rightOfBlock !== 0) {
                return false;
            }
        }
        return true;
    }

    isDownwardMovingOK() {
        if (this._currentBlockY + this._currentBlock.height >= this.height) {
            return false;
        }

        for (let x = 0; x < this.currentBlock.width; x ++) {
            let y = this.currentBlock.height - 1;
            while (this.currentBlock.shape[y][x] === 0) {
                y --;
            }

            let bottomOfBlock = this._matrix[(this._currentBlockY + y + 1) * this.width + this._currentBlockX + x];

            if (bottomOfBlock !== 0) {
                return false;
            }
        }

        return true;
    }

    movingLeft() {
        if (this.isLeftwardMovingOK()) {
            this._currentBlockX = Math.max(0, this._currentBlockX - 1);
        }
    }

    movingRight() {
        if (this.isRightwardMovingOK()) {
            this._currentBlockX = Math.min(this.height - this.currentBlock.width, this._currentBlockX + 1);
        }
    }

    movingDown() {
        if (this.isDownwardMovingOK()) {
            this._currentBlockY = Math.min(this.height - this.currentBlock.height, this._currentBlockY + 1);
        } else {
            let tintedBlock = this._currentBlock.tint();
            for (let y = 0; y < tintedBlock.length; y++) {
                for (let x = 0; x < tintedBlock[0].length; x++) {
                    if (tintedBlock[y][x] === 0) {
                        continue;
                    }
                    let offset = (this._currentBlockY + y) * this.width + this._currentBlockX + x;
                    this._matrix[offset] = tintedBlock[y][x];
                }
            }
            this._currentBlock = null;

            this.checkLines();
        }
    }

    get matrix() {
        let matrix = Array.from(this._matrix);
        let tintedBlock = this.currentBlock.tint();
        for (let y = 0; y < tintedBlock.length; y ++) {
            for (let x = 0; x < tintedBlock[0].length; x ++) {
                if (tintedBlock[y][x] === 0) {
                    continue;
                }
                let offset = (this._currentBlockY + y) * this.width + this._currentBlockX + x;
                matrix[offset] = tintedBlock[y][x];
            }
        }
        return matrix;
    }
}


const EventRotate = "rotate";
const EventLeft = "left";
const EventRight = "right";
const EventNewGame = "new";
const EventInfo = "info";
const EventStopGame = "stop";


class Game {
    constructor(downSpeed=0.35, refreshSpeed=0.1) {
        this.tetris = new Tetris(10, 20);
        this.canvas = null;
        this.canvasView = null;
        this.width = 0;  // canvas width
        this.height = 0;  // canvas height
        this.bgColor = $color("black");
        this.downSpeed = downSpeed;
        this.refreshSpeed = refreshSpeed;

        this.blockSideLength = 0;
        this.baseX = 0;
        this.baseY = 0;

        this.drawTimer = null;
        this.downTimer = null;

        this.playing = false;
    }

    get readyToPlay() {
        return this.canvas !== null && this.canvasView !== null;
    }

    setCanvasView(view) {
        if (this.canvasView === null) {
            let newWidth = view.frame.width;
            let newHeight = view.frame.height;
    
            if (newWidth !== this.width || newHeight !== this.height) {
                this.onSizeChanged(this.width, this.height, newWidth, newHeight);
            }

            view.contentMode = 3; // redraw
            this.canvasView = view;
            this.width = newWidth;
            this.height = newHeight;

            $console.info('canvas view ready');
        }
    }

    setCanvasContext(ctx) {
        if (this.canvas === null) {
            this.canvas = ctx;

            $console.info('canvas context ready');
        }
    }

    onSizeChanged(oldWidth, oldHeight, newWidth, newHeight) {
        $console.info(`canvas view size changed: width=${newWidth}, height=${newHeight}`);
        this.blockSideLength = Math.min(
            newWidth / this.tetris.width,
            newHeight / this.tetris.height
        );
        this.baseX = (newWidth - this.tetris.width * this.blockSideLength) / 2;
        this.baseY = (newHeight - this.tetris.height * this.blockSideLength) / 2;
    }

    _disableTimer() {
        if (this.drawTimer !== null) {
            this.drawTimer.invalidate();
            this.drawTimer = null;
        }
        if (this.downTimer !== null) {
            this.downTimer.invalidate();
            this.downTimer = null;
        }
    }

    newGame() {
        if (this.playing) {
            return;
        }

        this.tetris.clearMatrix();

        this.drawTimer = $timer.schedule({
            interval: this.refreshSpeed,
            handler: () => {
                this._draw();
                // FIXME: any way better?
                this.canvasView.runtimeValue().invoke('setNeedsDisplay');
            },
        });

        this.downTimer = $timer.schedule({
            interval: this.downSpeed,
            handler: () => {
                this.tetris.movingDown();
            }
        });

        this.playing = true;
    }

    stopGame() {
        this._disableTimer();
        this.playing = false;
    }

    _draw() {
        if (!this.readyToPlay) {
            $console.error('canvas not ready');
            return;
        }

        let matrix = this.tetris.matrix;

        // begin drawing
        let blockRect = $rect(this.baseX, this.baseY, this.blockSideLength, this.blockSideLength);

        this.canvas.saveGState();
        for (let y = 0; y < this.tetris.height; y ++) {
            for (let x = 0; x < this.tetris.width; x ++) {
                let block = matrix[this.tetris.width * y + x];

                if (block === 0) {
                    this.canvas.fillColor = this.bgColor;
                } else {
                    this.canvas.fillColor = $color(block);
                }

                blockRect.x = this.baseX + x * this.blockSideLength;
                blockRect.y = this.baseY + y * this.blockSideLength;

                this.canvas.fillRect(blockRect);
            }
        }
        this.canvas.restoreGState();
        // end drawing
    }

    onGameButtonPressed(event) {
        $console.info(`event: ${event}`);
        if (this.readyToPlay) {
            switch (event) {
                case EventNewGame:
                    this.newGame();
                    break;
                case EventStopGame:
                    this.stopGame();
                    break;
                case EventInfo:
                    $ui.alert({
                        message: "Have fun!",
                    })
                    break;
                case EventLeft:
                    if (this.playing) {
                        this.tetris.movingLeft();
                    }
                    break;
                case EventRotate:
                    if (this.playing) {
                        this.tetris.currentBlock.rotate();
                        // block may cross the border
                        while (this.tetris._currentBlockX + this.tetris.currentBlock.width > this.tetris.width) {
                            this.tetris._currentBlockX --;
                        }
                    }
                    break;
                case EventRight:
                    if (this.playing) {
                        this.tetris.movingRight();
                    }
                    break;
                    
                default:
                    $console.warn(`unknown event: ${event}`);
            }
        }
    }
}


function renderViewAndBindGame(game) {
    let gameButtons = [
        ["New Game", EventNewGame],
        ["Stop Game", EventStopGame],
        ["Info", EventInfo],
        ["<=", EventLeft],
        ["Rotate", EventRotate],
        ["=>", EventRight],
    ].map((def) => {
        return {
            btn: {
                text: def[0],
            },
            event: def[1],
        }
    });

    $ui.render({
        props: {
            title: "Tetris",
        },
        views: [
            // first, layout game buttons
            {
                type: "matrix",
                props: {
                    backgroundColor: $color("darkGray"),
                    columns: 3,
                    spacing: 1,
                    itemHeight: 66,
                    template: {
                        views: [
                            {
                                type: "label",
                                props: {
                                    id: "btn",
                                    bgcolor: $color("#474b51"),
                                    textColor: $color("#abb2bf"),
                                    align: $align.center,
                                    font: $font(18)
                                },
                                layout: $layout.fill,
                            },
                        ],
                    },
                    data: gameButtons,
                },
                layout: function(make, view) {
                    make.bottom.left.right.bottom.equalTo(0);
                    make.height.equalTo(66 * 2);
                },
                events: {
                    didSelect: function(sender, indexPath, data) {
                        game.onGameButtonPressed(data.event);
                    },
                },
            },
            // then layout the canvas
            // on the top of input buttons
            {
                type: "canvas",
                props: {
                    backgroundColor: $color("gray"),
                },
                layout: function(make, view) {
                    make.left.right.top.equalTo(0);
                    make.bottom.equalTo($("matrix").top);
                },
                events: {
                    draw: function(view, ctx) {
                        game.setCanvasView(view);
                        game.setCanvasContext(ctx);
                        game._draw();
                    },
                },
            },
        ],
    });
}


function main() {
    let game = new Game();
    renderViewAndBindGame(game);
}

main();
