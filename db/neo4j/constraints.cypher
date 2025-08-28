// Neo4j constraints for LineageNexus
CREATE CONSTRAINT unique_data_asset IF NOT EXISTS
FOR (n:DataAsset)
REQUIRE n.id IS UNIQUE;

CREATE CONSTRAINT unique_user IF NOT EXISTS
FOR (n:User)
REQUIRE n.externalId IS UNIQUE;

CREATE CONSTRAINT unique_role IF NOT EXISTS
FOR (n:Role)
REQUIRE n.name IS UNIQUE; 