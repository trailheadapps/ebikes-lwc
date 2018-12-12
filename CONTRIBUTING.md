## Documentation Guidelines for Samples

These samples are used for on-boarding to Lightning Web Components. Each sample must have a clear learning objective.

* Use JSDoc format for classes, public properties and methods, and functions.
* Document the learning objective on the JavaScript class.
* Spell check your comments and code.
* Err on the side of being verbose.

It's strongly recommended to configure your editor as described below. It will assist with these requirements.

## Prerequisites

Configure the project using the steps in the root [README](README.md). You must authenticate to your org and create a scratch org to run the visual regression tests.

## System Requirements

* [Node 8.x](https://nodejs.org/en/)
* NPM 5.x

## Editor Configurations

Configuring your editor to use our lint and code style rules to simplify your development experience and expedite the pull request review.

### editorconfig

[Configure your editor](http://editorconfig.org/#download) to use our editor configurations.

### Spell Checker

Configure your editor to use your favorite spell checker.

## Useful Development Workflow Commands

### Install Dependencies

```bash
npm install
```

#### Lint Your Changes

```bash
npm run lint
```

#### Test Your Changes

Changes must pass functional unit tests and visual regression tests. Visual regression tests require a scratch org.

```bash
npm run test
```

## Git Workflow

The process of submitting a pull request is straightforward, and
follows the same pattern each time:

1. [Clone the repository](#clone-the-repository)
2. [Create a feature branch](#create-a-feature-branch)
3. [Make your changes](#make-your-changes)
4. [Merge](#merge)
5. [Create a pull request](#create-a-pull-request)

### Clone the Repository

```bash
git clone git@github.com:forcedotcom/ebikes-lwc.git
```

### Create a Feature Branch

```bash
git checkout master
git pull origin master
git checkout -b <name-of-the-feature>
```

### Make Your Changes

Modify the files, lint, build, push, test, and eventually commit your code using the following command:

```bash
git add <path/to/file/to/commit>
git commit
git push origin HEAD
```

Commit your changes using a descriptive commit message. The above commands
commit the files into your feature branch. Keep pushing new changes into the
same branch until you're ready to create a pull request.

### Merge

Sometimes your feature branch gets stale with respect to the master branch,
and requires newer commits on master to be merged into your branch. The
following steps can help:

```bash
git checkout master
git pull
git checkout <feature-branch>
git merge master
```

Don't worry about creating extra merge commits in your pull request. When your
pull request is merged, all commits on the branch are consolidated down to a
single commit.

### Create a Pull Request

If you've never created a pull request before, follow [these
instructions](https://help.github.com/articles/creating-a-pull-request/).
Pull request examples can be found [here](https://github.com/forcedotcom/ebikes-lwc/pulls).
