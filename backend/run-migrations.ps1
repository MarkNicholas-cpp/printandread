# PowerShell script to run Flyway migrations on production database
# Usage: .\run-migrations.ps1

$env:SPRING_DATASOURCE_URL = "postgresql://production_db_postgres_6gz5_user:SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF@dpg-d4j0io6uk2gs73bhkldg-a:5432/production_db_postgres_6gz5"
$env:SPRING_DATASOURCE_USERNAME = "production_db_postgres_6gz5_user"
$env:SPRING_DATASOURCE_PASSWORD = "SJetQUZD8GwXdMZx9iyhAK4n2EubZZTF"
$env:SPRING_PROFILES_ACTIVE = "production"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Running Flyway Migrations" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Convert PostgreSQL URL to JDBC format
$jdbcUrl = "jdbc:postgresql://dpg-d4j0io6uk2gs73bhkldg-a:5432/production_db_postgres_6gz5"

Write-Host "Database: production_db_postgres_6gz5" -ForegroundColor Yellow
Write-Host "Host: dpg-d4j0io6uk2gs73bhkldg-a" -ForegroundColor Yellow
Write-Host ""

# Run Spring Boot application with production profile to trigger migrations
Write-Host "Starting Spring Boot application to run migrations..." -ForegroundColor Green
Write-Host ""

cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=production -Dspring.datasource.url=$jdbcUrl -Dspring.datasource.username=$env:SPRING_DATASOURCE_USERNAME -Dspring.datasource.password=$env:SPRING_DATASOURCE_PASSWORD

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Migration Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan

