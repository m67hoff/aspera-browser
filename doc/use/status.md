---
title: Status
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

#
## Server Errors: 5xx

Code | Meaning  | Description
-----|----------|------------
500  | [Internal Server Error](http://tools.ietf.org/html/rfc7231#section-6.6.1) | This code MUST be returned when a fatal error caused by an unexpected condition occurs on the server and was not caused by the client.[^500-detectable-errors]
501  | [Not Implemented](http://tools.ietf.org/html/rfc7231#section-6.6.2) | The code MUST be returned when the server does not recognize the request method. This code MUST only be used for methods not documented under [Methods](../fundamentals/methods.html).[^405-versus-501]
503  | [Service Unavailable](http://tools.ietf.org/html/rfc7231#section-6.6.4) | This code SHOULD be returned when the server is temporarily unavailable because it is overloaded or down for maintenance. The server MAY include a `Retry-After` header telling the client when it should try submitting the request again.
505  | [HTTP Version Not Supported](http://tools.ietf.org/html/rfc7231#section-6.6.6) | This code SHOULD be returned when the server does not support the HTTP protocol version used in a request. The response SHOULD contain a document describing which protocols the server does support.

### 500 and 503 Errors

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
