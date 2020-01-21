# Contributing <!-- omit in toc -->

> First off, thank you for considering contributing to Loggin'JS. We can make Loggin'JS a great tool!

Loggin'JS is an open source project and we like to receive contributions from our community — you! There are many ways to contribute, from writing tutorials or blog posts, improving the documentation, submitting bug reports and feature requests or writing code which can be incorporated into Loggin'JS itself.

Please note we have a [code of conduct](#code-of-conduct), please follow it in all your interactions with the project.

## Table Of Content <!-- omit in toc -->
- [Where to start?](#where-to-start)
- [Workings](#workings)
- [Versioning](#versioning)
- [Code of Conduct](#code-of-conduct)


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
Check the Code  Of Conuct [here](./CODE_OF_CONDUCT.md).
