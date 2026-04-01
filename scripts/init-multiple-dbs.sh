#!/bin/bash
set -e

if [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_DB" ] || [ -z "$DEMO_DB_NAME" ]; then
    echo "ERROR: Required env vars are missing (POSTGRES_USER, POSTGRES_DB, DEMO_DB_NAME)."
    exit 1
fi

if [ "$DEMO_DB_NAME" = "$POSTGRES_DB" ]; then
    echo "ERROR: DEMO_DB_NAME must be different from POSTGRES_DB."
    exit 1
fi

echo "------------------------------------------------"
echo "⚙️  DB-TALKIE: Initializing multiple databases..."
echo "------------------------------------------------"

echo "-> Creating DEMO database: $DEMO_DB_NAME"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE "$DEMO_DB_NAME" WITH OWNER "$POSTGRES_USER";
EOSQL

echo "-> Injecting init-demo.sql into $DEMO_DB_NAME..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DEMO_DB_NAME" -f /tmp/init-demo.sql

echo "------------------------------------------------"
echo "✅ SUCCESS: Database '$DEMO_DB_NAME' created and populated."
echo "------------------------------------------------"