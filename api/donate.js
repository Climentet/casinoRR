export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { whom, amount, type } = req.body;

      if (!whom || !amount || !type) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }

      const current = await fetch(`${process.env.EDGE_CONFIG}/donations`);
      const raw = await current.text();
      let existing = [];

      try {
        existing = raw ? JSON.parse(raw) : [];
      } catch (err) {
        console.warn('⚠️ JSON inválido, creando nuevo array');
      }

      const updated = Array.isArray(existing)
        ? [...existing, { whom, amount, type }]
        : [{ whom, amount, type }];

      const putResponse = await fetch(`${process.env.EDGE_CONFIG}/donations`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (!putResponse.ok) {
        const errorText = await putResponse.text();
        console.error('❌ Error al guardar:', errorText);
        return res.status(500).json({ error: 'Error al guardar donación' });
      }

      return res.status(200).json({ message: 'Donación guardada', donation: { whom, amount, type } });
    } catch (error) {
      console.error('🚨 Error en POST:', error);
      return res.status(500).json({ error: 'Error interno' });
    }
  }

  if (req.method === 'GET') {
    try {
      const response = await fetch(`${process.env.EDGE_CONFIG}/donations`);
      const raw = await response.text();

      let donations = [];
      try {
        donations = raw ? JSON.parse(raw) : [];
      } catch (err) {
        console.warn('⚠️ Falló al parsear donaciones:', err);
      }

      return res.status(200).json({ donations });
    } catch (error) {
      console.error('🚨 Error en GET:', error);
      return res.status(500).json({ error: 'Error al recuperar donaciones' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}