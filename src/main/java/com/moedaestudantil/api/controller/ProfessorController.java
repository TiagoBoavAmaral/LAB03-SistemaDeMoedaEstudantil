package com.moedaestudantil.api.controller;

import com.moedaestudantil.application.dto.ProfessorRequestDTO;
import com.moedaestudantil.application.dto.ProfessorResponseDTO;
import com.moedaestudantil.application.service.ProfessorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    private final ProfessorService professorService;

    public ProfessorController(ProfessorService professorService) {
        this.professorService = professorService;
    }

    @PostMapping
    public ResponseEntity<ProfessorResponseDTO> criar(@Valid @RequestBody ProfessorRequestDTO dto) {
        ProfessorResponseDTO resp = professorService.criar(dto);
        return ResponseEntity.created(URI.create("/api/professores/" + resp.getId())).body(resp);
    }

    @GetMapping
    public ResponseEntity<List<ProfessorResponseDTO>> listar() {
        return ResponseEntity.ok(professorService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfessorResponseDTO> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(professorService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfessorResponseDTO> atualizar(@PathVariable Long id, @Valid @RequestBody ProfessorRequestDTO dto) {
        return ResponseEntity.ok(professorService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        professorService.deletar(id);
    }
}
