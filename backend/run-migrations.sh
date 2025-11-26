#!/bin/bash
# Bash script to run Flyway migrations on production database
# Usage: ./run-migrations.sh

export SPRING_DATASOURCE_URL="postgresql://production_db_postgres_6gz5_user:SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF@dpg-d4j0io6uk2gs73bhkldg-a:5432/production_db_postgres_6gz5"
export SPRING_DATASOURCE_USERNAME="production_db_postgres_6gz5_user"
export SPRING_DATASOURCE_PASSWORD="SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF"
export SPRING_PROFILES_ACTIVE="production"

echo "========================================="
echo "Running Flyway Migrations"
echo "========================================="
echo ""

# Convert PostgreSQL URL to JDBC format
JDBC_URL="jdbc:postgresql://dpg-d4j0io6uk2gs73bhkldg-a:5432/production_db_postgres_6gz5"

echo "Database: production_db_postgres_6gz5"
echo "Host: dpg-d4j0io6uk2gs73bhkldg-a"
echo ""

# Run Spring Boot application with production profile to trigger migrations
echo "Starting Spring Boot application to run migrations..."
echo ""

cd backend
mvn spring-boot:run \
  -Dspring-boot.run.profiles=production \
  -Dspring.datasource.url="$JDBC_URL" \
  -Dspring.datasource.username="$SPRING_DATASOURCE_USERNAME" \
  -Dspring.datasource.password="$SPRING_DATASOURCE_PASSWORD"

echo ""
echo "========================================="
echo "Migration Complete!"
echo "========================================="

