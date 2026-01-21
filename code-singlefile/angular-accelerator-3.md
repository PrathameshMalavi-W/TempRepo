<!-- Continued -->

#libs-Folder => angular-accelerator 

********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > angular-accelerator  > testing >

File : index.ts
```ts
import { ensureIntersectionObserverMockExists, ensureOriginMockExists } from '@onecx/angular-testing'

export * from './column-group-selection.harness'
export * from './content-container.harness'
export * from './content.harness'
export * from './custom-group-column-selector.harness'
export * from './data-layout-selection.harness'
export * from './data-list-grid.harness'
export * from './data-table.harness'
export * from './data-view.harness'
export * from './default-grid-item.harness'
export * from './default-list-item.harness'
export * from './diagram.harness'
export * from './filter-view.harness'
export * from './group-by-count-diagram.harness'
export * from './interactive-data-view.harness'
export * from './lifecycle.harness'
export * from './more-actions-menu-button.harness'
export * from './page-header.harness'
export * from './slot.harness'
export * from './search-header.harness'
export * from '../testing/dialog-content.harness'
export * from '../testing/dialog-footer.harness'
export * from '../testing/dialog-inline.harness'
export * from '../testing/dialog-message-content.harness'

export * from '@angular/cdk/testing'
export * from '@angular/cdk/testing/testbed'
export * from '@onecx/angular-testing'

ensureIntersectionObserverMockExists()
ensureOriginMockExists()

```

File : column-group-selection.harness.ts
```ts
import { ComponentHarness } from '@angular/cdk/testing'
import { PSelectHarness } from '@onecx/angular-testing'

export class ColumnGroupSelectionHarness extends ComponentHarness {
  static hostSelector = 'ocx-column-group-selection'

  getPSelect = this.locatorFor(PSelectHarness)
}

```


File : content-container.hamess.ts
```ts
import { ComponentHarness } from '@angular/cdk/testing'
import { DivHarness } from '@onecx/angular-testing'

export class OcxContentContainerHarness extends ComponentHarness {
  static hostSelector = 'ocx-content-container'

  async getLayoutClasses() {
    const div = await this.locatorFor(DivHarness)()
    const actualClassList = await div.getClassList()

    return actualClassList
  }

  async getLayout(): Promise<'horizontal' | 'vertical'> {
    const layoutClassses = await this.getLayoutClasses()
    return layoutClassses.find((c) => c.endsWith(':flex-row')) ? 'horizontal' : 'vertical'
  }

  async getBreakpoint(): Promise<'sm' | 'md' | 'lg' | 'xl' | undefined> {
    const layoutClassses = await this.getLayoutClasses()
    const layoutClass = layoutClassses.find((c) => c.endsWith(':flex-row'))
    return layoutClass?.split(':')[0] as 'sm' | 'md' | 'lg' | 'xl' | undefined
  }
}

```


File : content.hamess.ts
```ts
import { ComponentHarness } from '@angular/cdk/testing'
import { DivHarness, PHarness } from '@onecx/angular-testing'

export class OcxContentHarness extends ComponentHarness {
  static hostSelector = 'ocx-content'

  async getContentClasses() {
    const div = await this.locatorFor(DivHarness)()
    const actualClassList = await div.getClassList()

    return actualClassList
  }

  async getTitleClasses(titleElementId: string) {
    const p = await this.getTitleHarness(titleElementId)
    if (p) {
      const actualClassList = await p.getClassList()
      return actualClassList
    }
    return null
  }

  async getTitle(titleElementId: string) {
    const p = await this.getTitleHarness(titleElementId)
    if (p) {
      const titleContent = await p.getText()
      return titleContent
    }
    return null
  }

  async getTitleHarness(titleElementId: string) {
    const pHarness = await this.locatorForOptional(PHarness.with({ id: titleElementId }))()
    return pHarness
  }

  async hasTitle(titleElementId: string): Promise<boolean> {
    const title = await this.getTitleHarness(titleElementId)
    return !!title
  }
}

```


