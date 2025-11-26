package com.printandread.printandread.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Universal CORS Filter - Nuclear Option
 * This filter runs FIRST (before all other filters) and ALWAYS adds CORS headers
 * to every response, regardless of other configurations.
 * 
 * Order: -1000 (runs before everything else)
 */
@Component
@Order(-1000)
public class UniversalCorsFilter implements Filter {
    
    private static final String ALLOWED_ORIGIN = "https://printandread-frontend.onrender.com";
    private static final String ALLOWED_METHODS = "GET, POST, PUT, DELETE, OPTIONS, PATCH";
    private static final String ALLOWED_HEADERS = "Content-Type, Authorization, X-Requested-With, Accept, Origin";
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("UniversalCorsFilter initialized - CORS headers will be added to all responses");
        System.out.println("Allowed Origin: " + ALLOWED_ORIGIN);
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                        FilterChain chain) throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        
        String origin = httpRequest.getHeader("Origin");
        
        // Always add CORS headers if origin matches or is null (for same-origin requests)
        if (origin == null || ALLOWED_ORIGIN.equals(origin)) {
            // Set CORS headers
            httpResponse.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
            httpResponse.setHeader("Access-Control-Allow-Methods", ALLOWED_METHODS);
            httpResponse.setHeader("Access-Control-Allow-Headers", ALLOWED_HEADERS);
            httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
            httpResponse.setHeader("Access-Control-Max-Age", "3600");
            httpResponse.setHeader("Access-Control-Expose-Headers", "*");
            
            // Log for debugging (only first few requests to avoid spam)
            if (httpRequest.getRequestURI().contains("/api/materials/recent")) {
                System.out.println("UniversalCorsFilter: Added CORS headers for request to " + httpRequest.getRequestURI());
                System.out.println("Origin: " + origin);
            }
        }
        
        // Handle preflight OPTIONS requests
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return; // Don't continue the filter chain for OPTIONS
        }
        
        // Continue with the filter chain
        chain.doFilter(request, response);
    }
    
    @Override
    public void destroy() {
        // Cleanup if needed
    }
}

