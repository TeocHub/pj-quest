# Percy Jackson Quest

Tests para fans del universo de Rick Riordan. Todo corre gratis en **GitHub Pages** (la página) y **Supabase** (el ranking), en el mismo proyecto de Supabase que los cuestionarios de FNAF y Avatar.

| Test | Estado | Carpeta |
| --- | --- | --- |
| El Cuestionario Definitivo de Percy Jackson | Disponible: 1189 preguntas (15 libros + 2 temporadas) | `quiz/` |
| ¿De qué dios serías hijo o hija? | Próximamente | — |

## Archivos

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | Portada con los tests |
| `comun.css`, `comun.js` | Estilos, símbolos de cada saga, idioma y nick compartidos |
| `config.js` | Datos de conexión a Supabase (compartidos) |
| `quiz/index.html` | El cuestionario |
| `quiz/preguntas.json` | Banco de preguntas en español, con los nombres de la traducción de Salamandra |
| `quiz/preguntas.en.json` | La versión en inglés, con los nombres originales |
| `supabase/1_esquema.sql` | Tablas, reglas de seguridad, vistas del ranking (incluida la vista por saga) y funciones (prefijo `pj_`) |
| `supabase/2_respuestas.sql` | La clave de respuestas que usa el servidor para corregir |
| `generar_respuestas.py` | Regenera `2_respuestas.sql` y revisa que la traducción coincida |

## Publicar (GitHub Pages)

En el repositorio: **Settings → Pages**, publicar desde la rama `main`, carpeta `/ (root)`. Queda en `https://teochub.github.io/pj-quest/`.

El backend ya está creado en Supabase y la clave de respuestas ya está cargada. Si alguna vez hay que recrearlo, ejecuta en el SQL Editor `supabase/1_esquema.sql` y después `supabase/2_respuestas.sql`.

## Filtro de spoilers

Al entrar no hay nada marcado: cada jugador marca solo los libros y temporadas que ya conoce (o una saga entera con un botón). Las preguntas de un libro pueden revelar lo que pasa en él y en los anteriores de su saga, nunca en los siguientes.

En el ranking se puede ver el total, solo a quienes completaron todo, o filtrar por saga para compararse solo en lo que se ha leído.

## Cuentas: nick + PIN de 6 dígitos

- Las cuentas de Percy Jackson son **independientes de las de FNAF y Avatar** (tabla `pj_players`). El filtro de nicks ofensivos sí es el mismo (`banned_words`).
- El primer jugador que publica con un nick lo registra con su PIN, guardado cifrado con bcrypt. Tras 5 PIN incorrectos, el nick se bloquea 15 minutos.
- La función interna `pj_auth` hace la verificación y la usará también el test de deidad.
- El servidor corrige las respuestas con su propia clave; nadie puede inventar un puntaje.

## Numeración de partes

Cada libro o temporada es una "parte". El número nunca cambia, porque el ranking lo usa, y la decena indica la saga:

| Partes | Saga | Estado |
| --- | --- | --- |
| 11-15 | Percy Jackson y los dioses del Olimpo | Disponible (96, 79, 80, 79 y 79 preguntas) |
| 16-19 | Extras de PJO: Los archivos del semidiós y los libros nuevos de Percy | Pendiente |
| 21-25 | Héroes del Olimpo | Disponible (82, 81, 89, 88 y 80 preguntas) |
| 31-35 | Las pruebas de Apolo | Disponible (64, 53, 54, 55 y 50 preguntas) |
| 41-43 | Las crónicas de los Kane | Pendiente |
| 51-53 | Magnus Chase | Pendiente |
| 61-69 | Cruces y otros (Semidioses y magos, El sol y la estrella…) | Pendiente |
| 91-92 | Serie de Disney+, temporadas 1 y 2 | Disponible (40 y 40 preguntas) |
| 93 | Serie de Disney+, temporada 3 | Cuando se estrene (20 de noviembre de 2026) |

- Las películas de Fox (2010 y 2013) quedan fuera a propósito: se consideran una franquicia aparte.
- Las preguntas de la serie se centran en lo que cambia respecto de los libros y se armaron contrastando con resúmenes publicados de cada episodio.
- Las preguntas de Héroes del Olimpo y Las pruebas de Apolo se ampliaron y verificaron contra el texto de los libros. Los nombres de Las pruebas de Apolo salen de la edición de Salamandra; Héroes del Olimpo se revisó en inglés, así que algunos nombres en español (por ejemplo, "Quíone" o "Cimopolea"), igual que algunos de la primera saga ("Procusto", "Tisífone", "Arcoíris"), podrían diferir de Salamandra: corrígelos si conoces el término exacto.

## Agregar o corregir preguntas

1. Edita `quiz/preguntas.json` y `quiz/preguntas.en.json` (mismos `id`, misma letra `correcta`):

```json
{
  "id": "pjo1-097",
  "nivel": "I",
  "sub": "La misión",
  "pregunta": "¿Pregunta?",
  "opciones": ["a", "b", "c", "d"],
  "correcta": "b"
}
```

   - `id` único y que nunca cambie (el ranking lo usa).
   - `nivel`: `B` (básico), `I` (intermedio), `A` (avanzado) o `E` (experto).
   - Para un **libro nuevo**, agrega un bloque con `parte` (según la tabla de arriba), `saga` (`pjo`, `hoo`, `toa`, `kane`, `mag`, `x` o `tv`; el nombre corto de cada saga se define en la herramienta que genera el banco o a mano en `corto`), `libro` (su número dentro de la saga), `corto`, `titulo` y `preguntas`. La página agrupa sola los libros por saga.

2. Ejecuta `python generar_respuestas.py`.
3. Ejecuta el nuevo `supabase/2_respuestas.sql` en el SQL Editor de Supabase.
4. Sube los cambios a GitHub.

**Si agregas preguntas a un libro que ya se jugó:** los puntajes guardados no se pierden. Cada resultado guarda el total que tenía el libro cuando se jugó; para sumar las preguntas nuevas, el jugador vuelve a jugarlo y se guarda su mejor resultado.

## Ranking

- Cada nick suma su mejor resultado en cada libro y temporada; repetir uno no suma dos veces.
- Orden: más correctas primero; en empate, quien respondió menos preguntas; luego quien llegó primero.
- Supabase marca avisos de "security definer" en las vistas y funciones públicas: es intencional, igual que en FNAF y Avatar. Las vistas solo exponen nick y números, nunca el PIN.

## Plan gratuito

Un proyecto gratuito de Supabase **se pausa tras una semana sin actividad**. Como FNAF, Avatar y Percy Jackson comparten proyecto, cualquiera de los tres lo mantiene activo. Si se pausa, se reactiva desde el panel con un clic.
