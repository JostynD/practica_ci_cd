const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Cambia este mensaje y haz push a main para ver el despliegue automático en acción
const MENSAJE = 'Version 1 - Despliegue inicial';
const nombre1 = 'Jostyn Fabricio Muentes Roca'
const nombre2 = 'Ariel Joel Choez Cedeño'

app.get('/', (req, res) => {
  res.send(`
    <html>
      <body style="font-family: sans-serif; text-align: center; margin-top: 80px;">
        <h1>${MENSAJE}</h1>
        <h2>${nombre1}</h2>
        <h2>${nombre2}</h2>
        <p>Desplegado: ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
