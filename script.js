
//Iniciar el QUIZZ
function start(){
    //Recogemos las opciones para el QUIZZ
    const catergory = document.getElementById('category');
    const difficulty = document.getElementById('difficulty');

    //Creamos la URL con las opciones
    let getUrl = 'https://opentdb.com/api.php?amount=10' + catergory.value + difficulty.value;

    //Solicitamos los datos
    getQuestions(getUrl);
}

//Llamar a la API
async function getQuestions(url){
    let response = await fetch(url);
    let questions = await response.json();
    console.log(questions);
    getQuestionsData(questions.results);
    let initialSection = document.querySelector('.initialSection');
    hideElement(initialSection);
    setQuestion();
}

//Recopilar la data de las preguntas
function getQuestionsData(questions){
    questions.forEach((q, i) => {
        let clave = i;

        let answers = q.incorrect_answers;
        answers.push(q.correct_answer);
        answers = answers.sort(() => Math.random() - 0.5);

        localStorage[clave] = JSON.stringify({
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

//Disponer pregunta
function setQuestion(){
    
    let questionSection = document.createElement('section');
    questionSection.setAttribute('class', 'questionSection');

    let subheader = document.getElementById('subheader');
    let currentQuestion = JSON.parse(localStorage.count).responsed;
    subheader.textContent = JSON.parse(localStorage[currentQuestion]).question;
    console.log(currentQuestion);


    let main = document.querySelector('main');
    main.appendChild(questionSection);

    
}

// https://opentdb.com/api_category.php
//https://opentdb.com/api.php?amount=10&category=31
//https://opentdb.com/api.php?amount=10
//https://opentdb.com/api.php?amount=10&category=10&difficulty=easy