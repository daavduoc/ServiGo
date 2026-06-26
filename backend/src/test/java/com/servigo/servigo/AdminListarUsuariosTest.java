package com.servigo.servigo;

import com.servigo.servigo.service.AdminService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class AdminListarUsuariosTest {

    @Autowired
    private AdminService adminService;

    @Test
    void listarUsuariosCompleto_noDebeLanzarExcepcion() {
        adminService.listarUsuariosCompleto(0, 500, null, null);
    }
}
