package com.moedaestudantil.api.controller;

import com.moedaestudantil.application.dto.VantagemRequestDTO;
import com.moedaestudantil.application.dto.VantagemResponseDTO;
import com.moedaestudantil.application.service.VantagemService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/vantagens")
public class VantagemController {

    private final VantagemService service;

    public VantagemController(VantagemService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<VantagemResponseDTO> criar(@Valid @RequestBody VantagemRequestDTO dto) {
        VantagemResponseDTO resp = service.criar(dto);
        return ResponseEntity.created(URI.create("/api/vantagens/" + resp.getId())).body(resp);
    }

    @GetMapping
    public ResponseEntity<List<VantagemResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VantagemResponseDTO> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }
}

