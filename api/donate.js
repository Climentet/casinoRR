// api/donate.js

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Leer datos del body
    const { whom, amount, type } = req.body;

    // Aquí iría la lógica que quieres (guardar, procesar, etc)
    console.log('Donación recibida:', whom, amount, type);

    // Responder éxito
    res.status(200).json({ message: 'Donación procesada correctamente' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
