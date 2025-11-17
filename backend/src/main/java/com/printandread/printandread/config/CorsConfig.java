package com.printandread.printandread.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {
    
    @Value("${spring.web.cors.allowed-origins:*}")
    private String allowedOrigins;
    
    @Value("${spring.web.cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS}")
    private String allowedMethods;
    
    @Value("${spring.web.cors.allow-credentials:true}")
    private boolean allowCredentials;
    
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Parse allowed origins from environment variable or use wildcard
        if (allowedOrigins != null && !allowedOrigins.equals("*") && !allowedOrigins.isEmpty()) {
            // Multiple origins separated by comma
            String[] origins = allowedOrigins.split(",");
            config.setAllowedOrigins(Arrays.asList(origins));
        } else {
            // Allow all origins in development, or specific origins in production
            config.setAllowedOriginPatterns(List.of("*"));
        }
        
        // Parse allowed methods
        if (allowedMethods != null && !allowedMethods.isEmpty()) {
            String[] methods = allowedMethods.split(",");
            config.setAllowedMethods(Arrays.asList(methods));
        } else {
            config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        }
        
        // Allow all headers
        config.setAllowedHeaders(List.of("*"));
        
        // Allow credentials
        config.setAllowCredentials(allowCredentials);
        
        // Expose all response headers
        config.setExposedHeaders(List.of("*"));
        
        // Cache preflight response for 3600 seconds
        config.setMaxAge(3600L);
        
        // Apply CORS configuration to all endpoints
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
