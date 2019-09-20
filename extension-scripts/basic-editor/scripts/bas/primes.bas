PRINT 2; " ";
FOR i = 3 TO 3000 STEP 2
    IN = i
    GOSUB GetLengthOfNumber
    prime = 1
    FOR j = 3 TO i / OUT
        IF i MOD j = 0 THEN prime = 0: EXIT SUB
    NEXT j
    IF prime THEN PRINT i; " ";
NEXT i
END
GetLengthOfNumber:
    A = 1
    WHILE IN > 9
        A = A + 1
        IN = IN / 10
    WEND
    OUT = A + 1
    A = 1
RETURN