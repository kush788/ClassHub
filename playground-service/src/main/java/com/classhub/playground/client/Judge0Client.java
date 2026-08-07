package com.classhub.playground.client;

import com.classhub.playground.client.dto.Judge0ResultResponse;
import com.classhub.playground.client.dto.Judge0SubmissionRequest;
import com.classhub.playground.client.dto.Judge0TokenResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@FeignClient(
        name = "judge0-client",
        url = "${judge0.base-url}"
)
public interface Judge0Client {

    @PostMapping(
            value = "/submissions",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    Judge0TokenResponse createSubmission(
            @RequestParam(
                    value = "base64_encoded",
                    defaultValue = "false"
            )
            boolean base64Encoded,

            @RequestParam(
                    value = "wait",
                    defaultValue = "false"
            )
            boolean wait,

            @RequestBody
            Judge0SubmissionRequest request
    );

    @GetMapping(
            value = "/submissions/{token}",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    Judge0ResultResponse getSubmission(
            @PathVariable("token")
            String token,

            @RequestParam(
                    value = "base64_encoded",
                    defaultValue = "false"
            )
            boolean base64Encoded,

            @RequestParam("fields")
            String fields
    );
}