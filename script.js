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
    hideElement(initialSection);

    //Disponer la primera pregunta
    setQuestion();
}

//Recopilar la data de las preguntas
function getQuestionsData(questions){

    questions.forEach((q, i) => {

        let answers = q.incorrect_answers;
        answers.map((answer)=>{
            decodeData(answer);
        })
        let correctAnswer = decodeData(q.correct_answer);
        answers.push(correctAnswer);

        answers = answers.sort(() => Math.random() - 0.5);

        localStorage[i] = JSON.stringify({
            question: decodeData(q.question),
            answers: answers,
            correct: correctAnswer
        })
    });

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

//Ocultar elementos
function hideElement(element){
    element.setAttribute('class', 'hidden');
}

//Disponer la pregunta
function setQuestion(){

    let currentQuestion = JSON.parse(localStorage.count);
    //Modificar subtítulo con la pregunta
    let subheader = document.getElementById('subheader');
    subheader.innerHTML = JSON.parse(localStorage[currentQuestion]).question.toUpperCase();

    let questSecTest = document.querySelector('.questionSection');

    if(questSecTest){
        //Conformar un article con las respuestas y sus radios
        let filledArticle = setAnswers(currentQuestion);
        let responseBtn = document.getElementById('responseBtn');
        if(currentQuestion == 9){
            responseBtn.innerText = 'SEND ANSWER AND GET RESULTS';
        }else{
            responseBtn.innerText = 'SEND ANSWER';
        }
        let questionSection = document.querySelector('.questionSection');
        questionSection.appendChild(filledArticle);
        questionSection.appendChild(responseBtn);

    }else{
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
}

//Conformar un article con las respuestas y sus radios
function setAnswers(current){
    //Seleccionamos las respuestas actuales
    let currentAnswers = JSON.parse(localStorage[current]).answers;
    let article = document.querySelector('.answers');
    if(article){
        article.innerHTML = '';
    }else{
        article = document.createElement('article');
    }
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
        //Crear labbel y meter input + texto
        let label = document.createElement('labbel');
        label.setAttribute('class', 'answerLabbel');
        label.appendChild(input);
        label.appendChild(answerText);
        //Meter cada respuesta en el article
        article.setAttribute('class', 'answers');
        article.appendChild(label);
    })

    return article;
}

function resetArticle(article){
    
}

//------------------------------

//Enviar la respuesta
function sendResponse(){
    let currentQuestion = JSON.parse(localStorage.count);
    //Recogemos el input checkeado
    let inputResponse = document.querySelector('input[name="answer"]:checked');
    //Si el input checkeado existe...
    if(inputResponse){
        if(currentQuestion == 9){
            let textResponse = inputResponse.nextElementSibling.textContent;
            checkAnswers(textResponse);

            getResults();
        }else{
            let textResponse = inputResponse.nextElementSibling.textContent;
            checkAnswers(textResponse);
            setQuestion();
        }
    }else{
        notAnswered();
    }
}

function checkAnswers(text){
    let currentQuestion = JSON.parse(localStorage.count);
    let correctAnswer = JSON.parse(localStorage[currentQuestion]).correct;
    
    if(text === correctAnswer){
        localStorage.correct = parseInt(localStorage.correct) + 1;
    }else{
        localStorage.incorrect = parseInt(localStorage.incorrect) + 1;
    }

    localStorage.count = parseInt(localStorage.count) + 1;

    return JSON.parse(localStorage.count);
}

function notAnswered(){
    let errorTest = document.querySelector('.errorMessage');
    if(!errorTest){
        let errorMessage = document.createElement('h3');
        errorMessage.setAttribute('class', 'errorMessage');
        errorMessage.innerHTML = 'YOU HAVE NOT RESPONDED';
        let article = document.querySelector('.answers');
        article.appendChild(errorMessage);
    }
}

function getResults(){
    let correct = JSON.parse(localStorage.correct);
    let incorrect = JSON.parse(localStorage.incorrect);
    
    let questionSection = document.querySelector('.questionSection');
    questionSection.innerHTML = '';
}

// https://opentdb.com/api_category.php
//https://opentdb.com/api.php?amount=10&category=31
//https://opentdb.com/api.php?amount=10
//https://opentdb.com/api.php?amount=10&category=10&difficulty=easy