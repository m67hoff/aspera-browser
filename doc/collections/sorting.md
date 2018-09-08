---
title: Sorting
---

# Sorting

Custom sorting MAY be implemented by any collection, but is likely to be far more useful for paginated collections where
sort order impacts which resources fall on each page. It is OPTIONAL for any collection, paginated or not, to provide
custom sorting.[^custom-sorting-optional]

Collections which provide custom sorting MUST do so via the `sort` query parameter. Depending on usefulness, a
collection MAY support either single-field or multi-field sorting. The documentation for the collection should highlight
any fields which are available for sorting, including first-level primitive fields and primitive fields of embedded
resources. The `.` character MUST be used to delineate sub-resources and sub-fields.

## Single-Field Sorting

Collections that support single-field sorting MUST allow the `sort` parameter to contain any one of the valid sort
fields. For example, the following expression would sort accounts on company name (ascending):

`GET /v2/accounts?sort=company_name`

The client MUST also be able to prepend the field with a `+` or `-` character, indicating "ascending" or "descending,"
respectively. For example, the expression below would sort on the last name of the account owner, in descending
order:

`GET /v2/accounts?sort=-owner.last_name`

If neither of these characters are provided, the sort MUST be done in ascending order.

An unrecognized or unsupported sort field MUST be ignored.

## Multi-Field Sorting

Collections that support sorting on multiple fields MUST allow the `sort` parameter to contain a comma-separated
sequence of fields (each, optionally, with a `+` or `-`) in the same format as described above for single-field sorting.
Sorts MUST be applied to the data set in the order that they are provided. For example, the expression below would
sort accounts first on company name (ascending) and second on owner last name (descending):

`GET /v2/accounts?sort=company_name,-owner.last_name`

An unrecognized or unsupported sort field or a repeated sort field MUST be ignored.

[^custom-sorting-optional]: It is worth noting, however, that paginated collections
    [must provide](./pagination.html#pagination-and-sorting) at least a default sort and supplement any custom sorts to
    ensure a consistent order.