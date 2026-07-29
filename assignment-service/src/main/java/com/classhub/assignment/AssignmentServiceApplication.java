package com.classhub.assignment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients(
        basePackages = "com.classhub.assignment.client"
)
public class AssignmentServiceApplication {

    public static void main(String[] args) {

        SpringApplication.run(
                AssignmentServiceApplication.class,
                args
        );
    }
}