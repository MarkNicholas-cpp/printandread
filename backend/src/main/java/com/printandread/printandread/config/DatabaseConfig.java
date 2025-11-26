package com.printandread.printandread.config;

import org.flywaydb.core.Flyway;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import javax.sql.DataSource;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@Configuration
@Profile("production")
public class DatabaseConfig {

    private final ConfigurableEnvironment environment;

    public DatabaseConfig(ConfigurableEnvironment environment) {
        this.environment = environment;
        // Convert URL early before Spring Boot reads it
        convertDatabaseUrlEarly();
    }

    /**
     * Converts the database URL early in the Spring Boot lifecycle
     * so that Flyway and other components get the correct JDBC URL
     */
    private void convertDatabaseUrlEarly() {
        String datasourceUrl = environment.getProperty("SPRING_DATASOURCE_URL");
        if (datasourceUrl == null || datasourceUrl.isEmpty()) {
            datasourceUrl = environment.getProperty("spring.datasource.url");
        }

        if (datasourceUrl != null && !datasourceUrl.isEmpty() && datasourceUrl.startsWith("postgresql://")) {
            String jdbcUrl = convertToJdbcUrl(datasourceUrl);

            // Override the property so Spring Boot uses the converted URL
            Map<String, Object> properties = new HashMap<>();
            properties.put("spring.datasource.url", jdbcUrl);
            environment.getPropertySources().addFirst(new MapPropertySource("converted-db-url", properties));
        }
    }

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties dataSourceProperties() {
        DataSourceProperties properties = new DataSourceProperties();

        // Get the connection string from environment variable
        String datasourceUrl = environment.getProperty("SPRING_DATASOURCE_URL");
        if (datasourceUrl == null || datasourceUrl.isEmpty()) {
            datasourceUrl = environment.getProperty("spring.datasource.url");
        }

        // Convert PostgreSQL connection string to JDBC format if needed
        if (datasourceUrl != null && !datasourceUrl.isEmpty()) {
            try {
                String jdbcUrl = convertToJdbcUrl(datasourceUrl);
                properties.setUrl(jdbcUrl);
                
                // Log the connection (without password) for debugging
                String safeUrl = jdbcUrl.replaceAll(":[^:@]+@", ":****@");
                System.out.println("Database connection URL: " + safeUrl);
            } catch (Exception e) {
                System.err.println("ERROR: Failed to convert database URL: " + e.getMessage());
                System.err.println("Original URL format: " + (datasourceUrl != null ? datasourceUrl.substring(0, Math.min(50, datasourceUrl.length())) + "..." : "null"));
                throw e;
            }
        } else {
            System.err.println("WARNING: SPRING_DATASOURCE_URL is not set!");
        }

        return properties;
    }

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }

    /**
     * Configure Flyway to use our DataSource
     */
    /**
     * Configure Flyway to use our DataSource
     * Uses project-specific schema history table to prevent conflicts when multiple applications share the same database
     */
    @Bean(initMethod = "migrate")
    public Flyway flyway(DataSource dataSource) {
        return Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .baselineOnMigrate(true)
                .validateOnMigrate(true)
                .cleanDisabled(true)
                .outOfOrder(false)
                .table("flyway_schema_history_printnread")  // Project-specific schema history table
                .load();
    }

    /**
     * Converts PostgreSQL connection string (postgresql://user:pass@host/db)
     * to JDBC format (jdbc:postgresql://host:port/database)
     * Properly handles Render's connection string format with credentials
     */
    private String convertToJdbcUrl(String url) {
        if (url == null || url.isEmpty()) {
            throw new IllegalArgumentException("Database URL is not set");
        }

        // If already JDBC format, return as is (but clean up credentials if present)
        if (url.startsWith("jdbc:postgresql://")) {
            // If credentials are embedded, remove them (they're provided separately)
            if (url.contains("@") && !url.contains("?")) {
                // Format: jdbc:postgresql://user:pass@host:port/db
                return url.replaceAll("jdbc:postgresql://[^:]+:[^@]+@", "jdbc:postgresql://");
            }
            return url;
        }

        // If PostgreSQL connection string format (Render format), convert it
        if (url.startsWith("postgresql://")) {
            try {
                // Parse the connection string: postgresql://user:password@host:port/database
                // Handle special characters in password by using proper URI parsing
                String cleanUrl = url;
                
                // Extract parts manually to handle special characters in password
                String withoutProtocol = url.substring("postgresql://".length());
                int atIndex = withoutProtocol.lastIndexOf("@");
                
                if (atIndex == -1) {
                    throw new IllegalArgumentException("Invalid connection string format: missing @");
                }
                
                String credentials = withoutProtocol.substring(0, atIndex);
                String hostAndPath = withoutProtocol.substring(atIndex + 1);
                
                // Split credentials
                int colonIndex = credentials.indexOf(":");
                String username = colonIndex > 0 ? credentials.substring(0, colonIndex) : credentials;
                String password = colonIndex > 0 ? credentials.substring(colonIndex + 1) : "";
                
                // Parse host and database
                int slashIndex = hostAndPath.indexOf("/");
                String hostPort = slashIndex > 0 ? hostAndPath.substring(0, slashIndex) : hostAndPath;
                String database = slashIndex > 0 ? hostAndPath.substring(slashIndex + 1) : "";
                
                // Split host and port
                int portColonIndex = hostPort.lastIndexOf(":");
                String host = portColonIndex > 0 ? hostPort.substring(0, portColonIndex) : hostPort;
                int port = portColonIndex > 0 ? Integer.parseInt(hostPort.substring(portColonIndex + 1)) : 5432;
                
                // Construct JDBC URL without credentials (username/password provided separately)
                // Use the internal hostname as-is from Render
                return String.format("jdbc:postgresql://%s:%d/%s", host, port, database);
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid database URL format: " + url + ". Error: " + e.getMessage(), e);
            }
        }

        // If neither format, return as is
        return url;
    }
}
