// REACT
import { useState } from 'react'
// STYLES
import './App.css'
import styles from './App.module.css'
// COMPONENTS
import DragDrop from './components/DragDrop/DragDrop';
// INTERFACES
import { IEquation } from './components/Equation/interfaces/IEquation';
// TESTING
import TestData from './data/TestData';
import Equation from './components/Equation/Equation';

function App() {

    //
    // STATE
    //

    /** Holds all equations that have been created */
    const [equations, setEquations] = useState(TestData)

    function handleClick_AddNewEquation() {
        setEquations([new IEquation([], 'equations name'), ...equations])
    }

    // console.log('TestData: ', TestData);
    // console.log('equations: ', equations);

    /** App.jsx's return statement */
    return (
        <div className={styles.App}>
            {/* Equations Controls */}
            <div className={styles.equations_controls}>
                <button onClick={handleClick_AddNewEquation}>Add New Equation</button>
            </div>

            <ul className={styles.equations}>
                { /* List of equations */
                    equations.map((eq, index) => {
                        return (
                            <li key={index}>
                                <Equation
                                    id={index}
                                    equation={eq}
                                />
                            </li>
                        )
                    })
                }
            </ul>

            {/* <EquationList
				equations={equations}
			/> */}
        </div>
    )
}

export default App
