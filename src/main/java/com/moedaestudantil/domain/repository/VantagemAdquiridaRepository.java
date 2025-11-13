package com.moedaestudantil.domain.repository;

import com.moedaestudantil.domain.entity.VantagemAdquirida;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VantagemAdquiridaRepository extends JpaRepository<VantagemAdquirida, Long> {
    List<VantagemAdquirida> findByAluno_IdOrderByDataAdquisicaoDesc(Long alunoId);
    Optional<VantagemAdquirida> findByCodigoUso(String codigoUso);
}

