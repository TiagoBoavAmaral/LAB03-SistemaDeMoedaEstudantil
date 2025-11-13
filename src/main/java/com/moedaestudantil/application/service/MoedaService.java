package com.moedaestudantil.application.service;

import com.moedaestudantil.api.exception.ResourceNotFoundException;
import com.moedaestudantil.application.dto.EnvioMoedasRequestDTO;
import com.moedaestudantil.application.dto.TransacaoResponseDTO;
import com.moedaestudantil.domain.entity.Aluno;
import com.moedaestudantil.domain.entity.TipoResponsavel;
import com.moedaestudantil.domain.entity.TransacaoMoeda;
import com.moedaestudantil.domain.entity.Vantagem;
import com.moedaestudantil.domain.repository.AlunoRepository;
import com.moedaestudantil.domain.repository.TransacaoMoedaRepository;
import com.moedaestudantil.domain.repository.VantagemRepository;
import com.moedaestudantil.application.service.VantagemAdquiridaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MoedaService {

    private final AlunoRepository alunoRepository;
    private final TransacaoMoedaRepository transacaoRepository;
    private final VantagemRepository vantagemRepository;
    private final VantagemAdquiridaService vantagemAdquiridaService;

    public MoedaService(
            AlunoRepository alunoRepository,
            TransacaoMoedaRepository transacaoRepository,
            VantagemRepository vantagemRepository,
            VantagemAdquiridaService vantagemAdquiridaService
    ) {
        this.alunoRepository = alunoRepository;
        this.transacaoRepository = transacaoRepository;
        this.vantagemRepository = vantagemRepository;
        this.vantagemAdquiridaService = vantagemAdquiridaService;
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

    @Transactional
    public TransacaoResponseDTO trocarMoedasPorVantagem(Long alunoId, Long vantagemId) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado"));

        Vantagem vantagem = vantagemRepository.findById(vantagemId)
                .orElseThrow(() -> new ResourceNotFoundException("Vantagem não encontrada"));

        if (aluno.getSaldoMoedas() < vantagem.getCustoMoedas()) {
            throw new IllegalArgumentException("Saldo insuficiente. Necessário: " + vantagem.getCustoMoedas() + ", Disponível: " + aluno.getSaldoMoedas());
        }

        aluno.setSaldoMoedas(aluno.getSaldoMoedas() - vantagem.getCustoMoedas());
        alunoRepository.save(aluno);

        TransacaoMoeda t = new TransacaoMoeda();
        t.setAluno(aluno);
        t.setValor(vantagem.getCustoMoedas());
        t.setTipo("DEBITO");
        t.setResponsavelTipo(TipoResponsavel.EMPRESA);
        t.setResponsavelNome(vantagem.getEmpresaParceira().getNome());
        t.setDescricao("Troca por vantagem: " + vantagem.getNome());
        TransacaoMoeda salva = transacaoRepository.save(t);

        // Criar registro de vantagem adquirida
        vantagemAdquiridaService.criarVantagemAdquirida(alunoId, vantagemId);

        return toResponse(salva);
    }

    private TransacaoResponseDTO toResponse(TransacaoMoeda t) {
        TransacaoResponseDTO r = new TransacaoResponseDTO();
        r.setId(t.getId());
        if (t.getAluno() != null) {
            r.setAlunoId(t.getAluno().getId());
            r.setAlunoNome(t.getAluno().getNome());
            r.setAlunoEmail(t.getAluno().getEmail());
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


