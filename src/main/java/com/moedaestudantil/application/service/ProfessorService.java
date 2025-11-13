package com.moedaestudantil.application.service;

import com.moedaestudantil.application.dto.ProfessorRequestDTO;
import com.moedaestudantil.application.dto.ProfessorResponseDTO;
import com.moedaestudantil.domain.entity.Professor;
import com.moedaestudantil.domain.repository.ProfessorRepository;
import com.moedaestudantil.api.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessorService {

    private final ProfessorRepository professorRepository;

    public ProfessorService(ProfessorRepository professorRepository) {
        this.professorRepository = professorRepository;
    }

    @Transactional
    public ProfessorResponseDTO criar(ProfessorRequestDTO dto) {
        Professor p = new Professor();
        p.setNome(dto.getNome());
        p.setEmail(dto.getEmail());
        p.setSenha(dto.getSenha());
        p.setDepartamento(dto.getDepartamento());
        Professor salvo = professorRepository.save(p);
        return toResponse(salvo);
    }

    @Transactional(readOnly = true)
    public ProfessorResponseDTO buscarPorId(Long id) {
        Professor p = professorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Professor não encontrado"));
        return toResponse(p);
    }

    @Transactional(readOnly = true)
    public ProfessorResponseDTO buscarPorEmail(String email) {
        Professor p = professorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Professor não encontrado"));
        return toResponse(p);
    }

    @Transactional(readOnly = true)
    public List<ProfessorResponseDTO> listarTodos() {
        return professorRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public ProfessorResponseDTO atualizar(Long id, ProfessorRequestDTO dto) {
        Professor p = professorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Professor não encontrado"));
        p.setNome(dto.getNome());
        p.setEmail(dto.getEmail());
        if (dto.getSenha() != null && !dto.getSenha().isEmpty()) {
            p.setSenha(dto.getSenha());
        }
        p.setDepartamento(dto.getDepartamento());
        return toResponse(professorRepository.save(p));
    }

    @Transactional
    public void deletar(Long id) {
        if (!professorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Professor não encontrado");
        }
        professorRepository.deleteById(id);
    }

    private ProfessorResponseDTO toResponse(Professor p) {
        ProfessorResponseDTO r = new ProfessorResponseDTO();
        r.setId(p.getId());
        r.setNome(p.getNome());
        r.setEmail(p.getEmail());
        r.setDepartamento(p.getDepartamento());
        return r;
    }
}

