package com.moedaestudantil.domain.repository;

import com.moedaestudantil.domain.entity.TransacaoMoeda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransacaoMoedaRepository extends JpaRepository<TransacaoMoeda, Long> {
    List<TransacaoMoeda> findByAluno_IdOrderByCriadoEmDesc(Long alunoId);
    List<TransacaoMoeda> findByResponsavelNomeOrderByCriadoEmDesc(String responsavelNome);
}


