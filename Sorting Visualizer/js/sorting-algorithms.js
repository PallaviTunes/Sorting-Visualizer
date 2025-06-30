// Shared dependencies (will be initialized by main.js)
let animationSpeed;
let swapElements;
let compareElements;
let updateStats;

// Initialize with utils from main.js
function initSortingUtils(utils) {
    animationSpeed = utils.animationSpeed;
    swapElements = utils.swapElements;
    compareElements = utils.compareElements;
    updateStats = utils.updateStats;
}

// Sleep helper (fallback if not provided by main.js)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ================= SORTING ALGORITHMS ================= //

// Bubble Sort
async function bubbleSort(array, arrayBars) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            await compareElements(j, j + 1, arrayBars);
            if (array[j] > array[j + 1]) {
                await swapElements(array, j, j + 1, arrayBars);
            }
        }
        arrayBars[n - i - 1].classList.add('sorted');
    }
    arrayBars[0].classList.add('sorted');
}

// Selection Sort
async function selectionSort(array, arrayBars) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        arrayBars[minIndex].classList.add('comparing');
        
        for (let j = i + 1; j < n; j++) {
            arrayBars[j].classList.add('comparing');
            await sleep(animationSpeed / 2);
            
            if (array[j] < array[minIndex]) {
                arrayBars[minIndex].classList.remove('comparing');
                minIndex = j;
                arrayBars[minIndex].classList.add('comparing');
                await sleep(animationSpeed / 2);
            } else {
                arrayBars[j].classList.remove('comparing');
            }
        }
        
        if (minIndex !== i) {
            await swapElements(array, i, minIndex, arrayBars);
        }
        
        arrayBars[i].classList.add('sorted');
        arrayBars[minIndex].classList.remove('comparing');
    }
    arrayBars[n - 1].classList.add('sorted');
}

// Insertion Sort
async function insertionSort(array, arrayBars) {
    const n = array.length;
    arrayBars[0].classList.add('sorted');
    
    for (let i = 1; i < n; i++) {
        let j = i;
        arrayBars[j].classList.add('comparing');
        await sleep(animationSpeed);
        
        while (j > 0 && array[j] < array[j - 1]) {
            await swapElements(array, j, j - 1, arrayBars);
            j--;
        }
        
        arrayBars[i].classList.add('sorted');
    }
}

// Merge Sort
async function mergeSort(array, arrayBars) {
    await mergeSortHelper(array, 0, array.length - 1, arrayBars);
}

async function mergeSortHelper(array, left, right, arrayBars) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        await mergeSortHelper(array, left, mid, arrayBars);
        await mergeSortHelper(array, mid + 1, right, arrayBars);
        await merge(array, left, mid, right, arrayBars);
    }
}

async function merge(array, left, mid, right, arrayBars) {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    
    const leftArray = new Array(n1);
    const rightArray = new Array(n2);
    
    for (let i = 0; i < n1; i++) {
        leftArray[i] = array[left + i];
    }
    for (let j = 0; j < n2; j++) {
        rightArray[j] = array[mid + 1 + j];
    }
    
    let i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
        arrayBars[left + i].classList.add('comparing');
        arrayBars[mid + 1 + j].classList.add('comparing');
        await sleep(animationSpeed);
        
        if (leftArray[i] <= rightArray[j]) {
            array[k] = leftArray[i];
            arrayBars[k].style.height = `${array[k] * 3}px`;
            arrayBars[left + i].classList.remove('comparing');
            i++;
        } else {
            array[k] = rightArray[j];
            arrayBars[k].style.height = `${array[k] * 3}px`;
            arrayBars[mid + 1 + j].classList.remove('comparing');
            j++;
        }
        
        k++;
    }
    
    while (i < n1) {
        array[k] = leftArray[i];
        arrayBars[k].style.height = `${array[k] * 3}px`;
        i++;
        k++;
    }
    
    while (j < n2) {
        array[k] = rightArray[j];
        arrayBars[k].style.height = `${array[k] * 3}px`;
        j++;
        k++;
    }
    
    for (let m = left; m <= right; m++) {
        arrayBars[m].classList.add('sorted');
        await sleep(animationSpeed / 10);
    }
}

