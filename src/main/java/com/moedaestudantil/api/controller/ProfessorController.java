package com.moedaestudantil.api.controller;

import com.moedaestudantil.application.dto.ProfessorDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    @GetMapping
    public ResponseEntity<List<ProfessorDTO>> listar() {
        // Lista simples pré-cadastrada (pode migrar para BD no futuro)
        List<ProfessorDTO> professores = Arrays.asList(
                new ProfessorDTO(1L, "Prof. Maria"),
                new ProfessorDTO(2L, "Prof. João"),
                new ProfessorDTO(3L, "Prof. Ana")
        );
        return ResponseEntity.ok(professores);
    }
}


