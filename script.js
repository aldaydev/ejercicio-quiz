//Reset de LocalStorage
(function clearStorage(){
    localStorage.clear();
})()

//Inicialización del QUIZZ
function start(){
    //Recogemos las opciones elegidar por el usuario
    const category = document.getElementById('category').value;
    const difficulty = document.getElementById('difficulty').value;
    //Si ha elegido la categoría con MIS PREGUNTAS
    if(category == 'tarantino'){
        //Segun DIFICULTAD ELEGIDA, obtenemos las preguntas
        if(difficulty == '&difficulty=easy'){
            get10Questions(easyTarantino);
        }else if(difficulty == '&difficulty=medium'){
            get10Questions(mediumTarantino);
        }else if(difficulty == '&difficulty=hard'){
            get10Questions(hardTarantino);
        }
    //Si ha elegido preguntas que viene de la API
    }else{
        //Creamos la URL a partir de las opciones
        let getUrl = 'https://opentdb.com/api.php?amount=10' + category + difficulty;

        //Solicitamos los datos
        getQuestions(getUrl);
    }
}

//Llamar a la API
async function getQuestions(url){
    try{
        //Llamar y descodificar API
        let response = await fetch(url);
        let questions = await response.json();

        //Si hay algún problema con la petición, generamos nuevo Error
        if(!response.ok){
            throw new Error();
        }else{
            //Recopilar data de la API en localStorage
            getQuestionsData(questions.results);

            //Resetamos el article
            let article = document.querySelector('.article');
            article.innerHTML = '';

            //Disponer la primera pregunta
            setQuestion();
        }
        
    }catch(error){
        requestError('TOO MANY REQUESTS:');
    }
}

//Si la petición da un error
function requestError(error){

    //ErrorMsg1 -> Indicamos el error
    const errorMsg1 = document.createElement('h3');
    errorMsg1.classList.add('category__h3');
    errorMsg1.style.marginBottom = '0px';
    errorMsg1.style.color = 'red';
    errorMsg1.textContent = error;

    //ErrorMsg2 -> Decimos al usuario qué puede hacer
    const errorMsg2 = document.createElement('h3');
    errorMsg2.classList.add('category__h3');
    errorMsg2.style.color = 'red';
    errorMsg2.style.margin = '0px';
    errorMsg2.textContent = 'TRY AGAIN IN A FEW SECONDS OR CHOOSE THE "TARANTINO´S" CATEGORY"';

    //Añadimos los mensajes al article
    const article = document.querySelector('.article');
    article.appendChild(errorMsg1);
    article.appendChild(errorMsg2);
}

//Coger solo 10 de mis preguntas
function get10Questions(questions){
    //Aleatorizamos el orden de las preguntas
    const random = questions.sort(()=> 0.5 - Math.random());
    //Creamos las preguntas (solo 10)
    getTarantQuestions(random.slice(0, 10));
}

//Llamar a mis preguntas
function getTarantQuestions(questions){

    //Recorremos el array con los datos de cada pregunta
    questions.forEach((q, i) => {
        
        //Aleatorizamos el orden de las respuestas
        let answers = q.answers;
        answers = answers.sort(() => Math.random() - 0.5);

        //LocalStorage: Creamos claves por pregunta (preguntas, respuestas, correcta)
        localStorage[i] = JSON.stringify({
            question: q.question,
            answers: q.answers,
            correct: q.correct
        })
    });

    //LocalStorage: Creamos claves contador, correcta e incorrecta
    localStorage.count = 0;
    localStorage.correct = 0;
    localStorage.incorrect = 0;

    //Imprimiremos la primera pregunta
    setQuestion();
}

