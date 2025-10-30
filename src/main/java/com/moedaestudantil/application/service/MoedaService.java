package com.moedaestudantil.application.service;

import com.moedaestudantil.api.exception.ResourceNotFoundException;
import com.moedaestudantil.application.dto.EnvioMoedasRequestDTO;
import com.moedaestudantil.application.dto.TransacaoResponseDTO;
import com.moedaestudantil.domain.entity.Aluno;
import com.moedaestudantil.domain.entity.TipoResponsavel;
import com.moedaestudantil.domain.entity.TransacaoMoeda;
import com.moedaestudantil.domain.repository.AlunoRepository;
import com.moedaestudantil.domain.repository.TransacaoMoedaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MoedaService {

    private final AlunoRepository alunoRepository;
    private final TransacaoMoedaRepository transacaoRepository;

    public MoedaService(AlunoRepository alunoRepository, TransacaoMoedaRepository transacaoRepository) {
        this.alunoRepository = alunoRepository;
        this.transacaoRepository = transacaoRepository;
    }

    @Transactional
    public TransacaoResponseDTO enviarMoedasProfessorParaAluno(EnvioMoedasRequestDTO dto) {
        if (dto.getValor() == null || dto.getValor() <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero");
        }

        Aluno aluno = alunoRepository.findById(dto.getAlunoId())
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado"));

        aluno.setSaldoMoedas(aluno.getSaldoMoedas() + dto.getValor());
        alunoRepository.save(aluno);

        TransacaoMoeda t = new TransacaoMoeda();
        t.setAluno(aluno);
        t.setValor(dto.getValor());
        t.setTipo("CREDITO");
        t.setResponsavelTipo(TipoResponsavel.PROFESSOR);
        t.setResponsavelNome(dto.getProfessorNome());
        t.setDescricao(dto.getDescricao());
        TransacaoMoeda salva = transacaoRepository.save(t);

        return toResponse(salva);
    }

    @Transactional(readOnly = true)
    public List<TransacaoResponseDTO> listarExtratoAluno(Long alunoId) {
        return transacaoRepository.findByAluno_IdOrderByCriadoEmDesc(alunoId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransacaoResponseDTO> listarExtratoProfessorPorNome(String professorNome) {
        return transacaoRepository.findByResponsavelNomeOrderByCriadoEmDesc(professorNome)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private TransacaoResponseDTO toResponse(TransacaoMoeda t) {
        TransacaoResponseDTO r = new TransacaoResponseDTO();
        r.setId(t.getId());
        if (t.getAluno() != null) {
            r.setAlunoId(t.getAluno().getId());
            r.setAlunoNome(t.getAluno().getNome());
        }
        r.setValor(t.getValor());
        r.setTipo(t.getTipo());
        r.setResponsavelTipo(t.getResponsavelTipo().name());
        r.setResponsavelNome(t.getResponsavelNome());
        r.setDescricao(t.getDescricao());
        r.setCriadoEm(t.getCriadoEm());
        return r;
    }
}


