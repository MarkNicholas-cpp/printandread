# Quick Migration Script for Production Database
# Run this from the project root directory

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Running Flyway Migrations on Production" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Set environment variables
$env:SPRING_DATASOURCE_URL = "postgresql://production_db_postgres_6gz5_user:SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF@dpg-d4j0io6uk2gs73bhkldg-a:5432/production_db_postgres_6gz5"
$env:SPRING_DATASOURCE_USERNAME = "production_db_postgres_6gz5_user"
$env:SPRING_DATASOURCE_PASSWORD = "SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF"
$env:SPRING_PROFILES_ACTIVE = "production"

Write-Host "Database: production_db_postgres_6gz5" -ForegroundColor Yellow
Write-Host "Host: dpg-d4j0io6uk2gs73bhkldg-a" -ForegroundColor Yellow
Write-Host "Schema History Table: flyway_schema_history_printnread" -ForegroundColor Yellow
Write-Host ""
Write-Host "Starting Spring Boot application..." -ForegroundColor Green
Write-Host "Flyway will automatically run all 8 migrations on startup." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop after migrations complete." -ForegroundColor Yellow
Write-Host ""

cd backend
mvn spring-boot:run

