[#interactive-data-view-component]
= Replacing All DataView Components

In OneCX v6, **all instances of `DataView` components** (including `p-dataView`, `DataViewControlsComponent`, and any related usages) should be replaced with `InteractiveDataViewComponent`. This ensures consistency and leverages the enhanced features of the new component.

== General Steps

1. Identify all usages of `p-dataView` and `DataViewControlsComponent` in your codebase.
2. Replace `p-dataView` with `<ocx-interactive-data-view>`.
3. Remove `<ocx-data-view-controls>` and `DataViewControlsComponent`.
4. Update input properties and output events as per the provided mapping tables.
5. Ensure that any custom templates (e.g., `pTemplate="header"`, `pTemplate="gridItem"`) are updated to match the new `InteractiveDataViewComponent` structure.

== Why Replace?

The `InteractiveDataViewComponent` provides:
- Unified handling of data views (list, grid, table).
- Enhanced filtering and sorting capabilities.
- Improved performance and maintainability.

By replacing all `DataView` components, you ensure your application is aligned with the latest OneCX standards and benefits from the new features.

== Code Changes

* Remove `<ocx-data-view-controls>` and `DataViewControlsComponent` from `@onecx/portal-integration-angular`
* Add `InteractiveDataViewComponent` from `@onecx/angular-accelerator`.
* Replace the entire `<p-dataView>` with `<ocx-interactive-data-view>`
* Remove `DataViewModule` from `primeng/dataview` if not used elsewhere
* Add `<ocx-interactive-data-view>` and update input properties and output events as per tables below

== Example
.Before
[source, html]
----
<p-dataView [value]="items" [layout]="'grid'" [paginator]="true" [rows]="20">
  <ng-template pTemplate="header">
    <ocx-data-view-controls
      [supportedViews]="['grid']"
      [initialViewMode]="'grid'"
      [filterValue]="filterValue"
      [enableFiltering]="true"
      (filterChange)="onFilterChange($event, dataView)"
      [enableSorting]="false"
    ></ocx-data-view-controls>
  </ng-template>

  <ng-template pTemplate="gridItem" let-item>
    <div class="card">
      <div>{{ item.name }}</div>
    </div>
  </ng-template>
</p-dataView>
----

.After
[source, html]
----
<ocx-interactive-data-view
  [data]="items"
  [supportedViewLayouts]="['grid']"
  [layout]="'grid'"
  [columns]="columns"
  [filters]="filters"
  [filter]="filterValue"
  [clientSideFiltering]="true"
  [emptyResultsMessage]="'ACTIONS.SEARCH.NO_DATA' | translate"
  (filtered)="onFilterChange($event)"
  (sorted)="onSortChange($event)"
  (dataViewLayoutChange)="onDataViewChange($event)"
>
  <ng-template pTemplate="item" let-item>
    <div class="card">
      <div>{{ item.name }}</div>
    </div>
  </ng-template>
</ocx-interactive-data-view>
----

== Properties Mapping

.Input Properties (DataViewControlsComponent)
[%collapsible]
====
[.stripes-even,cols="1,1,2"]
|===
h| DataViewControlsComponent
h| InteractiveDataViewComponent
h| Notes

| supportedViews
| supportedViewLayouts
| Indicates available layouts. Example: `[supportedViewLayouts]="['list', 'grid', 'table']"`.

| initialViewMode
| layout
| Sets initial layout. Example: `[layout]="'list'"`.

| filterValue
| filter
| Filters to apply. Use the `value` key in each Filter object. Example: const filters: Filter[] = [
  { columnId: 'category', filterType: FilterType.EQUALS, value: ['books', 'electronics'] }
]

| enableFiltering
| clientSideFiltering
| Enable client-side filtering. Example: `[clientSideFiltering]="true"`

| enableSorting
| clientSideSorting
| Enable client-side sorting. Example: `[clientSideSorting]="true"`

| sortingOptions
| columns
| Configure sorting per column by setting `sortable` on each `DataTableColumn`. Example:
  const columns: DataTableColumn[] = [
    { id: 'name', nameKey: 'OCX_DATA_TABLE.COLUMN.NAME', columnType: ColumnType.STRING, sortable: true }
  ];

| defaultSortOption
| sortField
| Use the column id for the default sort field. Example: `[sortField]="'name'"`

| defaultSortDirection
| sortDirection
| Use the `DataSortDirection` enum to specify the sort direction. Example: `[sortDirection]=DataSortDirection.ASCENDING`

| columnDefinitions
| columns
| Use `id` (instead of `field`) and `nameKey` for translated column names. Control visible columns with `displayedColumnKeys`. Example:
  const columns: DataTableColumn[] = [
    { id: 'name', nameKey: 'OCX_DATA_TABLE.COLUMN.NAME', columnType: ColumnType.STRING }
  ];
  displayedColumnKeys = ['name'];

| columnTemplates
| pTemplate with selectors
| Use `p-template` with a selector. For more information, see the Template Transformation section.

| dropdownPlaceholderText
| -
| Deprecated. Use translations (i18n); there is no direct input in the new component.

| filterColumns
| filters
| Use `filters` with `clientSideFiltering`. In each filter object, provide `columnId` and `filterType`.

| translations
| -
| Use i18n / translation keys.

|===
====

.Input Properties (p-dataView)
[%collapsible]
====
[.stripes-even,cols="1,1,2"]
|===
h| p-dataView
h| InteractiveDataViewComponent
h| Notes

| value
| data
| Defines the component's data source. Example: `[data]="items"`

| paginator
| listGridPaginator, tablePaginator
| listGridPaginator and tablePaginator are enabled by default

| rows
| pageSize
| Number of items per page. Example: `[pageSize]="20"`.

| rowsPerPageOptions
| pageSizes
| Array of page size options. Example: `[pageSizes]="[20, 60, 100]"`

| alwaysShowPaginator
| -
| The paginator is shown listGridPaginator

| showCurrentPageReport
| -
| The paginator shows the current page report by default when enabled.

| currentPageReportTemplate
| -
| Use the `currentPageShowingKey` translation key to render content. The `currentPageReportTemplate` is shown when pagination is enabled. Default: `'OCX_DATA_TABLE.SHOWING'`.

| filterBy
| -
| Use `clientSideFiltering` and specify `filterType` in the Filter object.

| emptyMessage
| emptyResultsMessage
| Message displayed when no data is available.
|===
====

.Output Events
[%collapsible]
====
[.stripes-even,cols="1,1,2"]
|===
h| DataViewControlsComponent
h| InteractiveDataViewComponent
h| Notes

| sortChange, sortDirectionChange
| sorted
| Emits `{ sortColumn, sortDirection }`

| filterChange
| filtered
| Emits Filter[]

| dataViewChange
| dataViewLayoutChange
| Emits `'list'`, `'grid'`, or `'table'`

| columnsChange
| displayedColumnKeysChange
| Emits string[] which contains the ids of the displayed columns
|===
====

=== Property Mapping for p-table and InteractiveDataViewComponent

The following table maps the properties from `p-table` to `InteractiveDataViewComponent`:

[%collapsible]
====
[.stripes-even,cols="1,1,2"]
|===
h| p-table
h| InteractiveDataViewComponent
h| Notes

| value
| data
| Defines the data source. Example: `[data]="items"`

| paginator
| listGridPaginator, tablePaginator
| Pagination is enabled by default. Use `listGridPaginator` or `tablePaginator`.

| rows
| pageSize
| Number of items per page. Example: `[pageSize]="10"`

| rowsPerPageOptions
| pageSizes
| Array of page size options. Example: `[pageSizes]="[10, 20, 50]"`

| columns
| columns
| Define table columns. Use `id` for column IDs and `nameKey` for translated names. Example:
  ```typescript
  const columns: DataTableColumn[] = [
    { id: 'name', nameKey: 'COLUMN.NAME', columnType: ColumnType.STRING }
  ];
  ```

| filterValue
| filter
| Filters to apply. Example: `[filter]="filterValue"`

| enableFiltering
| clientSideFiltering
| Enable client-side filtering. Example: `[clientSideFiltering]="true"`

| enableSorting
| clientSideSorting
| Enable client-side sorting. Example: `[clientSideSorting]="true"`

| sortingOptions
| columns
| Configure sorting per column by setting `sortable` on each `DataTableColumn`. Example:
  const columns: DataTableColumn[] = [
    { id: 'name', nameKey: 'OCX_DATA_TABLE.COLUMN.NAME', columnType: ColumnType.STRING, sortable: true }
  ];

| defaultSortOption
| sortField
| Use the column id for the default sort field. Example: `[sortField]="'name'"`

| defaultSortDirection
| sortDirection
| Use the `DataSortDirection` enum to specify the sort direction. Example: `[sortDirection]=DataSortDirection.ASCENDING`

| columnDefinitions
| columns
| Use `id` (instead of `field`) and `nameKey` for translated column names. Control visible columns with `displayedColumnKeys`. Example:
  const columns: DataTableColumn[] = [
    { id: 'name', nameKey: 'OCX_DATA_TABLE.COLUMN.NAME', columnType: ColumnType.STRING }
  ];
  displayedColumnKeys = ['name'];

| columnTemplates
| pTemplate with selectors
| Use `p-template` with a selector. For more information, see the Template Transformation section.

| dropdownPlaceholderText
| -
| Deprecated. Use translations (i18n); there is no direct input in the new component.

| filterColumns
| filters
| Use `filters` with `clientSideFiltering`. In each filter object, provide `columnId` and `filterType`.

| translations
| -
| Use i18n / translation keys.

|===
====

==== Additional Property Mapping for p-table

The following table includes additional property mappings from `p-table` to `InteractiveDataViewComponent`:

[%collapsible]
====
[.stripes-even,cols="1,1,2"]
|===
h| p-table
h| InteractiveDataViewComponent
h| Notes

| alwaysShowPaginator
| -
| The paginator is shown by default in `InteractiveDataViewComponent`.

| showCurrentPageReport
| -
| Use the `currentPageShowingKey` translation key to render content.

| currentPageReportTemplate
| -
| The `currentPageReportTemplate` is shown when pagination is enabled. Default: `'OCX_DATA_TABLE.SHOWING'`.

| filterBy
| filters
| Use `filters` with `clientSideFiltering`. Specify `filterType` in the Filter object.

| emptyMessage
| emptyResultsMessage
| Message displayed when no data is available.
|===
====

==== Template Transformation for p-table

When migrating from `p-table` to `InteractiveDataViewComponent`, you may need to update templates. Below are examples of common transformations:

[%collapsible]
====
[.stripes-even,cols="1,1,2"]
|===
h| p-table Template
h| InteractiveDataViewComponent Template
h| Notes

| `pTemplate="header"`
| `pTemplate="topCenter"`
| Use `topCenter` for custom header content.

| `pTemplate="body"`
| `pTemplate="tableRow"`
| Use `tableRow` for row templates. Example:
  ```html
  <ng-template pTemplate="tableRow" let-item>
    <tr>
      <td>{{ item.name }}</td>
      <td>{{ item.category }}</td>
    </tr>
  </ng-template>
  ```

|===
====

== Additional Notes

=== Template Transformation

[%collapsible]
====

[.stripes-even,cols="1,1,2"]
|===
h| p-dataView
h| InteractiveDataViewComponent
h| Notes

| `pTemplate="header"`
| `pTemplate="topCenter"`
| Keep header template for custom content. Remove only `ocx-data-view-controls` from inside it.

| `pTemplate="gridItem"`
| `pTemplate="item"`
| Use `let-item let-i="index"` same applies for listItem
|===

.Before:

[source, html]
<ng-template let-roles pTemplate="gridItem">
  <section>
    <article *ngFor="let role of roles; index as i">
      <a (click)="onEditRole($event, role)" [id]="'ws_roles_grid_data_row_' + i"> ... </a>
    </article>
  </section>
</ng-template>

.After:

[source, html]
<ng-template pTemplate="item" let-item let-i="index">
  <section>
    <article class="col-...">
      <a (click)="onEditRole($event, item)" [id]="'ws_roles_grid_data_row_' + i"> ... </a>
    </article>
  </section>
</ng-template>
====

== Handling p-table and DataViewControlsComponent Together

If your implementation uses both `p-table` and `DataViewControlsComponent`, you need to replace them with `InteractiveDataViewComponent` and update the table structure accordingly.

=== Steps to Replace

1. Remove `<ocx-data-view-controls>` and `DataViewControlsComponent` from `@onecx/portal-integration-angular`.
2. Replace `<p-table>` with `<ocx-interactive-data-view>`.
3. Update the input properties and output events as per the tables below.
4. Ensure that the table columns and filters are configured using the `columns` and `filters` properties of `InteractiveDataViewComponent`.

=== Example
.Before
[source, html]
----
<p-table [value]="items" [paginator]="true" [rows]="10">
  <ng-template pTemplate="header">
    <ocx-data-view-controls
      [supportedViews]="['table']"
      [filterValue]="filterValue"
      [enableFiltering]="true"
      (filterChange)="onFilterChange($event)"
    ></ocx-data-view-controls>
  </ng-template>

  <ng-template pTemplate="body" let-item>
    <tr>
      <td>{{ item.name }}</td>
      <td>{{ item.category }}</td>
    </tr>
  </ng-template>
</p-table>
----

.After
[source, html]
----
<ocx-interactive-data-view
  [data]="items"
  [layout]="'table'"
  [columns]="columns"
  [filters]="filters"
  [filter]="filterValue"
  [clientSideFiltering]="true"
  [emptyResultsMessage]="'ACTIONS.SEARCH.NO_DATA' | translate"
  (filtered)="onFilterChange($event)"
>
  <ng-template pTemplate="tableRow" let-item>
    <tr>
      <td>{{ item.name }}</td>
      <td>{{ item.category }}</td>
    </tr>
  </ng-template>
</ocx-interactive-data-view>
----

=== Notes
- Use the `columns` property to define table columns, including their IDs and display names.
- Use the `filters` property to define filtering options for the table.


