#libs-Folder => nx-migration-utils

********************************************************************************************************************************

FIle => onecx-portal-ui-libs > libs > nx-migration-utils > src > index.ts


```ts
// General purpose and framework-agnostic utilities for NX migrations
export * from './lib/common-migrations/common-migrate-onecx-to-v6.utils'

export * from './lib/utils/detect-method-calls-in-files.utils'
export * from './lib/utils/import-statements.utils'
export * from './lib/utils/print-warnings.utils'
export * from './lib/utils/typescript-files.utils'
export * from './lib/utils/update-gitignore.utils'

export * from './lib/utils/detection/detect-variables-with-identifier.utils'

export * from './lib/utils/modification/update-json-files.utils'
export * from './lib/utils/modification/update-style-sheets.utils'
export * from './lib/utils/modification/update-style-sheet.utils'
export * from './lib/utils/modification/remove-json-references.utils'
export * from './lib/utils/modification/add-new-import.utils'
export * from './lib/utils/modification/add-to-first-import.utils'
export * from './lib/utils/modification/replace-tag-in-html.utils'
export * from './lib/utils/modification/remove-import-specifier.utils'


export * from './lib/utils/validation/is-file-style-sheet.utils'
export * from './lib/utils/validation/has-html-tag.utils'
export * from './lib/utils/validation/is-import-in-content.utils'
export * from './lib/utils/validation/is-namespace-import-in-content.utils'
export * from './lib/utils/validation/is-import-in-file-content.utils'


```

File : test-setup.ts
```ts
import { expect } from '@jest/globals'
import * as matchers from 'jest-extended'
expect.extend(matchers)
```






********************************************************************************************************************************

Folder => onecx-portal-ui-libs > libs > nx-migration-utils > src > lib > angular

File :index.ts
```ts
// Angular specific NX migration utilities

// Model
export * from './model/matching-module.model'
export * from './model/module.model'
export * from './model/provider.model'

// Utils
export * from './html-templates.utils'
export * from './parameters.utils'
export * from './replacement-in-files.utils'
export * from './utils/patterns.utils'
export * from './utils/detection/detect-modules-importing-module.utils'
export * from './utils/detection/detect-variables-with-module.utils'
export * from './utils/detection/detect-variables-with-provider.utils'
export * from './utils/modification/add-provider-import-if-does-not-exist.utils'
export * from './utils/modification/add-provider-import-in-file.utils'
export * from './utils/modification/add-provider-in-module-if-does-not-exist.utils'
export * from './utils/modification/add-provider-in-module.utils'
export * from './utils/validation/is-provider-import-in-file.utils'
export * from './utils/validation/is-provider-in-module.utils'

```

File : html-templates.utils.ts
```ts
import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query, replace } from '@phenomnomnominal/tsquery'
import { dirname, join } from 'path'
import { isStringLiteral, Node, ScriptKind } from 'typescript'
import { hasHtmlTag } from '../utils/validation/has-html-tag.utils'
import { replaceTagInHtml } from '../utils/modification/replace-tag-in-html.utils'

/**
 * Changes all occurrences of a specific HTML tag name in Angular component templates.
 * @param tree - The Nx Tree representing the file system.
 * @param dirPath - Directory path to search for files.
 * @param oldTagName - The tag name to replace.
 * @param newTagName - The new tag name to use.
 */
export function replaceTagInAngularTemplates(tree: Tree, dirPath: string, oldTagName: string, newTagName: string) {
  visitNotIgnoredFiles(tree, dirPath, (file) => {
    if (file.endsWith('.ts')) {
      replaceTagInInlineAndExternalTemplate(tree, file, oldTagName, newTagName)
    }
  })
}

/**
 * Processes a TypeScript file to find and update Angular component templates.
 * @param tree - The Nx Tree.
 * @param filePath - Path to the TypeScript file.
 * @param oldTagName - The tag name to replace.
 * @param newTagName - The new tag name to use.
 */
export function replaceTagInInlineAndExternalTemplate(
  tree: Tree,
  filePath: string,
  oldTagName: string,
  newTagName: string
) {
  try {
    const tsContent = tree.read(filePath, 'utf8')

    if (!tsContent) return

    const contentAst = ast(tsContent)

    replaceTagInInlineTemplates(tree, filePath, oldTagName, newTagName)
    replaceTagInExternalTemplates(tree, filePath, contentAst, oldTagName, newTagName)
  } catch (error) {
    console.error(`Error processing file ${filePath}: `, error)
  }
}

/**
 * Processes inline Angular templates in a TypeScript file and replaces tag names.
 * @param tree - The Nx Tree.
 * @param filePath - Path to the TypeScript file.
 * @param oldTagName - The tag name to replace.
 * @param newTagName - The new tag name to use.
 */
export function replaceTagInInlineTemplates(tree: Tree, filePath: string, oldTagName: string, newTagName: string) {
  const fileContent = tree.read(filePath, 'utf-8')
  if (!fileContent) return

  const querySelectorInlineTemplate =
    'PropertyAssignment:has(Identifier[name="template"]) > NoSubstitutionTemplateLiteral'

  const updatedContent = replace(
    fileContent,
    querySelectorInlineTemplate,
    (node) => {
      const originalText = node.getText()

      if (!hasHtmlTag(tree, originalText, oldTagName)) return originalText

      const updatedHtml = replaceTagInHtml(tree, originalText, oldTagName, newTagName)
      return updatedHtml
    },
    ScriptKind.TS
  )

  if (updatedContent !== fileContent) {
    tree.write(filePath, updatedContent)
  }
}

/**
 * Processes an external HTML template file and replaces tag names.
 * @param tree - The Nx Tree.
 * @param filePath - Path to the HTML file.
 * @param contentAst - The AST of the source file.
 * @param oldTagName - The tag name to replace.
 * @param newTagName - The new tag name to use.
 */
export function replaceTagInExternalTemplates(
  tree: Tree,
  filePath: string,
  contentAst: Node,
  oldTagName: string,
  newTagName: string
) {
  const externalTemplates = getExternalTemplatePaths(contentAst, filePath)

  externalTemplates.forEach((path) => {
    const html = tree.read(path, 'utf-8')
    if (!html || !hasHtmlTag(tree, path, oldTagName)) return

    const modifiedHtml = replaceTagInHtml(tree, html, oldTagName, newTagName)

    tree.write(path, modifiedHtml)
  })
}

/**
 * Extracts inline template nodes from a TypeScript AST.
 * @param contentAst - The parsed TypeScript AST.
 * @returns An array of inline template nodes.
 */
export function getInlineTemplateNodes(contentAst: Node): Node[] {
  return query(contentAst, 'PropertyAssignment:has(Identifier[name="template"]) > NoSubstitutionTemplateLiteral')
}

/**
 * Extracts resolved external template file paths from a TypeScript AST.
 * @param contentAst - The parsed TypeScript AST.
 * @param filePath - The path to the TypeScript file.
 * @returns An array of resolved external HTML file paths.
 */
export function getExternalTemplatePaths(contentAst: Node, filePath: string): string[] {
  const nodes = query(contentAst, 'PropertyAssignment:has(Identifier[name="templateUrl"]) > StringLiteral')

  return nodes.filter(isStringLiteral).map((node) => join(dirname(filePath), node.text))
}

```


File : parameters.utils.ts
```ts
import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, replace } from '@phenomnomnominal/tsquery'
import { ScriptKind } from 'typescript'
import { getParameterNames } from '../utils/detect-method-calls-in-files.utils'
import { fileMatchesQuery } from '../utils/typescript-files.utils'

/**
 * Removes constructor parameters of specified class types from TypeScript files.
 *
 * @param tree - The Nx virtual file system tree.
 * @param directoryPath - Directory to search for files.
 * @param classNames - List of class names whose parameters should be removed.
 * @param filterQuery - Optional custom string query to filter files before applying changes.
 * This can be used to limit the operation to files containing specific content (e.g., a class name or decorator).
 */
export function removeParameters(tree: Tree, directoryPath: string, classNames: string[], filterQuery?: string) {
  visitNotIgnoredFiles(tree, directoryPath, (filePath) => {
    if (!filePath.endsWith('.ts')) return

    try {
      const fileContent = tree.read(filePath, 'utf-8')
      if (!fileContent) return

      const contentAst = ast(fileContent)

      if (filterQuery && !fileMatchesQuery(fileContent, filterQuery)) return

      const parameterNames = classNames.flatMap((className) => getParameterNames(contentAst, className))
      if (!parameterNames.length) return

      const parametersQuery = classNames
        .map((className) => `Parameter:has(TypeReference:has(Identifier[name="${className}"]))`)
        .join(', ')

      const parameterNamesQuery = parameterNames
        .map((parameterName) => `NewExpression > Identifier[name="${parameterName}"]`)
        .join(', ')

      let updatedContent = replace(fileContent, parametersQuery, () => '', ScriptKind.TS)
      updatedContent = replace(updatedContent, parameterNamesQuery, () => '', ScriptKind.TS)

      if (updatedContent !== fileContent) {
        tree.write(filePath, updatedContent)
      }
    } catch (error) {
      console.error(`Error removing parameters from file ${filePath}: `, error)
    }
  })
}

```


File : replacement-in-files.utils.ts
```ts
import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { replace } from '@phenomnomnominal/tsquery'
import { ScriptKind } from 'typescript'
import { fileMatchesQuery, removeEmptySlotsFromArrays } from '../utils/typescript-files.utils'

/**
 * Applies a tsquery-based replacement to a single TypeScript file.
 * @param tree - The Nx virtual file system tree.
 * @param filePath - Path to the TypeScript file to update.
 * @param queryStr - A tsquery selector string used to identify nodes for replacement.
 * @param replacement - The replacement string. If empty, trailing commas and empty array slots are cleaned up.
 */
export function replaceInFile(tree: Tree, filePath: string, queryStr: string, replacement: string) {
  try {
    const fileContent = tree.read(filePath, 'utf-8')
    if (!fileContent) return

    let updatedContent = replace(fileContent, queryStr, () => replacement, ScriptKind.TS)
    if (replacement === '') {
      updatedContent = removeEmptySlotsFromArrays(updatedContent)
    }

    if (updatedContent !== fileContent) {
      tree.write(filePath, updatedContent)
    }
  } catch (error) {
    console.error(`Error doing replacement for file ${filePath}: `, error)
  }
}

/**
 * Applies a tsquery-based replacement to all `.ts` files in a given directory.
 * @param tree - The Nx virtual file system tree.
 * @param directoryPath - Path to the directory containing TypeScript files.
 * @param queryStr - A tsquery selector string used to identify nodes for replacement.
 * @param replacement - The replacement string. If empty, trailing commas and empty array slots are cleaned up.
 */
export function replaceInFiles(tree: Tree, directoryPath: string, queryStr: string, replacement: string, filterQuery?: string) {
  visitNotIgnoredFiles(tree, directoryPath, (filePath) => {
    if (!filePath.endsWith('.ts')) return

    const fileContent = tree.read(filePath, 'utf-8')
    if (!fileContent) return

    if (filterQuery && !fileMatchesQuery(fileContent, filterQuery)) return

    replaceInFile(tree, filePath, queryStr, replacement)
  })
}

```






********************************************************************************************************************************

