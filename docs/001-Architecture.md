# OSai Frontend Architecture

## 1. Core Principle

OSai is built as a stable operating shell with installable modules.

The shell controls structure.

Modules control intelligence, views, data, and experiences.

---

## 2. Architecture Layers

Application

↓  

Shell

↓  

Frames

↓  

Panels

↓  

Modules

↓  

Components

↓  

Data

↓  

AI

---

## 3. Shell Responsibility

The shell owns:

- Layout
- Placement
- Navigation regions
- Responsive structure

The shell does not know:

- Module business logic
- Module data
- Module views
- Module metrics

---

## 4. Desktop Shell Structure

### D1 Global Header

Responsibilities:

- Brand
- Active module identity
- Global actions

---

### D2 Navigation

Responsibilities:

- Module launcher

Examples:

- Resume
- Career
- Network

---

### D3 Workspace

Primary interaction area.

Contains:

- Workspace metrics
- View controls
- Visualization

Panels:

- D3 Header Panel
- D3 Controls Panel
- D3 Visualization Panel

---

### D4 Utility Frame

Context intelligence area.

Panels:

- Utility Top
- Utility Middle
- Utility Bottom

Examples:

- Filters
- Context
- Results

---

### D5 Bottom Workspace

Insight layer.

Panels:

- Bottom Left
- Bottom Center
- Bottom Right

Examples:

- Strengths
- Opportunities
- Actions

---

# 5. Module Architecture

Modules live in:

```text
modules/