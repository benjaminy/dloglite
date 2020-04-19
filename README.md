# DLogLite
A Project Inspired by SQLite and Datomic

SQLite is a great project that puts some of the power of relational databases in a single file.
It is used in an extremely wide range of small to medium scale applications.
This project is an attempt to similarly package up the interesting ideas from Datomic in a single file.

## Why?

There are two primary reasons why I think this is an interesting idea:

- Datomic was designed from the ground up to support efficient querying of any historical version of a DB.
  This is a cool idea on its own, and I think it's a compelling foundation for an efficient and accurate diff-and-merge feature to support a kind of collaborative editing.
- I just like Datomic's entity-attribute-value tuple-based schema and datalog query language.
  I think especially for small-scale applications the flexibility it gives (relative to conventional relational DB design) is nice.

## "DLogLite"

The name of this project is an obvious reference to "SQLite".
I replaced the query language prefix "SQL" with an abbreviation of "datalog".
Also it has a flavor of recording a log of transations (though with some fanciness), thus the emphasis on "Log".