//Recopilar data preguntas API
function getQuestionsData(questions){
    //Recorremos el array con los datos de cada pregunta
    questions.forEach((q, i) => {
        //Tomamos las respuestas incorrectas, recorremos y decodificamos
        let answers = q.incorrect_answers;
        answers.map((answer)=>{
            decodeData(answer);
        });

        //Tomamos la respuesta correcta y la metemos con las incorrectas
        let correctAnswer = decodeData(q.correct_answer);
        answers.push(correctAnswer);

        //Aleatorizamos el orden de las respuestas
        answers = answers.sort(() => Math.random() - 0.5);

        //LocalStorage: Creamos claves por pregunta (preguntas, respuestas, correcta)
        localStorage[i] = JSON.stringify({
            question: decodeData(q.question),
            answers: answers,
            correct: correctAnswer
        })
    });

    //LocalStorage: Creamos claves contador, correcta e incorrecta
    localStorage.count = 0;
    localStorage.correct = 0;
    localStorage.incorrect = 0;
}

//Decodificar el formato de texto html en texto normal
function decodeData(text){
    let auxiliar = document.createElement('div');
    auxiliar.innerHTML = text;
    
    return auxiliar.textContent;
}

//Disponer la pregunta
function setQuestion(){

    //Recogemos la sección inicial
    let section = document.querySelector('.section');

    //Recoger contador de preguntas
    let currentQuestion = JSON.parse(localStorage.count);

    //Modificar subtítulo con la pregunta
    let subheader = document.getElementById('subheader');
    subheader.innerHTML = JSON.parse(localStorage[currentQuestion]).question;

    //Recogemos la sección de preguntas y comprobamos si existe
    let answerLabel = document.querySelector('.answerLabel');

    //Recogemos el botón "responder"
    let nextBtn = document.getElementById('nextBtn');

    //Si la sección de preguntas ya existia
    if(answerLabel){
        //Reescribir el article con las respuestas y sus radios
        let filledArticle = setAnswers(currentQuestion);

        //Definimos texto del botón si es la última pregunta o no
        currentQuestion == 9 ? nextBtn.innerText = 'SEND ANSWER AND GET RESULTS' : nextBtn.innerText = 'SEND ANSWER';

        section.appendChild(filledArticle);
        section.appendChild(nextBtn);

    }else{
        
        //Conformar un article con las respuestas y sus radios
        let filledArticle = setAnswers(currentQuestion);

        //Crear el botón de enviar respuesta
        nextBtn.setAttribute('onclick', 'sendAnswer()');
        nextBtn.innerText = 'SEND ANSWER';

        //Crear sección con cada pregunta y meter el article
        section.appendChild(filledArticle);
        section.appendChild(nextBtn);
    }
}

//Crear/reescribir article con las respuestas y sus radios
function setAnswers(current){

    //Creamos o reseteamos el article
    let article = document.querySelector('.article');
    article.innerHTML = '';

    //Seleccionamos las respuestas actuales
    let currentAnswers = JSON.parse(localStorage[current]).answers;

    //Recorrer respuestas y disponerlas
    currentAnswers.forEach(currentAnswer => {

        //Crear input de cada respuesta
        let input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'answer');
        input.setAttribute('class', 'radio');

        //Crear texto de cada respuesta
        let answerText = document.createElement('h3');
        answerText.setAttribute('class', 'answerText');
        answerText.innerHTML = currentAnswer;

        //Crear label y meter input + texto
        let label = document.createElement('label');
        label.setAttribute('class', 'answerLabel');
        label.appendChild(input);
        label.appendChild(answerText);

        //Meter cada respuesta en el article
        article.appendChild(label);
    })
    
    //Retornamos el article
    return article;
}

//------------------------------

//Enviar la respuesta
function sendAnswer(){
    //Recogemos el contador de preguntas
    let currentQuestion = JSON.parse(localStorage.count);

    //Recogemos el input checkeado
    let inputResponse = document.querySelector('input[name="answer"]:checked');

    //Si el input checkeado EXISTE...
    if(inputResponse){

        //ULTIMA PREGUNTA: Recogemos datos y vamos a resultados
        if(currentQuestion == 9){
            let textResponse = inputResponse.nextElementSibling.textContent;
            checkAnswers(textResponse);
            getResults();
        
        //ULTIMA PREGUNTA: Recogemos datos y vamos a otra pregunta
        }else{
            let textResponse = inputResponse.nextElementSibling.textContent;
            checkAnswers(textResponse);
            setQuestion();
        }
    //Si el input checkeado NO EXISTE...
    }else{
        //Mostramos mensaje de error
        notAnswered();
    }
}

