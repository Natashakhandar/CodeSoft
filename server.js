const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

let quizzes = [];

// Load quizzes from file
fs.readFile('./quizzes.json', (err, data) => {
    if (!err) quizzes = JSON.parse(data);
});

// Save quizzes to file
const saveQuizzes = () => {
    fs.writeFile('./quizzes.json', JSON.stringify(quizzes), err => {
        if (err) console.error('Error saving quizzes:', err);
    });
};

// API endpoints
app.get('/api/quizzes', (req, res) => {
    res.json(quizzes);
});

app.post('/api/quizzes', (req, res) => {
    const newQuiz = { id: quizzes.length + 1, ...req.body };
    quizzes.push(newQuiz);
    saveQuizzes();
    res.json(newQuiz);
});

app.get('/api/quizzes/:id', (req, res) => {
    const quiz = quizzes.find(q => q.id == req.params.id);
    if (quiz) res.json(quiz);
    else res.status(404).json({ error: 'Quiz not found' });
});

app.post('/api/quizzes/:id/submit', (req, res) => {
    const quiz = quizzes.find(q => q.id == req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const { answers } = req.body;
    let score = 0;
    const correctAnswers = [];

    quiz.questions.forEach((question, index) => {
        if (answers[index] == question.correctOption) score++;
        correctAnswers.push(question.correctOption);
    });

    res.json({ score, correctAnswers });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
