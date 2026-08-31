package com.denis.otp_challenge.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    private static final long MAX_BYTES = 5 * 1024 * 1024;
    private static final Set<String> ALLOWED_TYPES =
            Set.of("image/jpeg", "image/png", "image/webp", "image/avif");
    private static final Set<String> ALLOWED_FOLDERS =
            Set.of("champions", "collaborators");

    private final Cloudinary cloudinary;

    public UploadController(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @PostMapping("/image")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "champions") String folder) {

        validate(file, folder);

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "otp-challenge/" + folder,
                            "resource_type", "image",
                            "overwrite", true
                    ));

            return Map.of(
                    "url", result.get("secure_url"),
                    "publicId", result.get("public_id"),
                    "width", result.get("width"),
                    "height", result.get("height")
            );
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY, "No se pudo subir la imagen");
        }
    }

    private void validate(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se ha enviado ningún archivo");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "La imagen supera los 5 MB");
        }
        String type = file.getContentType();
        if (type == null || !ALLOWED_TYPES.contains(type)) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                    "Formato no permitido. Usa: " + String.join(", ", List.copyOf(ALLOWED_TYPES)));
        }
        if (!ALLOWED_FOLDERS.contains(folder)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Carpeta no válida. Usa: " + String.join(", ", List.copyOf(ALLOWED_FOLDERS)));
        }
    }
}