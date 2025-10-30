package com.moedaestudantil.api.controller;

import com.moedaestudantil.application.dto.EnvioMoedasRequestDTO;
import com.moedaestudantil.application.dto.TransacaoResponseDTO;
import com.moedaestudantil.application.service.MoedaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/moedas")
public class MoedaController {

    private final MoedaService moedaService;

    public MoedaController(MoedaService moedaService) {
        this.moedaService = moedaService;
    }

    // Envio de moedas por professor para um aluno
    @PostMapping("/professores/envio")
    public ResponseEntity<TransacaoResponseDTO> enviar(@Valid @RequestBody EnvioMoedasRequestDTO dto) {
        return ResponseEntity.ok(moedaService.enviarMoedasProfessorParaAluno(dto));
    }

    // Extrato do aluno
    @GetMapping("/alunos/{alunoId}/extrato")
    public ResponseEntity<List<TransacaoResponseDTO>> extratoAluno(@PathVariable Long alunoId) {
        return ResponseEntity.ok(moedaService.listarExtratoAluno(alunoId));
    }

    // Extrato do professor (por nome do professor)
    @GetMapping("/professores/extrato")
    public ResponseEntity<List<TransacaoResponseDTO>> extratoProfessor(@RequestParam("nome") String professorNome) {
        return ResponseEntity.ok(moedaService.listarExtratoProfessorPorNome(professorNome));
    }
}


