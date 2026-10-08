# Registro de no conformidades

Errores de proceso que llegaron a un archivo, una tarea o un entregable. Lo más nuevo, arriba. La regla va en el `CLAUDE.md` general: "Todo error que llegue a un archivo, una tarea o un entregable se anota en este registro".

Formato: `fecha · proyecto · qué pasó · causa · corrección · qué cambia para que no se repita · estado` (abierta / cerrada).

## Abiertas
- [AAAA-MM-DD] · [proyecto] · [qué pasó] · causa: [por qué] · corrección: [qué se hizo] · prevención: [qué regla o chequeo cambia] · abierta

## Cerradas
- Ejemplo · migración · Un script por lotes siguió después de fallar en un paso · causa: el control de errores no cortaba dentro del bucle · corrección: se verificó cada carpeta a mano · prevención: los lotes que mueven o escriben archivos corren de a uno, o con un control de error en cada paso · cerrada
