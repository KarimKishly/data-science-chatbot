
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Fast.css'

function Fast() {
  const [list1, setList1] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/data');
        setList1(response.data.predicted);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


    fetchData();
  }, []);

  return (

    <div className="test-result-container">
    <h3> Forward Prediction Table </h3>
    <table className="test-result-table">
      <thead>
        <tr>
          <th></th>
          <th>Happiness</th>
          <th>Family</th>
          <th>Friends</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Predicted Data</th>
          {list1.map((item, index) => (
        <td key={index}>{item}</td>
      ))}
        </tr>
      </tbody>
    </table>

  </div>

  );
}

export default Fast;
