import { Fragment } from 'react';
import { Circle, Rect, Text } from 'react-konva';
import MapEditor from './MapEditor';

export default function BeatMarkers({ editor }: { editor: MapEditor }) {
    const bigMarkerWidth = 5 / 8;
    const smallMarkerWidth = 9 / 16;
    return <Fragment>
        {Array.from({ length: Math.floor(editor.getTotalBeats() * editor.state.precision) + 1 }, (_, i) => {
            const beatNumber = i / editor.state.precision;
            const scroll = -editor.state.beatGap * beatNumber + editor.state.scroll;
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
                {Array.from({ length: 5 }, (_, j) => {
                    const width = (editor.WIDTH - editor.LINES_BORDER) / 6;
                    const height = editor.state.beatGap / 4
                    return <Fragment key={j}>
                        <Rect
                            x={editor.LINES_BORDER + (editor.WIDTH - editor.LINES_BORDER * 2) * j / 4}
                            y={scroll}
                            width={width}
                            height={height}
                            offset={{ x: width / 2, y: height / 2 }}
                            onPointerEnter={() => editor.setState({ hover: [i, j] })}
                            onPointerClick={() => editor.addNote(beatNumber, j)}
                        />
                        {editor.state.hover?.[0] == i && editor.state.hover?.[1] == j &&
                            <Circle
                                x={editor.LINES_BORDER + (editor.WIDTH - editor.LINES_BORDER * 2) * j / 4}
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
            y={-editor.state.beatGap * editor.getTotalBeats() + editor.state.scroll}
            width={editor.WIDTH * bigMarkerWidth}
            height={2}
            offset={{ x: editor.WIDTH * bigMarkerWidth / 2, y: 0 }}
            fill="red"
        />
        <Text
            x={editor.WIDTH / 2}
            y={-editor.state.beatGap * editor.getTotalBeats() + editor.state.scroll}
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