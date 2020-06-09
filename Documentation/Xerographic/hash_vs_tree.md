# Hashing Versus Trees

There are two common ways to efficiently search for a value in a data structure: hashing and comparison (i.e. less/greater/equal).
It is a common misconception that the core choice here is hash tables versus trees.
For example this misconception is enshrined in Java standard library class names (HashMap, TreeMap).
However, it has been known for a long time that it is possible to combine hash-based searching with tree-shaped structure by using [prefix trees/tries](https://youtu.be/6PX6wqDQE20).

The core idea here is that a large integer (like a hash value) can be viewed as a sequence of small integers by appplying a sequence of division/remainder operations.
For example, imagine 2711808883 is the hash value for some nontrivial data blob (e.g. { name: "alice", addr: "here", age: 42, limbs: [ "arms", "legs" ] }).
If you do a sequence of division and remainder operations by 3 on that number you get 1,0,0,0,1,1,1,1,0,2,1,2,0,0,0,0,0,0,1,2,1 (in other words, that number in base 3, backwards).
Now you can use that sequence of small integers as a key for a trie.
(And just because everyone loves flamebait: [_trie_ is pronounced "try"](https://english.stackexchange.com/questions/206762/how-to-spell-the-word-trie).)

The fancy optimized version of this idea is called a [hash array mapped trie (HAMT)](https://idea.popcount.org/2012-07-25-introduction-to-hamt/).

This is important for xerographic data structures because:
1. In _some_ situations hash-based searching is (much) better than comparison-based searching.
2. The effectiveness of structural sharing depends on tree-shaped structures.

The common misconception mentioned above suggests some tension between these two points, but in fact there is no such tension.
So be very wary of claims like "persistent trees are nice for classroom exercises, but everyone knows you need mutable hashtables for serious programs."
