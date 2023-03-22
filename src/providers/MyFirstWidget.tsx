import { useActiveViewport } from "@itwin/appui-react";
import React, { useEffect } from "react";
import RealityDataApi from "./RealityDataApi";
import "./MyFirstWidget.css";
import { Button, ToggleSwitch } from "@itwin/itwinui-react";
import { ContextRealityModelProps } from "@itwin/core-common";
import { extractHilitedVolumeClassifierCommands } from "@itwin/core-frontend/lib/cjs/render/webgl/DrawCommand";
import { BrowserAuthorizationLoggerCategory } from "@itwin/browser-authorization";

export const MyFirstWidget: React.FC = () => {
  const viewport = useActiveViewport();

  const [initialized, setInitialized] = React.useState<boolean>(false);
  const [realityModels, setRealityModelList] = React.useState<ContextRealityModelProps[]>([]);
  const [listOfThings,  setListOfThings] = React.useState<string[]>([]);

  useEffect(() => {
    const asyncInitialize = async () => {
      if (viewport) {
        const realityModels = await RealityDataApi.getRealityModels(viewport.iModel);
        setRealityModelList(realityModels);
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
        }
      }
    }
  }
  const buttonClick = async () => {alert("Grimmjow Jaegerjaquez in.!");
setListOfThings([...listOfThings,"DannyPhantom!!"])
}
const thingList = listOfThings.map((thing: string) => <li>{thing}</li>);
  return (
    <div>
      This is my first widget
      <ToggleSwitch onChange={togglePhillyReality} label='Philly Reality Data' />
      <Button onClick={buttonClick}>Bankai</Button>
    </div>
  );
  }