File : custom-group-column-selector.hamess.ts
```ts
import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { PDialogHarness, PPicklistHarness, PButtonHarness } from '@onecx/angular-testing'

export class CustomGroupColumnSelectorHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-custom-group-column-selector'

  getCustomGroupColumnSelectorButton = this.locatorFor(
    PButtonHarness.with({
      id: 'customGroupColumnSelectorButton',
    })
  )

  getDialog = this.locatorFor(PDialogHarness)
  getCancelButton = this.locatorFor(PButtonHarness.with({ id: 'cancelButton' }))
  getSaveButton = this.locatorFor(PButtonHarness.with({ id: 'saveButton' }))
  getPicklist = this.locatorFor(PPicklistHarness)
  getSelectButtons = this.locatorForOptional('[name]')

  async getFrozenActionColumnSelectButton() {
    return await this.locatorForAll(`[name="frozen-action-column-select-button"] .p-togglebutton`)()
  }

  async getActionColumnPositionSelectButtons() {
    return await this.locatorForAll(`[name="action-column-position-select-button"] .p-togglebutton`)()
  }

  async openCustomGroupColumnSelectorDialog() {
    if (!(await (await this.getDialog()).isVisible())) {
      await (await this.getCustomGroupColumnSelectorButton()).click()
    } else {
      console.warn('Unable to open CustomGroupColumnSelectionDialog, because it is already open.')
    }
  }
}

```


File : data-layout-selection.harness.ts
```ts
import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { PToggleButtonHarness } from '@onecx/angular-testing'

export class DataLayoutSelectionHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-layout-selection'

  getListLayoutSelectionToggleButton = this.locatorFor(
    PToggleButtonHarness.with({ onLabel: 'ocx-data-layout-selection-list' })
  )
  getGridLayoutSelectionToggleButton = this.locatorFor(
    PToggleButtonHarness.with({ onLabel: 'ocx-data-layout-selection-grid' })
  )
  getTableLayoutSelectionToggleButton = this.locatorFor(
    PToggleButtonHarness.with({ onLabel: 'ocx-data-layout-selection-table' })
  )

  async getCurrentLayout() {
    return await (await this.host()).getAttribute('ng-reflect-layout')
  }

  async selectListLayout() {
    await (await this.getListLayoutSelectionToggleButton()).click()
  }

  async selectGridLayout() {
    await (await this.getGridLayoutSelectionToggleButton()).click()
  }

  async selectTableLayout() {
    await (await this.getTableLayoutSelectionToggleButton()).click()
  }
}

```


File : data-list-grid.harness.ts
```ts
import { ContentContainerComponentHarness, TestElement, parallel } from '@angular/cdk/testing'
import { PMenuHarness, PPaginatorHarness } from '@onecx/angular-testing'
import { DefaultGridItemHarness } from './default-grid-item.harness'
import { DefaultListItemHarness } from './default-list-item.harness'
import { waitForDeferredViewsToBeRendered } from '@onecx/angular-testing'

export class DataListGridHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-list-grid'

  getDefaultGridItems = this.locatorForAll(DefaultGridItemHarness)
  getPaginator = this.locatorFor(PPaginatorHarness)
  getMenuButton = this.locatorFor(`[name="data-grid-item-menu-button"]`)
  getListOverflowMenuButton = this.locatorFor(`[name="data-list-overflow-item-menu-button"]`)
  getListOverflowMenu = this.locatorForOptional(PMenuHarness)

  async getDefaultListItems() {
    await waitForDeferredViewsToBeRendered(this)
    return await this.locatorForAll(DefaultListItemHarness)()
  }

  async getActionButtons(actionButtonType: 'list' | 'grid' | 'grid-hidden') {
    if (actionButtonType === 'list') {
      return await this.locatorForAll(`[name="data-list-action-button"]`)()
    } else if (actionButtonType === 'grid-hidden') {
      return await this.documentRootLocatorFactory().locatorForAll(
        `[data-automationid="data-grid-action-button-hidden"]`
      )()
    } else {
      return await this.documentRootLocatorFactory().locatorForAll(`[data-automationid="data-grid-action-button"]`)()
    }
  }

  async getListOverflowMenuItems() {
    const menu = await this.getListOverflowMenu()
    const menuItems = await menu?.getAllMenuItems()
    return menuItems ?? []
  }

  async actionButtonIsDisabled(actionButton: TestElement, viewType: 'list' | 'grid'): Promise<boolean> {
    if (viewType === 'list') {
      return await actionButton.getProperty('disabled')
    } else {
      return await actionButton.hasClass('p-disabled')
    }
  }

  async hasAmountOfActionButtons(actionButtonType: 'list' | 'grid' | 'grid-hidden', amount: number) {
    return (await this.getActionButtons(actionButtonType)).length === amount
  }

  async hasAmountOfDisabledActionButtons(viewType: 'list' | 'grid', amount: number) {
    let disabledActionButtonsCount = 0
    const actionButtons = await this.getActionButtons(viewType)
    await parallel(() =>
      actionButtons.map(async (actionButton) => {
        if ((await this.actionButtonIsDisabled(actionButton, viewType)) === true) {
          disabledActionButtonsCount++
        }
      })
    )
    return disabledActionButtonsCount === amount
  }
}

```


