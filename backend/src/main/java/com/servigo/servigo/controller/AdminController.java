package com.servigo.servigo.controller;

import com.servigo.servigo.dto.AdminUsuarioDTO;
import com.servigo.servigo.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/usuarios")
    public List<AdminUsuarioDTO> listarUsuarios() {
        return adminService.listarUsuarios();
    }
}