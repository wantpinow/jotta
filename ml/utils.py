import jsonlines
from pydantic import BaseModel


def write_jsonlines(filename: str, data: list[BaseModel]) -> None:
    if not filename.endswith(".jsonl"):
        raise ValueError("Filename must end with .jsonl")
    with jsonlines.open(filename, mode="w") as writer:
        for item in data:
            writer.write(item.model_dump(mode="json"))


def read_jsonlines[T: type[BaseModel]](filename: str, model: T) -> list[T]:
    return [model.model_validate(item) for item in jsonlines.open(filename)]
