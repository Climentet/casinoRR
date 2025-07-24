// app/api/donate/route.ts
export async function POST(req: Request) {
  const newDonation = await req.json();

  // Leer el array actual
  const current = await fetch(`${process.env.EDGE_CONFIG}/donations`);
  const existing = await current.json();

  // Añadir la nueva donación
  const updated = Array.isArray(existing)
    ? [...existing, newDonation]
    : [newDonation];

  // Guardar el array actualizado
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
  return new Response(JSON.stringify({ message: 'Donación añadida', result }));
}