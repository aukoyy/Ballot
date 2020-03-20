import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { backendAddress } from '../../config';
import { Question } from '../../models/Question';

enum ErrorMessage {
    QUESTION_NOT_FOUND = 'Question not found',
    USER_NOT_FOUND = 'User not found. Are you sure you are logged in?',
    SERVER_ERROR = 'There was an error connecting to the server',
  }

interface ConductPollComponentRouterProps {
    pollId: string;
  }
  
interface ConductPollComponentOwnProps {}

type props = RouteComponentProps<ConductPollComponentRouterProps> &
ConductPollComponentOwnProps;

const ConductPoll = (props: props) => {
    const [pollPin, setPollPin] = useState<number>();
    const [pollTitle, setPollTitle] = useState<string>('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);

    const pollId = props.match.params.pollId;

    useEffect(() => {
          try {
            const fetchPoll = async () => {
              const result = await fetch(
                `${backendAddress}/api/polls/${pollId}`,
                {
                  method: 'GET',
                }
              );
              result
                .json()
                .then(res => {
                  setQuestions(res.questions);
                  setPollTitle(res.title);
                  setPollPin(res.pollPin)
                })
                .catch(err =>
                  setErrorMessage(`${ErrorMessage.QUESTION_NOT_FOUND}: ${err}`)
                );
            };
            fetchPoll();
          } catch (err) {
            setErrorMessage(`${ErrorMessage.SERVER_ERROR}: ${err}`);
          }
      }, [pollId]);

      const renderCurrentQuestion = () => {
        if (questions[currentQuestion] !== undefined) {
          return (
            <div>
                <p className="text-4xl">{questions[currentQuestion].question}</p>
            </div>
          )
        } 
      }

      const renderCurrentOptions = () => {
        if (questions[currentQuestion] !== undefined) {
          return (
            <div className="ml-4 mt-8">
              {questions[currentQuestion].options.map(option => (
                    <p className="inline-block bg-blue-200 rounded-full px-5 py-2 text-xl m-2">{option}</p>
              ))}
            </div>
          )
        }
      }

      const renderNavButtons = () => {
        return (
            <div className="flex justify-between mt-12">
            <button
              onClick={() => currentQuestion > 0 
                ? setCurrentQuestion(currentQuestion - 1) 
                : false}
              className="py-2 px-16 w-auto bg-gray-200 hover:bg-gray-400 font-bold text-gray-700 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Back
            </button>
            
              <button
                onClick={() => currentQuestion < questions.length 
                  ? setCurrentQuestion(currentQuestion + 1)
                  : false // TODO: push nav to finish page
                }
                className="py-2 px-16 w-auto bg-blue-500 hover:bg-blue-600 font-bold text-white rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                {currentQuestion >= questions.length ? "Finish" : "Next"}
              </button>
            
            </div>
        )
      }


    return (
        <div className="flex justify-center mt-8">
          <div className="mx-3 w-full sm:max-w-3xl p-4">
            <p className="text-4xl border-b-2 text-gray-600">{pollTitle} - Pin: {pollPin}</p>
            {renderNavButtons()}
            <div className="mt-8 p-8 shadow rounded-lg">
              {renderCurrentQuestion()}
              {renderCurrentOptions()}
              {currentQuestion >= questions.length &&
                <p className="text-center text-lg font-semibold text-gray-800">That's all folks! Click Finish to end the polling</p>
              }
            </div>
            
          </div>
        </div>
    )
};

export const ConductPollComponent = withRouter(ConductPoll);