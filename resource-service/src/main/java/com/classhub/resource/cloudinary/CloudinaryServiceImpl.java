package com.classhub.resource.cloudinary;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.classhub.resource.exception.CloudinaryOperationException;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl
        implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    public Map<String, Object> uploadFile(
            MultipartFile file,
            String cloudinaryResourceType) {

        try {
            return cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type",
                            cloudinaryResourceType,
                            "folder",
                            "classhub/resources",
                            "use_filename",
                            true,
                            "unique_filename",
                            true,
                            "overwrite",
                            false));

        } catch (IOException exception) {
            throw new CloudinaryOperationException(
                    "Failed to upload file to Cloudinary.",
                    exception);
        }
    }

    @Override
    public void deleteFile(
            String publicId,
            String cloudinaryResourceType) {

        try {
            cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.asMap(
                            "resource_type",
                            cloudinaryResourceType,
                            "invalidate",
                            true));

        } catch (IOException exception) {
            throw new CloudinaryOperationException(
                    "Failed to delete file from Cloudinary.",
                    exception);
        }
    }
}