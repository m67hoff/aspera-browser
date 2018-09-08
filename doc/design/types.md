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

### Return Format

An identifier value MUST be returned as a JSON string.

### Accepted Formats

In request bodies and query parameters, identifier values SHOULD be matched case-insensitively.


## Boolean

The boolean type contains either a `true` or `false` value. In a model, fields of the boolean type MUST NOT be nullable,
but MAY be optional.

### Return Format

A boolean value MUST be returned as the JSON keyword `true` or the JSON keyword `false`.[^json-keywords]

### Accepted Formats

#### Request Bodies

* The JSON keyword `true` or the JSON keyword `false` MUST be considered a valid boolean.[^json-keywords]
* Any other value MUST be rejected with a `400` status code and appropriate error response model if the field is
required and SHOULD be ignored otherwise.

#### Query Parameters

* The strings `true` and `false` MUST be case-insensitively matched as valid booleans.
* Any other string MUST be considered invalid and SHOULD cause the parameter to be ignored.


## Integer

The integer type provides for numeric values which can represented as signed 64-bit integers and which may require
guaranteed precision. In a model, fields of the integer type MAY be nullable and MAY be optional.

### Return Format

An integer value MUST be returned as a JSON number and MUST NOT have a decimal point or use scientific notation.

### Accepted Formats

#### Request Bodies

* Any JSON number value which evaluates to an integer within the service providing an API MUST be considered a valid
integer, but MAY be rejected by other validation rules.
* The `null` JSON keyword MAY be accepted if the field is nullable and MUST NOT be accepted otherwise.[^json-keywords]
* Any other value MUST be rejected with a `400` status code and appropriate error response model if the field is
required and SHOULD be ignored otherwise.

#### Query Parameters

