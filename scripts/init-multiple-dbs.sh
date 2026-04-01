#!/bin/bash
set -e

echo "------------------------------------------------"
echo "⚙️  DB-TALKIE: Initializing multiple databases..."
echo "------------------------------------------------"

echo "-> Creating DEMO database: $DEMO_DB_NAME"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE "$DEMO_DB_NAME";
EOSQL

echo "-> Injecting init-demo.sql into $DEMO_DB_NAME..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DEMO_DB_NAME" -f /tmp/init-demo.sql

echo "------------------------------------------------"
echo "✅ SUCCESS: Database '$DEMO_DB_NAME' created and populated."
echo "------------------------------------------------"