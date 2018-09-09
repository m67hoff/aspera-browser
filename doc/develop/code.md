---
title: code
---


 the below filters would return only users whose first
name is "John" _and_ last name is "Smith":

`GET /v2/users?first_name=John&last_name=Smith`

### Matching Logic

Guidance for matching logic varies by field type, and is provided under the Accepted Formats heading for each type in
the [Types](../install/uris.md) section.

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
s