---
title: Status Codes
---

# Status Codes

HTTP has a set of standard status codes. These fall into five categories:

* Informational: `1xx`
* Success: `2xx`
* Redirection: `3xx`
* Client Errors: `4xx`
* Server Errors: `5xx`

## Informational: 1xx

Code | Meaning  | Description
-----|----------|------------
100  | [Continue](https://tools.ietf.org/html/rfc7231#section-6.2.1) | The server MAY respond with this status code if the client sends a preliminary request (sometimes called a "look-before-you-leap" request); this code indicates the client should resend the request, in full (including the previously omitted representation). This code MUST NOT be returned unless the `Expect` request header was provided with a value of `100-continue`.

## Success: 2xx

Code | Meaning  | Description
-----|----------|------------
200  | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | This code MUST be returned for successful requests not covered by a more specific `2xx` code. The response body to return depends on the method; see [Methods](../fundamentals/methods.html) for more details.
201  | [Created](http://tools.ietf.org/html/rfc7231#section-6.3.2) | This code MUST be returned when a new resource was successfully created in a synchronous manner. When returning this code, the server MUST also return a `Location` header with the URI of the created resource. Depending on the `Prefer` header, a representation of the resource MAY be included in the response body; see the [POST section](../fundamentals/methods.html#post) for more details.
202  | [Accepted](http://tools.ietf.org/html/rfc7231#section-6.3.3) | This code MUST be returned when the request will be processed asynchronously, and may be rejected when it's actually processed. A resource representing the status of the request SHOULD be included in the response, and the response `Location` header SHOULD include a URI where this same status may be retrieved so that the client may stay up-to-date.
204  | [No Content](http://tools.ietf.org/html/rfc7231#section-6.3.5) | This code MUST be returned when the server successfully processed the request and is not returning any content. This MAY be used for `DELETE` requests or requests where the client includes a `Prefer` header containing `return=minimal`. It MAY occasionally be used for `PUT` or `POST` requests where it is impractical to return a resource representation because of size or cost, or for `GET` requests where a resource exists but has an empty representation.
206  | [Partial Content](http://tools.ietf.org/html/rfc7233#section-4.1) | This code indicates that the server is delivering only part of the resource. Servers MUST use this when enabling the client to resume interrupted downloads, or to split a download into multiple simultaneous streams.[^content-range]

### Requests Requiring No Action

If a request attempts to put a resource into a state which it is already in, the status code SHOULD be in the `2xx`
range. In other words, the status code SHOULD match what would be given if a change had been required.

This may not always be practical, however. If a client makes a `DELETE` request for a resource that has already been
deleted, the server is not required to maintain a record of the deleted resource and MAY respond with
`404`.[^already-deleted-resource]

## Redirection: 3xx

Code | Meaning  | Description
-----|----------|------------
300  | [Multiple Choices](http://tools.ietf.org/html/rfc7231#section-6.4.1) | This code MAY be returned in the uncommon scenarios where the URI requested does not unambiguously specify a particular resource or representation of a resource. See [URI Ambiguity](#uri-ambiguity) below.
301  | [Moved Permanently](http://tools.ietf.org/html/rfc7231#section-6.4.2) | This code SHOULD be returned when a resource's URI changes, in order to keep the previous URI from failing. When this code is returned, the server MUST also include a `Location` header. It indicates that the current request, and all future requests, should be directed to the URI provided in the `Location` header.
302  | [Found](http://tools.ietf.org/html/rfc7231#section-6.4.3) | This code SHOULD NOT be used. Instead, temporary redirects should respond with `303` or `307`, as applicable, to avoid ambiguity.[^302-ambiguity] It MAY only be used if there is strong evidence that clients of a service will not be able to parse or understand status codes `303` and `307`.
303  | [See Other](http://tools.ietf.org/html/rfc7231#section-6.4.4) | This code MAY be returned to indicate the request was processed and more information can be obtained with a `GET` request to the URI provided in the `Location` header, which MUST be included when this code is returned. This is most useful in such cases where a resource at another location is relevant to a request made with a `POST`, `PUT`, or `DELETE` request.
304  | [Not Modified](http://tools.ietf.org/html/rfc7232#section-4.1) | This code MAY be returned to indicate that the previously-downloaded resource a client possesses is up-to-date, and there's no need to resend. This code MUST NOT be returned except in response to conditional requests. Responses with a `304` status MUST NOT have a response body.
307  | [Temporary Redirect](http://tools.ietf.org/html/rfc7231#section-6.4.7) | This code MAY be returned to indicate that the request should be resubmitted to the URI provided in the `Location` header, which MUST be included when this code is returned, and that future requests should use the original URI. This code indicates that the request method should not change when using the temporary URI.

### URI Ambiguity

URI ambiguity requiring the use of a `300` status code SHOULD be avoided by following the below principles:

1.  URI schemes SHOULD be inherently unambiguous with respect to what resource is meant.
2.  If multiple representations of a particular resource are offered, the desired version SHOULD be specified with an
    `Accept` header rather than distinct URIs, and a default representation SHOULD be served liberally.[^300-accept]

However, in such cases where it is deemed important that an occasionally-ambiguous URI scheme be used or where different
representations of a resource require differing URIs (e.g., for media files where a file extension is considered
significant), a `300` status code MAY be returned where a particular URI is ambiguous.

### 303 and 307 Temporary Redirects

A `303` in response to a `POST`, `PUT`, or `DELETE` indicates that the operation has succeeded but that the response
entity-body is not being sent along with this request. If the client wants the response entity-body, it needs to make a
`GET` request to the URI provided in the `Location` header.

A `307` in response to a `POST`, `PUT`, or `DELETE` indicates that the server has not even tried to perform the
operation and the client needs to resubmit the entire request, with the original method, to the URI in the `Location`
header.

## Client Errors: 4xx

Code | Meaning  | Description
-----|----------|------------
400  | [Bad Request](http://tools.ietf.org/html/rfc7231#section-6.5.1) | This code MUST be returned when a request cannot be processed due to client error (e.g., the request is malformed or too large) when a more specific code is not applicable.
401  | [Unauthorized](http://tools.ietf.org/html/rfc7235#section-3.1) | This code MUST be returned when a request needs to be authenticated to succeed or the credentials provided are invalid. Responses with a `401` status code MUST also provide a valid `WWW-Authenticate` header.[^401-403-meaning]
403  | [Forbidden](http://tools.ietf.org/html/rfc7231#section-6.5.3) | This code SHOULD be returned when the client is not allowed to make the desired request. This status SHOULD be returned if the client is properly authenticated but does not possess permission to perform the request, or if the client is not authenticated, but authentication would not affect the outcome.[^401-403-meaning]
404  | [Not Found](http://tools.ietf.org/html/rfc7231#section-6.5.4) | This code SHOULD be returned when the requested resource could not be found but may be available in the future. This status code MAY also be used for security reasons in the scenario [described below](#security-implications-of-401-and-403).
405  | [Method Not Allowed](http://tools.ietf.org/html/rfc7231#section-6.5.5) | This code SHOULD be returned when the requested resource doesn't support the request method. When this code is returned the response MUST include the `Allow` header with the list of accepted request methods for the resource. This code MUST only be used when one of the [Methods](../fundamentals/methods.html) documented in this handbook is not valid for a particular URI.[^405-versus-501]
406  | [Not Acceptable](http://tools.ietf.org/html/rfc7231#section-6.5.6) | This code MUST be returned when the resource the client requested is not available in a format allowed by the `Accept` header the client supplied.
408  | [Request Timeout](http://tools.ietf.org/html/rfc7231#section-6.5.7) | This code SHOULD be returned when the client took too long to finish sending the request.
409  | [Conflict](http://tools.ietf.org/html/rfc7231#section-6.5.8) | This code SHOULD be returned when the request cannot be processed because of a conflict between the request and the current state of the resource. It MAY indicate that changes which the client is unaware of have taken place.
410  | [Gone](http://tools.ietf.org/html/rfc7231#section-6.5.9) | This code MAY be returned to indicate that a resource is no longer available and is not expected to return to availability. However, if it is impractical for a system to maintain a record of deleted or purged resources, or poses a security risk, `404` MAY be returned instead.
412  | [Precondition Failed](http://tools.ietf.org/html/rfc7232#section-4.2) | This code MUST be returned when the client specified one or more preconditions in its headers, and the server cannot meet those preconditions.
415  | [Unsupported Media Type](http://tools.ietf.org/html/rfc7231#section-6.5.13) | This code MUST be returned when the client sends a payload of a content type the server cannot accept.[^content-type-versus-invalid-data]
422  | [Unprocessable Entity](http://tools.ietf.org/html/rfc4918#section-11.2) | This code SHOULD NOT be used. Instead, `400` should be returned in response to invalid request payloads.[^422-use]
429  | [Too Many Requests](http://tools.ietf.org/html/rfc6585#section-4) | This code MUST be returned when rate-limiting is in use, and the client has sent too many requests for a given time period.

### Security Implications of 401 and 403

There may be times when returning a `401` or a `403` would reveal the presence of a resource on the server that a client
should not even be allowed to know exists. In these cases, the server MUST respond with a `404` even for requests that
would succeed with proper authentication.

## Server Errors: 5xx

Code | Meaning  | Description
-----|----------|------------
500  | [Internal Server Error](http://tools.ietf.org/html/rfc7231#section-6.6.1) | This code MUST be returned when a fatal error caused by an unexpected condition occurs on the server and was not caused by the client.[^500-detectable-errors]
501  | [Not Implemented](http://tools.ietf.org/html/rfc7231#section-6.6.2) | The code MUST be returned when the server does not recognize the request method. This code MUST only be used for methods not documented under [Methods](../fundamentals/methods.html).[^405-versus-501]
503  | [Service Unavailable](http://tools.ietf.org/html/rfc7231#section-6.6.4) | This code SHOULD be returned when the server is temporarily unavailable because it is overloaded or down for maintenance. The server MAY include a `Retry-After` header telling the client when it should try submitting the request again.
505  | [HTTP Version Not Supported](http://tools.ietf.org/html/rfc7231#section-6.6.6) | This code SHOULD be returned when the server does not support the HTTP protocol version used in a request. The response SHOULD contain a document describing which protocols the server does support.

### 500 and 503 Errors

Because the client can do nothing to fix a `500` or `503` status code (and can only try again later), it MUST be
considered a critical application failure whenever one of those status codes is returned in production. For more
information on this and error response models, see the handbook's documentation on [Errors](../design/errors.html).


[^content-range]: If the entity-body is a single byte range from the representation, the response as a whole must have a
    `Content-Range` header explaining which bytes of the representation are being served. If the body is a multipart
    entity (that is, multiple byte ranges of the representation are being served), each part must have its own
    `Content-Range` header.

[^already-deleted-resource]: Note that this doesn't prevent `DELETE` from being idempotent because repeated `DELETE`
    requests still result in the same _state_ even if the responses differ.

[^302-ambiguity]: Historically, HTTP clients have not honored the original standard for `302` behavior. Because of the
    differences between the specification and commonly-expected behavior, `302` should be avoided entirely in favor of
    `303` and `307`. RFC 2616 provides [explicit insight](https://tools.ietf.org/html/rfc2616#section-10.3.3) on this
    matter.

[^300-accept]: A `406` status code should be returned for any `Accept` header value that cannot be fulfilled.

[^401-403-meaning]: Details on the semantics of `401` and `403` can be found in a
    [2010 working group email](https://lists.w3.org/Archives/Public/ietf-http-wg/2010JulSep/0085.html) from Roy T.
    Fielding

[^405-versus-501]: `405` is similar to `501` (“Not Implemented”), but `501` should only be used when the server doesn’t
    recognize the method at all. In contrast, `405` should be returned when the client uses a recognized method that
    isn't supported by the URI.

[^content-type-versus-invalid-data]: Note that a `400` should be returned if the content type is acceptable but the
    payload is otherwise invalid.

[^422-use]: The `422` status was at one time favored for requests containing payloads with valid syntax but invalid
    semantics because RFC 2616 [required that](https://tools.ietf.org/html/#section-10.4.1) `400` only be used "due to
    malformed syntax." However, RFC 7231, which obsoletes RFC 2616, [makes no such
    stipulation](https://tools.ietf.org/html/rfc7231#section-6.5.1). Because `400` is no longer disallowed and because
    `422` is defined only in an [RFC targeting WebDAV](https://tools.ietf.org/html/rfc4918), `400` is considered the
    better choice.

[^500-detectable-errors]: This error can also be raised deliberately in the case of a detected but unrecoverable error
    such as a failure to communicate with another service component. In all cases, however, `500` errors should be
    [treated as critical failures](../design/errors.html).
