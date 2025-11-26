package com.printandread.printandread.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
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
    public FilterRegistrationBean<CorsFilter> corsFilterRegistration() {
        FilterRegistrationBean<CorsFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(corsFilter());
        registration.addUrlPatterns("/*");
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE); // Ensure CORS filter runs first
        return registration;
    }
    
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Parse allowed origins from environment variable
        if (allowedOrigins != null && !allowedOrigins.equals("*") && !allowedOrigins.isEmpty()) {
            // Multiple origins separated by comma - trim whitespace
            String[] origins = allowedOrigins.split(",");
            List<String> originList = Arrays.stream(origins)
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
            
            // When using specific origins with credentials, must use setAllowedOrigins (not patterns)
            config.setAllowedOrigins(originList);
            config.setAllowCredentials(allowCredentials);
            
            // Log for debugging
            System.out.println("CORS Configuration: Allowed Origins = " + originList);
            System.out.println("CORS Configuration: Allow Credentials = " + allowCredentials);
        } else {
            // Development mode: allow all origins (but disable credentials for wildcard)
            config.setAllowedOriginPatterns(List.of("*"));
            // When using wildcard patterns, credentials must be false
            config.setAllowCredentials(false);
            System.out.println("CORS Configuration: Using wildcard pattern (development mode)");
        }
        
        // Parse allowed methods
        if (allowedMethods != null && !allowedMethods.isEmpty()) {
            String[] methods = allowedMethods.split(",");
            List<String> methodList = Arrays.stream(methods)
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
            config.setAllowedMethods(methodList);
        } else {
            config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        }
        
        // Allow all headers
        config.setAllowedHeaders(List.of("*"));
        
        // Expose all response headers
        config.setExposedHeaders(List.of("*"));
        
        // Cache preflight response for 3600 seconds
        config.setMaxAge(3600L);
        
        // Apply CORS configuration to all endpoints
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
