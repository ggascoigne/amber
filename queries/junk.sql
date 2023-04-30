--
ALTER TABLE setting
ALTER COLUMN "type"
TYPE VARCHAR(15);


UPDATE setting
SET
TYPE = 'perm-gate'
WHERE
TYPE = 'integer';