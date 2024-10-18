import asyncio

import aiohttp


async def get(session: aiohttp.ClientSession, **kwargs) -> dict:
    # url = "http://0.0.0.0:8000"
    url = "https://wantpinow-jotta-dev--batching-test-fastapi-app.modal.run"
    print(f"Requesting {url}")
    resp = await session.request("GET", url=url)
    data = await resp.json()
    print(data)
    return data


async def main(**kwargs):
    async with aiohttp.ClientSession() as session:
        tasks = []
        for _ in range(256):
            tasks.append(get(session=session, **kwargs))
        htmls = await asyncio.gather(*tasks, return_exceptions=True)
        return htmls


if __name__ == "__main__":
    asyncio.run(main())