* Any string containing a [valid JSON number](https://tools.ietf.org/html/rfc7159#section-6) value without a fractional
or exponential value MUST be considered a valid integer.
* Any other string containing a valid JSON number (i.e., a string with a fractional or exponential value) MAY be used
for comparative filtering but MUST NOT be considered an exact match.
* The lowercase string `null` MUST be considered a match for an explicitly null value.
* Any other string MUST be considered invalid and SHOULD cause the parameter to be ignored.


## Float

The float type provides for numeric values which cannot represented as signed 64-bit integers and for which guaranteed
precision is not required. In a model, fields of the float type MAY be nullable and MAY be optional.

### Return Format

A float value MUST be returned as a JSON number and MAY have a decimal point or use scientific notation.

### Accepted Formats

#### Request Bodies

* Any JSON number value MUST be considered a valid float, but MAY be rejected by other validation rules.
* The `null` JSON keyword MAY be accepted if the field is nullable and MUST NOT be accepted otherwise.[^json-keywords]
* Any other value MUST be rejected with a `400` status code and appropriate error response model if the field is
required and SHOULD be ignored otherwise.

#### Query Parameters

* Any string containing a [valid JSON number](https://tools.ietf.org/html/rfc7159#section-6) value MUST be considered a
valid float.
* The lowercase string `null` MUST be considered a match for an explicitly null value.
* Any other string MUST be considered invalid and SHOULD cause the parameter to be ignored.


## String

The string type provides for arbitrary strings of characters. Note that the string type referred to here is not
equivalent to a JSON string, as JSON strings are also used to represent dates, date/times, and enumerations.

### Return Format

A string value MUST be returned as a JSON string.

### Accepted Formats

All validation and comparison logic for strings is dictated by a model.


## Date

The date type specifies a particular year, month, and day.

### Return Format

A date value MUST be returned as a JSON string containing a date in the format `YYYY-MM-DD`, matching the `full-date`
format as [specified by RFC 3339](https://tools.ietf.org/html/rfc3339#section-5.6).

In this format:

* `YYYY` is a four-digit year value
* `MM` is a two-digit month value (`01`-`12`)
* `DD` is a two-digit day-of-the-month value (`01`-`31`)

### Accepted Formats

A date value matching the returned format MUST be considered a valid date. All other values MUST NOT be considered
valid. An invalid date in the request body MUST be rejected with a `400` status code and appropriate error response
model if the field is required and SHOULD be ignored otherwise. An invalid date in a query parameter SHOULD cause the
parameter to be ignored.


## Date/Time

The date/time type specifies a particular date, time, and timezone.

### Return Format

A date/time value MUST be returned as a JSON string containing a date/time value in the format `YYYY-MM-DDTHH:mm:ssZ` or
`YYYY-MM-DDTHH:mm:ss.sssZ`, matching the `date-time` format as
[specified by RFC 3339](https://tools.ietf.org/html/rfc3339#section-5.6).

In these formats:

* `YYYY`, `MM`, and `DD` are as [described above](#date)
* `T` is a literal, uppercase "T"
* `HH` is the number of hours since midnight (`00`-`23`)
* `mm` is the number of minutes since the start of the hour (`00`-`59`)
* `ss` is the number of seconds since the start of the minute (`00`-`59`)
* `sss` is the number of milliseconds since the start of the second (`000`-`999`)
* `Z` is a literal, uppercase "Z", indicating no timezone offset (`±00:00` or UTC)

Date/time values SHOULD be returned with the same precision with which they are stored and MUST NOT be returned with
greater precision. I.e., if a date/time value is stored internally with second-precision, it MUST NOT be returned in the
format `YYYY-MM-DDTHH:mm:ss.sssZ` where `sss` is always `000`.

If a date/time value is stored with millisecond-precision, but returned with second-precision, the value MUST be
truncated to second-precision prior to any client-facing operations, such as sorting.

### Accepted Formats

A date/time value which case-insensitively matches either of the valid date/time return formats MUST be considered a
valid date/time value. A date/time value provided by the client SHOULD NOT be required to have the same precision—either
second or millisecond—as the field returns.

Additionally, a date value provided as input SHOULD be permitted to supply an explicit timezone offset in place of a
literal `Z`. This offset MUST be formatted as `±HH:mm` where:

* `±` is a literal `+` or `-`
* `HH` is the number of whole hours by which the timezone differs from UTC
* `mm` is the number of additional minutes by which the timezone differs from UTC

In particularly delicate situations where input must be guaranteed to be correct, input with no timezone offset (i.e.,
input in UTC) MAY be required.

All other values MUST NOT be considered valid. An invalid date/time value in the request body MUST be rejected with a
`400` status code and appropriate error response model if the field is required and SHOULD be ignored otherwise. An
invalid date/time value in a query parameter SHOULD cause the parameter to be ignored.


## Enumeration

Enumerations are a category of types for specified sets of string values. Each individual enumeration type is defined by
the set of valid string values. For example, a model might define a color enumeration allowing only the values `red`,
`blue`, and `green`. Consequently, a field of the color enumeration type could only contain one of those three values.

### Return Format

An enumeration value MUST be a member of the set of values defined for a particular enumeration type. These values MUST
be lower snake case strings and MUST begin with a letter and not a number.

### Accepted Formats

A case-insensitive match for one of the defined values for an enumeration MUST be considered a valid value but MAY be
rejected by other validation rules.

All other values MUST NOT be considered valid. An invalid enumeration value in the request body MUST be rejected with a
`400` status code and appropriate error response model if the field is required and SHOULD be ignored otherwise. An
invalid enumeration value in a query parameter SHOULD cause the parameter to be ignored.


## Array

Arrays are a category of types for collections of same-type values. Each individual array type is defined as a
collection of values of a specific type. For example, a model might specify a field with an [integer](#integer) array
type. Consequently, this field could only contain an array with zero or more [integer](#integer) values.


## Model

To learn about models, see the [Models](models.html) section. Each model—while itself a collection of fields with
types—is also a type.

Because of this, one model can contain a field whose type is another model. For example, consider a Server Model with a
`processor` field. This field's type could be the Processor Model. Consequently, an instance of the Server Model would
contain an instance of the Processor Model in its `processor` field.



[^json-keywords]: [In RFC 7159](https://tools.ietf.org/html/rfc7159#section-3), `true`, `false`, and `null` values are
    called "literal names," but in this document we refer to them as "JSON keywords."