Folder => onecx-portal-ui-libs > libs > nx-migration-utils > src > lib > angular > model

File :  models
```ts
// matching-module.model.ts
export interface MatchingModule {
  name: string
  filePath: string
}

// module.model.ts
export interface Module {
  name: string
}


// provider.model.ts
export interface Provider {
  name: string
  importPath: string
}


```





********************************************************************************************************************************

Folder => onecx-portal-ui-libs > libs > nx-migration-utils > src > lib > angular > utils

File :  patterns.utils
```ts
import { Provider } from '../model/provider.model'

// Provider patterns

/**
 * Creates a pattern to look for Angular provider import declaration
 * @param provider - provider to look for
 * @returns {string} ast query pattern
 */
export function providerImportPattern(provider: Provider): string {
  return `ImportDeclaration:has(StringLiteral[value=${provider.importPath}]):has(ImportSpecifier:has(Identifier[name=${provider.name}]))`
}

// Module patterns

/**
 * Creates a pattern to look for an identifier in the imports list of the Angular module
 * @param identifierName
 * @returns {string} ast query pattern
 */
export function moduleImportIdentifierPattern(identifierName: string): string {
  return `ClassDeclaration:has(Decorator > CallExpression:has(Identifier[name=NgModule])  PropertyAssignment:has(Identifier[name=imports]) Identifier[name=${identifierName}])`
}

/**
 * Creates a pattern to look for an identifier in the providers list of the Angular module
 * @param moduleName
 * @param identifierName
 * @returns {string} ast query pattern
 */
export function moduleProviderIdentifierPattern(moduleName: string, identifierName: string): string {
  return `ClassDeclaration:has(Identifier[name=${moduleName}]):has(Decorator > CallExpression:has(Identifier[name=NgModule]) PropertyAssignment:has(Identifier[name=providers]) Identifier[name=${identifierName}])`
}

/**
 * Creates a pattern to look for the providers list of the Angular module
 * @param moduleName
 * @returns {string} ast query pattern
 */
export function moduleProvidersArrayPattern(moduleName: string): string {
  return `ClassDeclaration:has(Identifier[name=${moduleName}]) Decorator > CallExpression:has(Identifier[name=NgModule]) PropertyAssignment:has(Identifier[name=providers]) > ArrayLiteralExpression`
}


```





********************************************************************************************************************************

Folder => onecx-portal-ui-libs > libs > nx-migration-utils > src > lib > angular > utils > detection

File :  detect-modules-importing-module.utils.ts
```ts
import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query } from '@phenomnomnominal/tsquery'
import { ClassDeclaration } from 'typescript'
import { MatchingModule } from '../../model/matching-module.model'
import { Module } from '../../model/module.model'
import { moduleImportIdentifierPattern } from '../patterns.utils'

/**
 * Detects Angular module definitions that import given module.
 * @param tree - the file tree to search in
 * @param rootDir - the directory to start searching from
 * @param module - the module to search for
 * @param variablesIncludingModule - the list of variable names containing the module to search for
 * @returns {MatchingModule[]} a list of found modules that import the module via direct declaration or variable
 */
export function detectModulesImportingModule(
  tree: Tree,
  rootDir: string,
  module: Module,
  variablesIncludingModule: string[]
): MatchingModule[] {
  const matchingModules: MatchingModule[] = []
  // Query for import in module directly
  const directImportPattern = moduleImportIdentifierPattern(module.name)
  // Query for import via a variable
  const importViaVariablePatterns = variablesIncludingModule.map((name) => moduleImportIdentifierPattern(name))

  visitNotIgnoredFiles(tree, rootDir, (file) => {
    const content = tree.read(file, 'utf-8')
    if (!content) return

    const contentAst = ast(content)

    const allPatterns = [...importViaVariablePatterns, directImportPattern].join(', ')
    const moduleNamesInFile: MatchingModule[] = query<ClassDeclaration>(contentAst, allPatterns)
      .map((classDeclaration) => classDeclaration.name?.text)
      .filter((className): className is string => !!className)
      .map((className) => {
        return {
          name: className,
          filePath: file,
        }
      })
    matchingModules.push(...moduleNamesInFile)
  })

  return matchingModules
}

```


File : detect-variables-with-module.utils.ts
```ts
import { Tree } from '@nx/devkit'
import { detectVariablesWithIdentifier } from '../../../utils/detection/detect-variables-with-identifier.utils'
import { Module } from '../../model/module.model'

/**
 * Detects variables that include the Angular module.
 * @param tree - the file tree to search in
 * @param rootDir - the directory to start searching from
 * @param module - the module to search for
 * @returns {string[]} a list of variable names that include the module
 */
export function detectVariablesWithModule(tree: Tree, rootDir: string, module: Module): string[] {
  return detectVariablesWithIdentifier(tree, rootDir, module.name)
}

```


File : detect-variables-with-provider.utils.ts
```ts
import { Tree } from '@nx/devkit'
import { detectVariablesWithIdentifier } from '../../../utils/detection/detect-variables-with-identifier.utils'
import { Provider } from '../../model/provider.model'

/**
 * Detects variables that include the Angular provider.
 * @param tree - the file tree to search in
 * @param rootDir - the directory to start searching from
 * @param provider - the provider to search for
 * @returns {string[]} a list of variable names that include the provider
 */
export function detectVariablesWithProvider(tree: Tree, rootDir: string, provider: Provider): string[] {
  return detectVariablesWithIdentifier(tree, rootDir, provider.name)
}

```





********************************************************************************************************************************

Folder => onecx-portal-ui-libs > libs > nx-migration-utils > src > lib > angular > utils > modification

File :  add-provider-import-if-does-not-exist.utils.ts
```ts
import { Tree } from '@nx/devkit'
import { Provider } from '../../model/provider.model'
import { isProviderImportInFile } from '../validation/is-provider-import-in-file.utils'
import { addProviderImportInFile } from './add-provider-import-in-file.utils'

/**
 * Modify the file content so the import for Angular provider exists if it was not present already.
 * @param tree - the file tree used for file content reading
 * @param filePath - the path to a file to validate and update
 * @param provider - angular provider to import
 */
export function addProviderImportIfDoesNotExist(tree: Tree, filePath: string, provider: Provider) {
  const fileContent = tree.read(filePath, 'utf-8')
  if (!fileContent) return

  let updatedFileContent = fileContent

  if (!isProviderImportInFile(updatedFileContent, provider)) {
    updatedFileContent = addProviderImportInFile(updatedFileContent, provider)
  }

  if (fileContent !== updatedFileContent) {
    tree.write(filePath, updatedFileContent)
  }
}

```


File : add-provider-import-in-file.utils.ts
```ts
import { addNewImport } from '../../../utils/modification/add-new-import.utils'
import { addToFirstImport } from '../../../utils/modification/add-to-first-import.utils'
import { isImportInContent } from '../../../utils/validation/is-import-in-content.utils'
import { isNamespaceImportInContent } from '../../../utils/validation/is-namespace-import-in-content.utils'
import { Provider } from '../../model/provider.model'

/**
 * Add the import for Angular provider in the file.
 * @param fileContent - the path to a file to modify
 * @param provider - angular provider to add
 * @returns {string} modified content of the file with provider imported
 */
export function addProviderImportInFile(fileContent: string, provider: Provider): string {
  if (isNamespaceImportInContent(fileContent, provider.importPath)) {
    return fileContent
  } else if (isImportInContent(fileContent, provider.importPath)) {
    return addToFirstImport(fileContent, provider.importPath, provider.name)
  } else {
    return addNewImport(fileContent, provider.importPath, [provider.name])
  }
}

```


File : add-provider-in -module-if-does-not-exist.utils.ts
```ts
import { Tree } from '@nx/devkit'
import { MatchingModule } from '../../model/matching-module.model'
import { Provider } from '../../model/provider.model'
import { isProviderInModule } from '../validation/is-provider-in-module.utils'
import { addProviderInModule } from './add-provider-in-module.utils'

/**
 * Modify content of the file with the given module so the import of Angular provider exists if it was not present already.
 * @param tree - the file tree used for file content reading
 * @param module - the module to modify
 * @param provider - the provider to include
 * @param variablesWithProvider - the list of variable names containing the provider to include
 */
export function addProviderInModuleIfDoesNotExist(
  tree: Tree,
  module: MatchingModule,
  provider: Provider,
  variablesWithProvider: string[]
) {
  const moduleFileConent = tree.read(module.filePath, 'utf-8')
  if (!moduleFileConent) return

  let updatedModuleFileContent = moduleFileConent

  if (!isProviderInModule(updatedModuleFileContent, module, provider, variablesWithProvider)) {
    updatedModuleFileContent = addProviderInModule(updatedModuleFileContent, module, provider)
  }

  if (moduleFileConent !== updatedModuleFileContent) {
    tree.write(module.filePath, updatedModuleFileContent)
  }
}

```


File : add-provider-in-module.utils.ts
```ts
import { replace } from '@phenomnomnominal/tsquery'
import { ArrayLiteralExpression, ScriptKind } from 'typescript'
import { MatchingModule } from '../../model/matching-module.model'
import { Provider } from '../../model/provider.model'
import { moduleProvidersArrayPattern } from '../patterns.utils'

/**
 * Add the provider to the providers list of the module.
 * @param fileContent - the content of the file the module is used in
 * @param module - the module to modify
 * @param provider - the provider to add
 * @returns {string} modified content of the file with provider included in the module
 */
export function addProviderInModule(fileContent: string, module: MatchingModule, provider: Provider): string {
  const newContent = replace(
    fileContent,
    moduleProvidersArrayPattern(module.name),
    (node) => {
      // Prepare provider call expression
      const providerExpressionString = `${provider.name}()`

      // Prepare new providers array
      const aleNode = node as ArrayLiteralExpression
      const newExpressionArray: string[] = [
        ...aleNode.elements.map((expresion) => expresion.getText()),
        providerExpressionString,
      ]
      // Return text for new providers array
      return `[${newExpressionArray.join(',')}]`
    },
    ScriptKind.TS
  )

  return newContent
}

```





********************************************************************************************************************************

Folder => onecx-portal-ui-libs > libs > nx-migration-utils > src > lib > angular > utils > validation

File : is-provider-import-in-file.utils.ts
```ts
import { ast, query } from '@phenomnomnominal/tsquery'
import { Provider } from '../../model/provider.model'
import { providerImportPattern } from '../patterns.utils'
import { importNamespacePattern } from '../../../utils/patterns.utils'
import { ImportDeclaration } from 'typescript'

/**
 * Checks if file imports the Angular provider
 * @param fileContent - the path to a file to check
 * @param provider - angular provider to check
 * @returns {boolean} if the Angular provider is imported in file
 */
export function isProviderImportInFile(fileContent: string, provider: Provider): boolean {
  const contentAst = ast(fileContent)

  const allPatterns = [providerImportPattern(provider), importNamespacePattern(provider.importPath)].join(', ')
  const providerImports = query<ImportDeclaration>(contentAst, allPatterns)

  return providerImports.length > 0
}
```


