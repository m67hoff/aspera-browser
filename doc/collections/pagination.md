---
title: Pagination
---

# Pagination

Pagination MAY be implemented by any collection and is often desirable to provide faster responses and smaller payloads
to clients. Although not all collections are required to provide pagination, it SHOULD be implemented for any collection
where an unbounded number of resources may be present.

If a collection supports pagination, a request to that collection's URL without any query parameters MUST return the
first page of resources.[^pagination-unspecified]

## Pagination and Stable Order

In order to ensure paginated collections have a stable order, the server MUST sort collections on a unique value by
default and, if necessary, supplement any requested sorting with a sort on a unique value (typically a primary
key).[^pagination-and-sorting]

For example, if the client wishes to sort on `last_name`, and the last name is not guaranteed to be unique, the system
could implicitly sort on `last_name` and then `id` (where `id` is unique).

## Pagination Links

In the scenarios specified below, paginated collections MUST return the fields `first`, `previous`, `next`, and `last`
in the collection object. When present, each of these fields MUST contain an object with a `href` field containing a URL
for the first, previous, next, or last page, respectively. The URLs in these fields MUST be complete and begin with a
protocol (e.g., `http://api.bluemix.net/v2/accounts?offset=200&limit=50`).[^pagination-links]

The `first` link SHOULD be included for all pages (including the first and last pages).

The `next` link MUST be included for all pages except the last page, or pages "after" the last page.

The `previous` link SHOULD be included for all pages except the first page. If the pagination implementation makes
paging in reverse expensive or impractical, the `previous` link MAY be omitted.

The `last` link SHOULD be included for all pages (including the first and last pages). If it is expensive or impractical
to provide a `last` page link, the `last` link MAY be omitted.

When any of the above fields are omitted, they should be absent from the response entirely and not included with `null`
values. A request made to a `next` or `previous` URL MUST NOT affect the response of a subsequent request to the same
URL.

## Offset and Limit Pagination

Offset and limit pagination MUST support two query parameters: `offset` and `limit`.

### Offset

The `offset` parameter MUST be used to determine how many resources to skip over, given the order of the collection. If
`offset` is unspecified, the response MUST be identical to the response where `offset` is explicitly provided as `0`.

Any non-negative integer MUST be a valid value for the `offset` parameter. If the supplied `offset` is greater than
or equal to the total number of resources present, the server MUST return an empty collection, and MUST NOT return an
`400`- or `500`-series response code.

If the value provided for `offset` is _not_ a non-negative integer, the server MUST ignore the `offset` parameter.

### Limit

The `limit` parameter MUST determine how many resources are returned, unless the offset and limit are such that the
response is the last page[^last-page] of resources.

If `limit` is unspecified, a default limit MUST be used. The default limit MUST be consistent across all requests to
the collection. It should be determined for each collection based on a reasonable default request time and payload size.
The default limit should be highlighted in the collection's documentation.

A paginated collection MUST impose a maximum value for the limit. The maximum limit MUST be consistent across all
requests to the collection.[^maximum-limit-consistency] The maximum limit should be determined for each collection based
on reasonable maximums for request time and payload size.[^maximum-limit] The maximum limit should be highlighted in the
collection's documentation.

If the value provided for `limit` is not a positive integer or is greater than the maximum limit, the server MUST
ignore the `limit` parameter.

### Additional Response Fields

The fields `offset` and `limit` MUST be included in the collection response. The values for these fields MUST be
integers, and MUST be included whether they were explicitly provided by the user or provided by
defaults.[^response-fields]

A `total_count` field SHOULD also be included in the collection response. If present, this field MUST contain an integer
representing the total number of resources in the collection (accounting for filtering, but not for paging). If it is
expensive or impractical to provide a `total_count` value, the `total_count` field MAY be omitted.

### Example Offset and Limit Pagination Response

```json
{
  "offset": 100,
  "limit": 50,
  "total_count": 232,
  "first": {
    "href": "http://api.bluemix.net/v2/accounts?limit=50"
  },
  "last": {
    "href": "http://api.bluemix.net/v2/accounts?offset=200&limit=50"
  },
  "previous": {
    "href": "http://api.bluemix.net/v2/accounts?offset=50&limit=50"
  },
  "next": {
    "href": "http://api.bluemix.net/v2/accounts?offset=150&limit=50"
  },
  "accounts": [
    ...
  ]
}
```

## Token-Based Pagination

Some systems may require that pagination be done with a token indicating where to start a page rather than an integer
offset. In these cases, token-based pagination MAY be implemented. Token-based pagination MUST support the `start`
query parameter for accepting a token and MAY support the `limit` query parameter.