// async function swapElements(array, i, j, arrayBars) {
//     // Get the wrapper elements (parent of the bars)
//     const wrappers = document.querySelectorAll('.bar-wrapper');
//     const wrapperI = wrappers[i];
//     const wrapperJ = wrappers[j];
    
//     // Highlight elements being swapped
//     arrayBars[i].classList.add('comparing');
//     arrayBars[j].classList.add('comparing');
//     await sleep(animationSpeed / 2);
    
//     sortingSounds.play('swap');
    
//     // Perform swap
//     const temp = array[i];
//     array[i] = array[j];
//     array[j] = temp;
//     swaps++;
//     updateStats();
    
//     // Update heights and numbers
//     arrayBars[i].style.height = `${array[i] * 3}px`;
//     arrayBars[j].style.height = `${array[j] * 3}px`;
//     wrapperI.querySelector('.bar-number').textContent = array[i];
//     wrapperJ.querySelector('.bar-number').textContent = array[j];
    
//     // Visualize swap with transform
//     wrapperI.style.transform = `translateX(${(j - i) * (wrapperI.offsetWidth + 4)}px)`;
//     wrapperJ.style.transform = `translateX(${(i - j) * (wrapperJ.offsetWidth + 4)}px)`;
    
//     arrayBars[i].classList.add('swapping');
//     arrayBars[j].classList.add('swapping');
//     await sleep(animationSpeed / 2);
    
//     // Remove highlight classes and reset transforms
//     arrayBars[i].classList.remove('comparing', 'swapping');
//     arrayBars[j].classList.remove('comparing', 'swapping');
    
//     // Swap the DOM elements
//     if (i < j) {
//         arrayContainer.insertBefore(wrapperJ, wrapperI);
//     } else {
//         arrayContainer.insertBefore(wrapperI, wrapperJ.nextSibling);
//     }
    
//     // Reset transforms
//     wrapperI.style.transform = '';
//     wrapperJ.style.transform = '';
// }

// Quick Sort
async function quickSort(array, arrayBars) {
    await quickSortHelper(array, 0, array.length - 1, arrayBars);
}

async function quickSortHelper(array, low, high, arrayBars) {
    if (low < high) {
        const pi = await partition(array, low, high, arrayBars);
        await quickSortHelper(array, low, pi - 1, arrayBars);
        await quickSortHelper(array, pi + 1, high, arrayBars);
    } else if (low === high) {
        arrayBars[low].classList.add('sorted');
        await sleep(animationSpeed);
    }
}

async function partition(array, low, high, arrayBars) {
    const pivot = array[high];
    arrayBars[high].classList.add('pivot');
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        await compareElements(j, high, arrayBars);
        
        if (array[j] < pivot) {
            i++;
            if (i !== j) {
                await swapElements(array, i, j, arrayBars);
            }
        }
    }
    
    await swapElements(array, i + 1, high, arrayBars);
    arrayBars[high].classList.remove('pivot');
    arrayBars[i + 1].classList.add('sorted');
    
    return i + 1;
}

// Heap Sort
async function heapSort(array, arrayBars) {
    const n = array.length;
    
    // Build heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(array, n, i, arrayBars);
    }
    
    // Extract elements
    for (let i = n - 1; i > 0; i--) {
        await swapElements(array, 0, i, arrayBars);
        arrayBars[i].classList.add('sorted');
        await heapify(array, i, 0, arrayBars);
    }
    
    arrayBars[0].classList.add('sorted');
}

async function heapify(array, n, i, arrayBars) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    arrayBars[i].classList.add('comparing');
    if (left < n) arrayBars[left].classList.add('comparing');
    if (right < n) arrayBars[right].classList.add('comparing');
    await sleep(animationSpeed);
    
    if (left < n && array[left] > array[largest]) {
        largest = left;
    }
    
    if (right < n && array[right] > array[largest]) {
        largest = right;
    }
    
    if (largest !== i) {
        await swapElements(array, i, largest, arrayBars);
        await heapify(array, n, largest, arrayBars);
    }
    
    arrayBars[i].classList.remove('comparing');
    if (left < n) arrayBars[left].classList.remove('comparing');
    if (right < n) arrayBars[right].classList.remove('comparing');
}