File : is-provider-in-module.utils.ts
```ts
import { ast, query } from '@phenomnomnominal/tsquery'
import { ClassDeclaration } from 'typescript'
import { MatchingModule } from '../../model/matching-module.model'
import { Provider } from '../../model/provider.model'
import { moduleProviderIdentifierPattern } from '../patterns.utils'

/**
 * Checks if the Angular module include the provider in the providers list.
 * @param fileContent - the content of the file the module is used in
 * @param module - the module to check
 * @param provider - the provider to check
 * @param variablesWithProvider - the list of variable names containing the provider to check
 * @returns {boolean} if the module includes the provider
 */
export function isProviderInModule(
  fileContent: string,
  module: MatchingModule,
  provider: Provider,
  variablesWithProvider: string[]
): boolean {
  const contentAst = ast(fileContent)

  const directProviderPattern = moduleProviderIdentifierPattern(module.name, provider.name)
  const provideViaVariablePatterns = variablesWithProvider.map((name) =>
    moduleProviderIdentifierPattern(module.name, name)
  )
  const allPatterns = [...provideViaVariablePatterns, directProviderPattern].join(', ')
  const modulesWithProvider = query<ClassDeclaration>(contentAst, allPatterns)

  return modulesWithProvider.length > 0
}
```






********************************************************************************************************************************

Folder => onecx-portal-ui-libs > libs > nx-migration-utils > src > lib > migrations

File : common-migrate-onecx-to-v6.utils.ts
```ts

import {
  addDependenciesToPackageJson,
  formatFiles,
  readJson,
  removeDependenciesFromPackageJson,
  Tree,
  updateJson,
  visitNotIgnoredFiles,
  writeJson,
} from '@nx/devkit'
import { execSync } from 'child_process'
import { detectMethodCallsInFiles } from '../utils/detect-method-calls-in-files.utils'

import { replaceTagInAngularTemplates } from '../angular/html-templates.utils'
import { removeParameters } from '../angular/parameters.utils'
import { replaceInFiles } from '../angular/replacement-in-files.utils'
import {
  removeImportsByModuleSpecifier,
  removeImportValuesFromModule,
  replaceImportModuleSpecifier,
  replaceImportValues,
  replaceImportValuesAndModule,
} from '../utils/import-statements.utils'
import { printWarnings } from '../utils/print-warnings.utils'
import { addGitignoreEntry, removeGitignoreEntry } from '../utils/update-gitignore.utils'
import { Module, Provider } from '../angular'
import { detectVariablesWithModule } from '../angular/utils/detection/detect-variables-with-module.utils'
import { detectModulesImportingModule } from '../angular/utils/detection/detect-modules-importing-module.utils'
import { detectVariablesWithProvider } from '../angular/utils/detection/detect-variables-with-provider.utils'
import { addProviderInModuleIfDoesNotExist } from '../angular/utils/modification/add-provider-in-module-if-does-not-exist.utils'
import { addProviderImportIfDoesNotExist } from '../angular/utils/modification/add-provider-import-if-does-not-exist.utils'
import { hasHtmlTag } from '../utils/validation/has-html-tag.utils'
import { updateJsonFiles } from '../utils/modification/update-json-files.utils'
import { removeReferences } from '../utils/modification/remove-json-references.utils'
import { updateStyleSheets } from '../utils/modification/update-style-sheets.utils'
import replacePortalIntegrationAngularImports from '../migrations/v6/replace-pia-imports'
import replacePortalCoreModule from '../migrations/v6/replace-portal-core-module'
import removePortalIntegrationAngularImports from '../migrations/v6/remove-pia-imports'

const PORTAL_LAYOUT_STYLES = '@onecx/portal-layout-styles'

export async function commonMigrateOnecxToV6(tree: Tree) {
  const rootPath = tree.root
  const srcDirectoryPath = 'src'
  removeDependenciesFromPackageJson(tree, ['@nx/angular', '@nx/devkit', '@nx/plugin'], ['eslint-plugin-deprecation'])
  addDependenciesToPackageJson(
    tree,
    { '@primeng/themes': '^19.0.6' },
    { '@nx/angular': '~20.3.4', '@nx/devkit': '~20.3.4', '@nx/plugin': '~20.3.4' }
  )
  replaceStandaloneShellInPackage(tree)

  updateJson(tree, `package.json`, (json) => {
    const angularDependencies = Object.keys(json.dependencies).filter((dep) => dep.startsWith('@angular/'))
    const onecxDependencies = Object.keys(json.dependencies).filter((dep) => dep.startsWith('@onecx/'))
    const ngrxDependencies = Object.keys(json.dependencies).filter((dep) => dep.startsWith('@ngrx/'))
    const angularDevDependencies = Object.keys(json.devDependencies).filter((dep) => dep.startsWith('@angular/'))
    const nxDevDependencies = Object.keys(json.devDependencies).filter((dep) => dep.startsWith('@nx/'))

    const dependenciesToUpdate: Record<string, string> = {
      '@angular/cdk': '^19.0.5',
      '@onecx/nx-plugin': '^1.10.0',
      '@ngx-translate/core': '^16.0.4',
      'keycloak-angular': '^19.0.2',
      'ngrx-store-localstorage': '^19.0.0',
      primeng: '^19.1.0',
      rxjs: '~7.8.2',
      zod: '^3.24.2',
      'zone.js': '~0.15.0',
    }

    const devDependenciesToUpdate: Record<string, string> = {
      '@angular-devkit/core': '^19.0.0',
      '@angular-devkit/schematics': '^19.0.0',
      '@angular/cli': '~19.0.0',
      '@angular-eslint/eslint-plugin': '^19.2.0',
      '@angular-eslint/eslint-plugin-template': '^19.2.0',
      '@angular-eslint/template-parser': '^19.2.0',
      '@angular/compiler-cli': '^19.0.0',
      '@angular/language-service': '^19.0.0',
      '@eslint/js': '^9.9.1',
      '@openapitools/openapi-generator-cli': '^2.16.3',
      '@schematics/angular': '~19.0.0',
      '@swc-node/register': '~1.10.9',
      '@swc/core': '~1.10.18',
      '@swc/helpers': '~0.5.15',
      '@types/jest': '^29.5.14',
      '@types/node': '^22.13.4',
      '@typescript-eslint/eslint-plugin': '^8.25.0',
      '@typescript-eslint/parser': '^8.25.0',
      '@typescript-eslint/utils': '^8.13.0',
      'angular-eslint': '^19.2.0',
      eslint: '^9.9.1',
      'eslint-config-prettier': '^9.1.0',
      'eslint-plugin-import': '^2.31.0',
      jest: '^29.7.0',
      'jest-environment-jsdom': '^29.7.0',
      'jest-preset-angular': '~14.5.1',
      nx: '~20.3.4',
      prettier: '^3.5.1',
      'ts-jest': '^29.2.5',
      'ts-node': '^10.9.2',
      tslib: '^2.8.1',
      'typescript-eslint': '^8.13.0',
    }

    angularDependencies.forEach((dep) => {
      json.dependencies[dep] = '^19.0.7'
    })
    onecxDependencies.forEach((dep) => {
      json.dependencies[dep] = '^6.0.0'
    })
    ngrxDependencies.forEach((dep) => {
      json.dependencies[dep] = '^19.0.1'
    })
    angularDevDependencies.forEach((dep) => {
      json.devDependencies[dep] = '~19.0.0'
    })
    nxDevDependencies.forEach((dep) => {
      json.devDependencies[dep] = '~20.3.4'
    })

    Object.keys(dependenciesToUpdate).forEach((dep) => {
      if (json.dependencies[dep]) {
        json.dependencies[dep] = dependenciesToUpdate[dep]
      }
    })

    Object.keys(devDependenciesToUpdate).forEach((dep) => {
      if (json.devDependencies[dep]) {
        json.devDependencies[dep] = devDependenciesToUpdate[dep]
      }
    })

    return json
  })

  addGitignoreEntry(tree, '/src/app/shared/generated')

  execSync('npm run apigen', {
    cwd: rootPath,
    stdio: 'inherit',
  })

  removeOnecxKeycloakAuth(tree, srcDirectoryPath)
  removeOnecxPortalLayoutStyles(tree)
  migrateApiConfigProviderUtils(tree, srcDirectoryPath)
  migrateFilterTypes(tree, srcDirectoryPath)
  migrateFastDeepEqualImport(tree, srcDirectoryPath)
  migratePrimeng(tree)
  migratePrimeNgCalendar(tree, srcDirectoryPath)
  migrateStandaloneShell(tree, srcDirectoryPath)

  warnUserServiceHasPermission(tree, srcDirectoryPath)
  warnOcxPortalViewport(tree, srcDirectoryPath)

  removePortalIntegrationAngular(tree, srcDirectoryPath)

  await formatFiles(tree)

  removeGitignoreEntry(tree, '/src/app/shared/generated')
}

function removeOnecxKeycloakAuth(tree: Tree, directoryPath: string) {
  removeDependenciesFromPackageJson(tree, ['@onecx/keycloak-auth'], [])

  removeImportsByModuleSpecifier(tree, directoryPath, '@onecx/keycloak-auth')

  const webpackConfigJsPath = 'webpack.config.js'
  const webpackConfigJsContent = tree.read(webpackConfigJsPath, 'utf-8')

  if (webpackConfigJsContent) {
    const updatedContent = webpackConfigJsContent.replace(
      /'@onecx\/keycloak-auth':\s*{\s*requiredVersion:\s*'auto',\s*includeSecondaries:\s*true\s*,?\s*},?/g,
      ''
    )

    tree.write(webpackConfigJsPath, updatedContent)
  } else {
    console.error('Cannot find webpack.config.js')
  }

  const keycloakModuleQuery = `Identifier[name="KeycloakAuthModule"]`
  replaceInFiles(tree, directoryPath, keycloakModuleQuery, '')
}

function removeOnecxPortalLayoutStyles(tree: Tree) {
  const warning =
    '⚠️ @onecx/portal-layout-styles library was removed. Please make sure that all references are removed and the application is not relying on @onecx/portal-layout-styles style sheets.'

  const warnOptions = {
    warn: true,
    warning,
    contentCondition: PORTAL_LAYOUT_STYLES,
  }

  const rootPath = '.'

  removeDependenciesFromPackageJson(tree, [PORTAL_LAYOUT_STYLES], [])

  removeOnecxPortalLayoutStylesImportsFromStyleSheets(tree, rootPath, warnOptions)

  removeOnecxPortalLayoutStylesFromJsonFiles(tree, rootPath, warnOptions)

  removeOnecxPortalLayoutStylesFromWebpack(tree)
}

function migratePrimeng(tree: Tree) {
  const projectJsonPath = 'project.json'
  const projectJson = readJson(tree, projectJsonPath)

  if (projectJson.targets.build.options.styles) {
    projectJson.targets.build.options.styles = projectJson.targets.build.options.styles.filter(
      (style: string) => style !== 'node_modules/primeng/resources/primeng.min.css'
    )
  } else {
    console.error('Cannot find styles array in project.json or project.json itself')
  }

  writeJson(tree, projectJsonPath, projectJson)

  replaceImportValuesAndModule(tree, 'src', [
    {
      oldModuleSpecifier: 'primeng/api',
      newModuleSpecifier: 'primeng/config',
      valueReplacements: [{ oldValue: 'PrimeNGConfig', newValue: 'PrimeNG' }],
    },
  ])

  const primengConfigClassQuery = `Identifier[name="PrimeNGConfig"]`
  replaceInFiles(tree, 'src', primengConfigClassQuery, 'PrimeNG')
}

function migrateApiConfigProviderUtils(tree: Tree, directoryPath: string) {
  const searchQuery = `NewExpression:has(Identifier[name="PortalApiConfiguration"])`

  removeImportValuesFromModule(
    tree,
    directoryPath,
    '@onecx/portal-integration-angular',
    ['AppStateService', 'ConfigurationService'],
    searchQuery
  )

  removeParameters(tree, directoryPath, ['ConfigurationService', 'AppStateService'], searchQuery)
}

function migrateFilterTypes(tree: Tree, directoryPath: string) {
  const queryFiltertypeTruthy = 'PropertyAccessExpression:has(Identifier[name="FilterType"]) Identifier[name="TRUTHY"]'
  replaceInFiles(tree, directoryPath, queryFiltertypeTruthy, 'IS_NOT_EMPTY')
}

function migrateFastDeepEqualImport(tree: Tree, directoryPath: string) {
  replaceImportValues(tree, directoryPath, 'fast-deep-equal', ['equal'], 'equal')
  removeDependenciesFromPackageJson(tree, ['fast-deep-equal'], [])
}

function migratePrimeNgCalendar(tree: Tree, directoryPath: string) {
  replaceImportValuesAndModule(tree, directoryPath, [
    {
      oldModuleSpecifier: 'primeng/calendar',
      newModuleSpecifier: 'primeng/datepicker',
      valueReplacements: [
        { oldValue: 'Calendar', newValue: 'DatePicker' },
        { oldValue: 'CalendarModule', newValue: 'DatePickerModule' },
      ],
    },
  ])

  const calendarQuery = `PropertyDeclaration > Decorator > CallExpression:has(Identifier[name="ViewChildren"]) Identifier[name="Calendar"], TypeReference > Identifier[name="Calendar"]`
  replaceInFiles(tree, directoryPath, calendarQuery, 'DatePicker')

  const calendarModuleQuery = `Identifier[name="CalendarModule"]`
  replaceInFiles(tree, directoryPath, calendarModuleQuery, 'DatePickerModule')

  replaceTagInAngularTemplates(tree, directoryPath, 'p-calendar', 'p-datepicker')
}

function warnUserServiceHasPermission(tree: Tree, srcDirectoryPath: string) {
  const warningHasPermissionCalls =
    '⚠️ UserService hasPermission is now asynchronous. Please adapt the usages accordingly, so that they are handled asynchronously.'
  const detectedMethodCalls = detectMethodCallsInFiles(tree, srcDirectoryPath, 'hasPermission', 'UserService')

  if (detectedMethodCalls.size > 0) {
    printWarnings(warningHasPermissionCalls, Array.from(detectedMethodCalls.keys()))
  }
}

function warnOcxPortalViewport(tree: Tree, directoryPath: string) {
  const foundInFiles: string[] = []
  const warning =
    '⚠️ ocx-portal-viewport was removed. Please refer to the standalone guide for adaptations: https://onecx.github.io/docs/guides/current/angular/migrations/enable-standalone/index.html'

  visitNotIgnoredFiles(tree, directoryPath, (filePath) => {
    if (hasHtmlTag(tree, filePath, 'ocx-portal-viewport')) {
      foundInFiles.push(filePath)
      printWarnings(warning, foundInFiles)
    }
  })
}

function removeOnecxPortalLayoutStylesFromJsonFiles(
  tree: Tree,
  dirPath: string,
  options?: { warn: boolean; warning: string; contentCondition: string }
) {
  updateJsonFiles(tree, dirPath, (json: any) => removeReferences(json, PORTAL_LAYOUT_STYLES), options)
}

function removeOnecxPortalLayoutStylesImportsFromStyleSheets(
  tree: Tree,
  dirPath: string,
  options?: { warn: boolean; warning: string; contentCondition: string }
) {
  updateStyleSheets(
    tree,
    dirPath,
    (root) => {
      root.walkAtRules('import', (atRule) => {
        if (atRule.params.includes(PORTAL_LAYOUT_STYLES)) {
          atRule.remove()
        }
      })

      return root.toString()
    },
    options
  )
}

function removeOnecxPortalLayoutStylesFromWebpack(tree: Tree) {
  const webpackConfigJsPath = 'webpack.config.js'
  const webpackConfigJsContent = tree.read(webpackConfigJsPath, 'utf-8')

  if (webpackConfigJsContent) {
    const updatedContent = webpackConfigJsContent.replace(
      /'@onecx\/portal-layout-styles':\s*{\s*requiredVersion:\s*'auto',\s*includeSecondaries:\s*true\s*,?\s*},?/g,
      ''
    )

    tree.write(webpackConfigJsPath, updatedContent)
  }
}

function replaceStandaloneShellInPackage(tree: Tree) {
  removeDependenciesFromPackageJson(tree, ['@onecx/standalone-shell'], [])
  addDependenciesToPackageJson(tree, { '@onecx/angular-standalone-shell': '^6.0.0' }, {})
}

function migrateStandaloneShell(tree: Tree, dirPath: string) {
  replaceStandaloneShellImport(tree, dirPath)
  provideStandaloneProvidersIfModuleUsed(tree, dirPath)
}

function replaceStandaloneShellImport(tree: Tree, dirPath: string) {
  const standaloneShell = '@onecx/standalone-shell'
  const angularStandaloneShell = '@onecx/angular-standalone-shell'
  replaceImportModuleSpecifier(tree, dirPath, standaloneShell, angularStandaloneShell)
  const webpackConfigJsContent = tree.read('webpack.config.js', 'utf-8')
  if (webpackConfigJsContent) {
    const updatedContent = webpackConfigJsContent.replace(standaloneShell, angularStandaloneShell)
    tree.write('webpack.config.js', updatedContent)
  } else {
    console.error('Cannot find webpack.config.js')
  }
}

function provideStandaloneProvidersIfModuleUsed(tree: Tree, dirPath: string) {
  const module: Module = {
    name: 'StandaloneShellModule',
  }
  const provider: Provider = {
    name: 'provideStandaloneProviders',
    importPath: '@onecx/angular-standalone-shell',
  }

  const variablesWithModule = detectVariablesWithModule(tree, dirPath, module)
  const modules = detectModulesImportingModule(tree, dirPath, module, variablesWithModule)
  const variablesWithProvider = detectVariablesWithProvider(tree, dirPath, provider)
  modules.forEach((moduleName) => {
    addProviderInModuleIfDoesNotExist(tree, moduleName, provider, variablesWithProvider)
    addProviderImportIfDoesNotExist(tree, moduleName.filePath, provider)
  })
}

function removePortalIntegrationAngular(tree: Tree, dirPath: string) {
  replacePortalCoreModule(tree, dirPath)
  replacePortalIntegrationAngularImports(tree, dirPath)
  removePortalIntegrationAngularImports(tree, dirPath)
}
```







