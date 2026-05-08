# C- Language Parser (project README)
Source: /Users/yahya/Documents/Interpreter/compiler-design-cm-interpreter/docs/README.md

# C- Language Parser

A recursive descent parser for the C- programming language with left recursion removal and left factoring applied to the grammar.

## Project Structure

```
.
├── grammar_normal.ebnf        # Original grammar with left recursion
├── grammar_enhanced.ebnf      # Enhanced grammar (left recursion removed, left factored)
├── lexer_parser.l             # Flex lexer specification for parser integration
├── token.h                    # Token type definitions
├── ParseTree.h                # Parse tree node structures
├── Parser.h                   # Parser class declaration
├── Parser.cpp                 # Parser implementation (recursive descent)
├── main.cpp                   # Main program
├── Makefile                   # Build configuration
├── shell.nix                  # NixOS development environment
└── tests/test_parser.c        # Sample test program
```

## Grammar Transformations

The enhanced grammar (`grammar_enhanced.ebnf`) has been transformed from the original grammar with:

Left Recursion Removed:
- declaration-list -> declaration-list'
- param-list -> param-list'
- statement-list -> statement-list'
- expression -> expression'
- additive-expression -> additive-expression'
- term -> term'

Left Factoring Applied:
- var-declaration -> var-declaration'
- param -> param'
- selection-stmt -> selection-stmt'
- var -> var'

## Build & Test

NixOS:
```bash
nix-shell
make
make test
```

Ubuntu/Debian:
```bash
sudo apt-get install build-essential flex graphviz
make
make test
```

## Usage

```bash
./parser <input_file> [output_dot_file]
./parser tests/test_parser.c parse_tree.dot
dot -Tpng parse_tree.dot -o parse_tree.png   # or `make test-png`
```

## Input File Format

Programs must follow the C- grammar syntax:

```c
Program ProgramName {
    int x;
    int arr[10];
    float y;
    x = 5;
    if (x < 10) { x = x + 1; }
    while (x < 100) { x = x * 2; }
}.
```

Programs must start with `Program` keyword followed by an identifier and end with `}.` (closing brace and dot). Only variable declarations are supported (no function declarations in this grammar).

## Implementation Details

- Type: Recursive Descent Parser
- Parsing Method: Top-down, LL(1)-style
- Grammar: Enhanced grammar with no left recursion
- Error Recovery: First-error reporting (stops at first syntax error)
- Parse Tree Format: Graphviz DOT format. Non-terminals are rule names; terminals are token type + lexeme; epsilon productions marked as "ε".

## Supported Language Features

- Data Types: `int`, `float`
- Variables: Simple variables and arrays
- Operators: Arithmetic (+, -, *, /), Relational (<, <=, >, >=, ==, !=), Assignment (=)
- Control Flow: `if` (with optional `else`), `while`
- Expressions: Arithmetic and relational expressions with proper precedence
- Arrays: Array declarations and indexed access

## Assignment Compliance (Assignment 2)

- Grammar with left recursion removed
- Left factoring applied to eliminate common prefixes
- Recursive descent parser implementation
- Parse tree generation
- Graphviz output for visualization
- Error reporting with line/column information
- Integration with existing lexer
