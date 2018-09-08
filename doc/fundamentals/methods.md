---
title: Methods
---

# Methods

There are seven methods that MAY be supported by a resource URI. A summary table of each method's basic attributes is
listed below, followed by detailed guidelines for the use of each method.

## Summary

| ------- | ------------ | ------------- | ---- | ---------- |
| Method  | Request Body | Response Body | Safe | Idempotent |
| ------- | ------------ | ------------- | ---- | ---------- |
| GET     | No           | Yes           | Yes  | Yes        |
| HEAD    | No           | No            | Yes  | Yes        |
| POST    | Yes          | Yes           | No   | No         |
| PUT     | Yes          | Yes           | No   | Yes        |
| PATCH   | Yes          | Yes           | No   | No         |
| DELETE  | No           | Yes           | No   | Yes        |
| OPTIONS | No           | Yes           | Yes  | Yes        |
| ------- | ------------ | ------------- | ---- | ---------- |

## GET

The response to a successful `GET` request SHOULD contain the state of a resource or collection of resources, based on
the request URI. A `GET` request MUST be safe and therefore MUST NOT have side effects[^safe-side-effects]. If a `GET`
request contains a body, the body MUST be ignored and therefore MUST NOT cause an error.[^get-request-body]

## HEAD

The response to a successful `HEAD` request MUST contain the exact set of headers that the response to an
otherwise-identical `GET` request would contain, but MUST NOT include a response body.[^head-behavior] This can be used
for a client to make optimizations if it needs only the information contained in response headers.

If `HEAD`-specific optimizations are not feasible, the handling of a `HEAD` request MAY be implemented internally by
using the same code path as the handling of the corresponding `GET` request and subsequently discarding the response
body. As with a `GET` request, a `HEAD` request MUST be safe and its body MUST be ignored.

## POST

### For Creation

The `POST` URI used to create a resource SHOULD be the same as the `GET` URI for listing resources of the same
kind.[^uri-accepting-post] For example, if `GET /users` lists all users, and users can be created by a client, then
`POST /users` SHOULD create a user.

