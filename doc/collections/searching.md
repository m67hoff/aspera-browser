---
title: Deprecated: Searching
---

# Deprecated: Searching

*This section has been deprecated until it can be rewritten.*

Searching across multiple fields MAY be implemented for a collection where clients need to limit the resources returned
by a search query containing keywords.

## Basic Searching

Basic searching SHOULD be used for collections where fuzzy searching across text-based and numeric fields is needed, but
not the primary function of the collection. Basic searching is standardized in two ways: tokenization and matching.

### Tokenization of Search Queries

Whitespace and punctuation[^qualifying-punctuation] characters in search queries SHOULD be treated as token delimiters
and otherwise ignored.

Quoted strings (using either single or double ASCII quotation marks) SHOULD be evaluated starting from the beginning of
a query; each quoted string should result in a single token. The contents of a quoted string (including whitespace and
punctuation) SHOULD be preserved exactly in the resulting token.

Any unpaired quotation marks following the last quoted string in a query SHOULD be treated as token delimiters and
otherwise ignored. Escaping characters (e.g., with a backslash) within a quoted string SHOULD NOT be supported.

The following are some examples of search queries and the tokens that should result:

| ----------------------------- | ------------------------------------------------------------------------------------ |
| Query                         | Tokens                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| `one two three`               | `one`, `two`, `three`                                                                |
| `one/two/three`               | `one`, `two`, `three`                                                                |
| `"one two" three`             | `one two`, `three`                                                                   |
| `'one two' three`             | `one two`, `three`                                                                   |
| `"'one' two" three`           | `'one' two`, `three`                                                                 |
| `'"one" two' three`           | `"one" two`, `three`                                                                 |
| `"one two" three"four five`   | `one two`, `three`, `four` , `five`                                                  |
| `one^two$three`               | `one`, `two`, `three`                                                                |
| `"one^two$three"`             | `one^two$three`                                                                      |
| `"one \"two" three`           | `one \`, `two`, `three`                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------ |

### Matching Logic

In order to be considered a match for a query, a resource SHOULD case-insensitively include all the tokens resulting
from a query across a predefined set of that resource's fields.

Tokens containing common words, such as `a`, `and`, or `the`, or semantically redundant words, such as `ticket` when
searching a collection of tickets, MAY be discarded at the implementor's discretion.

Unless a sort order is specified in the request, the resources SHOULD be ordered such that earlier resources are a
"better" match, but what constitutes a better match is left up to the implementor.

## Advanced Querying

See the filtering section on [advanced querying](./filtering.html#advanced-querying) for recommendations.

[^qualifying-punctuation]: In addition to any whitespace, the following characters SHOULD be treated as token delimiters
    and excluded from the final tokens, except when present within a quoted string: `:`, `;`, `,`, `.`, `?`, `/`, `\`,
    `~`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `(`, `)`, `-`, `+`, `=`, `|`, `{`, `}`, `[`, `]`, `<`, `>`, `` ` ``