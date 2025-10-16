package com.moedaestudantil.application.dto;

public class AlunoResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String cpf;
    private String rg;
    private String endereco;
    private String curso;
    private Double saldoMoedas;
    private Long instituicaoEnsinoId;
    private String instituicaoEnsinoNome;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public String getRg() { return rg; }
    public void setRg(String rg) { this.rg = rg; }
    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    public String getCurso() { return curso; }
    public void setCurso(String curso) { this.curso = curso; }
    public Double getSaldoMoedas() { return saldoMoedas; }
    public void setSaldoMoedas(Double saldoMoedas) { this.saldoMoedas = saldoMoedas; }
    public Long getInstituicaoEnsinoId() { return instituicaoEnsinoId; }
    public void setInstituicaoEnsinoId(Long instituicaoEnsinoId) { this.instituicaoEnsinoId = instituicaoEnsinoId; }
    public String getInstituicaoEnsinoNome() { return instituicaoEnsinoNome; }
    public void setInstituicaoEnsinoNome(String instituicaoEnsinoNome) { this.instituicaoEnsinoNome = instituicaoEnsinoNome; }
}


