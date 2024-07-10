// scripts.js

// Add question functionality
document.getElementById('add-question').addEventListener('click', () => {
    const questionsContainer = document.getElementById('questions-container');
    const questionCount = questionsContainer.children.length + 1;

    const questionBlock = document.createElement('div');
    questionBlock.className = 'question-block';

    questionBlock.innerHTML = `
        <label for="question-${questionCount}">Question ${questionCount}:</label>
        <input type="text" id="question-${questionCount}" name="question-${questionCount}" required><br>
        <label for="option-${questionCount}-1">Option 1:</label>
        <input type="text" id="option-${questionCount}-1" name="option-${questionCount}-1" required><br>
        <label for="option-${questionCount}-2">Option 2:</label>
        <input type="text" id="option-${questionCount}-2" name="option-${questionCount}-2" required><br>
        <label for="option-${questionCount}-3">Option 3:</label>
        <input type="text" id="option-${questionCount}-3" name="option-${questionCount}-3" required><br>
        <label for="option-${questionCount}-4">Option 4:</label>
        <input type="text" id="option-${questionCount}-4" name="option-${questionCount}-4" required><br>
        <label for="correct-option-${questionCount}">Correct Option:</label>
        <input type="number" id="correct-option-${questionCount}" name="correct-option-${questionCount}" min="1" max="4" required><br>
    `;

    questionsContainer.appendChild(questionBlock);
});

// Form submission handling for creating a quiz
document.getElementById('quiz-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const quizData = new FormData(event.target);
    const quiz = {
        title: quizData.get('quiz-title'),
        questions: []
    };

    for (let i = 1; i <= quizData.getAll('question-1').length; i++) {
        const question = {
            text: quizData.get(`question-${i}`),
            options: [
                quizData.get(`option-${i}-1`),
                quizData.get(`option-${i}-2`),
                quizData.get(`option-${i}-3`),
                quizData.get(`option-${i}-4`)
            ],
            correctOption: quizData.get(`correct-option-${i}`)
        };

        quiz.questions.push(question);
    }

    fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quiz)
    })
    .then(response => response.json())
    .then(data => {
        alert('Quiz created successfully!');
        window.location.href = 'quiz-listing.html';
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Load quiz list for quiz-listing.html
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/quizzes')
    .then(response => response.json())
    .then(quizzes => {
        const quizList = document.getElementById('quiz-list');
        quizzes.forEach(quiz => {
            const quizItem = document.createElement('div');
            quizItem.className = 'quiz-item';
            quizItem.innerHTML = `
                <h3>${quiz.title}</h3>
                <a href="take-quiz.html?id=${quiz.id}" class="button">Take Quiz</a>
            `;
            quizList.appendChild(quizItem);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Load and take a quiz
if (window.location.pathname === '/take-quiz.html') {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');

    fetch(`/api/quizzes/${quizId}`)
    .then(response => response.json())
    .then(quiz => {
        const quizContainer = document.getElementById('quiz-container');
        quiz.questions.forEach((question, index) => {
            const questionBlock = document.createElement('div');
            questionBlock.className = 'question-block';

            questionBlock.innerHTML = `
                <h3>Question ${index + 1}</h3>
                <p>${question.text}</p>
                ${question.options.map((option, i) => `
                    <input type="radio" id="q${index + 1}o${i + 1}" name="question-${index + 1}" value="${i + 1}">
                    <label for="q${index + 1}o${i + 1}">${option}</label><br>
                `).join('')}
            `;

            quizContainer.appendChild(questionBlock);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.getElementById('submit-quiz').addEventListener('click', () => {
        const answers = [];
        for (let i = 1; i <= quiz.questions.length; i++) {
            const answer = document.querySelector(`input[name="question-${i}"]:checked`);
            answers.push(answer ? parseInt(answer.value) : null);
        }

        fetch(`/api/quizzes/${quizId}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers })
        })
        .then(response => response.json())
        .then(result => {
            window.location.href = `quiz-results.html?score=${result.score}&correctAnswers=${result.correctAnswers.join(',')}`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
}

// Show quiz results
if (window.location.pathname === '/quiz-results.html') {
    const urlParams = new URLSearchParams(window.location.search);
    const score = urlParams.get('score');
    const correctAnswers = urlParams.get('correctAnswers').split(',');

    document.getElementById('score').innerText = `Your score: ${score}`;
    document.getElementById('correct-answers').innerHTML = correctAnswers.map(answer => `<p>${answer}</p>`).join('');
}

// User Authentication (Login and Register)
document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const loginData = new FormData(event.target);

    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: loginData.get('username'),
            password: loginData.get('password')
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Login successful!');
            window.location.href = 'index.html';
        } else {
            alert('Login failed! Please check your credentials.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('register-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const registerData = new FormData(event.target);

    fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: registerData.get('username'),
            email: registerData.get('email'),
            password: registerData.get('password')
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registration successful!');
            window.location.href = 'login.html';
        } else {
            alert('Registration failed! Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
