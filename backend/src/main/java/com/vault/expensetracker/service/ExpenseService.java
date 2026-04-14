package com.vault.expensetracker.service;

import com.vault.expensetracker.model.Expense;
import com.vault.expensetracker.model.User;
import com.vault.expensetracker.repository.ExpenseRepository;
import com.vault.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User context not found"));
    }

    public List<Expense> getAllExpenses() {
        User user = getAuthenticatedUser();
        return expenseRepository.findByUserId(user.getId());
    }

    public Expense addExpense(Expense expense) {
        User user = getAuthenticatedUser();
        expense.setUser(user);
        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long id) {
        User user = getAuthenticatedUser();
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        // SECURITY CHECK: Ensure the expense belongs to the logged-in user
        if (!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this expense");
        }
        
        expenseRepository.deleteById(id);
    }
}