/**
 * Store data in local storage
 * @param {String} label Data label
 * @param {Object} data  Data
 */
export function setData(label, data) {
  localStorage.setItem(label, JSON.stringify(data));
}

/**
 * Get data from local storage
 * @param {String} label Data label
 * @returns Promise containing stored item
 */
export function getData(label) {
  return JSON.parse(localStorage.getItem(label));
}
