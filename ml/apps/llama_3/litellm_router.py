web_image = modal.Image.debian_slim(python_version="3.10")


@app.function(image=web_image)
@modal.web_endpoint(method="POST")
def generate_web(data: dict):
    return Model.generate.remote(data["prompts"], settings=None)
