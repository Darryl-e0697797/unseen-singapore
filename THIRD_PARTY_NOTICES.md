# Attribution and publication inventory

This file is an audit inventory, not a blanket license grant. Public release is pending completion of the review below.

| Material | Treatment |
| --- | --- |
| Original application code and Blender scripts | MIT, as scoped in LICENSE. Public repository release remains pending the data/media audit. |
| Original authored schematic GLBs | Retain model provenance and accuracy metadata; verify each manifest before release. |
| MapLibre GL JS and module worker | BSD-3-Clause; build copies the installed package's LICENSE.txt alongside public worker modules. |
| Other npm dependencies | Retain package licenses. Lockfile fixes the dependency graph used for the release audit. |
| OneMap street/satellite tiles | Streamed from the provider, not licensed under the application code license. Preserve visible SLA/OneMap attribution; no tile archive is included. Recheck public embedding terms before release. |
| OpenStreetMap-derived building footprints | ODbL obligations and OpenStreetMap attribution apply independently of application code. Preserve data source/license metadata. |
| MRT source datasets | Retain dataset-specific attribution and recorded source terms. Review source archive redistribution before public upload. |
| Agency publications and research quotations | Source links do not grant media redistribution rights. Do not include downloaded agency diagrams/photos or relicense them as app assets. |
| Tekong geographic context | Publication status remains unverified in its provenance record; resolve before public upload. |
| QA screenshots and captured video | May show third-party imagery; preserve attribution and review publication rights separately. |

Do not publish raw user prompts, credentials, local logs or private filesystem references with the public-source snapshot. A clean public-source snapshot can preserve the research trail without disclosing the working repository's entire history.

## Official terms checked 2026-09-15

- [OneMap API Terms](https://www.onemap.gov.sg/legal/apitermsofservice.html): API use is permitted subject to its terms, with dataset use governed separately; API permission is not a blanket grant over accessible intellectual property.
- [Singapore Open Data Licence](https://www.onemap.gov.sg/legal/opendatalicence.html): allows reuse and derived applications under its conditions, with exclusions including third-party rights.
- [OneMap site terms](https://www.onemap.gov.sg/legal/termsofuse.html): distinguish site materials from developer API use.
- [Official default-map example](https://www.onemap.gov.sg/docs/maps/index.html): demonstrates embedding and requires OneMap attribution.

These support retaining attribution and separating data from code licensing. They do not establish that the undocumented satellite endpoint or all screenshot/derivative uses have been cleared; those remain explicit audit items. No registration or acceptance of service terms on the user's behalf was performed.
