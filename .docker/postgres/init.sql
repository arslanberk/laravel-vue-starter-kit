-- PostgreSQL initialization script
-- This script runs when the database is first created

-- Create testing database for running tests
SELECT 'CREATE DATABASE testing'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'testing')\gexec

-- Create additional databases if needed
-- SELECT 'CREATE DATABASE staging'
-- WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'staging')\gexec

-- You can add more database initialization here if needed
-- For example, creating additional users, extensions, etc.

-- Example: Enable UUID extension (uncomment if needed)
-- \c database_name
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Example: Create read-only user (uncomment if needed)
-- CREATE USER readonly_user WITH PASSWORD 'readonly_password';
-- GRANT CONNECT ON DATABASE database_name TO readonly_user;
-- GRANT USAGE ON SCHEMA public TO readonly_user;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO readonly_user; 