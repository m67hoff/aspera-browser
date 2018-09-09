---
title: Types
---

# Types

Types define particular kinds of values. Each field in a model MUST have exactly one type, and fields of some types
cannot be nullable, optional, or mutable. Types also govern how a value from (or for) a particular field can be
represented in JSON and in query parameters.

The following types are described below:

* [Identifier](#identifier)
* [Boolean](#boolean)
* [Integer](#integer)
* [Float](#float)
* [String](#string)
* [Date](#date)
* [Date/Time](#datetime)
* [Enumeration](#enumeration)
* [Model](#model)
* [Array](#array)

## Identifier

The identifier type contains a value which identifies a resource. It MUST uniquely identify a resource among all
resources of the same type, and SHOULD uniquely identify a resource among all resources. Identifier values SHOULD be
GUIDs and SHOULD be selected by the system.

It is not required that all models have identifier values. However, a model which has an identifier value MUST include
it in a field named `id`. Fields other than the `id` field MAY have the identifier type, but such fields MUST refer to
other resources.

Fields of the identifier type MUST NOT be nullable, optional, or mutable.