File : data-table.harness.ts
```ts
import {
  BaseHarnessFilters,
  ContentContainerComponentHarness,
  HarnessPredicate,
  TestElement,
  parallel,
} from '@angular/cdk/testing'
import {
  TableHeaderColumnHarness,
  TableRowHarness,
  PPaginatorHarness,
  PTableCheckboxHarness,
  PMenuHarness,
  MenuItemHarness,
} from '@onecx/angular-testing'

export interface DataTableHarnessFilters extends BaseHarnessFilters {
  id?: string
}

export class DataTableHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-table'

  static with(options: DataTableHarnessFilters): HarnessPredicate<DataTableHarness> {
    return new HarnessPredicate(DataTableHarness, options).addOption('id', options.id, (harness, id) =>
      HarnessPredicate.stringMatches(harness.getId(), id)
    )
  }

  getHeaderColumns = this.locatorForAll(TableHeaderColumnHarness)
  getRows = this.locatorForAll(TableRowHarness)
  getPaginator = this.locatorFor(PPaginatorHarness)
  getOverflowMenu = this.locatorForOptional(PMenuHarness)

  async getId(): Promise<string | null> {
    return await (await this.host()).getAttribute('id')
  }

  async rowSelectionIsEnabled(): Promise<boolean> {
    const pTableCheckbox = await this.getHarnessesForCheckboxes('all')
    return pTableCheckbox.length > 0
  }

  async getHarnessesForCheckboxes(type: 'all' | 'checked' | 'unchecked'): Promise<PTableCheckboxHarness[]> {
    let checkBoxHarnesses: PTableCheckboxHarness[]
    if (type === 'checked') {
      checkBoxHarnesses = await this.getAllHarnesses(PTableCheckboxHarness.with({ isSelected: true }))
      return checkBoxHarnesses
    }
    if (type === 'unchecked') {
      checkBoxHarnesses = await this.getAllHarnesses(PTableCheckboxHarness.with({ isSelected: false }))
      return checkBoxHarnesses
    } else {
      checkBoxHarnesses = await this.getAllHarnesses(PTableCheckboxHarness)
      return checkBoxHarnesses
    }
  }

  async getActionColumnHeader(position: 'left' | 'right') {
    return await this.locatorForOptional(`[name="action-column-header-${position}"]`)()
  }

  async getActionColumn(position: 'left' | 'right') {
    return await this.locatorForOptional(`[name="action-column-${position}"]`)()
  }

  async getActionButtons() {
    return await this.locatorForAll(`[name="data-table-action-button"]`)()
  }

  async getOverflowActionMenuButton() {
    return await this.locatorForOptional('[name="data-table-overflow-action-button"]')()
  }

  async getOverFlowMenuItems() {
    const menu = await this.getOverflowMenu()
    const menuItems = await menu?.getAllMenuItems()
    return menuItems ?? []
  }

  async getOverFlowMenuItem(itemText: string): Promise<MenuItemHarness | undefined | null> {
    const menu = await this.getOverflowMenu()
    return await menu?.getMenuItem(itemText)
  }

  async actionButtonIsDisabled(actionButton: TestElement) {
    const isDisabled = await actionButton.getProperty('disabled')
    return isDisabled
  }

  async hasAmountOfActionButtons(amount: number) {
    return (await this.getActionButtons()).length === amount
  }

  async hasAmountOfDisabledActionButtons(amount: number) {
    let disabledActionButtonsCount = 0
    const actionButtons = await this.getActionButtons()
    await parallel(() =>
      actionButtons.map(async (actionButton) => {
        if ((await this.actionButtonIsDisabled(actionButton)) === true) {
          disabledActionButtonsCount++
        }
      })
    )
    return disabledActionButtonsCount === amount
  }

  async columnIsFrozen(column: TestElement | null | undefined) {
    if (column === null || column === undefined) {
      throw new Error('Given column is null')
    }
    return await column.hasClass('p-datatable-frozen-column')
  }
}

```


