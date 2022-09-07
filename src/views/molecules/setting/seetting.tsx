import { useState } from "react";
import { localStorageService } from "../../../services/apps/local.storage" 
import { Collapse } from 'antd';

const { Panel } = Collapse;

interface IGAMEKEYSETTING {
  up: number;
  back: number;
  left: number;
  right: number;
  shoot: number;
}

const Setting = () => {

  //by default azerty
  const [gameKeySetting, setGameKeySetting] = useState<IGAMEKEYSETTING>({
    up: 90,
    back: 83,
    left: 68,
    right: 81,
    shoot: 32,
  });

  const handlePanel = () => {
    localStorageService.set('newsetting', gameKeySetting)
  }

  return (
      <Collapse accordion onChange={handlePanel}>
        <Panel header="This is panel header 1" key="1">
          <form>
            <title>Component Setting</title>
            <span>By default azerty</span>
            <label>UP</label>
            <input type="text" maxLength={1} onKeyDown={  (e: React.KeyboardEvent<HTMLInputElement>) => { 
              setGameKeySetting({...gameKeySetting, up: e.keyCode});
            }}/>
            <label>BACK</label>
            <input type="text" maxLength={1} onKeyDown={  (e: React.KeyboardEvent<HTMLInputElement>) => { 
              setGameKeySetting({...gameKeySetting, back: e.keyCode});
            }}/>
            <label>RIGHT</label>
            <input type="text" maxLength={1} onKeyDown={  (e: React.KeyboardEvent<HTMLInputElement>) => { 
              setGameKeySetting({...gameKeySetting, right: e.keyCode});
            }}/>
            <label>LEFT</label>
            <input type="text" maxLength={1} onKeyDown={  (e: React.KeyboardEvent<HTMLInputElement>) => { 
              setGameKeySetting({...gameKeySetting, left: e.keyCode});
            }}/>
            <label>Shoot</label>
            <input type="text" maxLength={1} onKeyDown={  (e: React.KeyboardEvent<HTMLInputElement>) => { 
              setGameKeySetting({...gameKeySetting, shoot: e.keyCode});
            }}/>
          </form>
        </Panel>
    </Collapse>
  )
}

export default Setting

