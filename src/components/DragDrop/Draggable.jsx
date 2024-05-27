import React from 'react'

export default function Draggable(props) {

	function handleDragStart(event) {
		event.dataTransfer.clearData();
		console.log('DragStart: ', event.target);
		event.dataTransfer.setData('id', event.target.id)
		event.dataTransfer.setData('element', event.target)
	}

	return (
		<div
			className="draggable"
			draggable={props.isDraggable}
			onDragStart={e => handleDragStart(e)}
			id={'draggable_' + props.id}
		>
			{props.content}
		</div>
	)
}