File : data-view.harness.ts
```ts
import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { DataListGridHarness } from './data-list-grid.harness'
import { DataTableHarness } from './data-table.harness'

export class DataViewHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-data-view'

  getDataTable = this.locatorForOptional(DataTableHarness)
  getDataListGrid = this.locatorForOptional(DataListGridHarness)
}

```


File : default-grid-item.hamess.ts
```ts
import { ComponentHarness } from '@angular/cdk/testing'
import { DivHarness } from '@onecx/angular-testing'
import { MoreActionsMenuButtonHarness } from './more-actions-menu-button.harness'

export class DefaultGridItemHarness extends ComponentHarness {
  static hostSelector = '.data-grid-item'

  getMoreActionsButton = this.locatorFor(MoreActionsMenuButtonHarness)
  private getAllDivs = this.locatorForAll(DivHarness)
  private getGridImg = this.locatorFor('img')

  async getData() {
    const isDataGridItemsDiv = await Promise.all(
      (await this.getAllDivs()).map((divHarness) => this.checkDivsHasClasses(divHarness))
    )
    const divHarnesses = (await this.getAllDivs()).filter((_v, index) => isDataGridItemsDiv[index])
    const getDivTexts: (string | null)[] = await Promise.all(divHarnesses.map((divHarness) => divHarness.getText()))
    getDivTexts.unshift(await (await this.getGridImg()).getAttribute('src'))
    return getDivTexts
  }

  async checkDivsHasClasses(value: DivHarness) {
    const hasClass = (await value.checkHasClass('item-name')) || (await value.checkHasClass('subtitleLine'))
    return hasClass
  }
}

```


File : default-list-item.harness.ts
```ts
import { ComponentHarness } from '@angular/cdk/testing'
import { ButtonHarness, DivHarness } from '@onecx/angular-testing'
import { waitForDeferredViewsToBeRendered } from '@onecx/angular-testing'

export class DefaultListItemHarness extends ComponentHarness {
  static hostSelector = '.data-list-items'

  getAllActionButtons = this.locatorForAll('button')
  getViewButton = this.locatorForOptional(ButtonHarness.with({ class: 'viewListItemButton' }))
  getEditButton = this.locatorForOptional(ButtonHarness.with({ class: 'editListItemButton' }))
  getDeleteButton = this.locatorForOptional(ButtonHarness.with({ class: 'deleteListItemButton' }))

  private getAllDivs = this.locatorForAll(DivHarness)

  async getData() {
    await waitForDeferredViewsToBeRendered(this)
    const isDataListItemsDiv = await Promise.all(
      (await this.getAllDivs()).map((innerDivHarness) => this.checkDivsHasClasses(innerDivHarness))
    )
    const divHarnesses = (await this.getAllDivs()).filter((_v, index) => isDataListItemsDiv[index])
    const getDivTexts = await Promise.all(divHarnesses.map((divHarness) => divHarness.getText()))
    return getDivTexts
  }

  async checkDivsHasClasses(value: DivHarness) {
    const hasClass = (await value.checkHasClass('item-name-row')) || (await value.checkHasClass('subtitleLine'))
    return hasClass
  }
}

```


