import MarkerList from "./components/pages/MarkerList";
import React from "react";
import CropperTest from "./cropper/CropperTest";
import ImageEditor from "./components/Html2canvasTest";
import CrewTapPage from "./components/pages/CrewTapPage";

const App: React.FC = () => {
  return (
    <div className="App">
      <CrewTapPage />
      <CropperTest />
      <ImageEditor />
      <MarkerList />
    </div>
  );
};

export default App;
