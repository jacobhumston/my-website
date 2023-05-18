/*

    Programmed by LovelyJacob (Jacob Humston).
    This code is open source, however I kindly ask for credit if used.
    Repository: https://github.com/jacobhumston/my-website

    Have a good one! :)

*/

async function getQuestion() {
    let url = 'https://opentdb.com/api.php?amount=1';

    const categoriesSelection = document.getElementById('categories');
    const selectedCategory = categoriesSelection.selectedOptions[0].value;
    if (selectedCategory !== 'Any') {
        url = `${url}&category=${selectedCategory.split(' - ')[1]}`;
    }

    const difficultySelection = document.getElementById('difficulty');
    const selectedDifficulty = difficultySelection.selectedOptions[0].value;
    if (selectedDifficulty !== 'Any') {
        url = `${url}&difficulty=${selectedDifficulty.toLowerCase()}`;
    }

    const response = await fetch(url);
    const json = await response.json();

    const question = json.results[0].question;
    const difficulty = json.results[0].difficulty;
    const category = json.results[0].category;

    const answers = json.results[0].incorrect_answers;
    answers.push(json.results[0].correct_answer);

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    };

    shuffleArray(answers);

    const answerObjects = [];
    answers.forEach(function (value) {
        answerObjects.push({
            answer: value,
            correct: value === json.results[0].correct_answer,
        });
    });

    return {
        question: question,
        category: category,
        difficulty: difficulty,
        answers: answerObjects,
    };
}

let points = 0;
let loadedCategories = false;
let connectedButtons = false;

async function main() {
    const gameDivider = document.getElementById('game');
    const pointsP = document.getElementById('points');

    if (loadedCategories === false) {
        const categoriesSelection = document.getElementById('categories');
        await fetch('https://opentdb.com/api_category.php')
            .then(async function (response) {
                const json = await response.json();
                json.trivia_categories.forEach(function (value) {
                    const option = document.createElement('option');
                    option.innerText = `${value.name} - ${value.id}`;
                    categoriesSelection.insertAdjacentElement('beforeend', option);
                });
            })
            .catch(function () {
                return;
            });
        loadedCategories = true;
    }

    if (connectedButtons === false) {
        const button = document.getElementById('settings-button');
        const settings = document.getElementById('settings');
        button.onclick = function () {
            settings.hidden = !settings.hidden;
            if (settings.hidden) {
                button.innerText = 'Show Settings';
            } else {
                button.innerText = 'Hide Settings';
            }
        };
        button.hidden = false;
        const newQuestionButton = document.getElementById('new-question');
        newQuestionButton.onclick = function () {
            gameDivider.innerHTML = '';
            main();
        };
        connectedButtons = true;
    }

    try {
        const settingsButton = document.getElementById('settings-button');
        if (settingsButton.innerText !== 'Hide Settings') {
            settingsButton.hidden = true;
        }

        const questionP = document.createElement('p');
        questionP.innerText = '???';
        questionP.style = 'font-weight: bold;';

        const questionDataP = document.createElement('p');
        questionDataP.innerHTML = 'Category: ???<br>Difficulty: ???';

        gameDivider.innerHTML = '<h2>Loading...</h2>';
        const loadingImage = document.createElement('img');
        loadingImage.src = 'assets/loading.gif';
        loadingImage.alt = 'loading gif';
        loadingImage.width = 150;
        gameDivider.insertAdjacentElement('beforeend', loadingImage);

        await new Promise(function (resolve) {
            setTimeout(resolve, 1000);
        });

        const questionData = await getQuestion();
        questionP.innerHTML = questionData.question;

        gameDivider.innerHTML = '';

        gameDivider.insertAdjacentElement('beforeend', questionP);

        let correctAnswer = '';

        function buttonFunction(correct) {
            if (correct === true) {
                const difficulty = questionData.difficulty;
                let pointsEarned = 1;
                if (difficulty === 'easy') {
                    points++;
                } else if (difficulty === 'medium') {
                    points = points + 2;
                    pointsEarned = 2;
                } else if (difficulty === 'hard') {
                    points = points + 3;
                    pointsEarned = 3;
                }
                pointsP.innerText = points + ' Points';
                gameDivider.innerHTML = '';
                gameDivider.innerHTML = `<h2>Correct!</h2><p>+${pointsEarned} Point${
                    pointsEarned === 1 ? '' : 's'
                }</p>`;
                setTimeout(function () {
                    gameDivider.innerHTML = '';
                    main();
                }, 3000);
            } else {
                gameDivider.innerHTML = '<h2>Wrong!</h2>';
                gameDivider.insertAdjacentHTML('beforeend', `<p>Correct answer was... ${correctAnswer}</p>`);
                setTimeout(function () {
                    gameDivider.innerHTML = '';
                    main();
                }, 3000);
            }
        }

        questionData.answers.forEach(function (answer) {
            const button = document.createElement('button');
            button.classList.add('answer-button');
            button.innerHTML = answer.answer;
            button.onclick = function () {
                if (settingsButton.innerText !== 'Hide Settings') {
                    settingsButton.hidden = true;
                }
                buttonFunction(answer.correct);
            };
            gameDivider.insertAdjacentElement('beforeend', button);
            gameDivider.insertAdjacentHTML('beforeend', '<br>');
            if (answer.correct === true) {
                correctAnswer = answer.answer;
            }
        });

        questionDataP.innerHTML =
            '<b>Category:</b> ' +
            questionData.category +
            '<br><b>Difficulty:</b> ' +
            questionData.difficulty.charAt(0).toUpperCase() +
            questionData.difficulty.slice(1);
        gameDivider.insertAdjacentElement('beforeend', questionDataP);

        settingsButton.hidden = false;
    } catch (err) {
        alert(err);
        location.reload();
    }
}

window.addEventListener('load', main);
