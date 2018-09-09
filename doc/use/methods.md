---
title: Methods
---

# Methods

bla bla

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


## PATCH

Services MAY support either or both of the below formats for `PATCH` requests:

* [JSON merge patch format (RFC 7396)](https://tools.ietf.org/html/rfc7396)
* [JSON patch format (RFC 6902)](https://tools.ietf.org/html/rfc6902)

The JSON merge patch format (RFC 7396) MAY be supported for requests with a content type of `application/json` or
without an explicit content type. However, if this format is supported at all, it MUST be supported for requests with a
400 Bad Request` status.

## DELETE

A successful `DELETE` request SHOULD remove a resource. The resource deleted by a `DELETE` request MUST be located at



[^put-create-success]: [As required](https://tools.ietf.org/html/rfc2616#section-9.6) by RFC 2616.

[^patch-uri]: RFC 5789 [states](https://tools.ietf.org/html/rfc5789#section-2), "The PATCH method requests that a set of
    changes described in the request entity be applied to the resource identified by the Request-URI."

[^delete-request-body]: Like `GET` requests, `DELETE` requests do not include the request body in the
    [semantics of the reqest](https://tools.ietf.org/html/rfc2616#section-9.7).
