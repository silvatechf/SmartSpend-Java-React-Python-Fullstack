package com.smartspend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority; // Importe este
import org.springframework.security.core.userdetails.UserDetails; // CRÍTICO
import java.util.Collection;
import java.util.List;

@Data 
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "_user")
// CRÍTICO: Implementar UserDetails
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Ou UUID, dependendo do que você padronizou

    private String username;
    private String email;
    private String password;
    
    // Você precisará desta linha quando criar a classe Role
    // @Enumerated(EnumType.STRING)
    // private Role role; 

    // --- IMPLEMENTAÇÃO OBRIGATÓRIA DA INTERFACE UserDetails ---

    // Retorna a Role para o Spring Security
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Se você não tiver a classe Role, use Collections.emptyList() temporariamente:
        return List.of(); 
    }

    // O método getPassword() é gerado pelo @Data
    // O método getUsername() é gerado pelo @Data (usamos 'email' como username)
    @Override
    public String getUsername() {
        return email; 
    }
    
    // Deixe estes como true por padrão
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}