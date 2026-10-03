// Escandallo: las cuentas del simulador, sin DOM (se prueban con probar.py).
// Sigue a la cátedra de Administración de la Empresa Editorial (FFyL, UBA): invendibles sobre el CPU,
// derechos de autor sobre el PVP y el resto de los gastos comerciales sobre el INU.
'use strict';
const Escandallo = (() => {
  // Acepta "18.000", "18000", "4,6" y "4.6": con coma, los puntos son de miles; sin coma, un punto seguido de
  // tres cifras también (18.000), y si no, es decimal (4.6).
  const n = v => {
    let s = String(v == null ? '' : v).replace(/[\s$%]/g, '');
    if (s.indexOf(',') >= 0) s = s.replace(/\./g, '').replace(',', '.');
    else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    const x = Number(s); return isFinite(x) ? x : 0;
  };
  const pct = v => n(v) / 100;

  // Costo de impresión por demanda de un ejemplar: interior en pliegos A3 + tapa + encuadernado.
  function porDemanda(d) {
    const paginas = n(d.paginas), porPliego = n(d.porPliego) || 8, tapasPorPliego = n(d.tapasPorPliego) || 1;
    const pliegos = paginas / porPliego;
    const interior = pliegos * n(d.precioPliego), tapa = n(d.precioTapa) / tapasPorPliego, encuadernado = n(d.encuadernado);
    return { pliegos, interior, tapa, encuadernado, unitario: interior + tapa + encuadernado };
  }

  // Descuento comercial y plazo de cobro promedio ponderados por la participación de cada canal.
  function canales(L) {
    const filas = (L || []).map(c => ({ t: c.t || '', desc: n(c.desc), part: n(c.part), plazo: n(c.plazo) }))
      .map(c => Object.assign(c, { descPond: c.desc * c.part / 100, plazoPond: c.plazo * c.part / 100 }));
    const part = filas.reduce((s, c) => s + c.part, 0);
    return { filas, part, desc: filas.reduce((s, c) => s + c.descPond, 0), plazo: filas.reduce((s, c) => s + c.plazoPond, 0) };
  }

  function calcular(d) {
    const tirada = n(d.tirada), pvp = n(d.pvp);
    // Costo producto: el CPU directo, o el CPT (preproducción + industrial) dividido por la tirada.
    let pre = n(d.preproduccion), ind = 0, dem = null;
    if (d.modo === 'cpu') { pre = 0; ind = n(d.cpu) * tirada; }
    else if (d.modo === 'demanda') { dem = porDemanda(d); ind = dem.unitario * tirada; }
    else ind = n(d.industrial);
    const cpt = d.modo === 'cpu' ? n(d.cpu) * tirada : pre + ind;
    const cpu = d.modo === 'cpu' ? n(d.cpu) : tirada ? cpt / tirada : 0;

    const ch = d.usarCanales ? canales(d.canales) : null;
    const descPct = ch ? ch.desc : n(d.descuento);
    const descuento = pvp * descPct / 100, inu = pvp - descuento;

    const g = {
      invendibles: cpu * pct(d.invendibles),
      derechos: pvp * pct(d.derechos),
      incobrables: inu * pct(d.incobrables),
      comisiones: inu * pct(d.comisiones),
      flete: inu * pct(d.flete),
      publicidad: inu * pct(d.publicidad)
    };
    const gastos = Object.values(g).reduce((s, x) => s + x, 0);
    const cdu = cpu + gastos, mcu = inu - cdu, mcuPct = inu ? mcu / inu : 0;
    const cdt = cdu * tirada, ce = n(d.ce), cgt = cdt + ce;
    const pe = {
      estructura: mcu > 0 ? ce / mcu : null,          // ejemplares para que el MCU pague el CE
      edicion: inu > 0 ? cdt / inu : null,            // ejemplares para recuperar lo que costó la edición
      absorcion: inu > 0 ? (ce + cdt) / inu : null    // ejemplares para cubrir todo
    };
    return { tirada, pvp, pre, ind, cpt, cpu, dem, canales: ch, descPct, descuento, inu, gastos: g, totalGastos: gastos,
      cdu, cdt, ce, cgt, mcu, mcuPct, marginal: cdu, pe };
  }

  // El ejemplo de la clase 2 (Ejercicio 3): PVP $18.000, 40 %, tirada 2.000, CPU $2.100 → MCU $6.299,40 y MCU% 0,5833.
  const EJEMPLO = { modo: 'cpu', pvp: '18000', tirada: '2000', cpu: '2100', descuento: '40', usarCanales: false,
    canales: [{ t: 'Librerías', desc: '40', part: '60', plazo: '60' }, { t: 'Supermercados', desc: '50', part: '30', plazo: '90' }, { t: 'Kioscos', desc: '60', part: '10', plazo: '30' }],
    invendibles: '4,6', derechos: '5', flete: '3', comisiones: '2', publicidad: '6', incobrables: '2', ce: '',
    preproduccion: '', industrial: '', paginas: '200', porPliego: '8', precioPliego: '100', tapasPorPliego: '2', precioTapa: '400', encuadernado: '300' };

  return { calcular, canales, porDemanda, EJEMPLO, n };
})();
if (typeof module !== 'undefined') module.exports = Escandallo;
