# How to Read Engineering Evidence at the Digital Employee Works

[中文](../../zh/methodology/evidence-boundaries)

An engineering article can draw on public specifications, first-party implementation inspection, controlled execution records, and independent material. They have different evidentiary force. Compressing them all into “verified” would mislead readers.

## Four kinds of material answer different questions

1. **Public specifications and papers** define a concept, data format, or constraint. They do not prove that a particular product implements it.
2. **Narrow excerpts from a private implementation** show that a particular interface or contract existed in the inspected commit. They are not open source, cannot be fully reproduced by the public, and do not prove that every endpoint or platform has the same behavior.
3. **Controlled tests, builds, and restart records** show what happened on named tested paths in a defined environment. They are not independent reproduction, security certification, cross-platform reliability, or coverage of every branch.
4. **Independent standards, official documentation, and third-party research** provide general context and an external reference point. They do not endorse a particular in-house project.

This separation follows TMPA Core's four evidence levels: specified, implemented, demonstrated, and independently adopted. [TMPA Core S1.0 §11.3](../publications/tmpa-core-specification-s1.0#113-publication-and-evidence-boundaries) explains why a specification, code, bounded execution, and independent adoption cannot substitute for one another.

## How to read code excerpts and test figures

A code block states its source version, whether it comes from a private implementation, and whether it is a field-level excerpt or a structured reading aid. Omitted fields are not evidence that those fields do not exist or are unimportant; the article must not infer capability from the omission.

Read test figures together with their test set, environment, and directly covered mechanism. A large full-regression total does not automatically prove complete coverage of a particular state, fault branch, or security boundary. If an article does not enumerate the cases, read the figure as “these tested paths passed,” not “every possible path is proven.”

## How to read “does not support”

“Does not support” is not a courtesy disclaimer. It states what the present evidence cannot establish: a checked entry point does not prove no other entry point exists; one successful local restart does not prove recovery from every crash point; an atomic file replacement does not prove cross-host consistency or writer exclusion.

When the material cannot decide mechanically, an article should preserve uncertainty and name the next validation instead of presenting a plausible guess as fact. See [About the Digital Employee Works](../about#research-method) for the broader research method.
