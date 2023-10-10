import { Fragment } from 'react';
import { Circle, Rect, Text } from 'react-konva';
import MapEditor from './MapEditor';

export default function BeatMarkers({ editor }: { editor: MapEditor }) {
    const bigMarkerWidth = 5 / 8;
    const smallMarkerWidth = 9 / 16;
    return <Fragment>
        {Array.from({ length: Math.floor(editor.getTotalBeats() * editor.state.precision) + 1 }, (_, i) => {
            const beatNumber = i / editor.state.precision;
            const scroll = editor.getYFromBeats(beatNumber);
            // Optimize rendering by skipping beats that are outside the screen
            if (scroll < 0 || scroll > editor.HEIGHT) return null;
            const isWholeBeat = beatNumber % 1 == 0;
            const markerWidth = isWholeBeat ? bigMarkerWidth : smallMarkerWidth;
            return <Fragment key={i}>
                <Rect
                    x={editor.WIDTH / 2}
                    y={scroll}
                    width={editor.WIDTH * markerWidth}
                    height={2}
                    offset={{ x: editor.WIDTH * markerWidth / 2, y: 0 }}
                    fill={`rgba(255,255,255,${isWholeBeat ? 0.75 : 0.25})`}
                />
                {isWholeBeat && <Text
                    x={editor.WIDTH / 2}
                    y={scroll}
                    offset={{ x: -editor.WIDTH * 1 / 3, y: 15 }}
                    fill="rgba(255,255,255,0.75)"
                    text={beatNumber.toString()}
                    fontFamily='Inter'
                    fontSize={30}
                    align='center'
                    verticalAlign='middle'
                />}
                {Array.from({ length: editor.state.lanes }, (_, j) => {
                    const width = (editor.WIDTH - editor.LINES_BORDER) / 6;
                    const height = editor.state.beatGap / 4
                    return <Fragment key={j}>
                        <Rect
                            x={editor.LINES_BORDER + (editor.WIDTH - editor.LINES_BORDER * 2) * j / (editor.state.lanes - 1)}
                            y={scroll}
                            width={width}
                            height={height}
                            offset={{ x: width / 2, y: height / 2 }}
                            onPointerEnter={() => editor.setState({ hover: [i, j] })}
                            onPointerClick={() => editor.addNote(beatNumber, j)}
                        />
                        {editor.state.hover?.[0] == i && editor.state.hover?.[1] == j &&
                            <Circle
                                x={editor.LINES_BORDER + (editor.WIDTH - editor.LINES_BORDER * 2) * j / (editor.state.lanes - 1)}
                                y={scroll}
                                width={width}
                                height={height}
                                fill="rgba(255,0,0,0.5)"
                                listening={false}
                            />}
                    </Fragment>
                })}
            </Fragment>
        })}
        {editor.state.playbackMs != undefined && <Rect
            x={editor.WIDTH / 2}
            y={editor.getYFromBeats(editor.state.playbackMs / 60_000 * editor.state.bpm)}
            width={editor.WIDTH * bigMarkerWidth}
            height={2}
            offset={{ x: editor.WIDTH * bigMarkerWidth / 2, y: 0 }}
            fill="aqua"
        />}
        <Rect
            x={editor.WIDTH / 2}
            y={editor.HEIGHT / 2}
            width={editor.WIDTH * bigMarkerWidth}
            height={2}
            offset={{ x: editor.WIDTH * bigMarkerWidth / 2, y: 0 }}
            fill="rgba(255,255,0,0.2)"
        />
        <Rect
            x={editor.WIDTH / 2}
            y={editor.getYFromBeats(editor.getTotalBeats())}
            width={editor.WIDTH * bigMarkerWidth}
            height={2}
            offset={{ x: editor.WIDTH * bigMarkerWidth / 2, y: 0 }}
            fill="red"
        />
        <Text
            x={editor.WIDTH / 2}
            y={editor.getYFromBeats(editor.getTotalBeats())}
            offset={{ x: -editor.WIDTH * 1 / 3, y: 15 }}
            fill="red"
            text="END"
            fontFamily='Inter'
            fontSize={30}
            align='center'
            verticalAlign='middle'
        />
    </Fragment>
}