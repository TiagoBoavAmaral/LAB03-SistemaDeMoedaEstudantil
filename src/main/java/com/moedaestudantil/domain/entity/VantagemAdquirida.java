package com.moedaestudantil.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "vantagens_adquiridas")
public class VantagemAdquirida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vantagem_id", nullable = false)
    private Vantagem vantagem;

    @Column(nullable = false, unique = true, length = 36)
    private String codigoUso;

    @Column(nullable = false)
    private Boolean resgatado = false;

    @Column(nullable = false)
    private LocalDateTime dataAdquisicao;

    @Column
    private LocalDateTime dataResgate;

    @PrePersist
    protected void onCreate() {
        if (codigoUso == null) {
            codigoUso = UUID.randomUUID().toString();
        }
        if (dataAdquisicao == null) {
            dataAdquisicao = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Aluno getAluno() {
        return aluno;
    }

    public void setAluno(Aluno aluno) {
        this.aluno = aluno;
    }

    public Vantagem getVantagem() {
        return vantagem;
    }

    public void setVantagem(Vantagem vantagem) {
        this.vantagem = vantagem;
    }

    public String getCodigoUso() {
        return codigoUso;
    }

    public void setCodigoUso(String codigoUso) {
        this.codigoUso = codigoUso;
    }

    public Boolean getResgatado() {
        return resgatado;
    }

    public void setResgatado(Boolean resgatado) {
        this.resgatado = resgatado;
    }

    public LocalDateTime getDataAdquisicao() {
        return dataAdquisicao;
    }

    public void setDataAdquisicao(LocalDateTime dataAdquisicao) {
        this.dataAdquisicao = dataAdquisicao;
    }

    public LocalDateTime getDataResgate() {
        return dataResgate;
    }

    public void setDataResgate(LocalDateTime dataResgate) {
        this.dataResgate = dataResgate;
    }
}

