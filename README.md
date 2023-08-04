# About this template repository

This template repository is designed for a Salesforce DX project and provides the necessary Github Workflows to support a Salesforce implementation project using the standard Gitflow branching strategy. It can be easily extended to support parallel releases and an extended Gitflow approach.

For detailed information, please refer to [README-dev.md](README-dev.md).

## Github Workflows

To enable automatic deployments during application lifecycle, this repository implements the following Github Workflows:

### Branch develop - on pull request (`.github/workflows/developOnPR.yml`)

This workflow is triggered when Pull Requests are opened against the develop branch. Typically, this occurs when a developer completes their development work and intends to integrate it with the rest of the team. The workflow deploys the content of the source branch, as specified in `manifest/buildfile.json` and related manifest files, to the `build` environment.

In the case of parallel releases, one job like this is required per team.

### Branch develop - on push (`.github/workflows/developOnPush.yml`)

This workflow is triggered when changes are pushed to the develop branch. Usually, this happens when a pull request is merged. The workflow deploys the content of the develop branch, as specified in `manifest/buildfile.json` and related manifest files, to the `qa` environment.

In the case of parallel releases, one job like this is required per team.

### Manual release creation (`.github/workflows/releaseCreateManual.yml`)

This workflow is manually triggered by the release manager. It receives the following input parameters:

- Git ref: The git reference for creating the release. In Gitflow, this is typically a release branch.
- Tag: The name of the tag that will be used to tag the reference and create the release and release artifact. For example, `v1.0.0`.
- Environment: The name of the environment where the build will be tested before generating the release. Typically, this will be a `relbuild` environment.

This workflow performs the following actions:

- Checks out the specified reference.
- Deploys it to the target environment, as specified in `manifest/buildfile.json` and related manifest files.
- Creates a tag, a release, and a release artifact on Github.

### Release creation - on tag push (`.github/workflows/releaseCreateOnPushTag.yml`)

Alternatively, a release can be created by this workflow when a tag with a name matching the pattern `v*.*.*` is pushed to the remote repository. This job performs similar actions to the previous one.

### Release deploy (`.github/workflows/releaseDeploy.yml`)

This job is responsible for deploying a release artifact to a target environment. It is triggered manually and receives the following input parameters:

- Tag: The name of the tag used to create the release.
- Environment: The name of the environment where the release artifact will be deployed.

The workflow downloads the release artifact and deploys it to the target environment, as specified in `manifest/buildfile.json` and related manifest files.

## Github Repository Secrets

You need to configure two [repository secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository):

- `JWT_KEY_NONPROD`: This secret should contain the content of a private key used to sign the self-signed certificate required for the connected app in the target environments. Please refer to [this article](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_jwt_flow.htm) for more information. It is recommended to use the same self-signed certificate for all sandboxes in the pipeline.
- `SVC_CLI_BOT_GITHUB_TOKEN`: This secret should contain a Personal Access Token from the repository's admin account. It allows the Github runner to connect to Github and perform operations such as tag and release creation. Follow [this reference](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#personal-access-tokens-classic) to create a personal access token and then add it as a repository secret.

## Environments

By utilizing [Github environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#about-environments), you can easily segregate environment variables and track which version is deployed in each environment.

Developer environments are unmanaged, meaning the CI solution never directly interacts with them.

This repository's workflows interact with three different environments:

- `build`: This environment is used by the `./github/workflows/developOnPR.yml` workflow to validate developers' pull requests before merging them into the integration branch (usually develop).
- `qa`: This environment is used by the `./github/workflows/developOnPush.yml` workflow to deploy a package that's being worked by the team so functional tests can be executed.

If your project follows plain Gitflow, these environments are sufficient. However, if you are running parallel releases, you will need a pair of `build`/`qa` environments for each team.

In addition to the team environments, the workflows also refer to release environmentd:

- `relbuild`: This environment is used by the `./github/workflows/releaseCreateOnPushTag.yml` workflow to validate a release deploy before generating the release artifact.
- `uat` and `preprod`: These environments are not linked with a branch and can be used by `./github/workflows/releaseDeploy.yml` workflow as a target environment for a release artifact.

You may need to define other managed environments that can receive release artifacts, such as `sit` or a second `uat`. Once these environments are defined, you can use the `./github/workflows/releaseDeploy.yml` job to deploy artifacts to these environments.

For each environment, you must define the following [environment variables](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#environment-variables):

- `CLIENT_ID`: The Client ID or Consumer Key from the connected app in the target sandbox.
- `INSTANCE_URL`: The URL of the target sandbox.
- `USERNAME`: The username used to connect to the target sandbox.

## Contributing to the Repository

If you find any issues or opportunities for improving this repository, fix them! Feel free to contribute to this project by [forking](http://help.github.com/fork-a-repo/) this repository and making changes to the content. Once you've made your changes, share them back with the community by sending a pull request. See [How to send pull requests](http://help.github.com/send-pull-requests/) for more information about contributing to GitHub projects.

## Reporting Issues

If you find any issues with this demo that you can't fix, feel free to report them in the [issues](https://github.com/forcedotcom/sfdx-bitbucket-org/issues) section of this repository.