File : diagram.harness.ts
```ts
import { ComponentHarness } from '@angular/cdk/testing'
import { PChartHarness, PSelectButtonHarness } from '@onecx/angular-testing'

export class DiagramHarness extends ComponentHarness {
  static hostSelector = 'ocx-diagram'

  getChart = this.locatorFor(PChartHarness)

  async getTotalNumberOfResults(): Promise<number | undefined> {
    return (await this.locatorForOptional('.sumKey span[name="amountOfData"]')())?.text().then((s) => Number(s))
  }

  async getSumLabel(): Promise<string | undefined> {
    return (await this.locatorForOptional('.sumKey span[name="sumLabel"]')())?.text()
  }

  async getDiagramTypeSelectButton() {
    return await this.locatorForOptional('p-selectbutton[name="diagram-type-select-button"]')()
  }

  async getAllSelectionButtons() {
    return await (await this.locatorFor(PSelectButtonHarness)()).getAllButtons()
  }
}

```


File : dialog-content.harness.ts
```ts
import { ContentContainerComponentHarness } from '@onecx/angular-testing'
import { DialogMessageContentHarness } from './dialog-message-content.harness'

export class DialogContentHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-dialog-content'

  getDialogMessageContent = this.locatorForOptional(DialogMessageContentHarness)
}

```


File : dialog-footer.harness.ts
```ts
import { ContentContainerComponentHarness, PButtonDirectiveHarness } from '@onecx/angular-testing'

export class DialogFooterHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-dialog-footer'

  getPrimaryButton = this.locatorFor(PButtonDirectiveHarness.with({ id: 'buttonDialogPrimaryButton' }))
  getSecondaryButton = this.locatorForOptional(PButtonDirectiveHarness.with({ id: 'buttonDialogSecondaryButton' }))

  async clickPrimaryButton() {
    await (await this.getPrimaryButton()).click()
  }

  async clickSecondaryButton() {
    await (await this.getSecondaryButton())?.click()
  }

  async getPrimaryButtonLabel(): Promise<string | null> {
    return await (await this.getPrimaryButton()).getLabel()
  }

  async getPrimaryButtonIcon(): Promise<string | null> {
    return await (await this.getPrimaryButton()).getIcon()
  }

  async getSecondaryButtonLabel(): Promise<string | null | undefined> {
    return await (await this.getSecondaryButton())?.getLabel()
  }

  async getSecondaryButtonIcon(): Promise<string | null | undefined> {
    return await (await this.getSecondaryButton())?.getIcon()
  }

  async getPrimaryButtonDisabled(): Promise<boolean> {
    return await (await this.getPrimaryButton()).getDisabled()
  }

  async getSecondaryButtonDisabled(): Promise<boolean | undefined> {
    return await (await this.getSecondaryButton())?.getDisabled()
  }
}

```


File : dialog-inline.harness.ts
```ts
import { ContentContainerComponentHarness } from '@onecx/angular-testing'
import { DialogContentHarness } from './dialog-content.harness'
import { DialogFooterHarness } from './dialog-footer.harness'

export class DialogInlineHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-dialog-inline'

  getDialogContent = this.locatorFor(DialogContentHarness)
  getDialogFooter = this.locatorFor(DialogFooterHarness)
}

```


File : dialog-message-content. harness.ts
```ts
import { ComponentHarness } from '@angular/cdk/testing'

export class DialogMessageContentHarness extends ComponentHarness {
  static hostSelector = '.dialogMessageContent'

  private getMessageSpan = this.locatorFor('#dialogMessage')
  private getIcon = this.locatorForOptional('i')

  async getMessageContent(): Promise<string> {
    return await (await this.getMessageSpan()).text()
  }

  async getIconValue(): Promise<string | null | undefined> {
    return await (await this.getIcon())?.getAttribute('class')
  }
}

```


