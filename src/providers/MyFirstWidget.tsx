import { useActiveViewport } from "@itwin/appui-react";
import React, { useEffect } from "react";
import RealityDataApi from "./RealityDataApi";
import "./MyFirstWidget.css";
import { Button, ToggleSwitch } from "@itwin/itwinui-react";
import { ColorDef, ContextRealityModelProps } from "@itwin/core-common";
import { ColorPickerButton } from "@itwin/imodel-components-react";
import { Id64Array } from "@itwin/core-bentley";

export const MyFirstWidget: React.FC = () => {
  const viewport = useActiveViewport();

  const [initialized, setInitialized] = React.useState<boolean>(false);
  const [realityModels, setRealityModelList] = React.useState<ContextRealityModelProps[]>([]);
  const [listOfThings,  setListOfThings] = React.useState<string[]>([]);
  const [classifier, setClassifier] = React.useState<string>("");
  const [hiliteColor, setHiliteColor] = React.useState<ColorDef>(ColorDef.green);
  const [selectedBuildings, setSelectedBuildings] =  React.useState<Id64Array>([]);

  useEffect(() => {
    const asyncInitialize = async () => {
      if (viewport) {
        const realityModels = await RealityDataApi.getRealityModels(viewport.iModel);
        setRealityModelList(realityModels);
        const classifiers = await RealityDataApi.getAvailableClassifierListForViewport(viewport);
        if(classifiers) {
          setClassifier(classifiers[0].value);
        }
        setHiliteColor(viewport.hilite.color);

      }
    };

    if (!initialized) {
      void asyncInitialize().then (() => { setInitialized(true);})
    }
  });

  const togglePhillyReality = async (e:React.ChangeEvent<HTMLInputElement>) => {
    if (viewport) {
      for (const model of realityModels) {
        if (model.name === "Philadelphia_2015") {
          RealityDataApi.toggleRealityModel(model, viewport, e.target.checked);
          RealityDataApi.setRealityDataClassifier(viewport, classifier);
        }
      }
    }
  }
  const onColorChange = async (newColor: ColorDef) => {
    if (viewport) {
      viewport.hilite = {...viewport.hilite, color: newColor};
      setHiliteColor(viewport.hilite.color);
    }
    // Code goes here
  }
  const buttonClick = async () => {alert("Grimmjow Jaegerjaquez in.!");
setListOfThings([...listOfThings,"DannyPhantom!!"])
}
const saveBuilding = async () =>{
if (viewport?.iModel.selectionSet.isActive) { // If something is selected
  const newSelectedBuildings = [...selectedBuildings, ...viewport.iModel.selectionSet.elements]; // Merge the current saved selection with what is currently selected
  setSelectedBuildings(newSelectedBuildings);  // Save the new selection to the sate
}
}
const selectSavedBuildings = async () =>{ 
if (viewport) {
  viewport.iModel.selectionSet.emptyAll();
  viewport.iModel.selectionSet.add(selectedBuildings);
}
  
  }
  const Zoomtoselected = async () =>{ 
    viewport?.zoomToElements(selectedBuildings)
    
      
      }
// const thingList = listOfThings.map((thing: string) => <li>{thing}</li>);
  return (
    <div>
      This is my first widget
      <ToggleSwitch onChange={togglePhillyReality} label='Philly Reality Data' />
      <ColorPickerButton initialColor={hiliteColor} onColorPick={onColorChange} />
      <Button onClick={saveBuilding}>Save Selected Building</Button>
      <Button onClick={selectSavedBuildings}>select Saved Buildings</Button>
      <Button onClick={Zoomtoselected}>Zoom in</Button>
      <Button onClick={buttonClick}>Bankai</Button>
    </div>
  );
  }