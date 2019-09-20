
function HEX2HSV(date) {
    var reg = /\w{2}/g
    HEX = (date).match(reg)
    R = Math.ceil("0x" + HEX[0], 16)
    G = Math.ceil("0x" + HEX[1], 16)
    B = Math.ceil("0x" + HEX[2], 16)

    let max_ = Math.max(R, G, B)
    let min_ = Math.min(R, G, B)

    V = max_ / 255 * 100
    S = max_ === 0 ? 0 : (max_ - min_) / max_ * 100

    if (max_ == min_) {
        H = 0
    } else if (max_ === R && G >= B) {
        H = 60 * (G - B) / (max_ - min_)
    } else if (max_ === R && G < B) {
        H = 60 * (G - B) / (max_ - min_) + 360
    } else if (max_ === G) {
        H = 60 * (B - R) / (max_ - min_) + 120
    } else if (max_ === B) {
        H = 60 * (R - G) / (max_ - min_) + 240
    }

    H = Math.ceil(H)
    S = Math.ceil(S)
    V = Math.ceil(V)
    rgb = [R, G, B]
    hsv = [H, S, V]
    return [hsv, rgb]
}

function HSV2HEX(h, s, v) {
    var h = h > 359 ? 0 : h
    var s = s / 100
    var v = v / 100

    h1 = Math.floor(h / 60) % 6
    f = h / 60 - h1
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * (1 - (1 - f) * s)

    if (h1 === 0) {
        r = v
        g = t
        b = p
    } else if (h1 === 1) {
        r = q
        g = v
        b = p
    } else if (h1 === 2) {
        r = p
        g = v
        b = t
    } else if (h1 === 3) {
        r = p
        g = q
        b = v
    } else if (h1 === 4) {
        r = t
        g = p
        b = v
    } else if (h1 === 5) {
        r = v
        g = p
        b = q
    }
    r = r * 255
    g = g * 255
    b = b * 255
    RGB = [Math.ceil(r), Math.ceil(g), Math.ceil(b)]
    HEX = RGB2HEX(r,g,b)

    return [HEX, RGB]
}

function RGB2HEX(r, g, b) {
    r_ = Math.ceil(r).toString(16)
    g_ = Math.ceil(g).toString(16)
    b_ = Math.ceil(b).toString(16)
    h = r_.length < 2 ? "0" + r_ : r_
    e = g_.length < 2 ? "0" + g_ : g_
    x = b_.length < 2 ? "0" + b_ : b_

    HEX = (h.toUpperCase()+ e.toUpperCase()+x.toUpperCase())
    return HEX
}

module.exports = {
    HEX2HSV : HEX2HSV,
    RGB2HEX : RGB2HEX,
    HSV2HEX : HSV2HEX
}