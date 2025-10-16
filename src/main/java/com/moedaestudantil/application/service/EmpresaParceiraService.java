package com.moedaestudantil.application.service;

import com.moedaestudantil.application.dto.EmpresaParceiraRequestDTO;
import com.moedaestudantil.application.dto.EmpresaParceiraResponseDTO;
import com.moedaestudantil.domain.entity.EmpresaParceira;
import com.moedaestudantil.domain.repository.EmpresaParceiraRepository;
import com.moedaestudantil.api.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmpresaParceiraService {

    private final EmpresaParceiraRepository empresaParceiraRepository;

    public EmpresaParceiraService(EmpresaParceiraRepository empresaParceiraRepository) {
        this.empresaParceiraRepository = empresaParceiraRepository;
    }

    @Transactional
    public EmpresaParceiraResponseDTO criar(EmpresaParceiraRequestDTO dto) {
        EmpresaParceira e = new EmpresaParceira();
        e.setNome(dto.getNome());
        e.setEmail(dto.getEmail());
        e.setSenha(dto.getSenha());
        e.setCnpj(dto.getCnpj());
        EmpresaParceira salvo = empresaParceiraRepository.save(e);
        return toResponse(salvo);
    }

    @Transactional(readOnly = true)
    public EmpresaParceiraResponseDTO buscarPorId(Long id) {
        EmpresaParceira e = empresaParceiraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa Parceira não encontrada"));
        return toResponse(e);
    }

    @Transactional(readOnly = true)
    public List<EmpresaParceiraResponseDTO> listarTodos() {
        return empresaParceiraRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public EmpresaParceiraResponseDTO atualizar(Long id, EmpresaParceiraRequestDTO dto) {
        EmpresaParceira e = empresaParceiraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa Parceira não encontrada"));
        e.setNome(dto.getNome());
        e.setEmail(dto.getEmail());
        e.setSenha(dto.getSenha());
        e.setCnpj(dto.getCnpj());
        return toResponse(empresaParceiraRepository.save(e));
    }

    @Transactional
    public void deletar(Long id) {
        if (!empresaParceiraRepository.existsById(id)) {
            throw new ResourceNotFoundException("Empresa Parceira não encontrada");
        }
        empresaParceiraRepository.deleteById(id);
    }

    private EmpresaParceiraResponseDTO toResponse(EmpresaParceira e) {
        EmpresaParceiraResponseDTO r = new EmpresaParceiraResponseDTO();
        r.setId(e.getId());
        r.setNome(e.getNome());
        r.setEmail(e.getEmail());
        r.setCnpj(e.getCnpj());
        return r;
    }
}


