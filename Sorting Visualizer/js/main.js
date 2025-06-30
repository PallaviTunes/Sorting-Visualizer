// Fallback if sounds.js isn't loaded
window.sortingSounds = window.sortingSounds || {
    play: () => {},
    toggle: () => {}
};

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const arrayContainer = document.getElementById('array-container');
    const generateBtn = document.getElementById('generate');
    const sortBtn = document.getElementById('sort');
    const stopBtn = document.getElementById('stop');
    const algorithmSelect = document.getElementById('algorithm');
    const sizeSlider = document.getElementById('size');
    const speedSlider = document.getElementById('speed');
    const arrayTypeSelect = document.getElementById('array-type');
    const soundToggle = document.getElementById('sound-toggle');
    const sizeValue = document.getElementById('size-value');
    const speedValue = document.getElementById('speed-value');
    const algorithmInfo = document.getElementById('algorithm-info');
    const timeComplexity = document.getElementById('time-complexity');
    const spaceComplexity = document.getElementById('space-complexity');
    const comparisonsEl = document.getElementById('comparisons');
    const swapsEl = document.getElementById('swaps');
    const timeEl = document.getElementById('time');
    const themeToggle = document.getElementById('theme-toggle');
    const exportBtn = document.getElementById('export-btn');
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');

    // State variables
    let array = [];
    let isSorting = false;
    let stopSorting = false;
    let animationSpeed = 1000 / speedSlider.value;
    let comparisons = 0;
    let swaps = 0;
    let startTime = 0;
    
    // Initialize theme
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', newTheme);
    }

    // Algorithm information
    const algorithmInfoMap = {
        bubble: {
            description: "Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
            time: "O(n²)",
            space: "O(1)"
        },
        selection: {
            description: "Selection Sort divides the input into sorted and unsorted parts, repeatedly finding the minimum from the unsorted part.",
            time: "O(n²)",
            space: "O(1)"
        },
        insertion: {
            description: "Insertion Sort builds the final sorted array one item at a time by inserting each item into its correct position.",
            time: "O(n²)",
            space: "O(1)"
        },
        merge: {
            description: "Merge Sort divides the array into halves, sorts each half recursively, and then merges the sorted halves.",
            time: "O(n log n)",
            space: "O(n)"
        },
        quick: {
            description: "Quick Sort selects a 'pivot' element and partitions the array around the pivot.",
            time: "O(n log n) average, O(n²) worst case",
            space: "O(log n)"
        },
        heap: {
            description: "Heap Sort uses a binary heap to sort elements by repeatedly extracting the maximum element.",
            time: "O(n log n)",
            space: "O(1)"
        },
        radix: {
            description: "Radix Sort processes individual digits to sort numbers from least significant to most significant digit.",
            time: "O(nk)",
            space: "O(n + k)"
        },
        shell: {
            description: "Shell Sort is an optimized Insertion Sort that allows exchange of items that are far apart.",
            time: "O(n log n) to O(n²)",
            space: "O(1)"
        },
        counting: {
            description: "Counting Sort counts the number of objects with distinct key values, then calculates positions.",
            time: "O(n + k)",
            space: "O(n + k)"
        }
    };

    // Initialize sorting algorithms with required utils
    if (typeof initSortingUtils === 'function') {
        initSortingUtils({
            animationSpeed,
            swapElements,
            compareElements,
            updateStats
        });
    }

    // Generate new array
    function generateNewArray() {
        array = [];
        arrayContainer.innerHTML = '';
        
        const arraySize = parseInt(sizeSlider.value);
        const arrayType = arrayTypeSelect.value;
        const containerWidth = arrayContainer.clientWidth;
        const maxBarWidth = Math.max(5, Math.floor(containerWidth / arraySize) - 2);
        
        // Generate array based on selected type
        switch (arrayType) {
            case 'random':
                for (let i = 0; i < arraySize; i++) {
                    array.push(Math.floor(Math.random() * 100) + 5);
                }
                break;
            case 'nearly-sorted':
                for (let i = 0; i < arraySize; i++) {
                    array.push(i * 3 + 5);
                }
                // Randomly swap some elements
                for (let i = 0; i < arraySize / 10; i++) {
                    const idx1 = Math.floor(Math.random() * arraySize);
                    const idx2 = Math.floor(Math.random() * arraySize);
                    [array[idx1], array[idx2]] = [array[idx2], array[idx1]];
                }
                break;
            case 'reverse-sorted':
                for (let i = 0; i < arraySize; i++) {
                    array.push((arraySize - i) * 3 + 5);
                }
                break;
            case 'few-unique':
                const uniqueValues = [10, 30, 50, 70, 90];
                for (let i = 0; i < arraySize; i++) {
                    array.push(uniqueValues[Math.floor(Math.random() * uniqueValues.length)]);
                }
                break;
        }
        
        // Create bars
        for (let i = 0; i < arraySize; i++) {
            const bar = document.createElement('div');
            bar.classList.add('array-bar');
            bar.style.height = `${array[i] * 3}px`;
            bar.style.width = `${maxBarWidth}px`;
            arrayContainer.appendChild(bar);
        }
    }

    // Sorting function
    async function sortArray() {
        const selectedAlgorithm = algorithmSelect.value;
        const arrayBars = document.querySelectorAll('.array-bar');
        
        try {
            switch (selectedAlgorithm) {
                case 'bubble': await bubbleSort([...array], arrayBars); break;
                case 'selection': await selectionSort([...array], arrayBars); break;
                case 'insertion': await insertionSort([...array], arrayBars); break;
                case 'merge': await mergeSort([...array], arrayBars); break;
                case 'quick': await quickSort([...array], arrayBars); break;
                case 'heap': await heapSort([...array], arrayBars); break;
                case 'radix': await radixSort([...array], arrayBars); break;
                case 'shell': await shellSort([...array], arrayBars); break;
                case 'counting': await countingSort([...array], arrayBars); break;
            }
            
            if (!stopSorting) {
                // Visualize completion
                for (let i = 0; i < arrayBars.length; i++) {
                    arrayBars[i].classList.add('sorted');
                    await sleep(animationSpeed / 5);
                }
                sortingSounds.play('complete');
                
                // Update time
                const endTime = performance.now();
                timeEl.textContent = `${Math.round(endTime - startTime)}ms`;
            }
        } catch (e) {
            console.log("Sorting stopped:", e.message);
        } finally {
            isSorting = false;
            sortBtn.disabled = false;
            generateBtn.disabled = false;
            stopBtn.disabled = true;
        }
    }

    // Utility functions
    function resetStats() {
        comparisons = 0;
        swaps = 0;
        comparisonsEl.textContent = "0";
        swapsEl.textContent = "0";
        timeEl.textContent = "0ms";
    }

    function updateStats() {
        comparisonsEl.textContent = comparisons;
        swapsEl.textContent = swaps;
    }

    function sleep(ms) {
        return new Promise(resolve => {
            if (stopSorting) throw new Error("Sorting stopped by user");
            setTimeout(resolve, ms);
        });
    }

    async function swapElements(array, i, j, arrayBars) {
        // Highlight elements being swapped
        arrayBars[i].classList.add('comparing');
        arrayBars[j].classList.add('comparing');
        await sleep(animationSpeed / 2);
        
        sortingSounds.play('swap');
        
        // Perform swap
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        swaps++;
        updateStats();
        
        // Update heights
        arrayBars[i].style.height = `${array[i] * 3}px`;
        arrayBars[j].style.height = `${array[j] * 3}px`;
        
        // Visualize swap
        arrayBars[i].classList.add('swapping');
        arrayBars[j].classList.add('swapping');
        await sleep(animationSpeed / 2);
        
        // Remove highlight classes
        arrayBars[i].classList.remove('comparing', 'swapping');
        arrayBars[j].classList.remove('comparing', 'swapping');
    }

    async function compareElements(i, j, arrayBars) {
        arrayBars[i].classList.add('comparing');
        arrayBars[j].classList.add('comparing');
        
        sortingSounds.play('compare');
        
        comparisons++;
        updateStats();
        await sleep(animationSpeed);
        arrayBars[i].classList.remove('comparing');
        arrayBars[j].classList.remove('comparing');
    }

    function updateAlgorithmInfo() {
        const selectedAlgorithm = algorithmSelect.value;
        const info = algorithmInfoMap[selectedAlgorithm];
        
        algorithmInfo.innerHTML = `<p>${info.description}</p>`;
        timeComplexity.textContent = info.time;
        spaceComplexity.textContent = info.space;
    }

    // State management
    function exportState() {
        const state = {
            array: [...array],
            algorithm: algorithmSelect.value,
            size: sizeSlider.value,
            speed: speedSlider.value,
            arrayType: arrayTypeSelect.value,
            theme: document.documentElement.getAttribute('data-theme')
        };

        const dataStr = JSON.stringify(state);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportName = `sorting-state-${new Date().toISOString()}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportName);
        linkElement.click();
    }

    async function importState(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const fileContent = await file.text();
            const state = JSON.parse(fileContent);

            if (!state.array || !state.algorithm) {
                throw new Error("Invalid state file");
            }

            // Apply state
            algorithmSelect.value = state.algorithm;
            sizeSlider.value = state.size;
            speedSlider.value = state.speed;
            arrayTypeSelect.value = state.arrayType;
            sizeValue.textContent = state.size;
            speedValue.textContent = state.speed;
            animationSpeed = 1000 / state.speed;

            // Apply theme if exists
            if (state.theme) {
                document.documentElement.setAttribute('data-theme', state.theme);
                themeToggle.innerHTML = state.theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            }

            // Generate array from state
            array = [...state.array];
            arrayContainer.innerHTML = '';
            
            const containerWidth = arrayContainer.clientWidth;
            const maxBarWidth = Math.max(5, Math.floor(containerWidth / array.length) - 2);
            
            for (let i = 0; i < array.length; i++) {
                const bar = document.createElement('div');
                bar.classList.add('array-bar');
                bar.style.height = `${array[i] * 3}px`;
                bar.style.width = `${maxBarWidth}px`;
                arrayContainer.appendChild(bar);
            }

            updateAlgorithmInfo();
            resetStats();

        } catch (e) {
            console.error("Error importing state:", e);
            alert("Error importing state: " + e.message);
        } finally {
            event.target.value = '';
        }
    }

    // Initialize
    function initialize() {
        initTheme();
        updateAlgorithmInfo();
        generateNewArray();
        
        // Event listeners
        themeToggle.addEventListener('click', toggleTheme);
        exportBtn.addEventListener('click', exportState);
        importBtn.addEventListener('click', () => importFile.click());
        importFile.addEventListener('change', importState);
        
        generateBtn.addEventListener('click', () => {
            if (!isSorting) {
                generateNewArray();
                resetStats();
            }
        });

        sortBtn.addEventListener('click', async () => {
            if (!isSorting && array.length > 0) {
                isSorting = true;
                stopSorting = false;
                sortBtn.disabled = true;
                generateBtn.disabled = true;
                stopBtn.disabled = false;
                startTime = performance.now();
                resetStats();
                await sortArray();
            }
        });

        stopBtn.addEventListener('click', () => {
            if (isSorting) {
                stopSorting = true;
                isSorting = false;
                sortBtn.disabled = false;
                generateBtn.disabled = false;
                stopBtn.disabled = true;
            }
        });

        algorithmSelect.addEventListener('change', updateAlgorithmInfo);

        sizeSlider.addEventListener('input', () => {
            sizeValue.textContent = sizeSlider.value;
            if (!isSorting) {
                generateNewArray();
                resetStats();
            }
        });

        speedSlider.addEventListener('input', () => {
            speedValue.textContent = speedSlider.value;
            animationSpeed = 1000 / speedSlider.value;
        });

        arrayTypeSelect.addEventListener('change', () => {
            if (!isSorting) {
                generateNewArray();
                resetStats();
            }
        });

        soundToggle.addEventListener('change', () => {
            sortingSounds.toggle(soundToggle.checked);
        });
    }

    // Start the application
    initialize();
});