//Mensaje de error si no marcas respuesta
function notAnswered(){
    let labels = Array.from(document.querySelectorAll('.answerLabel'));
    let notResponsed = document.querySelector('.notResponsed');
    labels.forEach((label)=>{
        label.classList.remove('notResponsed'); // Quita la clase de animación
        void label.offsetWidth; // "Reflujo" para reiniciar la animación en el DOM
        label.classList.add('notResponsed'); // Agrega la clase de animación nuevamente
    })
}


//Comprueba respuesta y añade contadores(responsed, correct, incorrect)
function checkAnswers(text){
    //Recogemos contador preguntas y respuesta correcta
    let currentQuestion = JSON.parse(localStorage.count);
    let correctAnswer = JSON.parse(localStorage[currentQuestion]).correct;
    
    //Comparamos respuesta indicada con respuesta correcta
    text === correctAnswer ? localStorage.correct = parseInt(localStorage.correct) + 1 : localStorage.incorrect = parseInt(localStorage.incorrect) + 1;

    //Sumamos una pregunta al contador
    localStorage.count = parseInt(localStorage.count) + 1;

    //Retornamos el numero de pregunta actualizado (Creo que puedo quitarlo)
    return JSON.parse(localStorage.count);
}

//Obtenemos los resultados finales
function getResults(){
    let correct = JSON.parse(localStorage.correct);
    let incorrect = JSON.parse(localStorage.incorrect);
    
    let article = document.querySelector('.article');
    article.innerHTML = "";

    let subheader = document.getElementById('subheader');
    subheader.innerHTML = 'Well done! Here are your results!';

    let nextBtn = document.getElementById('nextBtn');
    nextBtn.innerText = 'TRY AGAIN!';
    nextBtn.setAttribute('onclick', 'startAgain()');

    let chart = setChart(correct, incorrect);

    article.appendChild(chart);

    autoFinish();
}

