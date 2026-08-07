package com.classhub.playground.client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record Judge0SubmissionRequest(

        @JsonProperty("source_code")
        String sourceCode,

        @JsonProperty("language_id")
        Integer languageId,

        @JsonProperty("stdin")
        String standardInput,

        @JsonProperty("cpu_time_limit")
        Double cpuTimeLimit,

        @JsonProperty("memory_limit")
        Integer memoryLimit

) {
}