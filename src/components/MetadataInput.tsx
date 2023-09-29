import { Dispatch, SetStateAction, useRef, RefObject } from 'react'
import { Song, mainKeys, keyModifiers, BeatMap, SongGuide } from '../types'

export function MetadataInput({ ogg, setSong }: { ogg: File, setSong: Dispatch<SetStateAction<Song | undefined>> }) {
    const metadata = {
        id: useRef<HTMLInputElement>(null),
        composer: useRef<HTMLInputElement>(null),
        bucket: useRef<HTMLInputElement>(null),
        scaleKey: useRef<HTMLSelectElement>(null),
        scaleModifier: useRef<HTMLSelectElement>(null),
        scaleType: useRef<HTMLSelectElement>(null)
    }
    return <>
        <div>
            <h1>Add Metadata</h1>
            <audio controls>
                <source src={URL.createObjectURL(ogg)} type="audio/ogg" />
            </audio>
            <div className="metadata-grid">
                <h2>Song ID</h2>
                <input type="text" ref={metadata.id} defaultValue={"my-custom-song"}/>
                <h2>Composer</h2>
                <input type="text" ref={metadata.composer} defaultValue={"unknown artist"}/>
                <h2>Category</h2>
                <input type="text" ref={metadata.bucket} defaultValue={"Custom"}/>
                <h2>Scale Key</h2>
                <div className='center'>
                    <select className="dropdown-options" ref={metadata.scaleKey}>
                        {mainKeys.map((mainKey, index) => (
                            <option key={index} value={mainKey}>{mainKey}</option>
                        ))}
                    </select>
                    <select className="dropdown-options" ref={metadata.scaleModifier}>
                        {keyModifiers.map((keyModifier, index) => {
                            const keyDisplay = {
                                b: "♭",
                                s: "♯",
                                "": ""
                            }[keyModifier]
                            return <option key={index} value={keyDisplay}>{keyDisplay}</option>
                        })}
                    </select>
                </div>
                <h2>Scale Type</h2>
                <select ref={metadata.scaleType}>
                    <option value="major">major</option>
                    <option value="minor">minor</option>
                </select>
            </div>
            <button onClick={() => createSong(metadata, setSong)}>Create!</button>
        </div>
    </>
}

const defaultMap: SongGuide & { beatmap: BeatMap } = {
    duration: 100, // TODO: fix arbitrary number
    guideStartOffset: 0,
    guide: [],
    hasLocalizedBackingTrack: false,
    beatmap: { // TODO: figure out default values for this
        slug: "default",
        type: "default",
        category: "Custom",
        difficulty: 1,
        instruments: [],
        instrumentRequirements: [],
        events: [],
        inputs: [],
    }
}

function createSong(
    metadata: Record<string, RefObject<HTMLInputElement | HTMLSelectElement | undefined>>,
    setSong: Dispatch<SetStateAction<Song | undefined>>
) {
    if (Object.values(metadata).some((x, i) => !x?.current?.value && i != 4)) return;

    const metadataValues: Record<string, string> = {};
    for (const key in metadata) {
        metadataValues[key] = metadata[key].current!.value
    }
    const { id: slug, composer, bucket, scaleKey, scaleModifier, scaleType } = metadataValues;
    setSong({
        slug,
        composer,
        bucket,
        scaleKey: scaleKey + scaleModifier,
        scaleType,
        ...defaultMap
    })
}