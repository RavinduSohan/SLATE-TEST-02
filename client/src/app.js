import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [stations, setStations] = useState([]);
  const [stationName, setStationName] = useState('');
  const [distance, setDistance] = useState('');

  const handleAddStation = async () => {
    try {
      await axios.post('http://localhost:5000/stations/add', {
        name: stationName,
        distanceFromPrevious: distance
      });
      alert(`Station added: ${stationName}`);
      setStationName('');
      setDistance('');
      fetchStations(); 
    } catch (error) {
      console.error('Error adding station:', error);
    }
  };

  const fetchStations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/stations'); 
      setStations(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };
  return (
    <div>
      <h1>Train Station System</h1>

      <h2>Add Station</h2>
      <input 
        type="text" 
        placeholder="Station Name" 
        value={stationName} 
        onChange={(e) => setStationName(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Distance from Previous" 
        value={distance} 
        onChange={(e) => setDistance(e.target.value)} 
      />
      <button onClick={handleAddStation}>Add Station</button>

      <h2>Stations List</h2>
      <button onClick={fetchStations}>Fetch Stations</button>
      <ul>
        {stations.map((station) => (
          <li key={station._id}>
            {station.name} - {station.distanceFromPrevious}
          </li>
        ))}
      </ul>
      
    </div>
  );
}

export default App;
