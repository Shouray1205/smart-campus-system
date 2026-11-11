package com.smartcampus.config;

import com.smartcampus.security.AuthEntryPointJwt;
import com.smartcampus.security.JwtAuthenticationFilter;
import com.smartcampus.security.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final AuthEntryPointJwt unauthorizedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService,
                          AuthEntryPointJwt unauthorizedHandler,
                          JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.userDetailsService = userDetailsService;
        this.unauthorizedHandler = unauthorizedHandler;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)) // for H2 console
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/h2-console/**", "/error").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // Admin dashboard
                .requestMatchers("/api/dashboard/**").authenticated()

                // Students
                .requestMatchers(HttpMethod.GET, "/api/students/**").hasAnyRole("ADMIN", "FACULTY", "STUDENT")
                .requestMatchers(HttpMethod.POST, "/api/students/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/students/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/students/**").hasRole("ADMIN")

                // Faculty
                .requestMatchers(HttpMethod.GET, "/api/faculty/**").hasAnyRole("ADMIN", "FACULTY", "STUDENT")
                .requestMatchers(HttpMethod.POST, "/api/faculty/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/faculty/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/faculty/**").hasRole("ADMIN")

                // Courses
                .requestMatchers(HttpMethod.GET, "/api/courses/**").hasAnyRole("ADMIN", "FACULTY", "STUDENT")
                .requestMatchers(HttpMethod.POST, "/api/courses/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/courses/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/courses/**").hasRole("ADMIN")

                // Attendance
                .requestMatchers(HttpMethod.GET, "/api/attendance/**").hasAnyRole("ADMIN", "FACULTY", "STUDENT")
                .requestMatchers(HttpMethod.POST, "/api/attendance/**").hasAnyRole("ADMIN", "FACULTY")
                .requestMatchers(HttpMethod.PUT, "/api/attendance/**").hasAnyRole("ADMIN", "FACULTY")
                .requestMatchers(HttpMethod.DELETE, "/api/attendance/**").hasRole("ADMIN")

                // Timetable
                .requestMatchers(HttpMethod.GET, "/api/timetable/**").hasAnyRole("ADMIN", "FACULTY", "STUDENT")
                .requestMatchers(HttpMethod.POST, "/api/timetable/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/timetable/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/timetable/**").hasRole("ADMIN")

                // Fees
                .requestMatchers(HttpMethod.GET, "/api/fees/**").hasAnyRole("ADMIN", "STUDENT")
                .requestMatchers(HttpMethod.POST, "/api/fees/**").hasAnyRole("ADMIN", "STUDENT")
                .requestMatchers(HttpMethod.PUT, "/api/fees/**").hasAnyRole("ADMIN", "STUDENT")
                .requestMatchers(HttpMethod.DELETE, "/api/fees/**").hasRole("ADMIN")

                // Notices
                .requestMatchers(HttpMethod.GET, "/api/notices/**").hasAnyRole("ADMIN", "FACULTY", "STUDENT")
                .requestMatchers(HttpMethod.POST, "/api/notices/**").hasAnyRole("ADMIN", "FACULTY")
                .requestMatchers(HttpMethod.PUT, "/api/notices/**").hasAnyRole("ADMIN", "FACULTY")
                .requestMatchers(HttpMethod.DELETE, "/api/notices/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
