import React, { useState, useEffect } from "react";
// import "./App.css";

const pointValues = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];
const STORAGE_KEY = "yamazaki_panmatsuri_points";

const App: React.FC = () => {
  const [plates, setPlates] = useState<{ id: number; points: { [key: number]: number } }[]>(
    () => {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[{ \"id\": 1, \"points\": {} }]");
      } catch {
        return [{ id: 1, points: {} }];
      }
    }
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plates));
  }, [plates]);

  const handleChange = (plateIndex: number, value: number, count: number) => {
    setPlates((prev) => {
      const updatedPlates = [...prev];
      updatedPlates[plateIndex].points = {
        ...updatedPlates[plateIndex].points,
        [value]: count,
      };
      return updatedPlates;
    });
  };

  const calculateTotalPoints = (points: { [key: number]: number }) =>
    Object.entries(points).reduce(
      (sum, [value, count]) => sum + parseFloat(value) * count,
      0
    );

  const addPlate = () => {
    setPlates((prev) => [...prev, { id: prev.length + 1, points: {} }]);
  };

  const removePlate = (plateIndex: number) => {
    setPlates((prev) => prev.filter((_, index) => index !== plateIndex));
  };

  const saveData = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plates));
    alert("データを保存しました。");
  };

  const loadData = () => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setPlates(JSON.parse(savedData));
        alert("データを読み込みました。");
      } catch {
        alert("データの読み込みに失敗しました。");
      }
    }
  };

  const clearData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPlates([{ id: 1, points: {} }]);
    alert("データを削除しました。");
  };

  const totalPointsAll = plates.reduce(
    (sum, plate) => sum + calculateTotalPoints(plate.points),
    0
  );

  return (
    <div className="container">
      <h1>ヤマザキ春のパンまつり 点数計算ツール</h1>
      {plates.map((plate, index) => {
        const plateTotal = calculateTotalPoints(plate.points);
        return (
          <div key={plate.id} className="plate">
            <h2>{index + 1} 枚目</h2>
            <div className="point-inputs">
              {pointValues.map((value) => (
                <div key={value} className="input-group">
                  <label>{value} 点</label>
                  <input
                    type="number"
                    min="0"
                    value={plate.points[value] || ""}
                    onChange={(e) =>
                      handleChange(index, value, Number(e.target.value))
                    }
                  />
                </div>
              ))}
            </div>
            <h3>合計: {plateTotal.toFixed(1)} 点</h3>
            <button onClick={() => removePlate(index)}>削除</button>
          </div>
        );
      })}
      <button onClick={addPlate}>お皿を追加</button>
      <div className="results">
        <h2>全体の合計点数: {totalPointsAll.toFixed(1)} 点</h2>
      </div>
      <div className="controls">
        <button onClick={saveData}>保存</button>
        <button onClick={loadData}>ロード</button>
        <button onClick={clearData}>データ削除</button>
      </div>
    </div>
  );
};

export default App;
