import pandas as pd
from prophet import Prophet 
import matplotlib.pyplot as plt

df = pd.read_csv('./data.csv')
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

    next_week_predictions = forecast['yhat'][-1:]

    plt.figure(figsize=(10, 6)) 
    plt.plot(forecast['ds'], forecast['yhat'], label='Forecast')
    plt.xlabel('Date')
    plt.ylabel('Forecasted Value')
    plt.title("Weekly Forecast" + " - " + str(column))
    plt.legend()
    plt.show()

    return next_week_predictions


predictions_prophet = {}
for column in ['num1', 'num2', 'num3']:
    predictions_prophet[column] = predict_with_prophet(train_df, column)

print(predictions_prophet)

numbers = []
num1_value = predictions_prophet['num1'] 
num2_value = predictions_prophet['num2'] 
num3_value = predictions_prophet['num3'] 

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
