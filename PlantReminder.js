import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const commonPlants = ["Aloe Vera", "Snake Plant", "Pothos", "Peace Lily", "Spider Plant"];

const PlantReminder = () => {
  const [plants, setPlants] = useState([]);
  const [plantName, setPlantName] = useState("");
  const [waterInterval, setWaterInterval] = useState("");
  const [lastWatered, setLastWatered] = useState("");

  useEffect(() => {
    const savedPlants = JSON.parse(localStorage.getItem("plants")) || [];
    setPlants(savedPlants);
  }, []);

  useEffect(() => {
    localStorage.setItem("plants", JSON.stringify(plants));
  }, [plants]);

  const addPlant = () => {
    if (!plantName || !waterInterval) return;
    const newPlant = {
      id: uuidv4(),
      name: plantName,
      waterEvery: parseInt(waterInterval),
      lastWatered: lastWatered ? new Date(lastWatered).toISOString() : new Date().toISOString(),
    };
    setPlants([...plants, newPlant]);
    setPlantName("");
    setWaterInterval("");
    setLastWatered("");
  };

  const waterPlant = (id) => {
    setPlants(
      plants.map((plant) =>
        plant.id === id ? { ...plant, lastWatered: new Date().toISOString() } : plant
      )
    );
  };

  const deletePlant = (id) => {
    setPlants(plants.filter((plant) => plant.id !== id));
  };

  return (
    <div className="container">
      <h2>🌱 Plant Care Reminder</h2>
      
      <div>
        <select value={plantName} onChange={(e) => setPlantName(e.target.value)}>
          <option value="">Select a Plant</option>
          {commonPlants.map((plant, index) => (
            <option key={index} value={plant}>{plant}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Water every (days)"
          value={waterInterval}
          onChange={(e) => setWaterInterval(e.target.value)}
        />
        
        <input
          type="date"
          value={lastWatered}
          onChange={(e) => setLastWatered(e.target.value)}
        />
        
        <button onClick={addPlant}>Add Plant</button>
      </div>

      <table border="1">
        <thead>
          <tr>
            <th>Plant Name</th>
            <th>Water Every (Days)</th>
            <th>Last Watered</th>
            <th>Next Watering</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plants.map((plant) => {
            const daysSinceWatered =
              (new Date() - new Date(plant.lastWatered)) / (1000 * 60 * 60 * 24);
            const needsWater = daysSinceWatered >= plant.waterEvery;
            const nextWaterDate = new Date(plant.lastWatered);
            nextWaterDate.setDate(nextWaterDate.getDate() + plant.waterEvery);

            return (
              <tr key={plant.id}>
                <td>{plant.name}</td>
                <td>{plant.waterEvery} days</td>
                <td>{new Date(plant.lastWatered).toLocaleDateString()}</td>
                <td>{nextWaterDate.toLocaleDateString()}</td>
                <td>
                  <button onClick={() => waterPlant(plant.id)}>💧 Watered</button>
                  <button onClick={() => deletePlant(plant.id)}>🗑 Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PlantReminder;
