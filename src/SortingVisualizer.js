import React, { Component } from "react";
import "./SortingVisualizer.css";

class SortingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      array: [],
      selectedAlgorithm: "Bubble Sort",
      animationSpeed: 50,
      arraySize: 100,
    };
  }

  componentDidMount() {
    this.resetArray();
  }

  

  resetArray() {
    const { arraySize } = this.state;
    const array = [];
    for (let i = 0; i < arraySize; i++) {
      array.push(randomIntFromInterval(5, 500));
    }
    this.setState({ array });
  }

  handleArraySizeChange = (event) => {
    const newArraySize = parseInt(event.target.value, 10);
    this.setState({ arraySize: newArraySize }, () => {
      this.resetArray();
    });
  }

  handleAlgorithmChange = (event) => {
    this.setState({ selectedAlgorithm: event.target.value });
  }

  handleSpeedChange = (event) => {
    this.setState({ animationSpeed: parseInt(event.target.value, 10) });
  }

  handleReset = () => {
    this.resetArray();
  }


  async visualizeSorting() {
    const { selectedAlgorithm, array, animationSpeed } = this.state;
    let animations = [];

    if (selectedAlgorithm === "Bubble Sort") {
      animations = this.bubbleSort(array.slice());
    } else if (selectedAlgorithm === "Selection Sort") {
      animations = this.selectionSort(array.slice());
    }
    // Add more sorting algorithms as needed

    const arrayBars = document.getElementsByClassName("array-bar");
    let sortedArray = array.slice(); // Create a copy of the array to track the sorted version

    for (let i = 0; i < animations.length; i++) {
      const [action, a, b] = animations[i];

      if (action === "comparison") {
        arrayBars[a].style.backgroundColor = "red";
        arrayBars[b].style.backgroundColor = "red";
      } else if (action === "swap") {
        const [heightA, heightB] = [sortedArray[a], sortedArray[b]]; // Update sorted array
        sortedArray[a] = heightB;
        sortedArray[b] = heightA;

        arrayBars[a].style.height = `${heightB}px`;
        arrayBars[b].style.height = `${heightA}px`;
        await new Promise((resolve) =>
          setTimeout(() => {
            resolve();
          }, animationSpeed)
        );
        arrayBars[a].style.backgroundColor = "turquoise";
        arrayBars[b].style.backgroundColor = "turquoise";
      }
    }

    // After sorting is complete, set the state with the sorted array
    this.setState({ array: sortedArray });
  }



  bubbleSort(arr) {
    const animations = [];
    const n = arr.length;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        animations.push(["comparison", j, j + 1]);

        if (arr[j] > arr[j + 1]) {
          animations.push(["swap", j, j + 1]);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }

    return animations;
  }

  selectionSort(arr) {
    const animations = [];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;

      for (let j = i + 1; j < n; j++) {
        animations.push(["comparison", minIndex, j]);

        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }

      if (minIndex !== i) {
        animations.push(["swap", i, minIndex]);
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      }
    }

    return animations;
  }

  render() {
    const { array, selectedAlgorithm, animationSpeed, arraySize } = this.state;

    return (
      <div className="sorting-visualizer">
        <div className="array-container">
          {array.map((value, index) => (
            <div
              className="array-bar"
              key={index}
              style={{ height: `${value}px` }}
            ></div>
          ))}
        </div>

        <div className="controls">
          <button onClick={() => this.resetArray()}>Generate New Array</button>
          <label>Select Array Size:</label>
          <input
            type="range"
            min="5"
            max="200"
            value={arraySize}
            onChange={this.handleArraySizeChange}
          />
          <span>{arraySize}</span>
          <label>Select Sorting Algorithm:</label>
          <select value={selectedAlgorithm} onChange={this.handleAlgorithmChange}>
            <option value="Bubble Sort">Bubble Sort</option>
            <option value="Selection Sort">Selection Sort</option>
            {/* Add options for other sorting algorithms */}
          </select>
          <label>Animation Speed (ms):</label>
          <input
            type= "number"
            value={animationSpeed}
            onChange={this.handleSpeedChange}
          />
          <button onClick={() => this.visualizeSorting()}>Visualize Sorting</button>
        </div>
      </div>
    );
  }
}

export default SortingVisualizer;

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
