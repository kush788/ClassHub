package com.classhub.resource.util;

import java.util.Locale;
import java.util.Set;

import org.springframework.web.multipart.MultipartFile;

import com.classhub.resource.entity.ResourceType;
import com.classhub.resource.exception.InvalidResourceFileException;

public final class ResourceFileUtil {

    private static final long MAX_FILE_SIZE =
            50L * 1024L * 1024L;

    private static final Set<String> ALLOWED_EXTENSIONS =
            Set.of(
                    "pdf",
                    "png",
                    "jpg",
                    "jpeg",
                    "gif",
                    "webp",
                    "mp4",
                    "doc",
                    "docx",
                    "ppt",
                    "pptx",
                    "xls",
                    "xlsx",
                    "txt",
                    "zip");

    private ResourceFileUtil() {
    }

    public static void validateFile(
            MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new InvalidResourceFileException(
                    "A file is required.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new InvalidResourceFileException(
                    "File size must not exceed 50 MB.");
        }

        String extension = getExtension(
                file.getOriginalFilename());

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new InvalidResourceFileException(
                    "Unsupported file type: " + extension);
        }
    }

    public static ResourceType detectResourceType(
            MultipartFile file) {

        String extension = getExtension(
                file.getOriginalFilename());

        return switch (extension) {

            case "png", "jpg", "jpeg", "gif", "webp" ->
                    ResourceType.IMAGE;

            case "mp4" ->
                    ResourceType.VIDEO;

            case "pdf" ->
                    ResourceType.PDF;

            case "doc", "docx", "txt", "xls", "xlsx" ->
                    ResourceType.DOCUMENT;

            case "ppt", "pptx" ->
                    ResourceType.PRESENTATION;

            case "zip" ->
                    ResourceType.ARCHIVE;

            default ->
                    ResourceType.OTHER;
        };
    }

    private static String getExtension(
            String fileName) {

        if (fileName == null || fileName.isBlank()) {
            throw new InvalidResourceFileException(
                    "The uploaded file has no valid filename.");
        }

        int lastDot = fileName.lastIndexOf('.');

        if (lastDot < 0 || lastDot == fileName.length() - 1) {
            throw new InvalidResourceFileException(
                    "The uploaded file has no extension.");
        }

        return fileName.substring(lastDot + 1)
                .toLowerCase(Locale.ROOT);
    }
    
    public static String determineCloudinaryResourceType(
            MultipartFile file) {

        ResourceType resourceType =
                detectResourceType(file);

        return switch (resourceType) {

            case IMAGE -> "image";

            case VIDEO -> "video";

            case PDF,
                 DOCUMENT,
                 PRESENTATION,
                 ARCHIVE,
                 OTHER -> "raw";
        };
    }
}