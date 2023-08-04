This file aims to provide guidance to developers on the release management procedures that should be followed. In case of any questions, seek guidance from the responsible architect, and potentially update this file with more information for your next colleague.

## Development Environment

Dev computer should have the following software installed:

- Salesforce CLI
- [Salesforce CLI plugin sf-orgdevmode-builds](https://www.npmjs.com/package/sf-orgdevmode-builds)
- Vlocity Build Tool (if project involves Industries)
- IDX Workbench (if project involvesIndustries)
- Node.js
- NPM
- Visual Studio Code
- The following plugins are helpful:
  - GitLens
  - Salesforce Extension Pack
  - Salesforce Package.xml Generator Extension for VS Code

You will also need access to the remote Github repository and clone the repository to your local machine.

In addition to having Salesforce CLI installed, you should be connected to the source sandbox (development sandbox). You can do this using the Salesforce CLI plugin in VSCode with the command "SFDX: Authorize an Org."

## Org Development Model

Normally, Salesforce Projects uses Org Development Model as dev methodology. Some considerations:

- Each team member must have their own Developer sandbox or scratch org to develop their User Stories – sandboxes/scratch orgs should only be shared when we have a developer paired with an analyst performing only declarative development – in this case the dev is responsible for committing the analyst metadata.
- When using Developer sandboxes, they must have Source Tracked enabled.
- Salesforce CLI will be used to upload/download metadata and datapacks (Salesforce Industries) from/to different sandboxes. For development environment, Salesforce CLI is used by the IDE plugging that the developer uses. For Salesforce Industries datapacks, the IDX Workbench or other plugins can be used.
- The recommended IDE is Visual Studio Code, although there is no opposition to using another tool that the developer prefers, as long as its interaction with the repository is performed.
- All metadata and datapack developments must be committed to the enterprise source code repository. The frequency of commits should be daily, preferably multiple times a day. Commits must be performed on feature branches and validated against a build environment.
- In Org Development Model, the production org remains the source of truth, although the repository has a lot of relevance.
- Each developer is responsible for keeping the package manifest files and release notes up to date/integrated and frequently integrating their development with the development of the rest of the team – as the practice of Continuous Integration teaches us.
- Deployment steps that cannot be automated should be listed in the release notes (README.md file) of the package in the form of pre or post deployment steps. The execution of these steps will never be performed by the developer in the target environment. During development the QA analyst must perform these steps and validate them in a QA environment, and the Release Manager will do this in later environments. The release notes should not be elsewhere like on a word document, confluence, JIRA ticket - it should remain on the repository. The README.md file is an excellent candidate to contain the Release Notes.
- Quality testing should never be performed in development environments. Only on environments appropriate for this. The PO can validate stories in the project's QA environment.
- End user approval must be performed in an environment controlled by the Release Manager.
- The release strategy must be agreed between the Release Manager, the POs and Technical Leaders involved.

## Branching Strategy

Projects running a unique work stream normally will use Gitflow as branching strategy. Here are some considerations:

- In this strategy, the `develop` branch acts as a concentration branch of developments, as so speak, acts as the integrating branch. This branch is where continuous integration is performed.
- Developers, as noted earlier, need to often integrate their work with the work of other developers.
- Developers only commit on `feature` and `hotfix` branches. These branches are integrate with the main ones (`develop`, `release` and `main`) via Pull/Merge Request, which is a natural quality gateway, providing the ability to a Technical Lead / Release manager to review the work.
- In case of bugfixes on a release, these must also be made in separate branches (`feature` branches) and integrated via Pull/Merge Request with the `release` branch. Later these bugfixes must be merged with develop as well.
- Integrations naturally can result in conflicts – which must be resolved by the developer himself. Remembering that conflicts only happen when there are versions of the same file at the same point and git cannot perform the automatic merge.
- Conflicts are resolved on `feature` branches. So, if a Pull/Merge Request is showing conflict, this is an indication that the dev is not integrating their code - therefore CI is not happening.
- Conflicts can and should be reduced in size by planned distribution of activities and continuous integration. A planned distribution of activities is to assign user stories that are of the same topic to the same developer.
- When bringing develop metadata to a `feature` branch (`git merge develop`), even if git does not point out a conflict, it is important to review the files that were auto-merged by git - since metadata are XML files, it could happen a defective auto-merge.
- Although it does not involve a branching strategy, there is a caveat to be noted regarding development environments: integrating your work with other developers in your local repository will not automatically update your development environment - whether you are using sandbox or scratch org. It is also necessary to carry out the back promotion of the package, which means to deploy/push the changes promoted by the other devs into your development environment.

Considerations for teams running multiple paralell streams:

- In cases where there are multiple teams with different release schedules, this branching strategy needs to be extended.
  The idea at this point is that branch `develop` will become the integration branch between the teams and that each team will have it's own `develop-team` branch to integrate the code of the team members.
- In these scenarios, the `develop` and `feature*` branches need to be mirrored for each team;
- The `develop` branch continues to exist, playing an important role for the workflow;
- The process that developers within the Squad need to perform is exactly the same, but now the team will have its own develop branch to integrate their code internally first - the naming pattern for this branch will be `develop-<team>`;
- So the `develop-<team>` branch becomes the team's integration branch, while the standard `develop` becomes the cross-team integration branch;
- As soon as any release is opened, a merge signal must be triggered for all other teams to merge the release in their own baseline (`develop-<team>`);
- The team that generated the release supports the merge, but the responsibility for performing the merge lies with the other teams;
- The smaller the release is, easier the merge is done and with less chance of conflicts.
- Conflicts only happen when the same file is updated by both teams at the same point.
- When merging, even if git does not point out a conflict, it is important to review the files that were auto-merged by git - since metadata are XML files, it could happen a defective auto-merge.
- The merge, which is fundamental, is also overhead for the squad, so when it needs to merge, it must consume the team's capacity.
- Bugfixes and hotfixes also trigger merge notification, which can be done more sparingly and in batches.

## Gitflow & Environment Map

Considerations for teams working on a unique work stream / release calendar:

- Opening a pull/merge request to integrate code with the rest of the team (`feature` -> `develop`) triggers a build against the `build` environment. The purpose of this build is to validate the deploy, possible dependencies and run unit tests. The merge of the pull/merge requests (therefore versioning develop branch) triggers the deploy against the QA environment, where functional tests are done.
- The deploy in `build` env is a test that indicates the quality of the package, although it is recognized that in some situations this test can fail as there are several merge requests deploying in this environment – which can make the environment temporarily incompatible with a feature until it's merged. Anyway, this process already gives inputs of the quality of the metadata package that is being worked on and even not meeting 100% of the scenarios it is a valid process. - To test pull/merge requests entirely separately, we would need to dynamically create scratch orgs during pipeline execution – this will only be possible when the Scratch Org Snapshot feature is available.
- On pull/merge request aceptance / merge, a deploy to `qa` environment is triggered.
- `dev`, `qa` and `build` environments are very unstable - even the QA environment can receive several releases per day, so they are managed by the team and not by the Release Manager, including QA environment;
- From uat onwards, which are controlled environments, all deployment must be done by a Release Manager, with support from the team that was responsible for the development of this release. In these cases, the artifact does not need to be generated at deploy time - it could have been generated and stored in the artifact repository.
- After the release branch is opened, the release notes, manifest(s) and pipeline files must be cleaned up in the development branch (`develop`) – considering that the development of a new package will start. The Release Manager will be responsible for doing this maintenance on develop – the developers involved need to integrate with this commit.
- The release opening process involves deploying the branch in the `release build` environment - to validate the deploy in a more stable environment - and artifact generation. From then on, what is deployed in subsequent environments is the artifact, and no longer the branch.
- Some environments on the pipeline do not have their lifecycle linked to a branch, such as the UAT environment. For these cases, deploy scripts will be prepared but triggered on demand. The Release Manager is responsible for performing these deploys.
- In general, it is good practice to refresh Stage/Preprod environment before a release launch, thus ensuring alignment of both metadata and sandbox version. The exception to this is for applying hotfixes where a more quick process is usually required.
- Manual steps should be kept to the minimum possible levels, and only performed when there is no API support to automate it nor scripting that could be done. Exceptions to this rule must be discussed with the Release Manager.
- Normally the installation of the artifact in stage / production environment is a responsibility of the customers Release Manager.
- Before installing the artifact in the production environment, the execution of the pre-deployment steps must be performed by the customers Release Manager, which will also perform the post-deployment, smoke test and environment release steps. The installation of the package in production must always be done by the pipeline.
- After production launch, the repository is synchronized by merging the `release` branch to `main`.
- Any application in production will need support from the technical leader of the team that developed this package and this will only be done after the artifact has been installed in uat and in preprod/stage.
- We do not recomment to try to achieve automatic rollbacks on Salesforce projects. Deployed issue mitigations, if necessary, should be evaluated during the production window between the Release Manager and the technical project lead and are generally treated as hotfixes.

In case of running multiple paralell streams, here are some considerations:

- Just as the `develop` and `feature*` branches are mirrored, the team environments (sandboxes) also need to be mirrored: dev, build, and qa;
- The merge signal, explained earlier, also affects team environments. After the repository has been merged, the following actions must take place:
  - Back promotion of the release in the team's environments - that is, applying the release in the environments. This can also be achieved, if the release has already gone into production, by refreshing the team environments: devs, build and qa;
  - Deploy the already merged `develop-<team>` branch - reapplying the package that is under development in the unmanaged environments;
- Deploying the release that was opened in the team's environments is needed to ensure that new features that will be developed do not overwrite the features that the open release is deploying. After all, merging the repository alone doesn't change the state of the environments/sandboxes. This process also helps to ensure that the build/deploy of the `develop-<team>` branch (already merged) will not fail in environments that already have the release - such as `uat`.
- The merge, which is fundamental, is also overhead for the squad, so when it needs to merge, it must consume the team's capacity.
- In this sense, data seeding automation scripts for sandbox are fundamental to give teams productivity. Salesforce Data Move Utility is an extremely useful tool in developing these scripts.

## Understanding important release files

Some files have special importance in the assembly of a release. This section briefly explores the responsibility of each special file.

### Files: `.github/workflows/*.yml`

These files, with few exceptions, should not be versioned by developers. The responsibility for maintaining them lies with the Release Manager. These workflows files communicates to GitHub the structure of the job that will be used as an automation tool for the build.

### Arquivo: `manifest/buildfile.json`

Each release is a different release. It may be necessary to perform deployments that resolve dependencies before deploying the main package. It may be necessary to apply Salesforce Industries/Vlocity datapacks before or after the package. It may be necessary to run APEX scripts that will create reference data before or after the main package. All these nuances are captured by the file located at `manifest/buildfile.json`.

For more information regarding this file structure, please see the [plugin sf-orgdevmode-builds README.md](https://github.com/tiagonnascimento/sf-orgdevmode-builds/)

## Files: `manifest/package*.xml`

These files contain all the metadata that will be deployed by the script. If necessary, more than one `package.xml` can be created by the project and specified as separate builds in the `buildfile.json` file. This is typically required when dependencies need to be resolved before the main deployment. The idea is to have the fewest possible `package.xml(s)` in any release, as this will make the deployment process more agile. This file is usually located at `manifest/package.xml`.

Each build will deploy all the metadata listed in the manifest files again. This can result in multiple versions of the same component being generated, such as flows versions, even if it hasn't been changed in the versioning that triggered the build. This is an undesired consequence but also very difficult to avoid, and it is practically inconsequential. If these components use references to elements that only exist after the package deployment, it may be necessary to perform a fix immediately after deployment to adjust these references and align the repository content with the definitions in the target sandbox.

## Files: `manifest/sfi-package.yaml`

These files serve the same purpose as the `package.xml` file for deploying Salesforce Industries (previously known as Vlocity) datapacks. The deployment method used by the project is manifest-based, so the datapacks that need to be installed must be explicitly listed.

Each build will deploy all the listed datapacks again, which can result in generating multiple versions of the same component, even if it hasn't been modified in the versioning that triggered the build. This is an unintended consequence but also very difficult to avoid, and it is practically harmless.

For this type of deployment to work, the environment in which the plugin is executing needs to have installed [Vlocity Build Tool CLI](https://github.com/vlocityinc/vlocity_build).

Here is an example of the sfi-package.yaml file:

```yml
projectPath: .
expansionPath: ./vlocity/
manifest:
  - DataRaptor/GetAccDetails
  - DataRaptor/GetAccountBalanceInfo
  - DataRaptor/TransformCashBalance
  - VlocityCard/ReviewBalanceMovements
  - VlocityCard/showAdvanceBalanceMovement
  - VlocityCard/showCashBalanceMovement
  - VlocityCard/showTermBalanceMovement
delete: true
activate: true
compileOnBuild: true
maxDepth: -1
continueAfterError: true
useAllRelationships: false
supportHeadersOnly: true
supportForceDeploy: true
```

The file properties can be changed whenever needed to address requirements for the release being worked.

## Destructive changes

When it is necessary to remove metadata from the org during deployment, destructive changes can be used. Destructive changes should always be placed in a directory containing a boilerplate `package.xml` file (an empty package.xml file - a requirement imposed by the Metadata API) and another file named `destructiveChanges.xml`. In this file, the metadata that needs to be deleted is listed as if it were a regular `package.xml`. In the example above, the deployment will delete the listed metadata that is in `manifest/preDestructive/destructiveChanges.xml`, then perform the deployment based on the specified manifest file, and finally delete the metadata listed in `manifest/postDestructive/destructiveChanges.xml`.

### Keeping the Development Sandbox Updated

The pipelines / Github Workflows use the `sf-orgdevmode-builds` plugin to deploy to managed environments. This plugin is available to everyone, which means any developer can use the same script that the pipeline uses to maintain the managed environments while keeping their own sandbox updated.

To run the build in your sandbox, you only need to execute the following commands while in the project's root directory and already authenticated with SFDX in the development sandbox:

```
sf builds deploy --buildfile manifest/buildfile.json --target-org <YOUR_SANDBOX_ALIAS>
```

This script will look at the build structure, the `manifest/buildfile.json` file, and apply the builds in the sequence specified in this file to your sandbox. It follows the same procedure as the pipeline.

### Downloading Profiles and Translations

The key to performing automatic deployments of profiles and translations lies not in the deployment itself but in the retrieval of metadata. To correctly download permissions that are part of a profile, two things are required:

- Consistency: the entire team performing the procedure in a similar manner.
- Context: the Metadata API understands the context in which a retrieval is being done and will only return the profile permissions if the specific permission is explicitly listed. For example, an operation `sf project retrieve start -x manifest/retrieve/package-retrievePermissions.xml` will only download Field Level Security permissions if the field is explicitly listed in the `package-retrievePermissions.xml` file. Wildcards (\*) do not work - the metadata must be explicitly listed!

Once permissions are retrieved consistently and the profile metadata is properly versioned, deploying permissions becomes easier.

Translations follow the same principle in terms of providing context to the Metadata API.

However, the recommendation is to use Permission Sets - which have a much more similar characteristic to other types of metadata - to store permissions that can be fulfilled by Permission Sets. Profiles should only be used for permissions that can only be configured via Profiles.

## Roles and Responsibilities

### Developers

- Set up the development environment.
- (Optional) Request the Release Manager to update/refresh the development sandbox.
- Create the feature branch.
- Periodically update the local repository and integrate your code with the team's code already in develop.
- Develop user stories according to requirements.
- For code, develop and ensure automated test coverage for customizations is at least 75%.
- In the case of declarative development, synchronize your local environment with the metadata of the sandbox.
- Always commit metadata updates (code or declarative) to the feature branch and push the commit to the remote repository.
- Maintain the release notes (`README.md`) with the package content, pre/post-deployment instructions, and smoke test instructions.
- Keep the deployment manifests (`package*.xml`, `sfi-package*.yaml`, and `buildfile.json`) updated with the metadata and datapacks that have been changed during implementation and merged with the develop version.
- After completing the user story, create a pull request to `develop-<team>`.
- Collaborate with QA in the package deployment process to the testing environment.
- Collaborate with the Release Manager in the package deployment process to subsequent environments in the pipeline.
- Collaborate with the Technical Architect/Technical Lead in the merge process with other releases.

### QA

- Review the Release Notes (`README.md`) in Pull Requests coming from feature branches to `develop` and perform the indicated pre/post-deployment steps manually.
- If necessary, reject the pull request requesting a better description of these manual steps.
- Collaborate with the Technical Lead/Technical Architect in approving the Pull Request.

### Squad Technical Leads / Technical Architects

- Align with the Release Manager and Product Owners on package content and production dates.
- Review Pull Requests coming from feature branches to develop - review release notes, manifest files, automation scripts, and package content.
- Collaborate with QA to apply pre/post-deployment steps if required in the QA environment.
- Collaborate with the Release Manager in opening release branches and applying pre/post-deployment steps if required in subsequent environments.
- Support the package deployment process.

### Release Manager

- Communicate and enable teams to follow the practices outlined in this document.
- Maintain functional pipelines and automations.
- Keep the environment map up to date.
- Define the release content and target dates in collaboration with the Product Owners and Technical Leads.
- Review the state of the develop branch and create release branches on predetermined dates - validate the state of the release notes (`README.md`), manifest files (`package*.xml`, `sfi-package*.yml`, and `buildfile.json`), and pipelines.
- Apply releases to the staging, QA, and production environments, including executing pre/post-deployment steps as specified in the release notes.
- Signal and communicate the need for merge as soon as a release branch is created (trigger for other Squads to merge with develop).
- Approve pull requests made for bug fixes to release branches.
- Create pull requests and merge them into the main branch during production deployment windows.
- Collaborate with developers/technical leads if any deployment issues are encountered.
- Perform smoke tests for each deployment based on the checklist prepared by the developer (specified in the release notes).
- Publish the release of the environment.
- Maintain deployment automation files as necessary.
- Ensure that release management practices are followed by developers.
- Develop and continuously improve automation scripts.
- Define the sandbox refresh calendar with other stakeholders and communicate it to the impacted parties.
- Perform sandbox refreshes and possible application of packages not yet in production according to the agreed-upon calendar.
