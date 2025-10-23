package com.moedaestudantil.api.controller;

import com.moedaestudantil.domain.entity.InstituicaoEnsino;
import com.moedaestudantil.domain.repository.InstituicaoEnsinoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/instituicoes")
public class InstituicaoEnsinoController {

    private final InstituicaoEnsinoRepository instituicaoEnsinoRepository;

    public InstituicaoEnsinoController(InstituicaoEnsinoRepository instituicaoEnsinoRepository) {
        this.instituicaoEnsinoRepository = instituicaoEnsinoRepository;
    }

    @GetMapping
    public ResponseEntity<List<InstituicaoEnsino>> listarTodas() {
        List<InstituicaoEnsino> instituicoes = instituicaoEnsinoRepository.findAll();
        return ResponseEntity.ok(instituicoes);
    }
}
