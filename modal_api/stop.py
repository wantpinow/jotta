import json
import os

from modal_api.utils import APP_PREFIX, ENVIRONMENT, ModalApp, logger


def get_running_apps(environment: str, prefix: str):
    # get all currently running modal apps with the prefix
    logger.info(
        f"Getting running apps with prefix {prefix} in environment {environment}"
    )
    # get all running apps using the modal CLI
    list_shell_command = f"poetry run modal app list --env {ENVIRONMENT} --json"
    all_apps_dicts = json.loads(os.popen(list_shell_command).read())
    all_apps = [ModalApp.model_validate(app) for app in all_apps_dicts]

    # only return apps with the given prefix
    output = [app for app in all_apps if app.name.startswith(prefix)]

    # only return 'deployed' apps
    output = [app for app in output if app.state == "deployed"]
    logger.info(
        f"Found {len(output)} running apps with prefix {prefix} in environment {environment}"
    )

    return output


def stop_apps(apps: list[ModalApp]):
    for app in apps:
        stop_shell_command = f"poetry run modal app stop {app.id}"
        logger.info(f"Stopping app {app.name}")
        os.system(stop_shell_command)
        logger.info(f"Stopped app {app.name}")


def main():
    # get all currently running modal apps with the given prefix
    apps = get_running_apps(ENVIRONMENT, APP_PREFIX)

    # stop all running apps
    stop_apps(apps)


if __name__ == "__main__":
    main()
