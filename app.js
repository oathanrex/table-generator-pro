/**
 * Table Generator Pro - Main Application
 * Version: 2.0.0
 * Author: Table Generator Pro Team
 */

class TableGeneratorPro {
    constructor() {
        this.state = {
            tableType: 'table',
            className: 'styled-table',
            rows: 4,
            cols: 4,
            hasHeader: true,
            hasFooter: false,
            hasCaption: false,
            editMode: false,
            currentTemplate: 0,
            isDark: false
        };
        
        this.templates = [
            // 15 predefined color templates
            { name: 'Default Blue', headerBg: '#007bff', headerText: '#ffffff', bodyBg: '#ffffff', bodyText: '#212529', stripeColor: '#f8f9fa', borderColor: '#dee2e6' },
            { name: 'Dark Mode', headerBg: '#343a40', headerText: '#ffffff', bodyBg: '#212529', bodyText: '#ffffff', stripeColor: '#343a40', borderColor: '#495057' },
            { name: 'Success Green', headerBg: '#28a745', headerText: '#ffffff', bodyBg: '#ffffff', bodyText: '#212529', stripeColor: '#d4edda', borderColor: '#c3e6cb' },
            { name: 'Danger Red', headerBg: '#dc3545', headerText: '#ffffff', bodyBg: '#ffffff', bodyText: '#212529', stripeColor: '#f8d7da', borderColor: '#f5c6cb' },
            { name: 'Warning Yellow', headerBg: '#ffc107', headerText: '#212529', bodyBg: '#ffffff', bodyText: '#212529', stripeColor: '#fff3cd', borderColor: '#ffeeba' },
            { name: 'Info Cyan', headerBg: '#17a2b8', headerText: '#ffffff', bodyBg: '#ffffff', bodyText: '#212529', stripeColor: '#d1ecf1', borderColor: '#bee5eb' },
            { name: 'Purple', headerBg: '#6f42c1', headerText: '#ffffff', bodyBg: '#ffffff', bodyText: '#212529', stripeColor: '#e2d9f3', borderColor: '#d5c4e8' },
            { name: 'Pink', headerBg: '#e83e8c', headerText: '#ffffff', bodyBg: '#ffffff', bodyText: '#212529', stripeColor: '#fbd4e0', borderColor: '#f9c3d5' },
            { name: 'Orange', headerBg: '#fd7e14', headerText: '#ffffff', bodyBg: '#ffffff', bodyText: '#212529', stripeColor: '#ffe5cc', borderColor: '#ffd8b8' },
            { name: 'Teal', headerBg: '#20c997', headerText: '#ffffff', bodyBg: '#ffffff', bodyText: '#212529', stripeColor: '#c3e9dc', borderColor: '#aee4d4' },
            { name: 'Indigo', headerBg: '#6610f2', headerText: '#ffffff', bodyBg: '#ffffff', bodyText: '#212529', stripeColor: '#dcc7fb', borderColor: '#d0b3f9' },
            { name: 'Light Gray', headerBg: '#6c757d', headerText: '#ffffff', bodyBg: '#f8f9fa', bodyText: '#495057', stripeColor: '#e9ecef', borderColor: '#dee2e6' },
            { name: 'Navy Blue', headerBg: '#004085', headerText: '#ffffff', bodyBg: '#cce5ff', bodyText: '#004085', stripeColor: '#b8daff', borderColor: '#b8daff' },
            { name: 'Chocolate', headerBg: '#7b3f00', headerText: '#ffffff', bodyBg: '#fff5e6', bodyText: '#7b3f00', stripeColor: '#ffe6cc', borderColor: '#ffcc99' },
            { name: 'Minimalist', headerBg: '#ffffff', headerText: '#000000', bodyBg: '#ffffff', bodyText: '#000000', stripeColor: '#f5f5f5', borderColor: '#000000' }
        ];
        
        this.init();
    }
    
    init() {
        // Wait for DOM to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.setupTemplateGallery();
        this.setupEventListeners();
        this.loadSavedState();
        this.generateTable();
        this.hideLoader();
    }
    
