---
title: Errors
---

# Errors

In the event that a request cannot be fulfilled, the server MUST return an appropriate `400`-series or `500`-series
status code. More information on when specific status codes should be used can be found in the
[Status Codes](../fundamentals/status-codes.html) section. If a `400`-series or `500`-series status code is returned,
the response body MUST be an error container model.

Any `500` or `503` response made in production MUST be logged and treated as a critical failure requiring an
emergency fix. There MUST NOT be long-running known causes for `500` or `503` status errors.

## Error Container Model

An error response (any response with `400`- or `500`-series status code) MUST return an error container model. This
model MUST contain an `errors` field, SHOULD contain a `trace` field, and MAY contain a `status_code` field, as outlined
below:

| --------------- | ----------------- | -------------------------------------------------------------------------------- |
| Field           | Type              | Description                                                                      |
| --------------- | ----------------- | -------------------------------------------------------------------------------- |
| `errors`        | Error Model Array | This field MUST contain an array with at least one error model.                  |
| `trace`         | String            | This field SHOULD contain a lowercase UUID uniquely identifying the request.       |
| `status_code`   | Integer           | This field MAY contain the HTTP status code used for the response. Otherwise, it MUST be omitted. |
| --------------- | ----------------- | -------------------------------------------------------------------------------- |

## Error Model

An error model MUST contain a `code` and a `message` field, SHOULD contain a `more_info` field, and MAY contain
a `target` field, as outlined below:

| --------------- | ------------------ | -------------------------------------------------------------------------------- |
| Field           | Type               | Description                                                                      |
| --------------- | ------------------ | -------------------------------------------------------------------------------- |
| `code`          | Enumeration        | This field MUST contain a snake case string succinctly identifying the problem. This field SHOULD NOT indicate which field, parameter, or header caused the error, as this is better done with an error target model. |
| `message`       | String             | This field MUST contain a plainly-written, developer-oriented explanation of the solution to the problem in complete, well-formed sentences. |
| `more_info`     | URL                | This field SHOULD contain a publicly-accessible URL where information about the error can be read in a web browser. |
| `target`        | Error Target Model | This field MAY contain an error target model. Otherwise, it MUST be omitted.     |
| --------------- | ------------------ | -------------------------------------------------------------------------------- |

The error model MAY be extended with additional fields to better specify the error. The `target` field can be considered
a standardized example of such an extension.

## Error Target Model

An error target model MUST contain the fields outlined below:

| --------------- | --------------- | -------------------------------------------------------------------------------- |
| Field           | Type            | Description                                                                      |
| --------------- | --------------- | -------------------------------------------------------------------------------- |
| `type`          | Enumeration     | This field MUST contain `field`, `parameter`, or `header`.                       |
| `name`          | String          | This field MUST contain the name of the problematic field (with dot-syntax if necessary), query parameter, or header. |
| --------------- | --------------- | -------------------------------------------------------------------------------- |


### Example Error Response

```
{
  "trace": "9daee671-916a-4678-850b-10b911f0236d",
  "errors": [
    {
      "code": "missing_field",
      "message": "The `first_name` field is required.",
      "more_info": "https://docs.api.bluemix.net/v2/users/create_user#first_name",
      "target": {
        "type": "field",
        "name": "first_name"
      }
    },
    {
      "code": "reserved_value",
      "message": "The value provided for `username` is already in use.",
      "more_info": "https://docs.api.bluemix.net/v2/users/create_user#username",
      "target": {
        "type": "field",
        "name": "username"
      }
    }
  ]
}
```

## Codes and Messages

Error `code` values SHOULD specify the problem that caused an error; `message` values SHOULD describe the problem and
MAY also provide suggestions or solutions.

### Codes

Error `code` values MUST be snake case strings, descriptive of the problem encountered, as succinct as possible,
and absent of any non-standard or proprietary terms, brands, codenames, abbreviations, or acronyms.

`code` values SHOULD NOT prescribe solutions to problems. For example, `color_must_be_red_or_blue` is not a good `code`.
A better `code` would be `invalid_color`, leaving solutions to `message` values. This allows `code` values to remain
constant even if a field becomes more permissive in the future.

A `code` value, along with any other machine-readable fields included in an error, SHOULD be specific enough for client
code to take any required action. Client code should not be forced to parse a human-readable `message` value in order
to take action on a specific error condition.

The documentation for specific requests SHOULD enumerate possible error `code` values. Adding a possible error `code`
for a request SHOULD be considered a breaking change. For this reason, the documentation MAY include possible error
`code` values which are not yet used.

### Messages

Error `message` values SHOULD describe the problems identified by `code` values in complete, well-formed sentences and
MAY provide suggestions or solutions. It is expected for `message` values to duplicate information from `code`,
`target`, and custom extensions to the error model.

Importantly, `message` values are still meant for _developers_ and for this reason SHOULD NOT be localized or written
for use in a user interface. Fields mentioned within a `message` SHOULD be mentioned by exact field name (e.g.,
`first_name`, not "first name").

Consider the example above of an error `code` with value `invalid_color`. A poor `message` would be:

```json
"The color provided for `paint` was invalid."
```

Unlike the `code`, a `message` MAY prescribe a specific solution, thereby adding value. A better message would be:

```json
"The color for `paint` must be `red` or `blue`."
```

As demonstrated in the above examples, `message` values SHOULD use the backtick character to enclose field names,
parameter names, header names, and specific values.
