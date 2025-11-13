package com.moedaestudantil.api.controller;

import com.moedaestudantil.application.dto.VantagemAdquiridaResponseDTO;
import com.moedaestudantil.application.service.VantagemAdquiridaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vantagens-adquiridas")
public class VantagemAdquiridaController {

    private final VantagemAdquiridaService vantagemAdquiridaService;

    public VantagemAdquiridaController(VantagemAdquiridaService vantagemAdquiridaService) {
        this.vantagemAdquiridaService = vantagemAdquiridaService;
    }

    @GetMapping("/alunos/{alunoId}")
    public ResponseEntity<List<VantagemAdquiridaResponseDTO>> listarPorAluno(@PathVariable Long alunoId) {
        return ResponseEntity.ok(vantagemAdquiridaService.listarPorAluno(alunoId));
    }

    @PostMapping("/resgatar/{codigoUso}")
    public ResponseEntity<VantagemAdquiridaResponseDTO> resgatarVantagem(@PathVariable String codigoUso) {
        return ResponseEntity.ok(vantagemAdquiridaService.resgatarVantagem(codigoUso));
    }
}

