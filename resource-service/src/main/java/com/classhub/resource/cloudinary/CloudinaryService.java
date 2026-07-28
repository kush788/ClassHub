package com.classhub.resource.cloudinary;

import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {

    Map<String, Object> uploadFile(
            MultipartFile file,
            String cloudinaryResourceType);

    void deleteFile(
            String publicId,
            String cloudinaryResourceType);
}