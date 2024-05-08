# Clinician Chatbot

The purpose of this project is designing the endpoints
of a simple chatbot that allows a patient to book
an appointment with a clinician. It uses **Python 3.9.13**
and simple scikit-learn libraries to achieve this
functionality.

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

## To run the frontend

Just go to user folder and type "npm start"
