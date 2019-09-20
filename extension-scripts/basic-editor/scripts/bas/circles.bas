SCREEN 21
FOR i = 1 to 40
  FOR j = 1 to 30
    CIRCLE (i * 30, j * 30), 10, i * 6 * 65536 + j * 6 * 256,,,,F
  NEXT j
NEXT i