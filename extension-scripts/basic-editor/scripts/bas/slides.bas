Slide:
  CLS
  COLOR 14
Row:
  READ a$
  IF a$="---" THEN GOTO Wait
  IF a$="===" THEN
    RESTORE : GOTO Slide
  END IF
  PRINT a$
  COLOR 15
  GOTO Row
Wait:
  IF INKEY$="" THEN GOTO Wait
  GOTO Slide
DATA Sample Slide Deck
DATA * Shows how you could do a slide deck.
DATA * Is pretty BASIC :-)
DATA ---
DATA But Why?
DATA * Why not!
DATA * Slides are fun
DATA ---
DATA Improvements Needed!
DATA * Ability to rewind
DATA * Ability to format the slides
DATA ---
DATA QUESTIONS?
DATA
DATA "    Questions"
DATA ---
DATA ===