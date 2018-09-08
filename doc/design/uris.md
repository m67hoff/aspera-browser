---
title: URIs
---

# URIs

## Overview

URI path design is an important part of every API. Paths SHOULD be easy to read and MAY reflect the hierarchy of
underlying models. Paths SHOULD NOT end with a trailing `/`; if a client appends a trailing `/`, the server SHOULD
respond with a `301` status code along with a `Location` header containing the correct URI.
