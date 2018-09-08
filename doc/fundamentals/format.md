---
title: Format
---

# Format

APIs MUST support JSON by default for sending and receiving data in request and response bodies.[^json-by-default] Other
formats SHOULD NOT be supported except to meet a compelling industry-specific need.

## Object Encapsulation

All JSON data MUST be structured in an object at the top level; arrays MUST NOT be returned as the top-level
structure in a response body.[^never-use-root-arrays]

## Content-Type Behavior

If a request `Accept` header is either not provided or matches[^matching-accept-content-type] `application/json`, the
response MUST be JSON and its `Content-Type` header MUST be `application/json`.[^accept-header-usage]

## Cross-Origin Support

If a service has a need to support cross-origin requests, CORS headers SHOULD be supported to enable this. The JSONP
format SHOULD NOT be supported.

[^json-by-default]: The [Media Types section of the IBM REST Best Practices document](https://pages.github.ibm.com/api-economy/api-best-practices/general/Media-Types.html)
states "It should be optional to support any other format except JSON, usually based on an industry need."

[^never-use-root-arrays]: This design allows for top-level metadata to be added later and prevents a
    [cross-site scripting vulnerability](http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx/).
    This format is also required by the
    [Media Types section of the IBM REST Best Practices document](https://pages.github.ibm.com/api-economy/api-best-practices/general/Media-Types.html),
    [the OpenStack API Guidelines](https://specs.openstack.org/openstack/api-wg/guidelines/representation_structure.html#collection-resources),
    and [the CloudFoundry API style guide](https://github.com/cloudfoundry/cc-api-v3-style-guide#collections).

[^matching-accept-content-type]: It's very important to note that API implementations should _not_ parse `Accept`
    headers with a simple string search for `application/json`, as wildcards are often used. It's also important for
    matching to be [case-insensitve](https://tools.ietf.org/html/rfc2045#section-5.1), as MIME types are lowercase by
    convention only.

[^accept-header-usage]: The [Media Types section of the IBM REST Best Practices document](https://pages.github.ibm.com/api-economy/api-best-practices/general/Media-Types.html)
requires that at least `Accept` headers be used for media-type negotiation.
