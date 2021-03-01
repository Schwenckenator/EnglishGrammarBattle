from __future__ import print_function
import pickle
import os.path
import pandas as pd # pylint: disable=import-error
from googleapiclient.discovery import build # pylint: disable=import-error
from google_auth_oauthlib.flow import InstalledAppFlow # pylint: disable=import-error
from google.auth.transport.requests import Request # pylint: disable=import-error


# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# The ID and range of a sample spreadsheet.
SAMPLE_SPREADSHEET_ID = '1okniTOvNF_MHrPtzbVgFWVI5TQquTBjNitTRw2kRwZY'
SAMPLE_RANGE_NAME = 'A2:AA1000'

RANGES = ['Vocab!A2:AA1000', 'Categories!A2:AA1000', 'Sentences!A2:AA1000']


class Category:
    def __init__(self, name, key):
        self.name = name
        self.key = key
        self.members = []
    
class Quiz:
    def __init__(self, question, correct):
        self.question = question
        self.correct = correct
    
def buildDict(cats):
    lookup = {}
    for i in range(0, len(cats)):
        lookup[cats[i].name] = i
    
    return lookup

def OrganiseData(data):
    print("-----------------------------")
    print("-----------START-------------")
    print("-----------------------------")

    VOCAB = data[0].get('values', [])
    CATEGORIES = data[1].get('values', [])
    SENTENCES = data[2].get('values', [])

    print(VOCAB[0])
    print(CATEGORIES[0])
    print(SENTENCES[0])

    quizzes = []
    categories = []
    # First, generate categories
    for row in CATEGORIES:
        
        # # Are we finished with the categories?
        # if len(row) < 5:
        #     break
        
        cat = Category(row[0], row[1])

        # category = row[5]
        # keyword = row[6]
        subCatStr = ""

        # Are there no subcategories?
        if len(row) >= 3:
            subCatStr = row[2]
            
            if subCatStr != "":
                #remove spaces
                subCatStr = subCatStr.replace(" ", "")
                #split by comma
                subCategories = subCatStr.split(",")

                for subCat in subCategories:
                    key = "%" + subCat + "%"
                    cat.members.append(key)

        # print('%s, %s, %s' % (cat.name, cat.key, subCatStr))

        categories.append(cat)
    
    lookup = buildDict(categories)
    # print("-----------------------------")
    
    #next, find the vocab
    for row in VOCAB:
        # index = findIndex(categories, row[3])
        name = row[3]
        english = row[1]

        index = lookup[name]
        categories[index].members.append(english)
        # print('%s, %s, %s' % (row[0], row[1], row[3]))
    
    # last, organise the quizzes
    for row in SENTENCES:
        maxCharsPerLine = 40
        preferredCharsPerLine = 30

        sentence = row[1]
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

        print("Editing Finished!")
        print(sentence)

        q = Quiz(sentence, row[2])
        quizzes.append(q)

    for cat in categories:
        print(cat.name)

        for member in cat.members:
            print("    "+member)

    print("-----------------------------")
    print("------------END--------------")
    print("-----------------------------")

    organisedData = {
        "categories": categories, 
        "quizzes": quizzes
    }

    return organisedData

def writeJson(data):
    tab = "    "
    f = open("WordScrambleTEST.json", "w", encoding = 'utf-8')
    lines = []
    lines.append('{\n')

    #Sentences
    lines.append(tab+'"quizzes":[\n')

    quizzes = []

    for quiz in data["quizzes"]:
        words = quiz.question.split(" ")
        if(len(words) < 4):
            continue

        string = ""

        string += tab*2 + '{\n'
        string += tab*3 + '"sentence": "%s"\n' % (quiz.question)
        # string += tab*3 + '"correctAnswer":    "%s",\n' % (quiz.correct)

        string += tab*2 + '}'

        string = string.replace('_____', quiz.correct)

        quizzes.append(string)

    lines.append(',\n'.join(quizzes))
    lines.append('\n')
    lines.append(tab+"],\n")
    lines.append('\n')

    # Parts of Speech
    lines.append(tab+'"partsOfSpeech":[\n')
    
    cats = []

    for cat in data["categories"]:
        string = ""
        string += tab*2 + '{\n'
        string += tab*3 + '"name": "%s",\n' % (cat.name)
        string += tab*3 + '"keyword": "%s",\n' % (cat.key)
        string += tab*3 + '"words":[\n'
        
        string += tab*4+'"'
        sep = '",\n'+tab*4+'"'
        string += sep.join(cat.members)
        string += '"\n'

        string += tab*3 + ']\n'
        string += tab*2 + '}'
        
        cats.append(string)

    lines.append(',\n'.join(cats))
    lines.append('\n')
    lines.append(tab+"]\n")


    lines.append("}")


    f.writelines(lines)
    # All finished
    f.close()

def run(values_input):
    data = OrganiseData(values_input)
    writeJson(data)

def main():
    """Shows basic usage of the Sheets API.
    Prints values from a sample spreadsheet.
    """
    global values_input, service
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('sheets', 'v4', credentials=creds)

    # Call the Sheets API
    sheet = service.spreadsheets() # pylint: disable=no-member
    # result_input = sheet.values().get(spreadsheetId=SAMPLE_SPREADSHEET_ID,
    #                             range=SAMPLE_RANGE_NAME).execute()
    
    result_input = sheet.values().batchGet(spreadsheetId=SAMPLE_SPREADSHEET_ID,
                                ranges=RANGES).execute()

    values_input = result_input.get('valueRanges', [])

    if not values_input:
        print('No data found.')
    else:
        run(values_input)

if __name__ == '__main__':
    main()
