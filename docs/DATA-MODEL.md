# Data model and coordinate contract

Runtime definitions in packages/shared/schema.ts are authoritative. All records have stable kebab-case IDs. Source, asset and story references are validated before build. Schema version starts at 1; breaking changes require migration and a decision record. Fields with unknown values use null rather than invented dates or numbers.

## Asset
asset_id, name, system, category, accuracy_class, source_ids, geometry_file, coordinate_space, coordinates, bounds, lods, temporal, description, public_description, engineering_description. Geometry evidence is independent of facts in the associated story. A sourced story never upgrades schematic geometry to documented. Model paths are restricted to /models/*.glb. Bounds and positions use metres; dimensions are never silently converted to centimetres.

## Coordinates
For real datasets: WGS84 EPSG:4326 input as longitude,latitude; transform with PROJ to Singapore SVY21 / EPSG:3414 easting,northing metres. Never treat degrees as metres. Keep vertical datum explicit and unknown until evidenced; surface-relative depth is not a survey height. Chunk origins stored in EPSG:3414, with double precision outside GPU.

Blender: right-handed X=east, Y=north, Z=up, metres, applied scale 1. Export glTF with export_yup=True. Runtime: X=east, Y=up, Z=south. Thus (E-E0,N-N0,H-H0) → (x,y,z)=(E-E0,H-H0,-(N-N0)). Do not rotate the exported root a second time. Automated axis fixture checks east, north, up after export.

Initial story uses coordinate_space=local-schematic. Its arbitrary origin is not georeferenced. No lat/lon is assigned. Buildings and tunnels use deliberately compressed story distances; render no geographic ruler or claimed tunnel depths. A separate Singapore orientation silhouette is schematic and cannot be used as a basemap.

## Temporal
valid_from and valid_to are ISO dates or null; intervals are [from,to). era is historical, present or future; status is operating, under-construction, planned, decommissioned, representative or scenario; confidence is high, medium or low. Future assets require scenario_id; missing time evidence means unavailable, not invisible by assumed date. Geometry class remains independent from operating status.

## Sources and claims
Source registry includes source_id, organisation, title, URL, access_date, publication_date, licence, terms_url, redistribution_status, intended_use, asset_ids, reliability_level and notes. Content records link claims and narrative variants to source IDs. Initial content contains concise original summaries, no source images or downloaded datasets. A link to a public page does not grant reuse rights to its maps.

## Geometry rights gate
geometry_origin (original or derived) and geometry_source_ids track geometry acquisition separately from narrative source_ids. Derived geometry requires geometry evidence and every associated source must explicitly permit redistribution at build time. Original schematic authoring has an empty geometry_source_ids array. A documented geometry class requires direct geometry evidence; a sourced explanation alone cannot establish it.
