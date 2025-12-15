package com.smartspend.repository;

import com.smartspend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    // Método obrigatório para Spring Security
    Optional<User> findByEmail(String email);
}