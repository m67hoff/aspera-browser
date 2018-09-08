---
title: Compatibility
---

# Compatibility

Since most changes occur within a major version, and therefore must be "compatible changes," much care must be put into
deciding whether a particular change can be considered "compatible." Some of these decisions must be made individually
for services, but should be considered compatible or incompatible uniformly.

## Compatible Changes

* Adding a new path which previously would have resulted in a `404` status MUST be considered compatible.
* Adding a new method which previously would have resulted in a `405` status MUST be considered compatible.
* Adding a new field to a model MUST be considered compatible.
* Expanding the acceptable range for a numeric field SHOULD be considered compatible.

## Incompatible Changes

* Removing a previously-supported path MUST be considered incompatible.
* Removing a previously-supported method from an existing path MUST be considered incompatible.
* Removing a field from a model MUST be considered incompatible.
* Narrowing the acceptable range for a numeric field SHOULD be considered incompatible.
* Adding a possible value to an enumeration SHOULD be considered incompatible.