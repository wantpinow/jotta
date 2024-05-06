from time import time

import lorem
from modal import Cls

from ml.utils import APP_PREFIX, ENVIRONMENT

model = Cls.lookup(f"{APP_PREFIX}-gte-base", "Model", environment_name=ENVIRONMENT)

# first request to startup
model.predict.remote("hello world")


def test_batch(batch_size: int):
    print(f"Testing batch of {batch_size} predictions")

    start_time = time()
    batch = [lorem.sentence() for _ in range(batch_size)]
    model.predict.remote(batch)
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
# Batch of 1 predictions took 0.92 seconds (average 921.17 ms)

# Testing batch of 2 predictions
# Batch of 2 predictions took 0.77 seconds (average 384.66 ms)

# Testing batch of 4 predictions
# Batch of 4 predictions took 1.72 seconds (average 430.96 ms)

# Testing batch of 8 predictions
# Batch of 8 predictions took 2.92 seconds (average 365.19 ms)

# Testing batch of 16 predictions
# Batch of 16 predictions took 5.39 seconds (average 336.82 ms)

# Testing batch of 32 predictions
# Batch of 32 predictions took 11.42 seconds (average 356.94 ms)

# Testing batch of 64 predictions
# Batch of 64 predictions took 23.15 seconds (average 361.66 ms)

# Testing batch of 128 predictions
# Batch of 128 predictions took 43.50 seconds (average 339.86 ms)

# Testing batch of 256 predictions
# Batch of 256 predictions took 82.30 seconds (average 321.50 ms)
