# Contributing <!-- omit in toc -->

> First off, thank you for considering contributing to Loggin'JS. We can make Loggin'JS a great tool!

Loggin'JS is an open source project and we like to receive contributions from our community — you! There are many ways to contribute, from writing tutorials or blog posts, improving the documentation, submitting bug reports and feature requests or writing code which can be incorporated into Loggin'JS itself.

Please note we have a [code of conduct](#code-of-conduct), please follow it in all your interactions with the project.

## Table Of Content <!-- omit in toc -->
- [Where to start?](#where-to-start)
- [Workings](#workings)
- [Versioning](#versioning)
- [Code of Conduct](#code-of-conduct)
	- [Our Pledge](#our-pledge)
	- [Our Standards](#our-standards)
	- [Our Responsibilities](#our-responsibilities)
	- [Scope](#scope)
	- [Enforcement](#enforcement)
	- [Attribution](#attribution)


<!-- 
## Pull Request Process
1. **Add tests** if new functionality is added or if it affects the system.
2. **Update the README.md and Wiki** with details of changes to the interface, this includes new methods, 
   exposed functions and classes, useful file locations, etc....
3. **Increase the version numbers** in any examples files and the README.md to the new version that this
   Pull Request would represent. We automate this using [standard-version](https://github.com/conventional-changelog/standard-version).
4. You may merge the Pull Request in once you have the sign-off of two other developers, or if you 
   do not have permission to do that, you may request the second reviewer to merge it for you.
 -->

## Where to start?

Unsure where to begin contributing to Loggin'JS? 

You can start by looking through these **help-wanted** issues: 
- [Beginner issues](https://github.com/loggin-js/loggin-js/issues?q=is%3Aissue+is%3Aopen+label%3Abeginner-friendly) - issues which should only require a few lines of code, a test or two, or some docs changes. 
- [Help wanted issues](https://github.com/loggin-js/loggin-js/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22+sort%3Acomments-desc) - issues which should be a bit more involved than beginner issues. 

Or take a look at the code :)  
It all starts [here][src], check [`src/node.js`][src:node].

## Workings

Loggin'JS works both in **NodeJS** and the **browser**, although the browser version is still beeing worked on (_help is welcomed_).  
This is important because the project has 2 main files:  
  * one for **node**: [`src/node.js`][src:node] 
  * one for the **browser**: [`src/browser.js`][src:browser]

This was done to be able to export different sets of [Notifiers] and other stuff that might need to be different for the browser or for node. 

One other **important** thing to take into account is that there is some sort of **"Plugin"** thingy going on.  
Can be checked in the files mentioned above.


## Versioning

We use [standard-version](https://github.com/conventional-changelog/standard-version) to manage releasing and CHANGELOG generation (with semver and [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0/)) using [@conventional-changelog/standard-version](https://github.com/conventional-changelog/standard-version).

## Code of Conduct

### Our Pledge

Be welcoming to newcomers and encourage diverse new contributors from all backgrounds. 

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

* The use of sexualized language or imagery and unwelcome sexual attention or
advances
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or electronic
  address, without explicit permission
* Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team at [INSERT EMAIL ADDRESS]. All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at [http://contributor-covenant.org/version/1/4][version]


[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/

[docs:severity]: https://github.com/loggin-js/loggin-js/wiki/Severity
[docs:notifier]: https://github.com/loggin-js/loggin-js/wiki/Notifier
[docs:formatter]: https://github.com/loggin-js/loggin-js/wiki/Formatter
[docs:formatting]: https://github.com/loggin-js/loggin-js/wiki/Formatter
[docs:log]: https://github.com/loggin-js/loggin-js/wiki/Log
[docs:Logger]: https://github.com/loggin-js/loggin-js/wiki/Logger
[docs:channel]: https://github.com/loggin-js/loggin-js/wiki/Logger#channel
[docs:logger-options]: https://github.com/loggin-js/loggin-js/wiki/Logger#options
[docs:helper:logger]: https://github.com/loggin-js/loggin-js/wiki/Helpers#logger
[docs:helper:notifier]: https://github.com/loggin-js/loggin-js/wiki/Helper#notifier
[docs:helper:formatter]: https://github.com/loggin-js/loggin-js/wiki/Helper#formatter
[docs:helper:severity]: https://github.com/loggin-js/loggin-js/wiki/Helper#severity
[docs:customizing]: https://github.com/loggin-js/loggin-js/wiki/logger#customizing
[docs:premades]: https://github.com/loggin-js/loggin-js/wiki/premades
[docs:plugins]: https://github.com/loggin-js/loggin-js/wiki/Plugins

[src]: https://github.com/loggin-js/loggin-js/blob/master/src
[src:node]: https://github.com/loggin-js/loggin-js/blob/master/src/node.js
[src:browser]: https://github.com/loggin-js/loggin-js/blob/master/src/browser.js