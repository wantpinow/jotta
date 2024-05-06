import lorem
import requests

BASE_URL = "https://wantpinow-jotta-dev--apps-v2-embed-fastapi-app.modal.run/"


lorems = [lorem.sentence() for _ in range(32 * 64)]


def make_long_request():
    response = requests.post(BASE_URL + "run", json=lorems)
    return response.json()


make_long_request()