File : filter-view.harness.ts
```ts
import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { DataTableHarness } from './data-table.harness'
import { PButtonHarness, PChipHarness, SpanHarness } from '@onecx/angular-testing'

export class FilterViewHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-filter-view'

  getOverlayResetFiltersButton = this.documentRootLocatorFactory().locatorForOptional(
    PButtonHarness.with({ id: 'ocxFilterViewOverlayReset' })
  )
  getFiltersButton = this.locatorForOptional(PButtonHarness.with({ id: 'ocxFilterViewManage' }))
  getChipsResetFiltersButton = this.locatorForOptional(PButtonHarness.with({ id: 'ocxFilterViewReset' }))
  getChips = this.locatorForAll(PChipHarness)
  getNoFiltersMessage = this.locatorForOptional(SpanHarness.with({ id: 'ocxFilterViewNoFilters' }))

  async getDataTable() {
    return await this.documentRootLocatorFactory().locatorForOptional(
      DataTableHarness.with({ id: 'ocxFilterViewDataTable' })
    )()
  }
}

```


File : group-by-count-diagram.harness.ts
```ts
import { ComponentHarness } from '@angular/cdk/testing'
import { DiagramHarness } from './diagram.harness'

export class GroupByCountDiagramHarness extends ComponentHarness {
    static hostSelector = 'ocx-group-by-count-diagram'

    getDiagram = this.locatorFor(DiagramHarness)
}
```


File : interactive-data-view.harness.ts
```ts
import { ContentContainerComponentHarness } from '@angular/cdk/testing'
import { DivHarness, PButtonHarness } from '@onecx/angular-testing'
import { PSelectHarness } from '@onecx/angular-testing'
import { DataLayoutSelectionHarness } from './data-layout-selection.harness'
import { DataViewHarness } from './data-view.harness'
import { SlotHarness } from './slot.harness'
import { CustomGroupColumnSelectorHarness } from './custom-group-column-selector.harness'

export class InteractiveDataViewHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-interactive-data-view'

  async getHeaderStyleClasses() {
    const headerDiv = await this.locatorFor(DivHarness.with({ id: 'interactiveDataViewHeader' }))()
    const headerClassList = await headerDiv.getClassList()
    return headerClassList
  }

  async getContentStyleClasses() {
    const contentDiv = await this.locatorFor(DivHarness.with({ id: 'interactiveDataViewContent' }))()
    const contentClassList = await contentDiv.getClassList()
    return contentClassList
  }

  getDataLayoutSelection = this.locatorFor(DataLayoutSelectionHarness)
  getColumnGroupSelectionSelect = this.locatorForOptional(PSelectHarness.with({ id: 'columnGroupSelectionSelect' }))
  getCustomGroupColumnSelector = this.locatorForOptional(CustomGroupColumnSelectorHarness)
  getCustomGroupColumnSelectorSlot = this.locatorForOptional(SlotHarness)
  getDataListGridSortingSelect = this.locatorForOptional(PSelectHarness.with({ id: 'dataListGridSortingSelect' }))
  getDataListGridSortingButton = this.locatorForOptional(PButtonHarness.with({ id: 'dataListGridSortingButton' }))
  getDataView = this.locatorFor(DataViewHarness)
}

```


File : lifecycle.harness.ts
```ts
import { ContentContainerComponentHarness } from "@angular/cdk/testing"

export class LifecycleHarness extends ContentContainerComponentHarness {
    static hostSelector = 'ocx-lifecycle'

    getSteps = this.locatorForAll('.p-timeline-event-content .card')
    getHighlightedSteps = this.locatorForAll('.p-timeline-event-content .card.bg-primary')
}
```


