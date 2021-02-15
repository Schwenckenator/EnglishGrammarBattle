from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build # pylint: disable=import-error
from google_auth_oauthlib.flow import InstalledAppFlow # pylint: disable=import-error
from google.auth.transport.requests import Request # pylint: disable=import-error


# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# The ID and range of a sample spreadsheet.
SAMPLE_SPREADSHEET_ID = '1okniTOvNF_MHrPtzbVgFWVI5TQquTBjNitTRw2kRwZY'
SAMPLE_RANGE_NAME = 'A2:AA1000'
    
class Quiz:
    def __init__(self, japanese, english):
        self.japanese = japanese
        self.english = english
    def toString(self):
        return '{ "%s", "%s" }' % (self.japanese, self.english)

def OrganiseData(data):
    print("-----------------------------")
    print("-----------START-------------")
    print("-----------------------------")

    quizzes = []
        
    for row in data:
        # index = findIndex(categories, row[3])
        japanese = row[2]
        english = row[1]
        quiz = Quiz(japanese, english)
        quizzes.append(quiz)

        print(quiz.toString())

    print("-----------------------------")
    print("------------END--------------")
    print("-----------------------------")

    return quizzes

def writeJson(data):
    tab = "    "
    f = open("testSpelling.json", "w", encoding = 'utf-8')
    lines = []
    lines.append('{\n')

    #Sentences
    lines.append(tab+'"quiz":[\n')

    quizzes = []

    for quiz in data:
        string = ""

        string += tab*2 + '{\n'
        string += tab*3 + '"japanese": "%s",\n' % (quiz.japanese)
        string += tab*3 + '"english": "%s"\n' % (quiz.english.upper())
        string += tab*2 + '}'

        quizzes.append(string)

    lines.append(',\n'.join(quizzes))
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
    result_input = sheet.values().get(spreadsheetId=SAMPLE_SPREADSHEET_ID,
                                range=SAMPLE_RANGE_NAME).execute()
    values_input = result_input.get('values', [])

    if not values_input:
        print('No data found.')
    else:
        run(values_input)

if __name__ == '__main__':
    main()