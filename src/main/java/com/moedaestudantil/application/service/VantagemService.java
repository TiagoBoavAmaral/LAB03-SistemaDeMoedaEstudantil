package com.moedaestudantil.application.service;

import com.moedaestudantil.application.dto.VantagemRequestDTO;
import com.moedaestudantil.application.dto.VantagemResponseDTO;
import com.moedaestudantil.domain.entity.EmpresaParceira;
import com.moedaestudantil.domain.entity.Vantagem;
import com.moedaestudantil.domain.repository.EmpresaParceiraRepository;
import com.moedaestudantil.domain.repository.VantagemRepository;
import com.moedaestudantil.api.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VantagemService {

    private final VantagemRepository vantagemRepository;
    private final EmpresaParceiraRepository empresaParceiraRepository;

    public VantagemService(VantagemRepository vantagemRepository, EmpresaParceiraRepository empresaParceiraRepository) {
        this.vantagemRepository = vantagemRepository;
        this.empresaParceiraRepository = empresaParceiraRepository;
    }

    @Transactional
    public VantagemResponseDTO criar(VantagemRequestDTO dto) {
        EmpresaParceira empresa = empresaParceiraRepository.findById(dto.getEmpresaParceiraId())
                .orElseThrow(() -> new ResourceNotFoundException("Empresa Parceira não encontrada"));

        Vantagem vantagem = new Vantagem();
        vantagem.setNome(dto.getNome());
        vantagem.setDescricao(dto.getDescricao());
        vantagem.setCustoMoedas(dto.getCustoMoedas());
        vantagem.setImagemUrl(dto.getImagemUrl());
        vantagem.setEmpresaParceira(empresa);

        Vantagem salva = vantagemRepository.save(vantagem);
        return toResponse(salva);
    }

    @Transactional(readOnly = true)
    public List<VantagemResponseDTO> listarTodas() {
        return vantagemRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VantagemResponseDTO buscarPorId(Long id) {
        Vantagem vantagem = vantagemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vantagem não encontrada"));
        return toResponse(vantagem);
    }

    @Transactional
    public VantagemResponseDTO atualizar(Long id, VantagemRequestDTO dto) {
        Vantagem vantagem = vantagemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vantagem não encontrada"));

        EmpresaParceira empresa = empresaParceiraRepository.findById(dto.getEmpresaParceiraId())
                .orElseThrow(() -> new ResourceNotFoundException("Empresa Parceira não encontrada"));

        vantagem.setNome(dto.getNome());
        vantagem.setDescricao(dto.getDescricao());
        vantagem.setCustoMoedas(dto.getCustoMoedas());
        vantagem.setImagemUrl(dto.getImagemUrl());
        vantagem.setEmpresaParceira(empresa);

        return toResponse(vantagemRepository.save(vantagem));
    }

    @Transactional
    public void deletar(Long id) {
        if (!vantagemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vantagem não encontrada");
        }
        vantagemRepository.deleteById(id);
    }

    private VantagemResponseDTO toResponse(Vantagem v) {
        VantagemResponseDTO dto = new VantagemResponseDTO();
        dto.setId(v.getId());
        dto.setNome(v.getNome());
        dto.setDescricao(v.getDescricao());
        dto.setCustoMoedas(v.getCustoMoedas());
        dto.setImagemUrl(v.getImagemUrl());
        dto.setEmpresaParceiraId(v.getEmpresaParceira().getId());
        dto.setEmpresaParceiraNome(v.getEmpresaParceira().getNome());
        return dto;
    }
}

