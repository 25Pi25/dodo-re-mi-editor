export type Song = SongMeta & SongGuide & { beatmap: BeatMap }

export interface SongMeta {
    slug: string
    composer: string
    bucket: string
    scaleKey: string
    scaleType: string
}

export interface SongGuide {
    duration: number
    guideStartOffset: number
    guide: number[][]
    hasLocalizedBackingTrack: boolean
}

export interface BeatMap {
    slug: string
    type: string
    category: string
    difficulty: number
    instruments: string[]
    instrumentRequirements: string[]
    events: unknown[]
    inputs: BeatNoteGroup[]
}

export interface BeatNoteGroup {
    start: number
    lanes: number[]
    notes: BeatNote[]
}

export interface BeatNote {
    start: number
    duration: number
    note: number
}

export interface EditorBeatNote {
    beat: number
    duration: number
    note: number
    lane: number
}

export const mainKeys = ["c", "d", "e", "f", "g","a", "b"] as const;
type MainKey = typeof mainKeys[number];
export const keyModifiers = ["", "s", "b"] as const;
type KeyModifier = typeof keyModifiers[number];
export type Scale = Omit<`${MainKey}${KeyModifier}`, "bs" | "cb" | "es" | "fb">
export type ScaleKey = "major" | "minor" // support for aug/dim? not sure
export const tabTypes = ["Mapping", "Metadata"] as const;
export type TabType = typeof tabTypes[number];