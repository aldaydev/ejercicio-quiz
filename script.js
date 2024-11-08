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
    hideElement(initialSection);

    //Disponer la primera pregunta
    setQuestion();
}

//Recopilar la data de las preguntas
function getQuestionsData(questions){
    questions.forEach((q, i) => {

        let answers = q.incorrect_answers;
        answers.push(q.correct_answer);
        answers = answers.sort(() => Math.random() - 0.5);

        localStorage[i] = JSON.stringify({
            question: q.question,
            answers: answers,
            correct: q.correct_answer
        })
    });

    localStorage.count = JSON.stringify({
        responsed: 0,
        correct: 0,
        inccorect: 0
    });
}

//Ocultar elementos
function hideElement(element){
    element.setAttribute('class', 'hidden');
}

//Disponer la pregunta
function setQuestion(){

    //Modificar subtítulo con la pregunta
    let subheader = document.getElementById('subheader');
    let currentQuestion = JSON.parse(localStorage.count).responsed;
    subheader.innerHTML = JSON.parse(localStorage[currentQuestion]).question.toUpperCase();

    //Conformar un article con las respuestas y sus radios
    let filledArticle = setAnswers(currentQuestion);

    //Crear el botón de enviar respuesta
    let responseBtn= document.createElement('button');
    responseBtn.setAttribute('id', 'responseBtn');
    responseBtn.setAttribute('onclick', 'sendResponse()');
    responseBtn.innerText = 'SEND ANSWER';

    //Crear sección con cada pregunta y meter el article
    let questionSection = document.createElement('section');
    questionSection.setAttribute('class', 'questionSection');
    questionSection.appendChild(filledArticle);
    questionSection.appendChild(responseBtn);

    //Meter la section dentro del main
    let main = document.querySelector('main');
    main.appendChild(questionSection);
    
}

//Conformar un article con las respuestas y sus radios
function setAnswers(current){
    //Crear artículo donde irán las respuestas
    let article = document.createElement('article');
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
        answerText.innerHTML = currentAnswer;
        //Crear labbel y meter input + texto
        let labbel = document.createElement('labbel');
        labbel.setAttribute('class', 'answerLabbel')
        labbel.appendChild(input);
        labbel.appendChild(answerText);
        //Meter cada respuesta en el article
        article.setAttribute('class', 'answers');
        article.appendChild(labbel);

    })

    return article;

}

function sendResponse(){
    alert("Respuesta enviada");
    let inputResponse = document.querySelector('input[name="answer"]:checked');
    let textResponse = inputResponse.nextElementSibling.textContent;
    console.log(textResponse);

}

// https://opentdb.com/api_category.php
//https://opentdb.com/api.php?amount=10&category=31
//https://opentdb.com/api.php?amount=10
//https://opentdb.com/api.php?amount=10&category=10&difficulty=easy