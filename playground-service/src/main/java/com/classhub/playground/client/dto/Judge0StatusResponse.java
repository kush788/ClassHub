package com.classhub.playground.client.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Judge0StatusResponse(

        @JsonProperty("id")
        Integer id,

        @JsonProperty("description")
        String description

) {
}