    setupTemplateGallery() {
        const gallery = document.getElementById('templateGallery');
        if (!gallery) return;
        
        gallery.innerHTML = '';
        
        this.templates.forEach((template, index) => {
            const item = document.createElement('div');
            item.className = 'template-item' + (index === 0 ? ' active' : '');
            item.dataset.template = index;
            item.title = template.name;
            
            item.innerHTML = `
                <div class="template-preview">
                    <div class="template-header" style="background: ${template.headerBg}"></div>
                    <div class="template-body" style="background: ${template.bodyBg}">
                        <div class="template-row" style="background: ${template.stripeColor}"></div>
                        <div class="template-row"></div>
                        <div class="template-row" style="background: ${template.stripeColor}"></div>
                    </div>
                </div>
                <div class="template-name">${template.name}</div>
            `;
            
            item.addEventListener('click', () => this.applyTemplate(index));
            gallery.appendChild(item);
        });
    }
    
    setupEventListeners() {
        // Table Type
        document.querySelectorAll('input[name="tableType"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.state.tableType = e.target.value;
                this.generateTable();
            });
        });
        
        // Structure
        ['className', 'numRows', 'numCols'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => {
                    this.updateStructure();
                });
            }
        });
        
        // Checkboxes
        ['hasHeader', 'hasFooter', 'hasCaption'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => {
                    this.updateStructure();
                });
            }
        });
        
        // Dimensions
        document.getElementById('customWidth')?.addEventListener('change', (e) => {
            document.getElementById('tableWidth').disabled = !e.target.checked;
            document.getElementById('widthUnit').disabled = !e.target.checked;
            this.updateStyles();
        });
        
        document.getElementById('customHeight')?.addEventListener('change', (e) => {
            document.getElementById('tableHeight').disabled = !e.target.checked;
            document.getElementById('heightUnit').disabled = !e.target.checked;
            this.updateStyles();
        });
        
        // Styling inputs
        const styleInputs = [
            'fontFamily', 'fontSize', 'textAlign', 'borderColor', 'borderWidth',
            'borderStyle', 'borderRadius', 'cellPadding', 'borderSpacing',
            'headerBg', 'headerText', 'bodyBg', 'bodyText', 'footerBg', 'footerText',
            'stripeColor', 'hoverColor', 'tableWidth', 'widthUnit', 'tableHeight', 'heightUnit'
        ];
        
        styleInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updateStyles());
                element.addEventListener('change', () => this.updateStyles());
            }
        });
        
        // Range inputs - update display values
        ['fontSize', 'borderWidth', 'borderRadius', 'cellPadding', 'borderSpacing'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', (e) => {
                    const valueSpan = document.getElementById(id + 'Value');
                    if (valueSpan) valueSpan.textContent = e.target.value;
                });
            }
        });
        
        // Features checkboxes
        ['borderCollapse', 'responsive', 'hoverable', 'striped', 'verticalStriped',
         'sortable', 'fixedHeader', 'rowNumbers', 'searchable', 'headerGradient'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.updateFeatures());
            }
        });
        
        // Search functionality
        document.getElementById('searchable')?.addEventListener('change', (e) => {
            document.getElementById('searchBox').style.display = e.target.checked ? 'block' : 'none';
            if (e.target.checked) {
                this.enableSearch();
            }
        });
        
        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });
    }
    
    updateStructure() {
        this.state.className = document.getElementById('className')?.value || 'styled-table';
        this.state.rows = parseInt(document.getElementById('numRows')?.value || 4);
        this.state.cols = parseInt(document.getElementById('numCols')?.value || 4);
        this.state.hasHeader = document.getElementById('hasHeader')?.checked || false;
        this.state.hasFooter = document.getElementById('hasFooter')?.checked || false;
        this.state.hasCaption = document.getElementById('hasCaption')?.checked || false;
        
        this.generateTable();
    }
    
    updateStyles() {
        this.generateTable();
    }
    
    updateFeatures() {
        this.generateTable();
    }
    
    generateTable() {
        const preview = document.getElementById('tablePreview');
        if (!preview) return;
        
        const isDiv = this.state.tableType === 'div';
        let html = '';
        
        if (isDiv) {
            html = this.generateDivTable();
        } else {
            html = this.generateHTMLTable();
        }
        
        preview.innerHTML = html;
        
        // Apply additional features
        if (document.getElementById('sortable')?.checked) {
            this.enableSorting();
        }
        
        if (document.getElementById('rowNumbers')?.checked) {
            this.addRowNumbers();
        }
        
        // Update code output
        this.updateCode();
    }
    
    generateHTMLTable() {
        let html = `<table class="${this.state.className}" id="generatedTable">`;
        
        if (this.state.hasCaption) {
            html += `<caption contenteditable="${this.state.editMode}">Table Caption</caption>`;
        }
        
        if (this.state.hasHeader) {
            html += '<thead><tr>';
            for (let i = 0; i < this.state.cols; i++) {
                html += `<th contenteditable="${this.state.editMode}">Header ${i + 1}</th>`;
            }
            html += '</tr></thead>';
        }
        
        html += '<tbody>';
        for (let i = 0; i < this.state.rows; i++) {
            html += '<tr>';
            for (let j = 0; j < this.state.cols; j++) {
                html += `<td contenteditable="${this.state.editMode}">Row ${i + 1}, Col ${j + 1}</td>`;
            }
            html += '</tr>';
        }
        html += '</tbody>';
        
        if (this.state.hasFooter) {
            html += '<tfoot><tr>';
            for (let i = 0; i < this.state.cols; i++) {
                html += `<th contenteditable="${this.state.editMode}">Footer ${i + 1}</th>`;
            }
            html += '</tr></tfoot>';
        }
        
        html += '</table>';
        
        // Apply inline styles
        const styles = this.generateInlineStyles();
        html = `<style>${styles}</style>` + html;
        
        return html;
    }
    
    generateDivTable() {
        let html = `<div class="${this.state.className}">`;
        
        if (this.state.hasCaption) {
            html += `<div class="table-caption" contenteditable="${this.state.editMode}">Table Caption</div>`;
        }
        
        if (this.state.hasHeader) {
            html += '<div class="table-header"><div class="table-row">';
            for (let i = 0; i < this.state.cols; i++) {
                html += `<div class="table-cell" contenteditable="${this.state.editMode}">Header ${i + 1}</div>`;
            }
            html += '</div></div>';
        }
        
        html += '<div class="table-body">';
        for (let i = 0; i < this.state.rows; i++) {
            html += '<div class="table-row">';
            for (let j = 0; j < this.state.cols; j++) {
                html += `<div class="table-cell" contenteditable="${this.state.editMode}">Row ${i + 1}, Col ${j + 1}</div>`;
            }
            html += '</div>';
        }
        html += '</div>';
        
        if (this.state.hasFooter) {
            html += '<div class="table-footer"><div class="table-row">';
            for (let i = 0; i < this.state.cols; i++) {
                html += `<div class="table-cell" contenteditable="${this.state.editMode}">Footer ${i + 1}</div>`;
            }
            html += '</div></div>';
        }
        
        html += '</div>';
        
        // Apply inline styles
        const styles = this.generateInlineStyles();
        html = `<style>${styles}</style>` + html;
        
        return html;
    }
    
    generateInlineStyles() {
        const isDiv = this.state.tableType === 'div';
        const className = this.state.className;
        let styles = [];
        
        if (isDiv) {
            // Div table styles
            styles.push(`.${className} { display: table; ${this.getTableStyles()} }`);
            styles.push(`.${className} .table-caption { display: table-caption; ${this.getCaptionStyles()} }`);
            styles.push(`.${className} .table-header { display: table-header-group; }`);
            styles.push(`.${className} .table-body { display: table-row-group; }`);
            styles.push(`.${className} .table-footer { display: table-footer-group; }`);
            styles.push(`.${className} .table-row { display: table-row; }`);
            styles.push(`.${className} .table-cell { display: table-cell; ${this.getCellStyles()} }`);
            styles.push(`.${className} .table-header .table-cell { ${this.getHeaderStyles()} }`);
            styles.push(`.${className} .table-footer .table-cell { ${this.getFooterStyles()} }`);
        } else {
            // Table styles
            styles.push(`.${className} { ${this.getTableStyles()} }`);
            styles.push(`.${className} caption { ${this.getCaptionStyles()} }`);
            styles.push(`.${className} th, .${className} td { ${this.getCellStyles()} }`);
            styles.push(`.${className} thead th { ${this.getHeaderStyles()} }`);
            styles.push(`.${className} tfoot th { ${this.getFooterStyles()} }`);
        }
        
        // Additional features
        if (document.getElementById('striped')?.checked) {
            if (isDiv) {
                styles.push(`.${className} .table-body .table-row:nth-child(even) { background-color: ${document.getElementById('stripeColor').value}; }`);
            } else {
                styles.push(`.${className} tbody tr:nth-child(even) { background-color: ${document.getElementById('stripeColor').value}; }`);
            }
        }
        
        if (document.getElementById('hoverable')?.checked) {
            if (isDiv) {
                styles.push(`.${className} .table-body .table-row:hover { background-color: ${document.getElementById('hoverColor').value}; }`);
            } else {
                styles.push(`.${className} tbody tr:hover { background-color: ${document.getElementById('hoverColor').value}; }`);
            }
        }
        
        if (document.getElementById('responsive')?.checked) {
            styles.push(`@media (max-width: 768px) {
                .${className} { font-size: 12px; }
                .${className} th, .${className} td, .${className} .table-cell { padding: 5px; }
            }`);
        }
        
        return styles.join('\n');
    }
    
    getTableStyles() {
        let styles = [];
        
        // Width
        if (document.getElementById('customWidth')?.checked) {
            const width = document.getElementById('tableWidth').value;
            const unit = document.getElementById('widthUnit').value;
            styles.push(`width: ${width}${unit}`);
        } else {
            styles.push('width: 100%');
        }
        
        // Height
        if (document.getElementById('customHeight')?.checked) {
            const height = document.getElementById('tableHeight').value;
            const unit = document.getElementById('heightUnit').value;
            styles.push(`height: ${height}${unit}`);
        }
        
        // Font
        const fontFamily = document.getElementById('fontFamily').value;
        if (fontFamily !== 'inherit') {
            styles.push(`font-family: ${fontFamily}`);
        }
        
        const fontSize = document.getElementById('fontSize').value;
        styles.push(`font-size: ${fontSize}px`);
        
        // Border
        if (document.getElementById('borderCollapse')?.checked) {
            styles.push('border-collapse: collapse');
        } else {
            styles.push('border-collapse: separate');
            const spacing = document.getElementById('borderSpacing').value;
            styles.push(`border-spacing: ${spacing}px`);
        }
        
        const borderRadius = document.getElementById('borderRadius').value;
        if (borderRadius > 0) {
            styles.push(`border-radius: ${borderRadius}px`);
            styles.push('overflow: hidden');
        }
        
        return styles.join('; ');
    }
    
    getCellStyles() {
        let styles = [];
        
        const borderWidth = document.getElementById('borderWidth').value;
        const borderStyle = document.getElementById('borderStyle').value;
        const borderColor = document.getElementById('borderColor').value;
        styles.push(`border: ${borderWidth}px ${borderStyle} ${borderColor}`);
        
        const padding = document.getElementById('cellPadding').value;
        styles.push(`padding: ${padding}px`);
        
        const textAlign = document.querySelector('input[name="textAlign"]:checked')?.value || 'left';
        styles.push(`text-align: ${textAlign}`);
        
        return styles.join('; ');
    }
    
    getHeaderStyles() {
        let styles = [];
        
        const headerBg = document.getElementById('headerBg').value;
        const headerText = document.getElementById('headerText').value;
        
        if (document.getElementById('headerGradient')?.checked) {
            const darkerBg = this.shadeColor(headerBg, -20);
            styles.push(`background: linear-gradient(135deg, ${headerBg}, ${darkerBg})`);
        } else {
            styles.push(`background-color: ${headerBg}`);
        }
        
        styles.push(`color: ${headerText}`);
        styles.push('font-weight: bold');
        
        if (document.getElementById('fixedHeader')?.checked) {
            styles.push('position: sticky');
            styles.push('top: 0');
            styles.push('z-index: 10');
        }
        
        return styles.join('; ');
    }
    
    getFooterStyles() {
        let styles = [];
        
        const footerBg = document.getElementById('footerBg').value;
        const footerText = document.getElementById('footerText').value;
        
        styles.push(`background-color: ${footerBg}`);
        styles.push(`color: ${footerText}`);
        styles.push('font-weight: bold');
        
        return styles.join('; ');
    }
    
    getCaptionStyles() {
        return 'padding: 10px; font-weight: bold; font-size: 1.1em;';
    }
    
    updateCode() {
        const htmlCode = document.getElementById('htmlCode');
        const cssCode = document.getElementById('cssCode');
        const fullCode = document.getElementById('fullCode');
        
        if (!htmlCode || !cssCode || !fullCode) return;
        
        const html = this.getCleanHTML();
        const css = this.getCleanCSS();
        const full = this.getFullCode(html, css);
        
        htmlCode.textContent = html;
        cssCode.textContent = css;
        fullCode.textContent = full;
        
        // Re-highlight code if Prism is available
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
    }
    
    getCleanHTML() {
        const preview = document.getElementById('tablePreview');
        if (!preview) return '';
        
        // Clone the preview content
        const clone = preview.cloneNode(true);
        
        // Remove style tags
        clone.querySelectorAll('style').forEach(el => el.remove());
        
        // Remove contenteditable attributes
        clone.querySelectorAll('[contenteditable]').forEach(el => {
            el.removeAttribute('contenteditable');
        });
        
        // Format HTML
        let html = clone.innerHTML;
        html = html.replace(/></g, '>\n<');
        html = html.replace(/(<\/(thead|tbody|tfoot|table|div)>)/g, '$1\n');
        
        return html.trim();
    }
    
    getCleanCSS() {
        return this.generateInlineStyles();
    }
    
    getFullCode(html, css) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Table</title>
    <style>
