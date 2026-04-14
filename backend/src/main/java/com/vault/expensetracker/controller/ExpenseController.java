package com.vault.expensetracker.controller;

import com.vault.expensetracker.model.Expense;           // Fixes red line under 'Expense'
import com.vault.expensetracker.service.ExpenseService;   // Fixes red line under 'ExpenseService'
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;                                   // Fixes red line under 'List'

@RestController
@RequestMapping("/api/expenses")
// CrossOrigin is already handled globally in your SecurityConfig, 
// so you can technically remove this line to keep it clean.
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        return expenseService.addExpense(expense);
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
    }
}