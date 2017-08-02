CREATE OR REPLACE FUNCTION patient_compartment (args jsonb)  RETURNS json AS $$
  var pt = plv8.execute("select * from patient where id = $1", [args.patientId])
  var family = pt[0].resource.link.map(function(p){return p.other.reference})
  var pts = plv8.execute("select p.resource from relatedperson as rp \
    join patient as p on ('Patient/' || p.id) = rp.resource->'patient'->>'reference' \
    where ('RelatedPerson/' || rp.id) = any ($1)", [family])
  return pts.map(function(r){return r.resource})
$$ LANGUAGE plv8 IMMUTABLE STRICT;

select patient_compartment('{"patientId": "pt-mother-lindsey-ferrell"}');
