package com.kodi.patterns;

import com.kodi.patterns.model.Pattern;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patterns")
public class PatternsController {
    private final PatternsService service;

    public PatternsController(PatternsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Pattern>> list(@RequestParam(name = "includeDisabled", defaultValue = "false") boolean includeDisabled) throws IOException {
        return ResponseEntity.ok(service.listAll(includeDisabled));
    }

    @PostMapping
    public ResponseEntity<Pattern> add(@RequestBody Pattern pattern) throws IOException {
        return ResponseEntity.ok(service.addOrUpdate(pattern));
    }

    @PatchMapping("/{id}/disable")
    public ResponseEntity<?> disable(@PathVariable String id) throws IOException {
        boolean ok = service.disable(id);
        if (!ok) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(Map.of("id", id, "disabled", true));
    }
}