It is expected that when using token-based pagination, it may be impractical for `previous` and `last` links to be
included in the response payload. If so, these links MAY be omitted.

Token-based pagination can be implemented in a number of ways (including keyset pagination or cursor-based pagination).
However, any implementation of token-based pagination SHOULD attempt to ensure that resources are not duplicated or
omitted[^duplication-or-omission] if all pages in a collection are requested in sequence.

### Start

The `start` query parameter MUST be used to accept a token determining what resource to start the page on or after.
If it is impractical for token generation to be opaque, clients SHOULD still be discouraged from generating their own
tokens. If `start` is unspecified, the logical first page of results MUST be returned. Tokens SHOULD only be provided to
the client embedded in `next`, `previous`, or `last` links, as the `start` value.

### Limit

The `limit` query parameter MAY be used to determine how many resources are returned.

If `limit` is unspecified or unsupported by the collection, a default limit MUST be used. The default limit MUST be
consistent across all requests to the collection. It should be determined for each collection based on a reasonable
default request time and payload size. The default limit should be highlighted in the collection's documentation.

If `limit` is supported, a collection MUST impose a maximum value for the limit. The maximum limit MUST be consistent
across all requests to the collection.[^maximum-limit-consistency] The maximum limit should be determined for each
collection based on reasonable maximums for request time and payload size.[^maximum-limit] The maximum limit should be
highlighted in the collection's documentation.

If the value provided for `limit` is not a positive integer or is greater than the maximum limit, the server MUST
ignore the `limit` parameter.

### Additional Response Fields

If the `limit` query parameter is supported, the `limit` MUST be included in the collection response. The values for
this field MUST be an integer, and MUST be included whether it was explicitly provided by the user or provided by a
default.

A `total_count` field MAY also be included in the collection response. If present, this field MUST contain an integer
representing the total number of resources in the collection (accounting for filtering, but not for paging). If it is
expensive or impractical to provide a `total_count` value, the `total_count` field SHOULD be omitted.

### Accuracy and Consistency

If it is deemed critical that a client be able to retrieve all pages without any duplicated or omitted resources, one
of two approaches MAY be implemented:

1. Pagination MAY be performed across an ephemeral snapshot of the collection made with the first request and referenced
   by the token.[^snapshot-reference] This approach guarantees that all pages in a paginated set represent the resources
   in the collection at the time of the initial request.
2. A paginated collection MAY require that sorting be performed only on immutable fields, while each request is still
   made against live data. This approach guarantees that all resources that existed for the entire duration of
   paginated requests are neither omitted nor duplicated if all pages in a collection are requested in sequence.

### Example Token-Based Pagination Response

```json
{
  "limit": 50,
  "total_count": 232,
  "first": {
    "href": "https://api.bluemix.net/v2/accounts?limit=50"
  },
  "next": {
    "href": "https://api.bluemix.net/v2/accounts?start=3fe78a36b9aa7f26&limit=50"
  },
  "accounts": [
    ...
  ]
}
```

[^pagination-unspecified]: That is, a paged collection should never return all resources if paging parameters are
    unspecified.

[^pagination-and-sorting]: If the records returned in a paginated request have arbitrary ordering, the client has no
    assurance that a particular page corresponds to specific records.

[^pagination-links]: The format of these links is specified by the
    [Paging section of the IBM API Best Practices document](https://pages.github.ibm.com/api-economy/api-best-practices/general/Paging.html).

[^last-page]: The "last page" is defined as the scenario where the sum of the supplied offset and limit is greater than
    the total number of resources in the collection.

[^maximum-limit-consistency]: That is, the maximum limit must not change based on any other request parameters; it may
    vary for different collections, but not for different request parameters on one collection.

[^maximum-limit]: Without a maximum limit, it may be possible for clients to (intentionally or not) inundate a system
    with prohibitively expensive requests. The
    [Paging section of the IBM API Best Practices document](https://pages.github.ibm.com/api-economy/api-best-practices/general/Paging.html)
    also requires a maximum for the limit.

[^response-fields]: These fields are required by the
    [Paging section of the IBM API Best Practices document](https://pages.github.ibm.com/api-economy/api-best-practices/general/Paging.html).

[^duplication-or-omission]: There are two possible exceptions to this rule. First, if the resources are being ordered
    based on mutable fields, and the value of one or more of those fields changes for a particular resource in between
    page requests, it is acceptable for that resource to be duplicated or omitted as an artifact of that change. Second,
    if a resource is added to the collection after the initial request or removed prior to the final request, it is
    acceptable for it to be omitted from the complete set of pages.

[^snapshot-reference]: Note that the token must still refer to a particular page of the snapshot such that multiple
    requests made with the same token yield the same results.
