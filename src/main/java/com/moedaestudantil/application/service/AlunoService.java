package com.moedaestudantil.application.service;

import com.moedaestudantil.application.dto.AlunoRequestDTO;
import com.moedaestudantil.application.dto.AlunoResponseDTO;
import com.moedaestudantil.domain.entity.Aluno;
import com.moedaestudantil.domain.entity.InstituicaoEnsino;
import com.moedaestudantil.domain.repository.AlunoRepository;
import com.moedaestudantil.domain.repository.InstituicaoEnsinoRepository;
import com.moedaestudantil.api.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final InstituicaoEnsinoRepository instituicaoEnsinoRepository;

    public AlunoService(AlunoRepository alunoRepository, InstituicaoEnsinoRepository instituicaoEnsinoRepository) {
        this.alunoRepository = alunoRepository;
        this.instituicaoEnsinoRepository = instituicaoEnsinoRepository;
    }

    @Transactional
    public AlunoResponseDTO criar(AlunoRequestDTO dto) {
        InstituicaoEnsino inst = instituicaoEnsinoRepository.findById(dto.getInstituicaoEnsinoId())
                .orElseThrow(() -> new ResourceNotFoundException("InstituicaoEnsino não encontrada"));

        Aluno aluno = new Aluno();
        aluno.setNome(dto.getNome());
        aluno.setEmail(dto.getEmail());
        aluno.setSenha(dto.getSenha());
        aluno.setCpf(dto.getCpf());
        aluno.setRg(dto.getRg());
        aluno.setEndereco(dto.getEndereco());
        aluno.setCurso(dto.getCurso());
        aluno.setInstituicaoEnsino(inst);

        Aluno salvo = alunoRepository.save(aluno);
        return toResponse(salvo);
    }

    @Transactional(readOnly = true)
    public AlunoResponseDTO buscarPorId(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado"));
        return toResponse(aluno);
    }

    @Transactional(readOnly = true)
    public List<AlunoResponseDTO> listarTodos() {
        return alunoRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public AlunoResponseDTO atualizar(Long id, AlunoRequestDTO dto) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado"));

        InstituicaoEnsino inst = instituicaoEnsinoRepository.findById(dto.getInstituicaoEnsinoId())
                .orElseThrow(() -> new ResourceNotFoundException("InstituicaoEnsino não encontrada"));

        aluno.setNome(dto.getNome());
        aluno.setEmail(dto.getEmail());
        aluno.setSenha(dto.getSenha());
        aluno.setCpf(dto.getCpf());
        aluno.setRg(dto.getRg());
        aluno.setEndereco(dto.getEndereco());
        aluno.setCurso(dto.getCurso());
        aluno.setInstituicaoEnsino(inst);

        return toResponse(alunoRepository.save(aluno));
    }

    @Transactional
    public void deletar(Long id) {
        if (!alunoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Aluno não encontrado");
        }
        alunoRepository.deleteById(id);
    }

    private AlunoResponseDTO toResponse(Aluno aluno) {
        AlunoResponseDTO r = new AlunoResponseDTO();
        r.setId(aluno.getId());
        r.setNome(aluno.getNome());
        r.setEmail(aluno.getEmail());
        r.setCpf(aluno.getCpf());
        r.setRg(aluno.getRg());
        r.setEndereco(aluno.getEndereco());
        r.setCurso(aluno.getCurso());
        r.setSaldoMoedas(aluno.getSaldoMoedas());
        if (aluno.getInstituicaoEnsino() != null) {
            r.setInstituicaoEnsinoId(aluno.getInstituicaoEnsino().getId());
            r.setInstituicaoEnsinoNome(aluno.getInstituicaoEnsino().getNome());
        }
        return r;
    }
}


