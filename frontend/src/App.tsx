import "./App.css";
import List from "./componetns/pages/List";
import React from 'react';
import CropperTest from './cropper/CropperTest';

const App: React.FC = () => {
  return (
    <div className="App">
      <CropperTest />
      <List></List>
    </div>
  );
};

export default App;