********************************************************************************************************************************

Folder => onecx-portal-ui-libs > libs > nx-migration-utils > src > lib > utils


File : detect-method-calls-in-files.ts
```ts
import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query } from '@phenomnomnominal/tsquery'
import { CallExpression, isBinaryExpression, isCallExpression, isExpressionStatement, isIdentifier, isPropertyAccessExpression, isPropertyDeclaration, isVariableDeclaration, SourceFile, SyntaxKind } from 'typescript'

type MatchingMethodCalls = Map<string, CallExpression[]>
type DeclarationType = 'PropertyDeclaration' | 'VariableDeclaration'

function getDeclarationNames(contentAst: SourceFile, className: string, type: DeclarationType): string[] {
  const declarations = query(
    contentAst,
    `${type}:has(NewExpression > Identifier[name="${className}"])`
  )
  const memberNames = declarations.map((node) => {
    if ((type === 'VariableDeclaration' && isVariableDeclaration(node)) || (type === 'PropertyDeclaration' && isPropertyDeclaration(node))) {
      return node.name.getText()
    }
    throw new Error(`Node is not a ${type}`)
  })

  return memberNames
}

function getAssignmentNames(contentAst: SourceFile, className: string): string[] {
  const assignments = query(
    contentAst,
    `ExpressionStatement:has(BinaryExpression:has(EqualsToken):has(NewExpression > Identifier[name="${className}"]))`
  )
  const assignmentNames = assignments.map((node) => {
    if (isExpressionStatement(node)) {
      const binaryExpression = node.expression
      if (isBinaryExpression(binaryExpression)) {
        if (binaryExpression.operatorToken.kind == SyntaxKind.EqualsToken) {
          if(isPropertyAccessExpression(binaryExpression.left)) {
            return binaryExpression.left.name.escapedText.toString()
          } else if (isIdentifier(binaryExpression.left)) {
            return binaryExpression.left.escapedText.toString()
          } else {
            throw new Error('Node is not a PropertyAccessExpression or Identifier')
          }
        }
      }
    }
    throw new Error('Node is not an ExpressionStatement')
  })

  return assignmentNames
}

function getIdentifierCallQueries(contentAst: SourceFile, className: string, methodName: string): string[] {
  const variableNames = getDeclarationNames(contentAst, className, 'VariableDeclaration')

  const memberNames = getDeclarationNames(contentAst, className, 'PropertyDeclaration')

  const assignmentNames = getAssignmentNames(contentAst, className);

  const allIdentifiers = [...variableNames, ...memberNames, ...assignmentNames]

  // Only check variables once, even if their value is set multiple times
  const distinctIdentifiers = Array.from(new Set(allIdentifiers))

  const identifierCallPatterns = distinctIdentifiers.map(
    (name) =>
      `CallExpression:has(PropertyAccessExpression > Identifier[name="${name}"]):has(Identifier[name="${methodName}"])`
  )

  return identifierCallPatterns
}

export function detectMethodCallsInFiles(
  tree: Tree,
  rootDir: string,
  methodName: string,
  className: string
): MatchingMethodCalls {
  const matchingFiles: MatchingMethodCalls = new Map()

  // Look at each file inside of specified rootDir or any of its subdirectories that isn't gitignored
  visitNotIgnoredFiles(tree, rootDir, (file) => {
    const content = tree.read(file, 'utf-8')
    if (!content) return
    const contentAst = ast(content)

    // Queries for method calls on identifiers (e.g. x.method() or this.x.method())
    const identifierCallPatterns = getIdentifierCallQueries(contentAst, className, methodName)

    // Query for inline method calls (e.g. new ClassName().method())
    const inlineCallPattern = `CallExpression:has(NewExpression > Identifier[name="${className}"]):has(Identifier[name="${methodName}"])`

    const allPatterns = [...identifierCallPatterns, inlineCallPattern].join(', ')

    // Search for all elements matching computed queries
    let potentialMethodCalls: CallExpression[] = query(contentAst, allPatterns)

    // If no potential method calls are found, file can be ignored
    if (potentialMethodCalls.length === 0) return

    // Ensure that all detected method calls are indeed CallExpressions and filter out any other types
    potentialMethodCalls = potentialMethodCalls.filter((node) => isCallExpression(node))
    matchingFiles.set(file, potentialMethodCalls)
  })

  return matchingFiles
}

```


