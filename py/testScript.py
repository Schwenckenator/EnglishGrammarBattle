

# I'm expecting 2 breaks
sentenceToTest = "Jack went to bed late last night because he studied _____ 1:00 a.m."

print("---------------------------------------------------")
print("------------------Test Script----------------------")
print("---------------------------------------------------")
print("Testing: " + sentenceToTest)
print("Length:" + str(len(sentenceToTest)))

maxCharsPerLine = 40
preferredCharsPerLine = 30

sentence = sentenceToTest
length = len(sentence)
if(length >= maxCharsPerLine):
    lines = length // preferredCharsPerLine + 1
    print("Lines: " +str(lines))
    newLength = length // lines
    print("Length Per Line: " +str(newLength))
    indices = []
    for i in range(1, lines):
         # When we replace the space with \n, it shifts the rest of the letters
         # so we need (+ i - 1)
        indices.append(sentence.find(" ", newLength * i - 1) + i - 1)
    for i in indices:
        sentence = sentence[0:i] + "\\n" + sentence[i+1:]

print("EDIT COMPLETE: " + sentence)

print("---------------------------------------------------")
print("-------------Test Script COMPLETE------------------")
print("---------------------------------------------------")