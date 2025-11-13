package com.moedaestudantil.application.service;

import com.moedaestudantil.api.config.JwtService;
import com.moedaestudantil.application.dto.AuthResponseDTO;
import com.moedaestudantil.application.dto.LoginRequestDTO;
import com.moedaestudantil.domain.entity.Aluno;
import com.moedaestudantil.domain.entity.EmpresaParceira;
import com.moedaestudantil.domain.entity.Professor;
import com.moedaestudantil.domain.repository.AlunoRepository;
import com.moedaestudantil.domain.repository.EmpresaParceiraRepository;
import com.moedaestudantil.domain.repository.ProfessorRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AlunoRepository alunoRepository;
    private final EmpresaParceiraRepository empresaParceiraRepository;
    private final ProfessorRepository professorRepository;
    private final JwtService jwtService;

    public AuthService(
            AlunoRepository alunoRepository,
            EmpresaParceiraRepository empresaParceiraRepository,
            ProfessorRepository professorRepository,
            JwtService jwtService
    ) {
        this.alunoRepository = alunoRepository;
        this.empresaParceiraRepository = empresaParceiraRepository;
        this.professorRepository = professorRepository;
        this.jwtService = jwtService;
    }

    @Transactional(readOnly = true)
    public AuthResponseDTO login(LoginRequestDTO request) {
        // Tentar encontrar como Aluno
        Aluno aluno = alunoRepository.findByEmail(request.getEmail()).orElse(null);
        if (aluno != null && aluno.getSenha().equals(request.getSenha())) {
            String token = jwtService.generateToken(aluno.getEmail(), "ALUNO", aluno.getId());
            return new AuthResponseDTO(token, "ALUNO", aluno.getId(), aluno.getNome(), aluno.getEmail());
        }

        // Tentar encontrar como Empresa
        EmpresaParceira empresa = empresaParceiraRepository.findByEmail(request.getEmail()).orElse(null);
        if (empresa != null && empresa.getSenha().equals(request.getSenha())) {
            String token = jwtService.generateToken(empresa.getEmail(), "EMPRESA", empresa.getId());
            return new AuthResponseDTO(token, "EMPRESA", empresa.getId(), empresa.getNome(), empresa.getEmail());
        }

        // Tentar encontrar como Professor
        Professor professor = professorRepository.findByEmail(request.getEmail()).orElse(null);
        if (professor != null && professor.getSenha().equals(request.getSenha())) {
            String token = jwtService.generateToken(professor.getEmail(), "PROFESSOR", professor.getId());
            return new AuthResponseDTO(token, "PROFESSOR", professor.getId(), professor.getNome(), professor.getEmail());
        }

        throw new BadCredentialsException("Email ou senha inválidos");
    }
}