File : detect-method-calls-in-files.utils.ts
```ts
import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query } from '@phenomnomnominal/tsquery'
import {
  CallExpression,
  isBinaryExpression,
  isCallExpression,
  isExpressionStatement,
  isIdentifier,
  isParameter,
  isPropertyAccessExpression,
  isPropertyDeclaration,
  isVariableDeclaration,
  SourceFile,
  SyntaxKind,
} from 'typescript'

type MatchingMethodCalls = Map<string, CallExpression[]>
type DeclarationType = 'PropertyDeclaration' | 'VariableDeclaration'

/**
 * Retrieves the names of all declarations that are of the specified type and contain a NewExpression (e.g., 'new MyClass()') with the specified class name.
 * @param contentAst The abstract syntax tree of the file to search in.
 * @param className The name of the class to search for (e.g. 'MyClass').
 * @param type The type of declaration to search for ('PropertyDeclaration' or 'VariableDeclaration').
 * @returns A string array of names of the declarations that match the criteria.
 */
function getDeclarationNames(contentAst: SourceFile, className: string, type: DeclarationType): string[] {
  const declarations = query(contentAst, `${type}:has(NewExpression > Identifier[name="${className}"])`)
  const memberNames = declarations.map((node) => {
    if (
      (type === 'VariableDeclaration' && isVariableDeclaration(node)) ||
      (type === 'PropertyDeclaration' && isPropertyDeclaration(node))
    ) {
      return node.name.getText()
    }
    throw new Error(`Node is not a ${type}`)
  })

  return memberNames
}

/**
 * Retrieves the names of all properties and variables that are assigned a value from a NewExpression (e.g., 'new MyClass()') with the specified class name.
 * @param contentAst The abstract syntax tree of the file to search in.
 * @param className The name of the class to search for (e.g. 'MyClass').
 * @returns A string array of names of the assignments that match the criteria.
 */
function getAssignmentNames(contentAst: SourceFile, className: string): string[] {
  const assignments = query(
    contentAst,
    `ExpressionStatement:has(BinaryExpression:has(EqualsToken):has(NewExpression > Identifier[name="${className}"]))`
  )
  const assignmentNames = assignments.map((node) => {
    if (isExpressionStatement(node)) {
      const binaryExpression = node.expression
      if (isBinaryExpression(binaryExpression)) {
        if (binaryExpression.operatorToken.kind == SyntaxKind.EqualsToken) {
          if (isPropertyAccessExpression(binaryExpression.left)) {
            return binaryExpression.left.name.escapedText.toString()
          } else if (isIdentifier(binaryExpression.left)) {
            return binaryExpression.left.escapedText.toString()
          } else {
            throw new Error('Node is not a PropertyAccessExpression or Identifier')
          }
        }
      }
    }
    throw new Error('Node is not an ExpressionStatement')
  })

  return assignmentNames
}

/**
 * Retrieves the names of all parameters that are of type className and constructor-based injections (e.g., myClass: MyClass).
 * @param contentAst The abstract syntax tree of the file to search in.
 * @param className The name of the class to search for (e.g. 'MyClass').
 * @returns A string array of names of the parameters that match the criteria.
 */
export function getParameterNames(contentAst: SourceFile, className: string): string[] {
  const parameters = query(contentAst, `Parameter:has(TypeReference:has(Identifier[name="${className}"]))`)

  const parameterNames = parameters.map((node) => {
    if (isParameter(node)) {
      return node.name.getText()
    }
    throw new Error('Node is not a Parameter')
  })

  return parameterNames
}

/**
 * Retrieves the names of all injections that are injected via the inject CallExpression (e.g., myService = inject(MyService)).
 * @param contentAst The abstract syntax tree of the file to search in.
 * @param className The name of the class to search for (e.g. 'MyClass').
 * @returns A string array of names of the injections that match the criteria.
 */
function getInjectionNames(contentAst: SourceFile, className: string): string[] {
  const injections = query(
    contentAst,
    `PropertyDeclaration:has(CallExpression:has(Identifier[name="inject"]) > Identifier[name="${className}"]), VariableDeclaration:has(CallExpression:has(Identifier[name="inject"]):has(Identifier[name="${className}"]))`
  )

  const injectionNames = injections.map((node) => {
    if (isPropertyDeclaration(node) || isVariableDeclaration(node)) {
      return node.name.getText()
    }
    throw new Error('Node is not a PropertyDeclaration')
  })

  return injectionNames
}

/**
 * Generates an array of computed queries to find method calls with a given method name on identifiers that are either variables or properties and type of the specified class.
 * @param contentAst The abstract syntax tree of the file to search in.
 * @param className The name of the class to search for (e.g. 'MyClass').
 * @param methodName The name of the method to search for (e.g. 'myMethod').
 * @returns A string array of computed queries to find method calls on identifiers.
 */
function getIdentifierCallQueries(contentAst: SourceFile, className: string, methodName: string): string[] {
  const variableNames = getDeclarationNames(contentAst, className, 'VariableDeclaration')

  const memberNames = getDeclarationNames(contentAst, className, 'PropertyDeclaration')

  const assignmentNames = getAssignmentNames(contentAst, className)

  const parameterNames = getParameterNames(contentAst, className)

  const injectionNames = getInjectionNames(contentAst, className)

  const allIdentifiers = [...variableNames, ...memberNames, ...assignmentNames, ...parameterNames, ...injectionNames]

  // Only check variables once, even if their value is set multiple times
  const distinctIdentifiers = Array.from(new Set(allIdentifiers))

  const identifierCallPatterns = distinctIdentifiers.map(
    (name) =>
      `CallExpression:has(PropertyAccessExpression > Identifier[name="${name}"]):has(Identifier[name="${methodName}"])`
  )

  return identifierCallPatterns
}

/**
 * Detects method calls with a given name on a specified class in files within a specified directory or its subdirectories.
 * @param tree The file tree to search in.
 * @param rootDir The directory to start searching from.
 * @param methodName The name of the method to search for (e.g. 'myMethod').
 * @param className The name of the class to search for (e.g. 'MyClass').
 * @returns A map where the keys are file paths and the values are arrays of CallExpression nodes representing the detected method calls in the respective files.
 */
export function detectMethodCallsInFiles(
  tree: Tree,
  rootDir: string,
  methodName: string,
  className: string
): MatchingMethodCalls {
  const matchingFiles: MatchingMethodCalls = new Map()

  // Look at each file inside of specified rootDir or any of its subdirectories that isn't gitignored
  visitNotIgnoredFiles(tree, rootDir, (file) => {
    const content = tree.read(file, 'utf-8')
    if (!content) return
    const contentAst = ast(content)

    // Queries for method calls on identifiers (e.g. x.method() or this.x.method())
    const identifierCallPatterns = getIdentifierCallQueries(contentAst, className, methodName)

    // Query for inline method calls (e.g. new ClassName().method())
    const inlineCallPattern = `CallExpression:has(NewExpression > Identifier[name="${className}"]):has(Identifier[name="${methodName}"])`

    const allPatterns = [...identifierCallPatterns, inlineCallPattern].join(', ')

    // Search for all elements matching computed queries
    let potentialMethodCalls: CallExpression[] = query(contentAst, allPatterns)

    // If no potential method calls are found, file can be ignored
    if (potentialMethodCalls.length === 0) return

    // Ensure that all detected method calls are indeed CallExpressions and filter out any other types
    potentialMethodCalls = potentialMethodCalls.filter((node) => isCallExpression(node))
    matchingFiles.set(file, potentialMethodCalls)
  })

  return matchingFiles
}

```