// Radix Sort
async function radixSort(array, arrayBars) {
    const maxNum = Math.max(...array) * 1;
    let divisor = 1;
    
    while (divisor < maxNum) {
        await countingSortForRadix(array, divisor, arrayBars);
        divisor *= 10;
    }
}

async function countingSortForRadix(array, divisor, arrayBars) {
    const buckets = Array.from({ length: 10 }, () => []);
    const n = array.length;
    
    for (let i = 0; i < n; i++) {
        const digit = Math.floor(array[i] / divisor) % 10;
        buckets[digit].push(array[i]);
        
        arrayBars[i].classList.add('comparing');
        await sleep(animationSpeed / 2);
        arrayBars[i].classList.remove('comparing');
    }
    
    let idx = 0;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < buckets[i].length; j++) {
            array[idx] = buckets[i][j];
            arrayBars[idx].style.height = `${array[idx] * 3}px`;
            
            arrayBars[idx].classList.add('swapping');
            await sleep(animationSpeed / 2);
            arrayBars[idx].classList.remove('swapping');
            
            idx++;
        }
    }
}

// Shell Sort
async function shellSort(array, arrayBars) {
    const n = array.length;
    let gap = Math.floor(n / 2);
    
    while (gap > 0) {
        for (let i = gap; i < n; i++) {
            const temp = array[i];
            let j = i;
            
            arrayBars[j].classList.add('comparing');
            arrayBars[j - gap].classList.add('comparing');
            await sleep(animationSpeed / 2);
            
            while (j >= gap && array[j - gap] > temp) {
                arrayBars[j].classList.add('swapping');
                arrayBars[j - gap].classList.add('swapping');
                
                array[j] = array[j - gap];
                arrayBars[j].style.height = `${array[j] * 3}px`;
                swaps++;
                updateStats();
                
                await sleep(animationSpeed / 2);
                
                arrayBars[j].classList.remove('swapping');
                arrayBars[j - gap].classList.remove('swapping');
                
                j -= gap;
                
                if (j >= gap) {
                    arrayBars[j].classList.add('comparing');
                    arrayBars[j - gap].classList.add('comparing');
                    await sleep(animationSpeed / 2);
                }
            }
            
            arrayBars[j].classList.remove('comparing');
            if (j - gap >= 0) {
                arrayBars[j - gap].classList.remove('comparing');
            }
            
            array[j] = temp;
            arrayBars[j].style.height = `${array[j] * 3}px`;
            swaps++;
            updateStats();
        }
        
        gap = Math.floor(gap / 2);
    }
    
    for (let i = 0; i < arrayBars.length; i++) {
        arrayBars[i].classList.add('sorted');
    }
}

// Counting Sort
async function countingSort(array, arrayBars) {
    const max = Math.max(...array);
    const min = Math.min(...array);
    const range = max - min + 1;
    const count = new Array(range).fill(0);
    const output = new Array(array.length);
    
    for (let i = 0; i < array.length; i++) {
        count[array[i] - min]++;
        
        arrayBars[i].classList.add('comparing');
        await sleep(animationSpeed / 3);
        arrayBars[i].classList.remove('comparing');
    }
    
    for (let i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
    }
    
    for (let i = array.length - 1; i >= 0; i--) {
        output[count[array[i] - min] - 1] = array[i];
        count[array[i] - min]--;
        
        const barIndex = count[array[i] - min];
        if (barIndex >= 0 && barIndex < arrayBars.length) {
            arrayBars[barIndex].style.height = `${array[i] * 3}px`;
            arrayBars[barIndex].classList.add('swapping');
            await sleep(animationSpeed / 3);
            arrayBars[barIndex].classList.remove('swapping');
        }
    }
    
    for (let i = 0; i < array.length; i++) {
        array[i] = output[i];
        arrayBars[i].style.height = `${array[i] * 3}px`;
        arrayBars[i].classList.add('sorted');
        await sleep(animationSpeed / 10);
    }
}