package com.classhub.playground.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Judge0ResultResponse(

        @JsonProperty("stdout")
        String stdout,

        @JsonProperty("time")
        String time,

        @JsonProperty("memory")
        Double memory,

        @JsonProperty("stderr")
        String stderr,

        @JsonProperty("token")
        String token,

        @JsonProperty("compile_output")
        String compileOutput,

        @JsonProperty("message")
        String message,

        @JsonProperty("status")
        Judge0StatusResponse status

) {
}