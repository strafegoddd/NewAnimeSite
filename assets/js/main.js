const table = document.getElementById("data-table");
const rows = table.getElementsByTagName("tr");

function search() {
  // Получаем значения полей формы
  const name = document.getElementById("name").value;
  const genre = document.getElementById("genre").value;
  const vozrate = document.getElementById("vozrate").value;
  const year1 = document.getElementById("year1").value;
  const year2 = document.getElementById("year2").value;
  const rate1 = document.getElementById("rate1").value;
  const rate2 = document.getElementById("rate2").value;

  // Получаем таблицу и все ее строки



  // Проходимся по каждой строке таблицы, начиная со второй (так как первая строка содержит заголовки)
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName("td");

    // Получаем значения ячеек таблицы
    const rowName = cells[0].textContent;
    const rowYear = cells[1].textContent;
    const rowRate = cells[2].textContent;
    const rowVozrate = cells[3].textContent;
    const rowGenre = cells[4].textContent;

    // Фильтруем данные согласно выбранным параметрам
    const isNameValid =
      !name || rowName.toLowerCase().includes(name.toLowerCase());
    const isGenreValid =
      !genre || rowGenre.toLowerCase().includes(genre.toLowerCase());
    const isVozrateValid =
      !vozrate || rowVozrate.toLowerCase().includes(vozrate.toLowerCase());
    const isYearValid =
      !year1 ||
      !year2 ||
      (Number(rowYear) >= year1 && Number(rowYear) <= year2);
    const isRateValid =
      !rate1 ||
      !rate2 ||
      (Number(rowRate) >= rate1 && Number(rowRate) <= rate2);

    // Скрываем строки, которые не удовлетворяют выбранным параметрам
    if (
      !isNameValid ||
      !isGenreValid ||
      !isVozrateValid ||
      !isYearValid ||
      !isRateValid
    ) {
      row.style.display = "none";
    } else {
      row.style.display = "";
    }
  }
}

function sortData() {
  const table = document.getElementById("data-table");

  const level1SortBy = document.getElementById("level1-sort-by").value;
  const level1Descending = document.getElementById("level1-descending").checked;
  const level2SortBy = document.getElementById("level2-sort-by").value;
  const level2Descending = document.getElementById("level2-descending").checked;
  const level3SortBy = document.getElementById("level3-sort-by").value;
  const level3Descending = document.getElementById("level3-descending").checked;

  // Sort data by first level

  rows.sort((row1, row2) => {
    const value1 = getValueByColumnName(row1, level1SortBy);
    const value2 = getValueByColumnName(row2, level1SortBy);
    const result = compareValues(value1, value2);
    return level1Descending ? -result : result;
  });

  // Sort data by second level
  if (level2SortBy !== "" && level2SortBy !== level1SortBy) {
    let start = 0;
    let end = 0;
    while (start < rows.length) {
      let currentValue = getValueByColumnName(rows[start], level1SortBy);
      while (end < rows.length && getValueByColumnName(rows[end], level1SortBy) === currentValue) {
        end++;
      }
      const subRows = rows.slice(start, end);
      subRows.sort((row1, row2) => {
        const value1 = getValueByColumnName(row1, level2SortBy);
        const value2 = getValueByColumnName(row2, level2SortBy);
        const result = compareValues(value1, value2);
        return level2Descending ? -result : result;
      });
      rows.splice(start, subRows.length, ...subRows);
      start = end;
    }
  }

  // Sort data by third level
  if (level3SortBy !== "" && level3SortBy !== level1SortBy && level3SortBy !== level2SortBy) {
    let start = 0;
    let end = 0;
    while (start < rows.length) {
      let currentValue = getValueByColumnName(rows[start], level2SortBy);
      while (end < rows.length && getValueByColumnName(rows[end], level2SortBy) === currentValue) {
        end++;
      }
      const subRows = rows.slice(start, end);
      subRows.sort((row1, row2) => {
        const value1 = getValueByColumnName(row1, level3SortBy);
        const value2 = getValueByColumnName(row2, level3SortBy);
        const result = compareValues(value1, value2);
        return level3Descending ? -result : result;
      });
      rows.splice(start, subRows.length, ...subRows);
      start = end;
    }
  }

  // Update table with sorted data
  table.tBodies[0].innerHTML = "";
  rows.forEach(row => table.tBodies[0].appendChild(row));
}

