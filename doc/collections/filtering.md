---
title: Filtering
---

# Filtering

Filtering MAY be implemented for collections where clients need to limit the resources returned by specific criteria.

## Basic Filtering

Basic filtering provides the ability for the client to specify one or more filters where each supported field is
required to match a specific value. Any primitive field returned by a collection MAY be supported for filtering.

The query parameter names for a basic filter MUST match the name of a primitive field on a resource in the collection
exactly or a nested primitive field where the `.` character is the hierarchical separator. The only exception to this
rule is for [primitive arrays](#primitive-arrays).

The resulting collection MUST satisfy all filters. For example, the below filters would return only users whose first
name is "John" _and_ last name is "Smith":

`GET /v2/users?first_name=John&last_name=Smith`

### Matching Logic

Guidance for matching logic varies by field type, and is provided under the Accepted Formats heading for each type in
the [Types](../design/types.html) section.

### Primitive Arrays

Primitive arrays (such as `tags`) MAY support a singular form of the field (such as `tag`) as a filter that matches the
resource if the array contains the supplied value. For example, the below filter could return the result following:

`GET /v2/users?tag=swift`

```
{
  "resources": [
    {
      "email": "john.smith@ibm.com",
      "first_name": "John",
      "last_name": "Smith",
      "tags": ["objective-c", "swift", "ruby", "elixir"]
    }
  ]
}
```

## Extended Filtering

The following types MAY support the below extended filters:

### Numeric Fields

Numeric fields MAY support the following comparisons:

* Not equal, by prefixing a value with `not:`
* Greater than, by prefixing a value with `gt:`
* Greater than or equal, by prefixing a value with `gte:`
* Less than, by prefixing a value with `lt:`
* Less than or equal, by prefixing a value with `lte:`
* In a set, by providing a comma-separated list of values
* Not in a set, by prefixing a comma-separated list of values with `not:`

If any integer or float field supports any of the above comparisons, all integer and float fields which the collection
can be filtered on MUST support all of the above comparisons.

### Date and Date/Time Fields

Date and date/time fields MAY support the following comparisons:

* Not equal, by prefixing a value with `not:`
* Greater than, by prefixing a value with `gt:`
* Greater than or equal, by prefixing a value with `gte:`
* Less than, by prefixing a value with `lt:`
* Less than or equal, by prefixing a value with `lte:`
* In a set, by providing a comma-separated list of values
* Not in a set, by prefixing a comma-separated list of values with `not:`

If any date or date/time field supports any of the above comparisons, all date and date/time fields which the collection
can be filtered on MUST support all of the above comparisons.

### Identifier and Enumeration Fields

Identifier and enumeration fields MAY support the following comparisons:

* Not equal, by prefixing a value with `not:`
* In a set, by providing a comma-separated list of values
* Not in a set, by prefixing a comma-separated list of values with `not:`

If any enumeration or identifier field supports any of the above comparisons, all enumeration and identifier fields
which the collection can be filtered on MUST support all of the above comparisons. Identifier and enumeration values
MUST be matched case-insensitively.

### String Fields

String fields MAY implicitly match fields which _contain_ the provided value instead of requiring an exact match. String
field matching also MAY be case-insensitive. Additionally, string fields MAY support prefixing a value with `not:` in
order to invert the default matching logic.

## Advanced Querying

Careful consideration should be given to providing any advanced query syntax. It is preferred that any syntax exposed
not constrain future technology choices to a specific backend technology. For this reason, services SHOULD expose only a
well-specified, standardized query syntax. If the service itself parses queries, care should be taken that it does so in
a robust, secure manner.