File : import-statements.utils.ts
```ts
import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query } from '@phenomnomnominal/tsquery'
import {
  createPrinter,
  factory,
  ImportDeclaration,
  ImportSpecifier,
  isNamedImports,
  isStringLiteral,
  NamedImports,
  NodeArray,
  SourceFile,
  Statement,
} from 'typescript'
import { fileMatchesQuery, isFilePath } from './typescript-files.utils'
import { replaceInFile, replaceInFiles } from '../angular/replacement-in-files.utils'

interface ImportValueReplacement {
  oldValue: string
  newValue: string
}

interface ModuleImportReplacement {
  oldModuleSpecifier: string
  newModuleSpecifier: string
  valueReplacements: ImportValueReplacement[]
}

interface ImportUpdateResult {
  updatedImportDeclaration: ImportDeclaration | null
  remainingImportDeclaration: ImportDeclaration | null
}

interface SplitImportSpecifiersResult {
  matchedSpecifiers: ImportSpecifier[]
  unmatchedSpecifiers: ImportSpecifier[]
}

/**
 * Removes all import statements (ESM or CommonJS) for a given module from TypeScript files in a directory.
 * @param tree - The Nx virtual file system tree.
 * @param directoryPath - Path to the directory containing TypeScript files.
 * @param moduleSpecifier - The module name whose import statements should be removed.
 */
export function removeImportsByModuleSpecifier(tree: Tree, directoryPath: string, moduleSpecifier: string) {
  const importModuleSpecifierQuery = `ImportDeclaration:has(StringLiteral[value="${moduleSpecifier}"]), VariableStatement:has(CallExpression:has(Identifier[name=require]):has(StringLiteral[value="${moduleSpecifier}"]))`

  try {
    replaceInFiles(tree, directoryPath, importModuleSpecifierQuery, '')
  } catch (error) {
    console.error(`Error removing imports by module specifier "${moduleSpecifier}" in ${directoryPath}: `, error)
  }
}

/**
 * Replaces the module specifier in import statements with a new module name.
 * @param tree - The Nx virtual file system tree.
 * @param directoryPath - Path to the directory containing TypeScript files.
 * @param oldModule - The current module name to be replaced.
 * @param newModule - The new module name to use in import statements.
 */
export function replaceImportModuleSpecifier(tree: Tree, directoryPath: string, oldModule: string, newModule: string) {
  const importModuleSpecifierQuery = `ImportDeclaration > StringLiteral[value="${oldModule}"], VariableStatement CallExpression:has(Identifier[name=require]) > StringLiteral[value="${oldModule}"]`

  try {
    replaceInFiles(tree, directoryPath, importModuleSpecifierQuery, `'${newModule}'`)
  } catch (error) {
    console.error(
      `Error replacing import module specifier from "${oldModule}" to "${newModule}" in ${directoryPath}: `,
      error
    )
  }
}

/**
 * Replaces specific named imports from a module with a new identifier
 * @param tree - The Nx virtual file system tree.
 * @param directoryOrFilePath - Path to a directory or a specific file.
 * @param moduleSpecifier - The module from which imports are being replaced.
 * @param oldImportValues - One or more named imports to replace.
 * @param newImportValue - The new identifier to replace the old named imports with.
 */
export function replaceImportValues(
  tree: Tree,
  directoryOrFilePath: string,
  moduleSpecifier: string,
  oldImportValues: string | string[],
  newImportValue: string
) {
  const values = Array.isArray(oldImportValues) ? oldImportValues : [oldImportValues]

  const combinedQuery = values
    .flatMap((value) => [
      `ImportDeclaration:has(StringLiteral[value="${moduleSpecifier}"]) ImportSpecifier:has(Identifier[name="${value}"])`,
      `NamespaceImport:has(Identifier[name="${value}"])`,
      `ImportClause > Identifier[name="${value}"]`,
    ])
    .join(', ')

  try {
    if (isFilePath(directoryOrFilePath)) {
      replaceInFile(tree, directoryOrFilePath, combinedQuery, newImportValue)
    } else {
      replaceInFiles(tree, directoryOrFilePath, combinedQuery, newImportValue)
    }
  } catch (error) {
    console.error(`Error replacing import values in "${directoryOrFilePath}": `, error)
  }
}

/**
 * Removes specific named imports from a module by replacing them with an empty string.
 * @param tree - The Nx virtual file system tree.
 * @param directoryPath - Path to the directory containing TypeScript files.
 * @param moduleSpecifier - The module from which to remove imports.
 * @param importValuesToRemove - One or more named imports to remove.
 * @param filterQuery - Optional custom string query to filter files before applying changes.
 * This can be used to limit the operation to files containing specific content (e.g., a class name or decorator).
 */
export function removeImportValuesFromModule(
  tree: Tree,
  directoryPath: string,
  moduleSpecifier: string,
  importValuesToRemove: string | string[],
  filterQuery?: string
) {
  const importValueRemovals = (Array.isArray(importValuesToRemove) ? importValuesToRemove : [importValuesToRemove]).map(
    (value) => ({
      oldValue: value,
      newValue: '',
    })
  )

  try {
    replaceImportValuesAndModule(
      tree,
      directoryPath,
      [
        {
          oldModuleSpecifier: moduleSpecifier,
          newModuleSpecifier: moduleSpecifier,
          valueReplacements: importValueRemovals,
        },
      ],
      filterQuery
    )
  } catch (error) {
    console.error(`Error removing import values from module "${moduleSpecifier}" in ${directoryPath}: `, error)
  }
}

/**
 * Replaces both import values and module names in TypeScript files.
 * @param tree - The Nx virtual file system tree.
 * @param directoryPath - Directory to search for files.
 * @param importReplacements - List of import module and value replacements.
 * @param filterQuery - Optional query to filter files before applying changes.
 */
export function replaceImportValuesAndModule(
  tree: Tree,
  directoryPath: string,
  importReplacements: ModuleImportReplacement[],
  filterQuery?: string
) {
  visitNotIgnoredFiles(tree, directoryPath, (filePath) => {
    if (!filePath.endsWith('.ts')) return

    try {
      const fileContent = tree.read(filePath, 'utf-8')
      if (!fileContent) return

      const updatedContent = replaceImportsInFile(fileContent, importReplacements, filterQuery)
      if (updatedContent && updatedContent !== fileContent) {
        tree.write(filePath, updatedContent)
      }
    } catch (error) {
      console.error(`Error replacing/removing ImportValue and ModuleName for file ${filePath}: `, error)
    }
  })
}

/**
 * Processes a file's AST to apply import replacements.
 * @param fileContent - The content of the file to process.
 * @param replacements - List of module and value replacements.
 * @param filterQuery - Optional custom string query to filter files before applying changes.
 * This can be used to limit the operation to files containing specific content (e.g., a class name or decorator).
 * @returns The updated file content, or null if no changes were made.
 */
export function replaceImportsInFile(
  fileContent: string,
  replacements: ModuleImportReplacement[],
  filterQuery?: string
): string | null {
  try {
    if (filterQuery && !fileMatchesQuery(fileContent, filterQuery)) {
      return null
    }

    let contentAst = ast(fileContent)
    let hasChanges = false

    for (const replacement of replacements) {
      const updatedContentAst = applyImportReplacement(contentAst, replacement)

      if (updatedContentAst) {
        contentAst = updatedContentAst
        hasChanges = true
      }
    }

    return hasChanges ? createPrinter().printFile(contentAst) : null
  } catch (error) {
    console.error('Error processing AST for import replacements: ', error)
    return null
  }
}

/**
 * Applies import replacements to a TypeScript AST.
 * @param contentAst - The AST of the source file.
 * @param replacement - The module and value replacement configuration.
 * @returns The updated AST, or null if no changes were made.
 */
export function applyImportReplacement(
  contentAst: SourceFile,
  replacement: ModuleImportReplacement
): SourceFile | null {
  try {
    const importDecl = findImportDeclaration(contentAst, replacement.oldModuleSpecifier)
    if (!importDecl?.importClause) {
      return null
    }

    const { updatedImportDeclaration, remainingImportDeclaration } = updateImportDeclaration(
      importDecl,
      replacement.valueReplacements,
      replacement.newModuleSpecifier
    )

    if (!updatedImportDeclaration && !remainingImportDeclaration) {
      const updatedStatements = factory.createNodeArray(contentAst.statements.filter((stmt) => stmt !== importDecl))
      return factory.updateSourceFile(contentAst, updatedStatements)
    }

    const updatedStatements = factory.createNodeArray(
      contentAst.statements.flatMap((statement): Statement[] => {
        if (statement === importDecl) {
          return [remainingImportDeclaration, updatedImportDeclaration].filter(
            (stmt): stmt is ImportDeclaration => stmt !== null
          )
        }
        return [statement]
      })
    )

    return factory.updateSourceFile(contentAst, updatedStatements)
  } catch (error) {
    console.error(`Error applying import replacement for module "${replacement.oldModuleSpecifier}": `, error)
    return null
  }
}

/**
 * Updates an import declaration by replacing specific named imports and updating the module specifier.
 * Only creates a new import if at least one named import is matched and replaced.
 * Remove import statement if all named imports are removed.
 * @param originalImport - The original import declaration node.
 * @param importValueReplacements - List of named import replacements.
 * @param newModuleName - The new module specifier.
 * @returns The updated import declaration, or the original if no replacements were made.
 */
export function updateImportDeclaration(
  originalImport: ImportDeclaration,
  importValueReplacements: ImportValueReplacement[],
  newModuleName: string
): ImportUpdateResult {
  const namedImports = getNamedImports(originalImport)
  if (!namedImports) {
    return { updatedImportDeclaration: null, remainingImportDeclaration: null }
  }

  const { matchedSpecifiers, unmatchedSpecifiers } = splitSpecifiers(namedImports.elements, importValueReplacements)

  const allRemoved = importValueReplacements.every((r) => r.newValue.trim() === '') && unmatchedSpecifiers.length === 0

  if (allRemoved) {
    return { updatedImportDeclaration: null, remainingImportDeclaration: null }
  }

  const updatedImportDeclaration = createUpdatedImport(matchedSpecifiers, newModuleName)
  const remainingImportDeclaration = createRemainingImport(
    unmatchedSpecifiers,
    namedImports.elements.length,
    newModuleName,
    originalImport
  )

  return { updatedImportDeclaration, remainingImportDeclaration }
}

/**
 * Creates an updated import declaration with matched specifiers.
 * When you want to move or rename specific named imports to a new module.
 * @param matchedSpecifiers - The matched import specifiers.
 * @param newModuleName - The new module specifier.
 * @returns The updated import declaration, or null if no specifiers were matched.
 *
 */
export function createUpdatedImport(
  matchedSpecifiers: ImportSpecifier[],
  newModuleName: string
): ImportDeclaration | null {
  return matchedSpecifiers.length > 0 ? buildImportDeclaration(matchedSpecifiers, newModuleName) : null
}

/**
 * Creates a remaining import declaration with unmatched specifiers.
 * If no unmatched specifiers remain, remove the entire import.
 * To preserve the parts of the import that are not being changed.
 * @param unmatchedSpecifiers - The unmatched import specifiers.
 * @param originalCount - The original count of specifiers.
 * @param newModuleName - The new module specifier.
 * @param originalImport - The original import declaration.
 * @returns The remaining import declaration, or null if no specifiers were unmatched.
 *
 */
export function createRemainingImport(
  unmatchedSpecifiers: ImportSpecifier[],
  originalCount: number,
  newModuleName: string,
  originalImport: ImportDeclaration
): ImportDeclaration | null {
  const originalModuleName = isStringLiteral(originalImport.moduleSpecifier) ? originalImport.moduleSpecifier.text : ''

  if (unmatchedSpecifiers.length === 0) {
    return null
  }

  if (unmatchedSpecifiers.length === originalCount && originalModuleName === newModuleName) {
    return originalImport
  }

  return buildImportDeclaration(unmatchedSpecifiers, originalModuleName)
}

/**
 * Constructs a new import declaration with the given specifiers and module name.
 * @param specifiers - The updated import specifiers.
 * @param moduleName - The new module specifier.
 * @returns A new ImportDeclaration node.
 */
export function buildImportDeclaration(specifiers: ImportSpecifier[], moduleName: string): ImportDeclaration | null {
  if (specifiers.length === 0) {
    return null
  }

  const namedImports = factory.createNamedImports(specifiers)
  const importClause = factory.createImportClause(false, undefined, namedImports)

  return factory.createImportDeclaration(undefined, importClause, factory.createStringLiteral(moduleName), undefined)
}

/**
 * Splits import specifiers into matched and unmatched based on replacements.
 * Separate import specifiers that need to be replaced from those that don't.
 * @param specifiers - The original import specifiers.
 * @param replacements - List of replacements to apply.
 * @returns An object containing matched and unmatched specifiers.
 */
export function splitSpecifiers(
  specifiers: NodeArray<ImportSpecifier>,
  replacements: ImportValueReplacement[]
): SplitImportSpecifiersResult {
  const matchedSpecifiers: ImportSpecifier[] = []
  const unmatchedSpecifiers: ImportSpecifier[] = []

  for (const specifier of specifiers) {
    const replacement = replacements.find((r) => r.oldValue === specifier.name.text)
    if (replacement) {
      if (replacement.newValue.trim()) {
        matchedSpecifiers.push(
          factory.createImportSpecifier(false, specifier.propertyName, factory.createIdentifier(replacement.newValue))
        )
      }
    } else {
      unmatchedSpecifiers.push(specifier)
    }
  }

  return { matchedSpecifiers, unmatchedSpecifiers }
}

/**
 * Extracts named imports from an import declaration.
 * @param importDeclaration - The import declaration node.
 * @returns The NamedImports node, if present.
 */
export function getNamedImports(importDeclaration: ImportDeclaration): NamedImports | undefined {
  try {
    const namedBindings = importDeclaration.importClause?.namedBindings
    if (namedBindings && isNamedImports(namedBindings)) {
      return namedBindings
    }
    console.warn('Named bindings are not of type NamedImports: ', namedBindings)
    return undefined
  } catch (error) {
    console.error('Error extracting named imports: ', error)
    return undefined
  }
}

/**
 * Finds the first import declaration for a given module name.
 * @param sourceFile - The TypeScript source file AST.
 * @param moduleName - The module name to search for.
 * @returns The matching ImportDeclaration node, if found.
 */
export function findImportDeclaration(sourceFile: SourceFile, moduleName: string): ImportDeclaration | undefined {
  try {
    return query(sourceFile, `ImportDeclaration:has(StringLiteral[value="${moduleName}"])`)[0] as ImportDeclaration
  } catch (error) {
    console.error(`Error finding import declaration for module "${moduleName}": `, error)
    return undefined
  }
}
```