File : more-actions-menu-button.harness.ts
```ts
import { ContentContainerComponentHarness, HarnessLoader } from '@angular/cdk/testing'
import { MenuItemHarness } from '@onecx/angular-testing'

export class MoreActionsMenuButtonHarness extends ContentContainerComponentHarness {
  static hostSelector = '.more-actions-menu-button'

  async getHarnessLoaderForPMenuOverlay(): Promise<HarnessLoader | null> {
    return this.documentRootLocatorFactory().harnessLoaderForOptional('.p-menu-overlay')
  }

  async isOpen(): Promise<boolean> {
    return !!(await this.getHarnessLoaderForPMenuOverlay())
  }

  async open() {
    if (!(await this.isOpen())) {
      await (await this.host()).click()
    } else {
      console.warn('Unable to open multiSelect, because it is already open.')
    }
  }

  async close() {
    if (await this.isOpen()) {
      await (await this.host()).click()
    } else {
      console.warn('Unable to open multiSelect, because it is already open.')
    }
  }

  async getAllActionsMenuItems() {
    await this.open()
    if (await this.getHarnessLoaderForPMenuOverlay()) {
      return this.documentRootLocatorFactory().locatorForAll(MenuItemHarness)()
    }
    return []
  }
}

```


File : page-header.harness.ts
```ts
import { BaseHarnessFilters, ComponentHarness, ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing'
import {
  ListItemHarness,
  MenuItemHarness,
  PBreadcrumbHarness,
  PButtonHarness,
  PMenuHarness,
} from '@onecx/angular-testing'

export class PageHeaderHarness extends ComponentHarness {
  static hostSelector = 'ocx-page-header'

  getPageHeaderWrapperHarness = this.locatorForAll('[name="ocx-page-header-wrapper"]')
  getBreadcrumb = this.locatorForOptional(PBreadcrumbHarness)
  getMenu = this.locatorForOptional(PMenuHarness)

  async getElementByTitle(title: string) {
    return await this.locatorForOptional(`[title="${title}"]`)()
  }

  async getElementByAriaLabel(ariaLabel: string) {
    return await this.locatorForOptional(`[aria-label="${ariaLabel}"]`)()
  }

  async getObjectInfos() {
    return await this.locatorForAll(ObjectDetailItemHarness)()
  }

  async getObjectInfoByLabel(objectInfolabel: string) {
    return await this.locatorForOptional(ObjectDetailItemHarness.with({ label: objectInfolabel }))()
  }

  async getInlineActionButtons() {
    const inlineActionButtons = await this.locatorForAll(
      PButtonHarness.with({ name: 'ocx-page-header-inline-action-button' })
    )()
    const inlineActionIconButtons = await this.locatorForAll(
      PButtonHarness.with({ name: 'ocx-page-header-inline-action-icon-button' })
    )()
    return inlineActionButtons.concat(inlineActionIconButtons)
  }

  async getInlineActionButtonByLabel(buttonLabel: string) {
    return await this.locatorForOptional(PButtonHarness.with({ label: buttonLabel }))()
  }

  async getInlineActionButtonByIcon(buttonIcon: string) {
    return await this.locatorForOptional(PButtonHarness.with({ icon: buttonIcon }))()
  }

  async getOverflowActionMenuButton() {
    return await this.locatorForOptional('[name="ocx-page-header-overflow-action-button"]')()
  }

  async getOverFlowMenuItems() {
    const menu = await this.getMenu()
    const menuItems = await menu?.getAllMenuItems()
    return menuItems ?? []
  }

  async getOverFlowMenuItem(itemText: string): Promise<MenuItemHarness | undefined | null> {
    const menu = await this.getMenu()
    return await menu?.getMenuItem(itemText)
  }

  async getBreadcrumbItem(itemText: string): Promise<ListItemHarness | undefined | null> {
    const breadcrumb = await this.getBreadcrumb()
    return await breadcrumb?.getBreadcrumbItem(itemText)
  }

  async getHeaderText(): Promise<string | undefined> {
    return await (await this.locatorForOptional('#page-header')())?.text()
  }

  async getSubheaderText(): Promise<string | undefined> {
    return await (await this.locatorForOptional('#page-subheader')())?.text()
  }
}

interface ObjectDetailItemHarnessFilters extends BaseHarnessFilters {
  label?: string
}

class ObjectDetailItemHarness extends ContentContainerComponentHarness {
  static hostSelector = '.object-info'

  getLabelElement = this.locatorFor('[name="object-detail-label"]')
  getValueElement = this.locatorForOptional('[name="object-detail-value"]')
  getIconElement = this.locatorForOptional('[name="object-detail-icon"]')

  static with(options: ObjectDetailItemHarnessFilters): HarnessPredicate<ObjectDetailItemHarness> {
    return new HarnessPredicate(ObjectDetailItemHarness, options).addOption('label', options.label, (harness, label) =>
      HarnessPredicate.stringMatches(harness.getLabel(), label)
    )
  }

  async getLabel() {
    return (await this.getLabelElement()).text()
  }

  async getValue() {
    return (await this.getValueElement())?.text()
  }

  async getValueStyles() {
    return (await this.getValueElement())?.getAttribute('class')
  }

  async getIcon() {
    return (await this.getIconElement())?.getAttribute('class')
  }

  async getLabelTooltipContent(): Promise<string | null> {
    return this.getTooltipFromElement(await this.getLabelElement())
  }

  async getValueTooltipContent(): Promise<string | null> {
    return this.getTooltipFromElement(
      await this.locatorForOptional('[name="object-detail-value"] > span:first-of-type')()
    )
  }

  async getActionItemTooltipContent(): Promise<string | null> {
    return this.getTooltipFromElement(
      await this.locatorForOptional('[name="object-detail-value"] p-button')()
    )
  }

  private async getTooltipFromElement(element: any): Promise<string | null> {
    if (!element) return null
    
    await element.hover()
    await this.forceStabilize()
    
    const rootLocator = this.documentRootLocatorFactory()
    const tooltipEl = await rootLocator.locatorForOptional('.p-tooltip .p-tooltip-text')()
    if (tooltipEl) {
      const text = await tooltipEl.text()
      await element.mouseAway()
      await this.forceStabilize()
      return text
    }
    
    return null
  }
}

```


