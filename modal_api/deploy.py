import json
import os
from importlib import import_module

from modal import App

from modal_api.utils import (
    APP_PREFIX,
    APPS_FOLDER,
    ENVIRONMENT,
    ROUTER_FILENAME,
    ModalApp,
    logger,
)


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

    # ignore the router
    output = [app for app in output if app.name != f"{prefix}-router"]

    return output


def deploy_apps(prefix: str, environment: str) -> list[str]:
    # deploy all apps in the APPS_FOLDER
    app_names = []
    app_module_names = os.listdir(APPS_FOLDER)
    for app_module_name in app_module_names:
        app_filename = os.path.join(APPS_FOLDER, app_module_name, "app.py")
        if not os.path.exists(app_filename):
            raise ValueError(f"App {app_module_name} does not have an app.py file")

        # import the app
        import_path = f"{'.'.join(APPS_FOLDER.split('/'))}.{app_module_name}.app"
        app_module = import_module(import_path)
        assert hasattr(app_module, "app") and isinstance(app_module.app, App)
        app: App = app_module.app

        # deploy the app
        app_name = app.name
        app_name_with_prefix = f"{prefix}-{app_name}"
        deploy_shell_command = f"poetry run modal deploy {app_filename} --env {environment} --name {app_name_with_prefix}"
        logger.info(f"Deploying app {app_name} with command {deploy_shell_command}")
        response = os.system(deploy_shell_command)
        if response != 0:
            logger.error(f"Failed to deploy app {app_name}")
            raise ValueError(f"Failed to deploy app {app_name}")

        app_names.append(app_name)
        logger.info(f"Deployed app {app_name} with name {app_name_with_prefix}")

    return app_names


def deploy_router(prefix: str, environment: str):
    deploy_shell_command = f"poetry run modal deploy {ROUTER_FILENAME} --env {environment} --name {prefix}-router"
    logger.info(f"Deploying router with command {deploy_shell_command}")
    response = os.system(deploy_shell_command)
    if response != 0:
        logger.error("Failed to deploy router")
        raise ValueError("Failed to deploy router")
    logger.info("Deployed router")


def stop_apps(apps: list[ModalApp]):
    for app in apps:
        stop_shell_command = f"poetry run modal app stop {app.id}"
        logger.info(f"Stopping app {app.name} with command {stop_shell_command}")
        response = os.system(stop_shell_command)
        if response != 0:
            logger.error(f"Failed to stop app {app.name}")
            raise ValueError(f"Failed to stop app {app.name}")
        logger.info(f"Stopped app {app.name}")


def main():
    # get all currently running modal apps with the given prefix
    existing_apps = get_running_apps(ENVIRONMENT, APP_PREFIX)

    # deploy all apps in the APPS_FOLDER
    deployed_apps = deploy_apps(
        prefix=APP_PREFIX,
        environment=ENVIRONMENT,
    )

    # deploy the router
    deploy_router(
        prefix=APP_PREFIX,
        environment=ENVIRONMENT,
    )

    # delete any existing apps that are not in the APPS_FOLDER
    apps_to_delete = [
        existing_app
        for existing_app in existing_apps
        if not any(
            existing_app.name.endswith(deployed_app) for deployed_app in deployed_apps
        )
    ]
    stop_apps(apps_to_delete)


if __name__ == "__main__":
    main()