File : patterns.utils.ts
```ts
// General patterns

/**
 * Creates a pattern to look for a variable containing the identifier
 * @param identifierName - identifier to look for
 * @returns {string} ast query pattern
 */
export function variableContainingIdentifierPattern(identifierName: string) {
  return `VariableDeclaration:has(Identifier[name=${identifierName}])`
}

// Import patterns

/**
 * Creates a pattern to look for import.
 * @param importPath - import path to look for
 * @returns {string} ast query pattern
 */
export function importPattern(importPath: string) {
  return `ImportDeclaration:has(StringLiteral[value=${importPath}])`
}

/**
 * Creates a pattern to look for namespace import (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#namespace_import).
 * @param importPath - import path to look for
 * @returns {string} ast query pattern
 */
export function importNamespacePattern(importPath: string) {
  return `ImportDeclaration:has(StringLiteral[value=${importPath}]):has(NamespaceImport)`
}

/**
 * Creates a pattern to look for named import (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#named_import).
 * @param importPath - import path to look for
 * @returns {string} ast query pattern
 */
export function importNamedImportsPattern(importPath: string) {
  return `${importPattern(importPath)} NamedImports`
}

/**
 * Creates a pattern to look for import specifier.
 * @param importPath - import path to look for
 * @param specifier - specifier to look for, e.g., "MyClass"
 * @returns {string} ast query pattern
 */
export function importSpecifierPattern(importPath: string, specifier: string): string {
  return `ImportDeclaration:has(StringLiteral[value=${importPath}]):has(ImportSpecifier:has(Identifier[name=${specifier}]))`
}
```


File : print-warnings.ts
```ts
import { logger } from '@nx/devkit'
export function printWarnings(warning: string, affectedFiles: string[]) {
    if (affectedFiles.length > 0) {
        logger.warn(warning)
        logger.warn(`Found in:`)
        affectedFiles.forEach((file) => {
          logger.warn(`  - ${file}`)
        })
      }
} 
```


File : print-warnings.utils.ts
```ts
import { logger } from '@nx/devkit'

/**
 * Prints a warning message if there are affected files.
 * @param warning The warning message to print.
 * @param affectedFiles An array of affected file paths.
 */
export function printWarnings(warning: string, affectedFiles: string[]) {
  if (affectedFiles.length > 0) {
    logger.warn(`${warning} Found in: ${affectedFiles.join(',')}`)
  }
} 
```


File : typescript-files.utils.ts
```ts
import { ast, query, replace } from '@phenomnomnominal/tsquery'
import { extname, isAbsolute } from 'path'
import { createPrinter, EmitHint, factory, isArrayLiteralExpression, ScriptKind, SyntaxKind } from 'typescript'

/**
 * Checks if a file's content matches a given tsquery string.
 * @param fileContent - The content of the TypeScript file.
 * @param queryStr - A tsquery selector string.
 * @returns True if the file matches the query; otherwise, false.
 */
export function fileMatchesQuery(fileContent: string, queryStr: string): boolean {
  try {
    const contentAst = ast(fileContent)
    return query(contentAst, queryStr).length > 0
  } catch {
    return false
  }
}

/**
 * Removes empty slots (i.e., omitted expressions like `[1,,2]`) from all array literals
 * in a given TypeScript code string.
 * @param code - The TypeScript source code as a string.
 * @returns A new string with all empty array slots removed.
 */
export function removeEmptySlotsFromArrays(code: string): string {
  try {
    return replace(
      code,
      'ArrayLiteralExpression',
      (node) => {
        if (!isArrayLiteralExpression(node)) return null

        const elements = node.elements.filter((expression) => expression.kind !== SyntaxKind.OmittedExpression)

        if (elements.length === node.elements.length) return null

        const updatedArray = factory.updateArrayLiteralExpression(node, elements)
        return createPrinter().printNode(EmitHint.Unspecified, updatedArray, node.getSourceFile())
      },
      ScriptKind.TS
    )
  } catch (error) {
    console.error(`Failed to remove empty array slots: `, error)
    return code
  }
}

/**
 * Determines whether a given string is likely to represent a file path.
 * @param input - The input string to evaluate.
 * @returns `true` if the input appears to be a file path, otherwise `false`.
 */
export function isFilePath(input: string): boolean {
  const hasExtension = !!extname(input)
  const looksLikePath = input.includes('/') || isAbsolute(input)
  return hasExtension && looksLikePath
}

```


File : update-gitignore.utils.ts
```ts
import { Tree } from '@nx/devkit'

const normalizeLine = (line: string) => line.trim()

/**
 * Adds an entry to .gitignore if it doesn't already exist.
 */
export function addGitignoreEntry(tree: Tree, entry: string) {
  const gitignorePath = '.gitignore'
  const normalizedEntry = normalizeLine(entry)

  if (!tree.exists(gitignorePath)) {
    tree.write(gitignorePath, `${normalizedEntry}\n`)
    return
  }

  const content = tree.read(gitignorePath, 'utf-8')
  if (!content) return

  const lines = content.split('\n').map(normalizeLine)

  if (!lines.includes(normalizedEntry)) {
    const updatedContent = content.trimEnd() + `\n${normalizedEntry}\n`
    tree.write(gitignorePath, updatedContent)
  }
}

/**
 * Removes an entry from .gitignore if it exists.
 */
export function removeGitignoreEntry(tree: Tree, entry: string) {
  const gitignorePath = '.gitignore'
  const normalizedEntry = normalizeLine(entry)

  if (!tree.exists(gitignorePath)) return

  const content = tree.read(gitignorePath, 'utf-8')
  if (!content) return

  const lines = content.split('\n')

  const filteredLines = lines.filter((line) => normalizeLine(line) !== normalizedEntry)

  if (lines.length !== filteredLines.length) {
    tree.write(gitignorePath, filteredLines.join('\n') + '\n')
  }
}

```






********************************************************************************************************************************

Folder => onecx-portal-ui-libs > libs > nx-migration-utils > src > lib > utils > detection >


File : detect-variables-with-identifier.utils.ts
```ts
import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query } from '@phenomnomnominal/tsquery'
import { VariableDeclaration } from 'typescript'
import { variableContainingIdentifierPattern } from '../patterns.utils'

/**
 * Detects variables that include the identifier.
 * @param tree - the file tree to search in
 * @param rootDir - the directory to start searching from
 * @param identifierName - the name of the identifier to search for (e.g., 'MyClass')
 * @returns {string[]} a list of variable names that include the identifier
 */
export function detectVariablesWithIdentifier(tree: Tree, rootDir: string, identifierName: string): string[] {
  const variableNames = new Set<string>()
  visitNotIgnoredFiles(tree, rootDir, (file) => {
    const content = tree.read(file, 'utf-8')
    if (!content) return

    const contentAst = ast(content)

    // Query for import via a variable
    const names = query<VariableDeclaration>(contentAst, variableContainingIdentifierPattern(identifierName)).map(
      (node) => node.name.getText()
    )

    names.forEach((name) => variableNames.add(name))
  })

  return Array.from(variableNames)
}

```





********************************************************************************************************************************

Folder => onecx-portal-ui-libs > libs > nx-migration-utils > src > lib > utils > modification >


File : add-new-import.utils.ts
```ts
/**
 * Creates new import statement with given import specifiers.
 * @param fileContent - the content of the file to modify
 * @param importPath - import path to create
 * @param importSpecifiers - import specifiers to add, e.g. "myFunctionName"
 * @returns {string} new file content after modification
 */
export function addNewImport(fileContent: string, importPath: string, importSpecifiers: string[]) {
  return `import {${importSpecifiers.join(',')}} from '${importPath}'\n${fileContent}`
}

```


File : add-to-first-import.utils.ts
```ts
import { replace } from '@phenomnomnominal/tsquery'
import { importNamedImportsPattern } from '../patterns.utils'
import { NamedImports, ScriptKind } from 'typescript'

/**
 * Appends new importSpecifier to the named import (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#named_import).
 * @param fileContent - the content of the file to modify
 * @param importPath - import path to modify
 * @param importSpecifier - import specifier to add, e.g. "myFunctionName"
 * @returns {string} new file content after modification
 */
export function addToFirstImport(fileContent: string, importPath: string, importSpecifier: string) {
  return replace(
    fileContent,
    importNamedImportsPattern(importPath),
    (node) => {
      const niNode = node as NamedImports
      const newSpecifiers: string[] = Array.from(
        new Set([...niNode.elements.map((namedImport) => namedImport.getText()), importSpecifier])
      )
      return `{${newSpecifiers.join(',')}}`
    },
    ScriptKind.TS
  )
}

```


File : remove-import-specifier.utils.spec.ts
```ts
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import { removeImportSpecifierFromImport } from './remove-import-specifier.utils';

describe('removeImportSpecifierFromImport', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('removes a named import and leaves others intact', () => {
    const filePath = 'src/test.ts';
    tree.write(
      filePath,
      `import { testImport, testImport2 } from 'ngrx-accelerator';`
    );
    removeImportSpecifierFromImport(tree, filePath, 'ngrx-accelerator', 'testImport');
    const result = tree.read(filePath, 'utf-8');
    expect(result).toEqualIgnoringWhitespace(`import { testImport2 } from 'ngrx-accelerator';`)
  });

  it('removes the entire import if it was the only specifier', () => {
    const filePath = 'src/test2.ts';
    tree.write(
      filePath,
      `import { testImport } from 'ngrx-accelerator';
      export class Test {}
      `
    );
    removeImportSpecifierFromImport(tree, filePath, 'ngrx-accelerator', 'testImport');
    const result = tree.read(filePath, 'utf-8');
    expect(result).toEqualIgnoringWhitespace(`export class Test {}`)
  });

  it('does nothing if the specifier is not present', () => {
    const filePath = 'src/test3.ts';
    tree.write(
      filePath,
      `import { testImport2, testImport3 } from 'ngrx-accelerator';
      export class Test {}`
    );
    removeImportSpecifierFromImport(tree, filePath, 'ngrx-accelerator', 'testImport');
    const result = tree.read(filePath, 'utf-8');
    expect(result).toEqualIgnoringWhitespace(`import { testImport2, testImport3 } from 'ngrx-accelerator';
      export class Test {}`)
  });
});

```


File : remove-import-specifier.utils.ts
```ts
import { Tree } from "@nx/devkit";
import { ast, query, replace, ScriptKind } from "@phenomnomnominal/tsquery";
import { ImportDeclaration, isNamedImports } from "typescript";

/**
 * Removes a named import from a specific file and module, and deletes the import statement if it becomes empty (AST-based).
 * @param tree - The Nx virtual file system tree.
 * @param filePath - Path to the TypeScript file to update.
 * @param importPath - The module from which to remove the import.
 * @param specifier - The named import to remove.
 */
export function removeImportSpecifierFromImport(tree: Tree, filePath: string, importPath: string, specifier: string) {
  const fileContent = tree.read(filePath, 'utf-8');
  if (!fileContent) return;

  // Remove only the ImportSpecifier for the given specifier from the given importPath
  let updated = replace(
    fileContent,
    `ImportDeclaration:has(StringLiteral[value="${importPath}"]) ImportSpecifier:has(Identifier[name="${specifier}"])`,
    () => '',
    ScriptKind.TS
  );

  // AST: Remove the entire import if it is now empty
  const astSource = ast(updated);
  const importDecls = query(astSource, `ImportDeclaration:has(StringLiteral[value="${importPath}"])`);
  for (const decl of importDecls) {
  const importDecl = decl as ImportDeclaration;
  const namedBindings = importDecl.importClause?.namedBindings;
  if (namedBindings && isNamedImports(namedBindings) && namedBindings.elements.length === 0) {
    updated = replace(
      updated,
      `ImportDeclaration:has(StringLiteral[value="${importPath}"])`,
      () => '',
      ScriptKind.TS
    );
  }
}

  if (updated !== fileContent) {
    tree.write(filePath, updated);
  }
}
```


