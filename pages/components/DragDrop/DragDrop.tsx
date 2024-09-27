import React, { useEffect, useState } from "react"
// import '../../App.css'
import styles from './DragDrop.module.css'
// import Droppable from "./Droppable";

export function Draggable(props) {

	function handleDragStart(event) {
		// console.log('drag-start: ', event);
		event.dataTransfer.clearData()
		event.dataTransfer.setData('piece-index', event.target.dataset.pieceIndex)
	}

	return (
		<div
			className="draggable"
			draggable='true'
			onDragStart={e => handleDragStart(e)}
			onDrop={e => props.handleDrop(e)}
			id={'draggable_' + props.id}
			data-piece-index={props.id}
		>
			{props.content}
		</div>
	)
}

export function Droppable(props) {

	function handleDragOver(event) {
		event.preventDefault()
	}

	let newIndex
	let oldIndex

	function handleDrop(event) {
		event.preventDefault()
		// console.log('drop: ', event);
		oldIndex = event.dataTransfer.getData('piece-index')
		newIndex = event.target.dataset.pieceIndex
		// event.target.appendChild(document.getElementById(data))
		props.updateDraggables(oldIndex, newIndex)
	}

	return (
		<ul
			onDrop={e => handleDrop(e)}
			onDragOver={e => handleDragOver(e)}
			className='droppable'
			id={'droppable_' + props.id}
			key={'drop_area_' + props.id}
		>
			{
				props.draggables.map((draggable, index) => {
					return (
						<Draggable
							content={draggable}
							id={index}
							handleDrop={handleDrop}
						/>
					)
				})
			}
		</ul>
	)
}

export default function DragDrop(props) {

	const [draggables, setDraggables] = useState([])
	let grabbedIndex = null
	let hoveredIndex = null

	useEffect(() => {
		setDraggables(props.draggableContent)
	}, [props.draggableContent])

	// console.log('draggables: ', draggables);

	/**
	 * 
	 * @param {Event} event 
	 */
	function handleDragOver(event) {
		// console.log('DragOver: event: ', event);
		event.preventDefault()

		// event.target.parentElement.parentElement.parentElement.parentElement.classList.add('drop-location')

		const hoveredIndex = event.target.parentElement.dataset.pieceIndex
		// console.log('hoveredIndex: ', hoveredIndex);
	}


	let newIndex
	let oldIndex

	function handleDrop(event) {
		event.preventDefault()
		// console.log('drop: ', event);

		// get indexs to swap
		oldIndex = event.dataTransfer.getData('piece-index')
		newIndex = event.currentTarget.dataset.pieceIndex
		// console.log(`oldIndex: ${oldIndex}, newIndex: ${newIndex}`);
		if (oldIndex === undefined || newIndex === undefined) return

		// swap indexs
		props.onDrop(oldIndex, newIndex)
	}

	function updateDraggables(oldIndex, newIndex) {

		const newDraggables = draggables;
		// const itemAtNewIndex = draggables[newIndex]

		[newDraggables[oldIndex], newDraggables[newIndex]] = [newDraggables[newIndex], newDraggables[oldIndex]]
		// newDraggables[newIndex] = draggables[oldIndex]
		// newDraggables[oldIndex] = itemAtNewIndex;

		setDraggables([...newDraggables])
	}

	function renderDropArea(id) {
		return (
			<ul
				onDrop={e => handleDrop(e)}
				onDragOver={e => handleDragOver(e)}
				className='droppable'
				id={'droppable_' + id}
				key={'drop_area_' + id}
			>
				{
					draggables.map((draggable, index) => {
						return (
							<li
								className={styles.draggable_li}
								key={'draggable_' + index}
							>
								<Draggable
									content={draggable}
									id={index}
									handleDrop={handleDrop}
								/>
							</li>
						)
					})
				}
			</ul>
		)
	}

	return (
		<>
			{renderDropArea(props.id)}
		</>
	)
}