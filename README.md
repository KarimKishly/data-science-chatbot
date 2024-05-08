# Clinician Chatbot
The purpose of this project is designing the endpoints
of a simple chatbot that allows a patient to book
an appointment with a clinician. It uses **Python 3.9.13**
and simple scikit-learn libraries to achieve this
functionality.

The saved models, in addition to the datasets used,
can be found under the `assets` directory. Several
versions of the dataset can be found due to the
different iterations of data generation that
were performed, as the data was generated
by the team.

The model can be tested by running the
`test_model.py` python file, and the file
can be modified to take different input messages
from the user to be analyzed by the model.

## Dependencies
Run the `install-dependencies.bat` file to create the python
virtual environment and install the required python dependencies
to run the project.
If you already have a virtual environment for your the project,
run
```
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```
while the virtual environment is activated to install the
dependencies.

After creating the virtual environment, a small English NLP
model needs to be installed through the following command:
```
python -m spacy download en_core_web_sm
```

## Running the Server
To run the server, it is sufficient to run the `run-server.bat`
file. By default, the server runs on **port 8000** and 
assumes a virtual environment called `.venv` exists. In case
you want to run the server on a different port and using
a different virtual environment, you can run it
through the uvicorn command
```
uvicorn main:app --port $port_number
```
The Swagger UI to visualize the API endpoints can be accessed
at localhost:8000/docs for the default port 8000.

## Running the Web Interface
The `run-ui.bat` file launches the web interface on port 3000.
The web interface is built on the **React** framework and requires
its dependencies to be installed before launch.

## Bonus: Prophet Model
The prophet model is a time series model to predict future data
based on past data on a day-by-day basis. It can be found under
the `prophet` directory. The prophet service can be started using
the `prophet/run-service.bat` file, while its web interface
can be run using the `prophet/run-web.bat` file.
