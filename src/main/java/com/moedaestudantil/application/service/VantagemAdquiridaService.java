package com.moedaestudantil.application.service;

import com.moedaestudantil.api.exception.ResourceNotFoundException;
import com.moedaestudantil.application.dto.VantagemAdquiridaResponseDTO;
import com.moedaestudantil.domain.entity.Aluno;
import com.moedaestudantil.domain.entity.Vantagem;
import com.moedaestudantil.domain.entity.VantagemAdquirida;
import com.moedaestudantil.domain.repository.AlunoRepository;
import com.moedaestudantil.domain.repository.VantagemAdquiridaRepository;
import com.moedaestudantil.domain.repository.VantagemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VantagemAdquiridaService {

    private final VantagemAdquiridaRepository vantagemAdquiridaRepository;
    private final AlunoRepository alunoRepository;
    private final VantagemRepository vantagemRepository;

    public VantagemAdquiridaService(
            VantagemAdquiridaRepository vantagemAdquiridaRepository,
            AlunoRepository alunoRepository,
            VantagemRepository vantagemRepository
    ) {
        this.vantagemAdquiridaRepository = vantagemAdquiridaRepository;
        this.alunoRepository = alunoRepository;
        this.vantagemRepository = vantagemRepository;
    }

    @Transactional
    public VantagemAdquiridaResponseDTO criarVantagemAdquirida(Long alunoId, Long vantagemId) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado"));

        Vantagem vantagem = vantagemRepository.findById(vantagemId)
                .orElseThrow(() -> new ResourceNotFoundException("Vantagem não encontrada"));

        VantagemAdquirida va = new VantagemAdquirida();
        va.setAluno(aluno);
        va.setVantagem(vantagem);
        va.setResgatado(false);
        va.setDataAdquisicao(LocalDateTime.now());

        VantagemAdquirida salva = vantagemAdquiridaRepository.save(va);
        return toResponse(salva);
    }

    @Transactional(readOnly = true)
    public List<VantagemAdquiridaResponseDTO> listarPorAluno(Long alunoId) {
        return vantagemAdquiridaRepository.findByAluno_IdOrderByDataAdquisicaoDesc(alunoId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public VantagemAdquiridaResponseDTO resgatarVantagem(String codigoUso) {
        VantagemAdquirida va = vantagemAdquiridaRepository.findByCodigoUso(codigoUso)
                .orElseThrow(() -> new ResourceNotFoundException("Código de uso não encontrado"));

        if (va.getResgatado()) {
            throw new IllegalArgumentException("Esta vantagem já foi resgatada");
        }

        va.setResgatado(true);
        va.setDataResgate(LocalDateTime.now());
        VantagemAdquirida atualizada = vantagemAdquiridaRepository.save(va);

        return toResponse(atualizada);
    }

    private VantagemAdquiridaResponseDTO toResponse(VantagemAdquirida va) {
        VantagemAdquiridaResponseDTO dto = new VantagemAdquiridaResponseDTO();
        dto.setId(va.getId());
        dto.setVantagemId(va.getVantagem().getId());
        dto.setVantagemNome(va.getVantagem().getNome());
        dto.setVantagemDescricao(va.getVantagem().getDescricao());
        dto.setVantagemImagemUrl(va.getVantagem().getImagemUrl());
        dto.setEmpresaParceiraNome(va.getVantagem().getEmpresaParceira().getNome());
        dto.setCodigoUso(va.getCodigoUso());
        dto.setResgatado(va.getResgatado());
        dto.setDataAdquisicao(va.getDataAdquisicao());
        dto.setDataResgate(va.getDataResgate());
        return dto;
    }
}

