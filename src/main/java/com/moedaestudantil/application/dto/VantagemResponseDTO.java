package com.moedaestudantil.application.dto;

public class VantagemResponseDTO {
    private Long id;
    private String nome;
    private String descricao;
    private Double custoMoedas;
    private Long empresaParceiraId;
    private String empresaParceiraNome;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Long getEmpresaParceiraId() {
        return empresaParceiraId;
    }

    public void setEmpresaParceiraId(Long empresaParceiraId) {
        this.empresaParceiraId = empresaParceiraId;
    }

    public String getEmpresaParceiraNome() {
        return empresaParceiraNome;
    }

    public void setEmpresaParceiraNome(String empresaParceiraNome) {
        this.empresaParceiraNome = empresaParceiraNome;
    }
}

