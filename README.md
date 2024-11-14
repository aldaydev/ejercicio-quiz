# EJERCICIO QUIZZ

RAFA ALDAY

FUNCIONALIDADES IMPLEMENTADAS:

1. SELECCIÓN DE OPCIONES:

    - El usuario puede elegir una categoría de preguntas relacionadas con "entretenimeinto". Las opciones "Books", "Films", "Music", "Television" y "Video Games" están cogidas de la API de Open Travia DB. Además, he añadido una categoría extra con preguntas mías sobre Tarantino, que están alojadas arrays.

    - El usuario puede elegir la DIFICULTAD a tres niveles Easy, Medium y Hard. En función a la opción elegida, tanto en las preguntas que vienen de API como en las propias, las preguntas saldrán de forma aleatoria de una batería de preguntas independiente.

2. MANEJO DE ERRORES: Si hubiera cualquier error en la solicitud a la API, aparecerá un error en pantalla indicándoselo al usuario.

3. LOCAL STORAGE: Una vez elegidas las opciones, la batería de preguntas resultantes (así como las respuestas erroneas y correctas) se almacenarán en localstorage. También así un contador de preguntas respondidas, aciertos y errores.

3. SPA: Toda la página está hecha en una sola página, bien creando componentes nuevos en cada estado, bien editando los existentes. Especial importancia al único botón de la página, que irá cambiando su manejador de eventos para: a) iniciar el quizz, b) enviar pregunta c) Enviar última pregunta y mostrar resultados d) Empezar de nuevo

4. RESPUESTAS OBLIGATORIAS: Si el usuario no marca ninguna de las respuestas, aparecerá una animación del borde de las mismas que indicará que tiene que marcar alguna.

5. RESPUESTAS MODIFICABLES: Al indicar la respuesta elegida, se destaca con estilos. El usuario tendrá la opción de cambiar de respuesta antes de enviarla.

6. GRÁFICA FINAL: Al final de Quizz se mostrará una gráfica circular con los resultados.

7. RESET AUTOMÁTICO: En la pantalla final, junto con la gráfica, aparecerá un contador que nos indica que en 45segundos volveremos a la pantalla de inicio.

8. ESTILOS Y DISEÑO RESPONSIVE: He tratado de dar un estilo homogéneo a la app, incluyendo ciertas animaciones y transiciones, así como hacerla responsive con media queries.

