import { useState } from 'react'
import './App.css'
import { Song } from './types'
import { MetadataInput } from './components/MetadataInput';
import MapEditor from './components/MapEditor';

export default function App() {
  const [song, setSong] = useState<Song>();
  const [tab, setTab] = useState<"map" | "metadata">("map");
  const [ogg, setOgg] = useState<File>();
  if (!song) {
    return ogg ? <MetadataInput ogg={ogg} setSong={setSong} /> :
      <div>
        <h1>Upload an OGG File</h1>
        <h2>For starting a project</h2>
        <input
          type="file"
          accept=".ogg"
          onChange={({ target: { files } }) => setOgg(files?.[0])}
        />
        <h1>Upload a Project JSON</h1>
        <h2>For continuing an existing project</h2>
        <input
          type="file"
          accept=".json"
          onChange={async ({ target: { files } }) => files && setSong(JSON.parse(await files?.[0].text()) as Song)}
        />
      </div>
  }

  return <>
    <div>
      <button onClick={() => setTab("map")} disabled={tab == "map"}>Mapping</button>
      <button onClick={() => setTab("metadata")} disabled={tab == "metadata"}>Metadata</button>
    </div>
    {(() => {
      switch (tab) {
        case "map":
          return <MapEditor song={song} />
      }
    })()}
  </>
}