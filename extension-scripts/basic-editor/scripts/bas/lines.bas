SCREEN 21
FOR i = 1 to 1000
  x1 = INT(RND() * 1280)
  y1 = INT(RND() * 1024)
  x2 = INT(RND() * 1280)
  y2 = INT(RND() * 1024)
  c = INT(RND() * 256 * 256 * 256)
  LINE (x1, y1)-(x2, y2), c
NEXT i