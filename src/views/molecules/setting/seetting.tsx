import { useState } from "react";
import { localStorageService } from "../../../services/apps/local.storage" 

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

  const handleClick= () => {
    localStorageService.set('command', gameKeySetting);
  }

  return (
    <form>
        <h1>Component Setting</h1>
        <span>By default azerty</span>
        <label htmlFor="">UP</label>
        <input type="text" maxLength={1} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => setGameKeySetting({...gameKeySetting, up: e.keyCode})}/>
        <label htmlFor="">BACK</label>
        <input type="text" maxLength={1} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => setGameKeySetting({...gameKeySetting, back: e.keyCode})}/>
        <label htmlFor="">RIGHT</label>
        <input type="text" maxLength={1} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => setGameKeySetting({...gameKeySetting, right: e.keyCode})}/>
        <label htmlFor="">LEFT</label>
        <input type="text" maxLength={1} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => setGameKeySetting({...gameKeySetting, left: e.keyCode})}/>
        <label htmlFor="">Shoot</label>
        <input type="text" maxLength={1} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => setGameKeySetting({...gameKeySetting, shoot: e.keyCode})}/>
        <button type="submit" onClick={handleClick}>Confirm</button>
    </form>
  )
}

export default Setting

