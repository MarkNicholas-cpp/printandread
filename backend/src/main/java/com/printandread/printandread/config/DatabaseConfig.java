package com.printandread.printandread.config;

import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
@Profile("production")
public class DatabaseConfig {

    private final Environment environment;

    public DatabaseConfig(Environment environment) {
        this.environment = environment;
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
            String jdbcUrl = convertToJdbcUrl(datasourceUrl);
            properties.setUrl(jdbcUrl);
        }
        
        return properties;
    }

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }

    /**
     * Converts PostgreSQL connection string (postgresql://user:pass@host/db) 
     * to JDBC format (jdbc:postgresql://host:port/database)
     * Note: Credentials are removed from URL as they're provided separately
     */
    private String convertToJdbcUrl(String url) {
        if (url == null || url.isEmpty()) {
            throw new IllegalArgumentException("Database URL is not set");
        }

        // If already JDBC format, remove credentials if present
        if (url.startsWith("jdbc:postgresql://")) {
            // Remove credentials from JDBC URL if present
            return url.replaceAll("jdbc:postgresql://[^:]+:[^@]+@", "jdbc:postgresql://");
        }

        // If PostgreSQL connection string format, convert it
        if (url.startsWith("postgresql://")) {
            try {
                // Replace postgresql:// with http:// temporarily for URI parsing
                URI uri = new URI(url.replace("postgresql://", "http://"));
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();
                String database = path.startsWith("/") ? path.substring(1) : path;
                
                // Construct JDBC URL without credentials (they're provided via username/password properties)
                return String.format("jdbc:postgresql://%s:%d/%s", host, port, database);
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid database URL format: " + url, e);
            }
        }

        // If neither format, return as is
        return url;
    }
}

