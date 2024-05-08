from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

app = FastAPI()

# Allowing CORS for all domains, you can restrict this based on your requirements
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import pandas as pd
from prophet import Prophet 
import matplotlib.pyplot as plt

df = pd.read_csv('data.csv')
df['date'] = pd.to_datetime(df['date'])


train_df = df[:int(len(df)*0.8)]
test_df = df[int(len(df)*0.8):]


def prepare_prophet_data(df, column):
    prophet_df = df.reset_index(drop=False).rename(columns={'date': 'ds', column: 'y'})
    return prophet_df


def predict_with_prophet(df, column):
    prophet_df = prepare_prophet_data(df, column)
    model = Prophet()
    model.fit(prophet_df)
    #future = model.make_future_dataframe(periods=len(test_df))
    future = model.make_future_dataframe(periods=7)

    forecast = model.predict(future)

    #predictions = forecast['yhat'][-len(test_df):]

    next_prediction = forecast['yhat'][-1:]

    return next_prediction



predictions_prophet = {}
for column in ['happiness', 'family_like', 'friends_like']:
    predictions_prophet[column] = predict_with_prophet(train_df, column)

#print(predictions_prophet)

numbers = []
num1_value = predictions_prophet['happiness'] 
num2_value = predictions_prophet['family_like'] 
num3_value = predictions_prophet['friends_like'] 

numbers.append(num1_value)
numbers.append(num2_value)
numbers.append(num3_value)

#print(numbers)

import re

predicted_numbers = []
for sublist in numbers:
    for value in sublist:
        # Convert value to string and find decimal numbers using regex
        predicted_numbers.extend(re.findall(r'\b\d+\.\d+\b', str(value)))

print(predicted_numbers)


####################################################################################################


@app.get("/data")
async def get_data():
    return {"predicted": predicted_numbers}



class Ratings(BaseModel):
    happiness: int
    family_like: int
    friends_like: int

try:
    df = pd.read_csv('data.csv')
except FileNotFoundError:
    df = pd.DataFrame(columns=['date', 'happiness', 'family_like', 'friends_like'])



@app.post("/submit-ratings/")
async def submit_ratings(ratings: Ratings):
    happiness_rating = ratings.happiness
    family_like_rating = ratings.family_like
    friends_like_rating = ratings.friends_like
    
    # Get the current date
    current_datetime = datetime.now()

    formatted_current_date = current_datetime.strftime('%m/%d/%Y')
  
    print(f"Current date: {formatted_current_date}")

    df = pd.read_csv('data.csv')

    # Append 
    new_row = {'date': formatted_current_date, 'happiness': happiness_rating, 'family_like': family_like_rating, 'friends_like': friends_like_rating}
    df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
    
    # Save
    try:
        df.to_csv('data.csv', index=False, encoding='utf-8')
        print("Data saved successfully.")

    except Exception as e:
        print(f"Failed to save data: {e}")

    print(f"Happiness rating: {happiness_rating}")
    print(f"Family like rating: {family_like_rating}")
    print(f"Friends like rating: {friends_like_rating}")
    
    return {"message": "Ratings submitted successfully."}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
