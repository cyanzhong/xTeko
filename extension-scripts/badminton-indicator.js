
const leftSide = "leftside"
const rightSide = "rightside"

var leftScore = 0
var rightScore = 0
var steps = []

function render(winner, offset, revoke) {
    if (!revoke) {
        steps.push({ "leftScore": leftScore, "rightScore": rightScore, "winner": winner, "offset": offset })
    }

    if (winner == leftSide) {
        $("indictor").align = $align.left
        $("indictor").text = "🎉"
        leftScore += offset
        if (leftScore % 2 == 0) {
            $("notice").text = "⚠️  右场发球"
        } else {
            $("notice").text = "⚠️ 左场发球"
        }

    } else if (winner == rightSide) {
        $("indictor").align = $align.right
        $("indictor").text = "🎉"
        rightScore += offset
        if (rightScore % 2 == 0) {
            $("notice").text = "⚠️ 右场发球"
        } else {
            $("notice").text = "⚠️ 左场发球"
        }
    } else {
        $("notice").text = "⚠️ 发球方右场发球"
    }

    $("label").text = (leftScore + "  VS  " + rightScore)

}

function revoke() {
    steps.pop()
    if (steps.length > 0) {
        var dict = steps[steps.length - 1]
        leftScore = dict["leftScore"]
        rightScore = dict["rightScore"]
        render(dict["winner"], dict["offset"], true)
    } else {
        leftScore = 0
        rightScore = 0
        render()

    }
}

var view = {
    views: [
        {
            type: "label",
            props: {
                id: "label",
                align: $align.center,
                font: $font(48)
            },
            layout: function (make, view) {
                make.height.equalTo(60)
                make.width.equalTo(view.super.width)
                make.top.equalTo(view.super.top).offset(40)
            }
        },
        {
            type: "label",
            props: {
                id: "indictor",
                align: $align.center,
                font: $font(30)
            },
            layout: function (make, view) {
                make.height.equalTo(60)
                make.left.equalTo(view.super.left).offset(20)
                make.right.equalTo(view.super.right).offset(-20)
                make.top.equalTo(view.super.top).offset(40)
            }
        },
        {
            type: "label",
            props: {
                id: "notice",
                color: $color("#333333"),
                align: $align.center,
                font: $font(16)
            },
            layout: function (make, view) {
                make.height.equalTo(20)
                make.left.equalTo(view.super.left).offset(20)
                make.right.equalTo(view.super.right).offset(-20)
                make.top.equalTo($("label").bottom).offset(20)
            }
        },
        {
            type: "button",
            props: {
                icon: $icon("104", $color("white"), $size(30, 30)),
                font: $font(40)
            },
            layout: function (make, view) {
                make.height.equalTo(66)
                make.width.equalTo(66)
                make.bottom.equalTo(view.super.bottom).offset(-170)
                make.left.equalTo(view.super.left).offset(40)
            },
            events: {
                tapped: function (sender) {
                    render(leftSide, 1)
                }
            }
        },
        {
            type: "button",
            props: {
                title: "撤销",
                font: $font(20)
            },
            layout: function (make, view) {
                make.height.equalTo(66)
                make.width.equalTo(66)
                make.bottom.equalTo(view.super.bottom).offset(-170)
                make.centerX.equalTo(view.super.centerX)
            },
            events: {
                tapped: function (sender) {
                    revoke()
                }
            }
        },
        {
            type: "button",
            props: {
                icon: $icon("104", $color("white"), $size(30, 30)),
                font: $font(14)
            },
            layout: function (make, view) {
                make.height.equalTo(66)
                make.width.equalTo(66)
                make.bottom.equalTo(view.super.bottom).offset(-170)
                make.right.equalTo(view.super.right).offset(-40)
            },
            events: {
                tapped: function (sender) {
                    render(rightSide, 1)
                }
            }
        }
    ]
}

$ui.render(view)
render()


