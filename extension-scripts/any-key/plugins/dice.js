let html =
`
<html>
  <head>
    <style>
      h1 {
        font-family: Arial, Helvetica, sans-serif;
        text-align: center;
      }

      #cube .front {
        transform: translateZ(100px);
      }

      #cube .back {
        transform: rotateX(-180deg) translateZ(100px);
      }

      #cube .right {
        transform: rotateY(90deg) translateZ(100px);
      }

      #cube .left {
        transform: rotateY(-90deg) translateZ(100px);
      }

      #cube .top {
        transform: rotateX(90deg) translateZ(100px);
      }

      #cube .bottom {
        transform: rotateX(-90deg) translateZ(100px);
      }

      .container {
        width: 200px;
        height: 200px;
        position: relative;
        margin: 0 auto 40px;
        border: 1px solid #FFF;
        perspective: 1000px;
        perspective-origin: 50% 100%;
      }

      #cube {
        width: 100%;
        height: 100%;
        top: 100px;
        position: absolute;
        transform-style: preserve-3d;
        transition: transform 2s;
      }

      #cube:hover {
        cursor: pointer;
      }

      #cube div {
        background: hsla(0, 85%, 50%, 0.8);
        display: block;
        position: absolute;
        width: 200px;
        height: 100px;
        border: 2px solid #ab1a1a;
        margin: 0 auto;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 500%;
        text-align: center;
        padding: 50px 0;
      }

      .dot {
        display: block;
        position: absolute;
        width: 30px;
        height: 30px;
        background: #fff;
        border-radius: 15px;
      }

      .front .dot1 { top: 85px; left: 85px; }
      .back .dot1 { top: 45px; left: 45px; }
      .back .dot2 { top: 125px; left: 125px; }
      .right .dot1 { top: 45px; left: 45px; }
      .right .dot2 { top: 85px; left: 85px; }
      .right .dot3 { top: 125px; left: 125px; }
      .left .dot1 { top: 45px; left: 45px; }
      .left .dot2 { top: 45px; left: 125px; }
      .left .dot3 { top: 125px; left: 45px; }
      .left .dot4 { top: 125px; left: 125px; }
      .top .dot1 { top: 45px; left: 45px; }
      .top .dot2 { top: 45px; left: 125px; }
      .top .dot3 { top: 85px; left: 85px; }
      .top .dot4 { top: 125px; left: 45px; }
      .top .dot5 { top: 125px; left: 125px; }
      .bottom .dot1 { top: 45px; left: 45px; }
      .bottom .dot2 { top: 45px; left: 85px; }
      .bottom .dot3 { top: 45px; left: 125px; }
      .bottom .dot4 { top: 125px; left: 45px; }
      .bottom .dot5 { top: 125px; left: 85px; }
      .bottom .dot6 { top: 125px; left: 125px; }
    </style>
    <script>
      var min = 1;
      var max = 24;

      function roll() {
        var xRand = getRandom(max, min);
        var yRand = getRandom(max, min);
        cube.style.webkitTransform = 'rotateX('+xRand+'deg) rotateY('+yRand+'deg)';
        cube.style.transform = 'rotateX('+xRand+'deg) rotateY('+yRand+'deg)';
      }

      function getRandom(max, min) {
        return (Math.floor(Math.random() * (max-min)) + min) * 90;
      }

      window.onload = function() {
        var cube = document.getElementById('cube');
        cube.onclick = roll;
        roll();
      }
    </script>
  </head>
  <body>
    <section class="container">
      <div id="cube">
        <div class="front">
          <span class="dot dot1"></span>
        </div>
        <div class="back">
          <span class="dot dot1"></span>
          <span class="dot dot2"></span>
        </div>
        <div class="right">
          <span class="dot dot1"></span>
          <span class="dot dot2"></span>  
          <span class="dot dot3"></span>
        </div>
        <div class="left">
          <span class="dot dot1"></span>
          <span class="dot dot2"></span>  
          <span class="dot dot3"></span>
          <span class="dot dot4"></span>
        </div>
        <div class="top">
          <span class="dot dot1"></span>
          <span class="dot dot2"></span>  
          <span class="dot dot3"></span>
          <span class="dot dot4"></span>
          <span class="dot dot5"></span>
        </div>
        <div class="bottom">
          <span class="dot dot1"></span>
          <span class="dot dot2"></span>  
          <span class="dot dot3"></span>
          <span class="dot dot4"></span>
          <span class="dot dot5"></span>
          <span class="dot dot6"></span>
        </div>
      </div>
    </section>
  </body>
</html>
`;

$ui.push({
  props: {
    title: $l10n("Dice")
  },
  views: [
    {
      type: "web",
      props: {
        html: html
      },
      layout: $layout.fill
    }
  ],
  events: {
    shakeDetected: () => {
      $("web").eval({"script": "roll()"});
    }
  }
});