import React, { useState, useEffect, useCallback } from 'react';
import './ExamComponent.css';

const ExamComponent = ({ onSubmit, questionPaper }) => {
  const [examQuestions, setExamQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [timer, setTimer] = useState(null);
  const [warningShown, setWarningShown] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setExamQuestions(questionPaper);
  }, [questionPaper]);

  const handleAnswerSelection = (questionId, selectedOption) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: [selectedOption],
    }));
  };

  const handleExamSubmit = useCallback(() => {
    if (typeof document !== 'undefined') {
      clearInterval(timer);
      setIsSubmitted(true);

      let totalScore = 0;
      examQuestions.forEach((category) => {
        category.questions.forEach((question) => {
          const selected = selectedAnswers[question.id]?.[0];
          const correct = question.correctAnswer;

          if (selected === correct) {
            totalScore += 1;
          }
        });
      });

      setScore(totalScore);

      if (onSubmit) {
        onSubmit(selectedAnswers);
      }
    }
  }, [timer, selectedAnswers, onSubmit, examQuestions]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    setTimer(interval);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleExamSubmit();
    }
  }, [timeLeft, handleExamSubmit]);

  const handleTabSwitch = useCallback(() => {
    if (typeof document !== 'undefined' && !warningShown && timer) {
      const shouldAllowSwitching = window.confirm(
        '⚠️ Warning: Switching tabs during the exam is not allowed. Do you want to cancel the exam?'
      );

      setWarningShown(true);

      if (!shouldAllowSwitching) {
        handleExamSubmit();
      }
    }
  }, [warningShown, timer, handleExamSubmit]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleTabSwitch);
      return () => {
        document.removeEventListener('visibilitychange', handleTabSwitch);
      };
    }
  }, [handleTabSwitch]);

  return (
    <div className="exam-component-container">
      {!isSubmitted && (
        <div className="time-left-container">
          <h3>
            Time Left: {Math.floor(timeLeft / 60)}:
            {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
          </h3>
        </div>
      )}

      {examQuestions.map((category) => (
        <div key={category.category}>
          <h3>{category.category}</h3>
          <ol>
            {category.questions.map((question) => (
              <li key={question.id}>
                <p>{question.question}</p>
                <ul className="custom-options">
                  {question.options.map((option, i) => (
                    <li
                      key={i}
                      className={
                        selectedAnswers[question.id]?.includes(option)
                          ? 'selected'
                          : ''
                      }
                      onClick={() => handleAnswerSelection(question.id, option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      ))}

      {!isSubmitted ? (
        <button className="d-button" onClick={handleExamSubmit}>
          Submit Exam
        </button>
      ) : (
        <div className="score-container">
          <h2>Your Score: {score}</h2>
        </div>
      )}
    </div>
  );
};

export default ExamComponent;
