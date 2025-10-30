package com.moedaestudantil.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacoes_moedas")
public class TransacaoMoeda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @Column(nullable = false)
    private Double valor;

    @Column(nullable = false)
    private String tipo; // CREDITO ou DEBITO

    @Enumerated(EnumType.STRING)
    @Column(name = "responsavel_tipo", nullable = false)
    private TipoResponsavel responsavelTipo;

    @Column(name = "responsavel_nome", nullable = false)
    private String responsavelNome;

    @Column(nullable = false)
    private String descricao;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Aluno getAluno() { return aluno; }
    public void setAluno(Aluno aluno) { this.aluno = aluno; }

    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public TipoResponsavel getResponsavelTipo() { return responsavelTipo; }
    public void setResponsavelTipo(TipoResponsavel responsavelTipo) { this.responsavelTipo = responsavelTipo; }

    public String getResponsavelNome() { return responsavelNome; }
    public void setResponsavelNome(String responsavelNome) { this.responsavelNome = responsavelNome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }
}


