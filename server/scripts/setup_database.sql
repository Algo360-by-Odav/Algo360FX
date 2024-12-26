-- Create user if not exists
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'algo360fx') THEN
      CREATE USER algo360fx WITH PASSWORD 'algo360fx';
   END IF;
END
$do$;

-- Create database if not exists
SELECT 'CREATE DATABASE algo360fx'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'algo360fx')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE algo360fx TO algo360fx;
ALTER USER algo360fx WITH SUPERUSER;
