import React from 'react';
import styles from '../Equation.module.css';

import DragDrop from '../../DragDrop/DragDrop';
import { TYPES } from '../interfaces/IEquation';
import { EditablePiece } from './EditablePiece';

export function EditableEquation({
    id,
    equation,
    handleChange_PieceValue,
    handleChange_PieceName,
    handleClick_EditPiece,
    updateExpression
}) {
    return (
        <div className={styles.draggable_container}>
            <DragDrop
                id={id}
                draggableContent={
                    equation.pieces.map((p, index) => {
                        return <EditablePiece
                            p={p}
                            index={index}
                            handleClick_EditPiece={() => handleClick_EditPiece(index)}
                            handleChange_PieceValue={e => handleChange_PieceValue(e, index)}
                            handleChange_PieceName={e => handleChange_PieceName(e, index)}
                        />
                    })
                }
                onDrop={updateExpression}
            />
        </div>
    )
}