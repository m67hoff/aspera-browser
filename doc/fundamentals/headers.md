---
title: Headers
---

# Headers

This section details the header usage, particularly where there are guidelines additional to the HTTP specification.
Most of the headers detailed below are not required to be supported in most scenarios, but when any of the below headers
are used, they MUST follow the constraints within the HTTP specification and within this section of the handbook.

## Representation Headers

| Header           | Type              | Description                              |
| ---------------- | ----------------- | ---------------------------------------- |
| [Content-Encoding](https://tools.ietf.org/html/rfc7231#section-3.1.2.2) | Request, Response | If a response body is encoded, this header MUST reflect the encoding used. Otherwise, this header MUST be omitted from the response. Requests including this header with an encoding not supported by the server MUST be rejected with a `415 Unsupported Media Type` status code and appropriate error response model. See [below](#content-encoding) for more details. |
| [Content-Language](https://tools.ietf.org/html/rfc7231#section-3.1.3.2) | Request, Response | If a response body is intended for an audience who speak a particular language (or languages), this header SHOULD be used to indicate that language (or those languages). If this header is included in a request it MAY be used by the server to classify the language of the incoming content appropriately. |
| [Content-Location](https://tools.ietf.org/html/rfc7231#section-3.1.4.2) | Request, Response | When applicable, the `Content-Location` response header SHOULD be used to indicate the permanent location of the returned resource. See [below](#content-location) for more details. For requests, the `Content-Location` MUST be ignored by the server except for the purpose of logging or otherwise recording request metadata. |
| [Content-Type](https://tools.ietf.org/html/rfc7231#section-3.1.1.5) | Request, Response | For all responses with bodies, this header MUST be included and indicate the content type of the body. Requests including this header with a content type not supported by the server MUST be rejected with a `415 Unsupported Media Type` status code and appropriate error response model. |

### Content Encoding

By default, responses SHOULD be encoded with `gzip`. If a request specifies a preference for an unsupported encoding in
the `Accept-Encoding` header, responses MUST NOT be encoded. If the `Accept-Encoding` header requires that an
unsupported encoding be used, requests MUST be rejected with a `406 Not Acceptable` status code and and appropriate
error response model in an unencoded body.

Encoded requests MAY be supported in cases where clients need to send large request bodies. If request encoding is
supported at all, `gzip` SHOULD be permitted.

### Content Location

The `Content-Location` response header can provide valuable information to the client, particularly for state-changing
methods. The advantage to providing a `Content-Location` header is that a client can _always_ depend on this header to
provide the permanent location of the content returned in a response body.

* For responses to `POST` requests which return a `201` status along with the created resource, `Content-Location`
  SHOULD be included and match `Location`.
* For responses to `PUT` or `PATCH` requests which modify the resource at the request URI and return a `200` status
along with the modified resource, `Content-Location` SHOULD be included and match the request URI.
* For responses to `POST`, `PUT`, `PATCH`, or `DELETE` requests which return a `202` status and include a resource
  representing the status of the request, `Content-Location` SHOULD be included and contain a URI where this request
  status may be obtained.
* For responses to any other `POST`, `PUT`, `PATCH`, or `DELETE` requests which include a resource in the response body
  which may be found at a permanent URI, `Content-Location` SHOULD be included and contain this URI.

The body of a response which includes a `Content-Location` header MUST be identical to the body of the response to a
successful `GET` request made to the URI provided in that `Content-Location` header.

## Negotiation Headers

| Header          | Type     | Description                              |
| --------------- | -------- | ---------------------------------------- |
| [Accept](https://tools.ietf.org/html/rfc7231#section-5.3.2) | Request  | For requests including an this header, the server SHOULD attempt to return resources in a format specified as acceptable. Requests including this header with only formats not supported by the server MUST be rejected with a `406` status code and appropriate error response model. This header MUST NOT be required. |
| [Accept-Charset](https://tools.ietf.org/html/rfc7231#section-5.3.3) | Request  | For requests including an this header, the server SHOULD attempt to return resources in a character set specified as acceptable. If this header is not included, the response MUST use `utf-8`. Requests including this header with only character sets not supported by the server MUST be rejected with a `406` status code and appropriate error response model. This header MUST NOT be required. |
| [Accept-Encoding](https://tools.ietf.org/html/rfc7231#section-5.3.4) | Request  | For requests including an this header, the server SHOULD attempt to return resources encoded in an acceptable way. If this header is not included, the response SHOULD use `gzip`. See [above](#content-encoding) for more details. This header MUST NOT be required. |
| [Accept-Language](https://tools.ietf.org/html/rfc7231#section-5.3.5) | Request  | For requests including this header, the server MAY attempt to return resource in an acceptable language. This header MUST NOT be required. Furthermore, the value of this header MUST NOT prevent a request from succeeding. |
| [Accept-Ranges](https://tools.ietf.org/html/rfc7233#section-2.3) | Response | If a resource supports range requests, this header SHOULD be used to indicate what ranges are supported. |
| [Allow](https://tools.ietf.org/html/rfc7231#section-7.4.1) | Response | This header MUST be used to indicate allowable request methods in a `405` response. If deemed useful, it MAY be included in any other response. |

## Authentication Headers

| Header           | Type     | Description                              |
| ---------------- | -------- | ---------------------------------------- |
| [Authorization](https://tools.ietf.org/html/rfc7235#section-4.2) | Request  | The server MUST support this header for any form of authentication. |
| [WWW-Authenticate](https://tools.ietf.org/html/rfc7235#section-4.1) | Response | This header MUST be supplied for responses to requests which need to be authenticated to be successful or requests where credentials are supplied but invalid. It MUST be supplied for all responses with a `401` status. |

## Validator Headers

| Header        | Type     | Description                              |
| ------------- | -------- | ---------------------------------------- |
| [ETag](https://tools.ietf.org/html/rfc7232#section-2.3) | Response | The `ETag` header MAY be supplied with the response to any `GET` or `HEAD` request. It MUST be supplied for any resources which support the `If-Match` or `If-None-Match` headers for any methods. If supported, the `ETag` SHOULD be a quoted lowercase base-36 string, at least 16 characters in length (e.g., `"md9weho39cn2302n"`). It MUST be based on a checksum or hash of the resource that guarantees it will change if the resource representation changes. |
| [Last-Modified](https://tools.ietf.org/html/rfc7232#section-2.2) | Response | The `Last-Modified` header MAY be supplied with the response to any `GET` or `HEAD` request. It MUST be supplied for any resources which support the `If-Modified-Since` or `If-Unmodified-Since` headers for any methods. It MUST contain a valid [HTTP-date](https://tools.ietf.org/html/rfc5322#section-3.3) value (e.g., `Tue, 15 Nov 1994 12:45:26 GMT`) and MUST NOT be a date/time occurring in the future. |

## Conditional Headers

Conditional headers provide a means for consumers to efficiently ensure a cached resource is up-to-date and use
optimistic locking in order to mitigate race conditions.

| Header              | Type    | Description                              |
| ------------------- | ------- | ---------------------------------------- |
| [If-Match](https://tools.ietf.org/html/rfc7232#section-3.1) | Request | This header MAY be supported for any request; it is particularly applicable to `POST`, `PUT`, `PATCH`, and `DELETE` requests. If this condition fails, the server MUST send a `412` status and an appropriate error response model. |
| [If-None-Match](https://tools.ietf.org/html/rfc7232#section-3.2) | Request | This header MAY be supported for any request; it is particularly applicable to `GET` and `HEAD` requests. If this condition fails for a `GET` or `HEAD` request, the server MUST send a response with a `304` status and no body. If it fails for a request of any other method, the server MUST send a `412` status and an appropriate error response model. |
| [If-Modified-Since](https://tools.ietf.org/html/rfc7232#section-3.3) | Request | This header MAY be supported for any request; it is particularly applicable to `GET` and `HEAD` requests. It addresses similar needs to the `If-None-Match` header, but because of its increased precision, documentation SHOULD encourage clients to use `If-None-Match` where possible. If this condition fails for a `GET` or `HEAD` request, the server MUST send a response with a `304` status and no body. If it fails for a request of any other method, the server MUST send a `412` status and an appropriate error response model. |
| [If-Unmodified-Since](https://tools.ietf.org/html/rfc7232#section-3.4) | Request | This header MAY be supported for any request; it is particularly applicable to `POST`, `PUT`, `PATCH`, and `DELETE`. It addresses similar needs to the `If-Match` header, but because of its increased precision, documentation SHOULD encourage clients to use `If-Match` where possible. If this condition fails, the server MUST send a `412` status and an appropriate error response model. |
| [If-Range](https://tools.ietf.org/html/rfc7233#section-3.2) | Request | This header MAY be supported for requests which support the `Range` header. If this condition fails, the server MUST ignore the `Range` header and send the entire resource. |

## CORS Headers

Support for Cross-Origin Resource Sharing (CORS) MAY be implemented by any service. The following guidelines apply to
services which opt to implement support for CORS.

| Header             | Type     | Description                              |
| ------------------ | -------- | ---------------------------------------- |
| [Access-Control-Allow-Origin](https://www.w3.org/TR/cors/#access-control-allow-origin-response-header) | Response | This header MUST be returned when a request is made from a white-listed origin. In this case, its value SHOULD match the value of the request's `Origin` header. |
| [Access-Control-Allow-Credentials](https://www.w3.org/TR/cors/#access-control-allow-credentials-response-header) | Response | This header SHOULD be included with a value of `true` if cookies and credentials may be used. Otherwise it SHOULD be omitted. |
| [Access-Control-Expose-Headers](https://www.w3.org/TR/cors/#access-control-expose-headers-response-header) | Response | This header SHOULD be used to list which response headers should be made accessible to the client apart from `Cache-Control`, `Content-Language`, `Content-Type`, `Expires`, `Last-Modified`, and `Pragma`, which are all exposed by default. |
| [Access-Control-Max-Age](https://www.w3.org/TR/cors/#access-control-max-age-response-header) | Response | This header SHOULD be included with responses to preflight requests to indicate how long a client may cache the results. |
| [Access-Control-Allow-Methods](https://www.w3.org/TR/cors/#access-control-allow-methods-response-header) | Response | This header SHOULD be included with responses to preflight requests to indicate what request methods are permissible. |
| [Access-Control-Allow-Headers](https://www.w3.org/TR/cors/#access-control-allow-headers-response-header) | Response | This header MAY be included with any responses to preflight requests to indicate what request headers are permissible. It MUST be included in responses to requests including the `Access-Control-Request-Headers` header. |
| [Access-Control-Request-Method](https://www.w3.org/TR/cors/#access-control-request-method-request-header) | Request | This header SHOULD be understood and utilized in order to formulated responses to preflight requests. |
| [Access-Control-Request-Headers](https://www.w3.org/TR/cors/#access-control-request-headers-request-header) | Request | This header SHOULD be understood and utilized in order to formulate responses to preflight requests. |
| [Origin](https://www.w3.org/TR/cors/#origin-request-header) | Request | This header MUST be understood and utilized by services implementing support for CORS. |

## Preference Headers

| Header             | Type     | Description                              |
| ------------------ | -------- | ---------------------------------------- |
| [Prefer](https://tools.ietf.org/html/rfc7240#section-2) | Request  | This header SHOULD be supported for `POST`, `PUT`, and `PATCH` requests where it may be expensive (in terms of bandwidth or computation) to return the created or modified resource. If the client supplies `return=minimal`, a successful response MUST have a `201 Created` or `204 No Content` status and include no body. If `return=representation` is supplied, a successful response MUST include the acted-upon resource. Whether the resource is included in the response by default is up to the implementors of the service. |
| [Preference-Applied](https://tools.ietf.org/html/rfc7240#section-3) | Response | This header MAY be returned with responses to requests which include a `Prefer` header but is usually not necessary as it is only needed when the client does not have any other clear indicators as to whether its preference was applied. |

## Context Headers

| Header     | Type     | Description |
| ---------- | -------- | ----------- |
| [From](https://tools.ietf.org/html/rfc7231#section-5.5.1) | Request  | This header allows a client to provide an email address where the maintainer of the client system may be contacted. Its value MUST NOT affect the outcome of any request. |
| [Referer](https://tools.ietf.org/html/rfc7231#section-5.5.2) | Request  | This header allow a client to reference where the request URI was obtained. Its value MUST NOT affect the outcome of any request. |
| [Server](https://tools.ietf.org/html/rfc7231#section-7.4.2) | Response | This header SHOULD be provided in all responses and SHOULD contain the public-facing name and version number (including any minor and patch version) of the service responsible for handling the request. |
| [User-Agent](https://tools.ietf.org/html/rfc7231#section-5.5.3) | Request  | This header allows a client to report information about itself. It SHOULD be logged with a request, but MAY be otherwise ignored. |

## Control Headers

| Header        | Type              | Description                              |
| ------------- | ----------------- | ---------------------------------------- |
| [Age](https://tools.ietf.org/html/rfc7234#section-5.1) | Response | This header is used by caching servers to indicate the age of a request. |
| [Cache-Control](https://tools.ietf.org/html/rfc7234#section-5.2) | Request, Response | This header specifies directives for caches. It MAY be supported if the presence of caches is anticipated. |
| [Date](https://tools.ietf.org/html/rfc7231#section-7.1.1.2) | Request, Response | This header represents the time a request or response was originally sent, and MUST be included in responses. When included by requests, the server MUST NOT presume that the client's clock is accurate. |
| [Expect](https://tools.ietf.org/html/rfc7231#section-5.1.1) | Request | This header is used in conjunction with the `100` status code and MAY be supported. |
| [Expires](https://tools.ietf.org/html/rfc7234#section-5.3) | Response | This header indicates when a response will become stale and should be purged from caches. It MAY be supported if the presence of caches is anticipated. |
| [Host](https://tools.ietf.org/html/rfc7230#section-5.4) | Request | This header indicates the host and port for the target URI of the request. If it is omitted or duplicated, the request MUST be rejected with a `400` status and appropriate error response model. |
| [Location](https://tools.ietf.org/html/rfc7231#section-7.1.2) | Response | This header is required for certain status codes. The semantics for its usage is dictated by the status code it is paired with. |
| [Max-Forwards](https://tools.ietf.org/html/rfc7231#section-5.1.2) | Request | This header is used by proxies in conjunction with `TRACE` and `OPTIONS` requests and MAY be ignored by the server. |
| [Pragma](https://tools.ietf.org/html/rfc7234#section-5.4) | Request | This header specifies directives for caches. It MAY be ignored. |
| [Range](https://tools.ietf.org/html/rfc7233#section-3.1) | Request | This header MAY be supported for large resources where clients might want to obtain only a resource in separate parts. It MUST be ignored for any requests with a method other than `GET`. |
| [Retry-After](https://tools.ietf.org/html/rfc7231#section-7.1.3) | Response | This header MAY be sent with either a `503` status to indicate when a service is expected to be available again or with any `3xx` status to indicate how long a client should wait before executing a redirect. It MUST contain either a valid [HTTP-date](https://tools.ietf.org/html/rfc5322#section-3.3) value or an integer representing a number of seconds. |
| [TE](https://tools.ietf.org/html/rfc7230#section-4.3) | Request | This header is used to specify what transfer codings (besides chunked) a client is willing to accept and MAY be ignored. |
| [Vary](https://tools.ietf.org/html/rfc7231#section-7.1.4) | Response | This header specifies what request fields may affect the outcome of a request. It MAY be supported if the presence of caches is anticipated or to proactively signal support for different content format, encodings, languages, etc.  |
| [Warning](https://tools.ietf.org/html/rfc7234#section-5.5) | Response | This header gives additional information that might not be conveyed in the status code and doesn't represent a total failure. It MAY be supported, particularly if the presence of caches is anticipated. |


## Rate Limiting Headers

The following headers, while not a part of the HTTP specification, are common practice[^rate-limiting-common-practice]
and MUST be used for any implementation of rate limiting.

| Header                | Type     | Description                              |
| --------------------- | -------- | ---------------------------------------- |
| X-RateLimit-Limit | Response | If rate limiting is active, this header MUST indicate the number of requests permitted per hour. |
| X-RateLimit-Remaining | Response | If rate limiting is active, this header MUST indicate the number of requests remaining in the current rate limit window. |
| X-RateLimit-Reset | Response | If rate limiting is active, this header MUST indicate the time at which the current rate limit window resets, as a UNIX timestamp. |

## Custom Headers

There are times where service-specific functionality may need to be implemented with custom headers. In these cases,
support for custom request or response headers MAY be implemented. However, custom headers SHOULD NOT be required for
basic usage of a given API.

When naming custom headers, care should be taken to disambiguate them as much as possible. They SHOULD NOT be prefixed
with `X-`. If a custom header is by nature limited in scope to IBM-specific products and services it SHOULD begin with
`IBM-` or `IBM-PRODUCT-` where `PRODUCT` is, for example, `Bluemix` or `Watson`. Custom header names SHOULD be
constructed from title-cased, hyphen-separated words. However, as with all headers, they MUST be handled in a
case-insensitive way.

## Request Headers as Query Parameters

In cases where a request header may be inconvenient for a client to supply request header functionality MAY be
duplicated as query parameters. In these cases, the name of the query parameter should be as close to the name as the
header as possible while still complying with all the rules for query parameter names. For example, the request header
`If-Match` would be exposed as the query parameter `if_match`.


[^rate-limiting-common-practice]: These headers are used by [Twitter](https://dev.twitter.com/rest/public/rate-limiting), [GitHub](https://developer.github.com/v3/rate_limit/), [Atlassian](https://developer.atlassian.com/hipchat/guide/hipchat-rest-api/api-rate-limits), and others.
