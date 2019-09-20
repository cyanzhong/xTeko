-- create a table and store its reference in `a'
a = {}
k = "x"
-- new entry, with key="x" and value=10
a[k] = 10
-- new entry, with key=20 and value="great"
a[20] = "great"
print(a["x"]) --> 10
k = 20
print(a[k]) --> "great"
-- increments entry "x"
a["x"] = a["x"] + 1
print(a["x"]) --> 11