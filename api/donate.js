export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
      const { whom, amount, type } = req.body;

      if (!whom || !amount || !type) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      // Leer donaciones actuales
      const current = await fetch(`${process.env.EDGE_CONFIG}/donations`);
      let existing = [];

      try {
        const raw = await current.text();
        existing = raw ? JSON.parse(raw) : [];
      } catch (err) {
        console.warn('⚠️ Respuesta de lectura no era JSON válido:', err);
        existing = [];
      }

      const updated = Array.isArray(existing)
        ? [...existing, { whom, amount, type }]
        : [{ whom, amount, type }];

      // Guardar donaciones actualizadas
      const putResponse = await fetch(`${process.env.EDGE_CONFIG}/donations`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer TU_TOKEN` // solo si tu EDGE_CONFIG no incluye el token
        },
        body: JSON.stringify(updated),
      });

      if (!putResponse.ok) {
        const errorText = await putResponse.text();
        console.error('❌ Error al guardar en Edge Config:', errorText);
        return res.status(500).json({ error: 'Error al guardar donaciones' });
      }

      res.status(200).json({ message: 'Donación guardada', donation: { whom, amount, type } });
    } catch (error) {
      console.error('🚨 Error en POST:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}