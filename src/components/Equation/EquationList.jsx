import React from 'react'

import Equation from './Equation'

export default function EquationList({ equations }) {
	return (
		<ul>
			{
				equations.map((eq, index) => {
					return (
						<li key={index}>
							<Equation
								equation={eq}
							/>
						</li>
					)
				})
			}
		</ul>
	)
}
