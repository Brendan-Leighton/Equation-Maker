/**
 * @fileoverview This file contains the main page for the EquationMaker app.
 */

import type { NextPage } from 'next'
import Head from 'next/head'
import React, { useState } from 'react'
import Equation from './components/Equation/Equation'
import { IEquation } from './components/Equation/interfaces/IEquation'
import TestData from './data/TestData'
import './global.module.css'


const Home: NextPage = () => {

	/** Holds all equations that have been created */
	const [equations, setEquations] = useState(TestData)

	/**
	 * Adds a new equation to the list of equations.
	 */
	function handleClick_AddNewEquation() {
		setEquations([new IEquation([], 'equations name'), ...equations])
	}

	return (
		<div>
			<Head>
				<title>Equation Maker</title>
				<meta name="description" content="Converted from Vite to Next.js" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className='App'>
				{/* Equations Controls */}
				<div className='equations_controls'>
					<button onClick={handleClick_AddNewEquation}>Add New Equation</button>
				</div>

				<ul className='equations'>
					{ /* List of equations */
						equations.map((eq, index) => {
							return (
								<li key={index}>
									<Equation
										id={index.toString()}
										equation={eq}
									/>
								</li>
							)
						})
					}
				</ul>
			</main>
		</div>
	)
}

export default Home