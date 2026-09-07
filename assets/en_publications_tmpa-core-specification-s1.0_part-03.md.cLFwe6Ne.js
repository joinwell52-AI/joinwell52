import{_ as n,o as a,c as s,a2 as t}from"./chunks/framework.Cm6XCzck.js";const h=JSON.parse('{"title":"5. Threat Model and Trust Assumptions","description":"","frontmatter":{},"headers":[],"relativePath":"en/publications/tmpa-core-specification-s1.0/part-03.md","filePath":"en/publications/tmpa-core-specification-s1.0/part-03.md","lastUpdated":1786439037000}'),i={name:"en/publications/tmpa-core-specification-s1.0/part-03.md"};function r(o,e,p,l,c,d){return a(),s("div",null,[...e[0]||(e[0]=[t(`<pre><code>    &quot;hash_algorithm&quot;: { &quot;type&quot;: &quot;string&quot;, &quot;minLength&quot;: 1 },
    &quot;digest&quot;: { &quot;type&quot;: &quot;string&quot;, &quot;minLength&quot;: 1 },
    &quot;signature_algorithm&quot;: { &quot;type&quot;: [&quot;string&quot;, &quot;null&quot;] },
    &quot;key_id&quot;: { &quot;type&quot;: [&quot;string&quot;, &quot;null&quot;] },
    &quot;signature&quot;: { &quot;type&quot;: [&quot;string&quot;, &quot;null&quot;] }
  },
  &quot;oneOf&quot;: [
    {
      &quot;properties&quot;: {
        &quot;signature_algorithm&quot;: { &quot;type&quot;: &quot;null&quot; },
        &quot;key_id&quot;: { &quot;type&quot;: &quot;null&quot; },
        &quot;signature&quot;: { &quot;type&quot;: &quot;null&quot; }
      }
    },
    {
      &quot;required&quot;: [&quot;signature_algorithm&quot;, &quot;key_id&quot;, &quot;signature&quot;],
      &quot;properties&quot;: {
        &quot;signature_algorithm&quot;: { &quot;type&quot;: &quot;string&quot;, &quot;minLength&quot;: 1 },
        &quot;key_id&quot;: { &quot;type&quot;: &quot;string&quot;, &quot;minLength&quot;: 1 },
        &quot;signature&quot;: { &quot;type&quot;: &quot;string&quot;, &quot;minLength&quot;: 1 }
      }
    }
  ]
},
&quot;extensions&quot;: {
  &quot;type&quot;: &quot;object&quot;,
  &quot;additionalProperties&quot;: true
}
</code></pre><p>} }</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>The object fields have the following operational meanings:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>| Field | Reader obligation |</span></span>
<span class="line"><span>|---|---|</span></span>
<span class="line"><span>| \`tmpa_version\` | select the compatible Core object-schema line; unknown major versions are not silently downgraded |</span></span>
<span class="line"><span>| \`id\` | index canonical identity and detect same-ID conflicting content |</span></span>
<span class="line"><span>| \`type\` | resolve one versioned type-registry entry |</span></span>
<span class="line"><span>| \`governed_work.id\` | group objects that govern the same work item |</span></span>
<span class="line"><span>| \`governed_work.primary_carrier_id\` | identify the single stable carrier to which follow-on evidence must resolve |</span></span>
<span class="line"><span>| \`governed_work.parent_id\` / \`thread_id\` | preserve work derivation and a session-independent collaboration thread; the thread does not replace the parent relation |</span></span>
<span class="line"><span>| \`stream\` | establish attributable local order without using timestamps |</span></span>
<span class="line"><span>| \`creator\` and \`role\` | evaluate an authority claim against active assignments; these fields do not create authority |</span></span>
<span class="line"><span>| \`lifecycle\` | identify the profile and declared state; \`transition\`, when present, supplies explicit \`from/action/to\` evidence |</span></span>
<span class="line"><span>| \`references\` | construct typed ordering or non-ordering links according to the relation registry |</span></span>
<span class="line"><span>| \`claims\` | represent inspectable assertions and their evidence-object set; presence does not establish the claim |</span></span>
<span class="line"><span>| \`risk\` | represent a profile-defined risk level and human-approval requirement; it does not itself grant approval |</span></span>
<span class="line"><span>| \`content\` | carry the governed payload in the declared media type |</span></span>
<span class="line"><span>| \`integrity\` | identify the canonicalization and verification procedure for covered bytes |</span></span>
<span class="line"><span>| \`extensions\` | contain all profile-specific additions; unknown extensions are processed only under the declared profile |</span></span>
<span class="line"><span></span></span>
<span class="line"><span>The primary-carrier object uses its own \`id\` as \`governed_work.primary_carrier_id\`. Every other object for the same work item repeats that carrier identifier. A lifecycle-transition document type SHALL require \`lifecycle.transition\`; non-transition types MAY omit it. The type registry, rather than the generic single-object schema, enforces that conditional requirement.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Schema processors used for C01 SHALL implement JSON Schema Draft 2020-12 \`format\` assertion for \`created_at\`. A processor that treats \`date-time\` as annotation-only is insufficient. The linked S1.0 machine-readable artifact is the normative schema byte sequence; the embedded rendering above SHALL remain semantically identical to it.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>| S1.0 machine-readable artifact | SHA-256 |</span></span>
<span class="line"><span>|---|---|</span></span>
<span class="line"><span>| [Governance Object Schema](/spec/tmpa/s1.0/governance-object.schema.json) | \`a2829cd7149c3054a52886365f2293a23106b636b0c52799739bfabdab1ff4fa\` |</span></span>
<span class="line"><span>| [Lifecycle Profile Schema](/spec/tmpa/s1.0/lifecycle-profile.schema.json) | \`481a61ac2485bbaf15d90e9c5a255ad9ce6a55971190f0fe404856be4b10f993\` |</span></span>
<span class="line"><span>| [Reader Result Schema](/spec/tmpa/s1.0/reader-result.schema.json) | \`4527df7096fe840b85b245e50d5cea576ff359d50a54d17c8873a7b4f458d431\` |</span></span>
<span class="line"><span>| [Conformance Result Schema](/spec/tmpa/s1.0/conformance-result.schema.json) | \`4b1ecebf83e62d2aa1aff0e79a0cd0ea0a85fbc14a426d5fe873ab40aefdc2fe\` |</span></span>
<span class="line"><span></span></span>
<span class="line"><span>The lifecycle-profile schema requires explicit \`acceptance\`, \`work_graph\`, \`risk_policy\`, and \`failure_model\` sections in addition to states, actions, transitions, and recovery rules. S1.0 additionally requires the risk policy to identify permitted approval-object types and whether the approver must be independent. These sections make FCoP-derived collaboration-cycle semantics inspectable without binding TMPA to the FCoP reference implementation or to CodeFlowMu.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>The \`lifecycle.state\` field records the state declared for this immutable object at publication. It is not a mutable current-state field. The current authoritative lifecycle state is reconstructed from the valid object set, accepted transition evidence, and the applicable lifecycle profile.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>A canonicalization profile must define the exact representation covered by the digest and, when signatures are used, the exact representation covered by the signature. It must also define how self-referential integrity fields are excluded or normalized. TMPA Core S1.0 requires that this profile be declared; it does not prescribe one universal byte-level canonicalization algorithm.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Schema validity is necessary but insufficient for acceptance into an authoritative governance view. A reader must still evaluate identifier uniqueness, type rules, stream order, authority, lifecycle legality, references, digest verification, and any applicable signature policy.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 4.2 Canonical Textual Encoding Profile</span></span>
<span class="line"><span></span></span>
<span class="line"><span>A canonical textual representation is not defined merely by choosing JSON, YAML, or Markdown. A versioned canonicalization profile is complete only when independent implementations can produce the same covered byte sequence from the same governed content.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>At minimum, the profile defines:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- character encoding and Unicode normalization form;</span></span>
<span class="line"><span>- line-ending normalization;</span></span>
<span class="line"><span>- deterministic field and collection ordering where order is not semantically significant;</span></span>
<span class="line"><span>- whitespace, escaping, quoting, and delimiter rules;</span></span>
<span class="line"><span>- numeric representation, including exponent, sign, and precision rules;</span></span>
<span class="line"><span>- timestamp syntax, timezone requirements, and fractional-second normalization;</span></span>
<span class="line"><span>- the distinction among absent, \`null\`, empty-string, and empty-collection values;</span></span>
<span class="line"><span>- whether textual bodies, including Markdown whitespace and line endings, are covered verbatim or normalized;</span></span>
<span class="line"><span>- how attachments and external evidence are represented through media type, byte length, content digest, and optional locator metadata;</span></span>
<span class="line"><span>- whether extension fields are covered by the digest and signature, and how unknown extensions are ordered or rejected;</span></span>
<span class="line"><span>- the schema, type-registry, and canonicalization-profile versions bound to the object;</span></span>
<span class="line"><span>- how self-referential integrity fields are excluded or normalized before hashing or signing.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Semantic equivalence is insufficient for integrity verification. Two objects that a human considers equivalent may produce different digests when they differ in Unicode form, line endings, numeric spelling, timestamp precision, field order, or extension treatment. C08 and C11 are therefore meaningful only relative to the same declared canonicalization profile and version.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>An external attachment or mutable URL is not authoritative evidence merely because it is referenced. A profile claiming integrity for external content records a content digest and the metadata required to identify the covered bytes. A locator may assist retrieval, but the locator alone does not preserve the referenced evidence.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 4.3 Aggregation and Governance-Reconstruction Procedure</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Given a finite unordered collection \`O\` of source candidates and a fixed rule profile \`P\`, a conforming implementation applies two stages.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`text</span></span>
<span class="line"><span>AGGREGATE(O):</span></span>
<span class="line"><span>  1. Discover each source artifact as a source candidate without assigning governance meaning to</span></span>
<span class="line"><span>     discovery order, filesystem order, transport order, or modification time.</span></span>
<span class="line"><span>  2. Preserve source identity and bytes, then parse the candidate envelope.</span></span>
<span class="line"><span>     Retain parse failures as source evidence and deterministic diagnostics.</span></span>
<span class="line"><span>  3. Canonically index object ids, writer streams, sequence numbers, task</span></span>
<span class="line"><span>     carriers, references, lifecycle locations, and integrity metadata.</span></span>
<span class="line"><span>  4. De-duplicate byte-identical source observations without deleting their</span></span>
<span class="line"><span>     provenance; retain non-identical same-id variants as separate candidates.</span></span>
<span class="line"><span>  5. Return the source-preserving canonical candidate set C and aggregation diagnostics.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>RECONSTRUCT(C, P):</span></span>
<span class="line"><span>  1. Validate object shape and document type.</span></span>
<span class="line"><span>     Retain invalid candidates for diagnostics, but exclude them from the</span></span>
<span class="line"><span>     authoritative candidate set.</span></span>
<span class="line"><span>  2. Recompute each digest under the declared canonicalization profile.</span></span>
<span class="line"><span>     Retain digest-mismatched objects as evidence of an integrity failure,</span></span>
<span class="line"><span>     but exclude them from the intact authoritative candidate set.</span></span>
<span class="line"><span>  3. Verify signatures when present. Record verification status and apply</span></span>
<span class="line"><span>     P&#39;s acceptance policy. An unverifiable signature never establishes</span></span>
<span class="line"><span>     authenticated integrity.</span></span>
<span class="line"><span>  4. Group intact candidates by object id.</span></span>
<span class="line"><span>     a. Same id and same canonical content: project one object while retaining</span></span>
<span class="line"><span>        every contributing \`source_id\` in Unicode code-point order.</span></span>
<span class="line"><span>     b. Same id and different canonical content: quarantine all variants</span></span>
<span class="line"><span>        from the authoritative graph and emit a duplicate-id conflict.</span></span>
<span class="line"><span>  5. Validate one-primary-carrier rules for task-oriented profiles and verify</span></span>
<span class="line"><span>     that follow-on reports, reviews, decisions, and corrections reference the</span></span>
<span class="line"><span>     carrier rather than creating ambiguous mutable task copies.</span></span>
<span class="line"><span>  6. Group accepted objects by writer stream and order by sequence.</span></span>
<span class="line"><span>     Detect duplicate sequence numbers and sequence gaps without inventing</span></span>
<span class="line"><span>     missing objects or using timestamps as substitutes.</span></span>
<span class="line"><span>  7. Build directed dependency edges only for relation types that P declares</span></span>
<span class="line"><span>     as ordering or lifecycle dependencies. Preserve other references as</span></span>
<span class="line"><span>     non-ordering graph links.</span></span>
<span class="line"><span>  8. Validate role authority, separation of duties, lifecycle source state,</span></span>
<span class="line"><span>     transition legality, preconditions, and required evidence.</span></span>
<span class="line"><span>     Invalid actions remain observable but do not change authoritative state.</span></span>
<span class="line"><span>  9. Detect missing references and cycles prohibited by P. Quarantine only</span></span>
<span class="line"><span>     the affected prohibited-cycle subgraph; retain unaffected valid objects.</span></span>
<span class="line"><span> 10. Construct the accepted partial-order process and governance graph from</span></span>
<span class="line"><span>     within-stream sequence edges and profile-defined cross-stream dependencies.</span></span>
<span class="line"><span>     Preserve unrelated nodes as concurrent and incomparable.</span></span>
<span class="line"><span> 11. When a canonical linear serialization is required for interchange or</span></span>
<span class="line"><span>     display, generate a deterministic topological serialization. Use object-id</span></span>
<span class="line"><span>     lexical order only as a tie-breaker among incomparable nodes; do not add</span></span>
<span class="line"><span>     those tie-breaker relations to the governance graph.</span></span>
<span class="line"><span> 12. Project task, message, workflow, responsibility, lifecycle, review,</span></span>
<span class="line"><span>     approval, recovery, and audit views.</span></span>
<span class="line"><span> 13. Canonically normalize both the reconstructed graph or view and the issue</span></span>
<span class="line"><span>     set, then return them together.</span></span></code></pre></div><p>The composed operation is:</p><p><code>R_P(A(O)) = (G, I)</code></p><p>where <code>A(O)</code> is the source-preserving canonical candidate set, <code>G</code> is the reconstructed partial-order process and governance graph, and <code>I</code> is the canonical issue set. The procedure is governed by the following invariants:</p><ul><li>source discovery, enumeration, and arrival order do not affect the final canonical output for the same source set;</li><li>aggregation preserves source evidence and does not silently decide governance conflicts;</li><li>one governed task has one stable primary carrier under a task-oriented profile;</li><li>every published object has one writer and belongs to one local serial stream;</li><li>timestamps do not override stream sequence or explicit dependency;</li><li>no cross-stream order is invented when the profile defines no causal or lifecycle relation;</li><li>any canonical linear serialization is a representation of the graph, not additional governance truth;</li><li>invalid, disputed, or rejected evidence is not silently erased;</li><li>a conflict is resolved only by a new authorized governance object;</li><li>the same canonical source set and fixed profile produce the same aggregated candidate set, reconstructed view, and issue set;</li><li>a partial or disputed view remains distinguishable from an authoritative view.</li></ul><p>Delayed evidence changes the available source set and may change the current view legitimately. A task-only set may be partial; the same process may become authoritative or disputed after reports, reviews, or decisions arrive. Determinism requires equal output for equal source sets, not identical output across different stages of an asynchronous process.</p><h2 id="_4-4-conflict-and-validation-handling" tabindex="-1">4.4 Conflict and Validation Handling <a class="header-anchor" href="#_4-4-conflict-and-validation-handling" aria-label="Permalink to &quot;4.4 Conflict and Validation Handling&quot;">​</a></h2><p>A reader applies the following behavior consistently with the normative requirements in Chapter 9:</p><table tabindex="0"><thead><tr><th>Condition</th><th>Required behavior</th></tr></thead><tbody><tr><td>Schema or type invalid</td><td>retain source for diagnostics, exclude from authoritative reconstruction, emit validation issue</td></tr><tr><td>Digest mismatch</td><td>retain source as integrity-failure evidence, exclude from intact authoritative set</td></tr><tr><td>Signature absent</td><td>permit TMPA Core processing when other requirements pass; do not claim authenticated integrity</td></tr><tr><td>Signature unverifiable</td><td>emit signature issue and do not place object in an authenticated view</td></tr><tr><td>Same ID, same canonical content</td><td>safely de-duplicate for projection while retaining every contributing source identity</td></tr><tr><td>Same ID, different canonical content</td><td>quarantine all variants from authoritative graph and emit critical duplicate-ID issue</td></tr><tr><td>Missing reference</td><td>retain object in a partial view and emit unresolved-reference issue</td></tr><tr><td>Stream sequence gap</td><td>mark stream incomplete; do not infer the missing object or transition</td></tr><tr><td>Duplicate stream sequence</td><td>retain conflicting objects, mark affected stream non-conformant, and keep affected state partial or disputed</td></tr><tr><td>Timestamp conflict</td><td>ignore timestamp as authority; use sequence and profile-defined dependencies</td></tr><tr><td>Illegal lifecycle transition</td><td>retain attempted transition as evidence, do not alter authoritative state, and emit lifecycle issue</td></tr><tr><td>Unauthorized role action</td><td>retain attempted action as evidence, do not apply it, and emit authorization issue</td></tr><tr><td>Prohibited cycle</td><td>quarantine affected subgraph, report cycle, and continue reconstructing unaffected valid objects</td></tr><tr><td>Parallel contradictory reviews</td><td>preserve every valid review until an authorized resolution object exists</td></tr></tbody></table><hr><h1 id="_5-threat-model-and-trust-assumptions" tabindex="-1">5. Threat Model and Trust Assumptions <a class="header-anchor" href="#_5-threat-model-and-trust-assumptions" aria-label="Permalink to &quot;5. Threat Model and Trust Assumptions&quot;">​</a></h1><h2 id="_5-1-protected-properties" tabindex="-1">5.1 Protected Properties <a class="header-anchor" href="#_5-1-protected-properties" aria-label="Permalink to &quot;5.1 Protected Properties&quot;">​</a></h2><p>TMPA is designed to protect the following properties:</p><ul><li>attribution of objects to declared creators and roles;</li><li>detection of object modification after publication;</li><li>visibility of lifecycle and authority violations;</li><li>preservation of conflicting evidence;</li><li>reconstruction of governed work after runtime interruption;</li><li>separation of execution, review, and approval responsibilities.</li></ul><h2 id="_5-2-trust-roots" tabindex="-1">5.2 Trust Roots <a class="header-anchor" href="#_5-2-trust-roots" aria-label="Permalink to &quot;5.2 Trust Roots&quot;">​</a></h2><p>A deployment must identify its trust roots. These may include:</p><ul><li>an identity provider;</li><li>a role-assignment authority;</li><li>a key registry or enterprise PKI;</li><li>a trusted storage boundary;</li><li>a human administrator or governance board;</li><li>a trusted protocol validator.</li></ul><p>TMPA does not create a trust root merely by writing a role name into a document. A role claim is valid only when the implementation can verify that the creator was authorized to act under that role at the relevant time.</p>`,20)])])}const m=n(i,[["render",r]]);export{h as __pageData,m as default};