const level1SortBy = document.getElementById("level1-sort-by");
const level1Descending = document.getElementById("level1-descending");
const level2SortBy = document.getElementById("level2-sort-by");
const level2Descending = document.getElementById("level2-descending");
const level3SortBy = document.getElementById("level3-sort-by");
const level3Descending = document.getElementById("level3-descending");

// Add change event listeners to all select elements
[level1SortBy, level2SortBy, level3SortBy].forEach((select, index) => {
  select.addEventListener("change", () => {
    // Get the currently selected column name
    const selectedColumnName = select.value;
    
    // Hide the selected column in all lower level selects
    [level1SortBy, level2SortBy, level3SortBy].slice(index + 1).forEach((lowerSelect) => {
      Array.from(lowerSelect.options).forEach((option) => {
        if (option.value === selectedColumnName) {
          option.hidden = true;
        }
      });
    });

    // Show the selected column in all higher level selects
    [level1SortBy, level2SortBy, level3SortBy].slice(0, index).forEach((higherSelect) => {
      Array.from(higherSelect.options).forEach((option) => {
        if (option.value === selectedColumnName) {
          option.hidden = false;
        }
      });
    });

    // Add the selected column to the current level select if it hasn't been added already
    if (!Array.from(select.options).some((option) => option.value === selectedColumnName)) {
      select.options.add(new Option(selectedColumnName, selectedColumnName));
    }
  });
});

function sortData() {
  // Get user-selected sort parameters
  const level1 = document.getElementById("level1-sort-by").value;
  const level1Descending = document.getElementById("level1-descending").checked;
  const level2 = document.getElementById("level2-sort-by").value;
  const level2Descending = document.getElementById("level2-descending").checked;
  const level3 = document.getElementById("level3-sort-by").value;
  const level3Descending = document.getElementById("level3-descending").checked;

  // Get data from the table
  const table = document.getElementById("data-table");
  const rows = table.getElementsByTagName("tr");
  const data = [];

  // Loop through the table rows and add data to the array
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const cells = row.getElementsByTagName("td");
    const item = {};

    item.name = cells[0].textContent;
    item.year = parseInt(cells[1].textContent);
    item.rating = parseFloat(cells[2].textContent);
    item.age = parseInt(cells[3].textContent);
    item.genre = cells[4].textContent;

    data.push(item);
  }

  // Sort the data
  data.sort((a, b) => {
    if (a[level1] > b[level1]) {
      return level1Descending ? -1 : 1;
    } else if (a[level1] < b[level1]) {
      return level1Descending ? 1 : -1;
    } else {
      if (a[level2] > b[level2]) {
        return level2Descending ? -1 : 1;
      } else if (a[level2] < b[level2]) {
        return level2Descending ? 1 : -1;
      } else {
        if (a[level3] > b[level3]) {
          return level3Descending ? -1 : 1;
        } else if (a[level3] < b[level3]) {
          return level3Descending ? 1 : -1;
        } else {
          return 0;
        }
      }
    }
  });

  // Clear the table
  const tbody = table.getElementsByTagName("tbody")[0];
  // while (tbody.firstChild) {
  //   tbody.removeChild(tbody.firstChild);
  // }

  // Add sorted data to the table
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    const yearCell = document.createElement("td");
    const ratingCell = document.createElement("td");
    const ageCell = document.createElement("td");
    const genreCell = document.createElement("td");

    nameCell.textContent = item.name;
    yearCell.textContent = item.year;
    ratingCell.textContent = item.rating.toFixed(1);
    ageCell.textContent = item.age;
    genreCell.textContent = item.genre;

    row.appendChild(nameCell);
    row.appendChild(yearCell);
    row.appendChild(ratingCell);
    row.appendChild(ageCell);
    row.appendChild(genreCell);

    tbody.appendChild(row);
  }
}