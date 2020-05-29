import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
import Button from '@material-ui/core/Button';

const numRows = 25;
const numCols = 25;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

const App = () => {
  let count = 0;
  let countRef = useRef(count);
  countRef.current = count;
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeed] = useState(false);
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });
  const genRef = useRef(generation);
  genRef.current = generation;
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);

  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, speed ? 100 : 1000);
    setGeneration(genRef.current + 1);
  }, [speed]);

  const randomizer = Math.random();
  function random(number) {
    if (number >= 0.8) {
      return 'orange';
    } else if (number >= 0.6) {
      return 'green';
    } else if (number >= 0.4) {
      return 'pink';
    } else if (number >= 0.2) {
      return 'blue';
    } else {
      return 'red';
    }
  }
  return (
    <>
      <div className="boxed">
        <div
          className="grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${numCols}, 20px)`
          }}
        >
          {grid.map((rows, i) =>
            rows.map((col, k) => (
              <div
                key={`${i}-${k}`}
                onClick={() => {
                  const newGrid = produce(grid, gridCopy => {
                    gridCopy[i][k] = grid[i][k] ? 0 : 1;
                  });
                  setGrid(newGrid);
                }}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: grid[i][k] ? random(randomizer) : undefined,
                  border: 'solid .5px black'
                }}
              />
            ))
          )}
        </div>
        <div>
          <div className="rules">
            <h3>
              The universe of the Game of Life is an infinite, two-dimensional
              orthogonal grid of square cells, each of which is in one of two
              possible states, live or dead, (or populated and unpopulated,
              respectively).
            </h3>{' '}
            <h4>
              Every cell interacts with its eight neighbours, which are the
              cells that are horizontally, vertically, or diagonally adjacent.
              At each step in time, the following transitions occur:
            </h4>{' '}
            <ul>
              <li>
                Any live cell with fewer than two live neighbours dies, as if by
                underpopulation.
              </li>
              <li>
                Any live cell with two or three live neighbours lives on to the
                next generation.
              </li>
              <li>
                Any live cell with more than three live neighbours dies, as if
                by overpopulation.
              </li>
              <li>
                Any dead cell with exactly three live neighbours becomes a live
                cell, as if by reproduction.
              </li>
            </ul>
            <p>
              These rules, which compare the behavior of the automaton to real
              life, can be condensed into the following: Any live cell with two
              or three live neighbours survives. Any dead cell with three live
              neighbours becomes a live cell. All other live cells die in the
              next generation. Similarly, all other dead cells stay dead. The
              initial pattern constitutes the seed of the system. The first
              generation is created by applying the above rules simultaneously
              to every cell in the seed; births and deaths occur simultaneously,
              and the discrete moment at which this happens is sometimes called
              a tick. Each generation is a pure function of the preceding one.
              The rules continue to be applied repeatedly to create further
              generations.
            </p>
          </div>
        </div>
      </div>
      <div className="buttons">
        <h1>Generation: {generation}</h1>
        <div className="first">
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setRunning(!running);
              if (!running) {
                runningRef.current = true;
                runSimulation();
              }
            }}
          >
            {running ? 'Pause' : 'Start'}
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              const rows = [];
              for (let i = 0; i < numRows; i++) {
                rows.push(
                  Array.from(Array(numCols), () =>
                    Math.random() > 0.8 ? 1 : 0
                  )
                );
              }

              setGrid(rows);
            }}
          >
            Fill
          </Button>
        </div>
        <div className="second">
          <Button
            variant="contained"
            onClick={() => {
              setGrid(generateEmptyGrid());
              setGeneration(0);
            }}
          >
            clear
          </Button>
          <Button variant="contained" onClick={() => setSpeed(!speed)}>
            {speed ? 'Fast' : 'Slow'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default App;
