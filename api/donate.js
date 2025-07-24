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
      const existing = await current.json();

      // Añadir nueva donación
      const updated = Array.isArray(existing)
        ? [...existing, { whom, amount, type }]
        : [{ whom, amount, type }];

      // Guardar en Edge Config
      const response = await fetch(`${process.env.EDGE_CONFIG}/donations`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Solo si tu EDGE_CONFIG no incluye el token:
          // 'Authorization': `Bearer TU_TOKEN`
        },
        body: JSON.stringify(updated),
      });

      const result = await response.json();
      res.status(200).json({ message: 'Donación guardada', result });
    } catch (error) {
      console.error('🚨 Error en POST:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}