File : remove-json-references.utils.ts
```ts
/**
 * Recursively removes all values from an object, array, or string that contain a specific reference string.
 * - Strings containing the reference are removed.
 * - Arrays are filtered to exclude elements with the reference.
 * - Objects are deeply traversed and cleaned of any values containing the reference.
 *
 * @param obj - The input object, array, or string to process.
 * @param reference - The reference string to remove.
 * @returns A new object, array, or string with all matching references removed.
 */
export function removeReferences(obj: any, reference: string): any {
  if (typeof obj === 'string') {
    return obj.includes(reference) ? undefined : obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => removeReferences(item, reference)).filter((item) => item !== undefined)
  }

  if (typeof obj === 'object' && obj !== null) {
    const newObj: any = {}
    for (const key in obj) {
      const value = removeReferences(obj[key], reference)
      if (value !== undefined) {
        newObj[key] = value
      }
    }
    return newObj
  }

  // return type is always object (modified source object with removed reference)
  return obj
}

```


File : replace-tag-in-html.utils.ts
```ts
import { Tree } from '@nx/devkit'
import { parse } from 'node-html-parser'
import { hasHtmlTag } from '../validation/has-html-tag.utils'

/**
 * Modifies all occurrences of a specific tag name in an HTML string.
 * @param html - The HTML content as a string.
 * @param oldTagName - The tag name to replace.
 * @param newTagName - The new tag name to use.
 * @returns The modified HTML string.
 */
export function replaceTagInHtml(tree: Tree, html: string, oldTagName: string, newTagName: string): string {
  try {
    if (!hasHtmlTag(tree, html, oldTagName)) return html

    const root = parse(html)
    const elements = root.querySelectorAll(oldTagName)

    elements.forEach((element) => {
      element.tagName = newTagName
    })

    return root.toString()
  } catch (error) {
    console.error('Error modifying tag name in HTML: ', error)
    return html
  }
}

```


File : update-json-files.utils.ts
```ts
import { Tree, updateJson, visitNotIgnoredFiles } from '@nx/devkit'
import { printWarnings } from '../../utils/print-warnings.utils'

/**
 * Updates all JSON files within a specified directory using a provided updater function.
 * Optionally logs warnings if certain content conditions are met.
 *
 * @param tree - The Nx Tree (virtual file system).
 * @param dirPath - The directory path to search for JSON files.
 * @param updater - A function that receives the parsed JSON and returns the updated object.
 * @param options - Optional settings:
 *  - warn: Whether to print warnings.
 *  - warning: The warning message to display.
 *  - contentCondition: A string to match in file paths for triggering warnings.
 */
export function updateJsonFiles(
  tree: Tree,
  dirPath: string,
  updater: (json: any) => object,
  options?: { warn: boolean; warning: string; contentCondition: string }
) {
  const foundInFiles: string[] = []

  visitNotIgnoredFiles(tree, dirPath, (file) => {
    if (file.endsWith('.json')) {
      options && file.includes(options.contentCondition) && foundInFiles.push(file)
      updateJson(tree, file, updater)
    }
  })

  options?.warn && printWarnings(options.warning, foundInFiles)
}

```


File : update-style-sheet.utils.spec.ts
```ts
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'
import { updateStyleSheet } from './update-style-sheet.utils'

describe('updateStyleSheet', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('updates a CSS file using PostCSS', () => {
    const filePath = 'src/styles.css'
    tree.write(filePath, `body { color: black; }`)

    updateStyleSheet(tree, filePath, (root) => {
      root.walkDecls('color', (decl) => {
        decl.value = 'blue'
      })
      return root.toString()
    })

    const result = tree.read(filePath, 'utf-8')
    expect(result).toContain('color: blue')
  })

  it('compiles and updates a SCSS file with inline comment', () => {
    const filePath = 'src/styles.scss'
    tree.write(filePath, `$primary: red; body { color: $primary; } // some comment`)

    updateStyleSheet(tree, filePath, (root) => {
      root.walkDecls('color', (decl) => {
        decl.value = 'green'
      })
      return root.toString()
    })

    const result = tree.read(filePath, 'utf-8')
    expect(result).toContain('color: green')
  })

  it('compiles and updates SCSS with import', () => {
    const filePath = 'src/styles.scss'
    tree.write(
      filePath,
      `@import '/src/app/some_mixins.scss';
      $primary: red; body { color: $primary; }`
    )

    updateStyleSheet(tree, filePath, (root) => {
      root.walkDecls('color', (decl) => {
        decl.value = 'green'
      })
      return root.toString()
    })

    const result = tree.read(filePath, 'utf-8')
    expect(result).toContain('color: green')
  })

  it('does not write if content is unchanged', () => {
    const filePath = 'src/unchanged.css'
    const original = `body { margin: 0; }`
    tree.write(filePath, original)

    updateStyleSheet(tree, filePath, (root) => root.toString())

    const result = tree.read(filePath, 'utf-8')
    expect(result).toEqual(original)
  })
})

```


File : update-style-sheet.utils.ts
```ts
import { Tree } from '@nx/devkit'
import postcss from 'postcss'
import * as postcssScss from 'postcss-scss'
/**
 * Updates a stylesheet file using a provided PostCSS-based updater function.
 * Only writes changes if the updated content differs from the original.
 *
 * @param tree - The Nx Tree (virtual file system).
 * @param filePath - The path to the stylesheet file (e.g., .css, .scss).
 * @param updater - A function that receives the parsed PostCSS root and returns the updated stylesheet as a string.
 */
export function updateStyleSheet(tree: Tree, filePath: string, updater: (styleSheetContent: postcss.Root) => string) {
  const content = tree.read(filePath, 'utf-8')
  if (!content) return

  const root = filePath.endsWith('.scss') ? postcssScss.parse(content) : postcss.parse(content)

  const updatedContent = updater(root)

  if (updatedContent !== content) {
    tree.write(filePath, updatedContent)
  }
}

```


File : update-style-sheets.utils.ts
```ts
import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { printWarnings } from '../print-warnings.utils'
import { isStyleSheet } from '../validation/is-file-style-sheet.utils'
import { updateStyleSheet } from './update-style-sheet.utils'
import postcss from 'postcss'

/**
 * Updates all stylesheet files within a specified directory using a PostCSS-based updater function.
 * Only processes files that are identified as stylesheets (e.g., .css, .scss).
 * Optionally logs warnings if certain content conditions are met.
 *
 * @param tree - The Nx Tree (virtual file system).
 * @param dirPath - The directory path to search for stylesheet files.
 * @param updater - A function that receives the parsed PostCSS root and returns the updated stylesheet as a string.
 * @param options - Optional settings:
 *  - warn: Whether to print warnings.
 *  - warning: The warning message to display.
 *  - contentCondition: A string to match in file paths for triggering warnings.
 */
export function updateStyleSheets(
  tree: Tree,
  dirPath: string,
  updater: (styleSheetContent: postcss.Root) => string,
  options?: { warn: boolean; warning: string; contentCondition: string }
) {
  const foundInFiles: string[] = []

  visitNotIgnoredFiles(tree, dirPath, (file) => {
    if (isStyleSheet(file)) {
      options && file.includes(options.contentCondition) && foundInFiles.push(file)
      updateStyleSheet(tree, file, updater)
    }
  })

  options?.warn && printWarnings(options.warning, foundInFiles)
}

```





********************************************************************************************************************************

Folder => onecx-portal-ui-libs > libs > nx-migration-utils > src > lib > utils > validation >


File : has-html-tag.utils.ts
```ts
import { Tree } from '@nx/devkit'
import { parse } from 'node-html-parser'
import { isFilePath } from '../typescript-files.utils'

/**
 * Checks if a specific tag exists in HTML content or an HTML file using Nx Tree.
 * Automatically detects if the input is a HTML file path.
 * @param tree - The Nx Tree (virtual file system).
 * @param input - HTML string or file path.
 * @param tagName - The tag name to search for.
 * @returns True if the tag is found, false otherwise.
 */
export function hasHtmlTag(tree: Tree, input: string, tagName: string): boolean {
  try {
    const isHtmlFile = isFilePath(input) && input.endsWith('.html')
    const html = isHtmlFile ? tree.read(input, 'utf-8') : input

    if (!html) {
      return false
    }

    const root = parse(html)

    return root.querySelectorAll(tagName).length > 0
  } catch (error) {
    console.error(`Error checking for tag "${tagName}": `, error)
    return false
  }
}

```


File : is-file-style-sheet.utils.ts
```ts
/**
 * Determines whether a given file path points to a stylesheet file.
 * Supports `.css` and `.scss` extensions.
 *
 * @param filePath - The file path to check.
 * @returns True if the file is a stylesheet, false otherwise.
 */
export function isStyleSheet(filePath: string) {
  return filePath.endsWith('.css') || filePath.endsWith('.scss')
}

```


File : is-import-in-content.utils.ts
```ts
import { ast, query } from '@phenomnomnominal/tsquery'
import { importPattern } from '../patterns.utils'
import { ImportDeclaration } from 'typescript'
/**
 * Checks if file contains import.
 * @param fileContent - the content of the file to check
 * @param importPath - import path to look for
 * @returns {boolean} if file contains the import
 */
export function isImportInContent(fileContent: string, importPath: string) {
  const contentAst = ast(fileContent)

  const imports = query<ImportDeclaration>(contentAst, importPattern(importPath))

  return imports.length > 0
}

```


File : is-import-in-file-content.utils.ts
```ts
import { ast, query } from '@phenomnomnominal/tsquery'
import { importSpecifierPattern } from '../patterns.utils'
import { ImportDeclaration } from 'typescript'
/**
 * Checks if file contains import specifier.
 * @param fileContent - the content of the file to check
 * @param importPath - import path to look for
 * @param specifier - import specifier to look for
 * @returns {boolean} if file contains the import
 */
export function isImportSpecifierInContent(fileContent: string, importPath: string, specifier: string) {
  const contentAst = ast(fileContent)

  const imports = query<ImportDeclaration>(contentAst, importSpecifierPattern(importPath, specifier))

  return imports.length > 0
}
```


File : is-namespace-import-in-content.utils.ts
```ts
import { ast, query } from '@phenomnomnominal/tsquery'
import { importNamespacePattern } from '../patterns.utils'
import { ImportDeclaration } from 'typescript'

/**
 * Checks if file contains namespace import (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#namespace_import).
 * @param fileContent - the content of the file to check
 * @param importPath - import path to look for
 * @returns {boolean} if file contains the namespace import
 */
export function isNamespaceImportInContent(fileContent: string, importPath: string) {
  const contentAst = ast(fileContent)

  const namespaceImports = query<ImportDeclaration>(contentAst, importNamespacePattern(importPath))

  return namespaceImports.length > 0
}

```




















