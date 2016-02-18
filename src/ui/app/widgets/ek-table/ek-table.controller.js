class TableController {
    clickHeader(header) {
        if (this.currentSelection === header) {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSelection = header;
            this.sortOrder = 'asc';
        }

        this.headerClickListener(header, this.sortOrder);
    }
}

export default TableController;
