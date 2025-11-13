package com.moedaestudantil.application.dto;

import java.time.LocalDateTime;

public class VantagemAdquiridaResponseDTO {
    private Long id;
    private Long vantagemId;
    private String vantagemNome;
    private String vantagemDescricao;
    private String vantagemImagemUrl;
    private String empresaParceiraNome;
    private String codigoUso;
    private Boolean resgatado;
    private LocalDateTime dataAdquisicao;
    private LocalDateTime dataResgate;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getVantagemId() { return vantagemId; }
    public void setVantagemId(Long vantagemId) { this.vantagemId = vantagemId; }
    public String getVantagemNome() { return vantagemNome; }
    public void setVantagemNome(String vantagemNome) { this.vantagemNome = vantagemNome; }
    public String getVantagemDescricao() { return vantagemDescricao; }
    public void setVantagemDescricao(String vantagemDescricao) { this.vantagemDescricao = vantagemDescricao; }
    public String getVantagemImagemUrl() { return vantagemImagemUrl; }
    public void setVantagemImagemUrl(String vantagemImagemUrl) { this.vantagemImagemUrl = vantagemImagemUrl; }
    public String getEmpresaParceiraNome() { return empresaParceiraNome; }
    public void setEmpresaParceiraNome(String empresaParceiraNome) { this.empresaParceiraNome = empresaParceiraNome; }
    public String getCodigoUso() { return codigoUso; }
    public void setCodigoUso(String codigoUso) { this.codigoUso = codigoUso; }
    public Boolean getResgatado() { return resgatado; }
    public void setResgatado(Boolean resgatado) { this.resgatado = resgatado; }
    public LocalDateTime getDataAdquisicao() { return dataAdquisicao; }
    public void setDataAdquisicao(LocalDateTime dataAdquisicao) { this.dataAdquisicao = dataAdquisicao; }
    public LocalDateTime getDataResgate() { return dataResgate; }
    public void setDataResgate(LocalDateTime dataResgate) { this.dataResgate = dataResgate; }
}

