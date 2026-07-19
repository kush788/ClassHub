package com.classhub.workspace.util;

import java.security.SecureRandom;

import org.springframework.stereotype.Component;

@Component
public class JoinCodeGenerator {

    private static final String CHARACTERS =
            "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    private static final int CODE_LENGTH = 6;

    private final SecureRandom secureRandom = new SecureRandom();

    public String generate() {

        StringBuilder code = new StringBuilder(CODE_LENGTH);

        for (int index = 0; index < CODE_LENGTH; index++) {

            int randomIndex =
                    secureRandom.nextInt(CHARACTERS.length());

            code.append(CHARACTERS.charAt(randomIndex));
        }

        return code.toString();
    }
}