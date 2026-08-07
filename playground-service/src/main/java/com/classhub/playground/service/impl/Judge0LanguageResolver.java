package com.classhub.playground.service.impl;

import com.classhub.playground.enums.ProgrammingLanguage;
import com.classhub.playground.exception.InvalidProgrammingLanguageException;
import org.springframework.stereotype.Component;

@Component
public class Judge0LanguageResolver {

    public int resolve(
            ProgrammingLanguage language
    ) {
        if (language == null) {
            throw new InvalidProgrammingLanguageException(
                    "Programming language is required."
            );
        }

        return switch (language) {
            case C -> 50;
            case CPP -> 54;
            case JAVA -> 62;
            case PYTHON -> 71;
        };
    }
}