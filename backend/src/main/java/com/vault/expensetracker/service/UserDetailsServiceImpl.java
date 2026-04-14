package com.vault.expensetracker.service;

import com.vault.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .map(user -> User.withUsername(user.getEmail())
                        .password(user.getPassword())
                        .authorities("ROLE_USER")
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }
}