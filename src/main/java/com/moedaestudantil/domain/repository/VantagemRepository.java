package com.moedaestudantil.domain.repository;

import com.moedaestudantil.domain.entity.Vantagem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VantagemRepository extends JpaRepository<Vantagem, Long> {
    List<Vantagem> findByEmpresaParceiraId(Long empresaParceiraId);
}

