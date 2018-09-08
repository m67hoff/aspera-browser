---
title: URIs
---

# URIs

## Overview

URI path design is an important part of every API. Paths SHOULD be easy to read and MAY reflect the hierarchy of
underlying models. Paths SHOULD NOT end with a trailing `/`; if a client appends a trailing `/`, the server SHOULD
respond with a `301` status code along with a `Location` header containing the correct URI.

## Version

The first segment of an API's path SHOULD be the major version of the API, prefixed with a lowercase `v`.

## Construction

Following the version segment, each path segment SHOULD be either a resource type or a resource identifier. If denoting
a collection of resources (e.g., `servers` in `/v2/servers`), or serving as a prefix to an identifier (e.g., `servers`
in `/v2/servers/123`), resource types SHOULD be plural. Resource type names MUST be lower snake case. If a resource
type segment contains uppercase characters, the server SHOULD respond with a `404` status and appropriate error response
model.

A path MUST NOT have two concurrent identifiers. Removing one or more segments from the end of a path SHOULD yield a
valid URI. This means that the existence of `/v2/servers/123/hardware_components` implies that `/v2/servers/123`,
`/v2/servers`, etc., are valid.

## Path Hierarchies

When one resource is a child of another resource, its path MAY reflect this hierarchical relationship. However, in many
cases, it may be deemed more appropriate for subordinate resources to have their own top-level collections. Moreover,
a resource's permanent location (represented in its `href` property) SHOULD be under the shallowest collection where it
is represented.

Consider the following path representing ticket `456`, belonging to user `123`: `/v2/users/123/tickets/456`. If it is
acceptable for tickets to be accessible _only_ via the users that own them, this may be a reasonable design. But if
there is ever a need for a collection of _all_ tickets, a collection would exist at, for example, `/v2/tickets` and an
individual ticket at `/v2/tickets/456`.

Additionally, if a collection of all tickets exists, it may be more practical for the collection of tickets belonging to
user `123` to exist at `/v2/tickets?user=123` than at `/v2/users/123/tickets`. It is not forbidden, however, for a
server to implement such collections redundantly.