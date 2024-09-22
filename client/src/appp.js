import React, { useState } from 'react';
import axios from 'axios';
import './app.css';


function App() {
    const [stationName, setStationName] = useState('');
    const [distance, setDistance] = useState('');
    const [stations, setStations] = useState([]);
    const [selectedStation, setSelectedStation] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
  
    const addStation = async () => {
      try {
        const response = await axios.post('http://localhost:5000/stations/add', {
          name: stationName,
          distanceFromPrevious: distance,
        });
        console.log(response.data);
        alert('Station added successfully!');
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
  
    const recordTime = async () => {
      try {
        const response = await axios.post('http://localhost:5000/stations/record', {
          stationName: selectedStation,
        });
        console.log(response.data);
        alert('Time recorded successfully!');
      } catch (error) {
        console.error('Error recording time:', error);
      }
    };
  
    const estimateTime = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/stations/estimate/${selectedStation}`);
        console.log(response.data);
        setEstimatedTime(response.data.estimatedTimeToNext);
      } catch (error) {
        console.error('Error estimating time:', error);
      }
    };
  
    return (
      <div>
        <h1>Train Station System</h1>
  
        <h2>Add Station:</h2>
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
        <button onClick={addStation}>Add Station</button>
  
        <h2>Stations</h2>
        <button onClick={fetchStations}>Fetch Stations</button>
        <ul>
          {stations.map((station) => (
            <li key={station._id}>{station.name}</li>
          ))}
        </ul>
  
        <h2>Record Time</h2>
        <input 
          type="text" 
          placeholder="Station Name" 
          value={selectedStation} 
          onChange={(e) => setSelectedStation(e.target.value)} 
        />
        <button onClick={recordTime}>Record Time</button>
  
        <h2>Estimate Time</h2>
        <input 
          type="text" 
          placeholder="Station Name" 
          value={selectedStation} 
          onChange={(e) => setSelectedStation(e.target.value)} 
        />
        <button onClick={estimateTime}>Estimate Time</button>
  
        {estimatedTime && <h3>Estimated Time to Next Station: {estimatedTime} minutes</h3>}
      </div>
    );
  }
  
  export default App;