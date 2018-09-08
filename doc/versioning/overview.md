---
title: Versioning
---

# Versioning

## Semantic Versioning

Services SHOULD have a major, minor, and patch version, following the industry conventions on semantic versioning:

> Given a version number MAJOR.MINOR.PATCH, increment the:
>
> MAJOR version when you make incompatible API changes,
> MINOR version when you add functionality in a backwards-compatible manner, and
> PATCH version when you make backwards-compatible bug fixes.

This version SHOULD be exposed in the `Server` response header.

## Major Version

The major version of a service MUST be represented in its URL path, [as detailed](../design/uris.html#version) in the
URI section. Multiple major versions of a service MAY be deployed in the same environment, but each major version MUST
have only one minor/patch version deployed in a particular environment.