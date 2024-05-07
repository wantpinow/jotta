from ml.modal.deploy import get_running_apps, stop_apps
from ml.modal.utils import (
    APP_PREFIX,
    ENVIRONMENT,
)


def main():
    # get all currently running modal apps with the given prefix
    apps = get_running_apps(ENVIRONMENT, APP_PREFIX, ignore_router=False)

    # stop all running apps
    stop_apps(apps)


if __name__ == "__main__":
    main()
