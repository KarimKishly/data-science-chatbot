import spacy
from datetime import datetime, timedelta
from services.weekday import Weekday


def extract_and_convert_date(sentence, day_part: datetime = datetime.fromtimestamp(0)):
    nlp = spacy.load("en_core_web_sm")  # Load a small English NLP model
    doc = nlp(sentence)


    text: str = None
    time_text: str = None
    date_part = day_part

    for entity in doc.ents:
        if entity.label_ == "DATE":
            text = entity.text
        if entity.label_ == "TIME":
            time_text = entity.text

        if date_part == datetime.fromtimestamp(0):
            if "next" in text.lower():
                today = datetime.today()
                weekday_text = text.lower().split()[1]
                target_weekday = Weekday[weekday_text.upper()]
                offset_days = (target_weekday.value - today.weekday()) % 7
                date_part = today + timedelta(days=offset_days + 7)
                date_part = date_part.replace(hour=0, minute=0, second=0, microsecond=0)
            else:
                today = datetime.today()
                if "this" in text.lower():
                    weekday_text = text.lower().split()[1]
                else:
                    weekday_text = text.lower()
                target_weekday = Weekday[weekday_text.upper()]
                offset_days = (target_weekday.value - today.weekday()) % 7
                date_part = today + timedelta(days=offset_days)
                date_part = date_part.replace(hour=0, minute=0, second=0, microsecond=0)

        if time_text:
            time = time_text.upper().split(' ')
            ampm = time[1]
            if ampm == 'AM':
                hour = int(time[0])
            else:
                hour = int(time[0]) + 12
            date_part = date_part.replace(hour=hour, minute=0, second=0, microsecond=0)

    return date_part

if __name__ == '__main__':
    sentence = 'I am available'
    print(extract_and_convert_date(sentence).strftime("%A, %B %d, %Y at %I:%M%p"))