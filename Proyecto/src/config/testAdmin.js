const oracledb = require('oracledb');

(async () => {
    try {
        const conn = await oracledb.getConnection({
            user: 'admin_Proyecto',                  // Usuario de ejemplo
            password: '12345',              // Contraseña por defecto del esquema HR
            connectString: 'localhost:1521/pdb_DejandoHuella' // Cambia según tu host, puerto y servicio
        });
        console.log('✅ Conexión exitosa con Admin_Proyecto');
        
        // Ejemplo: ejecutar un query simple
        const result = await conn.execute(`SELECT * FROM Usuarios`);
        console.log(result.rows);

        await conn.close();
    } catch (err) {
        console.error('❌ Error:', err);
    }
})();
