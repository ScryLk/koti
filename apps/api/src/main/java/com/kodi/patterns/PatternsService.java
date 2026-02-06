package com.kodi.patterns;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kodi.patterns.model.Pattern;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatternsService {
    private final Path patternsDir;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PatternsService(@Value("${kodi.patterns.dir}") String dir) throws IOException {
        this.patternsDir = Path.of(dir);
        Files.createDirectories(this.patternsDir);
    }

    public List<Pattern> listAll(boolean includeDisabled) throws IOException {
        if (!Files.exists(patternsDir)) return List.of();
        List<Pattern> patterns = new ArrayList<>();
        try (var stream = Files.list(patternsDir)) {
            for (Path p : stream.filter(f -> f.toString().endsWith(".json")).collect(Collectors.toList())) {
                Pattern pat = objectMapper.readValue(p.toFile(), Pattern.class);
                if (includeDisabled || (pat.getDisabled() == null || !pat.getDisabled())) {
                    patterns.add(pat);
                }
            }
        }
        return patterns;
    }

    public Pattern addOrUpdate(Pattern pattern) throws IOException {
        if (pattern.getId() == null || pattern.getId().isBlank()) {
            throw new IllegalArgumentException("Pattern id is required");
        }
        Path file = patternsDir.resolve(pattern.getId() + ".json");
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(file.toFile(), pattern);
        return pattern;
    }

    public boolean disable(String id) throws IOException {
        Path file = patternsDir.resolve(id + ".json");
        if (!Files.exists(file)) return false;
        Pattern pat = objectMapper.readValue(file.toFile(), Pattern.class);
        pat.setDisabled(true);
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(file.toFile(), pat);
        return true;
    }
}
