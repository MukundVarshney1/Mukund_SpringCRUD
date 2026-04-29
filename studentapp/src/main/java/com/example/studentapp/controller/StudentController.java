package com.example.studentapp.controller;

import com.example.studentapp.model.Student;
import com.example.studentapp.service.StudentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "http://localhost:5173") // Enables CORS for Vite frontend
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    public void createStudent(@RequestBody Student student) { studentService.createStudent(student); }

    @GetMapping
    public List<Student> getAllStudents() { return studentService.getAllStudents(); }

    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Integer id) { return studentService.getStudentById(id); }

    @PutMapping("/{id}")
    public void updateStudent(@PathVariable Integer id, @RequestBody Student student) { studentService.updateStudent(id, student); }

    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Integer id) { studentService.deleteStudent(id); }
}