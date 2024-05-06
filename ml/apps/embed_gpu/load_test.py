from time import time

import lorem
from modal import Cls

from ml.utils import APP_PREFIX, ENVIRONMENT

model = Cls.lookup(
    f"{APP_PREFIX}-gte-base-gpu", "Embedder", environment_name=ENVIRONMENT
)

# first request to startup
model.run.remote("hello world")


def test_batch(batch_size: int):
    print(f"Testing batch of {batch_size} predictions")

    start_time = time()
    batch = [lorem.sentence() for _ in range(batch_size)]
    model.run.remote(batch)
    end_time = time()

    print(
        f"Batch of {batch_size} predictions took {end_time - start_time:.2f} seconds (average {1000 * (end_time - start_time) / batch_size:.2f} ms)"
    )
    print()


test_batch(1)
test_batch(2)
test_batch(4)
test_batch(8)
test_batch(16)
test_batch(32)
test_batch(64)
test_batch(128)
test_batch(256)

# Testing batch of 1 predictions
# Batch of 1 predictions took 0.23 seconds (average 228.07 ms)

# Testing batch of 2 predictions
# Batch of 2 predictions took 0.29 seconds (average 147.44 ms)

# Testing batch of 4 predictions
# Batch of 4 predictions took 0.29 seconds (average 72.82 ms)

# Testing batch of 8 predictions
# Batch of 8 predictions took 0.22 seconds (average 27.71 ms)

# Testing batch of 16 predictions
# Batch of 16 predictions took 0.32 seconds (average 19.78 ms)

# Testing batch of 32 predictions
# Batch of 32 predictions took 0.26 seconds (average 8.15 ms)

# Testing batch of 64 predictions
# Batch of 64 predictions took 0.81 seconds (average 12.64 ms)

# Testing batch of 128 predictions
# Batch of 128 predictions took 0.51 seconds (average 3.96 ms)

# Testing batch of 256 predictions
# Batch of 256 predictions took 0.80 seconds (average 3.14 ms)
