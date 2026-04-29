package com.example.studentapp.service;

import com.example.studentapp.model.Student;
import com.example.studentapp.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public void createStudent(Student student) { studentRepository.save(student); }
    public List<Student> getAllStudents() { return studentRepository.findAll(); }
    public Student getStudentById(Integer id) { return studentRepository.findById(id); }
    public void updateStudent(Integer id, Student student) { studentRepository.update(id, student); }
    public void deleteStudent(Integer id) { studentRepository.deleteById(id); }
}