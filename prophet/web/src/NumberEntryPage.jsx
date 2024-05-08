import { useState, useEffect } from 'react';
import './NumberEntry.css'; // Import your CSS file
import axios from 'axios';


function NumberEntryPage() {
  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [number3, setNumber3] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [enteredNumbers, setEnteredNumbers] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer);
          alert('Time is up! Please try again.');
          window.location.reload(); 
          return prevTime;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000); // Update every second

    // Clean up the timer
    return () => clearInterval(timer);
  }, []);



  const handleNumberChange = (event, setNumber) => {
    const input = event.target.value;
    if (input >= 1 && input <= 10) {
      setNumber(input);
    }
  };

  
  let numbers;

  const handleSubmit = async (e) => {
    e.preventDefault();
    numbers = [number1, number2, number3];
    setEnteredNumbers(numbers);
    

    try {
      await axios.post('http://localhost:5000/submit-ratings/', {
        happiness: number1,
        family_like: number2,
        friends_like: number3
      });


      // Clear input fields after successful submission
      setNumber1('');
      setNumber2('');
      setNumber3('');
    } catch (error) {
      console.error('Error submitting ratings:', error);
    }

    // history.push({
    //   pathname: '/result',
    //   state: { numbers: numbers }
    // });
    
  };

  return (
    <div className="container">
      <h1>Rate from (1-10) </h1>
      <form onSubmit={handleSubmit}>
        <label>
          Rate your Happiness:
          <input
            type="number"
            min="1"
            max="10"
            value={number1}
            onChange={(e) => handleNumberChange(e, setNumber1)}
          />
        </label>
        <br />
        <label>
          Rate Your Relation with your Family :
          <input
            type="number"
            min="1"
            max="10"
            value={number2}
            onChange={(e) => handleNumberChange(e, setNumber2)}
          />
        </label>
        <br />
        <label>
          Rate Your Relation with your Friends:
          <input
            type="number"
            min="1"
            max="10"
            value={number3}
            onChange={(e) => handleNumberChange(e, setNumber3)}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <div className="timer">Time left: {timeLeft} seconds</div>
      <div className="numbers">
        <span className="numbers-label">Entered numbers:</span>
        <ul className="numbers-list">
          {enteredNumbers.map((number, index) => (
            <li key={index}> - {number} - </li>
            
          ))}
        </ul>
      </div>
    </div>
  );
}

export default NumberEntryPage;
