import List from "./componetns/pages/List";
import React from 'react';
import CropperTest from './cropper/CropperTest';
import ImageEditor from "./components/Html2canvasTest";

const App: React.FC = () => {
  return (
    <div className="App">
      <CropperTest />
      <ImageEditor />
      <List></List>
    </div>
  );
};

export default App;
