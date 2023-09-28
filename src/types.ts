export type Song = SongMeta & SongGuide & { beatmap: BeatMap }

export interface SongMeta {
    slug: string
    composer: string
    duration: number
    bucket: string
    scaleKey: string
    scaleType: string
}

export interface SongGuide {
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
    start: number,
    duration: number,
    note: number
}

export const mainKeys = ["a", "b", "c", "d", "e", "f", "g"] as const;
type MainKeys = typeof mainKeys[number];
export const keyModifiers = ["b", "s", ""] as const;
type KeyModifiers = typeof keyModifiers[number];
export type Scale = Omit<`${MainKeys}${KeyModifiers}`, "bs" | "cb" | "es" | "fb">
export type ScaleKey = "major" | "minor" // support for aug/dim? not sure