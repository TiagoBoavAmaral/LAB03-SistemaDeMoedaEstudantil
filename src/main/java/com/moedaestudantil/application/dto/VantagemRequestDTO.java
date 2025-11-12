package com.moedaestudantil.application.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class VantagemRequestDTO {

    @NotBlank
    private String nome;

    @NotBlank
    private String descricao;

    @NotNull
    @Positive
    private Double custoMoedas;

    private String imagemUrl;

    @NotNull
    private Long empresaParceiraId;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Double getCustoMoedas() {
        return custoMoedas;
    }

    public void setCustoMoedas(Double custoMoedas) {
        this.custoMoedas = custoMoedas;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    public Long getEmpresaParceiraId() {
        return empresaParceiraId;
    }

    public void setEmpresaParceiraId(Long empresaParceiraId) {
        this.empresaParceiraId = empresaParceiraId;
    }
}