File : search-header.harness.ts
```ts
import { ComponentHarness } from '@angular/cdk/testing'
import { PButtonHarness } from '@onecx/angular-testing'
import { PageHeaderHarness } from './page-header.harness'
import { MoreActionsMenuButtonHarness } from './more-actions-menu-button.harness'

export class SearchHeaderHarness extends ComponentHarness {
  static hostSelector = 'ocx-search-header'

  getPageHeader = this.locatorFor(PageHeaderHarness)
  getSearchButton = this.locatorFor(
    PButtonHarness.with({
      id: 'searchButton',
    })
  )

  getResetButton = this.locatorFor(
    PButtonHarness.with({
      id: 'resetButton',
    })
  )

  getSimpleAdvancedButton = this.locatorForOptional(
    PButtonHarness.with({
      id: 'simpleAdvancedButton',
    })
  )

  getMoreActionsMenuButton = this.locatorForOptional(MoreActionsMenuButtonHarness)

  async clickResetButton() {
    await (await this.getResetButton()).click()
  }

  async clickSearchButton() {
    await (await this.getSearchButton()).click()
  }

  async toggleSimpleAdvanced() {
    if (await this.getSimpleAdvancedButton()) {
      await (await this.getSimpleAdvancedButton())?.click()
    } else {
      console.warn('No SimpleAdvancedButton is being displayed to toggle, because no advanced form field is defined.')
    }
  }
}

```


File : slot.harness.ts
```ts
import { BaseHarnessFilters, ContentContainerComponentHarness } from '@angular/cdk/testing'

export interface SlotHarnessFilters extends BaseHarnessFilters {
  name?: string
}

export class SlotHarness extends ContentContainerComponentHarness {
  static hostSelector = 'ocx-slot'
}

```
























