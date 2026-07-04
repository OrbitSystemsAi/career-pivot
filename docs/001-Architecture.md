# OSai Frontend Architecture

## 1. Core Principle

OSai is built as a stable application shell with modular content.

The shell should remain consistent across the product. Modules supply content to the shell without changing the shell structure.

## 2. Architecture Layers

Application  
Shell  
Frames  
Panels  
Components  
Modules  

## 3. Definitions

### Application

The complete OSai web application.

### Shell

The permanent application structure.

Includes:

- Global header
- Navigation
- Workspace
- Utility panel
- Bottom workspace

### Frames

Major layout regions inside the shell.

Desktop frames:

- D1 Global Header Frame
- D2 Navigation Frame
- D3 Workspace Frame
- D4 Utility Frame
- D5 Bottom Workspace Frame

### Panels

Subregions inside frames.

Example:

- D3a Workspace Header Panel
- D3b Workspace Controls Panel
- D3c Visualization Panel

### Components

Reusable UI elements.

Examples:

- Button
- Card
- Badge
- Input
- Tabs
- Table
- Graph container

### Modules

Feature areas that provide content to panels.

Examples:

- Career Graph
- Resume Intelligence
- Opportunities
- Network
- Applications
- Analytics
- AI Coach

## 4. Desktop Shell Structure

D1 Global Header Frame

D2 Navigation Frame

D3 Workspace Frame

- D3a Workspace Header Panel
- D3b Workspace Controls Panel
- D3c Visualization Panel

D4 Utility Frame

- D4a Utility Top Panel
- D4b Utility Middle Panel
- D4c Utility Bottom Panel

D5 Bottom Workspace Frame

- D5a Bottom Left Panel
- D5b Bottom Center Panel
- D5c Bottom Right Panel

## 5. Mobile Shell Structure

M1 Mobile Header Frame

M2 Mobile Page Header Frame

M3 Mobile Workspace Frame

M4 Mobile Bottom Sheet Frame

M5 Mobile Navigation Frame

## 6. Module Rule

Modules do not own the shell.

Modules only provide content to shell panels.

## 7. Design Rule

The layout should be consistent across modules.

Users should learn the OSai interface once and reuse that mental model everywhere.

## 8. Development Rule

Build in this order:

1. Shell
2. Frames
3. Panels
4. Components
5. Modules
6. Data
7. AI
8. Automation

## 9. Module Registry Rule

The module registry is the source of truth for installed OSai modules.

The shell should not hardcode module names, descriptions, icons, metrics, views, or panel assignments.

### Registry Responsibilities

- Define installed modules
- Define module labels
- Define module descriptions
- Define module icons
- Define module metrics
- Define module views
- Define default panel assignments
- Define view-specific panel overrides

### Shell Responsibilities

- Render the permanent layout
- Read the active module
- Read the active view
- Load active module panels from the registry
- Preserve consistent frame structure across modules

### Navigation Rule

D2 Navigation is the module launcher.

D3 Workspace Controls are view controls inside the active module.

### Panel Rule

D3, D4, and D5 panels should render content from the active module and active view.

The shell owns placement.  
The module owns content.

## 10. View Override Rule

Each module has default panels.

A module may optionally define view-specific panel overrides.

Example:

Career module default:

- visualization: CareerGraph
- bottomLeft: CareerStrengths
- bottomCenter: CareerSuggestions
- bottomRight: CareerWords

Career module Market view override:

- utilityTop: CareerMarketFilters
- utilityMiddle: CareerMarketContext
- utilityBottom: CareerMarketRanking
- bottomLeft: CareerMarketDemand
- bottomCenter: CareerMarketCompanies
- bottomRight: CareerMarketActions

This lets one module support multiple experiences without changing the shell.