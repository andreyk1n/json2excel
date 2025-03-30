// Функція для завантаження JSON файлу
function loadJSONFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const jsonData = e.target.result;
            document.getElementById("jsonInput").value = jsonData;
            convertJSON(); // Конвертуємо JSON в таблицю
        };
        reader.readAsText(file);
    }
}

// Перетворення JSON в таблицю
function convertJSON() {
    const input = document.getElementById("jsonInput").value;
    try {
        const data = JSON.parse(input);
        if (!Array.isArray(data)) throw new Error("JSON повинен бути масивом об'єктів.");

        let table = "<table class='min-w-full table-auto mt-6'><thead><tr class='bg-gray-100'>";
        Object.keys(data[0]).forEach(key => {
            table += `<th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">${key}</th>`;
        });
        table += "</tr></thead><tbody>";

        data.forEach(row => {
            table += "<tr class='border-t'>";
            Object.values(row).forEach(value => {
                table += `<td class="px-4 py-2 text-sm text-gray-800">${value}</td>`;
            });
            table += "</tr>";
        });
        table += "</tbody></table>";

        // Вставка таблиці в контейнер з прокручуванням
        document.getElementById("output").innerHTML = `<div class="overflow-x-auto">${table}</div>`;
    } catch (e) {
        document.getElementById("output").innerHTML = `<p class="text-red-600">${e.message}</p>`;
    }
}

// Завантаження Excel → JSON
function convertExcelToJSON() {
    const fileInput = document.getElementById("excelFileInput").files[0];
    if (!fileInput) return alert("Виберіть Excel файл");

    const reader = new FileReader();
    reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        document.getElementById("jsonInput").value = JSON.stringify(jsonData, null, 2);
        convertJSON();
    };
    reader.readAsArrayBuffer(fileInput);
}

// Експорт таблиці в Excel
function exportToExcel() {
    const table = document.querySelector("table");
    if (!table) return alert("Немає даних для експорту");

    const worksheet = XLSX.utils.table_to_sheet(table);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Дані");

    XLSX.writeFile(workbook, "таблиця.xlsx");
}

// Завантаження JSON
function downloadJSON() {
    const input = document.getElementById("jsonInput").value;
    try {
        const data = JSON.parse(input);
        const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(jsonBlob);
        link.download = "table.json";
        link.click();
    } catch (e) {
        alert("Помилка при збереженні JSON: " + e.message);
    }
}
