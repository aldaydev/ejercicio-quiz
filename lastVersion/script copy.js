//Reset de LocalStorage
(function clearStorage(){
    localStorage.clear();
})()


//Iniciar el QUIZZ
function start(){
    //Recogemos las opciones para el QUIZZ
    const catergory = document.getElementById('category').value;
    const difficulty = document.getElementById('difficulty').value;

    //Creamos la URL a partir de las opciones
    let getUrl = 'https://opentdb.com/api.php?amount=10' + catergory + difficulty;

    //Solicitamos los datos
    getQuestions(getUrl);
}

//Llamar a la API
async function getQuestions(url){
    //Llamar y descodificar API
    let response = await fetch(url);
    let questions = await response.json();

    //Recopilar data de la API
    getQuestionsData(questions.results);

    //Recogemos la sección inicial y la oculamos
    let initialSection = document.querySelector('.initialSection');
    initialSection.setAttribute('class', 'hidden');

    //Disponer la primera pregunta
    setQuestion();
}

//Recopilar la data de las preguntas
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
    //Recoger contador de preguntas
    let currentQuestion = JSON.parse(localStorage.count);

    //Modificar subtítulo con la pregunta
    let subheader = document.getElementById('subheader');
    subheader.innerHTML = JSON.parse(localStorage[currentQuestion]).question.toUpperCase();

    //Recogemos la sección de preguntas y comprobamos si existe
    let questionSection = document.querySelector('.questionSection');

    //Si la sección de preguntas ya existia
    if(questionSection){
        //Reescribir el article con las respuestas y sus radios
        let filledArticle = setAnswers(currentQuestion);

        //Recogemos el botón "responder"
        let answerBtn = document.getElementById('answerBtn');

        //Definimos texto del botón si es la última pregunta o no
        if(currentQuestion == 9){
            answerBtn.innerText = 'SEND ANSWER AND GET RESULTS';
        }else{
            answerBtn.innerText = 'SEND ANSWER';
        }

        questionSection.appendChild(filledArticle);
        questionSection.appendChild(answerBtn);

    }else{
        
        //Conformar un article con las respuestas y sus radios
        let filledArticle = setAnswers(currentQuestion);

        //Crear el botón de enviar respuesta
        let answerBtn= document.createElement('button');
        answerBtn.setAttribute('id', 'answerBtn');
        answerBtn.setAttribute('onclick', 'sendAnswer()');
        answerBtn.innerText = 'SEND ANSWER';

        //Crear sección con cada pregunta y meter el article
        questionSection = document.createElement('section');
        questionSection.setAttribute('class', 'questionSection');
        questionSection.appendChild(filledArticle);
        questionSection.appendChild(answerBtn);

        //Meter la section dentro del main
        let main = document.querySelector('main');
        main.appendChild(questionSection);
    }
}

//Crear/reescribir article con las respuestas y sus radios
function setAnswers(current){

    //Creamos o reseteamos el article
    let article = document.querySelector('.answers');
    if(article){
        article.innerHTML = '';
    }else{
        article = document.createElement('article');
    }

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
        article.setAttribute('class', 'answers');
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
    if(text === correctAnswer){
        localStorage.correct = parseInt(localStorage.correct) + 1;
    }else{
        localStorage.incorrect = parseInt(localStorage.incorrect) + 1;
    }

    //Sumamos una pregunta al contador
    localStorage.count = parseInt(localStorage.count) + 1;

    //Retornamos el numero de pregunta actualizado (Creo que puedo quitarlo)
    return JSON.parse(localStorage.count);
}


function getResults(){
    let correct = JSON.parse(localStorage.correct);
    let incorrect = JSON.parse(localStorage.incorrect);
    
    let questionSection = document.querySelector('.questionSection');
    let article = document.querySelector('.answers');
    article.innerHTML = "";

    let subheader = document.getElementById('subheader');
    subheader.innerHTML = 'WELL DONE! HERE ARE YOUR RESULTS';

    let answerBtn = document.getElementById('answerBtn');
    answerBtn.innerText = 'TRY AGAIN!';
    answerBtn.setAttribute('onclick', 'startAgain()');

    let chart = setChart(correct, incorrect);

    article.appendChild(chart);
}

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
                    'rgba(75, 192, 192, 0.6)', // Correctas
                    'rgba(255, 99, 132, 0.6)',  // Incorrectas
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',  // Posición de la leyenda
                },
                tooltip: {
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

function startAgain(){
    location.reload();
}
// https://opentdb.com/api_category.php
//https://opentdb.com/api.php?amount=10&category=31
//https://opentdb.com/api.php?amount=10
//https://opentdb.com/api.php?amount=10&category=10&difficulty=easy