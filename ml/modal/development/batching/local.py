import asyncio
import logging
import typing

from fastapi import FastAPI, Request

Scope = typing.MutableMapping[str, typing.Any]
Message = typing.MutableMapping[str, typing.Any]
Receive = typing.Callable[[], typing.Awaitable[Message]]
Send = typing.Callable[[Message], typing.Awaitable[None]]
RequestTuple = typing.Tuple[Scope, Receive, Send]

logger = logging.getLogger("uvicorn")


class Batcher:
    def __init__(
        self,
        batch_max_size: int = 128,
        # batch_max_seconds: float = 0.005
        batch_max_seconds: float = 1,
    ) -> None:
        self.batch_max_size = batch_max_size
        self.batch_max_seconds = batch_max_seconds
        self.queue = []
        self.processed: dict[int, RequestTuple] = {}
        self.timeout: float | None = None
        self.running = False

    def start_batcher(self):
        logger.info("Batcher started")
        _ = asyncio.get_event_loop()
        self.batcher_task = asyncio.create_task(self._run_batcher())

    def add_request(self, request_id: int, request: RequestTuple) -> None:
        if not self.running:
            logger.info("Batcher not running, starting it")
            self.start_batcher()
            self.running = True
            logger.info("Batcher started correctly")
        self.queue.append((request_id, request))
        if self.timeout is None:
            logger.info(
                f"First request added, setting timeout to {self.batch_max_seconds} seconds"
            )
            self.timeout = asyncio.get_event_loop().time() + self.batch_max_seconds

    def pop_request(self, request_id: int) -> RequestTuple | None:
        if request_id in self.processed:
            return self.processed.pop(request_id)
        else:
            return None

    async def process_requests(self) -> None:
        # get a batch of requests
        batch = self.queue[: self.batch_max_size]
        logger.info(f"Processing {len(batch)} requests")

        # do hard work
        await asyncio.sleep(0.5)
        results = ["pong 🏓" for _ in range(len(batch))]

        # put results back in requests
        for (request_id, request), result in zip(batch, results):
            request[0]["pong"] = result
            self.processed[request_id] = request

        # remove processed requests from queue
        self.queue = [request for request in self.queue if request not in batch]

        # reset timeout if there are still requests in the queue
        if len(self.queue) > 0:
            self.timeout = asyncio.get_event_loop().time() + self.batch_max_seconds
        else:
            self.timeout = None

    async def _run_batcher(self):
        while True:
            await asyncio.sleep(0)
            if len(self.queue) >= self.batch_max_size or (
                self.timeout is not None
                and asyncio.get_event_loop().time() > self.timeout
            ):
                await self.process_requests()


batcher = Batcher()
# batcher.start_batcher()


class TestMiddleware:
    def __init__(self, app, batcher: Batcher) -> None:
        self.app = app
        self.request_id: int = 0
        self.batcher = batcher

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        self.request_id += 1
        current_id = self.request_id

        self.batcher.add_request(current_id, (scope, receive, send))

        while True:
            request = self.batcher.pop_request(current_id)
            if not request:
                await asyncio.sleep(0)
            else:
                logger.info(
                    f"Request {current_id} processed, forwarding to FastAPI endpoint"
                )
                await self.app(request[0], request[1], request[2])
                await asyncio.sleep(0)
                return
        return await self.app(scope, receive, send)


app = FastAPI()

app.add_middleware(TestMiddleware, batcher=batcher)


@app.get("/")
async def root(request: Request):
    return {"message": request.get("ping", "no pong 😭")}


# poetry run uvicorn ml.modal.development.batching.local:app --host 0.0.0.0 --port 8000 --reload