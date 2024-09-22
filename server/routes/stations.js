import express from 'express';
import moment from 'moment-timezone';
import stations from '../models/db.js';

const router = express.Router();


export const addstation = async (req, res) => {
    const { name, distanceFromPrevious } = req.body;

    try {
        const lastStation = await stations.findOne().sort({ sequence: -1 });
        const newstation = new stations({ name, distanceFromPrevious, times: [], sequence: lastStation ? lastStation.sequence + 1 : 1, });
        await newstation.save();
        res.status(201).json(newstation);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const recordtime = async (req, res) => {
    const { stationName } = req.body;

    try {
        const station = await stations.findOne({ name: stationName });
        if (!station) return res.status(404).json({ message: "Station not found" });

        const currentTime = moment.tz("Asia/Colombo").toDate();
        station.times.push({ station: stationName, time: currentTime });
        await station.save();
        console.log(moment.tz("Asia/Colombo").format('MMMM Do YYYY, h:mm:ss a'));


        res.status(200).json(station);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const estimatetime = async (req, res) => {
    const { stationName } = req.params;
  
    try {
      
      const currentStation = await stations.findOne({ name: stationName });
      if (!currentStation) return res.status(404).json({ message: "Station not found" });
  
      
      const lastStation = await stations.findOne({ sequence: currentStation.sequence - 1 });
      if (!lastStation) return res.status(400).json({ message: "Previous station not found" });
  
      
      const previousTime = moment(lastStation.times[lastStation.times.length - 1].time);
      const currentTime = moment(currentStation.times[currentStation.times.length - 1].time);
      const timeTaken = currentTime.diff(previousTime, 'minutes');
  
     
      const distance = currentStation.distanceFromPrevious; 
      const speed = distance / (timeTaken / 60); 
  
     
      const futureStations = await stations.find({ sequence: { $gt: currentStation.sequence } });
      const estimatedTimes = futureStations.map(station => {
        
        const estimatedTimeToNext = station.distanceFromPrevious / speed; 
        return {
          station: station.name,
          estimatedTimeToNext: estimatedTimeToNext * 60 
        };
      });
  
      res.status(200).json({ speed, estimatedTimes });
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  };


router.post('/add', addstation);
router.post('/record', recordtime);
router.get('/estimate/:stationName', estimatetime);

export default router;
