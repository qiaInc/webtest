(function ($) {
  'use strict';

  // 時間制限（秒）
  const TIME_LIMIT = 10;

  // クイズデータを格納する配列
  let quizData = [];

  // 現在の質問数
  let $currentNum = 0;

  // 得点
  let $pointPerCorrect = 10;
  let score = 0;

  // タイマー関連
  let timeLeft = TIME_LIMIT;
  let timerInterval;

  // クイズデータを取得
  $.getJSON('quiz.json', function(data) {
    quizData = data;

    // 合計問題数を設定
    let $questionTotalNum = quizData.length;

    // クイズデータをランダムにシャッフル
    quizData = shuffleQuiz(quizData);

    // クイズを開始
    startQuiz();
  });

  // クイズを開始する関数
  function startQuiz() {
    showQuestion();
    startTimer();
    setupEventHandlers();
  }

  // 質問を表示する関数
  function showQuestion() {
    // 現在の問題を取得
    let currentQuestion = quizData[$currentNum];

    // 質問番号と質問文を表示
    $('.quiz-question-number').text('質問 ' + ($currentNum + 1));
    $('.quiz-question').text(currentQuestion.question);

    // 選択肢を表示
    $('.quiz-text01').text(currentQuestion.answer01);
    $('.quiz-text02').text(currentQuestion.answer02);
    $('.quiz-text03').text(currentQuestion.answer03);
    $('.quiz-text04').text(currentQuestion.answer04);

    // 選択肢のシャッフル
    shuffleAnswer($('.quiz-answer'));

    // 前の選択状態をクリア
    $('input[name="radio"]').prop('checked', false);
    $('.quiz-button').removeClass('is-checked checked');
    $('.quiz-answer').removeClass('is-correct is-incorrect');
  }

  // タイマーを開始する関数
  function startTimer() {
    timeLeft = TIME_LIMIT;
    updateTimerDisplay();

    timerInterval = setInterval(function() {
      timeLeft--;
      updateTimerDisplay();

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        checkAnswer();
      }
    }, 1000);
  }

  // タイマー表示を更新する関数
  function updateTimerDisplay() {
    $('#time-left').text(timeLeft);
  }

  // 回答をチェックする関数
  function checkAnswer() {
    clearInterval(timerInterval);

    let selectedAnswerIndex = $('input[name="radio"]:checked').closest('li').index();
    let correctAnswerIndex = parseInt(quizData[$currentNum].correct) - 1;

    if (selectedAnswerIndex === correctAnswerIndex) {
      $('.quiz-answer').addClass('is-correct');
      score += $pointPerCorrect;
    } else {
      $('.quiz-answer').addClass('is-incorrect');
    }

    $('.quiz-button').addClass('is-checked');

    if ($currentNum + 1 == quizData.length) {
      setTimeout(function () {
        $('.finish').addClass('is-show');
        $('.score-wrap .score').text(score);
        $('.score-wrap .full').text('全問終了しました');
      }, 1000);
    } else {
      setTimeout(function () {
        $currentNum++;
        showQuestion();
        startTimer();
      }, 1000);
    }
  }

  // イベントハンドラを設定する関数
  function setupEventHandlers() {
    // 選択肢をクリックした時のイベント
    $('.quiz-button').on('click', function() {
      if (timeLeft > 0 && !$(this).hasClass('is-checked')) {
        $(this).find('input[name="radio"]').prop('checked', true);
        $(this).addClass('checked');
        checkAnswer();
      }
    });

    // 「もう一度挑戦する」ボタンのイベント
    $('.goback-button').on('click', function(e) {
      e.preventDefault();
      // 初期化
      $currentNum = 0;
      score = 0;
      $('.finish').removeClass('is-show');
      quizData = shuffleQuiz(quizData);
      showQuestion();
      startTimer();
    });
  }

  // 質問をランダムにする関数
  function shuffleQuiz(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1));
      [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
  }

  // 選択肢をシャッフルする関数
  function shuffleAnswer(container) {
    let content = container.find("> li");
    let total = content.length;
    content.each(function () {
      content.eq(Math.floor(Math.random() * total)).prependTo(container);
    });
  }

})(jQuery);