//Disponemos la gráfica
function setChart(correct, incorrect){
    //Creamos el canvas
    let canvas = document.createElement('canvas');
    canvas.id = 'resultados-graph';

    new Chart(canvas, {
        type: 'pie',  // o 'doughnut' si prefieres un gráfico con un agujero en el centro
        data: {
            labels: ['Correct', 'Incorrect'],  // Etiquetas para cada sección
            datasets: [{
                label: 'Quiz Results',
                data: [correct, incorrect],  // Resultados del usuario
                backgroundColor: [
                    '#e4e1a7ec', // Correctas
                    '#3e3e36ec',  // Incorrectas
                ],
                borderColor: [
                    '#e4e1a7ec',
                    '#3e3e36ec',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: 'Lime',
                            size: 16
                        },
                        padding: 25,
                    }
                },
                tooltip: {
                    bodyFont:{
                        family: 'Lime',
                        size: 16
                    },
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}`;
                        }
                    }
                }
            }
        }
    });

    return canvas;
}

//------------------------------

//Recarga la página y vuelve a inicio
function startAgain(){
    location.reload();
}

//A los 30secs vuelve al inicio
function autoFinish() {
    let contador = 45;

    let section = document.querySelector('section');
    let returning = document.createElement('h3');
    returning.setAttribute('class', 'returningText');
    section.appendChild(returning);

    // Definir el setInterval
    const intervalo = setInterval(() => {
        contador--; 
        returning.textContent = `Returning to start in: ${contador} seconds`;

        // Si el contador llega a 0, recargar la página
        if (contador === 0) {
            clearInterval(intervalo); // Detener el setInterval
            location.reload();
        }
    }, 1000);
}

//Arrays con preguntas mías (Tarantino)
//No te preocupes Davinia, las meto en localStorage :)

const easyTarantino = [
    { "question": "Reservoir Dogs was the first movie directed by Quentin Tarantino.", "answers": ["True", "False"], "correct": "True" },
    { "question": "In Pulp Fiction, the character Vincent Vega is portrayed by John Travolta.", "answers": ["True", "False"], "correct": "True" },
    { "question": "Kill Bill is divided into three volumes.", "answers": ["True", "False"], "correct": "False" },
    { "question": "The Hateful Eight was Tarantino's eighth directed film.", "answers": ["True", "False"], "correct": "True" },
    { "question": "Leonardo DiCaprio starred in Django Unchained.", "answers": ["True", "False"], "correct": "True" },
    { "question": "Inglourious Basterds is set during World War II.", "answers": ["True", "False"], "correct": "True" },
    { "question": "Jackie Brown is based on a novel by Elmore Leonard.", "answers": ["True", "False"], "correct": "True" },
    { "question": "The main character in Kill Bill is known as 'The Bride.'", "answers": ["True", "False"], "correct": "True" },
    { "question": "Uma Thurman plays the lead role in Kill Bill.", "answers": ["True", "False"], "correct": "True" },
    { "question": "In Pulp Fiction, the briefcase's contents are never revealed.", "answers": ["True", "False"], "correct": "True" },
    { "question": "Which actor played Mr. Blonde in Reservoir Dogs?", "answers": ["Harvey Keitel", "Michael Madsen", "Tim Roth", "Steve Buscemi"], "correct": "Michael Madsen" },
    { "question": "In Pulp Fiction, what is the mysterious item in the briefcase?", "answers": ["A diamond", "Gold", "Unknown", "A rare gun"], "correct": "Unknown" },
    { "question": "Who stars as Django in Django Unchained?", "answers": ["Will Smith", "Samuel L. Jackson", "Jamie Foxx", "Denzel Washington"], "correct": "Jamie Foxx" },
    { "question": "In Kill Bill, what is the name of the swordmaker?", "answers": ["Pai Mei", "Bill", "O-Ren", "Hattori Hanzo"], "correct": "Hattori Hanzo" },
    { "question": "Who composed the soundtrack for Kill Bill?", "answers": ["RZA", "Hans Zimmer", "Danny Elfman", "Howard Shore"], "correct": "RZA" }
];

const mediumTarantino = [
    { "question": "Quentin Tarantino won an Oscar for Best Director for Pulp Fiction.", "answers": ["True", "False"], "correct": "False" },
    { "question": "The Hateful Eight was filmed in Ultra Panavision 70 format.", "answers": ["True", "False"], "correct": "True" },
    { "question": "Inglourious Basterds was released in 2009.", "answers": ["True", "False"], "correct": "True" },
    { "question": "In Django Unchained, who plays the character Dr. King Schultz?", "answers": ["Leonardo DiCaprio", "Jamie Foxx", "Christoph Waltz", "Samuel L. Jackson"], "correct": "Christoph Waltz" },
    { "question": "In Once Upon a Time in Hollywood, which real-life actress is depicted?", "answers": ["Natalie Wood", "Sharon Tate", "Grace Kelly", "Audrey Hepburn"], "correct": "Sharon Tate" },
    { "question": "What year was Pulp Fiction released?", "answers": ["1992", "1994", "1996", "1998"], "correct": "1994" },
    { "question": "Which actress plays Shoshanna Dreyfus in Inglourious Basterds?", "answers": ["Melanie Laurent", "Uma Thurman", "Diane Kruger", "Margot Robbie"], "correct": "Melanie Laurent" },
    { "question": "Who plays Bill in Kill Bill?", "answers": ["David Carradine", "Michael Madsen", "Samuel L. Jackson", "Harvey Keitel"], "correct": "David Carradine" },
    { "question": "What is the profession of Tim Roth's character in Pulp Fiction?", "answers": ["Bank robber", "Waiter", "Police officer", "Hitman"], "correct": "Bank robber" },
    { "question": "In Pulp Fiction, what song does Mia Wallace dance to?", "answers": ["Son of a Preacher Man", "Girl, You'll Be a Woman Soon", "You Never Can Tell", "Misirlou"], "correct": "You Never Can Tell" },
    { "question": "In Kill Bill, which assassin is the first target on The Bride's list?", "answers": ["O-Ren Ishii", "Elle Driver", "Vernita Green", "Budd"], "correct": "Vernita Green" },
    { "question": "What is the name of Tarantino's character in Pulp Fiction?", "answers": ["Jimmy", "Vince", "Lance", "Jules"], "correct": "Jimmy" },
    { "question": "Which Tarantino movie is set during the Civil War era?", "answers": ["Pulp Fiction", "Django Unchained", "The Hateful Eight", "Jackie Brown"], "correct": "The Hateful Eight" },
    { "question": "In Reservoir Dogs, which character dies in the warehouse at the end?", "answers": ["Mr. Orange", "Mr. White", "Mr. Pink", "Mr. Blonde"], "correct": "Mr. White" },
    { "question": "Who wrote the screenplay for the movie True Romance?", "answers": ["Oliver Stone", "Quentin Tarantino", "Tony Scott", "Martin Scorsese"], "correct": "Quentin Tarantino" }
];

const hardTarantino = [
    { "question": "Quentin Tarantino's first screenplay was for which film?", "answers": ["Reservoir Dogs", "True Romance", "Natural Born Killers", "Pulp Fiction"], "correct": "True Romance" },
    { "question": "Which martial art does The Bride learn from Pai Mei in Kill Bill?", "answers": ["Karate", "Kung Fu", "Tiger Style", "Snake Style"], "correct": "Kung Fu" },
    { "question": "In Reservoir Dogs, Mr. Blonde's real name is?", "answers": ["Joe Cabot", "Freddy Newandyke", "Vic Vega", "Eddie Bunker"], "correct": "Vic Vega" },
    { "question": "In Inglourious Basterds, what is Hans Landa's nickname?", "answers": ["The German Hunter", "The Jew Hunter", "The Nazi Hunter", "The Colonel"], "correct": "The Jew Hunter" },
    { "question": "In Kill Bill, which musical instrument is played by Bill?", "answers": ["Piano", "Guitar", "Trumpet", "Flute"], "correct": "Flute" },
    { "question": "What is the name of the diner where Pulp Fiction's opening scene takes place?", "answers": ["Jack Rabbit Slim's", "Big Kahuna Burger", "Hawthorne Grill", "Jack's Diner"], "correct": "Hawthorne Grill" },
    { "question": "In Django Unchained, what type of doctor is Dr. King Schultz?", "answers": ["Medical Doctor", "Dentist", "Psychiatrist", "Historian"], "correct": "Dentist" },
    { "question": "Who is the actress that starred in both Jackie Brown and Kill Bill?", "answers": ["Pam Grier", "Vivica A. Fox", "Daryl Hannah", "Uma Thurman"], "correct": "None" },
    { "question": "In Pulp Fiction, how many times does Jules say the word 'righteous'?", "answers": ["3", "2", "5", "1"], "correct": "3" },
    { "question": "Who played Mr. Blue in Reservoir Dogs?", "answers": ["Tim Roth", "Eddie Bunker", "Harvey Keitel", "Chris Penn"], "correct": "Eddie Bunker" },
    { "question": "Which Tarantino film was originally titled 'Black Mask'?", "answers": ["Reservoir Dogs", "Jackie Brown", "Kill Bill", "Inglourious Basterds"], "correct": "Jackie Brown" },
    { "question": "What was the original title for Inglourious Basterds?", "answers": ["Once Upon a War", "The Jew Hunter", "The Bastards", "Operation Kino"], "correct": "The Bastards" },
    { "question": "In Pulp Fiction, Mia Wallace overdoses on which drug?", "answers": ["Heroin", "Cocaine", "LSD", "Ecstasy"], "correct": "Heroin" },
    { "question": "Which Italian composer scored the soundtrack for The Hateful Eight?", "answers": ["Ennio Morricone", "Nino Rota", "Angelo Badalamenti", "Gianni Ferrio"], "correct": "Ennio Morricone" },
    { "question": "In Kill Bill, what does The Bride use to bury herself out of a coffin?", "answers": ["Her hands", "A sword", "A nail", "A flashlight"], "correct": "Her hands" }
];