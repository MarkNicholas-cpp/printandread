package com.printandread.printandread.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ProductionConfig implements WebMvcConfigurer {
    
    @Value("${spring.web.cors.allowed-origins:*}")
    private String allowedOrigins;
    
    @Value("${spring.web.cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS}")
    private String allowedMethods;
    
    @Value("${spring.web.cors.allow-credentials:true}")
    private boolean allowCredentials;

    @Override
    @SuppressWarnings("null")
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        // Backup CORS configuration via WebMvcConfigurer
        // This works alongside CorsFilter to ensure CORS headers are always set
        if (allowedOrigins != null && !allowedOrigins.equals("*") && !allowedOrigins.isEmpty()) {
            String[] origins = allowedOrigins.split(",");
            String[] methods = allowedMethods != null && !allowedMethods.isEmpty() 
                    ? allowedMethods.split(",") 
                    : new String[]{"GET", "POST", "PUT", "DELETE", "OPTIONS"};
            registry.addMapping("/**")
                    .allowedOrigins(origins)
                    .allowedMethods(methods)
                    .allowedHeaders("*")
                    .allowCredentials(allowCredentials)
                    .maxAge(3600);
        } else {
            String[] methods = allowedMethods != null && !allowedMethods.isEmpty()
                    ? allowedMethods.split(",")
                    : new String[]{"GET", "POST", "PUT", "DELETE", "OPTIONS"};
            registry.addMapping("/**")
                    .allowedOriginPatterns("*")
                    .allowedMethods(methods)
                    .allowedHeaders("*")
                    .allowCredentials(false)
                    .maxAge(3600);
        }
    }
}