The response to a `POST` request which successfully and synchronously creates a resource MUST have the status code
`201 Created` and a `Location` header with the URI of the newly-created resource[^post-create-result] and SHOULD
include the created resource in the response body. If including the resource is expensive (in terms of bandwidth or
computation), [preference headers](headers.html#preference-headers) SHOULD be supported to give the client control over
whether the resource is included.

A `POST` request including fields which are not mutable or not recognized SHOULD be rejected by the service with a
`400 Bad Request` status.[^immutable-or-unrecognized-fields]

### Other Uses

Since `POST` requests are the only avenue for handling unsafe and/or non-idempotent operations that don't fit into
another category, a `POST` request MAY invoke such an operation, even if it does not result in the explicit creation of
a resource.

In this case, the request body MAY be permitted to be absent or have a format unrelated to any resource which can be
retrieved using a `GET` request. When such a request is successful, it SHOULD return a `200 OK` status (for a response
including a description of the result) or a `204 No Content` status.[^post-not-for-create]

## PUT

A successful `PUT` request SHOULD replace an existing resource or, in specific cases, create a new resource.

The resource impacted by a `PUT` request MUST be located at the URI used in the request.[^put-uri] For example, if
`PUT /users/bob` updates a user, `GET /users/bob` MUST retrieve the same user.

When a `PUT` request is successfully and synchronously used to replace an existing resource, a status of `200 OK` MUST
be returned.[^put-update-success]

A `PUT` request omitting any mutable fields, or including any fields which are not mutable or not recognized SHOULD be
rejected by the service with a `400 Bad Request` status.

In a scenario where the URI of a new resource can be inferred in advance by the client, a `PUT` request MAY create a new
resource. In this case, if the creation is performed synchronously, the response MUST return a `201 Created`
status.[^put-create-success]

The response to a successful, synchronous `PUT` request SHOULD include the created or replaced resource in the response
body. If doing so is expensive (in terms of bandwidth or computation),
[preference headers](headers.html#preference-headers) SHOULD be supported to give the client control over whether the
resource is included.

## PATCH

A successful `PATCH` request SHOULD update one or more fields on a resource. The resource updated by a `PATCH` request
MUST be located at the URI used in the request.[^patch-uri] Unlike with a `PUT` request, services SHOULD NOT require a
`PATCH` request to reference all mutable fields.

Services MAY support either or both of the below formats for `PATCH` requests:

* [JSON merge patch format (RFC 7396)](https://tools.ietf.org/html/rfc7396)
* [JSON patch format (RFC 6902)](https://tools.ietf.org/html/rfc6902)

The JSON merge patch format (RFC 7396) MAY be supported for requests with a content type of `application/json` or
without an explicit content type. However, if this format is supported at all, it MUST be supported for requests with a
content type of `application/merge-patch+json`.

The JSON patch format (RFC 6902) MAY be supported for requests with a content type of `application/json-patch+json`.
This format MUST NOT be supported for requests of any other content type.

The response to a `PATCH` request which successfully and synchronously updates a resource MUST have a status of `200 OK`
and SHOULD include the updated resource in the response body. If returning the resource is expensive (in terms of
bandwidth or computation), [preference headers](headers.html#preference-headers) SHOULD be supported to give the client
control over whether the resource is included.

A `PATCH` request referencing fields which are not mutable or not recognized SHOULD be rejected by the service with a
`400 Bad Request` status.

## DELETE

A successful `DELETE` request SHOULD remove a resource. The resource deleted by a `DELETE` request MUST be located at
the URI used in the request. If a `DELETE` request contains a body, the body MUST be ignored and therefore MUST NOT
cause an error.[^delete-request-body]


[^safe-side-effects]: It's worth noting that the side effects referred to here are ones visible to the user and
    impacting user data. Side effects such as logging and metric collection are permissible for any request.

[^get-request-body]: RFC 2616 says that request bodies
    [should be ignored](https://tools.ietf.org/html/rfc2616#section-4.3) for methods that do not specify the body as
    part of the request semantics, and the `GET` method's semantics
    [only include the request URI](https://tools.ietf.org/html/rfc2616#section-9.3).

[^head-behavior]: This behavior is [required by RFC 2616](https://tools.ietf.org/html/rfc2616#section-9.4).

[^uri-accepting-post]: RFC 2616 [requires that](https://tools.ietf.org/html/rfc2616#section-9.5) the "posted entity is
    subordinate to that URI in the same way that a file is subordinate to a directory containing it."

[^post-create-result]: These two requirements [are explicit](https://tools.ietf.org/html/rfc2616#section-9.5) in RFC
    2616 for `POST` requests which create new resources.

[^immutable-or-unrecognized-fields]: Per [factors discussed](https://github.ibm.com/Bluemix/api-middle-tier/issues/23),
    this is required behavior for `POST`, `PUT`, and `PATCH`.

[^invalid-field-error]: This behavior is _not_ required by the applicable RFCs or
    [IBM's own API Best Practices](https://pages.github.ibm.com/api-economy/api-best-practices).
    It is, however, recommended by this handbook. By failing when invalid fields are present, an API can immediately
    alert clients to problems with requests, and avoid harder-to-discern bugs.

[^post-not-for-create]: This use case and the success statuses permitted in it
    [are outlined](https://tools.ietf.org/html/rfc2616#section-9.5) in RFC 2616.

[^put-uri]: RFC 2616 requires [says that](http://tools.ietf.org/html/rfc2616#section-9.6) the "PUT method requests that
    the enclosed entity be stored under the supplied Request-URI."

[^put-update-success]: RFC 2616 [requires that](https://tools.ietf.org/html/rfc2616#section-9.6) a successful resource
    update by a `PUT` request return either a `200 OK` status or a `204 No Content` status. Since this handbook requires
    that a successful `PUT` request of any kind return the resource as represented by a `GET` request to the same URI,
    only a `200 OK` status is appropriate in this case.

[^put-create-success]: [As required](https://tools.ietf.org/html/rfc2616#section-9.6) by RFC 2616.

[^patch-uri]: RFC 5789 [states](https://tools.ietf.org/html/rfc5789#section-2), "The PATCH method requests that a set of
    changes described in the request entity be applied to the resource identified by the Request-URI."

[^delete-request-body]: Like `GET` requests, `DELETE` requests do not include the request body in the
    [semantics of the reqest](https://tools.ietf.org/html/rfc2616#section-9.7).