${css}
    </style>
</head>
<body>
${html}
</body>
</html>`;
    }
    
    applyTemplate(index) {
        // Update active template
        document.querySelectorAll('.template-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        
        const template = this.templates[index];
        if (!template) return;
        
        // Apply template colors
        document.getElementById('headerBg').value = template.headerBg;
        document.getElementById('headerText').value = template.headerText;
        document.getElementById('bodyBg').value = template.bodyBg;
        document.getElementById('bodyText').value = template.bodyText;
        document.getElementById('stripeColor').value = template.stripeColor;
        document.getElementById('borderColor').value = template.borderColor;
        
        // Set some default features for certain templates
        if (index === 1) { // Dark mode template
            document.getElementById('striped').checked = true;
            document.getElementById('hoverable').checked = true;
        }
        
        this.state.currentTemplate = index;
        this.generateTable();
        this.showToast(`Template "${template.name}" applied`, 'success');
    }
    
    toggleEditMode() {
        this.state.editMode = !this.state.editMode;
        this.generateTable();
        this.showToast(this.state.editMode ? 'Edit mode enabled' : 'Edit mode disabled', 'info');
    }
    
    refreshPreview() {
        this.generateTable();
        this.showToast('Preview refreshed', 'success');
    }
    
    addSampleData() {
        const table = document.querySelector('#generatedTable, .styled-table');
        if (!table) return;
        
        const sampleData = [
            ['Product', 'Price', 'Quantity', 'Total'],
            ['Laptop', '$999', '2', '$1,998'],
            ['Mouse', '$25', '5', '$125'],
            ['Keyboard', '$75', '3', '$225'],
            ['Monitor', '$299', '2', '$598']
        ];
        
        const cells = table.querySelectorAll('th, td, .table-cell');
        let cellIndex = 0;
        
        sampleData.forEach(row => {
            row.forEach(data => {
                if (cells[cellIndex]) {
                    cells[cellIndex].textContent = data;
                    cellIndex++;
                }
            });
        });
        
        this.updateCode();
        this.showToast('Sample data added', 'success');
    }
    
    enableSorting() {
        const table = document.querySelector('#generatedTable');
        if (!table) return;
        
        const headers = table.querySelectorAll('thead th');
        headers.forEach((header, index) => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => this.sortTable(index));
        });
    }
    
    sortTable(columnIndex) {
        const table = document.querySelector('#generatedTable');
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        rows.sort((a, b) => {
            const aText = a.cells[columnIndex].textContent;
            const bText = b.cells[columnIndex].textContent;
            return aText.localeCompare(bText, undefined, { numeric: true });
        });
        
        tbody.innerHTML = '';
        rows.forEach(row => tbody.appendChild(row));
    }
    
    addRowNumbers() {
        const table = document.querySelector('#generatedTable, .styled-table');
        if (!table) return;
        
        // Add header for row numbers
        if (this.state.hasHeader) {
            const headerRow = table.querySelector('thead tr, .table-header .table-row');
            if (headerRow) {
                const th = document.createElement(this.state.tableType === 'div' ? 'div' : 'th');
                th.className = this.state.tableType === 'div' ? 'table-cell' : '';
                th.textContent = '#';
                headerRow.insertBefore(th, headerRow.firstChild);
            }
        }
        
        // Add row numbers to body
        const bodyRows = table.querySelectorAll('tbody tr, .table-body .table-row');
        bodyRows.forEach((row, index) => {
            const td = document.createElement(this.state.tableType === 'div' ? 'div' : 'td');
            td.className = this.state.tableType === 'div' ? 'table-cell' : '';
            td.textContent = (index + 1).toString();
            td.style.fontWeight = 'bold';
            row.insertBefore(td, row.firstChild);
        });
    }
    
    enableSearch() {
        const searchInput = document.getElementById('tableSearch');
        if (!searchInput) return;
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const table = document.querySelector('#generatedTable, .styled-table');
            if (!table) return;
            
            const rows = table.querySelectorAll('tbody tr, .table-body .table-row');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
    
    copyCode(type) {
        let code = '';
        
        switch (type) {
            case 'html':
                code = this.getCleanHTML();
                break;
            case 'css':
                code = this.getCleanCSS();
                break;
            case 'all':
                code = this.getFullCode(this.getCleanHTML(), this.getCleanCSS());
                break;
        }
        
        navigator.clipboard.writeText(code).then(() => {
            this.showToast(`${type.toUpperCase()} code copied to clipboard!`, 'success');
        }).catch(() => {
            this.showToast('Failed to copy code', 'error');
        });
    }
    
    downloadCode() {
        const code = this.getFullCode(this.getCleanHTML(), this.getCleanCSS());
        const blob = new Blob([code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `table_${Date.now()}.html`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('File downloaded successfully!', 'success');
    }
    
    importCSV() {
        const input = document.getElementById('fileInput');
        input.accept = '.csv';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const csv = event.target.result;
                const rows = csv.split('\n').map(row => row.split(','));
                this.populateTable(rows);
            };
            reader.readAsText(file);
        };
        input.click();
    }
    
    importJSON() {
        const input = document.getElementById('fileInput');
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    this.populateTable(data);
                } catch (error) {
                    this.showToast('Invalid JSON file', 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
    
    populateTable(data) {
        if (!data || data.length === 0) return;
        
        // Update table size
        document.getElementById('numRows').value = data.length - (this.state.hasHeader ? 1 : 0);
        document.getElementById('numCols').value = data[0].length;
        this.updateStructure();
        
        // Populate cells
        const table = document.querySelector('#generatedTable, .styled-table');
        if (!table) return;
        
        const cells = table.querySelectorAll('th, td, .table-cell');
        let cellIndex = 0;
        
        data.forEach(row => {
            row.forEach(cellData => {
                if (cells[cellIndex]) {
                    cells[cellIndex].textContent = cellData.trim();
                    cellIndex++;
                }
            });
        });
        
        this.updateCode();
        this.showToast('Data imported successfully', 'success');
    }
    
    exportCSV() {
        const table = document.querySelector('#generatedTable, .styled-table');
        if (!table) return;
        
        let csv = [];
        const rows = table.querySelectorAll('tr, .table-row');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('th, td, .table-cell');
            const rowData = Array.from(cells).map(cell => {
                let text = cell.textContent.trim();
                if (text.includes(',')) text = `"${text}"`;
                return text;
            });
            csv.push(rowData.join(','));
        });
        
        const csvContent = csv.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `table_${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('CSV exported successfully', 'success');
    }
    
    exportJSON() {
        const table = document.querySelector('#generatedTable, .styled-table');
        if (!table) return;
        
        let data = [];
        const rows = table.querySelectorAll('tr, .table-row');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('th, td, .table-cell');
            const rowData = Array.from(cells).map(cell => cell.textContent.trim());
            data.push(rowData);
        });
        
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `table_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('JSON exported successfully', 'success');
    }
    
    exportSettings() {
        const settings = {
            state: this.state,
            inputs: {}
        };
        
        // Collect all input values
        document.querySelectorAll('input, select').forEach(element => {
            if (element.id) {
                if (element.type === 'checkbox' || element.type === 'radio') {
                    settings.inputs[element.id] = element.checked;
                } else {
                    settings.inputs[element.id] = element.value;
                }
            }
        });
        
        const json = JSON.stringify(settings, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `table-settings_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Settings exported successfully', 'success');
    }
    
    importSettings() {
        const input = document.getElementById('fileInput');
        input.accept = '.json,.txt';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const settings = JSON.parse(event.target.result);
                    this.applySettings(settings);
                    this.showToast('Settings imported successfully', 'success');
                } catch (error) {
                    this.showToast('Invalid settings file', 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }
    
    applySettings(settings) {
        if (settings.state) {
            this.state = { ...this.state, ...settings.state };
        }
        
        if (settings.inputs) {
            Object.entries(settings.inputs).forEach(([id, value]) => {
                const element = document.getElementById(id);
                if (element) {
                    if (element.type === 'checkbox' || element.type === 'radio') {
                        element.checked = value;
                    } else {
                        element.value = value;
                    }
                }
            });
        }
        
        this.generateTable();
    }
    
    randomizeColors() {
        const getRandomColor = () => {
            const colors = [
                '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8',
                '#6f42c1', '#e83e8c', '#fd7e14', '#20c997', '#6610f2'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        };
        
        document.getElementById('headerBg').value = getRandomColor();
        document.getElementById('borderColor').value = getRandomColor();
        
        this.generateTable();
        this.showToast('Colors randomized', 'success');
    }
    
    resetAll() {
        if (!confirm('Are you sure you want to reset all settings?')) return;
        
        // Reset to defaults
        document.getElementById('numRows').value = 4;
        document.getElementById('numCols').value = 4;
        document.getElementById('hasHeader').checked = true;
        document.getElementById('hasFooter').checked = false;
        document.getElementById('hasCaption').checked = false;
        
        // Apply first template
        this.applyTemplate(0);
        
        this.showToast('All settings reset to default', 'info');
    }
    
    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        this.state.isDark = document.body.classList.contains('dark-mode');
        
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = this.state.isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        this.saveState();
        this.showToast(this.state.isDark ? 'Dark mode enabled' : 'Light mode enabled', 'info');
    }
    
    saveState() {
        localStorage.setItem('tableGeneratorState', JSON.stringify(this.state));
    }
    
    loadSavedState() {
        const saved = localStorage.getItem('tableGeneratorState');
        if (saved) {
            try {
                const savedState = JSON.parse(saved);
                this.state = { ...this.state, ...savedState };
                
                // Apply dark mode if saved
                if (this.state.isDark) {
                    document.body.classList.add('dark-mode');
                    const icon = document.querySelector('#themeToggle i');
                    if (icon) icon.className = 'fas fa-sun';
                }
            } catch (error) {
                console.error('Failed to load saved state:', error);
            }
        }
    }
    
    hideLoader() {
        setTimeout(() => {
            const loader = document.getElementById('loader');
            const mainApp = document.getElementById('mainApp');
            
            if (loader) loader.style.display = 'none';
            if (mainApp) mainApp.style.display = 'block';
        }, 1000);
    }
    
    showToast(message, type = 'success') {
        const container = document.querySelector('.toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type} animate__animated animate__fadeInRight`;
        toast.setAttribute('role', 'alert');
        
        const icon = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        }[type] || 'fa-info-circle';
        
        toast.innerHTML = `
            <div class="d-flex align-items-center p-3">
                <i class="fas ${icon} me-2"></i>
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('animate__fadeOutRight');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
    
    shadeColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1).toUpperCase();
    }
}

// Initialize the application
const app = new TableGeneratorPro();
